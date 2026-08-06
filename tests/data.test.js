// 内容库完整性校验：写错一个字段名，游戏不会报错但事件永远不触发——用测试兜住

import { describe, test, expect } from 'vitest';
import { TALENT_POOL, EVENT_POOL } from '../src/data/index.js';

const VALID_EFFECT_KEYS = new Set([
  'linggen', 'wuxing', 'tipo', 'jiashi', 'daoxin', 'cultivation', 'lifespan', 'flag',
]);
const VALID_EVENT_KEYS = new Set([
  'id', 'realmMin', 'realmMax', 'ageMin', 'ageMax', 'weight', 'once', 'cond',
  'text', 'effects', 'deathChance', 'deathText', 'achievement', 'tone',
]);

describe('命格数据', () => {
  test('id 唯一', () => {
    const ids = TALENT_POOL.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('字段完整且 effects 键合法', () => {
    for (const talent of TALENT_POOL) {
      expect(talent.name, talent.id).toBeTruthy();
      expect(talent.desc, talent.id).toBeTruthy();
      expect([1, 2, 3], talent.id).toContain(talent.rarity);
      for (const key of Object.keys(talent.effects || {})) {
        expect(VALID_EFFECT_KEYS.has(key), `${talent.id} 含非法效果键 ${key}`).toBe(true);
      }
    }
  });
});

describe('事件数据', () => {
  test('id 唯一', () => {
    const ids = EVENT_POOL.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('每个事件字段合法', () => {
    for (const event of EVENT_POOL) {
      expect(event.text, event.id).toBeTruthy();
      for (const key of Object.keys(event)) {
        expect(VALID_EVENT_KEYS.has(key), `${event.id} 含非法字段 ${key}`).toBe(true);
      }
      for (const key of Object.keys(event.effects || {})) {
        expect(VALID_EFFECT_KEYS.has(key), `${event.id} 含非法效果键 ${key}`).toBe(true);
      }
      if (event.realmMin != null && event.realmMax != null) {
        expect(event.realmMin, event.id).toBeLessThanOrEqual(event.realmMax);
      }
      if (event.deathChance != null) {
        expect(event.deathChance, event.id).toBeGreaterThan(0);
        expect(event.deathChance, event.id).toBeLessThanOrEqual(1);
        expect(event.deathText, `${event.id} 有死亡概率但缺少 deathText`).toBeTruthy();
      }
      if (event.cond) {
        for (const key of Object.keys(event.cond)) {
          expect(['minAttrs', 'maxAttrs', 'talent', 'flag'], `${event.id} cond 含非法键 ${key}`).toContain(key);
        }
      }
    }
  });

  test('每个境界都有可触发的事件', () => {
    for (let realm = 0; realm <= 6; realm += 1) {
      const available = EVENT_POOL.filter(
        (e) => (e.realmMin ?? 0) <= realm && realm <= (e.realmMax ?? 6),
      );
      expect(available.length, `境界 ${realm} 没有任何事件`).toBeGreaterThan(0);
    }
  });
});
