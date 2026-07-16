import { LOCALES, type Locale } from "@/i18n/messages";
import { localePath } from "@/i18n/routing";

const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string): string {
  const withProtocol = /^https?:\/\//u.test(value) ? value : `https://${value}`;
  return new URL(withProtocol).origin;
}

export function getSiteUrl(): string {
  const configured =
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  return configured ? normalizeSiteUrl(configured) : LOCAL_SITE_URL;
}

export function absoluteUrl(pathname = "/"): string {
  return new URL(pathname, getSiteUrl()).toString();
}

export const LANGUAGE_ALTERNATES = Object.fromEntries([
  ...LOCALES.map((locale) => [locale, localePath(locale)]),
  ["x-default", localePath("en")],
]) as Record<Locale | "x-default", string>;
