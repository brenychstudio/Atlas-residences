# Sigma-Core Engine (Astro)

## Purpose
Sigma-Core = universal Astro engine (`src/core/*`) + vertical adapters (hotel/dental/residential/creators/engineering) without duplicating foundation.

## Current vertical
- Hotel vertical: `src/hotel/*`
- Compatibility layer: `src/cms/*` (re-exports to the active vertical for minimal page diffs)

## Quick start
```bash
npm i
npm run dev