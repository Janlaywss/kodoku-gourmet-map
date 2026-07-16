export type CategoryMeta = {
  name: string;
  color: string;
  emoji: string;
};

// 分类顺序即图例顺序；配色经 CVD（色觉障碍）区分度验证
export const CATEGORIES: CategoryMeta[] = [
  { name: "烧肉·烤肉", color: "#e34948", emoji: "🥩" },
  { name: "洋食·西餐", color: "#2a78d6", emoji: "🍝" },
  { name: "拉面", color: "#eda100", emoji: "🍜" },
  { name: "定食·食堂", color: "#008300", emoji: "🍱" },
  { name: "御好烧·铁板烧", color: "#e87ba4", emoji: "🍳" },
  { name: "咖喱", color: "#a3570e", emoji: "🍛" },
  { name: "亚洲·异国料理", color: "#1baf7a", emoji: "🌏" },
  { name: "串烧·烤鸡", color: "#b03060", emoji: "🍢" },
  { name: "荞麦·乌冬", color: "#6b8e23", emoji: "🥢" },
  { name: "居酒屋·酒场", color: "#4a3aa7", emoji: "🏮" },
  { name: "中华料理", color: "#eb6834", emoji: "🥟" },
  { name: "寿司·海鲜", color: "#0794bd", emoji: "🍣" },
  { name: "甜点·咖啡", color: "#9b7bd6", emoji: "☕" },
  { name: "其他", color: "#5967c9", emoji: "🍚" },
];

export const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.name, c]));

export function categoryColor(name: string): string {
  return CATEGORY_MAP.get(name)?.color ?? "#5967c9";
}

export function categoryEmoji(name: string): string {
  return CATEGORY_MAP.get(name)?.emoji ?? "🍚";
}
