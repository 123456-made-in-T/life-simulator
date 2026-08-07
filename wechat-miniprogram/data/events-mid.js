// 由 scripts/sync-wx.js 从 src/data/events-mid.json 自动生成，勿手改
export default [
  {
    "id": "m001", "realmMin": 2, "realmMax": 2, "once": true, "weight": 2,
    "text": "筑基功成，你被提拔为内门弟子，分到一座带灵田的小院。执事问你想领哪类职事。",
    "options": [
      { "text": "清修，只领最少的杂务", "resultText": "你闭门谢客，小院的灵田都荒了半边，修为却蹭蹭上涨。", "effects": { "cultivation": 12 } },
      { "text": "管事，广结人脉", "resultText": "你把内门庶务打理得井井有条，各峰长老都对你有了印象。", "effects": { "jiashi": 2, "daoxin": 1 } }
    ]
  },
  {
    "id": "m002", "realmMin": 2, "realmMax": 3,
    "text": "宗门秘境开启，传闻深处灵药遍地，也遍地埋着前人的尸骨。",
    "options": [
      { "text": "深入腹地", "resultText": "九死一生，你满载而归——数株百年灵药和一身还在渗血的伤口。", "effects": { "cultivation": 20 }, "deathChance": 0.15, "deathText": "秘境深处的阴影里伸出了无数只手，你再没有走出来。" },
      { "text": "只在外围采集", "resultText": "外围灵药稀薄，胜在安稳。你按部就班地采满了一篓。", "effects": { "cultivation": 8 } }
    ]
  },
  {
    "id": "m004", "realmMin": 2, "realmMax": 3, "once": true, "cond": { "flag": "jiandao" },
    "text": "荒岭剑冢，万剑朽烂。唯有一柄断剑在你走近时嗡鸣颤动，似在呼唤。",
    "options": [
      { "text": "握住断剑", "resultText": "剑鸣如龙！断剑认主，你的剑从此快了三分。", "effects": { "cultivation": 20, "tipo": 1 }, "achievement": "断剑认主", "deathChance": 0.08, "deathText": "剑中残存的凶戾剑意逆冲而入，绞碎了你的神魂。" },
      { "text": "敬而远之", "resultText": "剑有凶气，你拱手一礼绕道而行。身后的嗡鸣渐渐低落，像一声叹息。", "effects": { "daoxin": 1 } }
    ]
  },
  {
    "id": "m005", "realmMin": 2, "realmMax": 3, "once": true, "cond": { "minAttrs": { "daoxin": 6 } },
    "text": "与你相识多年的那位修士在月下问你：可愿结为道侣，此后仙路同行？",
    "options": [
      { "text": "应下", "resultText": "从此洞府的灯下有人共剪烛花，闭关的门外有人守候。", "effects": { "daoxin": 2, "flag": "daolv" }, "achievement": "结为道侣" },
      { "text": "婉拒，大道独行", "resultText": "『情之一字，误道。』你转身离去，没敢回头看那双眼睛。", "effects": { "cultivation": 15, "daoxin": -2 } }
    ]
  },
  {
    "id": "m007", "realmMin": 2, "realmMax": 3,
    "text": "宗门派你驻守灵石矿脉，深夜魔修突袭，火光冲天！",
    "options": [
      { "text": "死战不退", "resultText": "你浴血守住了矿脉，援军赶到时你已站不稳，宗门记你首功。", "effects": { "cultivation": 15, "jiashi": 1 }, "achievement": "护矿之功", "deathChance": 0.18, "deathText": "魔修的阴毒法术透体而过，你力战而亡。" },
      { "text": "保人弃矿", "resultText": "你带着矿工连夜撤离，矿脉易主。宗门罚了你三年俸禄，矿工们却给你磕了头。", "effects": { "jiashi": -1, "daoxin": 1 } }
    ]
  },
  {
    "id": "m008", "realmMin": 2, "realmMax": 3, "once": true, "cond": { "flag": "dandao" },
    "text": "闭门三月，你炼出了人生第一炉上品筑基丹，丹香十里，坊市轰动。",
    "options": [
      { "text": "开炉传艺", "resultText": "你把丹方与火候倾囊相授，『丹师』之名传遍一方。", "effects": { "jiashi": 2, "daoxin": 1 }, "achievement": "丹成一品" },
      { "text": "待价而沽", "resultText": "丹方锁进玉盒，丹药拍出天价。有人骂你奸商，你数灵石的手没停。", "effects": { "jiashi": 3, "daoxin": -1 } }
    ]
  },
  {
    "id": "m009", "realmMin": 2, "realmMax": 3, "cond": { "maxAttrs": { "daoxin": 4 } },
    "text": "修行瓶颈难破，你烦躁易怒，识海深处隐隐有黑雾滋生。",
    "options": [
      { "text": "强行压制，继续苦修", "resultText": "你咬牙硬压下心头躁郁，黑雾却在识海里又浓了一分。", "effects": { "cultivation": 8, "daoxin": -1 } },
      { "text": "停下修行，下山散心", "resultText": "你在凡人的市井里喝了三天豆浆，听了三天评书，心里的黑雾散了大半。", "effects": { "daoxin": 2 } }
    ]
  },
  {
    "id": "m010", "realmMin": 2, "realmMax": 3, "once": true,
    "text": "云游途中，你路过一座疫病横行的荒村，村口跪着一排求医的百姓。",
    "options": [
      { "text": "施药救人", "resultText": "你留了半月，救活了大半个村子。村民为你立了长生牌位，日日供香。", "effects": { "daoxin": 2 }, "achievement": "善名远播", "deathChance": 0.05, "deathText": "疫病之中藏着罕见的尸毒，你救回一村人，没能救回自己。" },
      { "text": "绕村而行", "resultText": "修士不沾因果。你御剑掠过村庄上空，身后的哭声很久才消散。", "effects": { "cultivation": 5, "daoxin": -2 } }
    ]
  },
  {
    "id": "m012", "realmMin": 3, "realmMax": 3, "once": true, "weight": 2,
    "text": "金丹既成，宗门邀你开坛讲道。台下坐着白发长老，也坐着当年欺辱过你的师兄。",
    "options": [
      { "text": "坦然登坛，倾囊相授", "resultText": "你讲了三日三夜，听者如痴如醉。当年的师兄在台下起身，向你深深一揖。", "effects": { "daoxin": 2, "jiashi": 1 }, "achievement": "开坛讲道" },
      { "text": "只讲皮毛，留住底牌", "resultText": "核心法门半字未吐。散场后你听到有人低声议论：金丹真人，气量倒小。", "effects": { "jiashi": -1, "cultivation": 5 } }
    ]
  },
  {
    "id": "m013", "realmMin": 3, "realmMax": 4,
    "text": "境界渐深，闭门造车恐难再进。你摊开舆图，思索下一程去处。",
    "options": [
      { "text": "游历山川，印证道法", "resultText": "看山是山，看水是水。你在天地间印证己道，胸中丘壑渐开。", "effects": { "cultivation": 12, "daoxin": 1 } },
      { "text": "出海寻宝，搏一场机缘", "resultText": "怒海行舟，你从风暴与海兽的夹缝里抢回了一船前人遗藏。", "effects": { "cultivation": 15, "jiashi": 2 }, "deathChance": 0.15, "deathText": "滔天巨浪拍碎了你的舟船，你葬身万丈波涛。" }
    ]
  },
  {
    "id": "m015", "realmMin": 3, "realmMax": 4, "once": true, "cond": { "minAttrs": { "wuxing": 8 } },
    "text": "瀑布之下，你隐约窥见水流中一闪即逝的道韵。若要参悟，需在寒潭中枯坐不知多少时日。",
    "options": [
      { "text": "入潭枯坐", "resultText": "七日七夜，你顿悟水行真意，修为一日千里！", "effects": { "cultivation": 40 }, "achievement": "悟道七日", "deathChance": 0.05, "deathText": "道韵浩渺，你的神魂随水流而去，再没有回到躯壳。" },
      { "text": "记下感悟，来日再参", "resultText": "你将那一缕道韵记在玉简里。可惜灵光易逝，再看时已隔了一层。", "effects": { "cultivation": 10, "wuxing": 1 } }
    ]
  },
  {
    "id": "m017", "realmMin": 3, "realmMax": 4,
    "text": "魔道大军压境，宗门钟声长鸣。长老在点将台上望向了你。",
    "options": [
      { "text": "请战先锋", "resultText": "血染长空，你在尸山血海里杀出了赫赫凶名，魔修闻你之名绕道。", "effects": { "cultivation": 20, "tipo": -1 }, "achievement": "血战先锋", "deathChance": 0.18, "deathText": "乱战之中数名魔修围攻，你流尽了最后一滴血。" },
      { "text": "留守后方护送老弱", "resultText": "你护送数千凡人与低阶弟子转移，一路无一伤亡。有人不屑，有人感念。", "effects": { "daoxin": 2 }, "deathChance": 0.05, "deathText": "一支溃逃的魔修偏师撞上了你们，你为断后耗尽了真元。" }
    ]
  },
  {
    "id": "m019", "realmMin": 2, "realmMax": 4, "cond": { "maxAttrs": { "tipo": 3 } },
    "text": "旧伤复发，你咳血不止。丹师说要么停下修行静养三年，要么以猛药强行压制。",
    "options": [
      { "text": "停修静养", "resultText": "三年不闻窗外事，伤势缓缓愈合，修为却停在了原地。", "effects": { "tipo": 2, "cultivation": -10 } },
      { "text": "猛药压制，继续修行", "resultText": "药力如烈火烹油，伤势暂时压住了，隐患埋得更深。", "effects": { "cultivation": 10, "tipo": -1 }, "deathChance": 0.1, "deathText": "猛药引动旧伤齐发，你在一口黑血中油尽灯枯。" }
    ]
  },
  {
    "id": "m020", "realmMin": 3, "realmMax": 4, "once": true,
    "text": "一个骨相清奇的少年跪在你洞府前三天三夜，求你收他为徒。",
    "options": [
      { "text": "收入门墙，倾囊相授", "resultText": "看着少年懵懂的眼睛，你仿佛看到当年的自己。", "effects": { "daoxin": 1 }, "achievement": "传道授业" },
      { "text": "拒之门外", "resultText": "『修行是自己的事。』你闭了洞门。少年磕了三个头，一步一回头地走了。", "effects": { "cultivation": 8, "daoxin": -1 } }
    ]
  },
  {
    "id": "z101", "realmMin": 3, "realmMax": 3, "once": true,
    "text": "宗门一位长老坐化，之位空悬。论修为你有资格一争，但对手是掌门的亲传弟子。",
    "options": [
      { "text": "放手一争", "resultText": "明枪暗箭三个月，你硬是凭战功和人望坐上了长老之位。", "effects": { "jiashi": 2, "daoxin": -1 }, "achievement": "宗门长老", "deathChance": 0.08, "deathText": "夺位之争远比台面凶险，你死在一场『意外』的护山阵故障里。" },
      { "text": "无意权位，退出竞逐", "resultText": "你在贺信上第一个署名。掌门弟子上位后，反倒处处给你行方便。", "effects": { "daoxin": 1, "cultivation": 8 } }
    ]
  },
  {
    "id": "z102", "realmMin": 2, "realmMax": 3,
    "text": "宗门藏宝阁失窃，叛徒携镇派玉璧连夜出逃，长老悬赏缉拿。",
    "options": [
      { "text": "追缉叛徒", "resultText": "三千里追踪，你在一处海崖截住了他。玉璧归宗那日，山门为你鸣钟三响。", "effects": { "cultivation": 12, "jiashi": 1 }, "achievement": "追回镇派之宝", "deathChance": 0.12, "deathText": "叛徒身后还藏着接应的魔修，你中伏陨落在海崖之下。" },
      { "text": "守好自己的山头", "resultText": "重赏之下必有勇夫，轮不到你。你继续闭关，只在出关时听说叛徒已伏诛。", "effects": { "cultivation": 8 } }
    ]
  },
  {
    "id": "q101", "realmMin": 2, "realmMax": 4, "weight": 2, "cond": { "flag": "daolv" },
    "text": "月圆之夜，道侣提议：与其各自闭关，不如印证双修，同参大道。",
    "options": [
      { "text": "双修共进", "resultText": "两道气机水乳交融，许多独自参不透的关窍，两人一碰就透了。", "effects": { "cultivation": 15, "daoxin": 1 } },
      { "text": "道不同参，各自苦修", "resultText": "你说大道终须独行。她笑了笑没反驳，只是那晚的月色格外冷清。", "effects": { "cultivation": 10, "daoxin": -1 } }
    ]
  },
  {
    "id": "q102", "realmMin": 3, "realmMax": 4, "once": true, "cond": { "flag": "daolv" },
    "text": "噩耗传来：道侣外出历练时被魔修掳走，生死不明——这是冲着你来的。",
    "options": [
      { "text": "孤身闯魔窟", "resultText": "你一人一剑踏平了那座魔窟。抱着昏迷的她走出来时，你的道袍已被血浸成了黑色。", "effects": { "daoxin": 2 }, "achievement": "情之所至", "deathChance": 0.2, "deathText": "魔窟深处的大阵等你多时，你们最终死在了一起。" },
      { "text": "联络宗门，稳妥营救", "resultText": "大军压境，魔修弃巢而逃。她获救了，只是看你的眼神里多了一丝说不清的东西。", "effects": { "daoxin": -1, "jiashi": 1 }, "deathChance": 0.05, "deathText": "魔修撤退前的最后一击，恰好落在了你的位置。" }
    ]
  },
  {
    "id": "mo101", "realmMin": 2, "realmMax": 4, "weight": 2, "cond": { "flag": "modao" },
    "text": "魔道之路，弱肉强食。你围杀了一名落单的散修，此人储物袋丰厚，气血也可炼为己用。",
    "options": [
      { "text": "血祭炼化，人财两收", "resultText": "血雾入体，修为暴涨。你告诉自己：魔道本该如此。声音却越来越小。", "effects": { "cultivation": 25, "daoxin": -2 } },
      { "text": "只取财物，留他性命", "resultText": "『滚。』你踢开储物袋里的骸骨袋，只拿了灵石。魔道中人笑你妇人之仁，你懒得理会。", "effects": { "jiashi": 2, "daoxin": -1 } }
    ]
  },
  {
    "id": "mo102", "realmMin": 3, "realmMax": 5, "cond": { "flag": "modao" },
    "text": "你的名字上了正道联军的诛魔榜，三位金丹修士循着气息围了上来。",
    "options": [
      { "text": "杀出重围", "resultText": "一场血战从山巅打到海底。你活了下来，诛魔榜上你的悬赏翻了三倍。", "effects": { "cultivation": 15, "tipo": -1 }, "deathChance": 0.18, "deathText": "双拳难敌六手，你陨落于正道联军的合击之下。" },
      { "text": "金蝉脱壳，隐姓埋名", "resultText": "你诈死脱身，蛰伏于一座凡人小城。修为停滞的日子里，你时常想起入魔前的自己。", "effects": { "cultivation": -10, "daoxin": -1 } }
    ]
  },
  {
    "id": "z103", "realmMin": 3, "realmMax": 4, "once": true, "cond": { "minAttrs": { "daoxin": 6 } },
    "text": "掌门寿元将近，召你入殿，案上放着掌门印信：『宗门，托付给你了。』",
    "options": [
      { "text": "接过印信", "resultText": "从此你的名字与整个宗门绑在了一起。千斤重担，也是千钧信任。", "effects": { "jiashi": 3, "daoxin": 1 }, "achievement": "执掌一门" },
      { "text": "举贤让位", "resultText": "你推举了更合适的师弟，自请镇守后山。掌门看了你很久，说了句：也好。", "effects": { "daoxin": 2, "cultivation": 8 } }
    ]
  },
  {
    "id": "q103", "realmMin": 2, "realmMax": 3, "once": true,
    "text": "山下故人捎来书信：当年对你有一饭之恩的老妪病重，凡间药石无医，唯灵丹可救。",
    "options": [
      { "text": "亲自送药下山", "resultText": "老妪已认不出你，只是拉着你的手说这位仙长面善。你把丹药化在她的粥里。", "effects": { "jiashi": -1, "daoxin": 2 }, "achievement": "一饭之报" },
      { "text": "凡人生死有命", "resultText": "修行人不沾因果。你把信折好压在丹炉底下，那炉丹最后炼废了。", "effects": { "cultivation": 5, "daoxin": -2 } }
    ]
  }
];
