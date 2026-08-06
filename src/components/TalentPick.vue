<script setup>
import { ref, computed } from 'vue';

const PICK_COUNT = 3;
const RARITY_LABELS = { 1: '凡品', 2: '灵品', 3: '仙品' };

const props = defineProps({
  options: { type: Array, required: true },
});
const emit = defineEmits(['confirm']);

const selectedIds = ref([]);

const canConfirm = computed(() => selectedIds.value.length === PICK_COUNT);

function toggle(id) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((v) => v !== id);
    return;
  }
  if (selectedIds.value.length < PICK_COUNT) {
    selectedIds.value = [...selectedIds.value, id];
  }
}

function confirm() {
  if (!canConfirm.value) return;
  emit(
    'confirm',
    props.options.filter((t) => selectedIds.value.includes(t.id)),
  );
}
</script>

<template>
  <section class="panel">
    <h2>抽取命格</h2>
    <p class="hint">天命十签，择其三。（已选 {{ selectedIds.length }} / {{ PICK_COUNT }}）</p>

    <ul class="talent-list">
      <li
        v-for="talent in options"
        :key="talent.id"
        class="talent"
        :class="[`rarity-${talent.rarity}`, { picked: selectedIds.includes(talent.id) }]"
        @click="toggle(talent.id)"
      >
        <span class="talent-name">{{ talent.name }}</span>
        <span class="talent-rarity">{{ RARITY_LABELS[talent.rarity] }}</span>
        <span class="talent-desc">{{ talent.desc }}</span>
      </li>
    </ul>

    <div class="actions">
      <button class="primary" :disabled="!canConfirm" @click="confirm">带此命格降生</button>
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

.talent-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-1);
}

.talent {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 0.6rem;
  align-items: baseline;
  padding: 0.55rem 0.8rem;
  border: 1px solid var(--line);
  border-left-width: 3px;
  cursor: pointer;
  transition: background var(--duration) var(--ease), border-color var(--duration) var(--ease);
}

.talent:hover {
  background: rgba(255, 253, 247, 0.9);
}

.talent.picked {
  background: var(--ink);
  color: var(--paper);
}

.rarity-1 { border-left-color: var(--ink-soft); }
.rarity-2 { border-left-color: var(--indigo); }
.rarity-3 { border-left-color: var(--gold); }

.talent-name {
  font-weight: 600;
  white-space: nowrap;
}

.talent-rarity {
  font-size: 0.75rem;
  color: var(--ink-soft);
  white-space: nowrap;
}

.talent.picked .talent-rarity {
  color: var(--paper-deep);
}

.talent-desc {
  font-size: 0.85rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-3);
}
</style>
