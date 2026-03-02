# Hotel Vertical (Sigma-Core)

## Pages (EN/ES)
- `/<lang>/` — Home
- `/<lang>/rooms/` + `/<lang>/rooms/<slug>/`
- `/<lang>/offers/` + `/<lang>/offers/<slug>/`
- `/<lang>/experiences/` + `/<lang>/experiences/<slug>/`
- `/<lang>/contact/`
- `/<lang>/location/`

## Content source
Google Sheets CMS via CSV (“Publish to web → CSV”).

## Media paths convention
Store paths in Sheets without `public/`, example:
- `/hotels/<hotelSlug>/rooms/r01/cover.png`

Physical files:
- `public/hotels/<hotelSlug>/...`

## Publish-to-web checklist
- File → Share/Publish to web
- Choose sheet → CSV
- Ensure the link is accessible (no auth), otherwise you get 401/HTML.

## Build expectations
`npm run build` generates static routes for:
- languages `en/es`
- all slugs for rooms/offers/experiences
- sitemap + robots endpoints