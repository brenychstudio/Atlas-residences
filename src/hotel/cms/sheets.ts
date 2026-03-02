import type { Settings, Room, Offer, Experience, Review, Page } from "./types";
import { fetchSheetRows } from "./sheetsFetch";
import {
  SHEETS_SETTINGS_CSV,
  SHEETS_ROOMS_CSV,
  SHEETS_OFFERS_CSV,
  SHEETS_EXPERIENCES_CSV,
  SHEETS_REVIEWS_CSV,
  SHEETS_PAGES_CSV,
} from "./urls";

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

async function loadCms(): Promise<CmsData> {
  const [settingsRows, rooms, offers, experiences, reviews, pages] = await Promise.all([
    fetchSheetRows<Settings>(SHEETS_SETTINGS_CSV),
    fetchSheetRows<Room>(SHEETS_ROOMS_CSV),
    fetchSheetRows<Offer>(SHEETS_OFFERS_CSV),
    fetchSheetRows<Experience>(SHEETS_EXPERIENCES_CSV),
    fetchSheetRows<Review>(SHEETS_REVIEWS_CSV),
    fetchSheetRows<Page>(SHEETS_PAGES_CSV),
  ]);

  const settings = settingsRows[0];
  if (!settings) throw new Error("settings sheet must contain exactly 1 row.");

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