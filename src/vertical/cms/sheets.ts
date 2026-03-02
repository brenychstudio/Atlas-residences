// src/vertical/cms/sheets.ts
import type { Settings, Room, Offer, Experience, Review, Page } from "./types";
import { fetchSheetRows } from "./sheetsFetch";
import { getEnv, isStrictEnv } from "../../core/cms/env";

type CmsData = {
  settings: Settings;
  rooms: Room[];
  offers: Offer[];
  experiences: Experience[];
  reviews: Review[];
  pages: Page[];
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

let warnedMissingEnv = false;
function warnMissingEnvOnce() {
  if (warnedMissingEnv) return;
  warnedMissingEnv = true;
  console.warn("[engine] Missing SHEETS_*_CSV env vars → using demo fallback data (empty lists).");
}

function urlOrDemo(envKey: string): string | undefined {
  const url = getEnv(envKey);
  if (url) return url;

  if (isStrictEnv()) {
    throw new Error(`Missing env var: ${envKey}`);
  }

  warnMissingEnvOnce();
  return undefined;
}

function demoSettings(): Settings {
  // Мінімальний demo-обʼєкт. Якщо ваш Settings має більше required полів — типізація
  // не зламається завдяки cast, а сторінки отримають базові значення.
  return {
    hotel_name_en: "Demo Site",
    hotel_name_es: "Demo Site",
    hero_image: "/brand/og-default.jpg",
  } as unknown as Settings;
}

async function loadCms(): Promise<CmsData> {
  const settingsUrl = urlOrDemo("SHEETS_SETTINGS_CSV");
  const roomsUrl = urlOrDemo("SHEETS_ROOMS_CSV");
  const offersUrl = urlOrDemo("SHEETS_OFFERS_CSV");
  const experiencesUrl = urlOrDemo("SHEETS_EXPERIENCES_CSV");
  const reviewsUrl = urlOrDemo("SHEETS_REVIEWS_CSV");
  const pagesUrl = urlOrDemo("SHEETS_PAGES_CSV");

  const [settingsRows, rooms, offers, experiences, reviews, pages] = await Promise.all([
    settingsUrl ? fetchSheetRows<Settings>(settingsUrl) : Promise.resolve<Settings[]>([]),
    roomsUrl ? fetchSheetRows<Room>(roomsUrl) : Promise.resolve<Room[]>([]),
    offersUrl ? fetchSheetRows<Offer>(offersUrl) : Promise.resolve<Offer[]>([]),
    experiencesUrl ? fetchSheetRows<Experience>(experiencesUrl) : Promise.resolve<Experience[]>([]),
    reviewsUrl ? fetchSheetRows<Review>(reviewsUrl) : Promise.resolve<Review[]>([]),
    pagesUrl ? fetchSheetRows<Page>(pagesUrl) : Promise.resolve<Page[]>([]),
  ]);

  // Settings: у strict режимі — очікуємо рівно 1 рядок, інакше помилка.
  // У demo режимі — беремо перший або demo fallback.
  if (isStrictEnv()) {
    if (settingsRows.length !== 1) {
      throw new Error("settings sheet must contain exactly 1 row.");
    }
  }

  const settings = settingsRows[0] ?? demoSettings();

  return {
    settings,
    rooms: sortByOrder(onlyPublished(rooms)),
    offers: sortByOrder(onlyPublished(offers)),
    experiences: sortByOrder(onlyPublished(experiences)),
    reviews: sortByOrder(onlyPublished(reviews)),
    pages: sortByOrder(onlyPublished(pages)),
  };
}

async function getCms(): Promise<CmsData> {
  if (!cachePromise) cachePromise = loadCms();
  return cachePromise;
}

// Public API (залишаємо стабільним)
export async function getSettings(): Promise<Settings> {
  return (await getCms()).settings;
}

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

export async function getPages(): Promise<Page[]> {
  return (await getCms()).pages;
}

export async function getPageBySlug(slug: string): Promise<Page | undefined> {
  return (await getCms()).pages.find((p) => p.slug === slug);
}