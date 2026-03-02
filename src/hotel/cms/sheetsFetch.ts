// src/hotel/cms/sheetsFetch.ts
type Row = Record<string, string>;

function requireEnv(name: string): string {
  const v =
    (import.meta as any).env?.[name] ??
    (typeof process !== "undefined" ? (process as any).env?.[name] : undefined);

  const s = typeof v === "string" ? v.trim() : "";
  if (!s) throw new Error(`Missing env var: ${name}`);
  return s;
}

async function fetchCsvText(url: string): Promise<string> {
  const res = await fetch(url, { cache: "no-store" as RequestCache });

  if (!res.ok) {
    throw new Error(`CSV fetch failed: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();

  // Якщо не "Publish to web" або є редірект на HTML — Google повертає HTML, не CSV
  const t = text.trim();
  if (t.startsWith("<!DOCTYPE html") || t.startsWith("<html") || t.includes("<html")) {
    throw new Error("Got HTML instead of CSV. Check: Publish to web → CSV.");
  }

  return text;
}

/**
 * Невеликий CSV parser (підтримує лапки/коми/переноси рядків)
 */
function parseCsv(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  // remove BOM
  const s = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    if (inQuotes) {
      if (c === '"') {
        // escaped quote
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      continue;
    }

    if (c === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (c === "\n") {
      row.push(field);
      field = "";
      // drop empty trailing rows
      const isEmpty = row.every((x) => !String(x ?? "").trim());
      if (!isEmpty) out.push(row);
      row = [];
      continue;
    }

    if (c === "\r") continue;

    field += c;
  }

  // last field
  row.push(field);
  const isEmpty = row.every((x) => !String(x ?? "").trim());
  if (!isEmpty) out.push(row);

  return out;
}

function toRows(table: string[][]): Row[] {
  if (!table.length) return [];
  const header = table[0].map((h) => (h ?? "").trim());
  const rows = table.slice(1);

  const out: Row[] = [];
  for (const r of rows) {
    const obj: Row = {};
    for (let i = 0; i < header.length; i++) {
      const key = header[i];
      if (!key) continue;
      obj[key] = String(r[i] ?? "").trim();
    }
    // skip totally empty objects
    const hasAny = Object.values(obj).some((v) => v.trim() !== "");
    if (hasAny) out.push(obj);
  }
  return out;
}

// ✅ Цю функцію очікує src/hotel/cms/sheets.ts
export async function fetchSheetRows<T extends Record<string, any>>(envName: string): Promise<T[]> {
  const url = requireEnv(envName);
  const text = await fetchCsvText(url);
  const table = parseCsv(text);
  return toRows(table) as unknown as T[];
}