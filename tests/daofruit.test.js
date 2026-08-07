import { describe, test, expect } from 'vitest';
import { fruitsEarned, boonsCost, applyBoons, BOONS } from '../src/engine/daofruit.js';
import { createCharacter } from '../src/engine/character.js';
import { resolveChoice } from '../src/engine/simulation.js';
import { createRng } from '../src/engine/rng.js';

const ALLOC = { linggen: 8, wuxing: 5, tipo: 4, jiashi: 3 };

describe('转世道果', () => {
  test('道果收益：每 100 评分 1 枚，保底 1 枚', () => {
    expect(fruitsEarned(30)).toBe(1);
    expect(fruitsEarned(199)).toBe(1);
    expect(fruitsEarned(200)).toBe(2);
    expect(fruitsEarned(1500)).toBe(15);
  });

  test('机缘定价合计正确，未知 id 忽略', () => {
    expect(boonsCost(['tianzi', 'jingang'])).toBe(8);
    expect(boonsCost(['不存在'])).toBe(0);
    for (const boon of BOONS) {
      expect(boon.cost, boon.id).toBeGreaterThan(0);
    }
  });

  test('applyBoons 应用出生后机缘且不修改原状态', () => {
    const base = createCharacter(ALLOC, []);
    const snapshot = JSON.parse(JSON.stringify(base));

    const next = applyBoons(base, ['xianyuan', 'fuze', 'wengu', 'jingang']);

    expect(next.cultivation).toBe(30);
    expect(next.lifespan).toBe(base.lifespan + 30);
    expect(next.lifespanBonus).toBe(base.lifespanBonus + 30);
    expect(next.attrs.daoxin).toBe(7);
    expect(next.flags.jingang).toBe(true);
    expect(base).toEqual(snapshot);
  });

  test('金刚护体：横死免死一次并消耗，第二次不再生效', () => {
    const lethalEvent = {
      id: 'x',
      text: '劫',
      options: [
        { text: '赴死', resultText: '你迎了上去。', deathChance: 1, deathText: '你死了。' },
      ],
    };
    const pending = { kind: 'event', event: lethalEvent };
    let state = applyBoons(createCharacter(ALLOC, []), ['jingang']);

    const first = resolveChoice(state, pending, 0, createRng(1));
    expect(first.state.alive).toBe(true);
    expect(first.state.flags.jingang).toBe(false);

    const second = resolveChoice(first.state, pending, 0, createRng(2));
    expect(second.state.alive).toBe(false);
  });

  test('金刚护体挡不住寿终', async () => {
    const { advanceTick } = await import('../src/engine/simulation.js');
    const state = {
      ...applyBoons(createCharacter(ALLOC, []), ['jingang']),
      age: 79,
    };

    const result = advanceTick(state, [], createRng(1));

    expect(result.state.alive).toBe(false);
  });
});
