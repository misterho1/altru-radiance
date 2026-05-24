# Live Google Reviews Widget — Design Spec

**Date:** 2026-05-23
**Branch context:** built on top of `scope-accuracy-review`, merges to `main` once parent branch lands
**Status:** approved, ready for implementation plan

## Problem

The site surfaces hand-curated Google review quotes on seven pages. Several of those quotes contain SCOPE.md-flagged medical-outcome language ("sinuses are clearer," "root causes," "fix problems," "flushed lymphatic fluid out of my body"). Curating those quotes for marketing is a Utah Master Esthetician scope-of-practice exposure: the studio chose which testimonials to feature, so the studio implicitly endorses the claims those testimonials make.

The fix is to render reviews live from Google. The studio no longer curates which reviews appear — Google's ranking does — which transfers editorial distance, even though the studio still publishes the feed.

## Solution overview

1. **Expand the existing `/api/reviews` Cloudflare Pages Function** to support `?include=reviews` query, returning up to 5 Google reviews with rating/count/placeUrl. Cache at the edge for 24h. Trust-bridge callers (rating + count only) continue to use unqueried `/api/reviews` and get the lighter payload.
2. **Add a vanilla-JS widget** (`/assets/js/reviews-widget.js`, ~180 LOC, no dependencies) that finds `[data-altru-reviews]` mounts on the page, fetches the API once, and swaps each mount's children with rendered review nodes in the appropriate shape (carousel / row / testimonial-card / sidebar).
3. **Modify 6 HTML pages** to mark their existing review containers as widget mounts. Hardcoded review HTML stays inside each mount as the fallback shown when the API is unavailable.
4. **Add a `#reviews` section to `policies.html`** as the canonical compliance surface for live-reviews. Beneath each reviews mount, add one small "About these reviews →" link pointing to `/policies#reviews`. One canonical legal-copy location; visitors who want the framing find it in one click.

## Non-goals

- Not touching the before/after image carousel on `index.html` L1569+ (different feature, different problem)
- Not touching `404.html` placeholder reviews (transient page, not worth the change)
- Not censoring/filtering returned reviews — display whatever Google's API returns, pass-through (compliance handled by disclosure instead)
- Not introducing a third-party widget (Elfsight, Trustpilot, etc.) per task constraints
- Not displaying Google's `profile_photo_url` thumbnails (matches current hardcoded-review visual style; avoids CSP changes and tracking-pixel exposure)

## Architecture

```
existing:  Cloudflare Pages Function  ──fetches──▶  Google Places Details API
           /api/reviews                              fields=name,rating,user_ratings_total,
                                                            reviews,url
                                                     language=en
                                                     cached upstream 24h via cf.cacheTtl

new:       /assets/js/reviews-widget.js
           - finds [data-altru-reviews] mounts on page
           - fetches /api/reviews?include=reviews once per page
           - swaps mount children via replaceChildren(...nodes)
           - leaves hardcoded HTML in place on fetch failure

change:    6 HTML pages: add data-altru-reviews attribute to existing
           review container; add <script src="/assets/js/reviews-widget.js"
           defer> once; add "About these reviews →" link beneath each mount.
           1 HTML page: policies.html gets new #reviews section (9).
```

## API contract

**Endpoint:** `GET /api/reviews`

Backward-compatible. The reviews payload is gated by the `include` query param so existing trust-bridge callers stay lightweight:

| Request | Response shape |
|---|---|
| `GET /api/reviews` | `{ rating, total, placeUrl, cachedAt }` |
| `GET /api/reviews?include=reviews` | `{ rating, total, placeUrl, reviews[], cachedAt }` |

**Reviews payload (passed through from Google Places Details):**

```js
reviews: [
  {
    author: "Chelsea McBee",          // r.author_name
    rating: 5,                         // r.rating
    relativeTime: "3 weeks ago",       // r.relative_time_description
    text: "...",                       // r.text
    time: 1731020401                   // r.time (unix epoch)
  },
  // up to 5 entries
]
```

`profile_photo_url` is intentionally NOT exposed (out of scope; would force CSP changes for `lh3.googleusercontent.com`).

**Cache strategy:**

- Edge cache (Cloudflare): `s-maxage=86400` (24h)
- Upstream Places fetch: `cf: { cacheTtl: 86400, cacheEverything: true }` — Places API hit at most once per 24h
- Browser cache: `max-age=3600` (1h)
- Stale-while-revalidate: `stale-while-revalidate=86400` — after 24h, edge serves stale while fetching fresh in background

**Cost:** Places Details with `reviews` field ≈ $0.022/call. One upstream call per 24h cache window ≈ 30 calls/month ≈ ~$0.66/month. Inside Google's $200/month Maps free credit.

**Language pinning:** `&language=en` added to the Places URL to prevent edge-locale heuristics returning non-English reviews.

**API key restrictions:** Server-side fetch from Cloudflare Workers has no HTTP Referrer header. The existing function already calls this endpoint successfully in production, so the configured key restrictions allow the request shape. No change to env vars needed.

**Behavior change to flag:** Today, `/api/reviews` (no query) returns the full reviews array unconditionally. Post-change, it returns only the lightweight payload. Verified the only two callers (trust-bridge on `index.html` L2344 and `restorative-facial.html` L647) do not consume the `reviews` field, so this is safe. No other consumers found.

## Widget render contract

### Mount markup pattern

Each existing review container on each affected page gets a `data-altru-reviews="<shape>"` attribute. No CSS changes, no class renaming. Hardcoded HTML stays inside as the fallback.

```html
<!-- carousel shape (index.html) -->
<div class="reviews-carousel" data-altru-reviews="carousel">
  <div class="reviews-track" id="reviewsTrack">
    <!-- existing 9 hardcoded slides stay here as fallback -->
  </div>
  <div class="reviews-nav">...</div>
  <div class="reviews-footer">...</div>
</div>

<!-- row shape (foundation-package.html, welcome-bundle.html) -->
<div class="reviews-row" data-altru-reviews="row">
  <!-- existing 3 hardcoded review-cards stay here as fallback -->
</div>

<!-- testimonial-card shape (results.html) -->
<div class="testimonial-card" data-altru-reviews="testimonial-card">
  <!-- existing hardcoded testimonial stays here as fallback -->
</div>

<!-- sidebar shape (service pages) -->
<div class="sidebar-block" data-altru-reviews="sidebar">
  <!-- existing hardcoded single quote stays here as fallback -->
</div>
```

### Widget lifecycle

1. On `DOMContentLoaded`, query `document.querySelectorAll('[data-altru-reviews]')`
2. If zero mounts → exit silently (no fetch)
3. Fetch `/api/reviews?include=reviews` ONCE; share result across all mounts
4. On success: for each mount, dispatch to a `render<Shape>(reviews)` function that returns an array of constructed DOM nodes, then call `mount.replaceChildren(...nodes)`
5. On failure: leave all mounts untouched; log `console.warn` once; never throw

### Render functions

All four render functions copy the existing markup from each consuming page verbatim — so visual styling stays identical post-swap. Each function takes the reviews array and returns an array of constructed DOM `Element` nodes (built via `document.createElement` + `textContent` + `appendChild`).

| Shape | Render function | Source of markup template |
|---|---|---|
| `carousel` | `renderCarousel(reviews) → Node[]` | Mirrors `index.html` L1450–1556 (`.reviews-track > .review-slide` × N, `.reviews-nav` with prev/next/dots) |
| `row` | `renderRow(reviews) → Node[]` | Mirrors `foundation-package.html` L1051–1067 (`.review-card` × 3) |
| `testimonial-card` | `renderTestimonialCard(reviews) → Node[]` | Mirrors `results.html` L1452–1457 (first review only; `.review-stars`, `.review-quote`, `.review-author`, `.review-source`) |
| `sidebar` | `renderSidebar(reviews) → Node[]` | Mirrors service-page `.sidebar-review` blocks (first review only; `.sidebar-label`, `.sidebar-stars`, `.sidebar-review`, `.sidebar-review-author`) |

**Star rendering:** `'★'.repeat(rating) + '☆'.repeat(5-rating)` — same heuristic the existing trust-bridge IIFE uses.

**Service tag in testimonial-card:** The current hardcoded version on `results.html` includes a `.review-service-tag` ("Restorative Facial + Buccal Release"). Live Google reviews don't carry service-attribution metadata, so the tag is dropped from the rendered output. The visual block is one element shorter post-swap on this page only.

**Carousel cycling logic:** The existing inline cycler script on `index.html` needs to be either (a) extracted into the widget so it re-binds after the swap, or (b) re-triggered post-swap. Approach (a) — extract into widget. The widget owns prev/next/dots wiring for any carousel-shape mount.

### XSS protection — safe-by-construction

The widget NEVER sets `.innerHTML` from any string that contains user data. The flow is strictly:

1. Build each node with `document.createElement(tagName)`
2. Set text content via `node.textContent = value` (auto-escapes — DOM nodes don't parse HTML)
3. Set attributes via `node.setAttribute(key, value)` or known-safe properties (`node.className`, `node.dataset.x`)
4. Compose with `parent.appendChild(child)`
5. Swap mount contents with `mount.replaceChildren(...rootNodes)`

`replaceChildren` accepts DOM nodes (not strings) so the substitution can never round-trip through an HTML parser. Google review text containing characters like `<`, `>`, `&`, or `<script>` is treated as literal text by the DOM and rendered as escaped entities visually — not interpreted.

## Compliance link

**Principle:** legal-copy DRY. The site already has a canonical compliance surface at `/policies` linked from every page's footer (`.footer-legal-links`), with a Medical Disclaimer section at `#medical`. Instead of repeating compliance text across 4–6 review sections, we:

1. Add ONE new section to `policies.html`: **9. Reviews & Testimonials**
2. Renumber existing sections: Medical Disclaimer 9 → 10, Liability 10 → 11, Contact 11 → 12
3. Beneath each reviews mount (all 6, sidebar included), add ONE small contextual link: *"About these reviews →"* pointing to `/policies#reviews`

This means: ONE place to update if compliance language ever changes; ONE small surface signal per page connecting reviews to the legal context; zero duplicated paragraphs.

### New section copy for `policies.html`

```html
<h2 id="reviews">9. Reviews &amp; <em>Testimonials</em></h2>
<p>Reviews displayed on this site are fetched live from Altru Radiance's Google Business Profile via the Google Places API. They are not curated, selected, or edited &mdash; the most recent and most relevant reviews are surfaced automatically by Google's ranking.</p>
<p>Reviews reflect individual client experiences and are not promises of results. All services at Altru Radiance are aesthetic and wellness services, <strong>not medical treatments</strong>. See <a href="#medical">Medical Disclaimer</a> for the full scope-of-practice context.</p>
```

Insertion point: between Section 8 (Studio Protocols) and the existing Medical Disclaimer section. The TOC sidebar (`policies.html` L241–245) gets one new `<li>` and the three following list items have their numbers bumped.

### Per-mount link

| Page | Mount | Link shown? |
|---|---|---|
| `index.html` | `.reviews-carousel` | yes — beneath `.reviews-footer`, inline-aligned with the Google badge |
| `foundation-package.html` | `.reviews-row` | yes — beneath row |
| `welcome-bundle.html` | `.reviews-row` | yes — beneath row |
| `results.html` | `.testimonial-card` | yes — beneath card |
| `services/restorative-buccal-release.html` | sidebar block | yes — fits in sidebar column (single link, not a paragraph) |
| `services/lymphatic-drainage-murray-utah.html` | sidebar block | yes — fits in sidebar column |

**Markup:**
```html
<p class="reviews-policy-link" style="font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(244,240,230,0.5);text-align:center;margin-top:0.85rem;">
  <a href="/policies#reviews" style="color:inherit;text-decoration:none;border-bottom:1px solid rgba(201,168,76,0.25);padding-bottom:1px;">About these reviews →</a>
</p>
```

Mist-toned, small-caps, single line. Inherits the design system's `.eyebrow` aesthetic (see `policies.html` L53) so it reads as a quiet navigational cue rather than a legal warning. Inline-styled for the same reason as before — single use, no theme drift.

### Why not a paragraph-level disclaimer on every page

Considered and rejected. Repeating the same compliance copy across 4 main-content mounts is (a) visually heavy, (b) creates a stale-duplicate hazard if the language ever needs updating, and (c) implicitly signals weakness in the editorial-distance argument — if live-rendered reviews need a paragraph of legal context every place they appear, then we don't really believe rendering them live changes anything. The canonical-surface + contextual-link pattern is what the site's own footer + policies architecture is already built for.

## Per-page changes

| File | Container | Shape | Policy link | Notes |
|---|---|---|---|---|
| `index.html` | `.reviews-carousel` (L1450) | `carousel` | yes | Hardcoded carousel cycler script is removed; widget owns cycling |
| `foundation-package.html` | `.reviews-row` (L1051) | `row` | yes | 3 hardcoded cards stay as fallback |
| `welcome-bundle.html` | `.reviews-row` (L1066) | `row` | yes | 3 hardcoded cards stay as fallback |
| `results.html` | `.testimonial-card` (L1452) | `testimonial-card` | yes | Service tag dropped post-swap |
| `services/restorative-buccal-release.html` | sidebar block (L532) | `sidebar` | yes | Single quote shown |
| `services/lymphatic-drainage-murray-utah.html` | sidebar block (L531) | `sidebar` | yes | Single quote shown |
| `policies.html` | — | — | — | NEW: section 9 added (Reviews & Testimonials); existing 9–11 renumbered to 10–12 |
| `404.html` | — | — | — | NOT TOUCHED |

**Three additions per affected page (the 6 with mounts):**
1. `data-altru-reviews="<shape>"` attribute on the existing container
2. `<script src="/assets/js/reviews-widget.js" defer></script>` once near `</body>`
3. "About these reviews →" link beneath the container

**Two changes to `policies.html`:**
1. Insert new `<h2 id="reviews">9. Reviews &amp; Testimonials</h2>` section before existing Medical Disclaimer (using copy from "Compliance link" section above)
2. Update TOC sidebar list (L241–245): insert new `<li>` for `#reviews`, renumber existing 9→10, 10→11, 11→12

**Function changes (`functions/api/reviews.js`):**
1. Read `?include=reviews` from `request.url` query; conditionally include `reviews` in response payload
2. Add `&language=en` to the Places API URL
3. Bump cache TTLs: `cf.cacheTtl: 21600 → 86400`, response `s-maxage=21600 → 86400`

**New file:** `/assets/js/reviews-widget.js` (~180 LOC vanilla IIFE)

## Error handling & fallback

Single-layer, non-fatal:

```js
fetch('/api/reviews?include=reviews', { credentials: 'omit' })
  .then(r => r.ok ? r.json() : Promise.reject(r.status))
  .then(data => {
    if (!Array.isArray(data.reviews) || data.reviews.length === 0) throw new Error('empty');
    mounts.forEach(mount => {
      const nodes = renderForShape(mount.dataset.altruReviews, data.reviews);
      mount.replaceChildren(...nodes);
    });
  })
  .catch(err => {
    console.warn('[reviews-widget] live reviews unavailable, hardcoded fallback retained:', err);
    // mounts untouched; existing HTML stays visible
  });
```

Failure modes all collapse to the same handler: network failure, 503 (env vars missing), 502 (Places API error), 200 with empty reviews array, or malformed JSON. The hardcoded HTML inside each mount remains visible. There is no spinner or skeleton state — hardcoded HTML *is* the loading state. No retry; the edge's stale-while-revalidate handles freshness on the next request.

## Testing & verification

No test framework in this repo (static HTML, no Node/Jest). Verification is manual smoke-test.

**Pre-deploy local check:**
1. Open each affected HTML file via `file://` — hardcoded review content renders exactly as before (widget can't reach `/api/reviews` over file://, fallback kicks in)
2. Confirm no console errors in DevTools

**Post-deploy verification:**
1. `curl -s https://altruradiance.com/api/reviews | jq` — confirms 200, returns `{rating, total, placeUrl, cachedAt}` only (no reviews field)
2. `curl -s "https://altruradiance.com/api/reviews?include=reviews" | jq '.reviews | length'` — confirms `5`
3. Open each affected page; DevTools → Network → confirm one `/api/reviews?include=reviews` request returns 200
4. Confirm reviews on page differ from the committed hardcoded fallback (proves the swap happened)
5. Test fallback: temporarily clear `GOOGLE_PLACES_API_KEY` in Cloudflare Pages env → confirm hardcoded reviews still render + console warns
6. Lighthouse Performance ≥90 on `index.html` (widget is ~6KB minified, deferred — should not regress)
7. Verify "About these reviews →" link renders on all 6 mount pages and links to `/policies#reviews`
8. Click the link on any page — confirm `policies.html` loads scrolled to the new Reviews & Testimonials section (anchor scroll works)
9. Verify policies.html TOC sidebar shows updated numbering (1–12, with Reviews as 9)

The task's specific verification requirement — "verify with a real fetch on staging/production that 5 reviews load" — is satisfied by step 2 + step 4 above.

## Out-of-scope follow-ups (not blocking this work)

- A separate compliance sweep of the live Google reviews themselves (different work; not website code). If reviews appearing live still contain scope-flagged claims, Mechelle could respond to those reviews on Google directly — but that's a brand/content task, not engineering.
- A future `/api/reviews/refresh` admin endpoint to manually invalidate the 24h edge cache when needed. Not needed for v1.

## Constraints honored

From the task brief:
- Vanilla JS, no dependencies — yes
- No third-party widget (Elfsight, etc.) — yes
- Small Cloudflare Pages function + vanilla JS — yes
- Cache 24h+ — yes
- Graceful fallback — yes (hardcoded HTML retained as fallback)
- `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACES_PLACE_ID` already configured — yes, unchanged

From repo conventions (`tasks/lessons.md`, `CLAUDE.md`):
- Static HTML + Cloudflare Pages, no build framework — yes
- No fabricated content — yes (reviews come from Google or hardcoded fallback, never invented)
- Don't auto-fix flagged-intentional state — yes (hardcoded fallback retained as a deliberate design decision, not deleted)
- No emojis, no exclamation points, short sentences — yes (applies to copy I author; review quotes themselves pass through as Google provides them)
