// 页面层：对应网页版 App.vue 的职责，引擎与数据全部复用（由 sync:wx 同步）

import { createRng, randomSeed } from '../../engine/rng.js';
import {
  POINT_TOTAL,
  ATTR_MAX,
  ATTR_MIN,
  ALLOC_KEYS,
  ATTR_LABELS,
  randomAllocation,
  createCharacter,
  drawTalents,
} from '../../engine/character.js';
import { advanceTick } from '../../engine/simulation.js';
import { summarize } from '../../engine/rating.js';
import { REALMS, CULTIVATION_CAP } from '../../engine/realms.js';
import { TALENT_POOL, EVENT_POOL } from '../../data/index.js';

const TALENT_OPTIONS_COUNT = 10;
const PICK_COUNT = 3;
const TICK_INTERVAL_MS = { slow: 700, fast: 220 };
const MAX_TICKS = 500;
const SUMMARY_DELAY_MS = 1600;
const SKIP_LOG_LIMIT = 2000;

const ATTR_HINTS = {
  linggen: '修炼速度与突破之资',
  wuxing: '悟道参法之能',
  tipo: '生死关头的本钱，0 点恐早夭',
  jiashi: '出身背景与财力',
};
const RARITY_LABELS = { 1: '凡品', 2: '灵品', 3: '仙品' };

Page({
  data: {
    phase: 'setup',
    allocKeys: ALLOC_KEYS,
    attrLabels: ATTR_LABELS,
    attrHints: ATTR_HINTS,
    rarityLabels: RARITY_LABELS,
    pointTotal: POINT_TOTAL,
    pickCount: PICK_COUNT,
    alloc: { linggen: 5, wuxing: 5, tipo: 5, jiashi: 5 },
    remaining: 0,
    talentOptions: [],
    selectedMap: {},
    selectedCount: 0,
    view: null,
    logs: [],
    lastLogId: '',
    speed: 'slow',
    summary: null,
    seed: 0,
  },

  onLoad() {
    this.updateRemaining();
  },

  onUnload() {
    this.stopTimer();
    this.clearSummaryTimer();
  },

  // ---------- 资质分配 ----------

  updateRemaining() {
    const used = ALLOC_KEYS.reduce((sum, key) => sum + this.data.alloc[key], 0);
    this.setData({ remaining: POINT_TOTAL - used });
  },

  onAdjust(e) {
    const { key, delta } = e.currentTarget.dataset;
    const step = Number(delta);
    const next = this.data.alloc[key] + step;
    if (next < ATTR_MIN || next > ATTR_MAX) return;
    if (step > 0 && this.data.remaining <= 0) return;
    this.setData({ [`alloc.${key}`]: next }, () => this.updateRemaining());
  },

  onRandomize() {
    this.setData({ alloc: randomAllocation(Math.random) }, () => this.updateRemaining());
  },

  onConfirmAlloc() {
    if (this.data.remaining !== 0) return;
    this.allocation = { ...this.data.alloc };
    const seed = randomSeed();
    this.rng = createRng(seed);
    this.setData({
      seed,
      phase: 'talent',
      talentOptions: drawTalents(TALENT_POOL, TALENT_OPTIONS_COUNT, this.rng),
      selectedMap: {},
      selectedCount: 0,
    });
  },

  // ---------- 命格抽取 ----------

  onToggleTalent(e) {
    const { id } = e.currentTarget.dataset;
    const map = { ...this.data.selectedMap };
    if (map[id]) {
      delete map[id];
    } else if (this.data.selectedCount >= PICK_COUNT) {
      return;
    } else {
      map[id] = true;
    }
    this.setData({ selectedMap: map, selectedCount: Object.keys(map).length });
  },

  onConfirmTalents() {
    if (this.data.selectedCount !== PICK_COUNT) return;
    const chosen = this.data.talentOptions.filter((t) => this.data.selectedMap[t.id]);
    this.state = createCharacter(this.allocation, chosen);
    this.tickCount = 0;
    this.setData({ phase: 'living', logs: [], lastLogId: '', view: this.buildView() });
    this.startTimer();
  },

  // ---------- 人生推进 ----------

  buildView() {
    const s = this.state;
    return {
      realmName: REALMS[s.realmIndex].name,
      age: s.age,
      lifespan: s.lifespan,
      cultPercent: Math.min(100, Math.round((s.cultivation / CULTIVATION_CAP) * 100)),
      attrs: Object.keys(ATTR_LABELS).map((key) => ({
        label: ATTR_LABELS[key],
        value: s.attrs[key],
      })),
    };
  },

  isFinished() {
    return !this.state.alive || this.state.ascended || this.tickCount >= MAX_TICKS;
  },

  /** 纯推进一回合，返回新增日志（不触发渲染） */
  advanceOnce() {
    this.tickCount += 1;
    const result = advanceTick(this.state, EVENT_POOL, this.rng);
    this.state = result.state;
    return result.logs;
  },

  renderLogs(newLogs) {
    const logs = this.data.logs.concat(newLogs);
    this.setData({
      logs,
      lastLogId: logs.length > 0 ? `log-${logs.length - 1}` : '',
      view: this.buildView(),
    });
  },

  step() {
    if (this.isFinished()) {
      this.finishLife();
      return;
    }
    this.renderLogs(this.advanceOnce());
  },

  startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => this.step(), TICK_INTERVAL_MS[this.data.speed]);
  },

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  clearSummaryTimer() {
    if (this.summaryTimer) {
      clearTimeout(this.summaryTimer);
      this.summaryTimer = null;
    }
  },

  finishLife() {
    // 幂等保护：结算等待期内的重复触发一律忽略
    if (this.summaryTimer || this.data.phase === 'summary') return;
    this.stopTimer();
    this.pendingSummary = summarize(this.state);
    this.summaryTimer = setTimeout(() => {
      this.summaryTimer = null;
      this.setData({ phase: 'summary', summary: this.pendingSummary });
    }, SUMMARY_DELAY_MS);
  },

  onToggleSpeed() {
    const speed = this.data.speed === 'slow' ? 'fast' : 'slow';
    this.setData({ speed });
    if (this.timer) {
      this.startTimer();
    }
  },

  onSkip() {
    // 结算等待期内再点：直接进结算页
    if (this.summaryTimer) {
      this.clearSummaryTimer();
      this.setData({ phase: 'summary', summary: this.pendingSummary });
      return;
    }
    this.stopTimer();
    const collected = [];
    while (!this.isFinished() && collected.length < SKIP_LOG_LIMIT) {
      collected.push(...this.advanceOnce());
    }
    this.renderLogs(collected);
    this.finishLife();
  },

  onRestart() {
    this.stopTimer();
    this.clearSummaryTimer();
    this.state = null;
    this.rng = null;
    this.allocation = null;
    this.tickCount = 0;
    this.pendingSummary = null;
    this.setData({ phase: 'setup', logs: [], lastLogId: '', summary: null, view: null });
    this.updateRemaining();
  },
});
