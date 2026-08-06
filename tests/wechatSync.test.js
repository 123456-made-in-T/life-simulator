// 守护微信小程序同步产物：引擎副本可加载、数据模块与源 JSON 完全一致
// 改了 src/ 之后忘记跑 npm run sync:wx 时，这里会报错提醒

import { describe, test, expect } from 'vitest';
import srcTalents from '../src/data/talents.json';
import srcEarly from '../src/data/events-early.json';
import srcMid from '../src/data/events-mid.json';
import srcLate from '../src/data/events-late.json';

describe('微信小程序同步产物', () => {
  test('数据模块与源 JSON 完全一致', async () => {
    const [talents, early, mid, late] = await Promise.all([
      import('../wechat-miniprogram/data/talents.js'),
      import('../wechat-miniprogram/data/events-early.js'),
      import('../wechat-miniprogram/data/events-mid.js'),
      import('../wechat-miniprogram/data/events-late.js'),
    ]);

    expect(talents.default).toEqual(srcTalents);
    expect(early.default).toEqual(srcEarly);
    expect(mid.default).toEqual(srcMid);
    expect(late.default).toEqual(srcLate);
  });

  test('引擎副本可加载且与源版本行为一致', async () => {
    const wxSim = await import('../wechat-miniprogram/engine/simulation.js');
    const wxRng = await import('../wechat-miniprogram/engine/rng.js');
    const srcSim = await import('../src/engine/simulation.js');
    const srcRng = await import('../src/engine/rng.js');
    const { createCharacter } = await import('../src/engine/character.js');
    const { EVENT_POOL } = await import('../src/data/index.js');

    const alloc = { linggen: 8, wuxing: 5, tipo: 4, jiashi: 3 };
    const runLife = (advanceTick, createRng) => {
      let state = createCharacter(alloc, []);
      const rng = createRng(2026);
      let ticks = 0;
      while (state.alive && !state.ascended && ticks < 500) {
        state = advanceTick(state, EVENT_POOL, rng).state;
        ticks += 1;
      }
      return state;
    };

    expect(runLife(wxSim.advanceTick, wxRng.createRng)).toEqual(
      runLife(srcSim.advanceTick, srcRng.createRng),
    );
  });
});
