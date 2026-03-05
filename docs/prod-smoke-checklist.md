# Production deploy + smoke checklist

## A) Cloudflare Pages settings
1. Set **Production branch** to `main`.
2. Set **Build command** to `npm run build`.
3. Set **Build output directory** to `dist`.

## B) Environment variables (Production + Preview)
Configure these variables in both environments:
- `PUBLIC_SITE_URL=https://<your-domain-or-pages-url>` (no trailing slash)
- `PUBLIC_CONTACT_FORM_ACTION=...`
- `PUBLIC_CONTACT_FORM_METHOD=POST`

## C) After deploy
1. Run the smoke script:
   ```bash
   node scripts/smoke-prod.mjs https://<site-origin>
   ```
2. Run a quick manual 2-minute check:
   - `/en/`
   - `/en/units/`
   - `/en/masterplan/`
   - `/en/downloads/`
   - `/en/contact/?source=home`

## D) Form provider verification notes
- The smoke script is provider-agnostic and verifies the contact form wiring + hidden lead and attribution fields.
- If the rendered form action includes `formspree.io`, the script additionally checks for Formspree helper fields: `_subject`, `_next`, and `_gotcha`.
- If the form action is not Formspree, those fields are intentionally skipped.
