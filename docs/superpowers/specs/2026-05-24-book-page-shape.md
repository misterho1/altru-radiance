# Design Brief — /book page rebuild

**Date:** 2026-05-24
**Source:** `/impeccable shape /book` (session output)
**Status:** Approved — ready for `/impeccable craft /book`
**Canon:** [PRODUCT.md](../../../PRODUCT.md) · [DESIGN.md](../../../DESIGN.md) · [DESIGN.json](../../../DESIGN.json) · [SCOPE.md](../../../SCOPE.md) · [SQUARE-REDIRECTS-WALKTHROUGH.md](../../../SQUARE-REDIRECTS-WALKTHROUGH.md)

---

## 1. Feature Summary

Full rebuild of `/book.html` replacing the current intermediate page with an apothecary-style studio menu that surfaces all 6 single sessions plus 2 special offers (Welcome Bundle, Foundation Package), serves all three personas via layered depth, and is forward-compatible with per-service Square URL routing for conversion tracking.

## 2. Primary User Action

Visitor scans the studio menu, expands one or more rows to read prep notes, picks a session, and books. **Success = booking completion.** Failure mode = visitor abandons because they don't know which service is right or because the page feels generic.

## 3. Design Direction

- **Color strategy:** Restrained (per DESIGN.md canon). Atlas Gold at ≤10% of any screen — concentrated on menu numerals, prices, expand affordances, and the Book CTA.
- **Theme scene sentence:** *"A 40-year-old who has been considering buccal release for six months opens /book on her iPhone at 9pm, kitchen lit by an overhead pendant, after Mechelle's Instagram Reel autoplayed past her. She is curious-skeptical but motivated. She wants prices, durations, and proof that this isn't med-spa before she touches Square."*
- **Anchor references:** Aesop product catalog (apothecary menu rows, label precision), Klim Type Foundry specimen pages (italic display + small label restraint), Gray's Anatomy plate captioning (FIG. I, FIG. II markers in Cormorant italic).
- **Probe direction won:** A — vertical stack. Reasons: 60-70% mobile traffic per PRODUCT.md (split-pane collapses to A on mobile anyway); ad-clicked visitors expect linear flow; menu IS the conversion device but doesn't need to be above-the-fold dominant when the header already names "Reserve Your Session."

## 4. Scope

Production-ready. Single file replacement, ~550-650 lines static HTML + inline CSS + ~80 lines JS. No new dependencies. Ships to main. Replaces existing `book.html`.

## 5. Layout Strategy

Vertical stack, `max-width: 1180px` centered. Substrate alternates per The Paper-Layer Rule:

```
┌─ atlas-pitch ───────────────────────────────────────────┐
│  TOP NAV (existing pattern)                             │
│  PAGE HEADER — "Reserve Your <em>Session</em>"          │
├─ atlas-substrate ───────────────────────────────────────┤
│  FIRST-VISIT INTAKE CALLOUT (Carepatron CTA)            │
├─ atlas-pitch ───────────────────────────────────────────┤
│  STUDIO MENU — one continuous menu, two subhead rows:   │
│    "Special Offers"                                     │
│       Welcome Bundle · 2 sessions · 400                 │
│       Foundation Package · 3 sessions · 700             │
│    "Single Sessions"                                    │
│       I.   Restorative Buccal Facial · 90m · 250       │
│       II.  Soothe Lymphatic Drainage · 90m · 250       │
│       III. Procell Microchanneling · 100m · 300         │
│       IV.  Facial Architecture Ritual · 50m · 140       │
│       V.   Aqua Peel · 60m · 200                        │
│       VI.  Back Facial · 50m · 150                      │
├─ atlas-substrate ───────────────────────────────────────┤
│  SQUARE IFRAME EMBED (single, forward-compatible)       │
├─ atlas-forest ──────────────────────────────────────────┤
│  REASSURANCE STRIP (3 items, NO cancel policy)          │
├─ atlas-pitch ───────────────────────────────────────────┤
│  FOOTER (existing pattern)                              │
└─────────────────────────────────────────────────────────┘
```

The menu is **one continuous grid**, not two separate grids. Section subheads (Special Offers / Single Sessions) are full-width subhead rows within the same grid container. This preserves The 1.5px Gridline Rule across the whole menu and reads as a single artifact.

## 6. Key States

| State | Behavior |
|---|---|
| **Default** | All 8 rows collapsed. Iframe loads generic Square URL. |
| **Row expanded** | Row's height transitions via `grid-template-rows: 0fr → 1fr` (NOT max-height — resolves roadmap task #7 implicitly). Reveals prep notes + "Book this session" CTA. Other rows stay open if expanded — multi-open allowed. |
| **Book button clicked** | Smooth scroll to iframe. Iframe receives `data-active-service` attribute. JS swaps `iframe.src` IF a per-service URL exists in `window.ALTRU_SERVICE_URLS`; otherwise no-op. |
| **No JS / reduced motion** | All rows render expanded. Iframe scroll via plain `<a href="#book-embed">` anchor. Fully functional. |
| **Mobile (<640px)** | Menu rows are single-column. All touch targets ≥44px. Reassurance strip wraps. |
| **First visit** | Intake callout always shown — not gated by cookie/storage detection. Visible to everyone; clearly labeled "First visit?" so returning visitors can ignore. |

## 7. Interaction Model

- Row click / Enter / Space → expand-collapse toggle. Multi-open allowed.
- "Book this session" → smooth scroll + iframe-src swap (when configured).
- Iframe URLs configured via:
  ```js
  window.ALTRU_SERVICE_URLS = {
    restorative: 'https://app.squareup.com/appointments/.../start',
    soothe: '...',
    procell: '...',
    // facial-architecture, aqua-peel, back-facial may not have separate URLs
  };
  ```
  If empty/undefined, all books load the generic iframe URL. Graceful degradation.
- Reduced motion respects `prefers-reduced-motion: reduce` from base.css.
- Keyboard nav fully supported; `:focus-visible` outline from base.css.

## 8. Content Requirements

**Header**
- Eyebrow: "MURRAY, UTAH · ALTRU RADIANCE"
- H1: "Reserve Your *Session*" (Session italic gold-light)
- Sub: "Choose a single session or one of two new-client packages. Tap any row for preparation notes."

**Intake callout**
- Eyebrow: "FIRST VISIT?"
- Heading: "Complete your Aesthetic Evaluation"
- Body: "Takes about 5 minutes. Helps me prepare for your session and tailor the work to your skin."
- CTA: "BEGIN INTAKE →" (opens [Carepatron](https://app.carepatron.com/Forms/qWAKKO7HsoetkezXK) in new tab)

**Menu**
As enumerated in Layout. Prep notes lift verbatim from existing book.html (already SCOPE-compliant — no rewrite needed). Roman numerals (I-VI) on single sessions; no numerals on Special Offers (they're outside the numbered sequence).

**Reassurance items (3, no cancel policy)**
- ✓ Free parking on south side of building
- ✓ Confirmation sent by email
- ✓ Questions? Contact me →

## 9. Recommended References for Craft

- [DESIGN.md](../../../DESIGN.md) — colors, typography, The Bottom-Stripe Rule, The 1.5px Gridline Rule
- [DESIGN.json](../../../DESIGN.json) — pre-drafted "Studio Menu Row" component snippet
- [SCOPE.md](../../../SCOPE.md) — for any copy edits
- [SQUARE-REDIRECTS-WALKTHROUGH.md](../../../SQUARE-REDIRECTS-WALKTHROUGH.md) — operational reference for Mechelle's redirect setup
- Impeccable shared design laws: `grid-template-rows` for accordion expand (NOT max-height), no side-stripe borders, no glassmorphism, no shadow on cards at rest

## 10. Open Questions

1. **Cancel policy placement.** Brief defaults to removal from reassurance strip. Alternative: small text line below the iframe linking to /policies. **Resolve at craft-time** — default = remove entirely.

2. **Per-service Square URLs.** Does Mechelle have per-service URLs from Square? If yes, drop them in `ALTRU_SERVICE_URLS`. If no, config stays empty and JS no-ops. **Non-blocking** — wire to empty config and document where they go.

3. **Welcome Bundle "intro" framing.** Menu copy "Welcome Bundle · 2 sessions · 400" vs "Welcome Bundle · 2 sessions · 400 intro". Current welcome-bundle.html frames as introductory. **Default = no "intro" label** in menu copy; keep "introductory" framing on the welcome-bundle landing page itself.

4. **Service badge taxonomy.** Current prep cards use 6 distinct badges (Resurface / Clarify / Regenerate / Signature / Fundamental / Initiate). **Recommendation: drop all 6**, let Roman numerals + service names carry hierarchy. This implicitly resolves roadmap task #3 (badge collapse 6→3) for this page. Other pages will be addressed in roadmap task #3.

---

## Craft handoff notes

When `/impeccable craft /book` is invoked:

1. **Load this brief first** as the canonical specification.
2. **Pull tokens from DESIGN.md frontmatter**, not from the current book.html inline styles (the new file should not inherit any drift).
3. **Lift prep notes verbatim** from current book.html (lines ~349-471). They are SCOPE-compliant and don't need rewrite.
4. **The accordion must use `grid-template-rows: 0fr → 1fr` transition**, not `max-height`. This is a hard requirement per impeccable shared design laws and resolves roadmap task #7 in passing.
5. **JS structure:** one IIFE for the menu accordion + iframe-src swap. Roughly 60-80 lines. No frameworks, no external dependencies, no build step. Read from `window.ALTRU_SERVICE_URLS` config object that ships empty by default.
6. **Test the no-JS state** — visit with JS disabled and confirm all rows are visible, iframe loads, and the anchor link works.
7. **Mobile audit** — every interactive element ≥44×44px tap target. Use the existing base.css `:focus-visible` outline.
8. **SCOPE check** before commit — re-read SCOPE.md for any new copy you add.
