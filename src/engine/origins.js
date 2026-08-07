// 出身系统：按家世随机决定降生环境，出身标记（flag）驱动专属童年事件链

/** 按家世筛选可能的出身，再按权重随机（家世都不匹配时退回全池） */
export function pickOrigin(pool, jiashi, rng) {
  const eligible = pool.filter(
    (o) => jiashi >= (o.minJiashi ?? 0) && jiashi <= (o.maxJiashi ?? 10),
  );
  const candidates = eligible.length > 0 ? eligible : pool;
  const totalWeight = candidates.reduce((sum, o) => sum + (o.weight ?? 1), 0);
  let roll = rng() * totalWeight;
  for (const origin of candidates) {
    roll -= origin.weight ?? 1;
    if (roll <= 0) {
      return origin;
    }
  }
  return candidates[candidates.length - 1];
}

/** 给新角色赋予出身（不修改传入 state） */
export function assignOrigin(state, pool, rng) {
  const origin = pickOrigin(pool, state.attrs.jiashi, rng);
  return {
    ...state,
    origin: { id: origin.id, name: origin.name },
    flags: { ...state.flags, [origin.flag]: true },
  };
}
