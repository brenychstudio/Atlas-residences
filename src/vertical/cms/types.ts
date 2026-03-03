import type { Lang } from "../../content/languages";

export type CmsMeta = {
  status?: string; // draft | published | archived (для більшості таблиць)
  sort_order?: string;
  updated_at?: string;

  meta_title_en?: string;
  meta_title_es?: string;
  meta_description_en?: string;
  meta_description_es?: string;
  og_image?: string;

  noindex?: string; // "TRUE" | "FALSE"
};

/**
 * Developer Vertical Settings (Atlas)
 * Примітка: залишаємо legacy hotel-поля як optional, щоб старі сторінки не ламалися.
 */
export type Settings = {
  // Developer fields (brief)
  project_name_en?: string;
  project_name_es?: string;

  tagline_en?: string;
  tagline_es?: string;

  developer_name?: string;

  address_en?: string;
  address_es?: string;

  coords_lat?: string;
  coords_lng?: string;

  phone?: string;
  whatsapp?: string;
  email?: string;

  primary_cta_type?: string; // lead_form|whatsapp|call

  brochure_url_en?: string;
  brochure_url_es?: string;

  price_list_url_en?: string;
  price_list_url_es?: string;

  languages_enabled?: string; // "en|es"
  brand_bg?: string;
  brand_fg?: string;
  brand_accent?: string;

  logo_url?: string;

  // Legacy hotel fields (optional compatibility)
  hotel_slug?: string;
  hotel_name_en?: string;
  hotel_name_es?: string;

  booking_provider?: string;
  booking_url?: string;
  booking_widget_code?: string;

  languages?: string; // "en|es" legacy alias
  brand_theme?: string;

  social_instagram?: string;
  social_google_maps?: string;

  hero_image?: string; // legacy hero
} & CmsMeta;

export type Building = {
  id: string; // a, b
  name_en: string;
  name_es: string;

  floors?: string; // number but CSV -> string
  delivery_date?: string;

  masterplan_hotspot_x?: string; // 0-100
  masterplan_hotspot_y?: string; // 0-100

  status?: string; // published
  sort_order?: string;
};

export type UnitType = {
  id: string; // t1..t6
  title_en: string;
  title_es: string;

  beds?: string;
  baths?: string;

  area_from?: string;
  area_to?: string;

  price_from?: string;
  price_to?: string;

  highlights_en?: string; // pipe
  highlights_es?: string;

  cover_image?: string;

  status?: string; // published
  sort_order?: string;
};

export type UnitStatus = "available" | "reserved" | "sold" | "coming_soon" | string;

export type Unit = {
  id: string; // a-03-t2-301
  building_id?: string;
  floor?: string;
  number?: string;

  type_id?: string;

  beds?: string;
  baths?: string;

  area_m2?: string;
  price_eur?: string;

  status?: UnitStatus; // availability status

  orientation?: "sea" | "city" | "courtyard" | "mountain" | string;

  plan_image?: string;
  gallery_images?: string; // pipe

  cta_override?: string;

  sort?: string; // numeric
} & Omit<CmsMeta, "status">;

export type Amenity = {
  id: string;
  label_en: string;
  label_es: string;

  category?: string; // wellness|kids|parking|green|security
  x?: string; // 0-100
  y?: string; // 0-100
  icon?: string;

  status?: string; // published
  sort_order?: string;
};

export type Poi = {
  id: string;
  name_en: string;
  name_es: string;

  category?: string; // metro|school|park|beach|shopping|culture
  distance_minutes?: string;

  coords_lat?: string;
  coords_lng?: string;

  status?: string; // published
  sort_order?: string;
};

export type Document = {
  id: string;
  title_en: string;
  title_es: string;

  type?: string; // brochure|price_list|specs|finishes|legal
  url_en?: string;
  url_es?: string;

  gated?: string; // "true" | "false"
  status?: string; // published
  sort_order?: string;
};

export type ProgressEntry = {
  date?: string; // YYYY-MM-DD
  title_en?: string;
  title_es?: string;
  text_en?: string;
  text_es?: string;
  media?: string; // pipe
  status?: string; // published
  sort_order?: string;
};

/**
 * Pages table for SEO (brief)
 * path: /en/, /en/masterplan/, ...
 */
export type Page = {
  // allow both legacy slug + new path to avoid breaking old code
  slug?: string;
  path?: string;

  title_en: string;
  title_es: string;

  description_en?: string;
  description_es?: string;

  body_en?: string;
  body_es?: string;

  og_image?: string;
  noindex?: string;

  status?: string; // published
  sort_order?: string;
  updated_at?: string;
} & Omit<CmsMeta, "og_image" | "noindex" | "status" | "sort_order" | "updated_at">;

/**
 * Legacy hotel entities (kept for backward compatibility with old routes).
 * They can be returned as empty arrays safely until hotel pages are removed.
 */
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

// Helpers
export function pickLang<T extends Record<string, any>>(lang: Lang, obj: T, key: string): string {
  const k = `${key}_${lang}` as keyof T;
  return String(obj[k] ?? "");
}

export function splitPipe(s: string): string[] {
  return String(s || "")
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}