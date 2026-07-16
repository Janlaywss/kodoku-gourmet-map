import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  LOCALE_COOKIE_KEY,
  isLocale,
  localeFromAcceptLanguage,
  localePath,
} from "@/i18n/routing";

export default async function RootPage() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const savedLocale = cookieStore.get(LOCALE_COOKIE_KEY)?.value;
  const locale = isLocale(savedLocale)
    ? savedLocale
    : localeFromAcceptLanguage(headerStore.get("accept-language"));

  redirect(`${localePath(locale)}?auto=1`);
}
