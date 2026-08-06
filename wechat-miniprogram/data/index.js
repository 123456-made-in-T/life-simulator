// 由 scripts/sync-wx.js 自动生成，勿手改
import talents from './talents.js';
import earlyEvents from './events-early.js';
import midEvents from './events-mid.js';
import lateEvents from './events-late.js';

export const TALENT_POOL = talents;
export const EVENT_POOL = [...earlyEvents, ...midEvents, ...lateEvents];
