// 由 scripts/sync-wx.js 从 src/data/events-late.json 自动生成，勿手改
export default [
  {
    "id": "l001", "realmMin": 4, "realmMax": 4, "once": true, "weight": 2,
    "text": "元婴初成，可离体神游。第一次俯瞰云海时，你真切触到了『长生』二字的重量。",
    "options": [
      { "text": "纵婴远游，探索天地", "resultText": "元婴掠过千山万水，见识了海眼、地火与极北冰原。天地之大，远超想象。", "effects": { "wuxing": 1, "cultivation": 10 }, "deathChance": 0.08, "deathText": "元婴离体太远遭了暗算，你的躯壳在洞府中悄然冷却。" },
      { "text": "谨守洞府，温养元婴", "resultText": "你按捺住远游之心，把元婴温养得凝实如玉。", "effects": { "cultivation": 15, "daoxin": 1 } }
    ]
  },
  {
    "id": "l003", "realmMin": 4, "realmMax": 5, "once": true,
    "text": "追随者渐众，有人劝你开宗立派，也有人劝你莫沾因果。",
    "options": [
      { "text": "开宗立派", "resultText": "山门立于云巅，钟声可闻百里。从此你不只为自己修行。", "effects": { "jiashi": 2, "daoxin": 1 }, "achievement": "开宗立派" },
      { "text": "散去众人，独行大道", "resultText": "你遣散了追随者，仍是一人一剑一洞府。清净，也清冷。", "effects": { "cultivation": 15 } }
    ]
  },
  {
    "id": "l004", "realmMin": 4, "realmMax": 5,
    "text": "一位寿元将尽的老魔盯上了你的躯壳，神魂如附骨之疽般缠了上来——夺舍！",
    "options": [
      { "text": "神魂硬撼", "resultText": "识海中日月无光的一战！你绞碎了老魔的神魂，还从他的记忆碎片里捡到了几分造化。", "effects": { "wuxing": 1, "cultivation": 15 }, "deathChance": 0.18, "deathText": "神魂交锋落败，你的躯壳成了老魔的新衣。" },
      { "text": "自散修为，玉石俱焚相逼", "resultText": "你散去三成修为布下绝魂阵，老魔见讨不到便宜，悻悻退去。", "effects": { "cultivation": -30, "daoxin": 1 }, "deathChance": 0.05, "deathText": "老魔看穿了你的虚张声势，一举夺了你的躯壳。" }
    ]
  },
  {
    "id": "l005", "realmMin": 4, "realmMax": 5, "once": true, "cond": { "minAttrs": { "daoxin": 8 } },
    "text": "山下凡人城池将遭大劫，护城需散尽你半生积蓄布下大阵，且百年内不得远离。",
    "options": [
      { "text": "散财布阵，护城百年", "resultText": "大阵成时，满城香火升腾。功德无量，道心愈发圆满。", "effects": { "jiashi": -2, "daoxin": 2 }, "achievement": "功德护城" },
      { "text": "天地不仁，不沾因果", "resultText": "你远远看了那座城最后一眼，御剑离去。后来的事，你没有再打听。", "effects": { "cultivation": 10, "daoxin": -2 } }
    ]
  },
  {
    "id": "l007", "realmMin": 4, "realmMax": 6, "once": true, "cond": { "flag": "qiyun" },
    "text": "上古遗迹现世，万千修士蜂拥而至。传承大殿的门楣上写着：一线生机，十死无生。",
    "options": [
      { "text": "闯传承大殿", "resultText": "你在万千修士中拔得头筹，取走了那枚传承玉简！", "effects": { "cultivation": 40, "wuxing": 1 }, "achievement": "上古传承", "deathChance": 0.2, "deathText": "大殿深处的上古禁制没有给你『一线生机』。" },
      { "text": "在外围捡漏", "resultText": "你不争大殿，专收散落的上古器物，闷声发了一笔大财。", "effects": { "jiashi": 3, "cultivation": 10 } }
    ]
  },
  {
    "id": "l008", "realmMin": 4, "realmMax": 5, "once": true,
    "text": "修为愈高，人心愈远。你决定做一件许多大能不屑的事：入红尘炼心。",
    "options": [
      { "text": "化名凡人，市井十年", "resultText": "你卖过豆腐，教过蒙学，赶过大集。十年后归山，道心通透如洗。", "effects": { "daoxin": 2, "cultivation": 15 }, "achievement": "红尘炼心" },
      { "text": "红尘无益，回山苦修", "resultText": "你终究没有迈出那一步。洞府依旧清冷，道途依旧笔直，也依旧望不到头。", "effects": { "cultivation": 12 } }
    ]
  },
  {
    "id": "l011", "realmMin": 4, "realmMax": 6, "once": true,
    "text": "山下传来消息：当年与你有过一段因缘的那个人，寿元将尽了。",
    "options": [
      { "text": "下山相陪，送最后一程", "resultText": "你握着那双苍老的手坐了三天。走时你没有回头，山雨打湿了半件道袍。", "effects": { "daoxin": -1, "wuxing": 1 }, "achievement": "情之一字" },
      { "text": "闭关不出", "resultText": "出关那日你掐指一算，斯人已去七年。你在洞府门口站了一夜。", "effects": { "cultivation": 10, "daoxin": -2 } }
    ]
  },
  {
    "id": "l012", "realmMin": 5, "realmMax": 6,
    "text": "域外天魔撕开界膜渗入界内，所过之处生灵尽成枯骨。众修望向了你。",
    "options": [
      { "text": "只身镇压", "resultText": "一战天昏地暗。天魔湮灭的那一刻，整片大陆都听到了你的名字。", "effects": { "cultivation": 25 }, "achievement": "镇魔之功", "deathChance": 0.2, "deathText": "天魔临死自爆，你与它同归于尽，护住了身后苍生。" },
      { "text": "联合众修布阵围剿", "resultText": "你牵头布下诛魔大阵，众志成城，天魔授首。功劳分薄了，风险也分薄了。", "effects": { "cultivation": 12, "jiashi": 1 }, "deathChance": 0.06, "deathText": "大阵被天魔撕开一角，首当其冲的正是主阵的你。" }
    ]
  },
  {
    "id": "l013", "realmMin": 5, "realmMax": 6, "once": true, "cond": { "flag": "jiandao" },
    "text": "雷海之上，你隐约悟到了属于自己的本命剑意。若要成之，需以身入雷海淬剑。",
    "options": [
      { "text": "以身淬剑", "resultText": "九天雷霆尽数落于一剑！剑意通神，一剑既出，天地失色。", "effects": { "cultivation": 30, "daoxin": 1 }, "achievement": "剑意通神", "deathChance": 0.15, "deathText": "雷海无情，剑成之前，你先成了灰。" },
      { "text": "剑意未圆，不强求", "resultText": "你收剑离去。那一缕剑意始终悬在心头，成了道途上的一根刺，也是一盏灯。", "effects": { "wuxing": 1, "cultivation": 10 } }
    ]
  },
  {
    "id": "l014", "realmMin": 6, "realmMax": 6, "once": true, "weight": 3,
    "text": "天空阴云密布，紫雷在云层中游走——天劫的气息已经锁定了你。最后的时间，如何度过？",
    "options": [
      { "text": "整衣冠，静候雷音", "resultText": "你焚香沐浴，端坐峰顶。生死看淡，道心反而澄澈到了极处。", "effects": { "daoxin": 2 } },
      { "text": "布阵炼宝，再做万全准备", "resultText": "你把洞府周围布成了铁桶，护身灵宝擦了一遍又一遍。", "effects": { "tipo": 1, "cultivation": 10 } }
    ]
  },
  {
    "id": "l016", "realmMin": 4, "realmMax": 6, "cond": { "maxAttrs": { "daoxin": 4 } },
    "text": "岁月太长，长到你偶尔会忘记自己为何修行。这一日，你在洞府中枯坐到天明。",
    "options": [
      { "text": "重走来时路", "resultText": "你回到早已换了人间的故乡村落，在老槐树的位置站了很久。有些东西又找回来了。", "effects": { "daoxin": 2 } },
      { "text": "以修为镇压迷惘", "resultText": "想不通就不想。你把疑问和黑雾一起压进识海深处，继续枯修。", "effects": { "cultivation": 10, "daoxin": -1 } }
    ]
  },
  {
    "id": "l017", "realmMin": 4, "realmMax": 6, "once": true, "cond": { "flag": "dandao" },
    "text": "宗门一位老祖伤重垂死，唯有传说中的九转还魂丹可救。丹方残缺，炼制九死一生——炉毁人亡者不知凡几。",
    "options": [
      { "text": "开炉炼丹", "resultText": "七日七夜炉火不熄。丹成那刻，你的名字与『丹道大成』四个字一起传遍修界。", "effects": { "jiashi": 2, "daoxin": 1 }, "achievement": "丹道大成", "deathChance": 0.15, "deathText": "丹炉轰然炸裂，你与那炉九转还魂丹同归于尽。" },
      { "text": "自认火候未到，婉拒", "resultText": "老祖没能等到丹药。灵堂钟声里，你盯着自己的丹炉看了一整夜。", "effects": { "daoxin": -1, "cultivation": 8 } }
    ]
  },
  {
    "id": "l018", "realmMin": 4, "realmMax": 6, "weight": 2,
    "text": "又一甲子弹指而过。山下王朝换了国姓，你洞府门前的松树粗了一圈。这段岁月，你选择——",
    "options": [
      { "text": "闭死关", "resultText": "石壁滴水成痕，你在定境中吐纳天地，修为悄然精进。", "effects": { "cultivation": 18 }, "deathChance": 0.04, "deathText": "这一定，再没有醒来。后人开启洞府时，只见蒲团上一具含笑的枯坐身影。" },
      { "text": "巡游疆界，斩妖除魔", "resultText": "你循着妖气清理了几处魔窟，顺手救下的凡人已记不清数目。", "effects": { "cultivation": 8, "daoxin": 1 }, "deathChance": 0.08, "deathText": "一处魔窟深处藏着远超预估的存在，你没能走出来。" }
    ]
  }
];
