// 生平战绩：纯逻辑（记录构建、榜单维护、生涯统计），持久化由各端自行实现

export const MAX_RECORDS = 50;

/** 由一世的结算生成一条战绩记录 */
export function buildRecord(summary, seed, timestamp) {
  const d = new Date(timestamp);
  const pad = (n) => String(n).padStart(2, '0');
  return {
    score: summary.score,
    grade: summary.grade,
    title: summary.title,
    realmName: summary.realmName,
    age: summary.age,
    difficultyName: summary.difficultyName,
    achievementCount: summary.achievements.length,
    seed,
    at: timestamp,
    dateText: `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`,
  };
}

/** 新纪录插到最前，超出上限的老记录被裁掉（不修改原数组） */
export function addRecord(records, record) {
  return [record, ...records].slice(0, MAX_RECORDS);
}

/** 生涯统计 */
export function computeCareer(records) {
  if (records.length === 0) {
    return { total: 0, bestScore: 0, ascensions: 0, maxAge: 0 };
  }
  return {
    total: records.length,
    bestScore: Math.max(...records.map((r) => r.score)),
    ascensions: records.filter((r) => r.realmName === '飞升仙界').length,
    maxAge: Math.max(...records.map((r) => r.age)),
  };
}
