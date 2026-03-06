# Production deploy + smoke checklist

## 1) Cloudflare Pages configuration
- Production branch is `main`.
- Build command is `npm run build`.
- Build output directory is `dist`.

## 2) Environment variables (Production + Preview)
Set the same values in both environments:
- `PUBLIC_CONTACT_FORM_ACTION=...`
- `PUBLIC_CONTACT_FORM_METHOD=POST`
- `PUBLIC_SITE_URL=https://<your-domain-or-pages-url>`

## 3) Automated smoke script
Run after deploy:
```bash
node scripts/smoke-prod.mjs https://<site-origin>
```

## 4) Manual visual + contact sanity
Check these routes:
- `/en/`
- `/en/masterplan/`
- `/en/units/`
- `/en/location/`
- `/en/downloads/`
- `/en/contact/`
- `/en/contact/?sent=1`
- `/en/contact/?error=1`
- `/es/`
- `/es/masterplan/`
- `/es/units/`
- `/es/location/`
- `/es/downloads/`
- `/es/contact/`

## 5) Contact form verification notes
- Smoke script validates contact form action/method, hidden lead fields, attribution fields, analytics markers, and OG metadata.
- If action contains `formspree.io`, it must also validate `_subject`, `_next`, and `_gotcha`.
- If action is not Formspree, those helper fields are intentionally not required.
