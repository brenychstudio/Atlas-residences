// Developer (Atlas) required tables
export const SHEETS_SETTINGS_CSV = "SHEETS_SETTINGS_CSV" as const;
export const SHEETS_BUILDINGS_CSV = "SHEETS_BUILDINGS_CSV" as const;
export const SHEETS_UNIT_TYPES_CSV = "SHEETS_UNIT_TYPES_CSV" as const;
export const SHEETS_UNITS_CSV = "SHEETS_UNITS_CSV" as const;
export const SHEETS_AMENITIES_CSV = "SHEETS_AMENITIES_CSV" as const;
export const SHEETS_POI_CSV = "SHEETS_POI_CSV" as const;
export const SHEETS_DOCUMENTS_CSV = "SHEETS_DOCUMENTS_CSV" as const;
export const SHEETS_PROGRESS_CSV = "SHEETS_PROGRESS_CSV" as const;
export const SHEETS_PAGES_CSV = "SHEETS_PAGES_CSV" as const;

// Legacy hotel keys (optional; kept so old routes can still compile/run)
export const SHEETS_ROOMS_CSV = "SHEETS_ROOMS_CSV" as const;
export const SHEETS_OFFERS_CSV = "SHEETS_OFFERS_CSV" as const;
export const SHEETS_EXPERIENCES_CSV = "SHEETS_EXPERIENCES_CSV" as const;
export const SHEETS_REVIEWS_CSV = "SHEETS_REVIEWS_CSV" as const;

// Strict-mode required keys (Atlas developer vertical)
export const REQUIRED_DEVELOPER_SHEETS = [
  SHEETS_SETTINGS_CSV,
  SHEETS_BUILDINGS_CSV,
  SHEETS_UNIT_TYPES_CSV,
  SHEETS_UNITS_CSV,
  SHEETS_AMENITIES_CSV,
  SHEETS_POI_CSV,
  SHEETS_DOCUMENTS_CSV,
  SHEETS_PROGRESS_CSV,
  SHEETS_PAGES_CSV,
] as const;

export type RequiredDeveloperSheetKey = (typeof REQUIRED_DEVELOPER_SHEETS)[number];