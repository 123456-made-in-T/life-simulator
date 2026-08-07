import talents from './talents.json';
import origins from './origins.json';
import achievements from './achievements.json';
import earlyEvents from './events-early.json';
import midEvents from './events-mid.json';
import lateEvents from './events-late.json';

export const TALENT_POOL = talents;
export const ORIGIN_POOL = origins;
export const ACHIEVEMENT_INDEX = achievements;
export const EVENT_POOL = [...earlyEvents, ...midEvents, ...lateEvents];
