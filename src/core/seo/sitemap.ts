// src/core/seo/sitemap.ts
export type SitemapEntry = { loc: string; lastmod?: string };

export function esc(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function joinOrigin(origin: string, path: string) {
  return origin.replace(/\/$/, "") + path;
}

export function buildSitemapXml(entries: SitemapEntry[]) {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    entries
      .map((e) => {
        return (
          `<url>` +
          `<loc>${esc(e.loc)}</loc>` +
          (e.lastmod ? `<lastmod>${esc(e.lastmod)}</lastmod>` : ``) +
          `</url>`
        );
      })
      .join("") +
    `</urlset>`
  );
}