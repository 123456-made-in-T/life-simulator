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
  const attrSum = Object.values(state.attrs).reduce((sum, v) => sum + v, 0);
  const score = Math.round(
    (state.ascended ? 1000 : 0) +
      state.realmIndex * 100 +
      state.age / 10 +
      attrSum * 2 +
      state.achievements.length * 20,
  );

  return {
    score,
    grade: GRADES.find((g) => score >= g.min).grade,
    title: titleFor(state),
    realmName: state.ascended ? '飞升仙界' : REALMS[state.realmIndex].name,
    age: state.age,
    achievements: state.achievements,
    endingText: state.ascended
      ? '一朝功成登临仙界，从此天高海阔，大道可期。'
      : state.endingText || '一世浮沉，就此落幕。',
  };
}

function titleFor(state) {
  if (state.ascended) return '羽化登仙';
  if (state.realmIndex >= 5) return '一方大能';
  if (state.realmIndex >= 3) return '结丹真人';
  if (state.realmIndex >= 1) return '修行中人';
  if (state.age >= 60) return '凡尘一梦';
  return '早夭之殇';
}
