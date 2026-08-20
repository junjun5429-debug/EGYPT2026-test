const places = {
  giza: {
    kicker: "GIZA · DAY 2", title: "ギザの三大ピラミッド", image: "assets/pyramids.jpg",
    description: "クフ王、カフラー王、メンカウラー王のピラミッドが並ぶ、エジプト旅の象徴。ツアーではクフ王のピラミッドと王妃のピラミッドに入場予定です。",
    highlights: ["スフィンクス足元の特別エリアへ貸切入場", "三大ピラミッドを望むパノラマポイント", "民族衣装ガラベイヤで記念撮影"],
    time: "約2時間", note: "砂埃・天候により眺望が変わります"
  },
  museum: {
    kicker: "CAIRO · DAY 2", title: "大エジプト博物館", image: "assets/museum.jpg",
    credit: "Amr F.Nagy · Public domain · Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum_2025.jpg",
    description: "ギザのピラミッドに近接する世界最大級の考古学博物館。2025年11月のグランドオープン後を訪れる予定です。",
    highlights: ["古代エジプトの膨大なコレクション", "ツタンカーメン関連展示", "ピラミッド観光と同日に巡る構成"],
    time: "約3時間", note: "急遽休館の場合は考古学博物館へ"
  },
  cairo: {
    kicker: "CAIRO · DAY 2", title: "カイロ旧市街", image: "assets/cairo.jpg",
    credit: "Diego Delso · CC BY-SA 3.0 · Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Muhammad_Ali_Mosque,_Citadel,_Cairo,_Egypt3.jpg",
    description: "イスラム建築と市場の熱気に触れるカイロ市内観光。モハメッドアリモスクとハンハリーリバザールを巡ります。",
    highlights: ["モハメッドアリモスクの外観", "ハンハリーリバザール散策", "ピラミッド夜景を望む夕食"],
    time: "約1時間", note: "夕食はコシャリとシシタウーク"
  },
  abusimbel: {
    kicker: "NUBIA · DAY 3–4", title: "アブシンベル神殿", image: "assets/abusimbel.jpg",
    description: "ラムセス2世が築いた大神殿と、王妃ネフェルタリに捧げた小神殿。ナセル湖の建設に伴い、巨大な神殿全体が現在地へ移築されました。",
    highlights: ["湖上から大神殿と小神殿を一望", "夜の音と光のショーを日本語で貸切見学", "翌朝は開場前の神殿へ貸切入場"],
    time: "午後・夜・翌早朝", note: "朝日と遊覧は天候により変更あり"
  },
  nile: {
    kicker: "THE NILE · DAY 4–7", title: "ナイル川クルーズ", image: "assets/nile.jpg",
    description: "アスワンからルクソールまで、ナイル川沿いの神殿をつなぐ3泊の船旅。移動そのものが旅のハイライトになります。",
    highlights: ["5つ星クルーズ船に3連泊", "窓とバスタブ付きの客室", "伝統帆船ファルーカ遊覧", "エスナの水門で約6mの水位差を通過"],
    time: "3泊4日", note: "船名は出発前の確定書面で案内"
  },
  philae: {
    kicker: "ASWAN · DAY 5", title: "イシス神殿", image: "assets/philae.jpg",
    description: "ナイルの真珠と呼ばれるフィラエ島の神殿。女神イシス信仰の中心地で、水に囲まれた景観も魅力です。",
    highlights: ["島へ渡って神殿を見学", "神殿のパノラマビュー", "水辺と列柱がつくる静かな景観"],
    time: "約1時間30分", note: "香油・香水瓶店にも立寄り"
  },
  komombo: {
    kicker: "KOM OMBO · DAY 5", title: "コムオンボ神殿", image: "assets/komombo.jpg",
    description: "ワニの神セベクとハヤブサの神ハロエリス、二柱の神に捧げられた左右対称の二重神殿です。",
    highlights: ["珍しい二重構造の神殿", "医療器具を表したレリーフ", "併設のワニの博物館"],
    time: "約1時間", note: "観光後はエドフへ向けて航行"
  },
  edfu: {
    kicker: "EDFU · DAY 6", title: "ホルス神殿", image: "assets/edfu.jpg",
    credit: "Marc Ryckaert · CC BY-SA 4.0 · Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Edfu_Temple_R04.jpg",
    description: "天空の神ホルスに捧げられた、保存状態の良いプトレマイオス朝の神殿。巨大な塔門と中庭が迎えます。",
    highlights: ["神殿までは馬車で移動", "高さのある第一塔門", "ホルス神とセト神の神話を刻む壁面"],
    time: "約1時間30分", note: "朝の観光"
  },
  luxor: {
    kicker: "LUXOR · DAY 6", title: "ルクソール東岸", image: "assets/luxor-temple.jpg",
    credit: "Vyacheslav Argenberg · CC BY 4.0 · Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Luxor_Temple_at_night,_Luxor,_Egypt.jpg",
    description: "古代テーベの生者の町。夕暮れからライトアップされるルクソール神殿と、スフィンクスが並ぶ参道を歩きます。",
    highlights: ["ルクソール神殿のライトアップ", "約3kmのスフィンクスアベニュー", "夜の神殿を楽しむオプショナルツアー"],
    time: "約1時間", note: "ルクソール博物館は別途代金"
  },
  luxorMuseum: {
    kicker: "LUXOR · DAY 6", title: "ルクソール博物館", image: "assets/luxor-museum.jpg",
    credit: "Walaa · Public domain · Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Luxor_Museum,_Egypt_33.jpg",
    description: "古代テーベ周辺で発掘された選りすぐりの遺物を、落ち着いた空間で鑑賞できる博物館。王墓や神殿を巡った後の理解を深めます。",
    highlights: ["ルクソール周辺から出土した彫像や副葬品", "新王国時代の美術を見やすい展示構成", "夕方のオプショナルツアーで訪問予定"],
    time: "午後・夕方", note: "オプショナルツアーに参加予定"
  },
  valley: {
    kicker: "WEST BANK · DAY 7", title: "王家の谷", image: "assets/valley-of-kings.jpg",
    credit: "Vyacheslav Argenberg · CC BY 4.0 · Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Thebes,_Luxor,_Egypt,_Panoramic_view_of_the_Valley_of_the_Kings.jpg",
    description: "新王国時代のファラオたちが眠る岩窟墓群。ツタンカーメン王の墓はツアー参加者だけの貸切入場を予定しています。",
    highlights: ["ツタンカーメン王の墓へ貸切入場", "セティ1世の墓を見学予定", "ハトシェプスト女王葬祭殿", "ハワード・カーター・ハウス"],
    time: "西岸全体で約4時間30分", note: "修復・調査時は代替観光あり"
  },
  karnak: {
    kicker: "LUXOR · DAY 7", title: "カルナック神殿", image: "assets/karnak.jpg",
    description: "歴代ファラオが増築を重ねた巨大な神殿複合体。134本の石柱が並ぶ大列柱室は旅の終盤を飾る圧巻の空間です。",
    highlights: ["アメン大神殿", "高さ約23mの柱が並ぶ大列柱室", "スフィンクス参道につながる古代都市の軸線"],
    time: "約1時間", note: "観光後は空港へ"
  }
};

const days = [
  {
    date: "9/20", weekday: "SUN", jpWeekday: "日", location: "NARITA → CAIRO", title: "成田から、砂漠の都へ",
    summary: "夜の直行便でカイロへ。到着後すぐに始まる観光に備え、機内でしっかり休みます。",
    image: "assets/cairo.jpg", caption: "最初の目的地、砂漠の都カイロ", facts: [["STAY", "機中泊"], ["MEAL", "旅行日程上は食事なし"]],
    events: [
      ["17:00", "HIS集合", "成田空港 第1ターミナル。旅券、旅行書類、査証代30米ドルを確認。"],
      ["20:30", "成田空港 発", "エジプト航空 MS965便でカイロへ。"],
      ["機内", "到着後に備えて休息", "歯みがき、着替え、常備薬は手荷物に。"]
    ]
  },
  {
    date: "9/21", weekday: "MON", jpWeekday: "月", location: "CAIRO · GIZA", title: "ピラミッドと新しい博物館を一日で",
    summary: "古代エジプトの象徴からカイロの街角まで、到着初日から濃密に巡ります。",
    image: "assets/pyramids.jpg", caption: "ギザの三大ピラミッドとスフィンクス", facts: [["STAY", "マリオット メナハウス"], ["DINNER", "コシャリ・シシタウーク"]],
    events: [
      ["03:05–04:05", "カイロ着・査証取得", "ホテルへ移動し、ピラミッドが見えるレストランで朝食。"],
      ["午前", "ギザ観光", "クフ王・王妃のピラミッド、スフィンクス、パノラマポイント。", "giza"],
      ["午後", "大エジプト博物館", "2025年11月グランドオープンの博物館を見学。", "museum"],
      ["夕方", "カイロ市内観光", "モハメッドアリモスク、ハンハリーリバザール。", "cairo"]
    ]
  },
  {
    date: "9/22", weekday: "TUE", jpWeekday: "火", location: "CAIRO → ABU SIMBEL", title: "アブシンベル、湖上と夜の表情",
    summary: "国内線と砂漠の道を乗り継ぎ、ラムセス2世の大神殿へ。昼・湖上・夜と表情の変化を楽しみます。",
    image: "assets/abusimbel.jpg", caption: "アブシンベル大神殿・小神殿", facts: [["STAY", "セティ アブシンベル"], ["LUNCH", "ムサカ または 魚のタジン"]],
    events: [
      ["05:45–06:45", "カイロ → アスワン", "国内線で南へ。朝食はボックス。"],
      ["午前", "アブシンベルへ移動", "約280km、約3時間30分。途中、アスワンハイダム。"],
      ["午後", "大神殿・小神殿", "ナセル湖遊覧で二つの神殿を正面から望む。", "abusimbel"],
      ["夜", "音と光のショー", "日本語案内で貸切見学。", "abusimbel"]
    ]
  },
  {
    date: "9/23", weekday: "WED", jpWeekday: "水", location: "ABU SIMBEL → ASWAN", title: "朝日の神殿から、ナイルの船旅へ",
    summary: "開場前の神殿を味わった後、アスワンへ。午後から3泊のクルーズが始まります。",
    image: "assets/nile.jpg", caption: "アスワンから始まるナイル川クルーズ", facts: [["STAY", "船中泊 1/3"], ["MEAL", "昼・夜は船内"]],
    events: [
      ["早朝", "朝日のアブシンベル神殿", "オープン前の神殿へ貸切入場。", "abusimbel"],
      ["午前", "アスワンへ戻る", "約280km、約3時間30分。"],
      ["午後", "クルーズ船に乗船", "5つ星クルーズ、窓とバスタブ付き客室。", "nile"],
      ["その後", "ファルーカ遊覧", "伝統帆船でナイル川をゆったり進む。", "nile"]
    ]
  },
  {
    date: "9/24", weekday: "THU", jpWeekday: "木", location: "ASWAN → KOM OMBO", title: "イシス神殿と、二重構造の神殿",
    summary: "水に囲まれた女神の神殿から、ワニの神に捧げられた左右対称の神殿へ。",
    image: "assets/philae.jpg", caption: "フィラエ島に建つイシス神殿", facts: [["STAY", "船中泊 2/3"], ["MEAL", "3食とも船内"]],
    events: [
      ["午前", "アスワン観光", "イシス神殿とパノラマビュー。", "philae"],
      ["航行", "コムオンボへ", "ナイルの景色を楽しみながら移動。", "nile"],
      ["午後", "コムオンボ観光", "二重構造の神殿とワニの博物館。", "komombo"],
      ["夕方", "エドフへ向け出発", "夕食はクルーズ船内。"]
    ]
  },
  {
    date: "9/25", weekday: "FRI", jpWeekday: "金", location: "EDFU → LUXOR", title: "ホルス神殿から、灯り始めるルクソールへ",
    summary: "神殿へ馬車で向かい、エスナの水門を越えて古代テーベへ入ります。",
    image: "assets/luxor-temple.jpg", caption: "夜の光に浮かぶルクソール神殿", facts: [["STAY", "船中泊 3/3"], ["OPTION", "ルクソール博物館観光"]],
    events: [
      ["朝", "エドフ・ホルス神殿", "天空の神ホルスに捧げられた神殿。", "edfu"],
      ["航行", "エスナの水門を通過", "約6mの水位差を越えてルクソールへ。", "nile"],
      ["午後", "ルクソール博物館観光", "オプショナルツアーに参加予定。ルクソール周辺から出土した遺物を見学します。", "luxorMuseum"],
      ["夕刻", "ルクソール東岸", "スフィンクスアベニュー、ライトアップされる神殿。", "luxor"]
    ]
  },
  {
    date: "9/26", weekday: "SAT", jpWeekday: "土", location: "LUXOR → CAIRO", title: "王家の谷、旅のクライマックス",
    summary: "王たちの墓と大列柱室を巡り、夜の便で帰国の途へ。旅の密度が最も高い一日です。",
    image: "assets/valley-of-kings.jpg", caption: "岩山に王墓が眠る王家の谷", facts: [["STAY", "機中泊"], ["DINNER", "和食のお弁当"]],
    events: [
      ["午前", "ルクソール西岸", "ゴールデンシティ、貴族の墓、ラムセス2世葬祭殿。"],
      ["王家の谷", "ツタンカーメン王の墓", "貸切入場。セティ1世の墓も見学予定。", "valley"],
      ["続いて", "女王葬祭殿ほか", "メムノンの巨像、ハワード・カーター・ハウス。", "valley"],
      ["午後", "カルナック神殿", "壮大な大列柱室へ。", "karnak"],
      ["20:10–21:10", "ルクソール発", "カイロ乗継で帰国の途へ。"]
    ]
  },
  {
    date: "9/27", weekday: "SUN", jpWeekday: "日", location: "CAIRO → NARITA", title: "おかえりなさい。旅の余韻とともに",
    summary: "機内で旅を振り返りながら日本へ。成田到着後、入国・手荷物受取を経て解散です。",
    image: "assets/karnak.jpg", caption: "エジプトの壮大な景色を胸に帰国", facts: [["ARRIVAL", "成田 18:30予定"], ["MEAL", "旅行日程上は食事なし"]],
    events: [
      ["機内", "カイロから成田へ", "エジプト航空 MS964便で日本へ。"],
      ["18:30", "成田空港 着", "MS964便で到着予定。入国、受託手荷物受取後に解散。"]
    ]
  }
];

const routeNames = ["成田", "カイロ・ギザ", "アブシンベル", "アスワン", "コムオンボ", "エドフ", "ルクソール", "成田"];
const dayMaps = [
  {
    note: "成田から空路でエジプトへ",
    stops: [
      { name: "成田国際空港", detail: "MS965便でカイロへ", x: 392, y: 26, lat: 35.7720, lng: 140.3929, mode: "出発" },
      { name: "カイロ国際空港", detail: "翌朝到着 · 入国・査証取得", x: 270, y: 143, lat: 30.1120, lng: 31.4000, mode: "国際線" }
    ]
  },
  {
    note: "カイロ近郊を専用車で周遊",
    stops: [
      { name: "カイロ国際空港", detail: "到着・ホテルへ移動", x: 270, y: 143, lat: 30.1120, lng: 31.4000, mode: "専用車" },
      { name: "ギザの三大ピラミッド", detail: "スフィンクス・パノラマポイント", x: 225, y: 166, lat: 29.9792, lng: 31.1342, mode: "専用車" },
      { name: "大エジプト博物館", detail: "グランドオープン後の館内を見学", x: 237, y: 150, lat: 29.9936, lng: 31.1194, mode: "専用車" },
      { name: "カイロ旧市街", detail: "モスク・ハンハリーリバザール", x: 258, y: 169, lat: 30.0477, lng: 31.2622, mode: "専用車" },
      { name: "メナハウス", detail: "ピラミッドを望むホテル", x: 219, y: 178, lat: 29.9855, lng: 31.1344, mode: "宿泊" }
    ]
  },
  {
    note: "国内線と砂漠の陸路で南端へ",
    stops: [
      { name: "カイロ", detail: "国内線でアスワンへ", x: 258, y: 154, lat: 30.1120, lng: 31.4000, mode: "国内線" },
      { name: "アスワン", detail: "空港からハイダムを経由", x: 276, y: 463, lat: 23.9681, lng: 32.8248, mode: "専用車" },
      { name: "アスワン・ハイダム", detail: "砂漠横断の途中に見学", x: 266, y: 480, lat: 23.9700, lng: 32.8770, mode: "専用車" },
      { name: "アブシンベル", detail: "大神殿・ナセル湖遊覧・光のショー", x: 225, y: 555, lat: 22.3372, lng: 31.6258, mode: "宿泊" }
    ]
  },
  {
    note: "アブシンベルからアスワン、船旅の起点へ",
    stops: [
      { name: "アブシンベル神殿", detail: "早朝の貸切入場", x: 225, y: 555, lat: 22.3372, lng: 31.6258, mode: "専用車" },
      { name: "アスワン", detail: "約280kmを北上", x: 276, y: 463, lat: 24.0889, lng: 32.8998, mode: "乗船" },
      { name: "ナイル川・ファルーカ", detail: "伝統帆船で遊覧", x: 265, y: 445, lat: 24.0938, lng: 32.8880, mode: "帆船" }
    ]
  },
  {
    note: "ナイル川をクルーズ船で北上",
    stops: [
      { name: "イシス神殿", detail: "フィラエ島へボートで渡る", x: 276, y: 472, lat: 24.0258, lng: 32.8845, mode: "ボート" },
      { name: "アスワン", detail: "クルーズ船へ戻り出航", x: 269, y: 450, lat: 24.0889, lng: 32.8998, mode: "クルーズ" },
      { name: "コムオンボ神殿", detail: "二重構造の神殿を見学", x: 275, y: 394, lat: 24.4521, lng: 32.9280, mode: "クルーズ" },
      { name: "エドフ方面", detail: "夕食後も船で北上", x: 277, y: 348, lat: 24.9781, lng: 32.8734, mode: "船中泊" }
    ]
  },
  {
    note: "エドフからエスナを通りルクソールへ",
    stops: [
      { name: "エドフ・ホルス神殿", detail: "船着場から馬車で往復", x: 277, y: 348, lat: 24.9781, lng: 32.8734, mode: "馬車" },
      { name: "エスナの水門", detail: "約6mの水位差を通過", x: 279, y: 312, lat: 25.2930, lng: 32.5500, mode: "クルーズ" },
      { name: "ルクソール博物館", detail: "オプショナルツアー", x: 286, y: 281, lat: 25.7076, lng: 32.6445, mode: "専用車" },
      { name: "ルクソール東岸", detail: "神殿とスフィンクス参道", x: 275, y: 270, lat: 25.6995, lng: 32.6391, mode: "船中泊" }
    ]
  },
  {
    note: "ルクソール両岸を巡り、空路でカイロへ",
    stops: [
      { name: "王家の谷", detail: "ツタンカーメン王・セティ1世の墓", x: 259, y: 270, lat: 25.7402, lng: 32.6014, mode: "専用車" },
      { name: "ハトシェプスト女王葬祭殿", detail: "西岸の遺跡群を周遊", x: 263, y: 281, lat: 25.7382, lng: 32.6066, mode: "専用車" },
      { name: "カルナック神殿", detail: "大列柱室を見学", x: 284, y: 263, lat: 25.7188, lng: 32.6573, mode: "専用車" },
      { name: "ルクソール空港", detail: "国内線でカイロへ", x: 296, y: 280, lat: 25.6710, lng: 32.7066, mode: "国内線" },
      { name: "カイロ国際空港", detail: "帰国便へ乗り継ぎ", x: 270, y: 143, lat: 30.1120, lng: 31.4000, mode: "国際線" }
    ]
  },
  {
    note: "カイロから成田へ帰国",
    stops: [
      { name: "カイロ国際空港", detail: "MS964便で日本へ", x: 270, y: 143, lat: 30.1120, lng: 31.4000, mode: "国際線" },
      { name: "成田国際空港", detail: "18:30到着予定", x: 392, y: 26, lat: 35.7720, lng: 140.3929, mode: "国際線" }
    ]
  }
];
const currencyCodes = ["JPY", "USD", "EGP"];
const currencyCacheKey = "egypt-2026-currency-rates";
const weatherCities = [
  { name: "カイロ", label: "CAIRO", latitude: 30.0444, longitude: 31.2357 },
  { name: "ルクソール", label: "LUXOR", latitude: 25.6872, longitude: 32.6396 },
  { name: "アスワン", label: "ASWAN", latitude: 24.0889, longitude: 32.8998 }
];
let selectedDay = 0;
let lastTrigger = null;

const dateStrip = document.querySelector("#date-strip");
const route = document.querySelector("#route");
const dialog = document.querySelector("#place-dialog");
const arabicDialog = document.querySelector("#arabic-dialog");
const mapDialog = document.querySelector("#map-dialog");
const currencyInputs = [...document.querySelectorAll("[data-currency]")];
let currencyRates = null;
let arabicTrigger = null;
let mapTrigger = null;
let leafletMap = null;

function weatherLabel(code) {
  if (code === 0) return "快晴";
  if ([1, 2].includes(code)) return "晴れ時々曇り";
  if (code === 3) return "曇り";
  if ([45, 48].includes(code)) return "霧";
  if ([51, 53, 55, 56, 57].includes(code)) return "霧雨";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "雨";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "雪";
  if ([95, 96, 99].includes(code)) return "雷雨";
  return "天気情報あり";
}

function egyptTime() {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Africa/Cairo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());
}

function updateEgyptTime() {
  document.querySelector("#egypt-time").textContent = `エジプト ${egyptTime()}`;
}

async function loadWeather() {
  const refreshButton = document.querySelector("#weather-refresh");
  const updated = document.querySelector("#weather-updated");
  refreshButton.disabled = true;
  refreshButton.classList.add("is-loading");
  updated.textContent = "取得しています";

  try {
    const weather = await Promise.all(weatherCities.map(async city => {
      const params = new URLSearchParams({
        latitude: city.latitude,
        longitude: city.longitude,
        current: "temperature_2m,weather_code",
        timezone: "Africa/Cairo"
      });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error("Weather request failed");
      const data = await response.json();
      return { ...city, temperature: Math.round(data.current.temperature_2m), code: data.current.weather_code };
    }));

    document.querySelector("#weather-grid").innerHTML = weather.map(city => `
      <article class="weather-card">
        <span>${city.label}</span><strong>${city.temperature}°</strong><p>${weatherLabel(city.code)}</p>
      </article>`).join("");
    updated.textContent = `${egyptTime()}更新`;
  } catch {
    updated.textContent = "取得できませんでした";
    document.querySelector("#weather-grid").innerHTML = weatherCities.map(city => `
      <article class="weather-card is-unavailable"><span>${city.label}</span><strong>--°</strong><p>再度更新</p></article>`).join("");
  } finally {
    refreshButton.disabled = false;
    refreshButton.classList.remove("is-loading");
  }
}

function formatCurrencyAmount(value, code) {
  if (!Number.isFinite(value)) return "";
  const maximumFractionDigits = code === "JPY" ? 0 : 2;
  return Number(value.toFixed(maximumFractionDigits)).toString();
}

function convertCurrency(sourceInput) {
  if (!currencyRates) return;
  const sourceCode = sourceInput.dataset.currency;
  const sourceAmount = Number(sourceInput.value);
  if (!Number.isFinite(sourceAmount) || sourceInput.value === "") {
    currencyInputs.filter(input => input !== sourceInput).forEach(input => { input.value = ""; });
    return;
  }
  const amountInUsd = sourceAmount / currencyRates[sourceCode];
  currencyInputs.filter(input => input !== sourceInput).forEach(input => {
    input.value = formatCurrencyAmount(amountInUsd * currencyRates[input.dataset.currency], input.dataset.currency);
  });
}

function showCurrencyRates(data, cached = false) {
  currencyRates = data.rates;
  const updatedDate = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"
  }).format(new Date(data.updatedAt));
  document.querySelector("#currency-updated").textContent = `${updatedDate}更新${cached ? "（保存済み）" : ""}`;
  document.querySelector("#currency-rate").textContent = `1 USD = ${currencyRates.JPY.toFixed(2)} JPY · ${currencyRates.EGP.toFixed(2)} EGP`;
  convertCurrency(currencyInputs.find(input => input.value !== "") || currencyInputs[0]);
}

function loadCachedCurrencyRates() {
  try {
    const cached = JSON.parse(localStorage.getItem(currencyCacheKey));
    if (currencyCodes.every(code => Number.isFinite(cached?.rates?.[code])) && cached?.updatedAt) {
      showCurrencyRates(cached, true);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

async function loadCurrencyRates() {
  const refreshButton = document.querySelector("#currency-refresh");
  const updated = document.querySelector("#currency-updated");
  refreshButton.disabled = true;
  refreshButton.classList.add("is-loading");
  updated.textContent = "最新レートを取得中";
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD", { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Currency request failed");
    const data = await response.json();
    if (data.result !== "success" || !currencyCodes.every(code => Number.isFinite(data.rates?.[code]))) {
      throw new Error("Currency data unavailable");
    }
    const rates = Object.fromEntries(currencyCodes.map(code => [code, data.rates[code]]));
    const currencyData = { rates, updatedAt: data.time_last_update_utc || new Date().toISOString() };
    localStorage.setItem(currencyCacheKey, JSON.stringify(currencyData));
    showCurrencyRates(currencyData);
  } catch {
    if (!loadCachedCurrencyRates()) {
      updated.textContent = "レートを取得できませんでした";
      document.querySelector("#currency-rate").textContent = "通信環境を確認して再度更新してください";
    }
  } finally {
    refreshButton.disabled = false;
    refreshButton.classList.remove("is-loading");
  }
}

function renderRoute() {
  route.innerHTML = routeNames.map((name, index) => `
    <button class="route-stop" type="button" data-day="${index}" aria-label="Day ${index + 1} ${name}を表示">
      <img src="${days[index].image}" alt="" loading="lazy">
      <span class="route-day">DAY ${String(index + 1).padStart(2, "0")}</span>
      <span class="route-date">${days[index].date} ${days[index].weekday}</span>
      <strong>${name}</strong>
      <small>${days[index].title}</small>
    </button>`).join("");
  route.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
    selectDay(Number(button.dataset.day), true);
  }));
}

function renderDateButtons() {
  dateStrip.innerHTML = days.map((day, index) => `
    <button class="date-button" type="button" role="tab" data-day="${index}" aria-selected="${index === selectedDay}" aria-controls="timeline">
      <span>DAY ${index + 1}</span><strong>${day.date}</strong><small>${day.weekday}</small>
    </button>`).join("");
  dateStrip.querySelectorAll("button").forEach(button => button.addEventListener("click", () => selectDay(Number(button.dataset.day))));
}

function renderDay() {
  const day = days[selectedDay];
  document.querySelector("#day-number").textContent = String(selectedDay + 1).padStart(2, "0");
  document.querySelector("#day-location").textContent = `${day.date}（${day.jpWeekday}） · ${day.location}`;
  document.querySelector("#day-title").textContent = day.title;
  document.querySelector("#day-summary").textContent = day.summary;
  const image = document.querySelector("#day-image");
  image.src = day.image;
  image.alt = day.caption;
  document.querySelector("#day-caption").textContent = day.caption;
  document.querySelector("#day-facts").innerHTML = day.facts.map(fact => `<div class="fact"><span>${fact[0]}</span><strong>${fact[1]}</strong></div>`).join("");
  document.querySelector("#timeline").innerHTML = day.events.map(event => `
    <article class="timeline-item">
      <div class="timeline-time">${event[0]}</div>
      <div class="timeline-body"><h4>${event[1]}</h4><p>${event[2]}</p>
        ${event[3] ? `<button class="place-button" type="button" data-place="${event[3]}">訪問地の詳細 <span aria-hidden="true">↗</span></button>` : ""}
      </div>
    </article>`).join("");
  document.querySelectorAll(".place-button").forEach(button => button.addEventListener("click", () => openPlace(button.dataset.place, button)));
  document.querySelectorAll(".date-button").forEach((button, index) => button.setAttribute("aria-selected", String(index === selectedDay)));
  document.querySelector("#prev-day").disabled = selectedDay === 0;
  document.querySelector("#next-day").disabled = selectedDay === days.length - 1;
  document.querySelector("#day-progress").textContent = `${selectedDay + 1} / ${days.length}`;
}

function selectDay(index, scroll = false) {
  selectedDay = Math.max(0, Math.min(days.length - 1, index));
  renderDay();
  updateHash();
  if (scroll) document.querySelector("#itinerary").scrollIntoView({ behavior: "smooth" });
}

function openPlace(id, trigger) {
  const place = places[id];
  if (!place) return;
  lastTrigger = trigger || document.activeElement;
  document.querySelector("#place-kicker").textContent = place.kicker;
  document.querySelector("#place-title").textContent = place.title;
  document.querySelector("#place-description").textContent = place.description;
  document.querySelector("#place-highlights").innerHTML = place.highlights.map(item => `<li>${item}</li>`).join("");
  const image = document.querySelector("#place-image");
  image.src = place.image;
  image.alt = place.title;
  const credit = document.querySelector("#place-credit");
  credit.hidden = !place.credit;
  credit.textContent = place.credit || "";
  credit.href = place.creditUrl || "#";
  document.querySelector("#place-meta").innerHTML = `
    <div><span>VISIT</span><strong>${place.time}</strong></div>
    <div><span>NOTE</span><strong>${place.note}</strong></div>`;
  dialog.dataset.place = id;
  dialog.showModal();
  document.body.classList.add("dialog-open");
  updateHash(id);
}

function closePlace() {
  if (dialog.open) dialog.close();
  document.body.classList.remove("dialog-open");
  delete dialog.dataset.place;
  updateHash();
  if (lastTrigger) lastTrigger.focus();
}

function openArabic() {
  arabicTrigger = document.activeElement;
  arabicDialog.showModal();
  document.body.classList.add("dialog-open");
}

function closeArabic() {
  if (arabicDialog.open) arabicDialog.close();
  document.body.classList.remove("dialog-open");
  if (arabicTrigger) arabicTrigger.focus();
}

function mapSegmentClass(mode) {
  if (["国内線", "国際線"].includes(mode)) return "is-flight";
  if (["クルーズ", "帆船", "ボート", "船中泊", "乗船"].includes(mode)) return "is-water";
  return "is-road";
}

function renderInteractiveMap(map, day) {
  if (typeof L === "undefined") return;
  if (leafletMap) leafletMap.remove();

  const mapElement = document.querySelector("#egypt-map");
  mapElement.innerHTML = "";
  leafletMap = L.map(mapElement, { scrollWheelZoom: false });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(leafletMap);

  const rootStyle = getComputedStyle(document.documentElement);
  const accent = rootStyle.getPropertyValue("--cp-accent").trim();
  const link = rootStyle.getPropertyValue("--cp-link").trim();
  const points = map.stops.map(stop => [stop.lat, stop.lng]);

  map.stops.slice(1).forEach((stop, index) => {
    const previous = map.stops[index];
    const type = mapSegmentClass(stop.mode);
    L.polyline([[previous.lat, previous.lng], [stop.lat, stop.lng]], {
      color: type === "is-water" ? link : accent,
      weight: 4,
      opacity: .85,
      dashArray: type === "is-flight" ? "10 10" : null
    }).addTo(leafletMap);
  });

  map.stops.forEach((stop, index) => {
    const marker = L.marker([stop.lat, stop.lng], {
      icon: L.divIcon({
        className: "route-map-marker",
        html: `<span>${index + 1}</span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -16]
      })
    }).addTo(leafletMap);
    marker.bindPopup(`<strong>${stop.name}</strong><small>${stop.detail}</small><em>${stop.mode}</em>`);
  });

  leafletMap.fitBounds(points, { padding: [32, 32], maxZoom: 13 });
  requestAnimationFrame(() => leafletMap.invalidateSize());
  mapElement.setAttribute("aria-label", `${day.date}の訪問地と移動経路を示すOpenStreetMap`);
}

function openMap() {
  const day = days[selectedDay];
  const map = dayMaps[selectedDay];
  mapTrigger = document.activeElement;
  document.querySelector("#map-kicker").textContent = `DAY ${String(selectedDay + 1).padStart(2, "0")} · ${day.date} ${day.weekday}`;
  document.querySelector("#map-title").textContent = day.location;
  document.querySelector("#map-summary").textContent = day.title;
  document.querySelector("#map-route-meta").innerHTML = `<span>ROUTE</span><strong>${map.note}</strong>`;
  document.querySelector("#map-stop-list").innerHTML = map.stops.map((stop, index) => `
    <li>
      <span class="map-stop-number">${index + 1}</span>
      <div><strong>${stop.name}</strong><small>${stop.detail}</small></div>
      <em>${stop.mode}</em>
    </li>`).join("");

  const segments = map.stops.slice(1).map((stop, index) => {
    const previous = map.stops[index];
    return `<line class="map-route-line ${mapSegmentClass(stop.mode)}" x1="${previous.x}" y1="${previous.y}" x2="${stop.x}" y2="${stop.y}" />`;
  }).join("");
  const markers = map.stops.map((stop, index) => `
    <g class="map-marker" transform="translate(${stop.x} ${stop.y})">
      <circle r="14"></circle>
      <text text-anchor="middle" dominant-baseline="central">${index + 1}</text>
    </g>`).join("");
  document.querySelector("#egypt-map").innerHTML = `
    <svg viewBox="0 0 420 620" role="img" aria-labelledby="egypt-map-title egypt-map-desc">
      <title id="egypt-map-title">${day.date}の訪問地と移動経路</title>
      <desc id="egypt-map-desc">${map.stops.map((stop, index) => `${index + 1}. ${stop.name}`).join("、")}</desc>
      <defs>
        <pattern id="desert-texture" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M-4 14C2 8 8 8 14 14S26 20 32 14"></path>
        </pattern>
        <filter id="map-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".16"></feDropShadow>
        </filter>
      </defs>
      <path class="map-sea" d="M0 0h420v620H0z"></path>
      <path class="map-neighbor" d="M0 74L104 77L104 570L0 570ZM104 570L292 570L300 620L74 620ZM286 75L420 83L420 238L368 211L316 215L374 103Z"></path>
      <path class="map-land" filter="url(#map-shadow)" d="M104 77C151 70 216 68 251 73C266 75 278 78 286 84L286 103C286 120 292 139 299 153C307 181 312 205 313 229C311 269 305 316 303 361C300 424 296 498 292 570L104 570Z"></path>
      <path class="map-sinai" filter="url(#map-shadow)" d="M286 84L374 103L316 215C309 196 304 174 299 153C292 133 287 116 286 103Z"></path>
      <path class="map-desert-texture" d="M104 77C151 70 216 68 251 73C266 75 278 78 286 84L286 103C286 120 292 139 299 153C307 181 312 205 313 229C311 269 305 316 303 361C300 424 296 498 292 570L104 570ZM286 84L374 103L316 215C309 196 304 174 299 153C292 133 287 116 286 103Z"></path>
      <path class="map-gulf" d="M286 103C289 126 293 141 299 153C308 181 313 203 316 215C306 205 296 190 290 174C283 153 280 130 286 103Z"></path>
      <path class="map-relief" d="M126 151C161 126 203 125 232 144M128 214C169 190 213 193 239 218M130 301C172 273 218 280 246 307M136 390C173 361 215 365 244 393M137 480C176 451 218 456 247 485M324 119C337 131 341 147 335 164M343 111C356 124 359 139 350 153"></path>
      <path class="map-nile-valley" d="M276 530C266 482 271 434 276 391C283 331 282 278 273 226C269 197 263 174 258 153"></path>
      <path class="map-lake" d="M275 541C266 525 263 506 270 489C278 499 281 514 278 529C286 543 284 558 276 571C269 561 268 550 275 541Z"></path>
      <path class="map-nile" d="M276 505C269 456 275 412 278 369C283 310 280 259 273 219C268 190 262 169 258 153"></path>
      <path class="map-delta-fill" d="M258 153C245 143 226 126 216 103C238 94 268 94 290 105C280 127 269 144 258 153Z"></path>
      <path class="map-delta" d="M258 153C249 139 232 122 216 103M258 153C258 135 257 116 257 98M258 153C269 136 279 120 290 105M245 135L274 130"></path>
      <path class="map-border" d="M104 77L104 570L292 570M286 84L286 103M286 84L374 103L316 215"></path>
      <text class="map-water-label" x="28" y="45">地中海</text>
      <text class="map-water-label" x="337" y="322" transform="rotate(78 337 322)">紅海</text>
      <text class="map-water-label map-small-label" x="302" y="174" transform="rotate(72 302 174)">スエズ湾</text>
      <text class="map-country-label" x="143" y="330">EGYPT</text>
      <text class="map-neighbor-label" x="33" y="327">LIBYA</text>
      <text class="map-neighbor-label" x="155" y="605">SUDAN</text>
      <text class="map-neighbor-label" x="349" y="74">ISRAEL</text>
      <text class="map-city-label" x="265" y="126">カイロ</text>
      <text class="map-city-label" x="288" y="452">アスワン</text>
      ${segments}
      ${markers}
    </svg>`;
  mapDialog.showModal();
  document.body.classList.add("dialog-open");
  renderInteractiveMap(map, day);
}

function closeMap() {
  if (mapDialog.open) mapDialog.close();
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }
  document.body.classList.remove("dialog-open");
  if (mapTrigger) mapTrigger.focus();
}

function updateHash(placeId) {
  const value = `day=${selectedDay + 1}${placeId ? `&place=${placeId}` : ""}`;
  history.replaceState(null, "", `#${value}`);
}

function restoreFromHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  const day = Number(params.get("day"));
  if (Number.isInteger(day) && day >= 1 && day <= days.length) selectedDay = day - 1;
  renderDateButtons();
  renderDay();
  const place = params.get("place");
  if (place && places[place]) openPlace(place);
}

document.querySelector("#prev-day").addEventListener("click", () => selectDay(selectedDay - 1, true));
document.querySelector("#next-day").addEventListener("click", () => selectDay(selectedDay + 1, true));
document.querySelector("#dialog-close").addEventListener("click", closePlace);
dialog.addEventListener("click", event => { if (event.target === dialog) closePlace(); });
dialog.addEventListener("cancel", event => { event.preventDefault(); closePlace(); });
document.querySelector("#arabic-open").addEventListener("click", openArabic);
document.querySelector("#arabic-close").addEventListener("click", closeArabic);
arabicDialog.addEventListener("click", event => { if (event.target === arabicDialog) closeArabic(); });
arabicDialog.addEventListener("cancel", event => { event.preventDefault(); closeArabic(); });
document.querySelector("#map-open").addEventListener("click", openMap);
document.querySelector("#map-close").addEventListener("click", closeMap);
mapDialog.addEventListener("click", event => { if (event.target === mapDialog) closeMap(); });
mapDialog.addEventListener("cancel", event => { event.preventDefault(); closeMap(); });
window.addEventListener("hashchange", restoreFromHash);
document.querySelector("#weather-refresh").addEventListener("click", loadWeather);
document.querySelector("#currency-refresh").addEventListener("click", loadCurrencyRates);
currencyInputs.forEach(input => input.addEventListener("input", () => convertCurrency(input)));

renderRoute();
restoreFromHash();
updateEgyptTime();
setInterval(updateEgyptTime, 30000);
loadWeather();
loadCurrencyRates();