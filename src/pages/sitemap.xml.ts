// src/pages/sitemap.xml.ts
import { LANGS } from "../content/languages";
import { buildSitemapXml } from "../core/seo/sitemap";
import { getSitemapEntries } from "../seo/sitemap";

export async function GET({ site }: { site?: URL }) {
  const origin = site?.origin ?? "http://localhost:4321";
  const today = new Date().toISOString().slice(0, 10);

  const entries = await getSitemapEntries({ origin, today, langs: LANGS });

  const xml = buildSitemapXml(entries);

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}