// 转世道果：每世结算按评分获得道果（永久积累），下一世投胎前可购买「临世机缘」

export const BOONS = [
  { id: 'tianzi', name: '天资加身', desc: '开局资质点 +2', cost: 3 },
  { id: 'dongtian', name: '命格洞天', desc: '抽命格时可选范围 10 → 15', cost: 2 },
  { id: 'xianyuan', name: '仙缘早种', desc: '开局自带 30 点修为', cost: 2 },
  { id: 'fuze', name: '福泽绵长', desc: '寿元 +30', cost: 2 },
  { id: 'wengu', name: '道心温固', desc: '道心 +2', cost: 2 },
  { id: 'jingang', name: '金刚护体', desc: '横死之际免死一次（寿终无效）', cost: 5 },
];

export const EXTRA_POINTS_BOON = 'tianzi';
export const EXTRA_POINTS_AMOUNT = 2;
export const EXTRA_TALENT_BOON = 'dongtian';
export const EXTRA_TALENT_COUNT = 15;

/** 一世结算获得的道果数：每 100 评分 1 枚，保底 1 枚 */
export function fruitsEarned(score) {
  return Math.max(1, Math.floor(score / 100));
}

export function boonsCost(boonIds) {
  return boonIds.reduce((sum, id) => {
    const boon = BOONS.find((b) => b.id === id);
    return sum + (boon ? boon.cost : 0);
  }, 0);
}

/** 应用出生后生效的机缘（资质点与命格范围在创建阶段处理），不修改传入 state */
export function applyBoons(state, boonIds) {
  let next = state;
  if (boonIds.includes('xianyuan')) {
    next = { ...next, cultivation: next.cultivation + 30 };
  }
  if (boonIds.includes('fuze')) {
    next = { ...next, lifespan: next.lifespan + 30, lifespanBonus: next.lifespanBonus + 30 };
  }
  if (boonIds.includes('wengu')) {
    next = { ...next, attrs: { ...next.attrs, daoxin: Math.min(10, next.attrs.daoxin + 2) } };
  }
  if (boonIds.includes('jingang')) {
    next = { ...next, flags: { ...next.flags, jingang: true } };
  }
  return next;
}
