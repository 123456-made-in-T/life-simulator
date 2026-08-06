<script setup>
import { reactive, computed } from 'vue';
import {
  POINT_TOTAL,
  ATTR_MAX,
  ATTR_MIN,
  ALLOC_KEYS,
  ATTR_LABELS,
  randomAllocation,
} from '../engine/character.js';

const emit = defineEmits(['confirm']);

const ATTR_HINTS = {
  linggen: '修炼速度与突破之资',
  wuxing: '悟道参法之能',
  tipo: '生死关头的本钱',
  jiashi: '出身背景与财力',
};

const alloc = reactive({ linggen: 5, wuxing: 5, tipo: 5, jiashi: 5 });

const remaining = computed(
  () => POINT_TOTAL - ALLOC_KEYS.reduce((sum, key) => sum + alloc[key], 0),
);

function adjust(key, delta) {
  const next = alloc[key] + delta;
  if (next < ATTR_MIN || next > ATTR_MAX) return;
  if (delta > 0 && remaining.value <= 0) return;
  alloc[key] = next;
}

function randomize() {
  Object.assign(alloc, randomAllocation(Math.random));
}

function confirm() {
  if (remaining.value === 0) {
    emit('confirm', { ...alloc });
  }
}
</script>

<template>
  <section class="panel">
    <h2>投胎 · 分配资质</h2>
    <p class="hint">
      剩余点数：<strong :class="{ warn: remaining !== 0 }">{{ remaining }}</strong> / {{ POINT_TOTAL }}
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
      <button @click="randomize">听天由命</button>
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
</style>
