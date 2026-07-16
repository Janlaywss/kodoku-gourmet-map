"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Sidebar, { type Filters } from "@/components/Sidebar";
import { RESTAURANTS, SEASONS, type Restaurant } from "@/data";
import { GEOGRAPHY_BY_ID } from "@/data/geography";
import { MESSAGES, type Locale } from "@/i18n/messages";
import {
  LOCALE_COOKIE_KEY,
  LOCALE_STORAGE_KEY,
  localePath,
} from "@/i18n/routing";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div className="map-loading">…</div>,
});

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";
const MAPBOX_STYLE_URL =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL ?? "mapbox://styles/mapbox/streets-v12";

function matchQuery(r: Restaurant, q: string): boolean {
  if (!q) return true;
  return `${r.name} ${r.nameZh} ${r.dish} ${r.area} ${r.address} ${r.category} ${r.sourceFolder} ${JSON.stringify(r.i18n ?? {})}`
    .toLowerCase()
    .includes(q);
}

function matchGeography(r: Restaurant, filters: Filters): boolean {
  const geography = GEOGRAPHY_BY_ID.get(r.id);
  if (!geography) return false;
  if (filters.country && geography.country !== filters.country) return false;
  if (filters.region && geography.regionId !== filters.region) return false;
  if (filters.city && geography.cityId !== filters.city) return false;
  if (filters.district && geography.districtId !== filters.district) return false;
  return true;
}

function saveLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Storage may be unavailable in private or restricted browser contexts.
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_COOKIE_KEY}=${locale}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
}

export default function HomePage({ initialLocale }: { initialLocale: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [filters, setFilters] = useState<Filters>({
    categories: new Set(),
    seasons: new Set(),
    query: "",
    openOnly: true,
    country: "",
    region: "",
    city: "",
    district: "",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sideOpen, setSideOpen] = useState(false);
  const messages = MESSAGES[locale];

  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const handleLocale = (nextLocale: Locale) => {
    saveLocale(nextLocale);
    setLocale(nextLocale);
    window.location.replace(localePath(nextLocale));
  };

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return RESTAURANTS.filter((r) => {
      if (!matchGeography(r, filters)) return false;
      if (filters.categories.size > 0 && !filters.categories.has(r.category))
        return false;
      if (filters.seasons.size > 0 && !filters.seasons.has(r.seasonKey))
        return false;
      if (filters.openOnly && r.status !== "营业中") return false;
      return matchQuery(r, q);
    });
  }, [filters]);

  // 分类计数不受分类勾选本身影响，勾选某类后其余分类的数字仍可见
  const categoryCounts = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const m = new Map<string, number>();
    for (const r of RESTAURANTS) {
      if (!matchGeography(r, filters)) continue;
      if (filters.seasons.size > 0 && !filters.seasons.has(r.seasonKey)) continue;
      if (filters.openOnly && r.status !== "营业中") continue;
      if (!matchQuery(r, q)) continue;
      m.set(r.category, (m.get(r.category) ?? 0) + 1);
    }
    return m;
  }, [filters]);

  const handleSelect = (id: string | null) => {
    setSelectedId(id);
    if (id) setSideOpen(false);
  };

  return (
    <div className="app" lang={locale}>
      <button
        className="side-toggle"
        onClick={() => setSideOpen((v) => !v)}
        aria-label={sideOpen ? messages.toggleClose : messages.toggleOpen}
      >
        {sideOpen ? messages.toggleClose : messages.toggleOpen}
      </button>
      <div className={`side-holder${sideOpen ? " side-open" : ""}`}>
        <Sidebar
          allSeasons={SEASONS}
          categoryCounts={categoryCounts}
          filtered={filtered}
          filters={filters}
          onFilters={setFilters}
          selectedId={selectedId}
          onSelect={handleSelect}
          total={RESTAURANTS.length}
          locale={locale}
          messages={messages}
          onLocale={handleLocale}
        />
      </div>
      <MapView
        restaurants={filtered}
        selectedId={selectedId}
        onSelect={handleSelect}
        locale={locale}
        messages={messages}
        accessToken={MAPBOX_ACCESS_TOKEN}
        styleUrl={MAPBOX_STYLE_URL}
      />
    </div>
  );
}
