import talents from './talents.json';
import earlyEvents from './events-early.json';
import midEvents from './events-mid.json';
import lateEvents from './events-late.json';

export const TALENT_POOL = talents;
export const EVENT_POOL = [...earlyEvents, ...midEvents, ...lateEvents];
