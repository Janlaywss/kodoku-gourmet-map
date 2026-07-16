import type { Metadata } from "next";
import "mapbox-gl/dist/mapbox-gl.css";
import { LOCALES } from "@/i18n/messages";
import { LOCALE_COOKIE_KEY, LOCALE_STORAGE_KEY } from "@/i18n/routing";
import { SEO_COPY } from "@/i18n/seo";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SEO_COPY.en.title,
    template: "%s | 孤独のグルメ Pilgrimage Map",
  },
  description: SEO_COPY.en.description,
  applicationName: "孤独のグルメ Pilgrimage Map",
  category: "travel",
  referrer: "origin-when-cross-origin",
};

const localeBootstrapScript = `(() => {
  try {
    const locales = ${JSON.stringify(LOCALES)};
    const current = location.pathname.split("/")[1];
    if (locales.includes(current)) document.documentElement.lang = current;
    const params = new URLSearchParams(location.search);
    if (params.get("auto") !== "1") return;
    const saved = localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)});
    const cookie = (value) => {
      const secure = location.protocol === "https:" ? "; Secure" : "";
      document.cookie = ${JSON.stringify(`${LOCALE_COOKIE_KEY}=`)} + value + "; Max-Age=31536000; Path=/; SameSite=Lax" + secure;
    };
    if (locales.includes(saved)) {
      cookie(saved);
      if (saved !== current) {
        document.documentElement.style.visibility = "hidden";
        location.replace("/" + saved);
        return;
      }
    }
    history.replaceState(null, "", location.pathname + location.hash);
  } catch {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeBootstrapScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
