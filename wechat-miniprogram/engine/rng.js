// 可播种的伪随机数生成器（mulberry32）。
// 注意：种子只决定随机序列；要完整复现一段人生，还需同时记录
// 资质分配与命格选择（见 README 练习任务「复现指定人生」）

export function createRng(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed() {
  return Math.floor(Math.random() * 2 ** 31);
}
