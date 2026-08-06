// 推进一回合：岁月流逝 → 修为增长 → 突破判定 → 随机事件 → 生死检查
// 全部纯函数：advanceTick(state, pool, rng) → { state, logs }

import {
  REALMS,
  MAX_REALM_INDEX,
  CULTIVATION_CAP,
  ENLIGHTEN_AGE,
  cultivationGain,
  breakthroughChance,
} from './realms.js';
import { clampAttr } from './character.js';
import { pickEvent, applyEvent, formatEffects } from './events.js';

const INNER_DEMON_DEATH_CHANCE = 0.4;
const QI_DEVIATION_CHANCE = 0.15;
const TRIBULATION_FAIL_DEATH_CHANCE = 0.5;

/** 推进一回合，返回新状态和这一回合产生的日志条目 */
export function advanceTick(state, pool, rng) {
  const logs = [];
  const tickYears = REALMS[state.realmIndex].tickYears;
  let next = { ...state, age: state.age + tickYears };

  // 寿元耗尽（回合跨度大时年龄可能越过寿元，按寿元数收口）
  if (next.age >= next.lifespan) {
    next = { ...next, age: next.lifespan };
    return endLife(next, logs, ageDeathText(next));
  }

  // 修为增长（开蒙之后）
  if (next.age >= ENLIGHTEN_AGE) {
    next = { ...next, cultivation: next.cultivation + cultivationGain(next, tickYears) };
  }

  // 突破判定
  if (next.cultivation >= CULTIVATION_CAP) {
    const result = attemptBreakthrough(next, rng, logs);
    next = result.state;
    if (!next.alive || next.ascended) {
      return { state: next, logs };
    }
  }

  // 随机事件
  const event = pickEvent(pool, next, rng);
  if (event) {
    const applied = applyEvent(next, event, rng);
    next = applied.state;
    logs.push(entry(next, `${event.text}${formatEffects(event.effects)}`, event.tone || 'normal'));
    if (applied.died) {
      return endLife(next, logs, applied.deathText);
    }
  }

  // 体魄耗尽
  if (next.attrs.tipo <= 0) {
    const text =
      next.age <= 3
        ? '先天孱弱，你没能熬过襁褓岁月，一生早早画上了句点。'
        : '沉疴缠身，药石无医，溘然长逝。';
    return endLife(next, logs, text);
  }

  // 道心崩溃：心魔入体
  if (next.attrs.daoxin <= 0) {
    return resolveInnerDemon(next, rng, logs);
  }

  return { state: next, logs };
}

function attemptBreakthrough(state, rng, logs) {
  const chance = breakthroughChance(state);
  const isFinal = state.realmIndex === MAX_REALM_INDEX;

  if (rng() < chance) {
    if (isFinal) {
      const next = { ...state, ascended: true, alive: true, cultivation: 0 };
      logs.push(entry(next, '九重雷劫尽数渡过，天门大开，霞光万道——你褪去凡躯，飞升上界！', 'ascend'));
      return { state: next };
    }
    const realmIndex = state.realmIndex + 1;
    const next = {
      ...state,
      realmIndex,
      cultivation: 0,
      lifespan: REALMS[realmIndex].lifespan + state.lifespanBonus,
    };
    logs.push(entry(next, `丹田轰鸣，气象一新——突破至【${REALMS[realmIndex].name}】境！寿元大增。`, 'breakthrough'));
    return { state: next };
  }

  // 突破失败
  let next = {
    ...state,
    cultivation: 60,
    attrs: { ...state.attrs, daoxin: clampAttr(state.attrs.daoxin - 1) },
  };

  if (isFinal && rng() < TRIBULATION_FAIL_DEATH_CHANCE) {
    logs.push(entry(next, '天劫之下，金身寸寸碎裂……', 'death'));
    return { state: { ...next, alive: false, endingText: '渡劫失败，身死道消，魂飞魄散于九天雷海。' } };
  }

  if (next.realmIndex >= 4 && rng() < QI_DEVIATION_CHANCE) {
    next = { ...next, attrs: { ...next.attrs, tipo: clampAttr(next.attrs.tipo - 2) } };
    logs.push(entry(next, '冲关失败，走火入魔，经脉受创。（体魄-2 道心-1）', 'bad'));
  } else {
    logs.push(entry(next, '气机紊乱，突破失败，道心蒙尘。（修为受挫 道心-1）', 'bad'));
  }
  return { state: next };
}

function resolveInnerDemon(state, rng, logs) {
  if (state.flags.mingjing) {
    const next = { ...state, attrs: { ...state.attrs, daoxin: 3 } };
    logs.push(entry(next, '心魔滋生，幸得道心通明护佑，灵台重归清净。（道心回稳）', 'normal'));
    return { state: next, logs };
  }
  if (rng() < INNER_DEMON_DEATH_CHANCE) {
    logs.push(entry(state, '心魔吞噬灵台，你在疯癫中耗尽了最后一丝神智……', 'death'));
    return { state: { ...state, alive: false, endingText: '道心崩溃，入魔而亡。' }, logs };
  }
  const next = {
    ...state,
    attrs: { ...state.attrs, daoxin: 3 },
    cultivation: Math.max(0, state.cultivation - 30),
  };
  logs.push(entry(next, '心魔来袭！你散去部分修为，堪堪守住灵台。（修为-30 道心回稳）', 'bad'));
  return { state: next, logs };
}

function endLife(state, logs, endingText) {
  logs.push(entry(state, endingText, 'death'));
  return { state: { ...state, alive: false, endingText }, logs };
}

function ageDeathText(state) {
  if (state.realmIndex === 0) {
    return '你走完了凡人的一生，儿孙绕膝，含笑而终。';
  }
  return `寿元耗尽，你于洞府中盘膝坐化，一缕青烟散入天地。（${REALMS[state.realmIndex].name}境）`;
}

function entry(state, text, tone) {
  return { age: state.age, realm: REALMS[Math.min(state.realmIndex, MAX_REALM_INDEX)].name, text, tone };
}
