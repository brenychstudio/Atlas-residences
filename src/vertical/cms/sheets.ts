// src/vertical/cms/sheets.ts
import fs from "node:fs";
import path from "node:path";

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

// demo settings must use ATLAS_ASSETS (no new hardcoded /atlas/... in loader logic)
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
  return [...xs].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
}

function sortByNumericKey<T extends Record<string, any>>(xs: T[], key: string): T[] {
  return [...xs].sort((a, b) => Number(a?.[key] ?? 0) - Number(b?.[key] ?? 0));
}

let warnedMissingEnv = false;
function warnMissingEnvOnce() {
  if (warnedMissingEnv) return;
  warnedMissingEnv = true;
  console.warn("[engine] Missing SHEETS_*_CSV env vars -> using demo fallback data (empty lists).");
}

let usedLocalDemoPack = false;
let warnedLocalDemoPack = false;
function warnLocalDemoPackOnce() {
  if (warnedLocalDemoPack) return;
  warnedLocalDemoPack = true;
  console.warn("[engine] Using local demo CSV pack (docs/atlas/demo-csv).");
}

const LOCAL_DEMO_DIR = path.resolve(process.cwd(), "docs/atlas/demo-csv");

const LOCAL_FILES: Record<string, string> = {
  [SHEETS_SETTINGS_CSV]: "settings.csv",
  [SHEETS_BUILDINGS_CSV]: "buildings.csv",
  [SHEETS_UNIT_TYPES_CSV]: "unit_types.csv",
  [SHEETS_UNITS_CSV]: "units.csv",
  [SHEETS_AMENITIES_CSV]: "amenities.csv",
  [SHEETS_POI_CSV]: "poi.csv",
  [SHEETS_DOCUMENTS_CSV]: "documents.csv",
  [SHEETS_PROGRESS_CSV]: "progress.csv",
  [SHEETS_PAGES_CSV]: "pages.csv",
};

function validateStrictRequiredEnv() {
  if (!isStrictEnv()) return;
  const missing = REQUIRED_DEVELOPER_SHEETS.filter((k) => !getEnv(k));
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}

// CSV parser (no deps; supports quoted commas and BOM)
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let buf = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        buf += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(buf);
      buf = "";
      continue;
    }
    buf += ch;
  }
  out.push(buf);
  return out;
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (cols[idx] ?? "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function readLocalCsvRows(localFilename: string): Record<string, string>[] | null {
  const fp = path.join(LOCAL_DEMO_DIR, localFilename);
  if (!fs.existsSync(fp)) return null;
  const txt = fs.readFileSync(fp, "utf8");
  usedLocalDemoPack = true;
  return parseCsv(txt);
}

async function loadTable<T extends Record<string, any>>(envKey: string): Promise<T[]> {
  const url = getEnv(envKey);
  if (url) return fetchSheetRows<T>(url);

  if (isStrictEnv()) {
    throw new Error(`Missing env var: ${envKey}`);
  }

  const localFile = LOCAL_FILES[envKey];
  if (localFile) {
    const rows = readLocalCsvRows(localFile);
    if (rows) return rows as T[];
  }

  // no local pack -> demo empty lists + warning
  warnMissingEnvOnce();
  return [];
}

function demoSettings(): Settings {
  const A = ATLAS_ASSETS as any;

  const hero = A.hr01Morning16x9 ?? A.hero?.hr01Morning16x9 ?? "";
  const og = A.og01Home1200x630 ?? A.og?.og01Home1200x630 ?? hero ?? "";
  const logo = A.mark01_1x1 ?? A.brand?.mark01_1x1 ?? "";

  const brochureCover =
    A.brochureCoverEn4x5 ?? A.downloads?.brochureCoverEn4x5 ?? og;

  const priceListCover =
    A.pricelistCoverEn4x5 ?? A.downloads?.pricelistCoverEn4x5 ?? og;

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
    languages: "en|es",

    brand_bg: "#0b0c0d",
    brand_fg: "#f2f2f2",
    brand_accent: "#9aa3ad",

    logo_url: logo,
    og_image: og,
    hero_image: hero,

    hotel_name_en: "ATLAS RESIDENCES",
    hotel_name_es: "ATLAS RESIDENCES",
  } as Settings;
}

async function loadCms(): Promise<CmsData> {
  validateStrictRequiredEnv();

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
    // legacy optional:
    rooms,
    offers,
    experiences,
    reviews,
  ] = await Promise.all([
    loadTable<Settings>(SHEETS_SETTINGS_CSV),
    loadTable<Building>(SHEETS_BUILDINGS_CSV),
    loadTable<UnitType>(SHEETS_UNIT_TYPES_CSV),
    loadTable<Unit>(SHEETS_UNITS_CSV),
    loadTable<Amenity>(SHEETS_AMENITIES_CSV),
    loadTable<Poi>(SHEETS_POI_CSV),
    loadTable<Document>(SHEETS_DOCUMENTS_CSV),
    loadTable<ProgressEntry>(SHEETS_PROGRESS_CSV),
    loadTable<Page>(SHEETS_PAGES_CSV),

    // legacy: do not warn; do not fail strict
    getEnv(SHEETS_ROOMS_CSV) ? fetchSheetRows<Room>(getEnv(SHEETS_ROOMS_CSV)!) : Promise.resolve([]),
    getEnv(SHEETS_OFFERS_CSV) ? fetchSheetRows<Offer>(getEnv(SHEETS_OFFERS_CSV)!) : Promise.resolve([]),
    getEnv(SHEETS_EXPERIENCES_CSV) ? fetchSheetRows<Experience>(getEnv(SHEETS_EXPERIENCES_CSV)!) : Promise.resolve([]),
    getEnv(SHEETS_REVIEWS_CSV) ? fetchSheetRows<Review>(getEnv(SHEETS_REVIEWS_CSV)!) : Promise.resolve([]),
  ]);

  if (!isStrictEnv() && usedLocalDemoPack) {
    warnLocalDemoPackOnce();
  }

  if (isStrictEnv()) {
    if (settingsRows.length !== 1) throw new Error("settings sheet must contain exactly 1 row.");
  }
  const settings = settingsRows[0] ?? demoSettings();

  return {
    settings,
    buildings: sortByOrder(onlyPublished(buildings)),
    unit_types: sortByOrder(onlyPublished(unit_types)),
    units: sortByNumericKey(units, "sort"),

    amenities: sortByOrder(onlyPublished(amenities)),
    poi: sortByOrder(onlyPublished(poi)),
    documents: sortByOrder(onlyPublished(documents)),
    progress: sortByOrder(onlyPublished(progress)),
    pages: sortByOrder(onlyPublished(pages)),

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

// Developer API
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

// Legacy API (compat)
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
  return (await getCms()).pages.find((p) => p.slug === slug);
}