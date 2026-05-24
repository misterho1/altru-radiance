# Live Google Reviews Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded Google review quotes on six pages with a live, vanilla-JS widget backed by a 24h-cached Cloudflare Pages Function. Compliance handled via a single new section in `policies.html` and a per-mount contextual link.

**Architecture:** One JS file (`/assets/js/reviews-widget.js`) finds `[data-altru-reviews]` mounts, fetches `/api/reviews?include=reviews` once per page, and replaces each mount's contents with rendered review nodes using XSS-safe DOM construction. On any failure, hardcoded fallback HTML inside each mount remains visible. The existing `/api/reviews` Pages Function is extended to gate the reviews payload behind `?include=reviews` and bump cache to 24h.

**Tech Stack:** Cloudflare Pages, Cloudflare Pages Functions (JS), vanilla browser JS (no build step, no node_modules), Google Places Details API.

**Repo conventions to honor (per `tasks/lessons.md` + `CLAUDE.md`):**
- Static HTML only, no build framework
- Atomic git commits per logical change
- No fabricated content (real Google reviews or hardcoded fallback only)
- Don't introduce test frameworks — verification is manual smoke-test (matches existing repo pattern)

**Branch:** `scope-accuracy-review` (current). All commits land here. Do NOT push until Task 10 verification passes.

**Spec reference:** `docs/superpowers/specs/2026-05-23-google-reviews-widget-design.md`

---

## File structure

**Create:**
- `assets/js/reviews-widget.js` — widget module (one IIFE, ~150 LOC)

**Modify:**
- `functions/api/reviews.js` — gate `reviews` field, add `language=en`, bump cache TTL
- `policies.html` — insert section 9 (Reviews & Testimonials), renumber existing 9–12 to 10–13, fix missing Membership TOC entry
- `index.html` — mark `.reviews-carousel` as mount, remove old cycler script, add widget script tag + policy link
- `foundation-package.html` — mark `.reviews-row` as mount, add widget script + policy link
- `welcome-bundle.html` — mark `.reviews-row` as mount, add widget script + policy link
- `results.html` — mark `.testimonial-card` as mount, add widget script + policy link
- `services/restorative-buccal-release.html` — mark sidebar block as mount, add widget script + policy link
- `services/lymphatic-drainage-murray-utah.html` — mark sidebar block as mount, add widget script + policy link

**No tests created** — repo has no test framework and the spec explicitly chose manual smoke-test as the verification approach. Each task includes a concrete verification step instead.

---

## Task 1: Extend `/api/reviews` Cloudflare Pages Function

**Files:**
- Modify: `functions/api/reviews.js` (full file)

**Goal:** Make the `reviews` array gated behind `?include=reviews`. Add `language=en` to the Places URL. Bump cache to 24h.

- [ ] **Step 1: Define what success looks like (verification preview)**

Post-deploy, these two commands must produce these results:

```bash
curl -s https://altruradiance.com/api/reviews | jq 'keys'
# Expected: ["cachedAt", "placeUrl", "rating", "total"]   (no "reviews" key)

curl -s "https://altruradiance.com/api/reviews?include=reviews" | jq '.reviews | length'
# Expected: 5
```

Both responses must return HTTP 200. The `Cache-Control` header on both must include `s-maxage=86400`.

- [ ] **Step 2: Apply the function changes**

Replace the entire contents of `functions/api/reviews.js` with the version below. Key diffs from current:
- Parse `?include=reviews` from `request.url`; conditionally include `reviews` in response
- Add `&language=en` to the Places API URL
- Bump `cf.cacheTtl` from `21600` to `86400`
- Bump response `Cache-Control` `s-maxage` from `21600` to `86400`

```js
// ============================================================
// Cloudflare Pages Function — /api/reviews
//
// Proxies Google Places API to fetch live rating + review count
// (and optionally up to 5 review bodies) for Altru Radiance's
// Google Business Profile. Cached at Cloudflare's edge for 24h.
//
// Endpoints:
//   GET /api/reviews                  -> {rating, total, placeUrl, cachedAt}
//   GET /api/reviews?include=reviews  -> + {reviews[]}
//
// Reads two env vars (Cloudflare Pages → Settings → Environment variables):
//   GOOGLE_PLACES_API_KEY
//   GOOGLE_PLACES_PLACE_ID
//
// If either is missing, returns 503; client falls back to hardcoded HTML.
// ============================================================

export async function onRequestGet({ env, request }) {
  const apiKey = env.GOOGLE_PLACES_API_KEY;
  const placeId = env.GOOGLE_PLACES_PLACE_ID;

  if (!apiKey || !placeId) {
    return new Response(
      JSON.stringify({ error: "not_configured", message: "Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACES_PLACE_ID in Pages env vars." }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60",
        },
      },
    );
  }

  // Read ?include=reviews to decide whether the response payload includes
  // the reviews array. Trust-bridge callers (rating + count only) skip
  // this and get the lighter payload.
  const url = new URL(request.url);
  const includeReviews = url.searchParams.get("include") === "reviews";

  const fields = "name,rating,user_ratings_total,reviews,url";
  const apiUrl =
    "https://maps.googleapis.com/maps/api/place/details/json" +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&fields=${encodeURIComponent(fields)}` +
    `&language=en` +
    `&key=${encodeURIComponent(apiKey)}`;

  try {
    const resp = await fetch(apiUrl, {
      // Cache upstream Places fetch for 24h. Worst case: ~30 calls/month.
      cf: { cacheTtl: 86400, cacheEverything: true },
    });

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "upstream_error", status: resp.status }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    const data = await resp.json();

    if (data.status !== "OK") {
      return new Response(
        JSON.stringify({ error: "places_api_status", status: data.status, message: data.error_message || null }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    const result = data.result || {};
    const payload = {
      rating: result.rating ?? null,
      total: result.user_ratings_total ?? null,
      placeUrl: result.url ?? null,
      cachedAt: new Date().toISOString(),
    };

    if (includeReviews) {
      payload.reviews = (result.reviews || []).slice(0, 5).map((r) => ({
        author: r.author_name,
        rating: r.rating,
        relativeTime: r.relative_time_description,
        text: r.text,
        time: r.time,
      }));
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Browser cache 1h; edge cache 24h; stale-while-revalidate 24h.
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "fetch_failed", message: String(err) }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
}
```

- [ ] **Step 3: Run a local syntax check**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
node -e "require('fs').readFileSync('functions/api/reviews.js','utf8'); console.log('OK')"
```

Expected: prints `OK`. (This only validates the file exists and is readable — Node won't run the worker, but a syntax error in the export statement would have shown up in a real deploy; the verification gate is the Cloudflare preview deploy in Task 10.)

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
git add functions/api/reviews.js
git commit -m "api/reviews: gate reviews behind ?include=reviews, add language=en, 24h cache

Backward-compatible change. Trust-bridge callers on index.html and
restorative-facial.html continue to use unqueried /api/reviews and now
get a lighter payload (no reviews array). The new widget will call
?include=reviews to get the full payload with up to 5 reviews.

Also: pin Places API to language=en, bump edge cache TTL 6h -> 24h."
```

---

## Task 2: Create the reviews widget

**Files:**
- Create: `assets/js/reviews-widget.js`

**Goal:** A single vanilla-JS IIFE that finds `[data-altru-reviews]` mounts, fetches `/api/reviews?include=reviews` once, and replaces each mount's children via `replaceChildren(...nodes)` using XSS-safe DOM construction.

- [ ] **Step 1: Define what success looks like**

After this task ships, opening a page with a `[data-altru-reviews="<shape>"]` mount in a browser produces:
- One `GET /api/reviews?include=reviews` request in the Network panel
- The mount's hardcoded HTML children replaced by widget-rendered nodes
- No JS errors in the console
- If the API is down/blocked: console.warn message, mount untouched, hardcoded fallback visible

- [ ] **Step 2: Create `assets/js/reviews-widget.js` with this content**

```js
/* ============================================================
   reviews-widget.js — Live Google Reviews mount system

   Finds [data-altru-reviews] elements on the page, fetches
   /api/reviews?include=reviews once, then replaces each mount's
   children with rendered review nodes in the appropriate shape.

   On ANY failure (network, 5xx, malformed JSON, empty reviews),
   mounts remain untouched and existing hardcoded HTML stays
   visible as the fallback. No spinner / skeleton — hardcoded
   HTML IS the loading state.

   Shapes (set via data-altru-reviews attribute):
     carousel         - .reviews-carousel (cycling slides, prev/next/dots)
     row              - .reviews-row (3-card grid)
     testimonial-card - .testimonial-card (single card)
     sidebar          - service-page sidebar block (single quote)

   XSS-safe: nodes are built via document.createElement +
   textContent; mount contents are swapped via replaceChildren
   (which accepts DOM nodes, not strings — no HTML parser round-trip).
   ============================================================ */
(function () {
  'use strict';

  // ---- Init / fetch ----

  function init() {
    var mounts = document.querySelectorAll('[data-altru-reviews]');
    if (mounts.length === 0) return;

    fetch('/api/reviews?include=reviews', { credentials: 'omit' })
      .then(function (r) {
        if (!r.ok) return Promise.reject('http_' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (!data || !Array.isArray(data.reviews) || data.reviews.length === 0) {
          return Promise.reject('empty');
        }
        Array.prototype.forEach.call(mounts, function (mount) {
          try {
            render(mount, data.reviews);
          } catch (renderErr) {
            console.warn('[reviews-widget] render failed for', mount, renderErr);
          }
        });
      })
      .catch(function (err) {
        console.warn('[reviews-widget] live reviews unavailable, hardcoded fallback retained:', err);
      });
  }

  function render(mount, reviews) {
    var shape = mount.getAttribute('data-altru-reviews');
    switch (shape) {
      case 'carousel':
        renderCarousel(mount, reviews);
        wireCarousel(mount);
        break;
      case 'row':
        replaceChildrenWith(mount, renderRow(reviews));
        break;
      case 'testimonial-card':
        replaceChildrenWith(mount, renderTestimonialCard(reviews));
        break;
      case 'sidebar':
        replaceChildrenWith(mount, renderSidebar(reviews));
        break;
      default:
        console.warn('[reviews-widget] unknown shape:', shape);
    }
  }

  // ---- DOM helpers ----

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function replaceChildrenWith(parent, nodes) {
    // Cross-browser equivalent: clear then append. replaceChildren is
    // baseline 2020+ but we use the loop form for max safety.
    while (parent.firstChild) parent.removeChild(parent.firstChild);
    for (var i = 0; i < nodes.length; i++) parent.appendChild(nodes[i]);
  }

  function stars(rating) {
    var r = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  // ---- Carousel shape (index.html .reviews-carousel) ----
  //
  // The carousel mount preserves its existing .reviews-nav and
  // .reviews-footer (the Google badge + policy link). The widget
  // only replaces children of the .reviews-track inside it, then
  // rebuilds the .reviews-dots inside the existing .reviews-nav
  // and re-wires prev/next/dots handlers.

  function renderCarousel(mount, reviews) {
    var track = mount.querySelector('.reviews-track');
    if (!track) return;
    var slides = reviews.map(function (rev, i) {
      var slide = el('div', i === 0 ? 'review-slide active' : 'review-slide');
      slide.setAttribute('data-index', String(i));
      slide.appendChild(el('div', 'review-stars', stars(rev.rating)));
      slide.appendChild(el('p', 'review-text', rev.text));
      var author = el('div', 'review-author');
      var line = el('div', 'review-author-line');
      line.appendChild(el('span', 'review-name', rev.author));
      line.appendChild(el('span', 'review-detail', 'Google Review · ' + (rev.relativeTime || '')));
      author.appendChild(line);
      slide.appendChild(author);
      return slide;
    });
    replaceChildrenWith(track, slides);
  }

  function wireCarousel(mount) {
    var slides = mount.querySelectorAll('.review-slide');
    var dotsContainer = mount.querySelector('#reviewDots');
    var prevBtn = mount.querySelector('#reviewPrev');
    var nextBtn = mount.querySelector('#reviewNext');
    if (!slides.length || !dotsContainer || !prevBtn || !nextBtn) return;

    // Build dots fresh (one per slide)
    var dots = [];
    while (dotsContainer.firstChild) dotsContainer.removeChild(dotsContainer.firstChild);
    for (var i = 0; i < slides.length; i++) {
      (function (idx) {
        var dot = el('button', idx === 0 ? 'review-dot active' : 'review-dot');
        dot.setAttribute('aria-label', 'Go to review ' + (idx + 1));
        dot.addEventListener('click', function () { showSlide(idx); });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      })(i);
    }

    var current = 0;
    function showSlide(i) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    prevBtn.addEventListener('click', function () { showSlide(current - 1); });
    nextBtn.addEventListener('click', function () { showSlide(current + 1); });

    // Auto-rotate every 7s, pause on hover. Honor prefers-reduced-motion.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var interval = setInterval(function () { showSlide(current + 1); }, 7000);
    mount.addEventListener('mouseenter', function () { clearInterval(interval); interval = null; });
    mount.addEventListener('mouseleave', function () {
      if (!interval) interval = setInterval(function () { showSlide(current + 1); }, 7000);
    });
  }

  // ---- Row shape (foundation-package.html, welcome-bundle.html) ----

  function renderRow(reviews) {
    return reviews.slice(0, 3).map(function (rev) {
      var card = el('div', 'review-card');
      card.appendChild(el('div', 'review-stars', stars(rev.rating)));
      card.appendChild(el('div', 'review-text', '“' + rev.text + '”'));
      card.appendChild(el('div', 'review-author', '— ' + rev.author + ' · Google Review'));
      return card;
    });
  }

  // ---- Testimonial-card shape (results.html) ----

  function renderTestimonialCard(reviews) {
    var rev = reviews[0];
    return [
      el('div', 'review-stars', stars(rev.rating)),
      el('p', 'review-quote', '"' + rev.text + '"'),
      el('p', 'review-author', rev.author),
      el('p', 'review-source', 'Verified Google Review'),
    ];
  }

  // ---- Sidebar shape (service pages) ----

  function renderSidebar(reviews) {
    var rev = reviews[0];
    return [
      el('span', 'sidebar-label', 'What Clients Say'),
      el('div', 'sidebar-stars', stars(rev.rating)),
      el('p', 'sidebar-review', '"' + rev.text + '"'),
      el('div', 'sidebar-review-author', rev.author + ' · Google Review'),
    ];
  }

  // ---- Bootstrap ----

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

- [ ] **Step 3: Verify the file is syntactically valid JS**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
node -c assets/js/reviews-widget.js && echo "OK"
```

Expected: prints `OK`. (`node -c` is syntax-check only; doesn't execute browser-only globals like `window` or `document`, which is fine — those are referenced inside functions that only run in a browser context.)

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
git add assets/js/reviews-widget.js
git commit -m "Add reviews-widget.js — live Google Reviews mount system

Vanilla JS IIFE, no dependencies. Finds [data-altru-reviews] mounts,
fetches /api/reviews?include=reviews once, renders per-shape (carousel,
row, testimonial-card, sidebar) with XSS-safe DOM construction. On any
failure, mounts untouched — hardcoded HTML fallback retained.

Honors prefers-reduced-motion (carousel auto-rotate disabled when set).
Pause-on-hover for carousel."
```

---

## Task 3: Add Reviews & Testimonials section to `policies.html`

**Files:**
- Modify: `policies.html` (TOC at L235–245, body sections starting around L325)

**Goal:** Add new section 9 (Reviews & Testimonials) as the canonical compliance surface. Renumber existing sections 9–12 to 10–13. Also fix pre-existing TOC drop: Maintenance Membership exists in the body (currently §11) but was missing from the TOC entirely.

- [ ] **Step 1: Re-read the existing TOC and body section headings**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
grep -n "^\s*<li><a href=\"#" policies.html | head -15
grep -n "^\s*<h2 id=" policies.html
```

Expected: TOC entries at L235–245 (11 items, no `#reviews`, no `#membership`). Body H2 sections at various lines including `#medical` (~L325), `#liability` (~L328), `#membership` (~L336), `#contact` (~L339).

- [ ] **Step 2: Update the TOC sidebar (L241–245)**

Replace this block:

```html
          <li><a href="#gift-cards">7. Gift Cards</a></li>
          <li><a href="#protocols">8. Studio Protocols</a></li>
          <li><a href="#medical">9. Medical Disclaimer</a></li>
          <li><a href="#liability">10. Liability</a></li>
          <li><a href="#contact">11. Contact</a></li>
```

With:

```html
          <li><a href="#gift-cards">7. Gift Cards</a></li>
          <li><a href="#protocols">8. Studio Protocols</a></li>
          <li><a href="#reviews">9. Reviews &amp; Testimonials</a></li>
          <li><a href="#medical">10. Medical Disclaimer</a></li>
          <li><a href="#liability">11. Liability</a></li>
          <li><a href="#membership">12. Maintenance Membership</a></li>
          <li><a href="#contact">13. Contact</a></li>
```

(Adds Reviews as #9, bumps Medical to #10, Liability to #11, adds previously-missing Membership as #12, bumps Contact to #13.)

- [ ] **Step 3: Insert the new section in the body**

Find this block (currently around L323–325):

```html
        </ul>

        <h2 id="medical">9. Medical <em>Disclaimer</em></h2>
```

Replace it with:

```html
        </ul>

        <h2 id="reviews">9. Reviews &amp; <em>Testimonials</em></h2>
        <p>Reviews displayed on this site are fetched live from Altru Radiance's Google Business Profile via the Google Places API. They are not curated, selected, or edited &mdash; the most recent and most relevant reviews are surfaced automatically by Google's ranking.</p>
        <p>Reviews reflect individual client experiences and are not promises of results. All services at Altru Radiance are aesthetic and wellness services, <strong>not medical treatments</strong>. See <a href="#medical">Medical Disclaimer</a> for the full scope-of-practice context.</p>

        <h2 id="medical">10. Medical <em>Disclaimer</em></h2>
```

(Inserts the new section AND renumbers Medical from 9 → 10.)

- [ ] **Step 4: Renumber the remaining body section headings**

Find and replace these three lines exactly:

Find: `<h2 id="liability">10. <em>Liability</em></h2>`
Replace with: `<h2 id="liability">11. <em>Liability</em></h2>`

Find: `<h2 id="membership">11. Maintenance <em>Membership</em></h2>`
Replace with: `<h2 id="membership">12. Maintenance <em>Membership</em></h2>`

Find: `<h2 id="contact">12. <em>Contact</em></h2>`
Replace with: `<h2 id="contact">13. <em>Contact</em></h2>`

- [ ] **Step 5: Verify body section numbers match TOC**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
grep -n "^\s*<h2 id=" policies.html
```

Expected output should show in order: overview, booking (1), cancellations (2), late-arrivals (3), returns (4), minors (5), photography (6), gift-cards (7), protocols (8), reviews (9), medical (10), liability (11), membership (12), contact (13).

```bash
grep -n "^\s*<li><a href=\"#" policies.html
```

Expected output should show the TOC entries 1–13 matching above (with overview not in TOC, which is the existing convention).

Numbers must match between TOC and body. If they don't, fix before continuing.

- [ ] **Step 6: Open the page locally to confirm it renders**

```bash
start "" "C:/Users/goho2/altru/altru-radiance/policies.html"
```

Manually scroll through the TOC and click each TOC entry — each one should jump to its matching body section. The "Reviews & Testimonials" entry should reveal the new copy.

- [ ] **Step 7: Commit**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
git add policies.html
git commit -m "policies: add #reviews section as canonical reviews-compliance surface

New section 9: Reviews & Testimonials. Explains live-fetched Google
review behavior, cross-links to Medical Disclaimer. Becomes the
single source of truth for live-reviews compliance copy.

Renumber: Medical 9 -> 10, Liability 10 -> 11, Membership 11 -> 12,
Contact 12 -> 13. Also adds previously-missing Maintenance Membership
entry to TOC sidebar (was a pre-existing gap)."
```

---

## Task 4: Wire up `index.html` (carousel mount)

**Files:**
- Modify: `index.html`

**Goal:** Mark `.reviews-carousel` as the carousel mount, remove the existing inline carousel cycler script (the widget owns cycling now), add the widget script tag, add the "About these reviews →" link inside `.reviews-footer`.

This is the most complex page mount — removing the old cycler is the unique step. Other pages are simpler.

- [ ] **Step 1: Find the existing carousel cycler script bounds**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
grep -n "reviewPrev\|reviewNext\|reviewDots\|reviewsTrack" index.html
```

Note the lowest and highest line numbers reported in the `<script>` block (around L2184–2188+). Open the file and locate the full bounds of that `<script>...</script>` block. Verify it's a standalone IIFE that ONLY handles carousel cycling (no other side effects).

- [ ] **Step 2: Add `data-altru-reviews="carousel"` to the `.reviews-carousel` container**

Find (around L1450):

```html
    <div class="reviews-carousel">
      <div class="reviews-track" id="reviewsTrack">
```

Replace with:

```html
    <div class="reviews-carousel" data-altru-reviews="carousel">
      <div class="reviews-track" id="reviewsTrack">
```

- [ ] **Step 3: Add the policy link inside `.reviews-footer`**

Find this block (around L1558–1563):

```html
      <div class="reviews-footer">
        <span class="google-badge">
          <span class="google-g">G</span>
          Verified Google Reviews · 54 total · 5.0 average
        </span>
      </div>
```

Replace with:

```html
      <div class="reviews-footer">
        <span class="google-badge">
          <span class="google-g">G</span>
          Verified Google Reviews · 54 total · 5.0 average
        </span>
        <p class="reviews-policy-link" style="font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(244,240,230,0.5);text-align:center;margin-top:0.85rem;">
          <a href="/policies#reviews" style="color:inherit;text-decoration:none;border-bottom:1px solid rgba(201,168,76,0.25);padding-bottom:1px;">About these reviews →</a>
        </p>
      </div>
```

- [ ] **Step 4: Remove the existing carousel cycler script**

Locate the `<script>` block containing the variables identified in Step 1 (`reviewPrev`, `reviewNext`, `reviewDots`, `reviewsTrack`). It will start with a `<script>` tag and end with `</script>`. Delete the entire block, including the opening and closing `<script>` tags.

After deletion, verify nothing remains by re-running:

```bash
grep -n "reviewPrev\|reviewNext\|reviewDots\|reviewsTrack" index.html
```

Expected: only matches inside the HTML markup (the `id` attributes), NOT inside any script. If you still see `getElementById('reviewPrev')` or similar, the old script wasn't fully removed.

- [ ] **Step 5: Add the widget script tag near `</body>`**

Find the closing `</body>` tag. Just above it (and below any other scripts), add:

```html
<script src="/assets/js/reviews-widget.js" defer></script>
```

- [ ] **Step 6: Verify locally**

```bash
start "" "C:/Users/goho2/altru/altru-radiance/index.html"
```

In the browser:
- Open DevTools Console: should see no errors
- The reviews carousel should display the existing hardcoded slides (no fetch happens because file:// can't reach /api/reviews)
- The prev/next buttons should NOT work (widget hasn't wired them because fetch failed → mount untouched → widget never ran the wiring). That is correct fallback behavior for the local file://. The buttons WILL work post-deploy.
- "About these reviews →" link should appear below the Google badge

(The reason buttons don't work locally: the OLD cycler script was removed, the NEW cycler runs only after a successful fetch + render. file:// has no API. Post-deploy, with a working API, cycling works.)

- [ ] **Step 7: Commit**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
git add index.html
git commit -m "index: mark reviews-carousel as widget mount, remove inline cycler

The widget now owns carousel cycling — prev/next/dots handlers are
re-wired by the widget after successful render. Existing inline
cycler script (handled hardcoded slides only) is removed.

Hardcoded slides remain in HTML as the fallback shown when the API
is unavailable. Adds the 'About these reviews →' policy link inside
the .reviews-footer block."
```

---

## Task 5: Wire up `foundation-package.html` (row mount)

**Files:**
- Modify: `foundation-package.html`

**Goal:** Mark `.reviews-row` as a row mount, add widget script, add policy link.

- [ ] **Step 1: Add `data-altru-reviews="row"` to the container**

Find (around L1051):

```html
  <div class="reviews-row" style="max-width:1100px;margin:0 auto;">
```

Replace with:

```html
  <div class="reviews-row" data-altru-reviews="row" style="max-width:1100px;margin:0 auto;">
```

- [ ] **Step 2: Add the policy link beneath the `.reviews-row` block**

Find the line that closes `.reviews-row` (the `</div>` immediately after the third `.review-card`). Right after that closing `</div>` (and before the next `<section>` or comment), add:

```html
  <p class="reviews-policy-link" style="font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(244,240,230,0.5);text-align:center;margin-top:1.5rem;max-width:1100px;margin-left:auto;margin-right:auto;">
    <a href="/policies#reviews" style="color:inherit;text-decoration:none;border-bottom:1px solid rgba(201,168,76,0.25);padding-bottom:1px;">About these reviews →</a>
  </p>
```

- [ ] **Step 3: Add the widget script tag near `</body>`**

```html
<script src="/assets/js/reviews-widget.js" defer></script>
```

- [ ] **Step 4: Verify locally**

```bash
start "" "C:/Users/goho2/altru/altru-radiance/foundation-package.html"
```

Scroll to reviews section. The 3 hardcoded cards display (fallback, since file:// has no API). The "About these reviews →" link appears below.

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
git add foundation-package.html
git commit -m "foundation-package: mark reviews-row as widget mount, add policy link"
```

---

## Task 6: Wire up `welcome-bundle.html` (row mount)

**Files:**
- Modify: `welcome-bundle.html`

**Goal:** Same pattern as Task 5 — `.reviews-row` becomes a row mount, add script, add policy link.

- [ ] **Step 1: Add `data-altru-reviews="row"` to the container**

Find (around L1066):

```html
  <div class="reviews-row" style="max-width:1100px;margin:0 auto;">
```

Replace with:

```html
  <div class="reviews-row" data-altru-reviews="row" style="max-width:1100px;margin:0 auto;">
```

- [ ] **Step 2: Add the policy link beneath the closing `</div>` of `.reviews-row`**

```html
  <p class="reviews-policy-link" style="font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(244,240,230,0.5);text-align:center;margin-top:1.5rem;max-width:1100px;margin-left:auto;margin-right:auto;">
    <a href="/policies#reviews" style="color:inherit;text-decoration:none;border-bottom:1px solid rgba(201,168,76,0.25);padding-bottom:1px;">About these reviews →</a>
  </p>
```

- [ ] **Step 3: Add the widget script tag near `</body>`**

```html
<script src="/assets/js/reviews-widget.js" defer></script>
```

- [ ] **Step 4: Verify locally**

```bash
start "" "C:/Users/goho2/altru/altru-radiance/welcome-bundle.html"
```

3 hardcoded review cards visible; policy link visible below.

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
git add welcome-bundle.html
git commit -m "welcome-bundle: mark reviews-row as widget mount, add policy link"
```

---

## Task 7: Wire up `results.html` (testimonial-card mount)

**Files:**
- Modify: `results.html`

**Goal:** Mark `.testimonial-card` as a testimonial-card mount, add widget script, add policy link.

- [ ] **Step 1: Add `data-altru-reviews="testimonial-card"` to the container**

Find (around L1452):

```html
      <div class="testimonial-card">
        <div class="review-stars">★★★★★</div>
```

Replace with:

```html
      <div class="testimonial-card" data-altru-reviews="testimonial-card">
        <div class="review-stars">★★★★★</div>
```

- [ ] **Step 2: Add the policy link directly after the `.testimonial-card` block**

Find the `</div>` that closes the `.testimonial-card`. After it (before the next sibling or section), add:

```html
      <p class="reviews-policy-link" style="font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(244,240,230,0.5);text-align:center;margin-top:1.2rem;">
        <a href="/policies#reviews" style="color:inherit;text-decoration:none;border-bottom:1px solid rgba(201,168,76,0.25);padding-bottom:1px;">About these reviews →</a>
      </p>
```

- [ ] **Step 3: Add the widget script tag near `</body>`**

```html
<script src="/assets/js/reviews-widget.js" defer></script>
```

- [ ] **Step 4: Verify locally**

```bash
start "" "C:/Users/goho2/altru/altru-radiance/results.html"
```

Hardcoded testimonial card visible; policy link visible below.

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
git add results.html
git commit -m "results: mark testimonial-card as widget mount, add policy link"
```

---

## Task 8: Wire up `services/restorative-buccal-release.html` (sidebar mount)

**Files:**
- Modify: `services/restorative-buccal-release.html`

**Goal:** Mark the sidebar review block as a sidebar mount, add widget script, add policy link.

- [ ] **Step 1: Locate the existing sidebar review block**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
grep -n "sidebar-review\|sidebar-block\|sidebar-label" services/restorative-buccal-release.html | head -10
```

Identify the containing parent of the sidebar review (likely a `<div class="sidebar-block">` at around L530). That parent is the mount.

- [ ] **Step 2: Add `data-altru-reviews="sidebar"` to the containing block**

Find the `<div class="sidebar-block">` (or whichever class wraps the existing sidebar review). Around L530, the block looks like:

```html
        <div class="sidebar-block">
          <span class="sidebar-label">What Clients Say</span>
          <div class="sidebar-stars">★★★★★</div>
          <p class="sidebar-review">"My face and soul..."</p>
          <div class="sidebar-review-author">Chelsea McBee · Google Review</div>
        </div>
```

Replace the opening tag:

```html
        <div class="sidebar-block" data-altru-reviews="sidebar">
```

- [ ] **Step 3: Add the policy link immediately after the closing `</div>` of the sidebar block**

```html
        <p class="reviews-policy-link" style="font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(244,240,230,0.45);text-align:center;margin-top:0.7rem;">
          <a href="/policies#reviews" style="color:inherit;text-decoration:none;border-bottom:1px solid rgba(201,168,76,0.25);padding-bottom:1px;">About these reviews →</a>
        </p>
```

(Note: slightly smaller font/letter-spacing than the main-content version since this is a sidebar column.)

- [ ] **Step 4: Add the widget script tag near `</body>`**

```html
<script src="/assets/js/reviews-widget.js" defer></script>
```

- [ ] **Step 5: Verify locally**

```bash
start "" "C:/Users/goho2/altru/altru-radiance/services/restorative-buccal-release.html"
```

Sidebar review visible (fallback); policy link visible below.

- [ ] **Step 6: Commit**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
git add services/restorative-buccal-release.html
git commit -m "services/restorative-buccal-release: mark sidebar review as widget mount"
```

---

## Task 9: Wire up `services/lymphatic-drainage-murray-utah.html` (sidebar mount)

**Files:**
- Modify: `services/lymphatic-drainage-murray-utah.html`

**Goal:** Identical pattern to Task 8 — sidebar mount, script tag, policy link.

- [ ] **Step 1: Locate the existing sidebar review block**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
grep -n "sidebar-review\|sidebar-block\|sidebar-label" services/lymphatic-drainage-murray-utah.html | head -10
```

Identify the containing parent (likely `<div class="sidebar-block">` around L530).

- [ ] **Step 2: Add `data-altru-reviews="sidebar"` to the containing block**

Find the `<div class="sidebar-block">` wrapping the sidebar review (around L530). The block content currently is:

```html
        <div class="sidebar-block">
          <span class="sidebar-label">What Clients Say</span>
          <div class="sidebar-stars">★★★★★</div>
          <p class="sidebar-review">"She flushed a lot of lymphatic fluid..."</p>
          <div class="sidebar-review-author">Laura Thompson · Google Review</div>
        </div>
```

Replace the opening tag:

```html
        <div class="sidebar-block" data-altru-reviews="sidebar">
```

- [ ] **Step 3: Add the policy link immediately after the closing `</div>` of the sidebar block**

```html
        <p class="reviews-policy-link" style="font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(244,240,230,0.45);text-align:center;margin-top:0.7rem;">
          <a href="/policies#reviews" style="color:inherit;text-decoration:none;border-bottom:1px solid rgba(201,168,76,0.25);padding-bottom:1px;">About these reviews →</a>
        </p>
```

- [ ] **Step 4: Add the widget script tag near `</body>`**

```html
<script src="/assets/js/reviews-widget.js" defer></script>
```

- [ ] **Step 5: Verify locally**

```bash
start "" "C:/Users/goho2/altru/altru-radiance/services/lymphatic-drainage-murray-utah.html"
```

Sidebar review visible (fallback); policy link visible below.

- [ ] **Step 6: Commit**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
git add services/lymphatic-drainage-murray-utah.html
git commit -m "services/lymphatic-drainage-murray-utah: mark sidebar review as widget mount"
```

---

## Task 10: Deploy + post-deploy smoke test

**Files:**
- None (verification only)

**Goal:** Verify everything works on Cloudflare Pages preview, then confirm production behavior. The spec required: "After deploying, verify with a real fetch on staging/production that 5 reviews load."

- [ ] **Step 1: Push the branch and let Cloudflare Pages auto-deploy a preview**

```bash
cd "C:/Users/goho2/altru/altru-radiance"
git push origin scope-accuracy-review
```

Cloudflare Pages should auto-build and deploy a preview at a URL like `https://<commit-hash>.altru-radiance.pages.dev`. Find the preview URL in the Cloudflare Pages dashboard under the project's Deployments tab.

- [ ] **Step 2: Verify the API endpoint returns the lightweight payload without `?include=reviews`**

```bash
curl -s "https://<preview-url>/api/reviews" | jq 'keys'
```

Expected output:
```json
["cachedAt", "placeUrl", "rating", "total"]
```

The `reviews` key MUST NOT be present.

- [ ] **Step 3: Verify the API endpoint returns 5 reviews with `?include=reviews`**

```bash
curl -s "https://<preview-url>/api/reviews?include=reviews" | jq '.reviews | length'
```

Expected: `5`

Also verify shape:

```bash
curl -s "https://<preview-url>/api/reviews?include=reviews" | jq '.reviews[0] | keys'
```

Expected:
```json
["author", "rating", "relativeTime", "text", "time"]
```

(No `profilePhoto` key — intentionally omitted.)

- [ ] **Step 4: Verify cache headers**

```bash
curl -sI "https://<preview-url>/api/reviews?include=reviews" | grep -i "cache-control"
```

Expected: contains `s-maxage=86400`

- [ ] **Step 5: Verify each affected page renders live reviews**

Open in a browser (substitute the preview URL):
- `https://<preview-url>/`
- `https://<preview-url>/foundation-package`
- `https://<preview-url>/welcome-bundle`
- `https://<preview-url>/results`
- `https://<preview-url>/services/restorative-buccal-release`
- `https://<preview-url>/services/lymphatic-drainage-murray-utah`

For each page:
1. Open DevTools → Network tab → reload
2. Filter for `api/reviews`. Expect ONE request to `/api/reviews?include=reviews` returning 200.
3. Verify the displayed reviewer names differ from the committed hardcoded fallback (this proves the swap happened — Mechelle's live reviews differ from the committed quotes over time as new reviews arrive).
4. The "About these reviews →" link appears beneath the reviews block.
5. Click the link — `/policies` loads scrolled to the new "Reviews & Testimonials" section.

- [ ] **Step 6: Verify carousel cycling works on the homepage**

On the preview index page:
- Click the prev/next buttons under the carousel — slide should change
- Click any of the dots — slide should jump to that index
- Stop interacting and wait 7s — should auto-advance
- Hover over the carousel — should pause auto-advance
- Move mouse off — should resume

- [ ] **Step 7: Verify graceful fallback**

In the Cloudflare Pages dashboard for the preview environment:
- Settings → Environment variables → temporarily rename `GOOGLE_PLACES_API_KEY` to `GOOGLE_PLACES_API_KEY_DISABLED`
- Trigger a redeploy (or wait for the preview to refresh)
- Reload the homepage
- Expect: hardcoded review fallback visible (the committed slides), console.warn message in DevTools console, no broken state
- Restore the variable name when done

- [ ] **Step 8: Run Lighthouse on the preview homepage**

In Chrome DevTools → Lighthouse → run with the "Performance" category checked.

Expected: Performance ≥ 90 (widget is small + deferred — should not regress from the current baseline).

- [ ] **Step 9: Promote to production**

Once preview verification passes, merge `scope-accuracy-review` to `main`:

```bash
cd "C:/Users/goho2/altru/altru-radiance"
git checkout main
git pull
git merge --no-ff scope-accuracy-review -m "Merge scope-accuracy-review: live Google Reviews widget + scope-compliance sweep"
git push origin main
```

Cloudflare Pages production deploys automatically from `main`.

- [ ] **Step 10: Production smoke test**

Repeat Steps 2, 3, 4, 5 against `https://altruradiance.com` instead of the preview URL.

Confirm:
- `/api/reviews` returns lightweight payload
- `/api/reviews?include=reviews` returns 5 reviews
- All 6 affected pages render live reviews
- Policy link works on every page

---

## Out-of-scope follow-ups noted during planning

These are not part of this plan but worth tracking:

- **Verification step 7 (fallback test) involves temporarily disabling a production env var.** Not destructive (rename + restore), but ideally we'd have a staging environment with a separate API key. Out of scope here.
- **Cache invalidation tool.** No `/api/reviews/refresh` admin endpoint. If a review goes egregiously off-scope and Mechelle wants it suppressed within the 24h window, the only options are (a) wait for cache expiry, (b) toggle env vars to force a redeploy and cache miss. v2 idea.
- **The widget shows `?` if `rev.rating` is somehow `undefined` or non-numeric.** The `stars()` helper coerces via `Math.round(rating || 0)` — so `undefined` becomes `0` stars. Realistic Google Places responses always include rating, so this is purely defensive.

---

## Self-review

(Performed against the spec immediately after writing this plan.)

**Spec coverage:**
- ✅ Function expansion (Task 1)
- ✅ Vanilla JS widget (Task 2)
- ✅ Mount attribute pattern (Tasks 4–9)
- ✅ Per-shape render contract (Task 2 includes all four)
- ✅ XSS-safe DOM construction (Task 2 uses createElement + textContent + replaceChildren-style loop)
- ✅ Graceful fallback (Task 2 catch block; Task 10 Step 7 verifies)
- ✅ Compliance link to /policies#reviews (Tasks 4–9)
- ✅ New policies section (Task 3, including TOC inconsistency fix)
- ✅ Cache 24h (Task 1 + Task 10 Step 4)
- ✅ language=en (Task 1)
- ✅ Real-fetch verification on staging/production (Task 10 Steps 2–3, 5, 10)

**Placeholder scan:** No "TBD", "TODO", "implement later" — confirmed.

**Type/name consistency:**
- Shape names used everywhere: `carousel`, `row`, `testimonial-card`, `sidebar` — matches across widget (Task 2), per-page mounts (Tasks 4–9), spec
- Function names in Task 2 (`renderCarousel`, `renderRow`, `renderTestimonialCard`, `renderSidebar`, `wireCarousel`, `el`, `stars`, `replaceChildrenWith`) are self-consistent within the widget file
- Element IDs (`reviewsTrack`, `reviewPrev`, `reviewNext`, `reviewDots`) match between Task 2 (widget queries them) and the existing index.html markup (Task 4 preserves them when adding the data attribute)

**Scope check:** 10 atomic tasks. Each commits independently. Task 10 (deploy + verify) is the only one that touches infrastructure. Pre-existing TOC inconsistency in policies.html is fixed in Task 3 (incidental cleanup of a file we're already editing — within "good developer" scope per brainstorming guidance).
