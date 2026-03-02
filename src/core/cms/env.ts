// src/core/cms/env.ts
function readEnv(key: string): string | undefined {
  const v =
    // Astro/Vite server-side
    (import.meta as any)?.env?.[key] ??
    // Node runtime
    (process as any)?.env?.[key];

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