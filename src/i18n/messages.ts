export const LOCALES = ["zh-CN", "zh-TW", "zh-HK", "ja", "en", "ko"] as const;
export type Locale = (typeof LOCALES)[number];

type JapanRegionKey =
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "chubu"
  | "kansai"
  | "chugoku"
  | "shikoku"
  | "kyushu"
  | "okinawa";

export type Messages = {
  localeName: string;
  languageLabel: string;
  htmlTitle: string;
  title: string;
  subtitle: (total: number, shown: number) => string;
  searchPlaceholder: string;
  sectionLocation: string;
  countryLabel: string;
  allCountries: string;
  regionLabel: string;
  allRegions: string;
  japanRegions: Record<JapanRegionKey, string>;
  cityLabel: string;
  allCities: string;
  districtLabel: string;
  allDistricts: string;
  sectionCategory: string;
  sectionSeason: string;
  sectionList: string;
  clear: string;
  openOnly: string;
  empty: string;
  footer: string;
  sourceLabel: string;
  sourceUpdated: (updated: string) => string;
  mapTokyo: string;
  mapFitAll: string;
  mapLoading: string;
  mapError: string;
  toggleOpen: string;
  toggleClose: string;
  popDish: string;
  popAddress: string;
  popNotes: string;
  popGoogle: string;
  popTabelog: string;
  status: Record<"营业中" | "已闭店" | "不确定", string>;
  /** 分类的本地化名称，key 为数据中的规范分类名（简中） */
  categories: Record<string, string>;
  series: Record<"MANGA" | "SP" | "ORIGINAL" | "EACH", string>;
  episodeBadge: (seasonKey: string, episode: number) => string;
};

const zhCN: Messages = {
  localeName: "简体中文",
  languageLabel: "语言",
  htmlTitle: "孤独的美食家 · 圣地巡礼地图",
  title: "孤独的美食家 · 圣地巡礼地图",
  subtitle: (t, s) => `来源地图收录 ${t} 个地点 · 当前显示 ${s} 个`,
  searchPlaceholder: "搜索店名 / 菜品 / 地区…",
  sectionLocation: "区域",
  countryLabel: "国家或地区",
  allCountries: "全部国家和地区",
  regionLabel: "日本地区",
  allRegions: "全部日本地区",
  japanRegions: {
    hokkaido: "北海道",
    tohoku: "东北",
    kanto: "关东",
    chubu: "中部",
    kansai: "关西",
    chugoku: "中国地方",
    shikoku: "四国",
    kyushu: "九州",
    okinawa: "冲绳",
  },
  cityLabel: "城市",
  allCities: "全部城市",
  districtLabel: "商圈",
  allDistricts: "全部商圈",
  sectionCategory: "分类",
  sectionSeason: "作品 / 季",
  sectionList: "地点列表",
  clear: "清除",
  openOnly: "只看标为营业中的地点",
  empty: "没有符合条件的地点",
  footer: "营业信息可能有变动，出发前请向店铺确认",
  sourceLabel: "数据来源",
  sourceUpdated: (updated) => `来源更新于 ${updated}`,
  mapTokyo: "东京都心",
  mapFitAll: "全部范围",
  mapLoading: "地图加载中…",
  mapError: "Mapbox 地图加载失败，请检查访问令牌配置",
  toggleOpen: "☰ 筛选 / 列表",
  toggleClose: "✕ 关闭",
  popDish: "五郎的一餐",
  popAddress: "地址",
  popNotes: "备注",
  popGoogle: "Google 地图 ↗",
  popTabelog: "食べログ搜索 ↗",
  status: { 营业中: "营业中", 已闭店: "已闭店", 不确定: "不确定" },
  categories: {
    "烧肉·烤肉": "烧肉·烤肉",
    拉面: "拉面",
    中华料理: "中华料理",
    "定食·食堂": "定食·食堂",
    "居酒屋·酒场": "居酒屋·酒场",
    "洋食·西餐": "洋食·西餐",
    咖喱: "咖喱",
    "寿司·海鲜": "寿司·海鲜",
    "荞麦·乌冬": "荞麦·乌冬",
    "串烧·烤鸡": "串烧·烤鸡",
    "御好烧·铁板烧": "御好烧·铁板烧",
    "亚洲·异国料理": "亚洲·异国料理",
    "甜点·咖啡": "甜点·咖啡",
    其他: "其他",
  },
  series: { MANGA: "漫画", SP: "SP", ORIGINAL: "配信", EACH: "各自" },
  episodeBadge: (k, e) =>
    k === "MANGA"
      ? `漫画 第${e}话`
      : k === "SP"
        ? `SP·${e}`
        : k === "ORIGINAL"
          ? "配信原创"
          : k === "EACH"
            ? `各自 第${e}话`
            : `${k} 第${e}集`,
};

const zhTW: Messages = {
  localeName: "繁體中文（台灣）",
  languageLabel: "語言",
  htmlTitle: "孤獨的美食家 · 聖地巡禮地圖",
  title: "孤獨的美食家 · 聖地巡禮地圖",
  subtitle: (t, s) => `來源地圖收錄 ${t} 個地點 · 目前顯示 ${s} 個`,
  searchPlaceholder: "搜尋店名 / 菜色 / 地區…",
  sectionLocation: "地區",
  countryLabel: "國家或地區",
  allCountries: "所有國家與地區",
  regionLabel: "日本地區",
  allRegions: "所有日本地區",
  japanRegions: {
    hokkaido: "北海道",
    tohoku: "東北",
    kanto: "關東",
    chubu: "中部",
    kansai: "關西",
    chugoku: "中國地方",
    shikoku: "四國",
    kyushu: "九州",
    okinawa: "沖繩",
  },
  cityLabel: "城市",
  allCities: "所有城市",
  districtLabel: "商圈",
  allDistricts: "所有商圈",
  sectionCategory: "分類",
  sectionSeason: "作品 / 季",
  sectionList: "地點列表",
  clear: "清除",
  openOnly: "只看標示為營業中的地點",
  empty: "沒有符合條件的地點",
  footer: "營業資訊可能有變動，出發前請向店家確認",
  sourceLabel: "資料來源",
  sourceUpdated: (updated) => `來源更新於 ${updated}`,
  mapTokyo: "東京都心",
  mapFitAll: "全部範圍",
  mapLoading: "地圖載入中…",
  mapError: "Mapbox 地圖載入失敗，請檢查存取權杖設定",
  toggleOpen: "☰ 篩選 / 列表",
  toggleClose: "✕ 關閉",
  popDish: "五郎的一餐",
  popAddress: "地址",
  popNotes: "備註",
  popGoogle: "Google 地圖 ↗",
  popTabelog: "食べログ搜尋 ↗",
  status: { 营业中: "營業中", 已闭店: "已歇業", 不确定: "不確定" },
  categories: {
    "烧肉·烤肉": "燒肉·烤肉",
    拉面: "拉麵",
    中华料理: "中華料理",
    "定食·食堂": "定食·食堂",
    "居酒屋·酒场": "居酒屋·酒場",
    "洋食·西餐": "洋食·西餐",
    咖喱: "咖哩",
    "寿司·海鲜": "壽司·海鮮",
    "荞麦·乌冬": "蕎麥·烏龍麵",
    "串烧·烤鸡": "串燒·烤雞",
    "御好烧·铁板烧": "大阪燒·鐵板燒",
    "亚洲·异国料理": "亞洲·異國料理",
    "甜点·咖啡": "甜點·咖啡",
    其他: "其他",
  },
  series: { MANGA: "漫畫", SP: "SP", ORIGINAL: "配信", EACH: "各自" },
  episodeBadge: (k, e) =>
    k === "MANGA"
      ? `漫畫 第${e}話`
      : k === "SP"
        ? `SP·${e}`
        : k === "ORIGINAL"
          ? "配信原創"
          : k === "EACH"
            ? `各自 第${e}話`
            : `${k} 第${e}集`,
};

const zhHK: Messages = {
  localeName: "繁體中文（香港）",
  languageLabel: "語言",
  htmlTitle: "孤獨的美食家 · 聖地巡禮地圖",
  title: "孤獨的美食家 · 聖地巡禮地圖",
  subtitle: (t, s) => `來源地圖收錄 ${t} 個地點 · 現時顯示 ${s} 個`,
  searchPlaceholder: "搜尋店名 / 菜式 / 地區…",
  sectionLocation: "地區",
  countryLabel: "國家或地區",
  allCountries: "所有國家及地區",
  regionLabel: "日本地區",
  allRegions: "所有日本地區",
  japanRegions: {
    hokkaido: "北海道",
    tohoku: "東北",
    kanto: "關東",
    chubu: "中部",
    kansai: "關西",
    chugoku: "中國地方",
    shikoku: "四國",
    kyushu: "九州",
    okinawa: "沖繩",
  },
  cityLabel: "城市",
  allCities: "所有城市",
  districtLabel: "商圈",
  allDistricts: "所有商圈",
  sectionCategory: "分類",
  sectionSeason: "作品 / 季",
  sectionList: "地點列表",
  clear: "清除",
  openOnly: "只顯示標示為營業中的地點",
  empty: "沒有符合條件的地點",
  footer: "營業資料可能有變動，出發前請向店舖確認",
  sourceLabel: "資料來源",
  sourceUpdated: (updated) => `來源更新於 ${updated}`,
  mapTokyo: "東京都心",
  mapFitAll: "全部範圍",
  mapLoading: "地圖載入中…",
  mapError: "Mapbox 地圖載入失敗，請檢查存取權杖設定",
  toggleOpen: "☰ 篩選 / 列表",
  toggleClose: "✕ 關閉",
  popDish: "五郎的一餐",
  popAddress: "地址",
  popNotes: "備註",
  popGoogle: "Google 地圖 ↗",
  popTabelog: "食べログ搜尋 ↗",
  status: { 营业中: "營業中", 已闭店: "已結業", 不确定: "不確定" },
  categories: {
    "烧肉·烤肉": "燒肉·燒烤",
    拉面: "拉麵",
    中华料理: "中華料理",
    "定食·食堂": "定食·食堂",
    "居酒屋·酒场": "居酒屋·酒場",
    "洋食·西餐": "洋食·西餐",
    咖喱: "咖喱",
    "寿司·海鲜": "壽司·海鮮",
    "荞麦·乌冬": "蕎麥·烏冬",
    "串烧·烤鸡": "串燒·燒鳥",
    "御好烧·铁板烧": "大阪燒·鐵板燒",
    "亚洲·异国料理": "亞洲·異國料理",
    "甜点·咖啡": "甜品·咖啡",
    其他: "其他",
  },
  series: { MANGA: "漫畫", SP: "SP", ORIGINAL: "配信", EACH: "各自" },
  episodeBadge: (k, e) =>
    k === "MANGA"
      ? `漫畫 第${e}話`
      : k === "SP"
        ? `SP·${e}`
        : k === "ORIGINAL"
          ? "配信原創"
          : k === "EACH"
            ? `各自 第${e}話`
            : `${k} 第${e}集`,
};

const ja: Messages = {
  localeName: "日本語",
  languageLabel: "言語",
  htmlTitle: "孤独のグルメ 聖地巡礼マップ",
  title: "聖地巡礼グルメマップ",
  subtitle: (t, s) => `元マップ収録 ${t} スポット · 表示中 ${s}`,
  searchPlaceholder: "店名・料理・エリアで検索…",
  sectionLocation: "エリア",
  countryLabel: "国・地域",
  allCountries: "すべての国・地域",
  regionLabel: "地方",
  allRegions: "すべての地方",
  japanRegions: {
    hokkaido: "北海道",
    tohoku: "東北",
    kanto: "関東",
    chubu: "中部",
    kansai: "関西",
    chugoku: "中国",
    shikoku: "四国",
    kyushu: "九州",
    okinawa: "沖縄",
  },
  cityLabel: "都市",
  allCities: "すべての都市",
  districtLabel: "エリア",
  allDistricts: "すべてのエリア",
  sectionCategory: "ジャンル",
  sectionSeason: "作品 / シーズン",
  sectionList: "スポット一覧",
  clear: "クリア",
  openOnly: "営業中と記載されたスポットのみ",
  empty: "条件に合うスポットがありません",
  footer: "営業情報は変更される場合があります。訪問前に店舗へご確認ください",
  sourceLabel: "データ出典",
  sourceUpdated: (updated) => `出典の更新: ${updated}`,
  mapTokyo: "東京都心",
  mapFitAll: "全体表示",
  mapLoading: "地図を読み込み中…",
  mapError: "Mapboxを読み込めません。アクセストークンをご確認ください",
  toggleOpen: "☰ フィルター / リスト",
  toggleClose: "✕ 閉じる",
  popDish: "五郎の一食",
  popAddress: "住所",
  popNotes: "メモ",
  popGoogle: "Google マップ ↗",
  popTabelog: "食べログで検索 ↗",
  status: { 营业中: "営業中", 已闭店: "閉店", 不确定: "不明" },
  categories: {
    "烧肉·烤肉": "焼肉",
    拉面: "ラーメン",
    中华料理: "中華料理",
    "定食·食堂": "定食・食堂",
    "居酒屋·酒场": "居酒屋・酒場",
    "洋食·西餐": "洋食",
    咖喱: "カレー",
    "寿司·海鲜": "寿司・海鮮",
    "荞麦·乌冬": "そば・うどん",
    "串烧·烤鸡": "焼き鳥・串焼き",
    "御好烧·铁板烧": "お好み焼き・鉄板焼き",
    "亚洲·异国料理": "アジア・エスニック",
    "甜点·咖啡": "スイーツ・喫茶",
    其他: "その他",
  },
  series: { MANGA: "漫画", SP: "SP", ORIGINAL: "配信", EACH: "それぞれ" },
  episodeBadge: (k, e) =>
    k === "MANGA"
      ? `漫画 第${e}話`
      : k === "SP"
        ? `SP·${e}`
        : k === "ORIGINAL"
          ? "配信オリジナル"
          : k === "EACH"
            ? `それぞれ 第${e}話`
            : `${k} 第${e}話`,
};

const en: Messages = {
  localeName: "English",
  languageLabel: "Language",
  htmlTitle: "Solitary Gourmet Pilgrimage Map",
  title: "Solitary Gourmet Pilgrimage Map",
  subtitle: (t, s) => `${t} places from the source map · showing ${s}`,
  searchPlaceholder: "Search name / dish / area…",
  sectionLocation: "Area",
  countryLabel: "Country or region",
  allCountries: "All countries and regions",
  regionLabel: "Japan region",
  allRegions: "All Japan regions",
  japanRegions: {
    hokkaido: "Hokkaido",
    tohoku: "Tohoku",
    kanto: "Kanto",
    chubu: "Chubu",
    kansai: "Kansai",
    chugoku: "Chugoku",
    shikoku: "Shikoku",
    kyushu: "Kyushu",
    okinawa: "Okinawa",
  },
  cityLabel: "City",
  allCities: "All cities",
  districtLabel: "District",
  allDistricts: "All districts",
  sectionCategory: "Category",
  sectionSeason: "Series / Season",
  sectionList: "Places",
  clear: "Clear",
  openOnly: "Places marked as open only",
  empty: "No places match your filters",
  footer: "Opening details may change; confirm with the venue before visiting",
  sourceLabel: "Data source",
  sourceUpdated: (updated) => `Source updated ${updated}`,
  mapTokyo: "Central Tokyo",
  mapFitAll: "Fit all",
  mapLoading: "Loading map…",
  mapError: "Mapbox could not load; check the access token configuration",
  toggleOpen: "☰ Filters / List",
  toggleClose: "✕ Close",
  popDish: "Goro's meal",
  popAddress: "Address",
  popNotes: "Notes",
  popGoogle: "Google Maps ↗",
  popTabelog: "Tabelog ↗",
  status: { 营业中: "Open", 已闭店: "Closed", 不确定: "Unknown" },
  categories: {
    "烧肉·烤肉": "Yakiniku / BBQ",
    拉面: "Ramen",
    中华料理: "Chinese",
    "定食·食堂": "Teishoku / Diner",
    "居酒屋·酒场": "Izakaya / Bar",
    "洋食·西餐": "Yoshoku / Western",
    咖喱: "Curry",
    "寿司·海鲜": "Sushi / Seafood",
    "荞麦·乌冬": "Soba / Udon",
    "串烧·烤鸡": "Yakitori / Skewers",
    "御好烧·铁板烧": "Okonomiyaki / Teppan",
    "亚洲·异国料理": "Asian / Ethnic",
    "甜点·咖啡": "Sweets / Café",
    其他: "Other",
  },
  series: { MANGA: "Manga", SP: "SP", ORIGINAL: "Stream", EACH: "Each" },
  episodeBadge: (k, e) =>
    k === "MANGA"
      ? `Manga #${e}`
      : k === "SP"
        ? `SP ${e}`
        : k === "ORIGINAL"
          ? "Streaming original"
          : k === "EACH"
            ? `Each E${e}`
            : `${k} E${e}`,
};

const ko: Messages = {
  localeName: "한국어",
  languageLabel: "언어",
  htmlTitle: "고독한 미식가 성지순례 지도",
  title: "고독한 미식가 성지순례 지도",
  subtitle: (t, s) => `원본 지도 수록 ${t}곳 · 표시 중 ${s}곳`,
  searchPlaceholder: "가게 이름 / 메뉴 / 지역 검색…",
  sectionLocation: "지역",
  countryLabel: "국가 또는 지역",
  allCountries: "모든 국가 및 지역",
  regionLabel: "일본 권역",
  allRegions: "모든 일본 권역",
  japanRegions: {
    hokkaido: "홋카이도",
    tohoku: "도호쿠",
    kanto: "간토",
    chubu: "주부",
    kansai: "간사이",
    chugoku: "주고쿠",
    shikoku: "시코쿠",
    kyushu: "규슈",
    okinawa: "오키나와",
  },
  cityLabel: "도시",
  allCities: "모든 도시",
  districtLabel: "상권",
  allDistricts: "모든 상권",
  sectionCategory: "분류",
  sectionSeason: "작품 / 시즌",
  sectionList: "장소 목록",
  clear: "지우기",
  openOnly: "영업 중으로 표시된 장소만",
  empty: "조건에 맞는 장소가 없습니다",
  footer: "영업 정보는 변경될 수 있으니 방문 전에 확인하세요",
  sourceLabel: "데이터 출처",
  sourceUpdated: (updated) => `출처 업데이트 ${updated}`,
  mapTokyo: "도쿄 도심",
  mapFitAll: "전체 보기",
  mapLoading: "지도 불러오는 중…",
  mapError: "Mapbox를 불러올 수 없습니다. 액세스 토큰 설정을 확인하세요",
  toggleOpen: "☰ 필터 / 목록",
  toggleClose: "✕ 닫기",
  popDish: "고로의 한 끼",
  popAddress: "주소",
  popNotes: "비고",
  popGoogle: "구글 지도 ↗",
  popTabelog: "타베로그 검색 ↗",
  status: { 营业中: "영업 중", 已闭店: "폐업", 不确定: "불확실" },
  categories: {
    "烧肉·烤肉": "야키니쿠·고기구이",
    拉面: "라멘",
    中华料理: "중화요리",
    "定食·食堂": "정식·식당",
    "居酒屋·酒场": "이자카야·술집",
    "洋食·西餐": "양식",
    咖喱: "카레",
    "寿司·海鲜": "스시·해산물",
    "荞麦·乌冬": "소바·우동",
    "串烧·烤鸡": "야키토리·꼬치",
    "御好烧·铁板烧": "오코노미야키·철판구이",
    "亚洲·异国料理": "아시아·이국 요리",
    "甜点·咖啡": "디저트·카페",
    其他: "기타",
  },
  series: { MANGA: "만화", SP: "SP", ORIGINAL: "스트리밍", EACH: "각자의" },
  episodeBadge: (k, e) =>
    k === "MANGA"
      ? `만화 ${e}화`
      : k === "SP"
        ? `SP ${e}`
        : k === "ORIGINAL"
          ? "스트리밍 오리지널"
          : k === "EACH"
            ? `각자의 ${e}화`
            : `${k} ${e}화`,
};

export const MESSAGES: Record<Locale, Messages> = {
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  "zh-HK": zhHK,
  ja,
  en,
  ko,
};
