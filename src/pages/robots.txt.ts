// src/pages/robots.txt.ts
import { buildRobotsTxt } from "../core/seo/robots";
import { getAtlasRobotsRules, ATLAS_SITE_ORIGIN } from "../vertical/content/seo";

export async function GET() {
  const body = buildRobotsTxt(ATLAS_SITE_ORIGIN, getAtlasRobotsRules(), "/sitemap.xml");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
