export const ATLAS_BRAND = {
  palette: {
    bg: "#f7f7f4",
    fg: "#171716",
    accent: "#7a6a56",
    muted: "#6f6c67",
    card: "#fefefe",
    border: "#d9d6d0",
  },
  fonts: {
    serif:
      '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, "Times New Roman", Times, serif',
    sans:
      'Inter, "Avenir Next", Avenir, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
} as const;

export function withAlpha(hex: string, alpha: number): string {
  const safe = Math.max(0, Math.min(1, alpha));
  const int = Math.round(safe * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${int}`;
}
