import { describe, test, expect } from 'vitest';
import { ARTIFACTS, equipArtifact } from '../src/engine/artifacts.js';
import { createCharacter } from '../src/engine/character.js';
import { breakthroughChance, cultivationGain } from '../src/engine/realms.js';
import { adjustedDeathChance } from '../src/engine/difficulty.js';
import { resolveChoice } from '../src/engine/simulation.js';
import { createRng } from '../src/engine/rng.js';

const ALLOC = { linggen: 8, wuxing: 5, tipo: 4, jiashi: 3 };

describe('本命法宝', () => {
  test('装备青莲剑提高冲关成功率', () => {
    const base = createCharacter(ALLOC, []);
    const armed = equipArtifact(base, 'qinglian');

    expect(armed.artifact.name).toBe('青莲剑');
    expect(breakthroughChance(armed)).toBeCloseTo(breakthroughChance(base) + 0.04);
    expect(base.artifact).toBeNull();
  });

  test('造化葫芦加速修为增长', () => {
    const base = createCharacter(ALLOC, []);
    const armed = equipArtifact(base, 'zaohua');

    expect(cultivationGain(armed, 10)).toBeCloseTo(cultivationGain(base, 10) * 1.15);
  });

  test('玄龟盾降低死亡概率', () => {
    const armed = equipArtifact(createCharacter(ALLOC, []), 'xuangui');

    expect(adjustedDeathChance(0.2, armed.difficulty, armed.artifact)).toBeCloseTo(0.2 * 1.25 * 0.85);
  });

  test('长生玉加寿元且计入 lifespanBonus，清心铃赋予心魔护佑', () => {
    const base = createCharacter(ALLOC, []);

    const jade = equipArtifact(base, 'changsheng');
    expect(jade.lifespan).toBe(base.lifespan + 100);
    expect(jade.lifespanBonus).toBe(base.lifespanBonus + 100);

    const bell = equipArtifact(base, 'qingxin');
    expect(bell.flags.mingjing).toBe(true);
  });

  test('一世限持一件：已有法宝时再获取被忽略', () => {
    const first = equipArtifact(createCharacter(ALLOC, []), 'qinglian');
    const second = equipArtifact(first, 'xuangui');

    expect(second.artifact.id).toBe('qinglian');
  });

  test('事件选项授予法宝，且在死亡判定前生效', () => {
    const event = {
      id: 'x',
      text: '宝',
      options: [{ text: '取宝', resultText: '得盾。', artifact: 'xuangui', deathChance: 0.5 }],
    };

    const { state } = resolveChoice(
      createCharacter(ALLOC, []),
      { kind: 'event', event },
      0,
      createRng(4),
    );

    expect(state.artifact?.id).toBe('xuangui');
  });

  test('法宝定义字段完整', () => {
    for (const artifact of Object.values(ARTIFACTS)) {
      expect(artifact.name, artifact.id).toBeTruthy();
      expect(artifact.desc, artifact.id).toBeTruthy();
    }
  });
});
