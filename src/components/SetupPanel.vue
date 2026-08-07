<script setup>
import { reactive, computed, ref } from 'vue';
import {
  ATTR_MAX,
  ATTR_MIN,
  ALLOC_KEYS,
  ATTR_LABELS,
  randomAllocation,
} from '../engine/character.js';
import { DIFFICULTIES, DEFAULT_DIFFICULTY } from '../engine/difficulty.js';
import { BOONS, boonsCost, EXTRA_POINTS_BOON, EXTRA_POINTS_AMOUNT } from '../engine/daofruit.js';

const props = defineProps({
  fruits: { type: Number, default: 0 },
});
const emit = defineEmits(['confirm', 'records']);

const ATTR_HINTS = {
  linggen: '修炼速度与突破之资',
  wuxing: '悟道参法之能',
  tipo: '生死关头的本钱，0 点恐早夭',
  jiashi: '出身背景与财力',
};

const difficulty = ref(DEFAULT_DIFFICULTY);
const alloc = reactive({ linggen: 5, wuxing: 5, tipo: 5, jiashi: 5 });
const selectedBoons = ref([]);

const spentFruits = computed(() => boonsCost(selectedBoons.value));
const remainingFruits = computed(() => props.fruits - spentFruits.value);

const pointTotal = computed(
  () =>
    difficulty.value.points +
    (selectedBoons.value.includes(EXTRA_POINTS_BOON) ? EXTRA_POINTS_AMOUNT : 0),
);
const remaining = computed(
  () => pointTotal.value - ALLOC_KEYS.reduce((sum, key) => sum + alloc[key], 0),
);

function selectDifficulty(mode) {
  difficulty.value = mode;
}

function toggleBoon(boon) {
  if (selectedBoons.value.includes(boon.id)) {
    selectedBoons.value = selectedBoons.value.filter((id) => id !== boon.id);
    return;
  }
  if (boon.cost <= remainingFruits.value) {
    selectedBoons.value = [...selectedBoons.value, boon.id];
  }
}

function adjust(key, delta) {
  const next = alloc[key] + delta;
  if (next < ATTR_MIN || next > ATTR_MAX) return;
  if (delta > 0 && remaining.value <= 0) return;
  alloc[key] = next;
}

function randomize() {
  Object.assign(alloc, randomAllocation(Math.random, pointTotal.value));
}

function confirm() {
  if (remaining.value === 0) {
    emit('confirm', {
      alloc: { ...alloc },
      difficulty: difficulty.value,
      boonIds: [...selectedBoons.value],
    });
  }
}
</script>

<template>
  <section class="panel">
    <h2>投胎 · 分配资质</h2>

    <div class="modes">
      <button
        v-for="mode in DIFFICULTIES"
        :key="mode.id"
        class="mode"
        :class="{ active: difficulty.id === mode.id }"
        :title="mode.desc"
        @click="selectDifficulty(mode)"
      >
        {{ mode.name }}
      </button>
    </div>
    <p class="mode-desc">{{ difficulty.desc }}</p>

    <div v-if="fruits > 0" class="boons">
      <p class="boons-title">
        道果 ×{{ remainingFruits }}<span class="boons-hint">（历世参悟所得，可购临世机缘）</span>
      </p>
      <div class="boon-list">
        <button
          v-for="boon in BOONS"
          :key="boon.id"
          class="boon"
          :class="{ active: selectedBoons.includes(boon.id) }"
          :disabled="!selectedBoons.includes(boon.id) && boon.cost > remainingFruits"
          :title="boon.desc"
          @click="toggleBoon(boon)"
        >
          {{ boon.name }} <span class="boon-cost">×{{ boon.cost }}</span>
        </button>
      </div>
    </div>

    <p class="hint">
      剩余点数：<strong :class="{ warn: remaining !== 0 }">{{ remaining }}</strong> / {{ pointTotal }}
    </p>

    <div v-for="key in ALLOC_KEYS" :key="key" class="attr-row">
      <div class="attr-name">
        {{ ATTR_LABELS[key] }}
        <span class="attr-hint">{{ ATTR_HINTS[key] }}</span>
      </div>
      <div class="attr-ctrl">
        <button @click="adjust(key, -1)" :disabled="alloc[key] <= ATTR_MIN">−</button>
        <span class="attr-value">{{ alloc[key] }}</span>
        <button @click="adjust(key, 1)" :disabled="alloc[key] >= ATTR_MAX || remaining <= 0">＋</button>
      </div>
      <div class="attr-bar">
        <div class="attr-fill" :style="{ width: (alloc[key] / ATTR_MAX) * 100 + '%' }"></div>
      </div>
    </div>

    <div class="actions">
      <span class="actions-left">
        <button @click="randomize">听天由命</button>
        <button @click="emit('records')">生平战绩</button>
      </span>
      <button class="primary" :disabled="remaining !== 0" @click="confirm">入世投胎</button>
    </div>
  </section>
</template>

<style scoped>
h2 {
  margin: 0 0 0.3em;
  font-size: 1.3rem;
  letter-spacing: 0.2em;
}

.hint {
  color: var(--ink-soft);
  margin: 0 0 var(--space-2);
}

.modes {
  display: flex;
  gap: var(--space-1);
  margin-bottom: 0.4rem;
}

.mode {
  flex: 1;
  padding: 0.35em 0;
  color: var(--ink-soft);
  border-color: var(--line);
}

.mode.active {
  background: var(--indigo);
  border-color: var(--indigo);
  color: var(--paper);
}

.mode-desc {
  margin: 0 0 var(--space-1);
  font-size: 0.78rem;
  color: var(--ink-soft);
}

.boons {
  border: 1px dashed var(--gold);
  padding: 0.6rem 0.8rem;
  margin-bottom: var(--space-1);
}

.boons-title {
  margin: 0 0 0.5rem;
  color: var(--gold);
  font-size: 0.85rem;
  font-weight: 600;
}

.boons-hint {
  font-weight: 400;
  color: var(--ink-soft);
  font-size: 0.75rem;
}

.boon-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.boon {
  font-size: 0.78rem;
  padding: 0.25em 0.7em;
  color: var(--ink-soft);
  border-color: var(--line);
}

.boon.active {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--paper);
}

.boon-cost {
  opacity: 0.75;
}

.warn {
  color: var(--cinnabar);
}

.attr-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.2rem var(--space-2);
  align-items: center;
  padding: var(--space-1) 0;
  border-bottom: 1px dashed var(--line);
}

.attr-name {
  font-size: 1.05rem;
}

.attr-hint {
  display: block;
  font-size: 0.78rem;
  color: var(--ink-soft);
}

.attr-ctrl {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.attr-ctrl button {
  width: 2rem;
  height: 2rem;
  padding: 0;
  line-height: 1;
}

.attr-value {
  min-width: 1.6em;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
}

.attr-bar {
  grid-column: 1 / -1;
  height: 4px;
  background: var(--paper-deep);
}

.attr-fill {
  height: 100%;
  background: var(--indigo);
  transition: width var(--duration) var(--ease);
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-3);
}

.actions-left {
  display: flex;
  gap: var(--space-1);
}
</style>
