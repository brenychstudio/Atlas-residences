import type { Lang } from "../../content/languages";

export type CmsMeta = {
  status?: string;
  sort_order?: string;
  updated_at?: string;
  meta_title_en?: string;
  meta_title_es?: string;
  meta_description_en?: string;
  meta_description_es?: string;
  og_image?: string;
  noindex?: string;
};

export type Settings = {
  project_slug: string;
  project_name_en: string;
  project_name_es: string;
  tagline_en: string;
  tagline_es: string;
  address_en: string;
  address_es: string;
  coords_lat: string;
  coords_lng: string;
  phone: string;
  whatsapp: string;
  email: string;
  contact_url: string;
  brochure_url: string;
  pricelist_url: string;
  hero_image: string;
  hero_image_mobile: string;
  og_image_home: string;
  og_image_units: string;
  logo_mark: string;
  logo_url: string;
  og_image: string;
  brand_bg: string;
  brand_fg: string;
  brand_accent: string;
  languages: string;
  // legacy compatibility fields still consumed by some templates
  hotel_name_en?: string;
  hotel_name_es?: string;
  booking_url?: string;
} & CmsMeta;

export type Building = {
  id: string;
  slug: string;
  name_en: string;
  name_es: string;
  floors?: string;
  delivery_q?: string;
  cover_image?: string;
} & CmsMeta;

export type UnitType = {
  id: string;
  code: string;
  slug?: string;
  name_en: string;
  name_es: string;
  bedrooms?: string;
  bathrooms?: string;
  area_sqm?: string;
  price_from?: string;
  plan_image?: string;
  cover_image?: string;
  description_en?: string;
  description_es?: string;
} & CmsMeta;

export type Unit = {
  id: string;
  building_id?: string;
  unit_type_id?: string;
  unit_number: string;
  slug?: string;
  floor?: string;
  bedrooms?: string;
  bathrooms?: string;
  area_sqm?: string;
  price?: string;
  status_label?: string;
  orientation?: string;
  plan_image?: string;
} & CmsMeta;

export type Amenity = {
  id: string;
  slug: string;
  name_en: string;
  name_es: string;
  description_en?: string;
  description_es?: string;
  icon?: string;
  image?: string;
} & CmsMeta;

export type Poi = {
  id: string;
  slug: string;
  category?: string;
  name_en: string;
  name_es: string;
  distance_en?: string;
  distance_es?: string;
  image?: string;
  lat?: string;
  lng?: string;
} & CmsMeta;

export type Document = {
  id: string;
  slug: string;
  title_en: string;
  title_es: string;
  category?: string;
  file_url: string;
  cover_image?: string;
} & CmsMeta;

export type Progress = {
  id: string;
  phase_en: string;
  phase_es: string;
  progress_percent?: string;
  eta_en?: string;
  eta_es?: string;
  image?: string;
} & CmsMeta;

export type Page = {
  slug: string;
  title_en: string;
  title_es: string;
  body_en?: string;
  body_es?: string;
} & CmsMeta;


// Legacy hotel-facing shapes kept for compatibility during vertical cutover.
export type Room = UnitType & {
  slug?: string;
  short_en?: string;
  short_es?: string;
  description_en?: string;
  description_es?: string;
  guests?: string;
  beds_en?: string;
  beds_es?: string;
  amenities_en?: string;
  amenities_es?: string;
  highlights_en?: string;
  highlights_es?: string;
  cover_image?: string;
  gallery_images?: string;
};

export type Offer = Document & {
  title_en?: string;
  title_es?: string;
  period_en?: string;
  period_es?: string;
  included_en?: string;
  included_es?: string;
  terms_en?: string;
  terms_es?: string;
};

export type Experience = Amenity & {
  title_en?: string;
  title_es?: string;
  description_en?: string;
  description_es?: string;
  category?: string;
  cover_image?: string;
  gallery_images?: string;
};

export type Review = Progress & {
  source?: string;
  rating?: string;
  quote_en?: string;
  quote_es?: string;
  author_en?: string;
  author_es?: string;
};

export function pickLang<T extends Record<string, unknown>>(lang: Lang, obj: T, key: string): string {
  const k = `${key}_${lang}` as keyof T;
  return String(obj[k] ?? "");
}

export function splitPipe(s: string): string[] {
  return String(s || "")
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}
