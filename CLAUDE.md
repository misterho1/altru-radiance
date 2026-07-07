# Altru Radiance — Claude Instructions

## Business Overview

**Altru Radiance** is an aesthetic wellness studio in Murray, Utah specializing in fascial-driven regenerative beauty treatments. Operated by **Mechelle**, a Licensed Master Esthetician, the practice moves beyond the skin's surface to manipulate the connective tissue (fascia) that governs facial contour, symmetry, and aging.

- **Website:** altruradiance.com
- **Address:** 164 E 5900 S, Suite A108, Murray, UT 84107
- **Tagline:** Aesthetic Wellness · Murray, Utah
- **Blog section name:** Journal (not "blog" — use "Journal" in all copy)

### Services Offered

#### Signature Regenerative Services (Fascial Focus)
- **Restorative Buccal Facial** — Signature 90-minute service, $250. Combines intraoral buccal release, lymphatic drainage, and myofascial release. (Consolidated rename — was previously "Restorative Facial + Buccal Release" / "Buccal Release"; both legacy names now point to this single service.)
- **Soothe Lymphatic Drainage** — Clearing the fluid within the Hydrated Foundation to reduce inflammation and stagnant "puffiness."
- **Facial Architecture Ritual** — A targeted session focusing on the facial "architecture" and fascial planes to restore symmetry and lift. (Renamed from "Structural Integration Facial" to stay clearly within Master Esthetician scope; file renamed to `services/facial-architecture-ritual.html`. Old slug `/services/structural-integration-salt-lake-city` no longer exists.)

#### Adjuvant Cosmetic Treatments
- **Microneedling + Skin Boosters** — Targeting the Living Framework to support collagen and elastin response for refined surface texture and resilience. The booster ingredient varies per client based on their skin (NOT a single branded "bone-marrow-derived growth factor" claim — describe as "skin boosters" rather than naming specific medical-derived sources).
- **Korean Aqua Peel** — Advanced surface exfoliation and nutrient infusion.
- **Back Facial** — Deep cleansing and structural relaxation for the posterior fascia.
- **Red Light Therapy** — Cellular energy support for surface repair and collagen health.

### Booking Packages
- **Welcome Bundle** — Two foundational sessions for new clients (whole body reset)
- **Foundation Package** — For fascia regeneration and structural change (6 weeks)
- **Monthly maintenance** — Ongoing sessions to sustain structural integrity.

---

## Content Marketing (YouTube + Freebie Funnel)

Separate workstream from the website, in **[content/](content/)**. YouTube channel (@altruradiance), "The Tech Neck Reset" freebie lead magnet, and a monthly Journal + video digest — funneling viewers to booking.

- **[content/CONTENT-PLAN.md](content/CONTENT-PLAN.md)** — THE executable 6-month plan (phases 0–5, tasks with acceptance criteria, weekly rhythm, operator protocol). Any AI running content work day-to-day starts here.
- **[content/README.md](content/README.md)** — strategy + established decisions: 12-video launch plan, SEO/AEO/CRO system, channel profile, newsletter model, liability posture.
- **[content/youtube-scripts.md](content/youtube-scripts.md)** — full production kit: scripts (V1–3), outlines (V4–5), SEO title/tag blocks, description template, thumbnails, disclaimer templates.
- **[content/tech-neck-reset-freebie.pdf](content/tech-neck-reset-freebie.pdf)** — designed one-page freebie. NOT yet wired to the site email signup (footer YouTube link + attorney review still pending — see Open Items in README).

Video/spoken content uses a warmer spoken register (em dashes, contractions) but the same SCOPE.md compliance line as the site. Disclaimers and the client media-release requirement are ATTORNEY-REVIEW-PENDING — don't publish before that.

---

## Design Context

Strategic design canon lives in **[PRODUCT.md](PRODUCT.md)** (strategy) and **[DESIGN.md](DESIGN.md)** (visual system). Auto-loaded by every `/impeccable` command.

**Register:** brand. **Creative North Star:** *"The Anatomical Atlas, with Apothecary precision in the studio menu."*

**Five design principles** (cite by name in critique passes):
1. Anatomy is the proof
2. Mechelle speaks, not a brand
3. Beautification, never treatment
4. Editorial over commercial
5. Three readers, one page (skeptic, injectable-fatigued, somatic-native)

`DESIGN.json` sidecar carries tonal ramps and component HTML/CSS snippets for the live preview panel.

---

## Brand Voice

### Personality
- **Educated and clinical, but accessible** — Use anatomical and technical language, but always explain it. The goal is to make the client smarter, not intimidated.
- **Honest and direct** — Call out marketing hype when relevant. Don't overclaim. If something doesn't work, say so clearly.
- **Authoritative but warm** — Expert tone, never cold or corporate. Mechelle is the practitioner speaking, not a brand committee.
- **Unhurried and intentional** — Language reflects depth, not urgency. No pushy sales language.
- **Grounded in structure and science** — Frame everything through anatomy, physiology, and mechanical reality.
- **Dual-Track Authority:** Maintain a clear distinction between Structural Interventions (fascia-based) and Cosmetic Refinements (skin-based).

### Tone Guidelines
- Write as though speaking to an intelligent adult who deserves honest, complete information
- Prefer precision over enthusiasm — one accurate claim over three vague ones
- It's okay to say "Botox is effective for X" if true — credibility matters more than brand protection
- Never use wellness buzzwords without substance: no "holistic healing journey," "glowing from within," "self-love ritual"
- Avoid filler adjectives: luxurious, transformative, revolutionary, cutting-edge, game-changing
- **Entity-Based Authority:** Use "Fascia" as the primary anchor. Instead of saying "we manipulate the face," say "we address the fascial web to restore structural balance."
- **Mechanically Minded:** Frame treatments through Physical Signaling (Mechanotransduction)—explaining how manual touch creates biological change.

### Signature Phrases & Positioning
- **"From the inside out"** — Core differentiator. Buccal release works where external techniques can't reach.
- **"Regenerative Aesthetics"** / **"Regenerative Skincare"** — The primary service category framing. (Note: previously framed as "Structural anti-aging." SCOPE.md flags "anti-aging" as a guaranteed-result claim — use "anti-aging" sparingly with explicit context, never as a positioning hook. Prefer "regenerative" or "longevity.")
- **"Works where conventional skincare can't reach"** — Used for the Restorative Buccal Facial positioning.
- **"Aesthetic wellness"** — The category label for the business overall.
- Mechelle's philosophy: *"The body knows how to find its own balance. We create the conditions that allow it to."* (Updated from "knows how to heal" — "heal" is SCOPE-flagged outcome verb.)
- The Resonance metaphor: *"Conventional skincare polishes the instrument's wood; fascial release tunes the hidden strings, restoring the face's natural resonance and structural ease."*

### What Altru Radiance Is NOT
- Not a med spa
- Not injectable-focused (no Botox, no fillers offered)
- Not a day spa or relaxation-only concept
- Not wellness woo — all claims grounded in anatomy and manual therapy evidence

---

## Compliance (SCOPE.md)

The repo root contains `SCOPE.md` — the Utah Master Esthetician scope-of-practice authority for all content work. Every page edit must satisfy SCOPE.md. Key rules:

- **The hard line (58-11a-302.18(1)(b)):** No service may be performed or advertised "for the treatment of medical, physical, or mental ailments."
- **Lane = beautification.** Every sentence should sell beauty / appearance, never a condition fix. When in doubt: "does this sell beauty, or does it claim to fix a condition?" Only the first belongs on the site.
- **FLAGGED phrasing patterns:** treat / heal / cure / diagnose / relieve / fix / resolve / detox; named medical conditions (TMJ, bruxism, hypertrophy, lymphedema, inflammation, post-surgical recovery, airway, sleep apnea, sinusitis); "anti-aging" as a guaranteed result; "medical-grade" / "clinical" / "therapeutic" used as health-claim modifiers.
- **APPROVED phrasing patterns:** "supports the look and feel of X" / "a regenerative-inspired approach" / "hands-on fascia work" / "softens held tension" / "advanced facials" / "visible lift" / philosophy framing of the studio's approach.
- **Gray-zone verbs** (object determines legality): `release`, `reduce`, `improve`, `boost`, `address` — fine on aesthetic objects ("release jaw tension", "reduce the appearance of fine lines"), flagged on medical objects ("release adhesions", "reduce inflammation").
- **Approach C for nervous system language:** Keep general philosophy mentions ("the nervous system, fascia, and lymphatic system work together"); STRIP mechanism claims ("regulation", "activation", "downshifts to parasympathetic", "vagal pathway access").
- **Defensive disclaimers are PROTECTIVE, not violations.** Articles that explicitly redirect medical concerns to medical providers (e.g. "I don't diagnose airway conditions — see a dentist or PT") satisfy SCOPE through editorial honesty. Don't strip them; their explicit denials of treatment are exactly what makes the surrounding content scope-compliant.
- **R156-11a-612 disclosure** (chemical exfoliation, microneedling, microdermabrasion as "cosmetic, not medical purposes") is handled site-wide via `/policies#reviews` and the Medical Disclaimer section of the policies page. New service pages do NOT need inline per-page disclosures.
- **Service-name consolidation in effect:** "Buccal Release" / "Restorative Facial" / "Restorative Facial + Buccal Release" all rename to **"Restorative Buccal Facial"** in display copy. "Structural Integration" renames to **"Facial Architecture Ritual"** (and the page lives at `/services/facial-architecture-ritual.html`).

See `SCOPE.md` for full primary-source citations.

---

## Writing Standards

### Blog / Journal Articles
- Author byline: **By Mechelle · Licensed Master Esthetician**
- Category labels are small, uppercase (e.g., "Technique Deep Dive," "Comparison Guide")
- Lead with a strong lede in *italic Cormorant Garamond* — a declarative, scene-setting sentence
- Use `h2` for major sections, `h3` for subsections (in italic, gold-light color)
- Include internal links to related service pages and other Journal articles where relevant
- Articles should answer the most common client question about the topic completely
- SEO: use location ("Murray, Utah," "Murray, UT") naturally in body copy and meta descriptions
- Recommend a 3–6 session series where appropriate — never promise permanent results from one session

### Service Pages
- Badge label: "Signature Service" or relevant category
- H1 format: The [Service Name]: [Italic Differentiator] / [Subphrase]
- Lead sub-text focuses on the structural problem being solved, not the outcome first
- Meta items (duration, price) displayed as supporting details, not the headline
- CTA: "Book Now" or "Book Your Session" — never "Schedule a Consultation"

### Social / X (Twitter) Content
- Short, direct, educational — no fluff
- Lead with an insight or contrast ("Most facials work on the surface. This one works underneath it.")
- Use anatomical specificity as a hook — it signals expertise
- Location tag when relevant: Murray, Utah or Salt Lake City area
- Never use: 😍✨💫🙌 or similar emoji unless in a context that's explicitly casual/behind-the-scenes
- Thread format for longer educational content (mirror Journal articles)
- CTA at thread end: link to relevant service or Journal post

### SEO Priorities
- Primary keyword targets: buccal release Murray Utah, Restorative Buccal Facial Murray Utah, fascia facial Murray Utah, non-invasive facial lift Utah, natural alternatives to injectables Utah, fascia-focused facial Utah, myofascial release facial Utah (TMJ-related keywords intentionally NOT served — the previously-targeted "TMJ release" search intent is now redirected to the appearance-focused "Why the Lower Face Reads Heavier" journal article)
- All service pages and Journal posts include: location city+state, service name, and differentiator in title tag
- Alt text format: `[service/technique]-[descriptor]-[location]-altru-radiance` (e.g., `buccal-massage-before-after-1-session-murray-utah-altru-radiance`)
- Internal linking: Journal articles link to relevant service pages; service pages link to related Journal articles
- Canonical URLs: `altruradiance.com/services/[slug]` and `altruradiance.com/blog/[slug]`

---

## Design System (Reference)

### Colors
```
--black:      #06100a   (primary background)
--deep:       #0a1810   (secondary background, sidebar)
--forest:     #162b1c   (surface/card)
--gold:       #c9a84c   (primary accent, CTA, headings)
--gold-light: #e8cc88   (h3 headings, italic highlights, prices)
--cream:      #f4f0e6   (primary text)
--mist:       #8aaa8a   (secondary text, labels, eyebrows)
```

### Typography
- **Cormorant Garamond** — Serif, editorial. Used for: headings, brand name, italic lede, prices, nav brand
- **Jost** — Sans-serif, clean. Used for: body copy, nav links, CTAs, labels (weight 300/400/500)

### Service Badge Taxonomy

Two badge components serve distinct purposes. Use the canonical labels below; do not invent new ones per page.

**`.service-badge`** — categorizes a service card. Canonical labels only:
- **Signature Regenerative** — fascia-focused services: Restorative Buccal Facial, Soothe Lymphatic Drainage, Facial Architecture Ritual
- **Adjuvant Cosmetic** — surface treatments: Procell Microchanneling, Aqua Peel, Microneedling, Back Facial, Red Light Therapy
- **New Client Package** — Welcome Bundle (the only intro-pricing package)
- **Foundation Series** — Foundation Package (3-session commitment)

**`.slide-service-badge`** — caption above before/after demo slides. Use the actual service name shown in the image, not a descriptive phrase:
- **Restorative Buccal Facial**
- **Soothe Lymphatic Drainage**
- **Facial Architecture Ritual**

Image filenames are the source of truth for which service a demo slide represents. When in doubt, read the filename slug (`buccal-massage-*` → Restorative Buccal Facial; `lymphatic-drainage-*` → Soothe Lymphatic Drainage; `structural-integration-*` → Facial Architecture Ritual).

### Voice Consistency Across Channels
When generating content across X, email, or any other channel, maintain the same clinical-but-warm tone. The brand does not have a "casual voice" and a "formal voice" — it has one voice that adjusts register slightly for format without losing precision or authority.

---

## Live Google Reviews Widget

Reviews on this site are rendered live from Google Places API via `/assets/js/reviews-widget.js`. Pages with widget integration:

- `index.html` — carousel shape (`.reviews-carousel`)
- `foundation-package.html` + `welcome-bundle.html` — row shape (`.reviews-row`)
- `results.html` — testimonials-grid shape (`.testimonials-grid`)
- `services/restorative-buccal-release.html` + `services/lymphatic-drainage-murray-utah.html` — sidebar shape (`.sidebar-block`)

The widget queries `[data-altru-reviews]` mount points on DOMContentLoaded, fetches `/api/reviews?include=reviews` once, and replaces each mount's children with rendered review nodes. Hardcoded review HTML inside each mount stays as graceful-degradation fallback (renders if the API errors).

**To add widget to a new page:**
1. Mark the existing review container with `data-altru-reviews="<shape>"` attribute
2. Add `<script src="/assets/js/reviews-widget.js" defer></script>` once near `</body>`
3. Add "About these reviews →" link beneath the container pointing to `/policies#reviews`

See `docs/superpowers/specs/2026-05-23-google-reviews-widget-design.md` for full design + per-shape render contract.

**Implementation notes:**
- Pass-through: reviews are displayed as Google returns them; the studio doesn't curate which ones surface. This is the compliance design — editorial distance via API instead of hand-curated quotes.
- 24h edge cache; ~$0.66/month inside Google's $200 Maps free credit.
- XSS-safe by construction: all DOM nodes built via `document.createElement` + `textContent`; never `.innerHTML`.

---

## Key Anatomical Terms (Use Accurately)
- **Buccinator** — flat cheek muscle, defines cheek hollows and midface contour
- **Masseter** — primary chewing muscle; holds stress/tension; hypertrophy widens the jaw
- **Medial & Lateral Pterygoids** — deep jaw muscles, only fully accessible intraorally; key for TMJ
- **Fascia** — connective tissue network; held fascial tension contributes to asymmetry and downward pull (the term "fascial adhesions" is SCOPE-flagged — frame as "held tension" or "areas of restriction" instead)
- **Intraoral** — inside the mouth (the defining access point of buccal release)
- **Lymphatic drainage** — fluid movement; reduces puffiness, activates circulation
- **Myofascial release** — manual technique targeting the fascia and underlying muscle
- **Living Framework** — the internal web of collagen and elastin fibers (ECM) that supports the skin's surface
- **Hydrated Foundation** — the fluid-filled environment (Ground Substance) within the fascia that provides plumpness
- **Physical Signaling** — the clinical process (Mechanotransduction) of how cells respond to manual pressure
- **Kinetic Vitality (Piezoelectric Effect)** — the bio-electric charge created by applying pressure to connective tissue, signaling the body to repair itself
- **SMAS (Superficial Musculoaponeurotic System)** — the specific fascial layer that defines facial lift

---

## Repo & Workflow Facts

- Static HTML on Cloudflare Pages. Production deploys from `origin/main` via the `cloudflare-deploy.yml` Action — use `/ship` for any deploy; it owns the method. Local `main` is stale by convention: work happens on feature branches (`scope-buccal-language`, `local-pages-pilot`, ...) pushed as `<branch>:main`. Check which branch is current before assuming edits reach prod.
- **Repo layout (2026-07-06 reorg):** site pages + `assets/ services/ journal/ functions/` live at root and deploy. Internal material lives in deploy-stripped folders — `docs/` (project docs, specs, image inventory), `marketing/` (ads playbook + import CSVs, ad scripts, GBP/IG/email content, `research/` voice-of-customer quote banks), `tasks/` (work logs), `content/` (YouTube workstream). Canon files stay at root (`CLAUDE.md README.md SCOPE.md PRODUCT.md DESIGN.md DESIGN.json`).
- **`.assetsignore` does NOT work on this project** (Direct Upload + wrangler-action ignores it — verified 2026-07-06 when /CLAUDE.md and /SCOPE.md were found publicly served). The actual exclusion mechanism is the "Exclude internal files" strip step in `cloudflare-deploy.yml`. **Any new internal file or folder must be added to that strip step** — a root file or new folder deploys publicly by default. Prefer putting internal docs in `docs/` or `marketing/` (already stripped wholesale).
- **Imagery scope (hard rule):** esthetician facial work only — never massage-table or back-massage visuals. Mechelle is a Master Esthetician, not an LMT; wrong imagery is a scope violation, not a style choice.
- **Generated media:** Seedance video gens always use `generate_audio: false` — `true` trips NSFW false-flags on this brand's imagery. Animation register is slow, organic, breathing — never snappy.
- Hero revert path if the cinematic hero must come down: git tag `hero-pre-cinematic` + backup at `~/altru/hero-backup-2026-07-05`.

## Content Don'ts
- Don't promise permanent results — always frame as cumulative and maintained with sessions
- Don't compare buccal release to surgery as "just as good" — position it as a different category
- Use "anti-aging" sparingly and only with explicit context — never as a guaranteed result. Prefer "regenerative" or "longevity" as positioning words. SCOPE.md flags unqualified anti-aging claims.
- Don't use "toxin-free" or "chemical-free" — those are anti-science framings
- Don't write in the third person about Mechelle — she is the author and voice of the brand
- Don't describe results as "dramatic" — use "visible," "meaningful," "structural," or "progressive"
