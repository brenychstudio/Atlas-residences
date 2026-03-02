import { getEnv, isStrictEnv } from "../../core/cms/env";
import { fetchSheetRows } from "./sheetsFetch";
import { ATLAS_ASSETS } from "../content/assets";
import {
  type Amenity,
  type Building,
  type Document,
  type Page,
  type Poi,
  type Progress,
  type Settings,
  type Unit,
  type UnitType,
  type Room,
  type Offer,
  type Experience,
  type Review,
} from "./types";
import {
  REQUIRED_SHEETS_ENV_KEYS,
  SHEETS_AMENITIES_CSV,
  SHEETS_BUILDINGS_CSV,
  SHEETS_DOCUMENTS_CSV,
  SHEETS_PAGES_CSV,
  SHEETS_POI_CSV,
  SHEETS_PROGRESS_CSV,
  SHEETS_SETTINGS_CSV,
  SHEETS_UNITS_CSV,
  SHEETS_UNIT_TYPES_CSV,
} from "./urls";

type CmsData = {
  settings: Settings;
  buildings: Building[];
  unitTypes: UnitType[];
  units: Unit[];
  amenities: Amenity[];
  poi: Poi[];
  documents: Document[];
  progress: Progress[];
  pages: Page[];
};

let cachePromise: Promise<CmsData> | null = null;
let warnedMissingEnv = false;

function onlyPublished<T extends { status?: string }>(rows: T[]): T[] {
  return rows.filter((row) => {
    const status = String(row.status ?? "published").toLowerCase();
    return status === "published";
  });
}

function sortByOrder<T extends { sort_order?: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
}

function warnMissingEnvOnce() {
  if (warnedMissingEnv) return;
  warnedMissingEnv = true;
  console.warn("[engine] Missing SHEETS_*_CSV env vars → using demo fallback data (empty lists).");
}

function assertRequiredEnvInStrict() {
  if (!isStrictEnv()) return;
  const missing = REQUIRED_SHEETS_ENV_KEYS.filter((key) => !getEnv(key));
  if (missing.length) {
    throw new Error(`[engine][strict] Missing required SHEETS_*_CSV env vars: ${missing.join(", ")}`);
  }
}

function envUrl(key: string): string | undefined {
  const value = getEnv(key);
  if (value) return value;
  if (isStrictEnv()) throw new Error(`[engine][strict] Missing required SHEETS_*_CSV env var: ${key}`);
  warnMissingEnvOnce();
  return undefined;
}

function demoSettings(): Settings {
  return {
    project_slug: "atlas-residences",
    project_name_en: "Atlas Residences",
    project_name_es: "Atlas Residences",
    tagline_en: "Quiet futurism for city living.",
    tagline_es: "Futurismo silencioso para la vida urbana.",
    address_en: "Demo Address, Barcelona",
    address_es: "Dirección demo, Barcelona",
    coords_lat: "41.3851",
    coords_lng: "2.1734",
    phone: "+34 600 000 000",
    whatsapp: "+34 600 000 000",
    email: "sales@atlas-residences.demo",
    contact_url: "/en/contact/",
    brochure_url: ATLAS_ASSETS.downloads.brochureCoverEn4x5,
    pricelist_url: ATLAS_ASSETS.downloads.pricelistCoverEn4x5,
    hero_image: ATLAS_ASSETS.hero.hr01Morning16x9,
    hero_image_mobile: ATLAS_ASSETS.hero.hr04Mobile9x16,
    og_image_home: ATLAS_ASSETS.og.og01Home1200x630,
    og_image_units: ATLAS_ASSETS.og.og02Units1200x630,
    logo_mark: ATLAS_ASSETS.brand.mark011x1,
    languages: "en|es",
    hotel_name_en: "Atlas Residences",
    hotel_name_es: "Atlas Residences",
    booking_url: "/en/contact/",
    status: "published",
  };
}

async function loadRows<T extends Record<string, unknown>>(key: string): Promise<T[]> {
  const url = envUrl(key);
  if (!url) return [];
  return fetchSheetRows<T>(url, key);
}

async function loadCms(): Promise<CmsData> {
  assertRequiredEnvInStrict();

  const [settingsRows, buildings, unitTypes, units, amenities, poi, documents, progress, pages] =
    await Promise.all([
      loadRows<Settings>(SHEETS_SETTINGS_CSV),
      loadRows<Building>(SHEETS_BUILDINGS_CSV),
      loadRows<UnitType>(SHEETS_UNIT_TYPES_CSV),
      loadRows<Unit>(SHEETS_UNITS_CSV),
      loadRows<Amenity>(SHEETS_AMENITIES_CSV),
      loadRows<Poi>(SHEETS_POI_CSV),
      loadRows<Document>(SHEETS_DOCUMENTS_CSV),
      loadRows<Progress>(SHEETS_PROGRESS_CSV),
      loadRows<Page>(SHEETS_PAGES_CSV),
    ]);

  if (isStrictEnv() && settingsRows.length !== 1) {
    throw new Error("[engine][strict] settings sheet must contain exactly 1 row.");
  }

  return {
    settings: settingsRows[0] ?? demoSettings(),
    buildings: sortByOrder(onlyPublished(buildings)),
    unitTypes: sortByOrder(onlyPublished(unitTypes)),
    units: sortByOrder(onlyPublished(units)),
    amenities: sortByOrder(onlyPublished(amenities)),
    poi: sortByOrder(onlyPublished(poi)),
    documents: sortByOrder(onlyPublished(documents)),
    progress: sortByOrder(onlyPublished(progress)),
    pages: sortByOrder(onlyPublished(pages)),
  };
}

async function getCms(): Promise<CmsData> {
  if (!cachePromise) cachePromise = loadCms();
  return cachePromise;
}

export async function getSettings(_lang?: string): Promise<Settings> {
  return (await getCms()).settings;
}

export async function getBuildings(): Promise<Building[]> {
  return (await getCms()).buildings;
}

export async function getUnitTypes(): Promise<UnitType[]> {
  return (await getCms()).unitTypes;
}

export async function getUnits(): Promise<Unit[]> {
  return (await getCms()).units;
}

export async function getUnitById(id: string): Promise<Unit | undefined> {
  return (await getCms()).units.find((x) => x.id === id);
}

export async function getAmenities(): Promise<Amenity[]> {
  return (await getCms()).amenities;
}

export async function getPoi(): Promise<Poi[]> {
  return (await getCms()).poi;
}

export async function getDocuments(): Promise<Document[]> {
  return (await getCms()).documents;
}

export async function getProgress(): Promise<Progress[]> {
  return (await getCms()).progress;
}

export async function getPages(): Promise<Page[]> {
  return (await getCms()).pages;
}

// Backward-compatible exports for still-existing hotel routes.
export async function getRooms(): Promise<Room[]> {
  return (await getUnitTypes()).map((x) => ({
    ...x,
    slug: x.slug ?? x.code ?? x.id,
    name_en: x.name_en,
    name_es: x.name_es,
    short_en: x.description_en ?? "",
    short_es: x.description_es ?? "",
    description_en: x.description_en ?? "",
    description_es: x.description_es ?? "",
    cover_image: x.cover_image ?? x.plan_image ?? "",
    gallery_images: x.cover_image ?? "",
  }));
}
export async function getRoomBySlug(slug: string): Promise<Room | undefined> {
  return (await getRooms()).find((x) => x.slug === slug || x.id === slug || x.code === slug);
}
export async function getOffers(): Promise<Offer[]> {
  return (await getDocuments()).map((x) => ({
    ...x,
    title_en: x.title_en,
    title_es: x.title_es,
    period_en: "",
    period_es: "",
    included_en: "",
    included_es: "",
    terms_en: "",
    terms_es: "",
  }));
}
export async function getOfferBySlug(slug: string): Promise<Offer | undefined> {
  return (await getOffers()).find((x) => x.slug === slug);
}
export async function getExperiences(): Promise<Experience[]> {
  return (await getAmenities()).map((x) => ({
    ...x,
    title_en: x.name_en,
    title_es: x.name_es,
    category: "amenity",
    cover_image: x.image ?? "",
    gallery_images: x.image ?? "",
  }));
}
export async function getExperienceBySlug(slug: string): Promise<Experience | undefined> {
  return (await getExperiences()).find((x) => x.slug === slug);
}
export async function getReviews(): Promise<Review[]> {
  return (await getProgress()).map((x) => ({
    ...x,
    source: "Construction",
    rating: x.progress_percent ?? "0",
    quote_en: x.phase_en,
    quote_es: x.phase_es,
    author_en: x.eta_en ?? "Team Atlas",
    author_es: x.eta_es ?? "Equipo Atlas",
  }));
}
export async function getPageBySlug(slug: string): Promise<Page | undefined> {
  return (await getPages()).find((x) => x.slug === slug);
}
