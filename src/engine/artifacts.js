// 本命法宝：一世限持一件，由事件选项（option.artifact）授予，效果常驻

export const ARTIFACTS = {
  qinglian: { id: 'qinglian', name: '青莲剑', desc: '剑冢认主之剑，冲关成功率 +4%', breakBonus: 0.04 },
  xuangui: { id: 'xuangui', name: '玄龟盾', desc: '海眼玄龟甲所炼，死亡概率 ×0.85', deathMul: 0.85 },
  zaohua: { id: 'zaohua', name: '造化葫芦', desc: '吞吐天地灵机，修为增速 ×1.15', cultMul: 1.15 },
  changsheng: { id: 'changsheng', name: '长生玉', desc: '上古残魂遗赠，寿元 +100', lifespan: 100 },
  qingxin: { id: 'qingxin', name: '清心铃', desc: '铃音涤荡心魔，心魔不再致命', grantFlag: 'mingjing' },
  juling: { id: 'juling', name: '聚灵珠', desc: '聚灵成雾，修为增速 ×1.08、冲关 +2%', cultMul: 1.08, breakBonus: 0.02 },
};

/** 装备法宝（已有本命法宝则忽略），返回新 state */
export function equipArtifact(state, artifactId) {
  const def = ARTIFACTS[artifactId];
  if (!def || state.artifact) {
    return state;
  }
  let next = {
    ...state,
    artifact: {
      id: def.id,
      name: def.name,
      breakBonus: def.breakBonus ?? 0,
      cultMul: def.cultMul ?? 1,
      deathMul: def.deathMul ?? 1,
    },
  };
  if (def.lifespan) {
    next = { ...next, lifespan: next.lifespan + def.lifespan, lifespanBonus: next.lifespanBonus + def.lifespan };
  }
  if (def.grantFlag) {
    next = { ...next, flags: { ...next.flags, [def.grantFlag]: true } };
  }
  return next;
}
