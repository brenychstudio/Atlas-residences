import type { Lang } from "../../content/languages";

export type CmsMeta = {
  status?: string; // draft | published | archived
  sort_order?: string;
  updated_at?: string;

  meta_title_en?: string;
  meta_title_es?: string;
  meta_description_en?: string;
  meta_description_es?: string;
  og_image?: string;

  noindex?: string; // "TRUE" | "FALSE"
};

export type Settings = {
  hotel_slug: string;
  hotel_name_en: string;
  hotel_name_es: string;

  address_en: string;
  address_es: string;

  coords_lat: string;
  coords_lng: string;

  phone: string;
  whatsapp: string;
  email: string;

  booking_provider: string;
  booking_url: string;
  booking_widget_code?: string;

  languages: string; // "en|es"
  brand_theme?: string;

  social_instagram?: string;
  social_google_maps?: string;

  hero_image?: string;
} & CmsMeta;

export type Room = {
  id: string;
  slug: string;

  name_en: string;
  name_es: string;

  short_en: string;
  short_es: string;

  description_en: string;
  description_es: string;

  price_from?: string;
  size_sqm?: string;
  guests: string;

  beds_en: string;
  beds_es: string;

  amenities_en: string;
  amenities_es: string;

  highlights_en: string;
  highlights_es: string;

  cover_image: string;
  gallery_images: string;

  booking_link?: string;
} & CmsMeta;

export type Offer = {
  id: string;
  slug: string;

  title_en: string;
  title_es: string;

  period_en: string;
  period_es: string;

  included_en: string;
  included_es: string;

  terms_en: string;
  terms_es: string;

  cta_type?: "booking" | "contact";
  cta_url?: string;

  cover_image: string;
  gallery_images: string;
} & CmsMeta;

export type Experience = {
  id: string;
  slug: string;

  category: string;

  title_en: string;
  title_es: string;

  description_en: string;
  description_es: string;

  cta_type?: "booking" | "contact";
  cta_url?: string;

  cover_image: string;
  gallery_images: string;
} & CmsMeta;

export type Review = {
  id: string;
  source: string; // Google | Tripadvisor | etc
  rating: string; // "4.8"
  quote_en: string;
  quote_es: string;
  author_en: string;
  author_es: string;
} & CmsMeta;

export type Page = {
  slug: string;
  title_en: string;
  title_es: string;
  body_en?: string;
  body_es?: string;
} & CmsMeta;

export function pickLang<T extends Record<string, any>>(
  lang: Lang,
  obj: T,
  key: string
): string {
  const k = `${key}_${lang}` as keyof T;
  return String(obj[k] ?? "");
}

export function splitPipe(s: string): string[] {
  return String(s || "")
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}