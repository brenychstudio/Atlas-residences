export const LANGS = ["en", "es"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(x: string): x is Lang {
  return (LANGS as readonly string[]).includes(x);
}

export function t(lang: Lang, en: string, es: string) {
  return lang === "es" ? es : en;
}
