# Atlas Demo CSV Pack

This folder contains a complete local demo dataset for the Developer vertical.

## Files / tabs
Create one Google Sheet tab per file name:
- settings
- buildings
- unit_types
- units
- amenities
- poi
- documents
- pages
- progress

## Import into Google Sheets
1. Create a new spreadsheet.
2. For each CSV in this folder, create a tab with the same name.
3. Use File → Import → Upload and import each CSV into its matching tab.
4. Publish each tab as CSV, then copy each URL into env vars.

## Required env keys
- SHEETS_SETTINGS_CSV
- SHEETS_BUILDINGS_CSV
- SHEETS_UNIT_TYPES_CSV
- SHEETS_UNITS_CSV
- SHEETS_AMENITIES_CSV
- SHEETS_POI_CSV
- SHEETS_DOCUMENTS_CSV
- SHEETS_PROGRESS_CSV
- SHEETS_PAGES_CSV

## Demo vs strict behavior
- Demo mode (default): if env URLs are missing, local CSV files from docs/atlas/demo-csv are auto-loaded.
- Strict mode (ENGINE_MODE=strict): all required SHEETS_*_CSV env vars must be present; local demo CSV is ignored.
