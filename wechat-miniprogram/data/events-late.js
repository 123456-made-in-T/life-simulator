// 由 scripts/sync-wx.js 从 src/data/events-late.json 自动生成，勿手改
export default [
  { "id": "l001", "realmMin": 4, "realmMax": 4, "once": true, "weight": 2, "text": "元婴出窍，神游千里。俯瞰云海翻涌，你第一次真切触摸到『长生』二字的重量。", "effects": { "daoxin": 1 } },
  { "id": "l002", "realmMin": 4, "realmMax": 6, "weight": 2, "text": "你于洞府深处闭死关，一坐便是数十载，石壁上滴水成痕。", "effects": { "cultivation": 20 } },
  { "id": "l003", "realmMin": 4, "realmMax": 5, "once": true, "text": "你开宗立派，广收门徒。山门立于云巅，钟声可闻百里。", "effects": { "jiashi": 2, "daoxin": 1 }, "achievement": "开宗立派" },
  { "id": "l004", "realmMin": 4, "realmMax": 5, "text": "一位垂死老魔妄图夺舍你的肉身！神魂大战一触即发。", "effects": { "daoxin": -1 }, "deathChance": 0.07, "deathText": "神魂交锋落败，你的躯壳成了老魔的新衣。" },
  { "id": "l005", "realmMin": 4, "realmMax": 5, "once": true, "cond": { "minAttrs": { "daoxin": 8 } }, "text": "你散尽半生积蓄，设下大阵护佑一方凡人城池百年平安。功德无量，道心愈发圆满。", "effects": { "daoxin": 2 }, "achievement": "功德护城" },
  { "id": "l006", "realmMin": 4, "realmMax": 5, "text": "两位大能斗法波及你的洞府，你抢出关键物件，府邸却夷为平地。", "effects": { "jiashi": -1, "daoxin": -1 } },
  { "id": "l007", "realmMin": 4, "realmMax": 6, "once": true, "cond": { "flag": "qiyun" }, "text": "上古遗迹现世！你在万千修士中拔得头筹，取走传承玉简。", "effects": { "cultivation": 40, "wuxing": 1 }, "achievement": "上古传承" },
  { "id": "l008", "realmMin": 4, "realmMax": 5, "once": true, "text": "红尘炼心。你化名凡人在市井生活十年，卖过豆腐，教过蒙学，尝尽烟火滋味。", "effects": { "daoxin": 2, "cultivation": 15 }, "achievement": "红尘炼心" },
  { "id": "l009", "realmMin": 5, "realmMax": 5, "once": true, "weight": 2, "text": "化神之后，一念可动风雷。你却愈发谨言慎行——境界越高，越知天道无情。", "effects": { "daoxin": 1 } },
  { "id": "l010", "realmMin": 5, "realmMax": 6, "text": "你推演飞升之路，古籍残卷堆满石室，仍只窥得只鳞片爪。", "effects": { "cultivation": 15, "wuxing": 1 } },
  { "id": "l011", "realmMin": 5, "realmMax": 6, "once": true, "text": "昔日道侣寿元将尽。你握着那双苍老的手，第一次恨自己修的是无情道。", "effects": { "daoxin": -2, "cultivation": 10 } },
  { "id": "l012", "realmMin": 5, "realmMax": 6, "text": "域外天魔渗入界内，你出手镇压，一战天昏地暗。", "effects": { "cultivation": 20 }, "deathChance": 0.08, "deathText": "天魔自爆，你与它同归于尽，护住了身后苍生。" },
  { "id": "l013", "realmMin": 5, "realmMax": 6, "once": true, "cond": { "flag": "jiandao" }, "text": "你于雷海之上悟出本命剑意，一剑既出，天地失色。", "effects": { "cultivation": 30, "daoxin": 1 }, "achievement": "剑意通神" },
  { "id": "l014", "realmMin": 6, "realmMax": 6, "once": true, "weight": 3, "text": "天空阴云密布，紫雷在云层中游走——天劫将至，你整衣冠，静候雷音。", "effects": { "daoxin": 1 } },
  { "id": "l015", "realmMin": 6, "realmMax": 6, "text": "你为渡劫做最后的准备：布阵、炼宝、稳固道基，不敢有一丝懈怠。", "effects": { "cultivation": 15, "tipo": 1 } },
  { "id": "l016", "realmMin": 4, "realmMax": 6, "cond": { "maxAttrs": { "daoxin": 4 } }, "text": "岁月太长，长到你偶尔会忘记自己为何修行。道心蒙尘。", "effects": { "daoxin": -1 } },
  { "id": "l017", "realmMin": 4, "realmMax": 6, "once": true, "cond": { "flag": "dandao" }, "text": "你炼成一炉九转还魂丹，救回宗门一位陨落边缘的老祖，声望如日中天。", "effects": { "jiashi": 2, "daoxin": 1 }, "achievement": "丹道大成" },
  { "id": "l018", "realmMin": 4, "realmMax": 6, "weight": 2, "text": "又一甲子弹指而过。山下王朝换了国姓，你洞府门前的松树粗了一圈。" }
];
