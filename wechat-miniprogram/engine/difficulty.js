// 难度模式：影响开局资质点数、死亡概率倍率、境界沉淀年数倍率、结算评分倍率

// 全局死亡加压：所有死亡概率先乘此系数，再乘难度倍率
const BASE_DEATH_SCALE = 1.25;

export const DIFFICULTIES = [
  { id: 'tianjiao', name: '天骄', desc: '天命之子：资质 24 点，至少八百载方可飞升，评分 ×0.9', points: 24, deathMul: 0.8, timeMul: 0.8, scoreMul: 0.9 },
  { id: 'fanren', name: '凡人', desc: '标准修行：资质 20 点，至少千载方可飞升', points: 20, deathMul: 1, timeMul: 1, scoreMul: 1 },
  { id: 'diyu', name: '地狱', desc: '逆天改命：资质 16 点，至少千五百载方可飞升，死亡率最高，评分 ×1.3', points: 16, deathMul: 1.5, timeMul: 1.5, scoreMul: 1.3 },
];

export const DEFAULT_DIFFICULTY = DIFFICULTIES[1];

/** 按全局加压与难度放大死亡概率，封顶 95% */
export function adjustedDeathChance(chance, difficulty) {
  return Math.min(0.95, chance * BASE_DEATH_SCALE * (difficulty?.deathMul ?? 1));
}
