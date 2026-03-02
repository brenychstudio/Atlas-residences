import Papa from "papaparse";

export function parseCsv<T extends Record<string, any>>(
  csv: string,
  label = "CSV"
): T[] {
  const parsed = Papa.parse<T>(csv, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  if (parsed.errors?.length) {
    throw new Error(`CSV parse error (${label}): ${parsed.errors[0].message}`);
  }

  return (parsed.data || []).filter((row) => {
    const values = Object.values(row ?? {});
    return values.some((v) => String(v ?? "").trim() !== "");
  });
}