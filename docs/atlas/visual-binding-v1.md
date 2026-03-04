# Atlas visual binding v1

This project uses convention-based local visual fallbacks under `public/atlas/**`.

## Required v1 filenames

### Hero
- `public/atlas/hero/hr-01-morning-16x9.png`
- `public/atlas/hero/hr-02-sunset-16x9.png`
- `public/atlas/hero/hr-03-bluehour-16x9.png`
- `public/atlas/hero/hr-04-mobile-9x16.png`

### Masterplan
- `public/atlas/masterplan/mp-01-wide-16x9.png`
- `public/atlas/masterplan/mp-02-square-1x1.png`

### OG
- `public/atlas/og/og-01-home-1200x630.png`
- `public/atlas/og/og-02-units-1200x630.png`

### Plans (unit fallback map)
- `public/atlas/plans/pl-t1.png`
- `public/atlas/plans/pl-t2.png`
- `public/atlas/plans/pl-t3.png`
- `public/atlas/plans/pl-t4.png`
- `public/atlas/plans/pl-t5.png`
- `public/atlas/plans/pl-t6.png`

### Icons
- `public/atlas/icons/ic-00-grid-1x1.png`
- `public/atlas/icons/ic-01-wellness-1x1.png`
- `public/atlas/icons/ic-02-kids-1x1.png`
- `public/atlas/icons/ic-03-parking-1x1.png`
- `public/atlas/icons/ic-04-green-1x1.png`
- `public/atlas/icons/ic-05-security-1x1.png`

### Downloads covers
- `public/atlas/downloads/brochure-cover-en-4x5.png`
- `public/atlas/downloads/pricelist-cover-en-4x5.png`

### Brand
- `public/atlas/brand/mark-01-1x1.png`

## Notes
- `resolvePlanImage(typeId)` maps type IDs to `/atlas/plans/pl-t{1..6}.png`.
- `resolveUnitTypeCover(typeId)` and `resolveUnitGallery(typeId)` provide fallback visuals if CSV/CMS image fields are empty.
- Fallbacks are applied in CMS normalization (`sheets.ts`) so routes receive non-empty image paths in demo mode.
