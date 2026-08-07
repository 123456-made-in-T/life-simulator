#!/usr/bin/env node
// 把 src/engine 与 src/data 同步到微信小程序目录。
// 小程序不支持 import JSON，这里把 JSON 转成 export default 的 JS 模块。
// 用法：npm run sync:wx

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  copyFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const wxRoot = join(root, 'wechat-miniprogram');

// 引擎：纯逻辑无依赖，原样复制
const engineSrc = join(root, 'src/engine');
const engineDst = join(wxRoot, 'engine');
mkdirSync(engineDst, { recursive: true });
for (const file of readdirSync(engineSrc)) {
  copyFileSync(join(engineSrc, file), join(engineDst, file));
}

// 数据：JSON → JS 模块
const dataSrc = join(root, 'src/data');
const dataDst = join(wxRoot, 'data');
mkdirSync(dataDst, { recursive: true });
const jsonFiles = ['talents.json', 'origins.json', 'achievements.json', 'events-early.json', 'events-mid.json', 'events-late.json'];
for (const file of jsonFiles) {
  const json = readFileSync(join(dataSrc, file), 'utf8').trim();
  const banner = `// 由 scripts/sync-wx.js 从 src/data/${file} 自动生成，勿手改\n`;
  writeFileSync(join(dataDst, file.replace('.json', '.js')), `${banner}export default ${json};\n`);
}

writeFileSync(
  join(dataDst, 'index.js'),
  `// 由 scripts/sync-wx.js 自动生成，勿手改
import talents from './talents.js';
import origins from './origins.js';
import achievements from './achievements.js';
import earlyEvents from './events-early.js';
import midEvents from './events-mid.js';
import lateEvents from './events-late.js';

export const TALENT_POOL = talents;
export const ORIGIN_POOL = origins;
export const ACHIEVEMENT_INDEX = achievements;
export const EVENT_POOL = [...earlyEvents, ...midEvents, ...lateEvents];
`,
);

console.log('已同步 engine 与 data 到 wechat-miniprogram/');
