// 事件系统：按境界/年龄/条件筛选可用事件，按权重随机抽取，应用效果（纯函数）

import { clampAttr } from './character.js';

const ATTR_KEYS = ['linggen', 'wuxing', 'tipo', 'jiashi', 'daoxin'];

export function isEligible(event, state) {
  if (event.realmMin != null && state.realmIndex < event.realmMin) return false;
  if (event.realmMax != null && state.realmIndex > event.realmMax) return false;
  if (event.ageMin != null && state.age < event.ageMin) return false;
  if (event.ageMax != null && state.age > event.ageMax) return false;
  if (event.once && state.usedEventIds.includes(event.id)) return false;

  const cond = event.cond;
  if (cond) {
    if (cond.talent && !state.talents.includes(cond.talent)) return false;
    if (cond.flag && !state.flags[cond.flag]) return false;
    if (cond.minAttrs) {
      for (const [key, min] of Object.entries(cond.minAttrs)) {
        if (state.attrs[key] < min) return false;
      }
    }
    if (cond.maxAttrs) {
      for (const [key, max] of Object.entries(cond.maxAttrs)) {
        if (state.attrs[key] > max) return false;
      }
    }
  }
  return true;
}

/** 按权重随机抽一个可用事件，无可用事件返回 null */
export function pickEvent(pool, state, rng) {
  const eligible = pool.filter((event) => isEligible(event, state));
  if (eligible.length === 0) {
    return null;
  }
  const totalWeight = eligible.reduce((sum, e) => sum + (e.weight ?? 1), 0);
  let roll = rng() * totalWeight;
  for (const event of eligible) {
    roll -= event.weight ?? 1;
    if (roll <= 0) {
      return event;
    }
  }
  return eligible[eligible.length - 1];
}

/**
 * 应用事件效果，返回 { state, died, deathText }。
 * 不修改传入的 state（返回新对象）。
 */
export function applyEvent(state, event, rng) {
  const effects = event.effects || {};
  const attrs = { ...state.attrs };
  for (const key of ATTR_KEYS) {
    if (effects[key]) {
      attrs[key] = clampAttr(attrs[key] + effects[key]);
    }
  }

  const next = {
    ...state,
    attrs,
    cultivation: Math.max(0, state.cultivation + (effects.cultivation ?? 0)),
    lifespan: state.lifespan + (effects.lifespan ?? 0),
    flags: effects.flag ? { ...state.flags, [effects.flag]: true } : state.flags,
    usedEventIds: event.once ? [...state.usedEventIds, event.id] : state.usedEventIds,
    achievements: event.achievement
      ? [...state.achievements, event.achievement]
      : state.achievements,
  };

  if (event.deathChance && rng() < event.deathChance) {
    return { state: next, died: true, deathText: event.deathText || '不幸殒命。' };
  }
  return { state: next, died: false, deathText: null };
}

/** 把效果对象转成「(灵根+1 道心-1)」这样的展示文本 */
export function formatEffects(effects) {
  if (!effects) return '';
  const labels = { linggen: '灵根', wuxing: '悟性', tipo: '体魄', jiashi: '家世', daoxin: '道心', cultivation: '修为', lifespan: '寿元' };
  const parts = [];
  for (const [key, label] of Object.entries(labels)) {
    const value = effects[key];
    if (value) {
      parts.push(`${label}${value > 0 ? '+' : ''}${value}`);
    }
  }
  return parts.length > 0 ? `（${parts.join(' ')}）` : '';
}
