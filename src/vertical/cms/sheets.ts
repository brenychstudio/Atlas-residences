// src/vertical/cms/sheets.ts
import type {
  Settings,
  Building,
  UnitType,
  Unit,
  Amenity,
  Poi,
  Document,
  ProgressEntry,
  Page,
  // legacy:
  Room,
  Offer,
  Experience,
  Review,
} from "./types";

import { fetchSheetRows } from "./sheetsFetch";
import { getEnv, isStrictEnv } from "../../core/cms/env";
import {
  SHEETS_SETTINGS_CSV,
  SHEETS_BUILDINGS_CSV,
  SHEETS_UNIT_TYPES_CSV,
  SHEETS_UNITS_CSV,
  SHEETS_AMENITIES_CSV,
  SHEETS_POI_CSV,
  SHEETS_DOCUMENTS_CSV,
  SHEETS_PROGRESS_CSV,
  SHEETS_PAGES_CSV,
  // legacy optional:
  SHEETS_ROOMS_CSV,
  SHEETS_OFFERS_CSV,
  SHEETS_EXPERIENCES_CSV,
  SHEETS_REVIEWS_CSV,
  REQUIRED_DEVELOPER_SHEETS,
} from "./urls";

// IMPORTANT: demo settings must use ATLAS_ASSETS (no new hardcoded /atlas/... paths here)
import { ATLAS_ASSETS } from "../content/assets";

type CmsData = {
  // Developer vertical
  settings: Settings;
  buildings: Building[];
  unit_types: UnitType[];
  units: Unit[];
  amenities: Amenity[];
  poi: Poi[];
  documents: Document[];
  progress: ProgressEntry[];
  pages: Page[];

  // Legacy (kept to avoid breaking old hotel routes)
  rooms: Room[];
  offers: Offer[];
  experiences: Experience[];
  reviews: Review[];
};

let cachePromise: Promise<CmsData> | null = null;

function onlyPublished<T extends { status?: string }>(xs: T[]): T[] {
  return xs.filter((x) => String(x.status || "").toLowerCase() === "published");
}

function sortByOrder<T extends { sort_order?: string }>(xs: T[]): T[] {
  return [...xs].sort((a, b) => {
    const aa = Number(a.sort_order ?? 0);
    const bb = Number(b.sort_order ?? 0);
    return aa - bb;
  });
}

function sortByNumericKey<T extends Record<string, any>>(xs: T[], key: string): T[] {
  return [...xs].sort((a, b) => Number(a?.[key] ?? 0) - Number(b?.[key] ?? 0));
}

let warnedMissingEnv = false;
function warnMissingEnvOnce() {
  if (warnedMissingEnv) return;
  warnedMissingEnv = true;
  console.warn("[engine] Missing SHEETS_*_CSV env vars → using demo fallback data (empty lists).");
}

function validateStrictRequiredEnv() {
  if (!isStrictEnv()) return;
  const missing = REQUIRED_DEVELOPER_SHEETS.filter((k) => !getEnv(k));
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}

function getRequiredUrlOrWarn(envKey: string): string | undefined {
  const url = getEnv(envKey);
  if (url) return url;

  if (isStrictEnv()) {
    // strict should have been validated before calling this
    throw new Error(`Missing env var: ${envKey}`);
  }

  warnMissingEnvOnce();
  return undefined;
}

function getOptionalUrl(envKey: string): string | undefined {
  const url = getEnv(envKey);
  return url || undefined;
}

function demoSettings(): Settings {
  const A = ATLAS_ASSETS as any;

  const hero = A.hr01Morning16x9 ?? A.hero?.hr01Morning16x9 ?? "";
  const og = A.og01Home1200x630 ?? A.og?.og01Home1200x630 ?? hero ?? "";
  const logo = A.mark01_1x1 ?? A.brand?.mark01_1x1 ?? "";

  // brochure/pricelist covers (if keys exist; otherwise fall back to OG)
  const brochureCover =
    A.brochureCoverEn4x5 ??
    A.downloads?.brochureCoverEn4x5 ??
    A["brochure-cover-en-4x5"] ??
    og;

  const priceListCover =
    A.pricelistCoverEn4x5 ??
    A.downloads?.pricelistCoverEn4x5 ??
    A["pricelist-cover-en-4x5"] ??
    og;

  return {
    project_name_en: "ATLAS RESIDENCES",
    project_name_es: "ATLAS RESIDENCES",
    tagline_en: "Premium residential development (concept demo).",
    tagline_es: "Promoción residencial premium (demo conceptual).",

    developer_name: "Atlas Development",
    address_en: "Barcelona (concept location)",
    address_es: "Barcelona (ubicación conceptual)",

    coords_lat: "41.3851",
    coords_lng: "2.1734",

    phone: "",
    whatsapp: "",
    email: "",

    primary_cta_type: "lead_form",

    brochure_url_en: brochureCover,
    brochure_url_es: brochureCover,
    price_list_url_en: priceListCover,
    price_list_url_es: priceListCover,

    languages_enabled: "en|es",
    // legacy alias used by some parts of the engine
    languages: "en|es",

    brand_bg: "#0b0c0d",
    brand_fg: "#f2f2f2",
    brand_accent: "#9aa3ad",

    logo_url: logo,
    og_image: og,
    hero_image: hero,

    // legacy hotel compatibility
    hotel_name_en: "ATLAS RESIDENCES",
    hotel_name_es: "ATLAS RESIDENCES",
  } as Settings;
}

async function loadCms(): Promise<CmsData> {
  // strict-mode: must fail fast if any required developer env var is missing
  validateStrictRequiredEnv();

  // Developer URLs
  const settingsUrl = getRequiredUrlOrWarn(SHEETS_SETTINGS_CSV);
  const buildingsUrl = getRequiredUrlOrWarn(SHEETS_BUILDINGS_CSV);
  const unitTypesUrl = getRequiredUrlOrWarn(SHEETS_UNIT_TYPES_CSV);
  const unitsUrl = getRequiredUrlOrWarn(SHEETS_UNITS_CSV);
  const amenitiesUrl = getRequiredUrlOrWarn(SHEETS_AMENITIES_CSV);
  const poiUrl = getRequiredUrlOrWarn(SHEETS_POI_CSV);
  const documentsUrl = getRequiredUrlOrWarn(SHEETS_DOCUMENTS_CSV);
  const progressUrl = getRequiredUrlOrWarn(SHEETS_PROGRESS_CSV);
  const pagesUrl = getRequiredUrlOrWarn(SHEETS_PAGES_CSV);

  // Legacy optional URLs (do not warn; do not fail strict)
  const roomsUrl = getOptionalUrl(SHEETS_ROOMS_CSV);
  const offersUrl = getOptionalUrl(SHEETS_OFFERS_CSV);
  const experiencesUrl = getOptionalUrl(SHEETS_EXPERIENCES_CSV);
  const reviewsUrl = getOptionalUrl(SHEETS_REVIEWS_CSV);

  const [
    settingsRows,
    buildings,
    unit_types,
    units,
    amenities,
    poi,
    documents,
    progress,
    pages,
    // legacy:
    rooms,
    offers,
    experiences,
    reviews,
  ] = await Promise.all([
    settingsUrl ? fetchSheetRows<Settings>(settingsUrl) : Promise.resolve<Settings[]>([]),
    buildingsUrl ? fetchSheetRows<Building>(buildingsUrl) : Promise.resolve<Building[]>([]),
    unitTypesUrl ? fetchSheetRows<UnitType>(unitTypesUrl) : Promise.resolve<UnitType[]>([]),
    unitsUrl ? fetchSheetRows<Unit>(unitsUrl) : Promise.resolve<Unit[]>([]),
    amenitiesUrl ? fetchSheetRows<Amenity>(amenitiesUrl) : Promise.resolve<Amenity[]>([]),
    poiUrl ? fetchSheetRows<Poi>(poiUrl) : Promise.resolve<Poi[]>([]),
    documentsUrl ? fetchSheetRows<Document>(documentsUrl) : Promise.resolve<Document[]>([]),
    progressUrl ? fetchSheetRows<ProgressEntry>(progressUrl) : Promise.resolve<ProgressEntry[]>([]),
    pagesUrl ? fetchSheetRows<Page>(pagesUrl) : Promise.resolve<Page[]>([]),

    // legacy optional:
    roomsUrl ? fetchSheetRows<Room>(roomsUrl) : Promise.resolve<Room[]>([]),
    offersUrl ? fetchSheetRows<Offer>(offersUrl) : Promise.resolve<Offer[]>([]),
    experiencesUrl ? fetchSheetRows<Experience>(experiencesUrl) : Promise.resolve<Experience[]>([]),
    reviewsUrl ? fetchSheetRows<Review>(reviewsUrl) : Promise.resolve<Review[]>([]),
  ]);

  // settings: strict expects exactly 1 row; demo falls back
  if (isStrictEnv()) {
    if (settingsRows.length !== 1) throw new Error("settings sheet must contain exactly 1 row.");
  }
  const settings = settingsRows[0] ?? demoSettings();

  return {
    settings,

    buildings: sortByOrder(onlyPublished(buildings)),
    unit_types: sortByOrder(onlyPublished(unit_types)),
    // units are availability-driven, not published/draft; keep all and sort by `sort`
    units: sortByNumericKey(units, "sort"),

    amenities: sortByOrder(onlyPublished(amenities)),
    poi: sortByOrder(onlyPublished(poi)),
    documents: sortByOrder(onlyPublished(documents)),
    progress: sortByOrder(onlyPublished(progress)),
    pages: sortByOrder(onlyPublished(pages)),

    // legacy
    rooms: sortByOrder(onlyPublished(rooms)),
    offers: sortByOrder(onlyPublished(offers)),
    experiences: sortByOrder(onlyPublished(experiences)),
    reviews: sortByOrder(onlyPublished(reviews)),
  };
}

async function getCms(): Promise<CmsData> {
  if (!cachePromise) cachePromise = loadCms();
  return cachePromise;
}

/**
 * Developer Vertical Public API (required)
 */
export async function getSettings(): Promise<Settings> {
  return (await getCms()).settings;
}
export async function getBuildings(): Promise<Building[]> {
  return (await getCms()).buildings;
}
export async function getUnitTypes(): Promise<UnitType[]> {
  return (await getCms()).unit_types;
}
export async function getUnits(): Promise<Unit[]> {
  return (await getCms()).units;
}
export async function getUnitById(id: string): Promise<Unit | undefined> {
  return (await getCms()).units.find((u) => u.id === id);
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
export async function getProgress(): Promise<ProgressEntry[]> {
  return (await getCms()).progress;
}
export async function getPages(): Promise<Page[]> {
  return (await getCms()).pages;
}

/**
 * Legacy hotel API (compat)
 * Keep these so old routes compile/build until removed.
 */
export async function getRooms(): Promise<Room[]> {
  return (await getCms()).rooms;
}
export async function getRoomBySlug(slug: string): Promise<Room | undefined> {
  return (await getCms()).rooms.find((r) => r.slug === slug);
}
export async function getOffers(): Promise<Offer[]> {
  return (await getCms()).offers;
}
export async function getOfferBySlug(slug: string): Promise<Offer | undefined> {
  return (await getCms()).offers.find((o) => o.slug === slug);
}
export async function getExperiences(): Promise<Experience[]> {
  return (await getCms()).experiences;
}
export async function getExperienceBySlug(slug: string): Promise<Experience | undefined> {
  return (await getCms()).experiences.find((x) => x.slug === slug);
}
export async function getReviews(): Promise<Review[]> {
  return (await getCms()).reviews;
}
export async function getPageBySlug(slug: string): Promise<Page | undefined> {
  const pages = (await getCms()).pages;
  return pages.find((p) => p.slug === slug);
}