import raw from "./restaurants.json";
import type { Locale } from "@/i18n/messages";

export type RestaurantStatus = "营业中" | "已闭店" | "不确定";

export type Restaurant = {
  id: string;
  seasonKey: string;
  seasonNum: number;
  seasonLabel: string;
  episode: number;
  name: string;
  nameZh: string;
  dish: string;
  category: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  status: RestaurantStatus;
  notes?: string;
  sourceIndex: number;
  sourceFolder: string;
  i18n?: Partial<
    Record<
      Locale,
      {
        name?: string;
        dish?: string;
        area?: string;
        address?: string;
        notes?: string;
      }
    >
  >;
};

export type SeasonMeta = { key: string; num: number; label: string; count: number };

export type DataSource = {
  title: string;
  url: string;
  kmlUrl: string;
  updated?: string;
  description: string;
};

type RawRestaurant = Omit<
  Restaurant,
  "id" | "seasonKey" | "seasonNum" | "seasonLabel"
>;
type RawSeason = {
  key: string;
  num: number;
  label: string;
  restaurants: RawRestaurant[];
};

const sourceData = raw as { source: DataSource; seasons: RawSeason[] };
const seasons = sourceData.seasons;

export const SOURCE = sourceData.source;

export const RESTAURANTS: Restaurant[] = seasons.flatMap((s) =>
  s.restaurants.map((r) => ({
    ...r,
    status: r.status as RestaurantStatus,
    id: `${s.key}-E${String(r.episode).padStart(2, "0")}-${String(
      r.sourceIndex,
    ).padStart(3, "0")}`,
    seasonKey: s.key,
    seasonNum: s.num,
    seasonLabel: s.label,
  }))
);

export const SEASONS: SeasonMeta[] = seasons.map((s) => ({
  key: s.key,
  num: s.num,
  label: s.label,
  count: s.restaurants.length,
}));

export function episodeBadge(r: Restaurant): string {
  return r.seasonKey === "SP" ? `SP·${r.episode}` : `${r.seasonKey} 第${r.episode}集`;
}
