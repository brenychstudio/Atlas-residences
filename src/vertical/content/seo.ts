import type { Lang } from "../../content/languages";
import { LANGS } from "../../content/languages";
import type { SitemapEntry } from "../../core/seo/sitemap";

export const ATLAS_SITE_NAME = "Atlas Residences";
export const ATLAS_SITE_ORIGIN = "https://atlas-residences.pages.dev";
export const ATLAS_OG_IMAGE_URL = `${ATLAS_SITE_ORIGIN}/og/atlas-residences-og.png`;

export const ATLAS_SEO_DESCRIPTION = {
  en: "A premium residential presentation system for curated Barcelona residences, live availability, guided masterplan exploration and private viewing requests.",
  es: "Una presentación residencial premium para viviendas seleccionadas en Barcelona, disponibilidad en vivo, masterplan guiado y solicitudes de visita privada.",
} as const;

export const ATLAS_SEO_PAGE_TITLES = {
  home: {
    en: "Atlas Residences — Private Residences in Barcelona",
    es: "Atlas Residences — Residencias privadas en Barcelona",
  },
  masterplan: {
    en: "Masterplan — Atlas Residences",
    es: "Masterplan — Atlas Residences",
  },
  units: {
    en: "Available Residences — Atlas Residences",
    es: "Residencias disponibles — Atlas Residences",
  },
  location: {
    en: "Location — Atlas Residences Barcelona",
    es: "Ubicación — Atlas Residences Barcelona",
  },
  downloads: {
    en: "Documents & Downloads — Atlas Residences",
    es: "Documentos y descargas — Atlas Residences",
  },
  contact: {
    en: "Private Viewing — Atlas Residences",
    es: "Visita privada — Atlas Residences",
  },
  privacy: {
    en: "Privacy Policy — Atlas Residences",
    es: "Política de privacidad — Atlas Residences",
  },
  terms: {
    en: "Terms — Atlas Residences",
    es: "Términos — Atlas Residences",
  },
} as const;

const ATLAS_SEO_PAGES = {
  home: "",
  masterplan: "masterplan",
  units: "units",
  location: "location",
  downloads: "downloads",
  contact: "contact",
  privacy: "privacy",
  terms: "terms",
} as const;

export type AtlasSeoPage = keyof typeof ATLAS_SEO_PAGES;

export function getAtlasSeoPath(page: AtlasSeoPage, lang: Lang): string {
  const slug = ATLAS_SEO_PAGES[page];
  return slug ? `/${lang}/${slug}/` : `/${lang}/`;
}

export function getAtlasSeoUrl(pathname: string): string {
  return new URL(pathname, ATLAS_SITE_ORIGIN).toString();
}

export function getAtlasSeoAlternates(page: AtlasSeoPage) {
  return {
    en: getAtlasSeoUrl(getAtlasSeoPath(page, "en")),
    es: getAtlasSeoUrl(getAtlasSeoPath(page, "es")),
    xDefault: getAtlasSeoUrl(getAtlasSeoPath(page, "en")),
  } as const;
}

export function getAtlasPageSeo(page: AtlasSeoPage, lang: Lang, descriptionOverride?: string) {
  const title = ATLAS_SEO_PAGE_TITLES[page][lang];
  const description = descriptionOverride?.trim() || ATLAS_SEO_DESCRIPTION[lang];

  return {
    title,
    description,
    canonical: getAtlasSeoUrl(getAtlasSeoPath(page, lang)),
    alternates: getAtlasSeoAlternates(page),
    ogImage: ATLAS_OG_IMAGE_URL,
    siteName: ATLAS_SITE_NAME,
  } as const;
}

export function getAtlasSitemapEntries(today = new Date().toISOString().slice(0, 10)): SitemapEntry[] {
  const pages = Object.keys(ATLAS_SEO_PAGES) as AtlasSeoPage[];

  return pages.flatMap((page) =>
    LANGS.map((lang) => ({
      loc: getAtlasSeoUrl(getAtlasSeoPath(page, lang)),
      lastmod: today,
    })),
  );
}

export function getAtlasRobotsRules(): string[] {
  return ["User-agent: *", "Allow: /"];
}
