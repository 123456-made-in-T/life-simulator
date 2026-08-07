// 页面层：对应网页版 App.vue 的职责，引擎与数据全部复用（由 sync:wx 同步）

import { createRng, randomSeed } from '../../engine/rng.js';
import {
  ATTR_MAX,
  ATTR_MIN,
  ALLOC_KEYS,
  ATTR_LABELS,
  randomAllocation,
  createCharacter,
  drawTalents,
} from '../../engine/character.js';
import { DIFFICULTIES, DEFAULT_DIFFICULTY } from '../../engine/difficulty.js';
import { buildRecord, addRecord, computeCareer } from '../../engine/records.js';
import { assignOrigin } from '../../engine/origins.js';
import {
  BOONS,
  boonsCost,
  fruitsEarned,
  applyBoons,
  EXTRA_POINTS_BOON,
  EXTRA_POINTS_AMOUNT,
  EXTRA_TALENT_BOON,
  EXTRA_TALENT_COUNT,
} from '../../engine/daofruit.js';
import { drawShareCard, pickHighlights, CARD_WIDTH, CARD_HEIGHT } from '../../engine/shareCard.js';
import {
  loadRecords,
  saveRecords,
  clearRecords,
  loadFruits,
  saveFruits,
  loadUnlockedAchievements,
  saveUnlockedAchievements,
} from '../../lib/recordsStore.js';
import { advanceTick, resolveChoice } from '../../engine/simulation.js';
import { summarize } from '../../engine/rating.js';
import { REALMS, CULTIVATION_CAP } from '../../engine/realms.js';
import { TALENT_POOL, EVENT_POOL, ORIGIN_POOL, ACHIEVEMENT_INDEX } from '../../data/index.js';

const TALENT_OPTIONS_COUNT = 10;
const PICK_COUNT = 3;
const TICK_INTERVAL_MS = { slow: 700, fast: 220 };
const MAX_TICKS = 500;
const SUMMARY_DELAY_MS = 1600;

// WXSS 不支持中文类名选择器，评级到样式类名的映射
const GRADE_CLASS = { 仙: 'immortal', S: 's', A: 'a', B: 'b', C: 'c', D: 'd' };

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
    difficulties: DIFFICULTIES,
    difficultyId: DEFAULT_DIFFICULTY.id,
    difficultyDesc: DEFAULT_DIFFICULTY.desc,
    pointTotal: DEFAULT_DIFFICULTY.points,
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
    pendingOptions: [],
    musicOn: true,
    showRecord: false,
    records: [],
    career: { total: 0, bestScore: 0, ascensions: 0, maxAge: 0 },
    fruits: 0,
    remainingFruits: 0,
    boons: BOONS,
    boonSelected: {},
    achRows: [],
    achUnlocked: 0,
    achTotal: ACHIEVEMENT_INDEX.length,
    showAchIndex: false,
  },

  onLoad() {
    this.difficulty = DEFAULT_DIFFICULTY;
    this.records = loadRecords();
    this.unlocked = loadUnlockedAchievements();
    this.boonIds = [];
    const fruits = loadFruits();
    this.setData({ fruits, remainingFruits: fruits });
    this.updateRemaining();
    this.bgm = wx.createInnerAudioContext();
    this.bgm.src = '/assets/bgm.mp3';
    this.bgm.loop = true;
    this.bgm.volume = 0.45;
    // 不受 iOS 静音键影响（游戏 BGM 的惯例）
    this.bgm.obeyMuteSwitch = false;

    this.sfx = {};
    for (const name of ['choice', 'break', 'death', 'ascend']) {
      const ctx = wx.createInnerAudioContext();
      ctx.src = `/assets/sfx-${name}.mp3`;
      ctx.volume = 0.7;
      ctx.obeyMuteSwitch = false;
      this.sfx[name] = ctx;
    }
  },

  playSfx(name) {
    if (!this.data.musicOn || !this.sfx[name]) return;
    this.sfx[name].stop();
    this.sfx[name].play();
  },

  /** 根据结算日志的音调触发对应音效 */
  playSfxForLogs(logs) {
    const tones = logs.map((log) => log.tone);
    if (tones.includes('ascend')) this.playSfx('ascend');
    else if (tones.includes('death')) this.playSfx('death');
    else if (tones.includes('breakthrough')) this.playSfx('break');
  },

  currentBonusPoints() {
    return this.data.boonSelected[EXTRA_POINTS_BOON] ? EXTRA_POINTS_AMOUNT : 0;
  },

  onSelectDifficulty(e) {
    const mode = DIFFICULTIES.find((d) => d.id === e.currentTarget.dataset.id);
    if (!mode) return;
    this.difficulty = mode;
    this.setData(
      {
        difficultyId: mode.id,
        difficultyDesc: mode.desc,
        pointTotal: mode.points + this.currentBonusPoints(),
      },
      () => this.updateRemaining(),
    );
  },

  onToggleBoon(e) {
    const { id } = e.currentTarget.dataset;
    const boon = BOONS.find((b) => b.id === id);
    if (!boon) return;
    const selected = { ...this.data.boonSelected };
    if (selected[id]) {
      delete selected[id];
    } else if (boon.cost <= this.data.remainingFruits) {
      selected[id] = true;
    } else {
      return;
    }
    const cost = boonsCost(Object.keys(selected));
    this.setData(
      {
        boonSelected: selected,
        remainingFruits: this.data.fruits - cost,
        pointTotal:
          this.difficulty.points + (selected[EXTRA_POINTS_BOON] ? EXTRA_POINTS_AMOUNT : 0),
      },
      () => this.updateRemaining(),
    );
  },

  onShow() {
    if (this.data.musicOn && this.bgmStarted) {
      this.bgm.play();
    }
  },

  onHide() {
    if (this.bgm) {
      this.bgm.pause();
    }
  },

  onUnload() {
    this.stopTimer();
    this.clearSummaryTimer();
    if (this.bgm) {
      this.bgm.destroy();
    }
    if (this.sfx) {
      Object.values(this.sfx).forEach((ctx) => ctx.destroy());
    }
  },

  playBgm() {
    if (this.data.musicOn) {
      this.bgmStarted = true;
      this.bgm.play();
    }
  },

  onToggleMusic() {
    const musicOn = !this.data.musicOn;
    this.setData({ musicOn });
    if (musicOn) {
      this.playBgm();
    } else {
      this.bgm.pause();
    }
  },

  // ---------- 资质分配 ----------

  updateRemaining() {
    const used = ALLOC_KEYS.reduce((sum, key) => sum + this.data.alloc[key], 0);
    this.setData({ remaining: this.data.pointTotal - used });
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
    this.setData(
      { alloc: randomAllocation(Math.random, this.data.pointTotal) },
      () => this.updateRemaining(),
    );
  },

  onConfirmAlloc() {
    if (this.data.remaining !== 0) return;
    this.playBgm();
    this.allocation = { ...this.data.alloc };
    // 道果在投胎时消费，落子无悔
    this.boonIds = Object.keys(this.data.boonSelected);
    const fruits = this.data.fruits - boonsCost(this.boonIds);
    saveFruits(fruits);
    const seed = randomSeed();
    this.rng = createRng(seed);
    const talentCount = this.boonIds.includes(EXTRA_TALENT_BOON)
      ? EXTRA_TALENT_COUNT
      : TALENT_OPTIONS_COUNT;
    this.setData({
      seed,
      fruits,
      phase: 'talent',
      talentOptions: drawTalents(TALENT_POOL, talentCount, this.rng),
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
    this.state = applyBoons(
      assignOrigin(createCharacter(this.allocation, chosen, this.difficulty), ORIGIN_POOL, this.rng),
      this.boonIds,
    );
    this.tickCount = 0;
    this.setData({ phase: 'living', logs: [], lastLogId: '', view: this.buildView() });
    this.startTimer();
  },

  // ---------- 人生推进 ----------

  buildView() {
    const s = this.state;
    return {
      realmName: REALMS[s.realmIndex].name,
      originName: s.origin ? s.origin.name : '',
      artifactName: s.artifact ? s.artifact.name : '',
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
    this.tickCount += 1;
    const result = advanceTick(this.state, EVENT_POOL, this.rng);
    this.state = result.state;
    this.renderLogs(result.logs);
    this.playSfxForLogs(result.logs);
    if (result.pending) {
      // 遇到抉择点：停下光阴，等玩家做决定
      this.stopTimer();
      this.pending = result.pending;
      this.setData({ pendingOptions: this.buildPendingOptions(result.pending) });
    } else if (!result.state.alive) {
      this.finishLife();
    }
  },

  buildPendingOptions(pending) {
    if (pending.kind === 'breakthrough') {
      const pct = Math.round(pending.chance * 100);
      return [
        pending.isFinal ? `问鼎天劫（成功率约 ${pct}%，败则身死道消）` : `逆天冲关（成功率约 ${pct}%）`,
        '稳固道基，来日再战',
      ];
    }
    return pending.event.options.map((option) => option.text);
  },

  onChoose(e) {
    if (!this.pending) return;
    this.playSfx('choice');
    const index = Number(e.currentTarget.dataset.index);
    const result = resolveChoice(this.state, this.pending, index, this.rng);
    this.pending = null;
    this.state = result.state;
    this.setData({ pendingOptions: [] });
    this.renderLogs(result.logs);
    this.playSfxForLogs(result.logs);
    if (!result.state.alive || result.state.ascended) {
      this.finishLife();
      return;
    }
    this.startTimer();
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
    const summary = summarize(this.state);
    const earned = fruitsEarned(summary.score);
    const fruitsTotal = this.data.fruits + earned;
    saveFruits(fruitsTotal);
    this.setData({ fruits: fruitsTotal, remainingFruits: fruitsTotal });
    this.pendingSummary = {
      ...summary,
      gradeClass: GRADE_CLASS[summary.grade] || 'd',
      earnedFruits: earned,
      fruitsTotal,
    };
    this.records = addRecord(this.records, buildRecord(summary, this.data.seed, Date.now()));
    saveRecords(this.records);
    const merged = [...new Set([...this.unlocked, ...summary.achievements])];
    if (merged.length > this.unlocked.length) {
      this.unlocked = merged;
      saveUnlockedAchievements(merged);
    }
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

  onToggleRecord() {
    this.setData({ showRecord: !this.data.showRecord });
  },

  onSaveShareCard() {
    wx.createSelectorQuery()
      .select('#shareCanvas')
      .fields({ node: true })
      .exec((res) => {
        const canvas = res?.[0]?.node;
        if (!canvas) {
          wx.showToast({ title: '生成失败，请重试', icon: 'none' });
          return;
        }
        canvas.width = CARD_WIDTH;
        canvas.height = CARD_HEIGHT;
        drawShareCard(canvas.getContext('2d'), {
          summary: this.pendingSummary,
          seed: this.data.seed,
          highlights: pickHighlights(this.data.logs),
        });
        wx.canvasToTempFilePath({
          canvas,
          success: ({ tempFilePath }) => this.saveImageToAlbum(tempFilePath),
          fail: () => wx.showToast({ title: '生成图片失败', icon: 'none' }),
        });
      });
  },

  saveImageToAlbum(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => wx.showToast({ title: '已保存到相册' }),
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('auth')) {
          wx.showModal({
            title: '需要相册权限',
            content: '请在设置中允许保存到相册后重试',
            success: (res) => {
              if (res.confirm) wx.openSetting();
            },
          });
        } else {
          wx.showToast({ title: '保存失败', icon: 'none' });
        }
      },
    });
  },

  onShowRecords() {
    const unlockedSet = new Set(this.unlocked);
    const achRows = ACHIEVEMENT_INDEX.map((a) => ({
      name: unlockedSet.has(a.name) ? a.name : '？？？',
      hint: a.hint,
      done: unlockedSet.has(a.name),
    }));
    this.setData({
      phase: 'records',
      records: this.records,
      career: computeCareer(this.records),
      achRows,
      achUnlocked: achRows.filter((r) => r.done).length,
      showAchIndex: false,
    });
  },

  onToggleAchIndex() {
    this.setData({ showAchIndex: !this.data.showAchIndex });
  },

  onBackFromRecords() {
    this.setData({ phase: 'setup' });
  },

  onClearRecords() {
    wx.showModal({
      title: '清空战绩',
      content: '确定清空全部战绩？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          this.records = [];
          clearRecords();
          this.setData({ records: [], career: computeCareer([]) });
        }
      },
    });
  },

  onRestart() {
    this.stopTimer();
    this.clearSummaryTimer();
    this.state = null;
    this.rng = null;
    this.allocation = null;
    this.tickCount = 0;
    this.pendingSummary = null;
    this.pending = null;
    this.setData({
      phase: 'setup',
      logs: [],
      lastLogId: '',
      summary: null,
      view: null,
      pendingOptions: [],
      showRecord: false,
    });
    this.updateRemaining();
  },
});
