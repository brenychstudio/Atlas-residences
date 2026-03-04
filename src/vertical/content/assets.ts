export const ATLAS_ASSETS = {
  hero: {
    hr01Morning16x9: "/atlas/hero/hr-01-morning-16x9.png",
    hr02Sunset16x9: "/atlas/hero/hr-02-sunset-16x9.png",
    hr03Bluehour16x9: "/atlas/hero/hr-03-bluehour-16x9.png",
    hr04Mobile9x16: "/atlas/hero/hr-04-mobile-9x16.png",
  },
  renders: {
    exterior: {
      ex01Approach3x2: "/atlas/renders/exterior/ex-01-approach-3x2.png",
      ex02Courtyard3x2: "/atlas/renders/exterior/ex-02-courtyard-3x2.png",
      ex03Rooftop16x9: "/atlas/renders/exterior/ex-03-rooftop-16x9.png",
      ex04Balconyview3x2: "/atlas/renders/exterior/ex-04-balconyview-3x2.png",
      ex05Aerial16x9: "/atlas/renders/exterior/ex-05-aerial-16x9.png",
    },
    interior: {
      in01Living3x2: "/atlas/renders/interior/in-01-living-3x2.png",
      in02Kitchen3x2: "/atlas/renders/interior/in-02-kitchen-3x2.png",
      in03Bedroom3x2: "/atlas/renders/interior/in-03-bedroom-3x2.png",
      in04Bathroom3x2: "/atlas/renders/interior/in-04-bathroom-3x2.png",
      in05Lobby16x9: "/atlas/renders/interior/in-05-lobby-16x9.png",
    },
    amenities: {
      am01Gym16x9: "/atlas/renders/amenities/am-01-gym-16x9.png",
      am02Spa16x9: "/atlas/renders/amenities/am-02-spa-16x9.png",
    },
  },
  location: {
    lo01Metro3x2: "/atlas/location/lo-01-metro-3x2.png",
    lo02Park3x2: "/atlas/location/lo-02-park-3x2.png",
    lo03Beach16x9: "/atlas/location/lo-03-beach-16x9.png",
  },
  plans: {
    plT11br1x1: "/atlas/plans/pl-t1-1br-1x1.png",
    plT22brStandard1x1: "/atlas/plans/pl-t2-2br-standard-1x1.png",
    plT32brCorner1x1: "/atlas/plans/pl-t3-2br-corner-1x1.png",
    plT43brFamily1x1: "/atlas/plans/pl-t4-3br-family-1x1.png",
    plT53brPenthouse1x1: "/atlas/plans/pl-t5-3br-penthouse-1x1.png",
    plT64brDuplex1x1: "/atlas/plans/pl-t6-4br-duplex-1x1.png",
  },
  masterplan: {
    mp01Wide16x9: "/atlas/masterplan/mp-01-wide-16x9.png",
    mp02Square1x1: "/atlas/masterplan/mp-02-square-1x1.png",
  },
  icons: {
    ic00Grid1x1: "/atlas/icons/ic-00-grid-1x1.png",
    ic01Wellness1x1: "/atlas/icons/ic-01-wellness-1x1.png",
    ic02Kids1x1: "/atlas/icons/ic-02-kids-1x1.png",
    ic03Parking1x1: "/atlas/icons/ic-03-parking-1x1.png",
    ic04Green1x1: "/atlas/icons/ic-04-green-1x1.png",
    ic05Security1x1: "/atlas/icons/ic-05-security-1x1.png",
  },
  og: {
    og01Home1200x630: "/atlas/og/og-01-home-1200x630.png",
    og02Units1200x630: "/atlas/og/og-02-units-1200x630.png",
  },
  brand: {
    mark011x1: "/atlas/brand/mark-01-1x1.png",
  },
  downloads: {
    brochureCoverEn4x5: "/atlas/downloads/brochure-cover-en-4x5.png",
    pricelistCoverEn4x5: "/atlas/downloads/pricelist-cover-en-4x5.png",
  },
} as const;

export const ATLAS_CRITICAL_ASSET_PATHS: Record<string, string> = {
  heroMorning: ATLAS_ASSETS.hero.hr01Morning16x9,
  heroSunset: ATLAS_ASSETS.hero.hr02Sunset16x9,
  masterplanWide: ATLAS_ASSETS.masterplan.mp01Wide16x9,
  planT1: ATLAS_ASSETS.plans.plT11br1x1,
  planT2: ATLAS_ASSETS.plans.plT22brStandard1x1,
  planT3: ATLAS_ASSETS.plans.plT32brCorner1x1,
  planT4: ATLAS_ASSETS.plans.plT43brFamily1x1,
  planT5: ATLAS_ASSETS.plans.plT53brPenthouse1x1,
  planT6: ATLAS_ASSETS.plans.plT64brDuplex1x1,
  downloadsBrochureCover: ATLAS_ASSETS.downloads.brochureCoverEn4x5,
  downloadsPriceListCover: ATLAS_ASSETS.downloads.pricelistCoverEn4x5,
};

let warnedCriticalAssets = false;
export function warnMissingCriticalAtlasAssetsDevOnly(): void {
  if (warnedCriticalAssets || process.env.NODE_ENV !== "development") return;
  const missing = Object.entries(ATLAS_CRITICAL_ASSET_PATHS)
    .filter(([, assetPath]) => !String(assetPath ?? "").trim())
    .map(([name]) => name);

  if (missing.length > 0) {
    console.warn(`[atlas] Missing critical asset paths: ${missing.join(", ")}`);
  }
  warnedCriticalAssets = true;
}

export type AtlasAssetPath = (typeof ATLAS_ASSETS)[keyof typeof ATLAS_ASSETS];

function normalizeTypeId(typeId?: string): string {
  return String(typeId ?? "").toLowerCase();
}

export function resolvePlanImage(typeId?: string): string {
  const t = normalizeTypeId(typeId);
  if (t.includes("t1")) return "/atlas/plans/pl-t1.png";
  if (t.includes("t2")) return "/atlas/plans/pl-t2.png";
  if (t.includes("t3")) return "/atlas/plans/pl-t3.png";
  if (t.includes("t4")) return "/atlas/plans/pl-t4.png";
  if (t.includes("t5")) return "/atlas/plans/pl-t5.png";
  if (t.includes("t6")) return "/atlas/plans/pl-t6.png";
  return "/atlas/plans/pl-t2.png";
}

export function resolveUnitTypeCover(typeId?: string): string {
  const t = normalizeTypeId(typeId);
  if (t.includes("t1") || t.includes("t2")) return ATLAS_ASSETS.renders.exterior.ex01Approach3x2;
  if (t.includes("t3") || t.includes("t4")) return ATLAS_ASSETS.renders.interior.in01Living3x2;
  if (t.includes("t5") || t.includes("t6")) return ATLAS_ASSETS.renders.amenities.am01Gym16x9;
  return ATLAS_ASSETS.renders.exterior.ex02Courtyard3x2;
}

export function resolveUnitGallery(typeId?: string): string[] {
  const t = normalizeTypeId(typeId);
  if (t.includes("t1") || t.includes("t2")) {
    return [
      ATLAS_ASSETS.renders.exterior.ex01Approach3x2,
      ATLAS_ASSETS.renders.exterior.ex03Rooftop16x9,
      ATLAS_ASSETS.renders.interior.in01Living3x2,
    ];
  }
  if (t.includes("t3") || t.includes("t4")) {
    return [
      ATLAS_ASSETS.renders.interior.in01Living3x2,
      ATLAS_ASSETS.renders.interior.in02Kitchen3x2,
      ATLAS_ASSETS.renders.exterior.ex02Courtyard3x2,
    ];
  }
  if (t.includes("t5") || t.includes("t6")) {
    return [
      ATLAS_ASSETS.renders.exterior.ex03Rooftop16x9,
      ATLAS_ASSETS.renders.amenities.am01Gym16x9,
      ATLAS_ASSETS.renders.interior.in05Lobby16x9,
    ];
  }
  return [
    ATLAS_ASSETS.renders.exterior.ex01Approach3x2,
    ATLAS_ASSETS.renders.interior.in01Living3x2,
    ATLAS_ASSETS.renders.amenities.am01Gym16x9,
  ];
}

export function asset(path: string): string {
  return path;
}

export function maybeWithWebp(pngPath: string): { png: string; webp: string } {
  return {
    png: pngPath,
    webp: pngPath.replace(/\.png$/i, ".webp"),
  };
}
