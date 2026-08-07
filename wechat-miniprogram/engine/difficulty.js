// 难度模式：影响开局资质点数、死亡概率倍率、结算评分倍率

export const DIFFICULTIES = [
  { id: 'tianjiao', name: '天骄', desc: '天命之子：资质 24 点，凶险稍减，评分 ×0.9', points: 24, deathMul: 0.8, scoreMul: 0.9 },
  { id: 'fanren', name: '凡人', desc: '标准修行：资质 20 点', points: 20, deathMul: 1, scoreMul: 1 },
  { id: 'diyu', name: '地狱', desc: '逆天改命：资质 16 点，死亡率 ×1.5，评分 ×1.3', points: 16, deathMul: 1.5, scoreMul: 1.3 },
];

export const DEFAULT_DIFFICULTY = DIFFICULTIES[1];

/** 按难度放大死亡概率，封顶 95% */
export function adjustedDeathChance(chance, difficulty) {
  return Math.min(0.95, chance * (difficulty?.deathMul ?? 1));
}
