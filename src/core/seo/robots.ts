// src/core/seo/robots.ts
export type RobotsRuleLine = string;

export function buildRobotsTxt(origin: string, rules: RobotsRuleLine[], sitemapPath = "/sitemap.xml") {
  const base = origin.replace(/\/$/, "");
  const sp = sitemapPath.startsWith("/") ? sitemapPath : `/${sitemapPath}`;

  const body =
    rules.join("\n") +
    `\n\nSitemap: ${base}${sp}\n`;

  return body;
}