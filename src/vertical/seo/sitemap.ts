// src/vertical/seo/sitemap.ts
import type { SitemapEntry } from "../../core/seo/sitemap";
import { joinOrigin } from "../../core/seo/sitemap";
import { getRooms, getOffers, getExperiences } from "../cms/sheets";

export type SitemapContext = {
  origin: string;
  today: string;
  langs: readonly string[];
};

export async function getSitemapEntries(ctx: SitemapContext): Promise<SitemapEntry[]> {
  const { origin, today, langs } = ctx;

  const [rooms, offers, exps] = await Promise.all([getRooms(), getOffers(), getExperiences()]);

  // vertical-specific static pages (hotel demo)
  const staticPaths = ["", "rooms", "offers", "experiences", "contact", "location"];

  const entries: SitemapEntry[] = [];

  for (const lang of langs) {
    for (const p of staticPaths) {
      const path = p === "" ? `/${lang}/` : `/${lang}/${p}/`;
      entries.push({ loc: joinOrigin(origin, path), lastmod: today });
    }

    for (const r of rooms) {
      entries.push({
        loc: joinOrigin(origin, `/${lang}/rooms/${r.slug}/`),
        lastmod: (r as any).updated_at || today,
      });
    }

    for (const o of offers) {
      entries.push({
        loc: joinOrigin(origin, `/${lang}/offers/${o.slug}/`),
        lastmod: (o as any).updated_at || today,
      });
    }

    for (const x of exps) {
      entries.push({
        loc: joinOrigin(origin, `/${lang}/experiences/${x.slug}/`),
        lastmod: (x as any).updated_at || today,
      });
    }
  }

  return entries;
}