# Kodoku no Gourmet Pilgrimage Map

**English** | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

A public interactive map of locations featured in the *Kodoku no Gourmet* (`孤独のグルメ`) manga and television series. The project converts places from a public Google My Maps collection into searchable and filterable data, presented on a global vector basemap for planning location visits.

## Features

- **Global vector map:** Mapbox GL JS 3 with the two-dimensional Mapbox Streets basemap
- **274 source locations:** Covers the manga, Seasons 1–10, specials, streaming originals, and *それぞれの孤独のグルメ*
- **Linked location filters:** Filter by country or region → Japan region (when Japan is selected) → city → district, as well as series, season, cuisine category, and operating status
- **Search:** Find places by restaurant name, dish, area, or address
- **Open locations by default:** The “marked as open only” filter is enabled initially and can be turned off at any time
- **Place details:** View the episode, dish, address, source notes, Google Maps search, and Tabelog search
- **Six-language interface:** 日本語, English, 繁體中文（台灣）, 繁體中文（香港）, 简体中文, and 한국어
- **Localized basemap labels:** Mapbox place labels follow the selected site language
- **International SEO:** Prerendered locale URLs, localized metadata, hreflang, canonical URLs, structured data, sitemap, robots rules, and a dedicated social card
- **Responsive layout:** Side-by-side map and sidebar on desktop, with a collapsible filter and place list on mobile
- **Visible attribution:** The source map, source date, and opening-hours warning are shown prominently in the sidebar

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Mapbox GL JS 3
- Plain CSS

## Local Development

### 1. Requirements

- Node.js `>= 20.9.0`
- npm
- A Mapbox account and a Public Token beginning with `pk.`

Create a token from [Mapbox Access Tokens](https://console.mapbox.com/account/access-tokens/). For production, create a dedicated Public Token and restrict it to the local and production domains. Never expose a Secret Token beginning with `sk.` in frontend code.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` in the project root:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_public_token
NEXT_PUBLIC_MAPBOX_STYLE_URL=mapbox://styles/mapbox/streets-v12
SITE_URL=https://example.com
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Yes | Mapbox Public Token used by the browser map |
| `NEXT_PUBLIC_MAPBOX_STYLE_URL` | No | Mapbox Style URL; defaults to the two-dimensional `streets-v12` style |
| `SITE_URL` | In production | Public site origin used for canonical, hreflang, sitemap, and social metadata URLs |

These variables are included in the client bundle at build time. Restart the development server after changing them, and rebuild the site on the deployment platform.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Create a production build

```bash
npm run build
npm start
```

## Map and Internationalization

The default map style is:

```text
mapbox://styles/mapbox/streets-v12
```

Site languages map to Mapbox label languages as follows:

| Site language | Locale | Mapbox labels |
| --- | --- | --- |
| 日本語 | `ja` | `ja` |
| English | `en` | `en` |
| 繁體中文（台灣） | `zh-TW` | `zh-Hant` |
| 繁體中文（香港） | `zh-HK` | `zh-Hant` |
| 简体中文 | `zh-CN` | `zh-Hans` |
| 한국어 | `ko` | `ko` |

Interface copy is centralized in `src/i18n/messages.ts`, with search metadata in `src/i18n/seo.ts`. Update all six locales whenever user-visible or search-facing text changes. Each locale has its own indexable URL (`/en`, `/ja`, `/zh-CN`, `/zh-TW`, `/zh-HK`, `/ko`) with reciprocal hreflang links. The root URL follows the browser language; a language selected manually is stored in LocalStorage and a cookie, then restored on later visits. Mapbox falls back to local place names when a requested translation is unavailable.

Mapbox charges by map usage, and pricing or allowances may change. Review the [official Mapbox pricing page](https://www.mapbox.com/pricing) and monitor usage before a public launch. Do not remove or cover the Mapbox/OpenStreetMap attribution in the lower-right corner.

## Data Source

The only location dataset is:

[Google My Maps: 「『孤独のグルメ』ＭＡＰ！（漫画＆ドラマSeason１～１０）」](https://www.google.com/maps/d/u/0/viewer?mid=1dH-zOGzRwCZ8cgFKaOlFBn8JDM8)

- Generated data: `src/data/restaurants.json`
- Runtime types and exports: `src/data/index.ts`
- Country, Japan region, city, and district hierarchy: `src/data/geography.ts`
- Import script: `scripts/import-google-mymaps.mjs`
- Source map update shown by the project: April 2026

Operating status and cuisine categories are inferred by the import script from source text. The country, Japan region, city, and district hierarchy is derived at runtime from source addresses and area fields without using another location dataset. In Japan, “district” generally corresponds to a ward, town, or address locality below the prefecture level.

Because the manga and television series span many years, a place may have closed, paused operations, or moved. Confirm current details directly with the venue before visiting.

### Refresh the source data

```bash
npm run data:sync
npm run build
```

The sync command downloads the KML over the network and fully rewrites `src/data/restaurants.json`. Before committing the result, inspect the place count, source update date, cuisine classifications, operating statuses, and the generated diff.

## Project Structure

```text
src/
├── app/
│   ├── globals.css          # Global, responsive, and Mapbox styles
│   ├── [locale]/page.tsx    # Localized HTML, metadata, and structured data
│   ├── layout.tsx           # Root layout, metadata base, and Mapbox CSS
│   ├── page.tsx             # Browser/preference locale redirect
│   ├── robots.ts            # Search crawler rules
│   └── sitemap.ts           # Localized sitemap and hreflang entries
├── components/
│   ├── HomePage.tsx         # Interactive page state, filters, and locale routing
│   ├── MapView.tsx          # Mapbox map, markers, popups, and label language
│   └── Sidebar.tsx          # Search, filters, place list, and attribution
├── data/
│   ├── categories.ts        # Cuisine categories, colors, and icons
│   ├── geography.ts         # Country, Japan region, city, and district hierarchy
│   ├── index.ts             # Data types and exports
│   └── restaurants.json     # Location data generated from KML
└── i18n/
    ├── messages.ts          # Six-language interface copy
    ├── routing.ts           # Locale detection and URL helpers
    └── seo.ts               # Localized search and social metadata

scripts/
└── import-google-mymaps.mjs # Google My Maps KML importer
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Run TypeScript checks and create a production build |
| `npm start` | Start the completed production build |
| `npm run data:sync` | Regenerate place data from the configured Google My Maps source |
