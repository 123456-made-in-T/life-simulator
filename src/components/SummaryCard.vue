<script setup>
import { ref } from 'vue';

defineProps({
  summary: { type: Object, required: true },
  seed: { type: Number, required: true },
  logs: { type: Array, default: () => [] },
});
defineEmits(['restart']);

const isRecordOpen = ref(false);
</script>

<template>
  <section class="panel summary">
    <p class="grade" :class="`grade-${summary.grade}`">{{ summary.grade }}</p>
    <h2>{{ summary.title }}</h2>
    <p class="mode-tag">{{ summary.difficultyName }}模式</p>
    <p class="ending">{{ summary.endingText }}</p>

    <dl class="facts">
      <div><dt>终此一生</dt><dd>{{ summary.age }} 岁</dd></div>
      <div><dt>最终境界</dt><dd>{{ summary.realmName }}</dd></div>
      <div><dt>此生评分</dt><dd>{{ summary.score }}</dd></div>
    </dl>

    <div v-if="summary.achievements.length" class="achievements">
      <h3>此生高光</h3>
      <ul>
        <li v-for="a in summary.achievements" :key="a">{{ a }}</li>
      </ul>
    </div>

    <p class="seed">命盘编号 #{{ seed }}</p>

    <div class="record">
      <button class="record-toggle" @click="isRecordOpen = !isRecordOpen">
        {{ isRecordOpen ? '收起此生年表 ▲' : '回顾此生年表 ▼' }}
      </button>
      <div v-if="isRecordOpen" class="record-list">
        <p v-for="(log, i) in logs" :key="i" class="record-line" :class="`tone-${log.tone}`">
          <span class="record-age">{{ log.age }}岁</span>{{ log.text }}
        </p>
      </div>
    </div>

    <button class="primary restart" @click="$emit('restart')">再入轮回</button>
  </section>
</template>

<style scoped>
.summary {
  text-align: center;
}

.grade {
  margin: 0;
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
}

.grade-仙 { color: var(--gold); }
.grade-S { color: var(--cinnabar); }
.grade-A { color: var(--indigo); }
.grade-B, .grade-C, .grade-D { color: var(--ink-soft); }

h2 {
  margin: 0.2em 0 0.6em;
  font-size: 1.6rem;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ending {
  color: var(--ink-soft);
  margin: 0 0 var(--space-3);
}

.facts {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  margin: 0 0 var(--space-3);
}

.facts dt {
  font-size: 0.78rem;
  color: var(--ink-soft);
}

.facts dd {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.achievements h3 {
  font-size: 0.95rem;
  letter-spacing: 0.2em;
  margin: 0 0 0.4em;
}

.achievements ul {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-2);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
}

.achievements li {
  border: 1px solid var(--gold);
  color: var(--gold);
  font-size: 0.82rem;
  padding: 0.1em 0.7em;
}

.seed {
  font-size: 0.75rem;
  color: var(--ink-soft);
  margin: 0 0 var(--space-2);
}

.mode-tag {
  margin: -0.4em 0 0.6em;
  font-size: 0.8rem;
  color: var(--ink-soft);
  letter-spacing: 0.15em;
}

.record {
  margin: 0 0 var(--space-2);
}

.record-toggle {
  font-size: 0.82rem;
  color: var(--ink-soft);
  border-color: var(--line);
}

.record-list {
  margin-top: var(--space-1);
  max-height: 40vh;
  overflow-y: auto;
  text-align: left;
  border: 1px solid var(--line);
  padding: var(--space-1) var(--space-2);
  font-size: 0.85rem;
}

.record-line {
  margin: 0 0 0.45em;
}

.record-age {
  color: var(--ink-soft);
  font-size: 0.78rem;
  margin-right: 0.6em;
}

.record-line.tone-breakthrough { color: var(--indigo); }
.record-line.tone-death { color: var(--cinnabar); }
.record-line.tone-ascend { color: var(--gold); }

.restart {
  font-size: 1.05rem;
  padding: 0.5em 2.5em;
}
</style>
