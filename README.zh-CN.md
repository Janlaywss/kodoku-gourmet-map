# 孤独的美食家 · 圣地巡礼地图

[English](README.md) | **简体中文** | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

《孤独的美食家》（孤独のグルメ）漫画及电视剧地点的公开交互地图。项目将公开 Google My Maps 中的地点整理为可搜索、可筛选的数据，并使用全球矢量底图辅助规划圣地巡礼。

## 功能

- **全球矢量地图**：Mapbox GL JS 3 + Mapbox Streets 二维底图
- **274 个来源地点**：覆盖漫画、Season 1–10、特别篇、配信原创及《それぞれの孤独のグルメ》
- **地域联动筛选**：按国家或地区 → 日本地区（选择日本时）→ 城市 → 商圈筛选，也可按作品、季度、料理分类和营业状态筛选
- **搜索**：支持店名、菜品、地区及地址搜索
- **默认只看营业中**：初始勾选“只看标为营业中的地点”，可随时取消
- **地点详情**：展示剧集、料理、地址、来源备注以及 Google 地图和食べログ搜索入口
- **六语言界面**：日本語、English、繁體中文（台灣）、繁體中文（香港）、简体中文、한국어
- **底图语言联动**：网站切换语言时同步切换 Mapbox 地名标签
- **国际化 SEO**：预渲染语言网址、本地化元数据、hreflang、Canonical、结构化数据、站点地图、robots 规则及专用分享卡
- **响应式布局**：桌面端地图与侧栏并列，移动端使用可开合的筛选和地点列表
- **来源透明**：侧栏醒目展示来源地图、来源日期和营业信息提醒

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Mapbox GL JS 3
- 原生 CSS

## 本地运行

### 1. 准备环境

- Node.js `>= 20.9.0`
- npm
- 一个 Mapbox 账户及以 `pk.` 开头的 Public Token

Token 可在 [Mapbox Access Tokens](https://console.mapbox.com/account/access-tokens/) 创建。正式网站应创建独立 Public Token，并限制允许使用的本地域名和生产域名；不要把以 `sk.` 开头的 Secret Token 放入前端。

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

在项目根目录复制 `.env.example` 为 `.env.local`：

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_public_token
NEXT_PUBLIC_MAPBOX_STYLE_URL=mapbox://styles/mapbox/streets-v12
SITE_URL=https://example.com
```

| 变量 | 必需 | 说明 |
| --- | --- | --- |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | 是 | 浏览器地图使用的 Mapbox Public Token |
| `NEXT_PUBLIC_MAPBOX_STYLE_URL` | 否 | Mapbox Style URL；未设置时使用二维 `streets-v12` |
| `SITE_URL` | 生产环境 | 用于 Canonical、hreflang、站点地图及社交分享元数据的公开网站域名 |

环境变量会在构建时写入客户端包。修改后需要重新启动开发服务器，并在部署平台重新构建。

### 4. 启动开发环境

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

### 5. 生产构建

```bash
npm run build
npm start
```

## 地图与国际化

默认样式为：

```text
mapbox://styles/mapbox/streets-v12
```

网站语言与 Mapbox 标签语言的对应关系：

| 网站语言 | Locale | Mapbox 标签 |
| --- | --- | --- |
| 日本語 | `ja` | `ja` |
| English | `en` | `en` |
| 繁體中文（台灣） | `zh-TW` | `zh-Hant` |
| 繁體中文（香港） | `zh-HK` | `zh-Hant` |
| 简体中文 | `zh-CN` | `zh-Hans` |
| 한국어 | `ko` | `ko` |

界面文案集中在 `src/i18n/messages.ts`，搜索元数据位于 `src/i18n/seo.ts`。新增或修改用户可见文本及搜索文案时，需要同步维护全部六种语言。每种语言都有独立可索引网址（`/en`、`/ja`、`/zh-CN`、`/zh-TW`、`/zh-HK`、`/ko`），并通过 hreflang 相互关联。用户未主动选择语言时，根网址会跟随浏览器语言；用户主动选择的语言会保存到 LocalStorage 和 Cookie，并在之后访问时自动恢复。Mapbox 在指定语言缺少译名时会回退到地点的当地名称。

Mapbox 按地图加载量计费，额度和价格可能调整。公开上线前请查看 [Mapbox 官方价格](https://www.mapbox.com/pricing)并在控制台监控用量。地图右下角的 Mapbox/OpenStreetMap 署名不得移除或遮挡。

## 数据来源

唯一地点数据来源：

[Google My Maps「『孤独のグルメ』ＭＡＰ！（漫画＆ドラマSeason１～１０）」](https://www.google.com/maps/d/u/0/viewer?mid=1dH-zOGzRwCZ8cgFKaOlFBn8JDM8)

- 生成数据：`src/data/restaurants.json`
- 数据类型与运行时导出：`src/data/index.ts`
- 国家、日本地区、城市和商圈层级：`src/data/geography.ts`
- 同步脚本：`scripts/import-google-mymaps.mjs`
- 来源地图标注更新月份：2026 年 4 月

营业状态和料理分类由同步脚本根据来源文本推断。国家、日本地区、城市与商圈层级在运行时根据来源地址和地区字段生成，不依赖额外地点数据源；“商圈”在日本主要对应都道府县以下的区、町或地址町名。

原作与剧集年代跨度较大，地点可能闭店、休业或搬迁，访问前务必向店铺确认最新信息。

### 重新同步数据

```bash
npm run data:sync
npm run build
```

同步命令会联网下载 KML，并完整重写 `src/data/restaurants.json`。提交结果前应检查地点总数、来源更新时间、分类、营业状态和生成差异。

## 项目结构

```text
src/
├── app/
│   ├── globals.css          # 全局、响应式及 Mapbox 样式
│   ├── [locale]/page.tsx    # 本地化 HTML、元数据与结构化数据
│   ├── layout.tsx           # 根布局、元数据基址和 Mapbox CSS
│   ├── page.tsx             # 浏览器/偏好语言跳转
│   ├── robots.ts            # 搜索爬虫规则
│   └── sitemap.ts           # 多语言站点地图与 hreflang
├── components/
│   ├── HomePage.tsx         # 交互状态、筛选与语言路由
│   ├── MapView.tsx          # Mapbox 地图、标记、弹窗和语言联动
│   └── Sidebar.tsx          # 搜索、筛选、地点列表及来源署名
├── data/
│   ├── categories.ts        # 分类、配色与图标
│   ├── geography.ts         # 国家、日本地区、城市与商圈层级
│   ├── index.ts             # 数据类型和导出
│   └── restaurants.json     # 由 KML 生成的地点数据
└── i18n/
    ├── messages.ts          # 六语言界面文案
    ├── routing.ts           # 语言检测与网址工具
    └── seo.ts               # 本地化搜索与分享元数据

scripts/
└── import-google-mymaps.mjs # Google My Maps KML 导入器
```

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | TypeScript 检查并生成生产构建 |
| `npm start` | 启动已完成的生产构建 |
| `npm run data:sync` | 从指定 Google My Maps 重新生成地点数据 |
