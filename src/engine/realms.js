// 境界体系：每个境界决定寿元上限、每回合跨越的年数、突破基础成功率

export const REALMS = [
  { name: '凡人', lifespan: 80, tickYears: 1, baseBreakChance: 0.5 },
  { name: '练气', lifespan: 120, tickYears: 2, baseBreakChance: 0.42 },
  { name: '筑基', lifespan: 220, tickYears: 5, baseBreakChance: 0.32 },
  { name: '金丹', lifespan: 500, tickYears: 15, baseBreakChance: 0.24 },
  { name: '元婴', lifespan: 1000, tickYears: 40, baseBreakChance: 0.16 },
  { name: '化神', lifespan: 2000, tickYears: 100, baseBreakChance: 0.1 },
  { name: '渡劫', lifespan: 3000, tickYears: 150, baseBreakChance: 0.08 },
];

export const MAX_REALM_INDEX = REALMS.length - 1;

// 修为满值触发突破尝试
export const CULTIVATION_CAP = 100;

// 6 岁开蒙之前不积累修为
export const ENLIGHTEN_AGE = 6;

export function realmOf(state) {
  return REALMS[state.realmIndex];
}

/** 每回合的修为增速：灵根为主，悟性为辅，境界越高越难精进 */
export function cultivationGain(state, tickYears) {
  const { linggen, wuxing } = state.attrs;
  const realmDrag = 1 / (1 + state.realmIndex * 0.6);
  const perYear = (linggen * 1.2 + wuxing * 0.6) * realmDrag;
  return perYear * tickYears;
}

/** 突破成功率：基础值 + 灵根/悟性加成 + 道心影响，夹在 [0.05, 0.95] */
export function breakthroughChance(state) {
  const { linggen, wuxing, daoxin } = state.attrs;
  const base = REALMS[state.realmIndex].baseBreakChance;
  const chance = base + linggen * 0.03 + wuxing * 0.02 + (daoxin - 5) * 0.02;
  return Math.min(0.95, Math.max(0.05, chance));
}
