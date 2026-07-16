import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MAP_ID = "1dH-zOGzRwCZ8cgFKaOlFBn8JDM8";
const SOURCE_URL = `https://www.google.com/maps/d/u/0/viewer?mid=${MAP_ID}`;
const KML_URL = `https://www.google.com/maps/d/kml?mid=${MAP_ID}&forcekml=1`;
const OUTPUT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/data/restaurants.json",
);

const decodeXml = (value) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");

function tag(block, name) {
  const value =
    block.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`))?.[1] ?? "";
  return decodeXml(value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim());
}

function cleanHtml(value) {
  return decodeXml(
    value
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<img\b[^>]*>/gi, "")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function number(value) {
  const normalized = value.replace(/[０-９]/g, (digit) =>
    String(digit.charCodeAt(0) - 0xff10),
  );
  return Number.parseInt(normalized, 10);
}

function seriesFor(folder, description) {
  if (folder.startsWith("漫画版")) {
    return {
      key: "MANGA",
      num: 0,
      label: "漫画版 1・2巻",
      episode: number(description.match(/第\s*([\d０-９]+)\s*話/)?.[1] ?? "1"),
    };
  }

  if (folder.includes("それぞれの孤独のグルメ")) {
    return {
      key: "EACH",
      num: 12,
      label: "それぞれの孤独のグルメ",
      episode: number(description.match(/第\s*([\d０-９]+)\s*話/)?.[1] ?? "1"),
    };
  }

  if (description.includes("配信オリジナル")) {
    return {
      key: "ORIGINAL",
      num: 11,
      label: "配信オリジナル",
      episode: 1,
    };
  }

  const season = description.match(/Season\s*([\d０-９]+)/i);
  if (season) {
    const seasonNumber = number(season[1]);
    return {
      key: `S${seasonNumber}`,
      num: seasonNumber,
      label: `Season ${seasonNumber}`,
      episode: number(description.match(/第\s*([\d０-９]+)\s*話/)?.[1] ?? "1"),
    };
  }

  const year = description.match(/(20\d{2})/i)?.[1];
  return {
    key: "SP",
    num: 99,
    label: "スペシャル",
    episode: year ? Number(year) : 1,
  };
}

function categoryFor(value) {
  const rules = [
    ["烧肉·烤肉", /焼き?肉|ホルモン|ジンギスカン|カルビ/],
    ["拉面", /ラーメン|中華麺|つけ麺/],
    ["中华料理", /中華|中国|餃子|チャーハン|担々?麺|麻婆/],
    ["御好烧·铁板烧", /お好み焼|たこ焼|鉄板焼|もんじゃ/],
    ["荞麦·乌冬", /そば|蕎麦|うどん/],
    ["寿司·海鲜", /寿司|鮨|海鮮|刺身|うなぎ|鰻|魚料理|かに|蟹/],
    ["串烧·烤鸡", /焼き鳥|やきとり|串焼|串揚/],
    ["咖喱", /カレー/],
    ["甜点·咖啡", /喫茶|カフェ|珈琲|甘味|菓子|ケーキ|饅頭|スイーツ|ジェラート/],
    ["亚洲·异国料理", /タイ|インド|韓国|ペルー|ブラジル|モロッコ|ベトナム|台湾|メキシコ|エスニック/],
    ["洋食·西餐", /洋食|ステーキ|ハンバーグ|ナポリタン|オムライス|ビーフ|パスタ|フレンチ|イタリア/],
    ["居酒屋·酒场", /居酒屋|酒場|飲み屋|おでん|バー|Bar\b/i],
    ["定食·食堂", /定食|食堂|食事処|ドライブイン|ランチ/],
  ];
  return rules.find(([, pattern]) => pattern.test(value))?.[0] ?? "其他";
}

function statusFor(name, description) {
  if (/要確認|休業|移転|閉店[？?]/.test(name)) return "不确定";
  if (/閉店|廃業|消滅|閉鎖/.test(name)) return "已闭店";
  const opening = description.slice(0, 240);
  if (/閉店しました|営業していない|営業終了/.test(opening)) return "已闭店";
  return "营业中";
}

function dishFor(name, description, seriesKey) {
  const quotes = [...description.matchAll(/「([^」]{2,160})」/g)].map(
    (match) => match[1],
  );
  const episodeTitle = quotes.find((value) => !value.includes("孤独のグルメ"));
  if (episodeTitle) return episodeTitle;

  if (seriesKey === "MANGA") {
    const line = description
      .split("\n")
      .find((value) => /漫画版.*第\s*[\d０-９]+\s*話/.test(value));
    if (line) {
      return line.replace(/^.*?第\s*[\d０-９]+\s*話\s*/, "").trim();
    }
  }

  return name.replace(/^[^／]+／/, "").replace(/（[^）]+）/g, "").trim();
}

function addressFor(description) {
  return (
    description.match(/(?:新住所|住所)[：:]\s*([^\n]+)/)?.[1]?.trim() ?? ""
  );
}

function areaFor(name, address) {
  const areas = [...name.matchAll(/（([^）]+)）/g)]
    .map((match) => match[1])
    .filter((value) => /[都道府県市区町]|台北|沖縄/.test(value));
  if (areas.length > 0) return areas.at(-1);
  return (
    address.match(
      /^(?:日本\s*)?((?:東京都|北海道|(?:京都|大阪)府|.{2,3}県|台北市)[^\d０-９ ]*)/,
    )?.[1]?.trim() ?? ""
  );
}

function noteFor(description, status) {
  if (status === "营业中") return undefined;
  const note = description
    .split("\n")
    .find((line) => /閉店|休業|移転|営業していない|営業終了|要確認/.test(line));
  return note ? note.slice(0, 180) : undefined;
}

async function main() {
  const response = await fetch(KML_URL, {
    headers: { "user-agent": "kodoku-gourmet-map data sync" },
  });
  if (!response.ok) throw new Error(`KML download failed: ${response.status}`);
  const xml = await response.text();

  const documentName = tag(xml, "name");
  const documentDescription = cleanHtml(tag(xml, "description"));
  const updatedMatch = documentDescription.match(
    /([\d０-９]{4})年([\d０-９]{1,2})月更新/,
  );
  const sourceUpdated = updatedMatch
    ? `${number(updatedMatch[1])}-${String(number(updatedMatch[2])).padStart(2, "0")}`
    : undefined;

  const groups = new Map();
  let sourceIndex = 0;
  for (const folderMatch of xml.matchAll(/<Folder>([\s\S]*?)<\/Folder>/g)) {
    const folder = folderMatch[1];
    const folderName = tag(folder, "name");

    for (const placemarkMatch of folder.matchAll(
      /<Placemark>([\s\S]*?)<\/Placemark>/g,
    )) {
      sourceIndex += 1;
      const placemark = placemarkMatch[1];
      const name = tag(placemark, "name");
      const description = cleanHtml(tag(placemark, "description"));
      const coordinates = tag(placemark, "coordinates")
        .split(",")
        .map(Number);
      const [lng, lat] = coordinates;
      if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;

      const series = seriesFor(folderName, description);
      const address = addressFor(description);
      const status = statusFor(name, description);
      const restaurant = {
        episode: series.episode,
        name,
        nameZh: name,
        dish: dishFor(name, description, series.key),
        category: categoryFor(`${name}\n${description}`),
        area: areaFor(name, address),
        address,
        lat,
        lng,
        status,
        notes: noteFor(description, status),
        sourceIndex,
        sourceFolder: folderName,
      };

      if (!groups.has(series.key)) {
        groups.set(series.key, {
          key: series.key,
          num: series.num,
          label: series.label,
          restaurants: [],
        });
      }
      groups.get(series.key).restaurants.push(restaurant);
    }
  }

  const order = [
    "MANGA",
    ...Array.from({ length: 10 }, (_, index) => `S${index + 1}`),
    "SP",
    "ORIGINAL",
    "EACH",
  ];
  const seasons = order.map((key) => groups.get(key)).filter(Boolean);
  const total = seasons.reduce((sum, season) => sum + season.restaurants.length, 0);

  const output = {
    generatedAt: new Date().toISOString(),
    source: {
      title: documentName,
      url: SOURCE_URL,
      kmlUrl: KML_URL,
      updated: sourceUpdated,
      description: documentDescription,
    },
    seasons,
  };

  await writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Imported ${total} places from ${documentName}`);
  for (const season of seasons) {
    console.log(`${season.key}: ${season.restaurants.length}`);
  }
}

await main();
