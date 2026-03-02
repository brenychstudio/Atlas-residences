export async function fetchCsv(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status} ${res.statusText}`);
  const text = await res.text();

  // Якщо не опубліковано — Google може повернути HTML
  if (text.trim().startsWith("<!DOCTYPE html") || text.includes("<html")) {
    throw new Error("Got HTML instead of CSV. Check: Publish to web → CSV.");
  }

  return text;
}