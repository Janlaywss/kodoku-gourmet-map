<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project instructions

## Product scope

This repository builds a public, internationalized pilgrimage map for locations from *Kodoku no Gourmet* (`孤独のグルメ`). Preserve the product as a map-first experience with a filterable location list and visible source attribution.

Supported locales are exactly:

- `ja` — 日本語
- `en` — English
- `zh-TW` — 繁體中文（台灣）
- `zh-HK` — 繁體中文（香港）
- `zh-CN` — 简体中文
- `ko` — 한국어

All new user-facing text must be added to `src/i18n/messages.ts` for every locale, and localized search metadata belongs in `src/i18n/seo.ts`. Do not merge `zh-TW` and `zh-HK`; their copy may differ even though both use Mapbox's `zh-Hant` labels.

## Current architecture

- Next.js 16 App Router, React 19 and TypeScript with strict checking.
- `src/app/page.tsx` redirects the root URL to a browser- or preference-matched locale route.
- `src/app/[locale]/page.tsx` prerenders localized HTML, metadata and structured data for all six indexable locale URLs.
- `src/components/HomePage.tsx` owns filters, selected location and locale state.
- `src/components/MapView.tsx` is client-only and is loaded with `next/dynamic` using `ssr: false`.
- Map rendering uses Mapbox GL JS 3 and the two-dimensional `mapbox://styles/mapbox/streets-v12` style by default.
- `src/components/Sidebar.tsx` renders search, filters, locale selection, the location list and data attribution.
- `src/app/globals.css` contains the responsive layout and Mapbox overrides.
- `src/data/index.ts` converts the generated JSON into application types and exports the source metadata.
- `src/data/geography.ts` derives the country/region, Japan region, city and district hierarchy from source address fields for linked filters.

Keep browser-only map and storage APIs inside Client Components. Do not import Mapbox GL JS into a Server Component.

## Map rules

- The approved production path is Mapbox GL JS with the project's own public token. Do not reuse tokens, tile proxies or private styles from another website.
- Read `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` from the environment. Never commit `.env.local` or an `sk.` secret token.
- `NEXT_PUBLIC_MAPBOX_STYLE_URL` may override the style; retain `streets-v12` as the fallback unless the user requests another provider or style.
- Preserve Mapbox/OpenStreetMap attribution rendered by the SDK. Do not cover or remove it.
- Locale changes must also update map labels. The mapping is `zh-CN` → `zh-Hans`, `zh-TW`/`zh-HK` → `zh-Hant`, and `ja`/`en`/`ko` unchanged.
- Do not add Cloudflare tile caching, proxy Mapbox requests, or switch to Google Maps, Leaflet, OpenFreeMap or self-hosted tiles unless explicitly requested.

## Data and attribution

The sole location dataset is the public Google My Maps map recorded in `src/data/restaurants.json` and `src/data/index.ts`. Its source link must remain visible in the sidebar, location popup and README.

`npm run data:sync` downloads the source KML and rewrites `src/data/restaurants.json`. Run it only when a source refresh is explicitly required. After syncing:

1. Inspect the source title, update date, location count and git diff.
2. Check importer classification/status changes for obvious regressions.
3. Run `npm run build`.

Prefer fixing parsing or classification in `scripts/import-google-mymaps.mjs` over hand-editing generated records. Status values are inferred from source text and are not a real-time statement that a restaurant is open.

## Development workflow

1. Inspect the existing worktree and preserve unrelated or user-authored changes.
2. Before changing Next.js behavior, read the relevant local guide under `node_modules/next/dist/docs/` as required above.
3. Keep the existing npm lockfile and avoid replacing the project structure.
4. Make the smallest scoped change that satisfies the request.
5. Run `npm run build` after code, dependency, configuration or generated-data changes. There is currently no separate lint script.
6. Update `.env.example` and README whenever environment variables, setup steps, providers or data workflows change.

Do not commit, push, deploy, refresh remote data or modify third-party resources unless the user explicitly requests that action.
