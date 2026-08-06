// 回合推进改为「抉择制」：
//   advanceTick(state, pool, rng) → { state, logs, pending }
//     pending 为 null 时本回合无事发生；否则暂停等玩家选择：
//     { kind: 'event', event }（事件抉择） / { kind: 'breakthrough', chance, isFinal }（突破抉择）
//   resolveChoice(state, pending, optionIndex, rng) → { state, logs } 应用玩家的选择

import {
  REALMS,
  MAX_REALM_INDEX,
  CULTIVATION_CAP,
  ENLIGHTEN_AGE,
  cultivationGain,
  breakthroughChance,
} from './realms.js';
import { clampAttr } from './character.js';
import { pickEvent, applyOption, formatEffects } from './events.js';

const INNER_DEMON_DEATH_CHANCE = 0.5;
const QI_DEVIATION_CHANCE = 0.25;
const TRIBULATION_FAIL_DEATH_CHANCE = 0.55;
// 金丹及以上突破失败有直接殒命之险，境界越高越凶险
const BREAK_FAIL_DEATH_BASE = 0.1;
const BREAK_FAIL_DEATH_PER_REALM = 0.05;
const BREAK_FAIL_DEATH_REALM = 3;
const CONSOLIDATE_CULTIVATION = 80;

export const BREAKTHROUGH_OPTIONS = { ATTEMPT: 0, CONSOLIDATE: 1 };

/** 推进一回合：岁月流逝与修为增长；遇到事件或突破点则返回 pending 等玩家抉择 */
export function advanceTick(state, pool, rng) {
  const logs = [];
  const tickYears = REALMS[state.realmIndex].tickYears;
  let next = { ...state, age: state.age + tickYears };

  // 寿元耗尽（回合跨度大时年龄可能越过寿元，按寿元数收口）
  if (next.age >= next.lifespan) {
    next = { ...next, age: next.lifespan };
    return { ...endLife(next, logs, ageDeathText(next)), pending: null };
  }

  // 修为增长（开蒙之后）
  if (next.age >= ENLIGHTEN_AGE) {
    next = { ...next, cultivation: next.cultivation + cultivationGain(next, tickYears) };
  }

  // 修为圆满：是否冲关由玩家决定
  if (next.cultivation >= CULTIVATION_CAP) {
    const chance = breakthroughChance(next);
    const isFinal = next.realmIndex === MAX_REALM_INDEX;
    const target = isFinal ? '天劫已在头顶酝酿' : `【${REALMS[next.realmIndex + 1].name}】境近在眼前`;
    logs.push(entry(next, `修为圆满！${target}，此番冲关成功率约 ${Math.round(chance * 100)}%。何去何从？`, 'choice'));
    return { state: next, logs, pending: { kind: 'breakthrough', chance, isFinal } };
  }

  // 随机事件：只呈现，不结算，等玩家抉择
  const event = pickEvent(pool, next, rng);
  if (event) {
    if (event.once) {
      next = { ...next, usedEventIds: [...next.usedEventIds, event.id] };
    }
    logs.push(entry(next, event.text, 'choice'));
    return { state: next, logs, pending: { kind: 'event', event } };
  }

  return { state: next, logs, pending: null };
}

/** 应用玩家的选择 */
export function resolveChoice(state, pending, optionIndex, rng) {
  if (pending.kind === 'breakthrough') {
    return resolveBreakthrough(state, optionIndex, rng);
  }
  return resolveEventOption(state, pending.event, optionIndex, rng);
}

function resolveEventOption(state, event, optionIndex, rng) {
  const logs = [];
  const option = event.options[optionIndex];
  if (!option) {
    throw new Error(`事件 ${event.id} 不存在选项 ${optionIndex}`);
  }
  const applied = applyOption(state, option, rng);
  const next = applied.state;
  logs.push(
    entry(next, `你选择「${option.text}」。${option.resultText}${formatEffects(option.effects)}`, option.tone || 'normal'),
  );
  if (applied.died) {
    return endLife(next, logs, applied.deathText);
  }
  return checkVitals(next, rng, logs);
}

function resolveBreakthrough(state, optionIndex, rng) {
  const logs = [];
  if (optionIndex === BREAKTHROUGH_OPTIONS.CONSOLIDATE) {
    const next = {
      ...state,
      cultivation: CONSOLIDATE_CULTIVATION,
      attrs: { ...state.attrs, daoxin: clampAttr(state.attrs.daoxin + 1) },
    };
    logs.push(entry(next, '你按下冲关之念，转而稳固道基，道心愈发沉凝。（道心+1）', 'normal'));
    return { state: next, logs };
  }
  return attemptBreakthrough(state, rng, logs);
}

function attemptBreakthrough(state, rng, logs) {
  const chance = breakthroughChance(state);
  const isFinal = state.realmIndex === MAX_REALM_INDEX;

  if (rng() < chance) {
    if (isFinal) {
      const next = { ...state, ascended: true, alive: true, cultivation: 0 };
      logs.push(entry(next, '九重雷劫尽数渡过，天门大开，霞光万道——你褪去凡躯，飞升上界！', 'ascend'));
      return { state: next, logs };
    }
    const realmIndex = state.realmIndex + 1;
    const next = {
      ...state,
      realmIndex,
      cultivation: 0,
      lifespan: REALMS[realmIndex].lifespan + state.lifespanBonus,
    };
    logs.push(entry(next, `丹田轰鸣，气象一新——突破至【${REALMS[realmIndex].name}】境！寿元大增。`, 'breakthrough'));
    return { state: next, logs };
  }

  // 冲关失败
  let next = {
    ...state,
    cultivation: CONSOLIDATE_CULTIVATION - 20,
    attrs: { ...state.attrs, daoxin: clampAttr(state.attrs.daoxin - 1) },
  };

  if (isFinal && rng() < TRIBULATION_FAIL_DEATH_CHANCE) {
    logs.push(entry(next, '天劫之下，金身寸寸碎裂……', 'death'));
    return { state: { ...next, alive: false, endingText: '渡劫失败，身死道消，魂飞魄散于九天雷海。' }, logs };
  }

  if (next.realmIndex >= BREAK_FAIL_DEATH_REALM) {
    const deathChance =
      BREAK_FAIL_DEATH_BASE + (next.realmIndex - BREAK_FAIL_DEATH_REALM) * BREAK_FAIL_DEATH_PER_REALM;
    if (rng() < deathChance) {
      logs.push(entry(next, '冲关失败，真元逆冲，经脉寸断……', 'death'));
      return { state: { ...next, alive: false, endingText: '强行冲关走火入魔，经脉尽断而亡。' }, logs };
    }
    next = { ...next, attrs: { ...next.attrs, tipo: clampAttr(next.attrs.tipo - 2) } };
    logs.push(entry(next, '冲关失败，走火入魔，你重伤吐血堪堪保住性命。（体魄-2 道心-1）', 'bad'));
    return checkVitals(next, rng, logs);
  }

  if (rng() < QI_DEVIATION_CHANCE) {
    next = { ...next, attrs: { ...next.attrs, tipo: clampAttr(next.attrs.tipo - 2) } };
    logs.push(entry(next, '冲关失败，气机紊乱伤了根基。（体魄-2 道心-1）', 'bad'));
    return checkVitals(next, rng, logs);
  }

  logs.push(entry(next, '气机溃散，冲关失败，道心蒙尘。（修为受挫 道心-1）', 'bad'));
  return checkVitals(next, rng, logs);
}

/** 抉择结算后的生死检查：体魄耗尽 / 道心崩溃 */
function checkVitals(state, rng, logs) {
  if (state.attrs.tipo <= 0) {
    const text =
      state.age <= 3
        ? '先天孱弱，你没能熬过襁褓岁月，一生早早画上了句点。'
        : '沉疴缠身，药石无医，溘然长逝。';
    return endLife(state, logs, text);
  }
  if (state.attrs.daoxin <= 0) {
    return resolveInnerDemon(state, rng, logs);
  }
  return { state, logs };
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
