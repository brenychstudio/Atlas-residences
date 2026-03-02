// src/vertical/cms/sheetsFetch.ts
import { fetchCsv } from "../../core/cms/fetchCsv";
import { parseCsv } from "../../core/cms/parseCsv";
import { getEnv } from "../../core/cms/env";

let warnedMissingEnv = false;
function warnMissingEnvOnce(key: string) {
  if (warnedMissingEnv) return;
  warnedMissingEnv = true;
  console.warn(`[engine] Missing env var: ${key} → using empty fallback rows (demo mode).`);
}

function isStrictEnv(): boolean {
  const mode = getEnv("ENGINE_MODE");
  const strict = getEnv("ENGINE_STRICT_ENV");
  return mode === "strict" || strict === "1" || strict === "true";
}

function looksLikeUrl(s: string) {
  return /^https?:\/\//i.test(s);
}

/**
 * Unified CSV ingestion:
 * - accepts either a direct CSV url OR an env key name (e.g. "SHEETS_SETTINGS_CSV")
 * - demo mode: missing env => []
 * - strict mode: missing env => throws
 */
export async function fetchSheetRows<T extends Record<string, any>>(
  urlOrEnvKey: string,
  label?: string
): Promise<T[]> {
  const src = String(urlOrEnvKey ?? "").trim();
  if (!src) {
    if (isStrictEnv()) throw new Error("fetchSheetRows: missing url/env key argument");
    return [];
  }

  // Resolve env key → url (if not already url)
  const url = looksLikeUrl(src) ? src : getEnv(src);

  if (!url) {
    if (isStrictEnv()) throw new Error(`Missing env var: ${src}`);
    warnMissingEnvOnce(src);
    return [];
  }

  // Fetch + parse via core
  const csvText = await fetchCsv(url);
  const normalized = csvText.replace(/^\uFEFF/, ""); // drop BOM if present

  const rows = parseCsv<T>(normalized, label ?? src);
  return rows;
}