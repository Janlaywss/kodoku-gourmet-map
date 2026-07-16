"use client";

import { CATEGORIES } from "@/data/categories";
import { SOURCE, type Restaurant, type SeasonMeta } from "@/data";
import {
  CITY_OPTIONS,
  COUNTRY_OPTIONS,
  DISTRICT_OPTIONS,
  REGION_OPTIONS,
} from "@/data/geography";
import { LOCALES, MESSAGES, type Locale, type Messages } from "@/i18n/messages";

export type Filters = {
  categories: Set<string>;
  seasons: Set<string>;
  query: string;
  openOnly: boolean;
  country: string;
  region: string;
  city: string;
  district: string;
};

export default function Sidebar({
  allSeasons,
  categoryCounts,
  filtered,
  filters,
  onFilters,
  selectedId,
  onSelect,
  total,
  locale,
  messages,
  onLocale,
}: {
  allSeasons: SeasonMeta[];
  categoryCounts: Map<string, number>;
  filtered: Restaurant[];
  filters: Filters;
  onFilters: (f: Filters) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  total: number;
  locale: Locale;
  messages: Messages;
  onLocale: (locale: Locale) => void;
}) {
  const toggle = (set: Set<string>, v: string): Set<string> => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    return next;
  };
  const countryNames = new Intl.DisplayNames([locale], { type: "region" });
  const regionOptions = filters.country === "JP" ? REGION_OPTIONS : [];
  const cityOptions = filters.country
    ? CITY_OPTIONS.filter(
        (city) =>
          city.country === filters.country &&
          (!filters.region || city.regionId === filters.region),
      )
    : [];
  const districtOptions = filters.city
    ? DISTRICT_OPTIONS.filter((district) => district.cityId === filters.city)
    : [];
  const hasLocationFilter = Boolean(
    filters.country || filters.region || filters.city || filters.district,
  );

  return (
    <aside className="sidebar">
      <header className="side-head">
        <div className="side-head-top">
          <div className="title-jp">孤独のグルメ</div>
          <label className="language-picker">
            <span className="sr-only">{messages.languageLabel}</span>
            <select
              value={locale}
              onChange={(event) => onLocale(event.target.value as Locale)}
              aria-label={messages.languageLabel}
            >
              {LOCALES.map((value) => (
                <option key={value} value={value} lang={value}>
                  {MESSAGES[value].localeName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <h1>{messages.title}</h1>
        <p className="subtitle">{messages.subtitle(total, filtered.length)}</p>
        <div className="source-summary">
          <div className="source-summary-title">
            <span>{messages.sourceLabel}：</span>
            <a href={SOURCE.url} target="_blank" rel="noreferrer">
              {SOURCE.title}
            </a>
          </div>
          <div className="source-summary-meta">
            {SOURCE.updated && `${messages.sourceUpdated(SOURCE.updated)} · `}
            {messages.footer}
          </div>
        </div>
      </header>

      <div className="side-section">
        <input
          className="search"
          type="search"
          placeholder={messages.searchPlaceholder}
          aria-label={messages.searchPlaceholder}
          value={filters.query}
          onChange={(e) => onFilters({ ...filters, query: e.target.value })}
        />
      </div>

      <div className="side-section">
        <div className="section-head">
          <span>{messages.sectionLocation}</span>
          {hasLocationFilter && (
            <button
              className="clear-btn"
              onClick={() =>
                onFilters({
                  ...filters,
                  country: "",
                  region: "",
                  city: "",
                  district: "",
                })
              }
            >
              {messages.clear}
            </button>
          )}
        </div>
        <div className="geo-filters">
          <label className="geo-field geo-country">
            <span>{messages.countryLabel}</span>
            <select
              value={filters.country}
              onChange={(event) =>
                onFilters({
                  ...filters,
                  country: event.target.value,
                  region: "",
                  city: "",
                  district: "",
                })
              }
            >
              <option value="">{messages.allCountries}</option>
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country.code} value={country.code}>
                  {countryNames.of(country.code) ?? country.code} ({country.count})
                </option>
              ))}
            </select>
          </label>
          {filters.country === "JP" && (
            <label className="geo-field geo-region">
              <span>{messages.regionLabel}</span>
              <select
                value={filters.region}
                onChange={(event) =>
                  onFilters({
                    ...filters,
                    region: event.target.value,
                    city: "",
                    district: "",
                  })
                }
              >
                <option value="">{messages.allRegions}</option>
                {regionOptions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {messages.japanRegions[region.code]} ({region.count})
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="geo-field">
            <span>{messages.cityLabel}</span>
            <select
              value={filters.city}
              disabled={!filters.country}
              onChange={(event) =>
                onFilters({
                  ...filters,
                  city: event.target.value,
                  district: "",
                })
              }
            >
              <option value="">{messages.allCities}</option>
              {cityOptions.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.label} ({city.count})
                </option>
              ))}
            </select>
          </label>
          <label className="geo-field">
            <span>{messages.districtLabel}</span>
            <select
              value={filters.district}
              disabled={!filters.city}
              onChange={(event) =>
                onFilters({ ...filters, district: event.target.value })
              }
            >
              <option value="">{messages.allDistricts}</option>
              {districtOptions.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.label} ({district.count})
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="side-section">
        <div className="section-head">
          <span>{messages.sectionCategory}</span>
          {filters.categories.size > 0 && (
            <button
              className="clear-btn"
              onClick={() => onFilters({ ...filters, categories: new Set() })}
            >
              {messages.clear}
            </button>
          )}
        </div>
        <div className="chips">
          {CATEGORIES.map((c) => {
            const count = categoryCounts.get(c.name) ?? 0;
            if (count === 0) return null;
            const active =
              filters.categories.size === 0 || filters.categories.has(c.name);
            return (
              <button
                key={c.name}
                className={`chip${active ? "" : " chip-off"}${
                  filters.categories.has(c.name) ? " chip-on" : ""
                }`}
                style={{ "--c": c.color } as React.CSSProperties}
                onClick={() =>
                  onFilters({
                    ...filters,
                    categories: toggle(filters.categories, c.name),
                  })
                }
              >
                <i className="dot" />
                {c.emoji} {messages.categories[c.name] ?? c.name}
                <em>{count}</em>
              </button>
            );
          })}
        </div>
      </div>

      <div className="side-section">
        <div className="section-head">
          <span>{messages.sectionSeason}</span>
          {filters.seasons.size > 0 && (
            <button
              className="clear-btn"
              onClick={() => onFilters({ ...filters, seasons: new Set() })}
            >
              {messages.clear}
            </button>
          )}
        </div>
        <div className="chips chips-season">
          {allSeasons.map((s) => (
            <button
              key={s.key}
              className={`chip chip-plain${
                filters.seasons.has(s.key) ? " chip-on" : ""
              }`}
              onClick={() =>
                onFilters({ ...filters, seasons: toggle(filters.seasons, s.key) })
              }
            >
              {messages.series[s.key as keyof typeof messages.series] ?? s.num}
            </button>
          ))}
        </div>
        <label className="open-only">
          <input
            type="checkbox"
            checked={filters.openOnly}
            onChange={(e) => onFilters({ ...filters, openOnly: e.target.checked })}
          />
          {messages.openOnly}
        </label>
      </div>

      <div className="side-section list-section">
        <div className="section-head">
          <span>{messages.sectionList}</span>
        </div>
        <ul className="rlist">
          {filtered.map((r) => {
            const text = r.i18n?.[locale];
            return (
              <li key={r.id}>
                <button
                  className={`ritem${r.id === selectedId ? " ritem-on" : ""}${
                    r.status === "已闭店" ? " ritem-closed" : ""
                  }`}
                  onClick={() => onSelect(r.id)}
                >
                  <i
                    className="dot"
                    style={
                      {
                        "--c": CATEGORIES.find((c) => c.name === r.category)
                          ?.color,
                      } as React.CSSProperties
                    }
                  />
                  <span className="ritem-main">
                    <span className="ritem-name">{r.name}</span>
                    <span className="ritem-sub">
                      {text?.area ?? r.area} · {text?.dish ?? r.dish}
                    </span>
                  </span>
                  <span className="ritem-right">
                    <span className="ritem-ep">
                      {messages.episodeBadge(r.seasonKey, r.episode)}
                    </span>
                    {r.status === "已闭店" && (
                      <span className="ritem-st">
                        {messages.status[r.status]}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="empty">{messages.empty}</li>
          )}
        </ul>
      </div>
    </aside>
  );
}
