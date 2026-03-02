// src/vertical/seo/robots.ts
export async function getRobotsRules(): Promise<string[]> {
  return [
    "User-agent: *",
    "Allow: /",
  ];
}