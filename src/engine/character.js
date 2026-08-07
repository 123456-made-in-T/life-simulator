// 角色创建：分配资质点数 + 应用命格效果，返回初始状态（纯函数）

import { REALMS } from './realms.js';
import { DEFAULT_DIFFICULTY } from './difficulty.js';

export const POINT_TOTAL = 20;
export const ATTR_MIN = 0;
export const ATTR_MAX = 10;
export const BASE_DAOXIN = 5;

export const ALLOC_KEYS = ['linggen', 'wuxing', 'tipo', 'jiashi'];

export const ATTR_LABELS = {
  linggen: '灵根',
  wuxing: '悟性',
  tipo: '体魄',
  jiashi: '家世',
  daoxin: '道心',
};

/** 校验分配是否合法，返回错误消息，合法则返回 null */
export function validateAllocation(alloc, pointTotal = POINT_TOTAL) {
  for (const key of ALLOC_KEYS) {
    const value = alloc[key];
    if (!Number.isInteger(value)) {
      return `${ATTR_LABELS[key]}必须是整数`;
    }
    if (value < ATTR_MIN || value > ATTR_MAX) {
      return `${ATTR_LABELS[key]}必须在 ${ATTR_MIN}-${ATTR_MAX} 之间`;
    }
  }
  const total = ALLOC_KEYS.reduce((sum, key) => sum + alloc[key], 0);
  if (total !== pointTotal) {
    return `资质点数必须刚好用完 ${pointTotal} 点（当前 ${total} 点）`;
  }
  return null;
}

/** 用随机数生成一组合法的随机分配 */
export function randomAllocation(rng, pointTotal = POINT_TOTAL) {
  const alloc = { linggen: 0, wuxing: 0, tipo: 0, jiashi: 0 };
  for (let i = 0; i < pointTotal; i += 1) {
    const candidates = ALLOC_KEYS.filter((key) => alloc[key] < ATTR_MAX);
    const key = candidates[Math.floor(rng() * candidates.length)];
    alloc[key] += 1;
  }
  return alloc;
}

/** 创建初始状态。talents 为命格对象数组（含 effects）。 */
export function createCharacter(alloc, talents, difficulty = DEFAULT_DIFFICULTY) {
  const error = validateAllocation(alloc, difficulty.points);
  if (error) {
    throw new Error(error);
  }

  const attrs = {
    linggen: alloc.linggen,
    wuxing: alloc.wuxing,
    tipo: alloc.tipo,
    jiashi: alloc.jiashi,
    daoxin: BASE_DAOXIN,
  };
  const flags = {};
  let lifespanBonus = 0;

  for (const talent of talents) {
    const effects = talent.effects || {};
    for (const key of Object.keys(attrs)) {
      if (effects[key]) {
        attrs[key] = clampAttr(attrs[key] + effects[key]);
      }
    }
    if (effects.lifespan) {
      lifespanBonus += effects.lifespan;
    }
    if (effects.flag) {
      flags[effects.flag] = true;
    }
  }

  return {
    age: 0,
    realmIndex: 0,
    cultivation: 0,
    attrs,
    lifespan: REALMS[0].lifespan + lifespanBonus,
    lifespanBonus,
    talents: talents.map((t) => t.id),
    flags,
    usedEventIds: [],
    achievements: [],
    alive: true,
    ascended: false,
    endingText: null,
    difficulty: {
      id: difficulty.id,
      name: difficulty.name,
      deathMul: difficulty.deathMul,
      scoreMul: difficulty.scoreMul,
    },
    // 结算成就用的统计
    stats: { breakFails: 0, riskSurvived: 0, minDaoxin: attrs.daoxin },
  };
}

/** 刷新统计里的道心最低值（在道心可能变化后调用） */
export function trackStats(state) {
  if (!state.stats || state.attrs.daoxin >= state.stats.minDaoxin) {
    return state;
  }
  return { ...state, stats: { ...state.stats, minDaoxin: state.attrs.daoxin } };
}

export function clampAttr(value) {
  return Math.min(ATTR_MAX, Math.max(ATTR_MIN, Math.round(value * 10) / 10));
}

/** 从命格池中随机抽 count 个供玩家挑选 */
export function drawTalents(pool, count, rng) {
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
