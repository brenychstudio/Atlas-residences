# Cloudflare Pages deployment checklist

## Build settings
- **Production branch:** `main`
- **Build command:** `npm run build`
- **Output directory:** `dist`

## Required environment variables
Set these in both **Production** and **Preview**:
- `PUBLIC_CONTACT_FORM_ACTION`
- `PUBLIC_CONTACT_FORM_METHOD=POST`
- `PUBLIC_SITE_URL=https://<your-domain-or-pages-url>` (no trailing slash)

## Deploy steps
1. Open Cloudflare Pages → project settings.
2. Confirm branch/build settings above.
3. Add the required environment variables in both environments.
4. Trigger a production deployment from `main`.

## Post-deploy checks
1. Run: `node scripts/smoke-prod.mjs https://<site-origin>`
2. Manually verify:
   - `/en/contact/?source=home`
   - `/en/contact/?sent=1`
   - `/en/contact/?error=1`
   - `/es/contact/?source=downloads`
