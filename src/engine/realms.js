// 境界体系：寿元上限、每回合跨越年数、突破基础成功率、境界最少沉淀年数。
// minStay（练气→渡劫）合计 1000 年，乘以难度 timeMul 即各难度的最短飞升年限
// （凡人 1000 / 天骄 800 / 地狱 1500），这是设计约束，改动时必须保持合计不变。

export const REALMS = [
  { name: '凡人', lifespan: 80, tickYears: 1, baseBreakChance: 0.45, minStay: 0 },
  { name: '练气', lifespan: 150, tickYears: 4, baseBreakChance: 0.35, minStay: 60 },
  { name: '筑基', lifespan: 400, tickYears: 8, baseBreakChance: 0.26, minStay: 100 },
  { name: '金丹', lifespan: 800, tickYears: 15, baseBreakChance: 0.18, minStay: 150 },
  { name: '元婴', lifespan: 1500, tickYears: 25, baseBreakChance: 0.12, minStay: 200 },
  { name: '化神', lifespan: 2500, tickYears: 40, baseBreakChance: 0.08, minStay: 250 },
  { name: '渡劫', lifespan: 4000, tickYears: 40, baseBreakChance: 0.06, minStay: 240 },
];

export const MAX_REALM_INDEX = REALMS.length - 1;

// 修为满值触发突破尝试（还需满足境界沉淀年数）
export const CULTIVATION_CAP = 100;

// 6 岁开蒙之前不积累修为
export const ENLIGHTEN_AGE = 6;

export function realmOf(state) {
  return REALMS[state.realmIndex];
}

/** 每回合的修为增速：灵根为主，悟性为辅，境界越高越难精进；本命法宝可加速 */
export function cultivationGain(state, tickYears) {
  const { linggen, wuxing } = state.attrs;
  const realmDrag = 1 / (1 + state.realmIndex * 0.8);
  const perYear = (linggen * 0.7 + wuxing * 0.35) * realmDrag;
  return perYear * tickYears * (state.artifact?.cultMul ?? 1);
}

/** 突破成功率：基础值 + 灵根/悟性加成 + 道心影响 + 法宝加成，夹在 [0.05, 0.9] */
export function breakthroughChance(state) {
  const { linggen, wuxing, daoxin } = state.attrs;
  const base = REALMS[state.realmIndex].baseBreakChance;
  const chance =
    base + linggen * 0.025 + wuxing * 0.015 + (daoxin - 5) * 0.02 + (state.artifact?.breakBonus ?? 0);
  return Math.min(0.9, Math.max(0.05, chance));
}

/** 当前境界要求的沉淀年数（受难度 timeMul 影响） */
export function requiredStayYears(state) {
  return REALMS[state.realmIndex].minStay * (state.difficulty?.timeMul ?? 1);
}
