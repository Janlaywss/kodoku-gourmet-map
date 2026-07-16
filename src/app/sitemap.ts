import type { MetadataRoute } from "next";
import { SOURCE } from "@/data";
import { LOCALES } from "@/i18n/messages";
import { localePath } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site";

function sourceUpdateDate(): Date {
  const [year, month] = (SOURCE.updated ?? "").split("-").map(Number);
  return year && month
    ? new Date(Date.UTC(year, month - 1, 1))
    : new Date("2026-04-01T00:00:00.000Z");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries([
    ...LOCALES.map((locale) => [locale, absoluteUrl(localePath(locale))]),
    ["x-default", absoluteUrl(localePath("en"))],
  ]);

  return LOCALES.map((locale) => ({
    url: absoluteUrl(localePath(locale)),
    lastModified: sourceUpdateDate(),
    changeFrequency: "monthly" as const,
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages },
    images: [absoluteUrl("/og.png")],
  }));
}
