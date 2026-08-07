<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import { createRng, randomSeed } from './engine/rng.js';
import { createCharacter, drawTalents } from './engine/character.js';
import { advanceTick, resolveChoice } from './engine/simulation.js';
import { summarize } from './engine/rating.js';
import { TALENT_POOL, EVENT_POOL, ORIGIN_POOL } from './data/index.js';
import { assignOrigin } from './engine/origins.js';
import SetupPanel from './components/SetupPanel.vue';
import TalentPick from './components/TalentPick.vue';
import LifeLog from './components/LifeLog.vue';
import SummaryCard from './components/SummaryCard.vue';
import RecordsPanel from './components/RecordsPanel.vue';
import { buildRecord, addRecord } from './engine/records.js';
import {
  applyBoons,
  boonsCost,
  fruitsEarned,
  EXTRA_TALENT_BOON,
  EXTRA_TALENT_COUNT,
} from './engine/daofruit.js';
import {
  loadRecords,
  saveRecords,
  clearRecords,
  loadFruits,
  saveFruits,
} from './lib/recordsStore.js';
import bgmUrl from './assets/bgm.mp3';
import sfxChoiceUrl from './assets/sfx-choice.mp3';
import sfxBreakUrl from './assets/sfx-break.mp3';
import sfxDeathUrl from './assets/sfx-death.mp3';
import sfxAscendUrl from './assets/sfx-ascend.mp3';

const TALENT_OPTIONS_COUNT = 10;
const TICK_INTERVAL_MS = { slow: 700, fast: 220 };
const MAX_TICKS = 500;
const SUMMARY_DELAY_MS = 1600;

const phase = ref('setup');
const seed = ref(0);
const talentOptions = ref([]);
const state = ref(null);
const logs = ref([]);
const speed = ref('slow');
const summary = ref(null);
const pending = ref(null);
const records = ref(loadRecords());
const fruits = ref(loadFruits());
const earnedFruits = ref(0);

function handleClearRecords() {
  if (window.confirm('确定清空全部战绩？此操作不可恢复。')) {
    records.value = [];
    clearRecords();
  }
}

const pendingOptions = computed(() => {
  if (!pending.value) return [];
  if (pending.value.kind === 'breakthrough') {
    const pct = Math.round(pending.value.chance * 100);
    return [
      pending.value.isFinal ? `问鼎天劫（成功率约 ${pct}%，败则身死道消）` : `逆天冲关（成功率约 ${pct}%）`,
      '稳固道基，来日再战',
    ];
  }
  return pending.value.event.options.map((option) => option.text);
});

let rng = null;
let allocation = null;
let timer = null;
let summaryTimer = null;
let tickCount = 0;

const isMusicOn = ref(true);
let bgm = null;

const SFX_URLS = {
  choice: sfxChoiceUrl,
  breakthrough: sfxBreakUrl,
  death: sfxDeathUrl,
  ascend: sfxAscendUrl,
};
const sfxPlayers = {};

function playSfx(name) {
  if (!isMusicOn.value || !SFX_URLS[name]) return;
  if (!sfxPlayers[name]) {
    sfxPlayers[name] = new Audio(SFX_URLS[name]);
    sfxPlayers[name].volume = 0.7;
  }
  sfxPlayers[name].currentTime = 0;
  sfxPlayers[name].play().catch(() => {});
}

/** 根据结算出的日志音调触发对应音效 */
function playSfxForLogs(entries) {
  const tones = new Set(entries.map((e) => e.tone));
  if (tones.has('ascend')) playSfx('ascend');
  else if (tones.has('death')) playSfx('death');
  else if (tones.has('breakthrough')) playSfx('breakthrough');
}

function ensureBgm() {
  if (!bgm) {
    bgm = new Audio(bgmUrl);
    bgm.loop = true;
    bgm.volume = 0.45;
  }
  if (isMusicOn.value) {
    // 浏览器要求用户交互后才允许出声，播放失败静默忽略
    bgm.play().catch(() => {});
  }
}

function toggleMusic() {
  isMusicOn.value = !isMusicOn.value;
  if (isMusicOn.value) {
    ensureBgm();
  } else if (bgm) {
    bgm.pause();
  }
}

let difficulty = null;
let boonIds = [];

function handleAllocation(payload) {
  ensureBgm();
  allocation = payload.alloc;
  difficulty = payload.difficulty;
  boonIds = payload.boonIds;
  // 道果在投胎时消费，落子无悔
  fruits.value -= boonsCost(boonIds);
  saveFruits(fruits.value);
  seed.value = randomSeed();
  rng = createRng(seed.value);
  const talentCount = boonIds.includes(EXTRA_TALENT_BOON) ? EXTRA_TALENT_COUNT : TALENT_OPTIONS_COUNT;
  talentOptions.value = drawTalents(TALENT_POOL, talentCount, rng);
  phase.value = 'talent';
}

function handleTalents(chosen) {
  state.value = applyBoons(
    assignOrigin(createCharacter(allocation, chosen, difficulty), ORIGIN_POOL, rng),
    boonIds,
  );
  logs.value = [];
  tickCount = 0;
  phase.value = 'living';
  startTimer();
}

function startTimer() {
  stopTimer();
  timer = setInterval(step, TICK_INTERVAL_MS[speed.value]);
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function step() {
  if (!state.value.alive || state.value.ascended || tickCount >= MAX_TICKS) {
    finishLife();
    return;
  }
  tickCount += 1;
  const result = advanceTick(state.value, EVENT_POOL, rng);
  state.value = result.state;
  logs.value = [...logs.value, ...result.logs];
  playSfxForLogs(result.logs);
  if (result.pending) {
    // 遇到抉择点：停下光阴，等玩家做决定
    stopTimer();
    pending.value = result.pending;
  } else if (!result.state.alive) {
    finishLife();
  }
}

function choose(index) {
  if (!pending.value) return;
  playSfx('choice');
  const result = resolveChoice(state.value, pending.value, index, rng);
  pending.value = null;
  state.value = result.state;
  logs.value = [...logs.value, ...result.logs];
  playSfxForLogs(result.logs);
  if (!result.state.alive || result.state.ascended) {
    finishLife();
    return;
  }
  startTimer();
}

function finishLife() {
  // 幂等保护：死亡后 skip 按钮仍可点，避免重复结算和游走的定时器
  if (summaryTimer || phase.value === 'summary') {
    return;
  }
  stopTimer();
  summary.value = summarize(state.value);
  records.value = addRecord(records.value, buildRecord(summary.value, seed.value, Date.now()));
  saveRecords(records.value);
  earnedFruits.value = fruitsEarned(summary.value.score);
  fruits.value += earnedFruits.value;
  saveFruits(fruits.value);
  summaryTimer = setTimeout(() => {
    summaryTimer = null;
    phase.value = 'summary';
  }, SUMMARY_DELAY_MS);
}

function clearSummaryTimer() {
  if (summaryTimer) {
    clearTimeout(summaryTimer);
    summaryTimer = null;
  }
}

function toggleSpeed() {
  speed.value = speed.value === 'slow' ? 'fast' : 'slow';
  if (timer) {
    startTimer();
  }
}

function restart() {
  stopTimer();
  clearSummaryTimer();
  phase.value = 'setup';
  state.value = null;
  logs.value = [];
  summary.value = null;
  pending.value = null;
  rng = null;
  allocation = null;
}

onBeforeUnmount(() => {
  stopTimer();
  clearSummaryTimer();
  if (bgm) {
    bgm.pause();
  }
});
</script>

<template>
  <header class="masthead">
    <h1>问道</h1>
    <p class="subtitle">修仙人生模拟器 · 一念入道，百年浮生</p>
    <button class="music-toggle" @click="toggleMusic">{{ isMusicOn ? '♪ 乐' : '♪ 静' }}</button>
  </header>

  <main class="stage">
    <SetupPanel
      v-if="phase === 'setup'"
      :fruits="fruits"
      @confirm="handleAllocation"
      @records="phase = 'records'"
    />
    <RecordsPanel
      v-else-if="phase === 'records'"
      :records="records"
      @back="phase = 'setup'"
      @clear="handleClearRecords"
    />
    <TalentPick v-else-if="phase === 'talent'" :options="talentOptions" @confirm="handleTalents" />
    <LifeLog
      v-else-if="phase === 'living'"
      :state="state"
      :logs="logs"
      :speed="speed"
      :pending-options="pendingOptions"
      @toggle-speed="toggleSpeed"
      @choose="choose"
    />
    <SummaryCard
      v-else
      :summary="summary"
      :seed="seed"
      :logs="logs"
      :earned-fruits="earnedFruits"
      :fruits-total="fruits"
      @restart="restart"
    />
  </main>
</template>

<style scoped>
.masthead {
  position: relative;
  text-align: center;
  padding: var(--space-2) 0 var(--space-1);
  border-bottom: 2px solid var(--ink);
  margin-bottom: var(--space-2);
}

.music-toggle {
  position: absolute;
  top: var(--space-2);
  right: 0;
  font-size: 0.8rem;
  padding: 0.2em 0.7em;
  color: var(--ink-soft);
  border-color: var(--line);
}

.masthead h1 {
  margin: 0;
  font-size: 2.4rem;
  letter-spacing: 0.6em;
  text-indent: 0.6em;
  font-weight: 600;
}

.subtitle {
  margin: 0.2em 0 0;
  color: var(--ink-soft);
  font-size: 0.85rem;
  letter-spacing: 0.15em;
}

.stage {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
