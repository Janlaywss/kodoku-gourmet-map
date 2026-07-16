# 고독한 미식가 성지순례 지도

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | **한국어**

《고독한 미식가》(孤独のグルメ) 만화와 TV 드라마에 등장한 장소를 모은 공개 인터랙티브 지도입니다. 공개 Google My Maps의 장소를 검색하고 필터링할 수 있는 데이터로 정리하고, 전 세계 벡터 베이스맵 위에서 성지순례 계획에 활용할 수 있도록 제공합니다.

## 기능

- **전 세계 벡터 지도:** Mapbox GL JS 3와 2D Mapbox Streets 베이스맵 사용
- **출처 기반 274개 장소:** 만화, Season 1–10, 스페셜, 스트리밍 오리지널, 《それぞれの孤独のグルメ》 수록
- **연동 지역 필터:** 국가 또는 지역 → 일본 권역(일본 선택 시) → 도시 → 상권 순서로 필터링하며 작품, 시즌, 요리 분류, 영업 상태 필터도 지원
- **검색:** 가게 이름, 메뉴, 지역, 주소로 장소 검색
- **영업 중 장소 기본 표시:** ‘영업 중으로 표시된 장소만’ 옵션이 기본으로 선택되며 언제든 해제 가능
- **장소 상세 정보:** 에피소드, 요리, 주소, 출처 메모, Google 지도 검색, 타베로그 검색 제공
- **6개 언어 UI:** 日本語, English, 繁體中文（台灣）, 繁體中文（香港）, 简体中文, 한국어
- **베이스맵 언어 연동:** 사이트에서 선택한 언어에 맞춰 Mapbox 지명 라벨 변경
- **국제 SEO:** 언어별 URL 사전 렌더링, 현지화 메타데이터, hreflang, Canonical, 구조화 데이터, 사이트맵, robots 규칙, 전용 공유 카드
- **반응형 레이아웃:** 데스크톱에서는 지도와 사이드바를 나란히 표시하고, 모바일에서는 필터와 장소 목록을 접고 펼칠 수 있음
- **명확한 출처 표시:** 사이드바 상단에 원본 지도, 출처 업데이트 시점, 영업 정보 주의사항을 표시

## 기술 스택

- Next.js 16 App Router
- React 19
- TypeScript
- Mapbox GL JS 3
- CSS

## 로컬 실행

### 1. 필요 환경

- Node.js `>= 20.9.0`
- npm
- Mapbox 계정 및 `pk.`로 시작하는 Public Token

[Mapbox Access Tokens](https://console.mapbox.com/account/access-tokens/)에서 토큰을 만들 수 있습니다. 운영 환경에서는 전용 Public Token을 만들고 로컬 및 운영 도메인만 허용하도록 제한하세요. `sk.`로 시작하는 Secret Token을 프런트엔드에 노출하지 마세요.

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트에서 `.env.example`을 `.env.local`로 복사합니다.

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_public_token
NEXT_PUBLIC_MAPBOX_STYLE_URL=mapbox://styles/mapbox/streets-v12
SITE_URL=https://example.com
```

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | 예 | 브라우저 지도에서 사용하는 Mapbox Public Token |
| `NEXT_PUBLIC_MAPBOX_STYLE_URL` | 아니요 | Mapbox Style URL. 설정하지 않으면 2D `streets-v12` 사용 |
| `SITE_URL` | 운영 환경 | Canonical, hreflang, 사이트맵, 소셜 메타데이터에 사용하는 공개 사이트 주소 |

환경 변수는 빌드할 때 클라이언트 번들에 포함됩니다. 변경한 뒤에는 개발 서버를 다시 시작하고 배포 플랫폼에서도 다시 빌드해야 합니다.

### 4. 개발 서버 시작

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)을 엽니다.

### 5. 프로덕션 빌드

```bash
npm run build
npm start
```

## 지도와 다국어 지원

기본 지도 스타일:

```text
mapbox://styles/mapbox/streets-v12
```

사이트 언어와 Mapbox 라벨 언어의 대응 관계:

| 사이트 언어 | Locale | Mapbox 라벨 |
| --- | --- | --- |
| 日本語 | `ja` | `ja` |
| English | `en` | `en` |
| 繁體中文（台灣） | `zh-TW` | `zh-Hant` |
| 繁體中文（香港） | `zh-HK` | `zh-Hant` |
| 简体中文 | `zh-CN` | `zh-Hans` |
| 한국어 | `ko` | `ko` |

UI 문구는 `src/i18n/messages.ts`, 검색 메타데이터는 `src/i18n/seo.ts`에서 관리합니다. 사용자용 또는 검색용 문구를 추가하거나 변경할 때는 6개 언어를 모두 업데이트해야 합니다. 각 언어는 별도의 색인 가능 URL(`/en`, `/ja`, `/zh-CN`, `/zh-TW`, `/zh-HK`, `/ko`)을 사용하며 hreflang으로 서로 연결됩니다. 사용자가 언어를 직접 선택하지 않은 경우 루트 URL은 브라우저 언어를 따릅니다. 직접 선택한 언어는 LocalStorage와 쿠키에 저장되어 다음 방문 때 복원됩니다. Mapbox에 지정 언어의 번역이 없으면 현지 지명으로 대체됩니다.

Mapbox는 지도 사용량에 따라 과금하며 가격과 무료 한도는 변경될 수 있습니다. 공개 전에 [Mapbox 공식 요금 페이지](https://www.mapbox.com/pricing)를 확인하고 콘솔에서 사용량을 모니터링하세요. 지도 오른쪽 아래의 Mapbox/OpenStreetMap 저작자 표시는 제거하거나 가리지 마세요.

## 데이터 출처

장소 데이터의 유일한 출처:

[Google My Maps 「『孤独のグルメ』ＭＡＰ！（漫画＆ドラマSeason１～１０）」](https://www.google.com/maps/d/u/0/viewer?mid=1dH-zOGzRwCZ8cgFKaOlFBn8JDM8)

- 생성 데이터: `src/data/restaurants.json`
- 데이터 타입과 런타임 내보내기: `src/data/index.ts`
- 국가, 일본 권역, 도시, 상권 계층: `src/data/geography.ts`
- 동기화 스크립트: `scripts/import-google-mymaps.mjs`
- 프로젝트에 표시하는 출처 지도 업데이트 시점: 2026년 4월

영업 상태와 요리 분류는 동기화 스크립트가 출처 텍스트를 바탕으로 추정합니다. 국가, 일본 권역, 도시, 상권 계층은 별도의 장소 데이터 없이 출처 주소와 지역 필드에서 런타임에 생성합니다. 일본의 ‘상권’은 주로 도도부현 아래의 구, 정 또는 주소의 동네 이름에 해당합니다.

원작과 드라마는 오랜 기간에 걸쳐 제작되었으므로 장소가 폐업, 휴업 또는 이전했을 수 있습니다. 방문 전에 반드시 가게에 최신 정보를 확인하세요.

### 데이터 다시 동기화

```bash
npm run data:sync
npm run build
```

동기화 명령은 네트워크를 통해 KML을 다운로드하고 `src/data/restaurants.json` 전체를 다시 작성합니다. 결과를 커밋하기 전에 장소 수, 출처 업데이트 날짜, 분류, 영업 상태, 생성된 차이를 확인하세요.

## 프로젝트 구조

```text
src/
├── app/
│   ├── globals.css          # 전역, 반응형, Mapbox 스타일
│   ├── [locale]/page.tsx    # 현지화 HTML, 메타데이터, 구조화 데이터
│   ├── layout.tsx           # 루트 레이아웃, 메타데이터 기준, Mapbox CSS
│   ├── page.tsx             # 브라우저/저장 언어 리디렉션
│   ├── robots.ts            # 검색 크롤러 규칙
│   └── sitemap.ts           # 다국어 사이트맵과 hreflang
├── components/
│   ├── HomePage.tsx         # 인터랙티브 상태, 필터, 언어 라우팅
│   ├── MapView.tsx          # Mapbox 지도, 마커, 팝업, 언어 연동
│   └── Sidebar.tsx          # 검색, 필터, 장소 목록, 출처 표시
├── data/
│   ├── categories.ts        # 분류, 색상, 아이콘
│   ├── geography.ts         # 국가, 일본 권역, 도시, 상권 계층
│   ├── index.ts             # 데이터 타입과 내보내기
│   └── restaurants.json     # KML에서 생성된 장소 데이터
└── i18n/
    ├── messages.ts          # 6개 언어 UI 문구
    ├── routing.ts           # 언어 감지와 URL 도구
    └── seo.ts               # 현지화 검색 및 공유 메타데이터

scripts/
└── import-google-mymaps.mjs # Google My Maps KML 가져오기 도구
```

## 명령어

| 명령어 | 용도 |
| --- | --- |
| `npm run dev` | 로컬 개발 서버 시작 |
| `npm run build` | TypeScript 검사 및 프로덕션 빌드 생성 |
| `npm start` | 완료된 프로덕션 빌드 시작 |
| `npm run data:sync` | 지정한 Google My Maps에서 장소 데이터 다시 생성 |
