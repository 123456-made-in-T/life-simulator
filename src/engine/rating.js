// 一世终了的结算：评分、称号、评级（纯函数）

import { REALMS } from './realms.js';

const GRADES = [
  { min: 1000, grade: '仙' },
  { min: 600, grade: 'S' },
  { min: 400, grade: 'A' },
  { min: 250, grade: 'B' },
  { min: 120, grade: 'C' },
  { min: 0, grade: 'D' },
];

export function summarize(state) {
  const achievements = [...state.achievements, ...computedAchievements(state)];
  const attrSum = Object.values(state.attrs).reduce((sum, v) => sum + v, 0);
  const rawScore =
    (state.ascended ? 1000 : 0) +
    state.realmIndex * 100 +
    state.age / 10 +
    attrSum * 2 +
    achievements.length * 20;
  const score = Math.round(rawScore * (state.difficulty?.scoreMul ?? 1));

  return {
    score,
    grade: GRADES.find((g) => score >= g.min).grade,
    title: titleFor(state),
    realmName: state.ascended ? '飞升仙界' : REALMS[state.realmIndex].name,
    age: state.age,
    achievements,
    difficultyName: state.difficulty?.name ?? '凡人',
    endingText: state.ascended
      ? '一朝功成登临仙界，从此天高海阔，大道可期。'
      : state.endingText || '一世浮沉，就此落幕。',
  };
}

/** 结算特殊成就全名录（成就图鉴与测试用） */
export const SPECIAL_ACHIEVEMENTS = [
  '一鼓作气', '百折不挠', '金身无损', '道心如铁', '刀口舔血', '布衣终老', '地狱归来',
];

/** 由整局统计计算的特殊成就（事件成就之外的一层） */
function computedAchievements(state) {
  const stats = state.stats || { breakFails: 0, riskSurvived: 0, minDaoxin: 5 };
  const earned = [];
  if (state.ascended && stats.breakFails === 0) earned.push('一鼓作气');
  if (state.realmIndex >= 4 && stats.breakFails >= 3) earned.push('百折不挠');
  if (state.ascended && state.attrs.tipo >= 8) earned.push('金身无损');
  if (state.age >= 60 && stats.minDaoxin >= 3) earned.push('道心如铁');
  if (stats.riskSurvived >= 6) earned.push('刀口舔血');
  if (!state.ascended && state.realmIndex === 0 && state.age >= 70) earned.push('布衣终老');
  if (state.difficulty?.id === 'diyu' && state.ascended) earned.push('地狱归来');
  return earned;
}

function titleFor(state) {
  if (state.ascended) return '羽化登仙';
  if (state.realmIndex >= 5) return '一方大能';
  if (state.realmIndex >= 3) return '结丹真人';
  if (state.realmIndex >= 1) return '修行中人';
  if (state.age >= 60) return '凡尘一梦';
  return '早夭之殇';
}
