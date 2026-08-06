# 问道 · 微信小程序版

网页版的微信小程序移植。这个游戏是纯 UI 交互（不是 canvas 游戏），所以做成**原生小程序**（compileType: miniprogram，不是小游戏）：

- **复用**：`engine/`（引擎）和 `data/`（内容库）由 `npm run sync:wx` 从 `src/` 自动同步——小程序不支持 import JSON，同步脚本会把事件库转成 JS 模块
- **重写**：`pages/index/` 用 WXML/WXSS 重写了网页版的四个界面（资质分配 → 命格抽取 → 人生时间线 → 结算），逻辑与 App.vue 一一对应

## 怎么跑

微信开发者工具只有 Windows/Mac 版，需在你自己的电脑上：

1. 安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 把整个仓库 clone 到电脑，或只拷贝 `wechat-miniprogram/` 文件夹
3. 开发者工具 → 导入项目 → 选择 **`wechat-miniprogram/` 文件夹本身** → AppID 选「测试号」即可在模拟器里玩
4. 想在手机上玩：AppID 换成自己注册的小程序 AppID（个人主体免费注册），点「预览」扫码

## 改了 src/ 之后

```bash
npm run sync:wx   # 同步引擎和数据到小程序目录
npm test          # wechatSync.test.js 会校验同步产物与源码一致
```

页面层（pages/）是独立维护的，只有引擎和数据参与同步。

## 发布说明

- **模拟器 / 真机预览 / 体验版**：无需审核，加体验成员后朋友扫码即玩
- **正式对公众发布**：本内容属游戏，按微信规则需走小游戏类目及相应资质（软著等），个人练手阶段用体验版即可
