<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { createRng, randomSeed } from './engine/rng.js';
import { createCharacter, drawTalents } from './engine/character.js';
import { advanceTick } from './engine/simulation.js';
import { summarize } from './engine/rating.js';
import { TALENT_POOL, EVENT_POOL } from './data/index.js';
import SetupPanel from './components/SetupPanel.vue';
import TalentPick from './components/TalentPick.vue';
import LifeLog from './components/LifeLog.vue';
import SummaryCard from './components/SummaryCard.vue';

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

let rng = null;
let allocation = null;
let timer = null;
let tickCount = 0;

function handleAllocation(alloc) {
  allocation = alloc;
  seed.value = randomSeed();
  rng = createRng(seed.value);
  talentOptions.value = drawTalents(TALENT_POOL, TALENT_OPTIONS_COUNT, rng);
  phase.value = 'talent';
}

function handleTalents(chosen) {
  state.value = createCharacter(allocation, chosen);
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
}

function finishLife() {
  stopTimer();
  summary.value = summarize(state.value);
  setTimeout(() => {
    phase.value = 'summary';
  }, SUMMARY_DELAY_MS);
}

function toggleSpeed() {
  speed.value = speed.value === 'slow' ? 'fast' : 'slow';
  if (timer) {
    startTimer();
  }
}

function skipToEnd() {
  stopTimer();
  while (state.value.alive && !state.value.ascended && tickCount < MAX_TICKS) {
    step();
  }
  finishLife();
}

function restart() {
  stopTimer();
  phase.value = 'setup';
  state.value = null;
  logs.value = [];
  summary.value = null;
  rng = null;
  allocation = null;
}

onBeforeUnmount(stopTimer);
</script>

<template>
  <header class="masthead">
    <h1>问道</h1>
    <p class="subtitle">修仙人生模拟器 · 一念入道，百年浮生</p>
  </header>

  <main class="stage">
    <SetupPanel v-if="phase === 'setup'" @confirm="handleAllocation" />
    <TalentPick v-else-if="phase === 'talent'" :options="talentOptions" @confirm="handleTalents" />
    <LifeLog
      v-else-if="phase === 'living'"
      :state="state"
      :logs="logs"
      :speed="speed"
      @toggle-speed="toggleSpeed"
      @skip="skipToEnd"
    />
    <SummaryCard v-else :summary="summary" :seed="seed" @restart="restart" />
  </main>
</template>

<style scoped>
.masthead {
  text-align: center;
  padding: var(--space-2) 0 var(--space-1);
  border-bottom: 2px solid var(--ink);
  margin-bottom: var(--space-2);
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
