// src/core/cms/env.ts

type EnvMap = Record<string, string | undefined>;

const viteEnv: EnvMap = {
  ENGINE_MODE: import.meta.env.ENGINE_MODE,
  ENGINE_STRICT_ENV: import.meta.env.ENGINE_STRICT_ENV,

  SHEETS_SETTINGS_CSV: import.meta.env.SHEETS_SETTINGS_CSV,
  SHEETS_BUILDINGS_CSV: import.meta.env.SHEETS_BUILDINGS_CSV,
  SHEETS_UNIT_TYPES_CSV: import.meta.env.SHEETS_UNIT_TYPES_CSV,
  SHEETS_UNITS_CSV: import.meta.env.SHEETS_UNITS_CSV,
  SHEETS_AMENITIES_CSV: import.meta.env.SHEETS_AMENITIES_CSV,
  SHEETS_POI_CSV: import.meta.env.SHEETS_POI_CSV,
  SHEETS_DOCUMENTS_CSV: import.meta.env.SHEETS_DOCUMENTS_CSV,
  SHEETS_PROGRESS_CSV: import.meta.env.SHEETS_PROGRESS_CSV,
  SHEETS_PAGES_CSV: import.meta.env.SHEETS_PAGES_CSV,
};

function readEnv(key: string): string | undefined {
  const viteValue = viteEnv[key];
  const nodeValue = (process as any)?.env?.[key];
  const v = viteValue ?? nodeValue;

  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s.length ? s : undefined;
}

export function getEnv(key: string): string | undefined {
  return readEnv(key);
}

export function isStrictEnv(): boolean {
  const mode = readEnv("ENGINE_MODE");
  const strict = readEnv("ENGINE_STRICT_ENV");
  return mode === "strict" || strict === "1" || strict === "true";
}

// Лишаємо "жорсткий" requireEnv для тих місць, де це справді must-have.
export function requireEnv(key: string): string {
  const v = readEnv(key);
  if (v) return v;
  throw new Error(`Missing env var: ${key}`);
}
