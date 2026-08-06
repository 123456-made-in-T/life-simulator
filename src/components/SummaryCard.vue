<script setup>
defineProps({
  summary: { type: Object, required: true },
  seed: { type: Number, required: true },
});
defineEmits(['restart']);
</script>

<template>
  <section class="panel summary">
    <p class="grade" :class="`grade-${summary.grade}`">{{ summary.grade }}</p>
    <h2>{{ summary.title }}</h2>
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

.restart {
  font-size: 1.05rem;
  padding: 0.5em 2.5em;
}
</style>
