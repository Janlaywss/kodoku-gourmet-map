import { RESTAURANTS, type Restaurant } from "@/data";

export type CountryCode = "JP" | "KR" | "TW" | "FR";

export type JapanRegionCode =
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "chubu"
  | "kansai"
  | "chugoku"
  | "shikoku"
  | "kyushu"
  | "okinawa";

export type RestaurantGeography = {
  country: CountryCode;
  regionId: string;
  region: JapanRegionCode | null;
  cityId: string;
  city: string;
  districtId: string;
  district: string;
};

export type CountryOption = {
  code: CountryCode;
  count: number;
};

export type CityOption = {
  id: string;
  country: CountryCode;
  regionId: string;
  label: string;
  count: number;
};

export type RegionOption = {
  id: string;
  country: "JP";
  code: JapanRegionCode;
  count: number;
};

export type DistrictOption = {
  id: string;
  cityId: string;
  label: string;
  count: number;
};

const COUNTRY_ORDER: CountryCode[] = ["JP", "KR", "TW", "FR"];

const JAPAN_REGION_ORDER: JapanRegionCode[] = [
  "hokkaido",
  "tohoku",
  "kanto",
  "chubu",
  "kansai",
  "chugoku",
  "shikoku",
  "kyushu",
  "okinawa",
];

const JAPAN_REGION_PREFECTURES: Record<JapanRegionCode, readonly string[]> = {
  hokkaido: ["北海道"],
  tohoku: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  kanto: [
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
  ],
  chubu: [
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
  ],
  kansai: [
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
  ],
  chugoku: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
  shikoku: ["徳島県", "香川県", "愛媛県", "高知県"],
  kyushu: [
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
  ],
  okinawa: ["沖縄県"],
};

const TOKYO_WARDS = [
  "千代田区",
  "中央区",
  "港区",
  "新宿区",
  "文京区",
  "台東区",
  "墨田区",
  "江東区",
  "品川区",
  "目黒区",
  "大田区",
  "世田谷区",
  "渋谷区",
  "中野区",
  "杉並区",
  "豊島区",
  "北区",
  "荒川区",
  "板橋区",
  "練馬区",
  "足立区",
  "葛飾区",
  "江戸川区",
] as const;

const collator = new Intl.Collator("ja");

function compact(value: string): string {
  return value.replace(/[\s　]+/gu, "").replace(/^【新住所】/u, "");
}

function makeGeography(
  country: CountryCode,
  city: string,
  district: string,
  region: JapanRegionCode | null = null,
): RestaurantGeography {
  const cityId = region
    ? `${country}:${region}:${city}`
    : `${country}:${city}`;
  return {
    country,
    regionId: region ? `${country}:${region}` : "",
    region,
    cityId,
    city,
    districtId: `${cityId}:${district}`,
    district,
  };
}

function regionForJapan(restaurant: Restaurant): JapanRegionCode {
  const text = compact(
    `${restaurant.address} ${restaurant.area} ${restaurant.name}`,
  );

  for (const region of JAPAN_REGION_ORDER) {
    if (
      JAPAN_REGION_PREFECTURES[region].some((prefecture) =>
        text.includes(prefecture),
      )
    ) {
      return region;
    }
  }

  // A few source entries omit the prefecture. These municipality fallbacks
  // keep their region deterministic without requiring a second location API.
  if (/札幌市|旭川市|小樽市|苫小牧市|千歳市|石狩市/u.test(text)) return "hokkaido";
  if (/青森市|盛岡市|仙台市|秋田市|山形市|郡山市|石巻市|女川町/u.test(text)) {
    return "tohoku";
  }
  if (
    TOKYO_WARDS.some((ward) => text.includes(ward)) ||
    /東京|横浜市|川崎市|相模原市|さいたま市|千葉市|宇都宮市/u.test(text)
  ) {
    return "kanto";
  }
  if (/名古屋市|静岡市|浜松市|富山市|金沢市|下呂市|新潟市/u.test(text)) {
    return "chubu";
  }
  if (/大阪市|京都市|神戸市|松阪市|伊勢市|舞鶴市|篠山市/u.test(text)) {
    return "kansai";
  }
  if (/広島市|鳥取市|出雲市|岡山市|下関市/u.test(text)) return "chugoku";
  if (/高松市|松山市|徳島市|高知市/u.test(text)) return "shikoku";
  if (/福岡市|北九州市|長崎市|熊本市|大分市|宮崎市|鹿児島市/u.test(text)) {
    return "kyushu";
  }
  if (/沖縄|那覇市|今帰仁村|読谷村|宜野湾市/u.test(text)) return "okinawa";

  // Coordinates are only a last resort for malformed legacy source entries.
  if (restaurant.lat >= 41) return "hokkaido";
  if (restaurant.lat < 28.5) return "okinawa";
  if (restaurant.lng < 132.2) return "kyushu";
  if (restaurant.lng < 135.2 && restaurant.lat < 34.5) return "shikoku";
  if (restaurant.lng < 135.5) return "chugoku";
  if (restaurant.lng < 136.8) return "kansai";
  if (restaurant.lat >= 37) return "tohoku";
  if (restaurant.lng >= 139) return "kanto";
  return "chubu";
}

function countryFor(restaurant: Restaurant): CountryCode {
  const location = `${restaurant.area} ${restaurant.address}`;
  if (/韓国|ソウル|チョンジュ|全羅北道|全州市|釜山/u.test(location)) return "KR";
  if (/台湾|台灣|台北市|宜蘭/u.test(location)) return "TW";
  if (/フランス|パリ/u.test(location)) return "FR";

  // The Paris source entry has no address or area, so coordinates are the
  // final fallback for the only non-Asian point in the source data.
  if (restaurant.lng > -6 && restaurant.lng < 10 && restaurant.lat > 41) {
    return "FR";
  }
  return "JP";
}

function localityFrom(value: string): string | null {
  const match = value.match(
    /^([^\d０-９,，、。・()（）【】「」『』\[\]]{1,24})(?=[\d０-９,，、。・()（）【】「」『』\[\]]|$)/u,
  );
  return match?.[1]?.replace(/(?:丁目|番地)$/u, "") || null;
}

function japanGeography(restaurant: Restaurant): RestaurantGeography {
  const region = regionForJapan(restaurant);
  const combined = compact(
    `${restaurant.address || restaurant.area} ${restaurant.area} ${restaurant.name}`,
  );
  const tokyoWard = TOKYO_WARDS.find((ward) => combined.includes(ward));
  if (tokyoWard) return makeGeography("JP", "東京都", tokyoWard, region);

  const sources = [restaurant.address, restaurant.area, restaurant.name]
    .filter(Boolean)
    .map(compact);

  for (const source of sources) {
    const withoutPrefecture = source.replace(
      /^.*?(?:東京都|北海道|京都府|大阪府|.{2,3}県)/u,
      "",
    );
    const municipalityMatch =
      withoutPrefecture.match(
        /^(?:[^\d０-９]{1,12}郡)?([^\d０-９]{1,16}?市)/u,
      ) ??
      withoutPrefecture.match(
        /^(?:[^\d０-９]{1,12}郡)?([^市区町村\d０-９]{1,16}(?:区|町|村))/u,
      );
    if (!municipalityMatch?.[1]) continue;

    const city = municipalityMatch[1];
    let tail = withoutPrefecture.slice(municipalityMatch[0].length);
    const wardMatch = city.endsWith("市")
      ? tail.match(/^([^市区町村\d０-９]{1,12}区)/u)
      : null;
    if (wardMatch?.[1]) return makeGeography("JP", city, wardMatch[1], region);

    tail = tail.replace(/^[^\p{L}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]+/u, "");
    const locality = localityFrom(tail);
    return makeGeography("JP", city, locality ?? city, region);
  }

  return makeGeography("JP", "その他", restaurant.area || "その他", region);
}

function koreaGeography(restaurant: Restaurant): RestaurantGeography {
  const text = compact(`${restaurant.area}${restaurant.address}${restaurant.name}`);
  if (/ソウル|江南区|龍山区/u.test(text)) {
    const district = text.match(/(江南区|龍山区)/u)?.[1] ?? "ソウル特別市";
    return makeGeography("KR", "ソウル", district);
  }
  if (/チョンジュ|全州/u.test(text)) {
    const district = text.match(/(完山区)/u)?.[1] ?? "完山区";
    return makeGeography("KR", "全州", district);
  }
  return makeGeography("KR", "釜山", "釜山市");
}

function taiwanGeography(restaurant: Restaurant): RestaurantGeography {
  const text = compact(`${restaurant.area}${restaurant.address}${restaurant.name}`);
  if (/宜蘭|三星鄉|五結鄉|羅東鎮|三星郷/u.test(text)) {
    const district =
      text.match(/(三星(?:鄉|郷)|五結鄉|羅東鎮)/u)?.[1] ?? "宜蘭縣";
    return makeGeography("TW", "宜蘭縣", district.replace("郷", "鄉"));
  }
  const district = text.match(/(大同區|松山區)/u)?.[1] ?? "台北市";
  return makeGeography("TW", "台北市", district);
}

function geographyFor(restaurant: Restaurant): RestaurantGeography {
  const country = countryFor(restaurant);
  if (country === "KR") return koreaGeography(restaurant);
  if (country === "TW") return taiwanGeography(restaurant);
  if (country === "FR") return makeGeography("FR", "Paris", "Paris");
  return japanGeography(restaurant);
}

export const GEOGRAPHY_BY_ID = new Map<string, RestaurantGeography>(
  RESTAURANTS.map((restaurant) => [restaurant.id, geographyFor(restaurant)]),
);

const countryCounts = new Map<CountryCode, number>();
const regionCounts = new Map<string, RegionOption>();
const cityCounts = new Map<string, CityOption>();
const districtCounts = new Map<string, DistrictOption>();

for (const geography of GEOGRAPHY_BY_ID.values()) {
  countryCounts.set(
    geography.country,
    (countryCounts.get(geography.country) ?? 0) + 1,
  );

  if (geography.country === "JP" && geography.region) {
    const region = regionCounts.get(geography.regionId);
    regionCounts.set(geography.regionId, {
      id: geography.regionId,
      country: "JP",
      code: geography.region,
      count: (region?.count ?? 0) + 1,
    });
  }

  const city = cityCounts.get(geography.cityId);
  cityCounts.set(geography.cityId, {
    id: geography.cityId,
    country: geography.country,
    regionId: geography.regionId,
    label: geography.city,
    count: (city?.count ?? 0) + 1,
  });

  const district = districtCounts.get(geography.districtId);
  districtCounts.set(geography.districtId, {
    id: geography.districtId,
    cityId: geography.cityId,
    label: geography.district,
    count: (district?.count ?? 0) + 1,
  });
}

export const COUNTRY_OPTIONS: CountryOption[] = COUNTRY_ORDER.flatMap((code) => {
  const count = countryCounts.get(code);
  return count ? [{ code, count }] : [];
});

export const REGION_OPTIONS: RegionOption[] = JAPAN_REGION_ORDER.flatMap(
  (code) => {
    const region = regionCounts.get(`JP:${code}`);
    return region ? [region] : [];
  },
);

export const CITY_OPTIONS: CityOption[] = [...cityCounts.values()].sort(
  (a, b) =>
    COUNTRY_ORDER.indexOf(a.country) - COUNTRY_ORDER.indexOf(b.country) ||
    collator.compare(a.label, b.label),
);

export const DISTRICT_OPTIONS: DistrictOption[] = [
  ...districtCounts.values(),
].sort((a, b) => collator.compare(a.label, b.label));
