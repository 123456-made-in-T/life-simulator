import { describe, test, expect } from 'vitest';
import { createRng } from '../src/engine/rng.js';
import {
  createCharacter,
  validateAllocation,
  randomAllocation,
  drawTalents,
  POINT_TOTAL,
} from '../src/engine/character.js';
import { isEligible, pickEvent, applyEvent } from '../src/engine/events.js';
import { advanceTick } from '../src/engine/simulation.js';
import { breakthroughChance } from '../src/engine/realms.js';
import { summarize } from '../src/engine/rating.js';
import { TALENT_POOL, EVENT_POOL } from '../src/data/index.js';

const VALID_ALLOC = { linggen: 8, wuxing: 5, tipo: 4, jiashi: 3 };

function freshState(talents = []) {
  return createCharacter(VALID_ALLOC, talents);
}

describe('rng', () => {
  test('同一种子产生完全相同的序列', () => {
    const a = createRng(42);
    const b = createRng(42);
    for (let i = 0; i < 20; i += 1) {
      expect(a()).toBe(b());
    }
  });

  test('输出在 [0, 1) 区间', () => {
    const rng = createRng(7);
    for (let i = 0; i < 100; i += 1) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('validateAllocation', () => {
  test('合法分配返回 null', () => {
    expect(validateAllocation(VALID_ALLOC)).toBeNull();
  });

  test('点数总和不对时报错', () => {
    expect(validateAllocation({ linggen: 5, wuxing: 5, tipo: 5, jiashi: 6 })).toContain('20');
  });

  test('超出上限时报错', () => {
    expect(validateAllocation({ linggen: 11, wuxing: 3, tipo: 3, jiashi: 3 })).toContain('灵根');
  });

  test('randomAllocation 生成的分配总是合法', () => {
    const rng = createRng(123);
    for (let i = 0; i < 30; i += 1) {
      expect(validateAllocation(randomAllocation(rng))).toBeNull();
    }
  });
});

describe('createCharacter', () => {
  test('命格效果正确应用到属性、寿元和标记', () => {
    const talents = [
      { id: 't1', effects: { linggen: 3, lifespan: 60 } },
      { id: 't2', effects: { flag: 'qiyun' } },
    ];

    const state = freshState(talents);

    expect(state.attrs.linggen).toBe(10);
    expect(state.lifespan).toBe(80 + 60);
    expect(state.flags.qiyun).toBe(true);
    expect(state.talents).toEqual(['t1', 't2']);
  });

  test('属性被命格加成后不会超过上限', () => {
    const state = freshState([{ id: 't', effects: { linggen: 5 } }]);

    expect(state.attrs.linggen).toBe(10);
  });

  test('非法分配直接抛错', () => {
    expect(() => createCharacter({ linggen: 1, wuxing: 1, tipo: 1, jiashi: 1 }, [])).toThrow();
  });
});

describe('drawTalents', () => {
  test('抽取数量正确且无重复', () => {
    const rng = createRng(9);
    const drawn = drawTalents(TALENT_POOL, 10, rng);

    expect(drawn).toHaveLength(10);
    expect(new Set(drawn.map((t) => t.id)).size).toBe(10);
  });
});

describe('events', () => {
  test('境界与年龄范围过滤生效', () => {
    const state = { ...freshState(), realmIndex: 0, age: 5 };

    expect(isEligible({ id: 'x', realmMin: 2 }, state)).toBe(false);
    expect(isEligible({ id: 'x', ageMin: 10 }, state)).toBe(false);
    expect(isEligible({ id: 'x', realmMax: 0, ageMax: 10 }, state)).toBe(true);
  });

  test('once 事件用过后不再出现', () => {
    const state = { ...freshState(), usedEventIds: ['used'] };

    expect(isEligible({ id: 'used', once: true }, state)).toBe(false);
  });

  test('属性条件过滤生效', () => {
    const state = freshState();

    expect(isEligible({ id: 'x', cond: { minAttrs: { linggen: 9 } } }, state)).toBe(false);
    expect(isEligible({ id: 'x', cond: { maxAttrs: { jiashi: 5 } } }, state)).toBe(true);
  });

  test('applyEvent 不修改原状态（不可变）', () => {
    const state = Object.freeze({ ...freshState(), attrs: Object.freeze(freshState().attrs) });
    const event = { id: 'x', effects: { daoxin: 1, cultivation: 10 } };

    const { state: next } = applyEvent(state, event, createRng(1));

    expect(next).not.toBe(state);
    expect(next.attrs.daoxin).toBe(state.attrs.daoxin + 1);
    expect(state.cultivation).toBe(0);
  });

  test('pickEvent 空事件池返回 null', () => {
    expect(pickEvent([], freshState(), createRng(1))).toBeNull();
  });
});

describe('advanceTick 与完整人生', () => {
  test('突破成功率始终在 [0.05, 0.95]', () => {
    for (let realmIndex = 0; realmIndex < 7; realmIndex += 1) {
      const state = { ...freshState(), realmIndex };
      const chance = breakthroughChance(state);
      expect(chance).toBeGreaterThanOrEqual(0.05);
      expect(chance).toBeLessThanOrEqual(0.95);
    }
  });

  test('任意种子的人生都能在有限回合内终结', () => {
    for (const seed of [1, 42, 777, 20260805]) {
      const rng = createRng(seed);
      let state = freshState([TALENT_POOL[0]]);
      let ticks = 0;
      while (state.alive && !state.ascended && ticks < 500) {
        state = advanceTick(state, EVENT_POOL, rng).state;
        ticks += 1;
      }
      expect(state.alive === false || state.ascended === true).toBe(true);
    }
  });

  test('advanceTick 不修改传入状态', () => {
    const state = freshState();
    const snapshot = JSON.parse(JSON.stringify(state));

    advanceTick(state, EVENT_POOL, createRng(5));

    expect(state).toEqual(snapshot);
  });

  test('死亡后的结算包含必要字段', () => {
    const rng = createRng(3);
    let state = freshState();
    let ticks = 0;
    while (state.alive && !state.ascended && ticks < 500) {
      state = advanceTick(state, EVENT_POOL, rng).state;
      ticks += 1;
    }

    const summary = summarize(state);

    expect(summary.score).toBeGreaterThan(0);
    expect(summary.grade).toBeTruthy();
    expect(summary.title).toBeTruthy();
    expect(summary.endingText).toBeTruthy();
  });
});
