<script setup>
import { computed, ref } from 'vue';
import { computeCareer } from '../engine/records.js';
import { ACHIEVEMENT_INDEX } from '../data/index.js';

const props = defineProps({
  records: { type: Array, required: true },
  unlocked: { type: Array, default: () => [] },
});
defineEmits(['back', 'clear']);

const career = computed(() => computeCareer(props.records));
const isIndexOpen = ref(false);
const unlockedSet = computed(() => new Set(props.unlocked));
const unlockedCount = computed(
  () => ACHIEVEMENT_INDEX.filter((a) => unlockedSet.value.has(a.name)).length,
);
</script>

<template>
  <section class="panel">
    <h2>生平战绩</h2>

    <div class="career">
      <div class="stat"><span class="stat-label">轮回</span><span class="stat-value">{{ career.total }} 世</span></div>
      <div class="stat"><span class="stat-label">最高评分</span><span class="stat-value">{{ career.bestScore }}</span></div>
      <div class="stat"><span class="stat-label">飞升</span><span class="stat-value">{{ career.ascensions }} 次</span></div>
      <div class="stat"><span class="stat-label">最高寿数</span><span class="stat-value">{{ career.maxAge }} 岁</span></div>
    </div>

    <p v-if="records.length === 0" class="empty">尚无一世修行。回去投个胎吧。</p>
    <ul v-else class="list">
      <li v-for="record in records" :key="record.at" class="row">
        <span class="r-grade" :class="`grade-${record.grade}`">{{ record.grade }}</span>
        <span class="r-main">
          {{ record.title }} · {{ record.realmName }} · {{ record.age }}岁 · {{ record.difficultyName }}
          <span class="r-date">{{ record.dateText }}</span>
        </span>
        <span class="r-score">{{ record.score }}</span>
      </li>
    </ul>

    <div class="ach-index">
      <button class="ach-toggle" @click="isIndexOpen = !isIndexOpen">
        成就图鉴（{{ unlockedCount }}/{{ ACHIEVEMENT_INDEX.length }}）{{ isIndexOpen ? '▲' : '▼' }}
      </button>
      <ul v-if="isIndexOpen" class="ach-list">
        <li
          v-for="a in ACHIEVEMENT_INDEX"
          :key="a.name"
          class="ach-row"
          :class="{ done: unlockedSet.has(a.name) }"
        >
          <span class="ach-name">{{ unlockedSet.has(a.name) ? a.name : '？？？' }}</span>
          <span class="ach-hint">{{ a.hint }}</span>
        </li>
      </ul>
    </div>

    <div class="actions">
      <button :disabled="records.length === 0" @click="$emit('clear')">清空战绩</button>
      <button class="primary" @click="$emit('back')">返回</button>
    </div>
  </section>
</template>

<style scoped>
h2 {
  margin: 0 0 var(--space-2);
  font-size: 1.3rem;
  letter-spacing: 0.2em;
}

.career {
  display: flex;
  justify-content: space-between;
  gap: var(--space-1);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--line);
  margin-bottom: var(--space-2);
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.72rem;
  color: var(--ink-soft);
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
}

.empty {
  color: var(--ink-soft);
  text-align: center;
  padding: var(--space-3) 0;
}

.list {
  list-style: none;
  margin: 0 0 var(--space-2);
  padding: 0;
  max-height: 46vh;
  overflow-y: auto;
}

.row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.45rem 0;
  border-bottom: 1px dashed var(--line);
  font-size: 0.88rem;
}

.r-grade {
  flex-shrink: 0;
  width: 1.8em;
  text-align: center;
  font-weight: 700;
}

.grade-仙 { color: var(--gold); }
.grade-S { color: var(--cinnabar); }
.grade-A { color: var(--indigo); }
.grade-B, .grade-C, .grade-D { color: var(--ink-soft); }

.r-main {
  flex: 1;
}

.r-date {
  color: var(--ink-soft);
  font-size: 0.75rem;
  margin-left: 0.5em;
}

.r-score {
  flex-shrink: 0;
  font-weight: 600;
}

.ach-index {
  margin: 0 0 var(--space-2);
}

.ach-toggle {
  font-size: 0.85rem;
  color: var(--gold);
  border-color: var(--gold);
}

.ach-list {
  list-style: none;
  margin: var(--space-1) 0 0;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--line);
  max-height: 40vh;
  overflow-y: auto;
}

.ach-row {
  display: flex;
  gap: 0.8rem;
  padding: 0.35rem 0;
  border-bottom: 1px dashed var(--line);
  font-size: 0.85rem;
}

.ach-name {
  flex-shrink: 0;
  min-width: 6.5em;
  color: var(--ink-soft);
}

.ach-row.done .ach-name {
  color: var(--gold);
  font-weight: 600;
}

.ach-hint {
  color: var(--ink-soft);
  font-size: 0.78rem;
}

.actions {
  display: flex;
  justify-content: space-between;
}
</style>
