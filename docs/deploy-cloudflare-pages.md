# Cloudflare Pages deployment checklist

## Build settings
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** Use the project's default Node version configured in the repository.

## Required environment variables
Set the same variables from `.env.example`:
- `PUBLIC_CONTACT_FORM_ACTION`
- `PUBLIC_CONTACT_FORM_METHOD` (recommended: `POST`)
- `PUBLIC_SITE_URL` (example: `https://atlas-residences.pages.dev`, no trailing slash)

## Configure variables in Cloudflare Pages
1. Open your Cloudflare Pages project.
2. Go to **Settings → Environment variables**.
3. Add all required variables for **Production**.
4. Add the same variables for **Preview**.
5. Save and trigger a new deployment if needed.

## Post-deploy verification
Test these routes after deploy:
- `/en/contact/?source=home`
- `/en/contact/?sent=1`
- `/es/contact/?source=downloads`
