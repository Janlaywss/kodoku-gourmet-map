import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePage from "@/components/HomePage";
import { RESTAURANTS, SOURCE } from "@/data";
import { LOCALES, type Locale } from "@/i18n/messages";
import { localePath } from "@/i18n/routing";
import { OPEN_GRAPH_LOCALE, SEO_COPY } from "@/i18n/seo";
import { absoluteUrl, LANGUAGE_ALTERNATES } from "@/lib/site";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

function assertLocale(value: string): asserts value is Locale {
  if (!LOCALES.includes(value as Locale)) notFound();
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale: value } = await params;
  assertLocale(value);
  const copy = SEO_COPY[value];

  return {
    title: { absolute: copy.title },
    description: copy.description,
    alternates: {
      canonical: localePath(value),
      languages: LANGUAGE_ALTERNATES,
    },
    openGraph: {
      type: "website",
      url: localePath(value),
      title: copy.title,
      description: copy.description,
      siteName: "孤独のグルメ Pilgrimage Map",
      locale: OPEN_GRAPH_LOCALE[value],
      alternateLocale: LOCALES.filter((locale) => locale !== value).map(
        (locale) => OPEN_GRAPH_LOCALE[locale],
      ),
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: copy.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale: value } = await params;
  assertLocale(value);
  const copy = SEO_COPY[value];
  const pageUrl = absoluteUrl(localePath(value));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        url: absoluteUrl("/"),
        name: "孤独のグルメ Pilgrimage Map",
        alternateName: [
          "Kodoku no Gourmet Pilgrimage Map",
          "孤独のグルメ 聖地巡礼マップ",
          "孤独的美食家圣地巡礼地图",
        ],
        description: copy.description,
        inLanguage: LOCALES,
      },
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}#application`,
        url: pageUrl,
        name: copy.title,
        description: copy.description,
        applicationCategory: "TravelApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript and a modern web browser",
        isAccessibleForFree: true,
        inLanguage: value,
        image: absoluteUrl("/og.png"),
        about: {
          "@type": "TVSeries",
          name: "孤独のグルメ",
        },
        mainEntity: {
          "@type": "ItemList",
          name: "孤独のグルメ locations",
          numberOfItems: RESTAURANTS.length,
        },
        isBasedOn: SOURCE.url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</gu, "\\u003c"),
        }}
      />
      <HomePage initialLocale={value} />
    </>
  );
}
