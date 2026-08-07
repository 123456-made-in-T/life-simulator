import { describe, test, expect } from 'vitest';
import { pickOrigin, assignOrigin } from '../src/engine/origins.js';
import { createCharacter } from '../src/engine/character.js';
import { createRng } from '../src/engine/rng.js';
import { ORIGIN_POOL, EVENT_POOL } from '../src/data/index.js';

describe('出身数据', () => {
  test('id 与 flag 唯一且字段完整', () => {
    const ids = ORIGIN_POOL.map((o) => o.id);
    const flags = ORIGIN_POOL.map((o) => o.flag);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(flags).size).toBe(flags.length);
    for (const origin of ORIGIN_POOL) {
      expect(origin.name, origin.id).toBeTruthy();
      expect(origin.flag, origin.id).toMatch(/^origin_/);
      expect(origin.minJiashi, origin.id).toBeLessThanOrEqual(origin.maxJiashi);
      expect(origin.weight, origin.id).toBeGreaterThan(0);
    }
  });

  test('任何家世值都至少有一种出身可选', () => {
    for (let jiashi = 0; jiashi <= 10; jiashi += 1) {
      const eligible = ORIGIN_POOL.filter(
        (o) => jiashi >= o.minJiashi && jiashi <= o.maxJiashi,
      );
      expect(eligible.length, `家世 ${jiashi} 无可选出身`).toBeGreaterThan(0);
    }
  });

  test('每种出身都有降生事件与至少两个童年事件', () => {
    for (const origin of ORIGIN_POOL) {
      const events = EVENT_POOL.filter((e) => e.cond?.flag === origin.flag);
      const birth = events.filter((e) => (e.ageMax ?? 99) <= 2);

      expect(birth.length, `${origin.id} 缺少降生事件`).toBeGreaterThanOrEqual(1);
      expect(events.length, `${origin.id} 童年事件不足`).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('出身分配', () => {
  test('pickOrigin 遵守家世范围且可复现', () => {
    for (let i = 0; i < 20; i += 1) {
      const origin = pickOrigin(ORIGIN_POOL, 0, createRng(i));
      expect(origin.minJiashi).toBe(0);
    }

    const a = pickOrigin(ORIGIN_POOL, 5, createRng(99));
    const b = pickOrigin(ORIGIN_POOL, 5, createRng(99));
    expect(a.id).toBe(b.id);
  });

  test('assignOrigin 写入出身与标记且不修改原状态', () => {
    const base = createCharacter({ linggen: 8, wuxing: 5, tipo: 4, jiashi: 3 }, []);
    const snapshot = JSON.parse(JSON.stringify(base));

    const next = assignOrigin(base, ORIGIN_POOL, createRng(7));

    expect(next.origin.id).toBeTruthy();
    expect(next.flags[`origin_${next.origin.id}`]).toBe(true);
    expect(base).toEqual(snapshot);
  });
});
