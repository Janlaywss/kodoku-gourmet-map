import { LOCALES, type Locale } from "@/i18n/messages";

export const LOCALE_STORAGE_KEY = "kodoku-gourmet-selected-locale";
export const LOCALE_COOKIE_KEY = "kodoku-gourmet-selected-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && LOCALES.includes(value as Locale));
}

export function localePath(locale: Locale): `/${Locale}` {
  return `/${locale}`;
}

export function localeFromLanguageTags(tags: readonly string[]): Locale {
  for (const tag of tags) {
    const value = tag.trim().split(";", 1)[0]?.toLowerCase() ?? "";
    if (value.startsWith("ja")) return "ja";
    if (value.startsWith("ko")) return "ko";
    if (value.startsWith("zh")) {
      if (/-(hk|mo)(?:-|$)/u.test(value)) return "zh-HK";
      if (/-(tw|hant)(?:-|$)/u.test(value)) return "zh-TW";
      return "zh-CN";
    }
    if (value.startsWith("en")) return "en";
  }

  return "en";
}

export function localeFromAcceptLanguage(value: string | null): Locale {
  return localeFromLanguageTags(value?.split(",") ?? []);
}
