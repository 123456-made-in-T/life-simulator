# 问道 · 修仙人生模拟器

文字修仙人生模拟：分配资质 → 抽命格 → 逐年修行随机事件 → 境界突破 → 飞升或陨落结算。

技术栈：Vue 3 + Vite + Vitest，纯前端无后端。

## 快速开始

```bash
npm install
npm run dev      # 本机 http://localhost:5174 （--host 已默认开启，内网可访问）
npm test         # 引擎与内容库单元测试
npm run build    # 打包到 dist/
```

## 玩法规则

- **资质**：20 点自由分配给 灵根（修炼速度/突破率）、悟性（悟道/突破）、体魄（生存底线）、家世（资源机缘），道心初始 5 点随事件浮动
- **境界**：凡人 → 练气 → 筑基 → 金丹 → 元婴 → 化神 → 渡劫 → 飞升，境界越高寿元越长、每回合跨越的岁月越久
- **突破**：修为满 100 触发，成功率 = 境界基础值 + 灵根/悟性/道心加成；失败掉道心，高境界可能走火入魔，渡劫失败五成身死道消
- **死亡**：寿元耗尽 / 体魄归零 / 道心崩溃入魔 / 事件横死 / 天劫陨落
- **结算**：境界、寿数、属性、成就折算评分，评级 D~S 及「仙」

## 目录结构

```
src/
├── engine/            # 纯逻辑，不依赖 Vue，全部有单元测试
│   ├── rng.js         # 可播种随机数（同一命盘编号可复现同一人生）
│   ├── realms.js      # 境界表与修为/突破公式
│   ├── character.js   # 资质分配校验、命格应用
│   ├── events.js      # 事件筛选/加权抽取/效果应用
│   ├── simulation.js  # 每回合状态机（岁月→修为→突破→事件→生死）
│   └── rating.js      # 结算评分
├── data/              # 内容库（改这里加内容，不用动代码）
│   ├── talents.json   # 24 个命格
│   └── events-*.json  # 72 个事件，按境界分早/中/后期三个文件
└── components/        # Vue 界面（水墨宣纸风）
```

## 怎么加内容（最常做的事）

往 `src/data/events-*.json` 里加一条事件即可：

```json
{
  "id": "m099",
  "realmMin": 2, "realmMax": 3,
  "cond": { "minAttrs": { "wuxing": 7 }, "flag": "jiandao" },
  "once": true,
  "weight": 2,
  "text": "事件文本……",
  "effects": { "cultivation": 20, "daoxin": 1 },
  "deathChance": 0.05, "deathText": "死亡文本……",
  "achievement": "成就名"
}
```

字段全部可选（除 id/text）。写错字段名不会报错但事件不生效——`npm test` 里的数据校验测试会帮你抓出来。

## 微信小程序版

`wechat-miniprogram/` 是原生小程序移植（引擎与数据复用，界面用 WXML 重写）。用微信开发者工具导入该目录即可运行，详见 [wechat-miniprogram/README.md](wechat-miniprogram/README.md)。改动 `src/` 后运行 `npm run sync:wx` 同步。

## 练习任务（由易到难）

- [ ] 新增 20 个事件充实中后期剧情
- [ ] 新命格 + 配套专属事件链（flag 机制已支持）
- [ ] 结算页加「人生年表回顾」（logs 已有完整数据）
- [ ] 输入命盘编号复现指定人生（createRng(seed) 已支持）
- [ ] 事件支持玩家二选一抉择（engine 需加 choice 类型）
- [ ] 部署上线分享给朋友
