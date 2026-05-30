# SCOPE pass — flagged items awaiting sign-off

> Companion to `scope-intraoral-audit.md`. Produced by the interactive buccal-reframe pass on 2026-05-29.
> The **visible body copy** reframe (intraoral → buccal; "inside the cheek/mouth" → "through the cheek";
> scope-relevant "deep" softened) is **DONE** across 14 live files. Everything in THIS file was
> deliberately **left untouched** and needs Andrew's decision. Nothing here is a bug — each is a
> documented hold per the locked scope decisions.

## Scope decisions that produced these holds
1. **SEO layer left as-is** — `<meta>` description/keywords, `og:`/`twitter:`, and JSON-LD schema use
   "intraoral" as a deliberate search term. Editing needs per-page SEO sign-off (ranking risk).
2. **Two ranking articles skipped entirely** — `journal/what-is-buccal-release.html`,
   `journal/tmj-relief-facial-release.html`.
3. **Muscle names kept** (buccinator/masseter/pterygoid) where used as aesthetic descriptors.
4. **Image filenames never renamed** (hosted assets / Cloudinary public IDs).

---

## 1. SEO meta / keywords / og / twitter  (flag — needs SEO sign-off)

| File | Line | Field | Contains |
|---|---|---|---|
| restorative-facial.html | 13 | meta description | "intraoral fascia work" |
| restorative-facial.html | 14 | meta keywords | "intraoral buccal facial Utah" |
| restorative-facial.html | 24 | og:description | "intraoral fascia work" |
| restorative-facial.html | 36 | twitter:description | "intraoral buccal work" |
| foundation-package.html | 12 | meta description | "intraoral fascia work" |
| foundation-package.html | 597 | og:description | "intraoral hands-on fascia work" |
| services/restorative-buccal-release.html | 12 | meta description | "Intraoral fascia work … deep skin hydration" |
| services/restorative-buccal-release.html | 20 | og:description | "Intraoral fascia work … deep skin hydration" |

## 2. JSON-LD schema (`application/ld+json`)  (flag — needs SEO sign-off)

These are machine-readable copies that often mirror visible FAQ/description text. The visible twins
were already reframed; these schema copies were intentionally left so rich-result text and the
visible page can be signed off together.

| File | Line(s) | Schema field |
|---|---|---|
| restorative-facial.html | 514 | Service `category` ("… / Intraoral Fascia Work / …") |
| restorative-facial.html | 532, 533, 536, 537 | FAQPage answers ("inside the cheek", "intraoral portion", "deeper intraoral work", "gentle intraoral work") |
| foundation-package.html | 1459, 1502, 1518, 1534 | Service/FAQ descriptions ("intraoral fascia work", "from inside the mouth") |
| welcome-bundle.html | 1247, 1271, 1320, 1328, 1352 | Product/FAQ descriptions ("intraoral hands-on fascia work", "deep jaw muscles") |
| services/restorative-buccal-release.html | 317, 320, 336 | FAQ ("Does intraoral work hurt?", "reached intraorally") |
| index.html | 1359 | Service `description` ("intraoral fascia work") |
| journal.html | 591 | BlogPosting headline (metaphor "From the Inside Out") |
| journal/how-breathing-shapes-your-face.html | 614, 629 | FAQ answers ("from inside the cheek") |
| journal/hands-first-facial-alternatives.html | 566, 567 | FAQ answers ("from inside the cheek", "deep facial muscle tension") |

## 3. Skipped ranking articles (per scope decision 2 — not edited at all)

| File | Hits | Note |
|---|---|---|
| journal/what-is-buccal-release.html | 8 intraoral + several "inside the cheek/mouth" + "deep muscles" | Educational explainer that ranks for the topic. Decide reframe depth separately. |
| journal/tmj-relief-facial-release.html | 5 intraoral + multiple "inside the cheek" | Protective TMJ-redirect article. Holds the "we don't treat conditions — see a dentist" disclaimer (L430). Reframe delicately; do NOT strip the disclaimer. |

## 4. Image alt text (DEFERRED batch — Andrew chose to defer 2026-05-29)

Proposed reframe (not yet applied): drop "intraoral" only, e.g.
`"…performing buccal release intraoral facial treatment"` → `"…performing buccal release facial treatment"`.
No file renames. Minor image-SEO weight. 8 instances:

| File | Line |
|---|---|
| index.html | 2069 |
| journal.html | 322 |
| journal/hands-first-facial-alternatives.html | 437 |
| journal/how-breathing-shapes-your-face.html | 474 |
| journal/lymphatic-drainage-benefits-salt-lake-city.html | 426 |
| journal/myofascial-release-facial-salt-lake-city.html | 450 |
| journal/tmj-relief-facial-release.html | 484 (on a skipped article) |
| restorative-facial.html | 641 |

## 5. Image filenames / Cloudinary IDs (DO NOT RENAME — listed for awareness)

`/assets/journal/buccal-massage-intraoral.webp`, `…buccal-massage-intraoral-sm.webp`,
Cloudinary `studio_mechelle-performing-buccal-massage-intraoral-murray-utah_gmrqpi`
(in index.html, journal.html, foundation-package.html:991, restorative-facial.html:653, and the
related-card images across journal articles). Renaming breaks references; leave as-is.

## 6. Borderline "deep" — kept intentionally (note, not edited)

| File | Line | Text | Why kept |
|---|---|---|---|
| foundation-package.html | 1049 | "**Deep Integration:** We work with tissue, fascia…" | Brand process label, not a deep-tissue access claim. |
| services/restorative-buccal-release.html | 570 | "describe it as **deep** but not painful" | Sensation descriptor ("closer to firm bodywork"), not access depth. |
| services/lymphatic-drainage-murray-utah.html | 473 | "nothing like **deep tissue** work" | Contrast — explicitly says the service is NOT deep tissue work. Andrew chose: leave. |
| (various) | — | "deeper layers", "deeper folds", "go deeper", "deeply relaxing" | Comparative/experiential idiom, not scope claims. |

## 7. TMJ items found en route (OUT OF SCOPE for this pass — separate TMJ audit)

"TMJ" is a flagged medical-condition term per the SCOPE memory, but that's a different audit than this
intraoral pass. Noting where it surfaced so it isn't lost:

| File | Line | Context |
|---|---|---|
| results.html | 1058 | `<h3>TMJ Release + Cervical Decompression</h3>` (visible heading) |
| services/restorative-buccal-release.html | 333–336, 584–587 | "I have TMJ — is this appropriate?" FAQ (visible + schema) |
| journal/how-breathing-shapes-your-face.html | 482 | alt text "Intraoral jaw release for TMJ relief" |
| journal/tmj-relief-facial-release.html | (whole article) | Intentional protective redirect — keep. |

## 8. `.brainstorm/` prototypes (skipped per Andrew — not live)

`hero-combined.html` (3 intraoral), `homepage-below-fold.html` (1 intraoral + "deep tissue fascial work"
hook). Scratch/mockup files, not served. Left alone; flagged so they don't seed scope language into
future copy if reused.

---

## Deviation log (edits that differed slightly from what was shown at approval)
- `journal/myofascial-release-facial-salt-lake-city.html` L392: approved as "held tension patterns",
  written as **"ingrained tension patterns"** to avoid repeating "held tension" three times in one
  screen (it already appears at L351). Revert to "held tension patterns" on request.

## What's DONE (for reference)
Visible body copy reframed in: membership, book, results, services, index (2 strings, surgical),
services/facial-architecture-ritual, journal/how-breathing-shapes-your-face,
journal/hands-first-facial-alternatives, journal/myofascial-release-facial-salt-lake-city,
welcome-bundle, services/restorative-buccal-release, foundation-package, restorative-facial,
+ facial-architecture-ritual L411 "deep manual work" → "intentional manual work".
Repo-wide "intraoral" dropped 84 → 53; every remaining hit is catalogued above.
