import { describe, test, expect } from 'vitest';
import { buildRecord, addRecord, computeCareer, MAX_RECORDS } from '../src/engine/records.js';

const SUMMARY = {
  score: 320,
  grade: 'A',
  title: '结丹真人',
  realmName: '金丹',
  age: 210,
  difficultyName: '凡人',
  achievements: ['丹成一品', '善名远播'],
};

describe('生平战绩', () => {
  test('buildRecord 提取结算字段并格式化日期', () => {
    const record = buildRecord(SUMMARY, 12345, new Date(2026, 7, 7).getTime());

    expect(record.score).toBe(320);
    expect(record.title).toBe('结丹真人');
    expect(record.achievementCount).toBe(2);
    expect(record.seed).toBe(12345);
    expect(record.dateText).toBe('2026.08.07');
  });

  test('addRecord 新纪录在前、封顶上限、不修改原数组', () => {
    const old = Object.freeze([{ at: 1, score: 10 }]);

    const next = addRecord(old, { at: 2, score: 20 });

    expect(next[0].at).toBe(2);
    expect(next).toHaveLength(2);
    expect(old).toHaveLength(1);

    let many = [];
    for (let i = 0; i < MAX_RECORDS + 5; i += 1) {
      many = addRecord(many, { at: i, score: i });
    }
    expect(many).toHaveLength(MAX_RECORDS);
  });

  test('computeCareer 统计轮回/最高分/飞升/最高寿数', () => {
    const records = [
      { score: 100, realmName: '金丹', age: 300 },
      { score: 1500, realmName: '飞升仙界', age: 2800 },
      { score: 60, realmName: '凡人', age: 78 },
    ];

    const career = computeCareer(records);

    expect(career.total).toBe(3);
    expect(career.bestScore).toBe(1500);
    expect(career.ascensions).toBe(1);
    expect(career.maxAge).toBe(2800);
  });

  test('空记录返回零值统计', () => {
    expect(computeCareer([])).toEqual({ total: 0, bestScore: 0, ascensions: 0, maxAge: 0 });
  });
});
