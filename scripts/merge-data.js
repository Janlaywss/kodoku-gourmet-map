#!/usr/bin/env node
/**
 * 从数据调研工作流的 journal.jsonl 中提取各季最终核查结果，
 * 生成 src/data/restaurants.json。
 * 用法: node scripts/merge-data.js <path-to-journal.jsonl>
 */
const fs = require("fs");
const path = require("path");

const CATEGORIES = new Set([
  "烧肉·烤肉", "拉面", "中华料理", "定食·食堂", "居酒屋·酒场", "洋食·西餐",
  "咖喱", "寿司·海鲜", "荞麦·乌冬", "串烧·烤鸡", "御好烧·铁板烧",
  "亚洲·异国料理", "甜点·咖啡", "其他",
]);
const STATUSES = new Set(["营业中", "已闭店", "不确定"]);

const SEASON_META = {
  0: { key: "SP", label: "特别篇" },
  1: { key: "S1", label: "第1季" }, 2: { key: "S2", label: "第2季" },
  3: { key: "S3", label: "第3季" }, 4: { key: "S4", label: "第4季" },
  5: { key: "S5", label: "第5季" }, 6: { key: "S6", label: "第6季" },
  7: { key: "S7", label: "第7季" }, 8: { key: "S8", label: "第8季" },
  9: { key: "S9", label: "第9季" }, 10: { key: "S10", label: "第10季" },
};

const journalPath = process.argv[2];
if (!journalPath) {
  console.error("用法: node scripts/merge-data.js <journal.jsonl>");
  process.exit(1);
}

const lines = fs
  .readFileSync(journalPath, "utf8")
  .trim()
  .split("\n")
  .map((l) => JSON.parse(l));

// 每季取最后一条非空结果（核查结果晚于调研结果写入，覆盖之）
const bySeason = new Map();
for (const l of lines) {
  const r = l.result;
  if (!r || typeof r.season !== "number" || !Array.isArray(r.restaurants)) continue;
  if (r.restaurants.length === 0) continue;
  bySeason.set(r.season, r.restaurants);
}

const anomalies = [];
const seasons = [];
const seenCoord = new Map(); // 完全相同坐标的店，微移错开便于点击

for (const num of Object.keys(SEASON_META).map(Number).sort((a, b) => (a === 0 ? 99 : a) - (b === 0 ? 99 : b))) {
  const meta = SEASON_META[num];
  const list = bySeason.get(num);
  if (!list) {
    anomalies.push(`缺失整季数据: ${meta.key}`);
    continue;
  }
  const restaurants = [];
  for (const r of list) {
    const item = { ...r };
    if (!CATEGORIES.has(item.category)) {
      anomalies.push(`${meta.key} E${item.episode} ${item.name}: 未知分类「${item.category}」→ 其他`);
      item.category = "其他";
    }
    if (!STATUSES.has(item.status)) {
      anomalies.push(`${meta.key} E${item.episode} ${item.name}: 未知状态「${item.status}」→ 不确定`);
      item.status = "不确定";
    }
    const okCoord =
      typeof item.lat === "number" && typeof item.lng === "number" &&
      item.lat >= 24 && item.lat <= 46 && item.lng >= 122 && item.lng <= 154;
    if (!okCoord) {
      anomalies.push(`${meta.key} E${item.episode} ${item.name}: 坐标异常 ${item.lat},${item.lng} → 剔除坐标(东京站占位)并标注`);
      item.lat = 35.681236;
      item.lng = 139.767125;
      item.notes = [item.notes, "坐标待核实"].filter(Boolean).join("；");
    }
    const ck = `${item.lat.toFixed(6)},${item.lng.toFixed(6)}`;
    const n = seenCoord.get(ck) ?? 0;
    if (n > 0) {
      item.lat += 0.00016 * n;
      item.lng += 0.00016 * n;
    }
    seenCoord.set(ck, n + 1);
    restaurants.push(item);
  }
  restaurants.sort((a, b) => a.episode - b.episode);
  seasons.push({ key: meta.key, num, label: meta.label, restaurants });
}

const out = {
  generatedAt: new Date().toISOString().slice(0, 10),
  seasons,
};

const outPath = path.join(__dirname, "..", "src", "data", "restaurants.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 1) + "\n");

const total = seasons.reduce((s, x) => s + x.restaurants.length, 0);
console.log(`✅ 写入 ${outPath}`);
console.log(`   ${seasons.length} 季 / 共 ${total} 家店`);
for (const s of seasons) console.log(`   ${s.key}: ${s.restaurants.length} 家`);
if (anomalies.length) {
  console.log(`⚠️ 异常 ${anomalies.length} 条:`);
  for (const a of anomalies) console.log("   - " + a);
} else {
  console.log("✅ 无异常");
}
