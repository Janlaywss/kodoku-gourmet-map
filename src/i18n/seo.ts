import type { Locale } from "@/i18n/messages";

export type SeoCopy = {
  title: string;
  description: string;
  imageAlt: string;
};

export const SEO_COPY: Record<Locale, SeoCopy> = {
  en: {
    title: "274 Kodoku no Gourmet Locations | Pilgrimage Map",
    description:
      "Explore 274 restaurants and filming locations from Kodoku no Gourmet on an interactive map. Filter by country, Japan region, city, district, season, cuisine and operating status.",
    imageAlt:
      "Kodoku no Gourmet pilgrimage map of Japan with colorful restaurant pins",
  },
  ja: {
    title: "孤独のグルメ 聖地巡礼マップ｜全274スポット",
    description:
      "『孤独のグルメ』の漫画・ドラマに登場する全274スポットを地図で検索。国、日本の地方、都市、エリア、作品、シーズン、料理ジャンル、営業状況で絞り込めます。",
    imageAlt: "飲食店のカラフルなピンを配置した孤独のグルメ聖地巡礼マップ",
  },
  "zh-CN": {
    title: "孤独的美食家圣地巡礼地图｜274个取景餐厅",
    description:
      "在交互地图上探索《孤独的美食家》漫画与电视剧收录的274个餐厅和取景地点，支持按国家、日本地区、城市、商圈、季度、料理及营业状态筛选。",
    imageAlt: "标有彩色餐厅图标的孤独的美食家日本圣地巡礼地图",
  },
  "zh-TW": {
    title: "孤獨的美食家聖地巡禮地圖｜274個取景餐廳",
    description:
      "在互動地圖探索《孤獨的美食家》漫畫與電視劇收錄的274個餐廳和取景地點，可依國家、日本地區、城市、商圈、季度、料理及營業狀態篩選。",
    imageAlt: "標有彩色餐廳圖示的孤獨的美食家日本聖地巡禮地圖",
  },
  "zh-HK": {
    title: "孤獨的美食家聖地巡禮地圖｜274間取景餐廳",
    description:
      "在互動地圖探索《孤獨的美食家》漫畫及電視劇收錄的274間餐廳和取景地點，可按國家、日本地區、城市、商圈、季度、菜式及營業狀態篩選。",
    imageAlt: "標有彩色餐廳圖示的孤獨的美食家日本聖地巡禮地圖",
  },
  ko: {
    title: "고독한 미식가 성지순례 지도 | 274개 촬영지",
    description:
      "《고독한 미식가》 만화와 드라마에 등장한 274개 식당과 촬영지를 인터랙티브 지도에서 탐색하세요. 국가, 일본 권역, 도시, 상권, 시즌, 요리와 영업 상태로 필터링할 수 있습니다.",
    imageAlt: "다채로운 식당 핀이 표시된 고독한 미식가 일본 성지순례 지도",
  },
};

export const OPEN_GRAPH_LOCALE: Record<Locale, string> = {
  en: "en_US",
  ja: "ja_JP",
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
  "zh-HK": "zh_HK",
  ko: "ko_KR",
};
