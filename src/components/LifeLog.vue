<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import { REALMS, CULTIVATION_CAP } from '../engine/realms.js';
import { ATTR_LABELS } from '../engine/character.js';

const props = defineProps({
  state: { type: Object, required: true },
  logs: { type: Array, required: true },
  speed: { type: String, required: true },
  pendingOptions: { type: Array, required: true },
});
defineEmits(['toggle-speed', 'choose']);

const scroller = ref(null);

watch(
  () => props.logs.length,
  async () => {
    await nextTick();
    if (scroller.value) {
      scroller.value.scrollTop = scroller.value.scrollHeight;
    }
  },
);

const realmName = computed(() => REALMS[props.state.realmIndex].name);
const cultivationPercent = computed(() =>
  Math.min(100, Math.round((props.state.cultivation / CULTIVATION_CAP) * 100)),
);
</script>

<template>
  <section class="life">
    <div class="status">
      <span class="realm-badge">{{ realmName }}</span>
      <span v-if="state.origin" class="origin-badge">{{ state.origin.name }}</span>
      <span v-if="state.artifact" class="artifact-badge">{{ state.artifact.name }}</span>
      <span class="age">{{ state.age }} 岁 <span class="lifespan">/ 寿元 {{ state.lifespan }}</span></span>
      <div class="cult-bar" :title="`修为 ${cultivationPercent}%`">
        <div class="cult-fill" :style="{ width: cultivationPercent + '%' }"></div>
      </div>
      <div class="attrs">
        <span v-for="(label, key) in ATTR_LABELS" :key="key" class="attr">
          {{ label }} <strong>{{ state.attrs[key] }}</strong>
        </span>
      </div>
    </div>

    <div ref="scroller" class="log-scroll">
      <p v-for="(log, i) in logs" :key="i" class="log" :class="`tone-${log.tone}`">
        <span class="log-age">{{ log.ageText }}</span>
        <span class="log-text">{{ log.text }}</span>
      </p>
    </div>

    <div v-if="pendingOptions.length > 0" class="choices">
      <button
        v-for="(option, i) in pendingOptions"
        :key="i"
        class="choice-btn"
        @click="$emit('choose', i)"
      >
        {{ option }}
      </button>
    </div>
    <div v-else class="controls">
      <button @click="$emit('toggle-speed')">{{ speed === 'slow' ? '光阴加速 »' : '细品岁月 «' }}</button>
    </div>
  </section>
</template>

<style scoped>
.life {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-height: 0;
}

.status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 1rem;
  padding: var(--space-1) 0;
  border-bottom: 1px solid var(--line);
}

.realm-badge {
  background: var(--indigo);
  color: var(--paper);
  padding: 0.1em 0.7em;
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  text-indent: 0.2em;
}

.origin-badge {
  border: 1px solid var(--line);
  color: var(--ink-soft);
  padding: 0.1em 0.6em;
  font-size: 0.78rem;
}

.artifact-badge {
  border: 1px solid var(--gold);
  color: var(--gold);
  padding: 0.1em 0.6em;
  font-size: 0.78rem;
}

.age {
  font-size: 1.05rem;
  font-weight: 600;
}

.lifespan {
  font-weight: 400;
  font-size: 0.8rem;
  color: var(--ink-soft);
}

.cult-bar {
  flex: 1;
  min-width: 80px;
  height: 5px;
  background: var(--paper-deep);
}

.cult-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--indigo), var(--gold));
  transition: width var(--duration) var(--ease);
}

.attrs {
  width: 100%;
  display: flex;
  gap: 0.9rem;
  font-size: 0.8rem;
  color: var(--ink-soft);
}

.attrs strong {
  color: var(--ink);
}

.log-scroll {
  flex: 1;
  overflow-y: auto;
  min-height: 40vh;
  max-height: 55vh;
  padding-right: 0.3rem;
}

.log {
  margin: 0 0 0.55em;
  display: flex;
  gap: 0.7rem;
  animation: fade-up var(--duration) var(--ease);
}

.log-age {
  flex-shrink: 0;
  min-width: 3.2em;
  text-align: right;
  color: var(--ink-soft);
  font-size: 0.82rem;
  padding-top: 0.15em;
}

.tone-bad .log-text {
  color: #7a4a1e;
}

.tone-choice .log-text {
  color: var(--indigo);
}

.tone-breakthrough .log-text {
  color: var(--indigo);
  font-weight: 600;
}

.tone-death .log-text {
  color: var(--cinnabar);
  font-weight: 600;
}

.tone-ascend .log-text {
  color: var(--gold);
  font-weight: 700;
}

.controls {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--space-1);
  border-top: 1px solid var(--line);
}

.controls button {
  font-size: 0.85rem;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-top: var(--space-1);
  border-top: 2px solid var(--cinnabar);
  animation: fade-up var(--duration) var(--ease);
}

.choice-btn {
  text-align: left;
  padding: 0.6em 1em;
  border-color: var(--cinnabar);
  color: var(--cinnabar);
}

.choice-btn:hover {
  background: var(--cinnabar);
  color: var(--paper);
}
</style>
