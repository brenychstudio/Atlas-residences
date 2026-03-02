// src/pages/robots.txt.ts
import { buildRobotsTxt } from "../core/seo/robots";
import { getRobotsRules } from "../seo/robots";

export async function GET({ site }: { site?: URL }) {
  const origin = site?.origin ?? "http://localhost:4321";
  const rules = await getRobotsRules();

  const body = buildRobotsTxt(origin, rules, "/sitemap.xml");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}