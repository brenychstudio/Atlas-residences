// src/pages/sitemap.xml.ts
import { buildSitemapXml } from "../core/seo/sitemap";
import { getAtlasSitemapEntries } from "../vertical/content/seo";

export async function GET() {
  const xml = buildSitemapXml(getAtlasSitemapEntries());

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
