# Altru Radiance

Static marketing site for Altru Radiance — aesthetic wellness studio in Murray, Utah specializing in fascial-driven regenerative beauty treatments.

- Site: https://altruradiance.com
- Studio: 164 E 5900 S, Suite A108, Murray, UT 84107
- Practitioner: Mechelle, Licensed Master Esthetician

## Stack

- Hand-written static HTML / CSS / JS (no build step)
- Cormorant Garamond + Jost via Google Fonts
- Images served from Cloudinary (`res.cloudinary.com/dec9xzaxl`) with `f_auto,q_auto` transforms
- Hosted on Cloudflare Pages, connected to this GitHub repo
- Cloudflare Pages build configuration: no build command, output directory is the repo root

## Repo layout

```
/                       top-level pages (index, about, services, results, journal,
                        membership, book, contact, policies, privacy, 404)
/services/              individual service pages
/journal/               long-form articles (called "Journal", never "blog")
/assets/                logo, studio photos, results photos
/assets/images/         additional imagery referenced from pages
_headers                Cloudflare Pages security + cache headers
_redirects              clean-URL rewrites and legacy slug redirects
sitemap.xml             canonical URL list for search engines
robots.txt              crawl directives
CLAUDE.md               brand voice, design system, content rules for AI assistants
```

## Local preview

```sh
python serve.py
```

Serves the repo root on http://localhost:8000 with `.html` extensions stripped so links behave the same as on Cloudflare Pages.

## Deploy

1. Push to `main` on GitHub
2. Cloudflare Pages auto-builds and deploys to `altruradiance.com`
3. No build command — Pages serves the repo root as-is
4. `_headers` and `_redirects` are applied by Pages at the edge

## Analytics

The site is wired for two analytics layers. One is free and automatic on Cloudflare Pages; the other is optional and needs a beacon token if you want event-level tracking.

### Cloudflare Web Analytics (free, automatic)

Once the repo is connected to Cloudflare Pages, basic site analytics — page views, top pages, referrers, country, device class, and Core Web Vitals — appear automatically in the Pages dashboard under **Analytics → Web Analytics**. No JS snippet needed. This is privacy-respecting (no cookies, no user IDs) and on by default for every `*.pages.dev` project and any custom domain proxied through Cloudflare.

To enable it on the custom `altruradiance.com` domain:

1. Cloudflare dashboard → **Workers & Pages** → select the `altru-radiance` project
2. **Custom domains** tab → add `altruradiance.com` (and `www.altruradiance.com` if desired)
3. Cloudflare prompts you to update DNS — point the apex record to the Pages project
4. Once DNS propagates and SSL provisions, analytics start collecting

### Beacon-based Web Analytics (optional, event-level)

For deeper tracking — outbound link clicks, form submits, custom events, conversion paths — generate a beacon token:

1. Cloudflare dashboard → **Analytics & Logs** → **Web Analytics** → **Add a site** (or select the existing site)
2. Copy the JS snippet Cloudflare provides — it looks like:
   ```html
   <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "abc123..."}'></script>
   ```
3. Paste the snippet before `</body>` on every page (or add it to `base.css`-equivalent shared JS if one exists)

The site already uses a Google Analytics 4 tag (`G-10KW19QN9R`) on journal article pages — if you prefer to consolidate on Cloudflare and remove GA4, search-and-replace the `googletagmanager.com/gtag/js?id=G-10KW19QN9R` snippet across the codebase.

### What to watch

- **Booking conversion** — track Square iframe loads or, better, click-through on `/book` from the homepage. The `services.html` page's "Book Now" CTAs target Square directly and are the highest-intent click on the site.
- **Journal engagement** — time on page for the four indexed articles. If average reading time is under 30 seconds, the headline isn't matching reader intent.
- **Mobile vs desktop split** — Murray UT is a mostly-driving market; expect 60–70% mobile.
- **Top referrers** — once Google Business Profile is dialed in, GBP profile clicks should be the #1 referrer.

## Live Google Business Profile reviews

The homepage trust-bridge (right below the hero) is wired to pull a **live rating + review count** from Mechelle's Google Business Profile. The endpoint lives at `/api/reviews` and is implemented as a Cloudflare Pages Function at `functions/api/reviews.js`. While not configured, the trust-bridge shows hardcoded baseline values (5.0 stars / 54 reviews) — no broken state.

To turn on live data:

### 1. Get a Google Maps API key
1. Open [Google Cloud Console → Maps APIs](https://console.cloud.google.com/google/maps-apis/)
2. Create a project (or use an existing one) named e.g. "Altru Radiance Website"
3. Under **APIs & Services → Library**, enable the **Places API**
4. Under **APIs & Services → Credentials**, click **Create credentials → API key**
5. Restrict the key:
   - **Application restrictions:** HTTP referrers
   - **Allowed referrers:** `https://altruradiance.com/*`, `https://*.altruradiance.com/*`, `https://altru-radiance.pages.dev/*`
   - **API restrictions:** Restrict to Places API only
6. Copy the key

### 2. Find Altru Radiance's Place ID
1. Open the [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. In the search box, type **"Altru Radiance Murray Utah"**
3. Click the studio's marker on the map
4. Copy the Place ID (looks like `ChIJ...`)

### 3. Set environment variables in Cloudflare Pages
1. **Cloudflare Dashboard → Workers & Pages → altru-radiance project**
2. **Settings → Environment variables → Production**
3. Add two variables:
   - `GOOGLE_PLACES_API_KEY` = the key from step 1
   - `GOOGLE_PLACES_PLACE_ID` = the Place ID from step 2
4. Click **Save and deploy** (Cloudflare auto-redeploys)

### 4. Verify it's working
- Hit `https://altruradiance.com/api/reviews` directly in a browser
- A 200 response with `{ "rating": 5.0, "total": 54, "reviews": [...] }` means live data is flowing
- A 503 with `{ "error": "not_configured" }` means env vars aren't set yet
- The homepage trust-bridge will auto-update on next page load (cached at edge for 6 hours)

### Cost
Places API: free up to **$200/month** of usage (Google's standard free tier). A single Place Details call with the field mask we use costs roughly $0.017. The endpoint is cached 6 hours, so even with thousands of homepage visits you'll see ~120 API calls/month = under $3, comfortably free.

### Privacy / TOS
Per Google's TOS, you must display Google attribution when showing review data — we do this via the "Google · X Reviews" label on the trust-bridge, which is required. Reviewer names and photos are also part of the required attribution if you display individual reviews (we don't currently, just the aggregate rating).

## Brand and content rules

See `CLAUDE.md` for the full voice guide, design tokens, and content conventions. Key constraints:

- "Journal" not "blog" in all copy
- No injectables claims — Altru Radiance does not offer Botox or fillers
- Anatomical language with explanations, not wellness buzzwords
- No promises of permanent results — frame all outcomes as cumulative

## URL conventions

Internal links and the sitemap use clean URLs without `.html` (e.g. `/services/restorative-buccal-massage`). The `_redirects` file maps these to the underlying `.html` files and 301-redirects any `.html` access to the clean form.
