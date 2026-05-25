---
name: Altru Radiance
description: Aesthetic wellness studio in Murray, Utah — a Renaissance anatomical atlas modernized, with apothecary precision in the studio menu.
colors:
  atlas-pitch: "#06100a"
  atlas-substrate: "#0a1810"
  atlas-forest: "#162b1c"
  atlas-gold: "#c9a84c"
  italic-gold: "#e8cc88"
  manuscript-cream: "#f4f0e6"
  sage-mist: "#8aaa8a"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2.6rem, 6.2vw, 5rem)"
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(1.9rem, 3vw, 2.6rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "normal"
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "1.4rem"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 300
    lineHeight: 1.7
    letterSpacing: "0.02em"
  label:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "0.6rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.22em"
rounded:
  none: "0"
  hairline: "2px"
  pill: "9999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "2rem"
  xl: "2.5rem"
  "2xl": "5rem"
components:
  button-primary:
    backgroundColor: "{colors.atlas-gold}"
    textColor: "{colors.atlas-pitch}"
    rounded: "{rounded.none}"
    padding: "0.95rem 2rem"
  button-primary-hover:
    backgroundColor: "{colors.italic-gold}"
    textColor: "{colors.atlas-pitch}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.atlas-gold}"
    rounded: "{rounded.none}"
    padding: "14px 32px"
  button-ghost-hover:
    backgroundColor: "rgba(201,168,76,0.08)"
    textColor: "{colors.atlas-gold}"
  service-card:
    backgroundColor: "{colors.atlas-pitch}"
    textColor: "{colors.manuscript-cream}"
    rounded: "{rounded.none}"
    padding: "2.2rem 2rem 2rem"
  service-card-hover:
    backgroundColor: "{colors.atlas-substrate}"
  trust-pill:
    backgroundColor: "rgba(22,43,28,0.45)"
    textColor: "{colors.sage-mist}"
    rounded: "{rounded.none}"
    padding: "0.45rem 1rem"
  eyebrow:
    textColor: "{colors.sage-mist}"
    typography: "{typography.label}"
  service-badge:
    backgroundColor: "transparent"
    textColor: "{colors.atlas-gold}"
    rounded: "{rounded.hairline}"
    padding: "3px 8px"
---

# Design System: Altru Radiance

## 1. Overview

**Creative North Star: "The Anatomical Atlas, with Apothecary precision in the studio menu."**

The brand reads like a serious illustrated anatomy reference — Vesalius's *De humani corporis fabrica* or a Renaissance medical study, modernized but never reframed as wellness. Italic captions name the muscle. Hairline rules separate illustration from annotation. Gold-foil chapter markers (FIG. 1, FIG. 2) sit on deep-forest parchment. The studio teaches what it does, page by page, with the calm authority of a textbook that doesn't have to sell itself.

Where the brand transitions from teaching to transacting — service menus, pricing tables, booking pages — it shifts to apothecary-grade restraint. Numbered formulations (No. 1, No. 2), label-typography precision, the studio as small-batch maker. Atlas authority dominant; apothecary precision in the cataloging.

This system explicitly rejects the standard med-spa template (stock-photo smiling women, before/after slider as hero, baby-pink and chrome accents, "Specials This Month" banners, Botox-and-Filler navigation), the wellness-mystic lane (crystals, soft-focus, "glow from within"), and the corporate-clinical dermatologist sterility (stark white plus navy, lab-coat photography). The Atlas is dark-toned, parchment-coded, mechanically grounded — never floaty, never clinical-cold.

**Key Characteristics:**
- Deep forest-tinged blacks as substrate, never `#000`
- Two-tone gold accent (Atlas Gold for primary, Italic Gold for emphasis)
- Cormorant Garamond italic ledes as emotional anchor — one per page
- Hairline rules (1.5px gaps, 1px borders at 0.08–0.15 alpha) as structural language
- Sharp edges by default; radius reserved for pill-shaped tap targets
- Bottom-stripe hover (gold scaleX 0→1) as the only card-affordance pattern
- Layered tonal depth — `--deep` and `--forest` are explicit elevation steps, not random surface variations
- Generous editorial line-height (1.7–1.8) on body copy; cap line length at 65–75ch

## 2. Colors: The Atlas Palette

A four-tone substrate (pitch → substrate → forest → cream) layered as parchment depth, accented by a vintage gold pair and a single sage-mist for labels. The palette is forest-and-gold, never green-and-brass — every value has been tinted toward the same warm-deep hue family.

### Primary

- **Atlas Gold** (`#c9a84c`): The chapter-marker color. Used for primary CTAs, the "FIG." eyebrow markers, italic em accents in body copy, active carousel dots, the trust-bridge hover state, and the bottom-stripe affordance. Vintage gold-foil — never bright, never metallic-chrome, never the gold of a casino sign. Saturation deliberately muted so it reads as restraint, not warning.

- **Italic Gold** (`#e8cc88`): The page-edge gold. Used for italicized phrases in headings (`<em>` inside `h1`, `h2`, `h3`), pricing values in Cormorant Garamond, the philosophy section's pillar markers (1, 2, 3), and the trust-bridge's `--gold-light` callouts. Reads as gold-foil viewed at an angle — softer, paler, gentler than Atlas Gold.

### Neutral

- **Atlas Pitch** (`#06100a`): The substrate. Default page background, service-card resting state, nav bar (at 0.97 alpha). Forest-tinted near-black — never `#000`. The most-used color in the system; this is the parchment of the atlas.

- **Atlas Substrate** (`#0a1810`): The next paper layer. Used for elevated sections (Trust Bridge, Philosophy, Testimonial Carousel), service-card hover state, and tonal contrast against `atlas-pitch`. Reads as a slightly lifted plate page beneath the topmost.

- **Atlas Forest** (`#162b1c`): The deepest tonal step. Used as the card-surface color on the live Reviews widget (when in `surface-container` mode), result-card backgrounds, and any context needing a third elevation layer. Reads as forest binding or interior leaf.

- **Manuscript Cream** (`#f4f0e6`): Primary body-text color, hero headline color, italic em color when not using Italic Gold. Warm cream, not pure white. The page-color of an aged manuscript — readable, never sterile.

- **Sage Mist** (`#8aaa8a`): Label and eyebrow color. Used for all uppercase letter-spaced category labels, secondary annotations, footer text, and supporting metadata. Sage-green-grey — a quiet companion to the gold pair, never competing with it.

### Named Rules

**The Italic Anchor Rule.** Each section can carry its own italic emphasis at its own scale. The hero `h1`'s em is the page's primary anchor; subsequent section headings, sub-headings, and Journal ledes may each carry their own italic phrase at smaller scales — they don't compete because they aren't at the same visual weight. Italic Cormorant Garamond + Italic Gold is still the ONLY accent treatment for emphasis. No underline, no background color, no scale change on the accent itself. The italic carries hierarchy alone. **Failure mode**: two italic anchors at the SAME visual scale competing for the same emphasis tier (e.g., two h1-sized italic phrases in the hero, or two equal-weight emphases in a single paragraph). Multiple italic phrases at different scales or in different sections are fine and often desirable — each anchors its own zone.

**The Atlas Gold Rarity Rule.** Atlas Gold is used on ≤10% of any given screen. Its rarity is the point. The skeptical-curious visitor's eye should land on Atlas Gold instances and read them as "the studio is pointing here" — a CTA, a price, a chapter marker. If gold is everywhere, it's nowhere.

## 3. Typography: Cormorant Garamond × Jost

**Display Font:** Cormorant Garamond (with Georgia, serif fallback) — italic and roman, weights 300/400/500.

**Body Font:** Jost (with system-ui, sans-serif fallback) — weights 300/400/500.

**Character:** A Renaissance text-face paired with a clean geometric sans. Cormorant carries the editorial-italic voice; Jost carries the practical-label voice. The pairing is the visual equivalent of "anatomically specific but accessibly written" — serif authority over sans clarity.

### Hierarchy

- **Display** (Cormorant Garamond 300, `clamp(2.6rem, 6.2vw, 5rem)`, line-height 1.12): Hero `h1` only. Reserved for the single biggest statement on a page. The em-italic phrase inside it carries the emotional anchor.

- **Headline** (Cormorant Garamond 300, `clamp(1.9rem, 3vw, 2.6rem)`, line-height 1.1): Section heads (`.section-heading`). Used at major narrative transitions. Always paired with an eyebrow label above and a gold-rule below.

- **Title** (Cormorant Garamond 300, `1.4rem`, line-height 1.2): Service card names, journal article titles in cards, sub-section headings. The serif voice at smaller scale — keeps editorial register at the card level.

- **Body** (Jost 300, `0.9rem` desktop / `1rem` mobile, line-height 1.7): Default reading text. Line-height generous (1.7–1.8) because the demographic skews 35–55. Max line length 65–75ch. Mobile floor of 16px (`1rem`) is enforced; all sub-16px body selectors get bumped on mobile (see `base.css`).

- **Label** (Jost 400, `0.6rem`, letter-spacing `0.22em`, uppercase): Eyebrows, trust pills, service badges, footer category labels, button text. The sans voice at its quietest — supports the editorial display without competing.

### Named Rules

**The Italic Accent Rule.** Italic Cormorant Garamond + Italic Gold (`#e8cc88`) is the ONLY treatment for emphasis inside a heading. Never underline a heading. Never apply background color to emphasized text. Never bold. The italic is the entire grammar of emphasis in this system. Cross-page consistency: hero h1 em, section heading em, and journal lede italic are all the same visual move at different scales.

**The Generous Line-Height Rule.** Body line-height never drops below 1.6. Demographic skews 35–55; eye fatigue is real. Pillar text, philosophy paragraphs, and Journal articles use 1.7–1.8. Tight line-heights are reserved for short label/eyebrow text only.

## 4. Elevation: Layered Tonal Depth

The system has no shadow vocabulary in the traditional sense. Depth comes from **layered tonal substrate** — three explicit page-color steps (`atlas-pitch` → `atlas-substrate` → `atlas-forest`) that read as paper layered on paper. A section change is a substrate change.

Shadows appear only as a response to a small set of interactive affordances: the carousel `.ba-handle` draggable divider (`0 2px 12px rgba(0,0,0,0.5)`) and a few transient hover lifts (`translateY(-1px)` on `.hero-cta-primary`). Beyond those, depth is paper, not light.

### Tonal Vocabulary (used instead of shadows)

- **Substrate** (`atlas-pitch` `#06100a`): The base sheet. Body, default sections, nav.
- **First Layer** (`atlas-substrate` `#0a1810`): Elevated sections. Trust Bridge, Philosophy, Testimonials.
- **Second Layer** (`atlas-forest` `#162b1c`): Cards on elevated sections. Reviews-grid cards, result-cards.

The transitions between layers are always accompanied by a 1px gold-tinted top-and-bottom border at 0.08–0.12 alpha — the section "frame" rather than a shadow drop.

### Named Rules

**The No-Shadow Rule.** Cards do not have box-shadows at rest. Drop-shadows are reserved for the carousel handle and the live-update fade animation only. Hover lifts use `translateY` micro-movements (≤2px) plus the bottom-stripe affordance, never a shadow swap-in.

**The Paper-Layer Rule.** When introducing a new section, choose its substrate (`atlas-pitch`, `atlas-substrate`, `atlas-forest`) deliberately — adjacent sections must contrast tonally. Two adjacent sections on the same substrate read as one undifferentiated wall.

## 5. Components

### Buttons

Three variants. Sharp-cornered by default. All use Jost 400, `0.6rem`, letter-spacing `0.22em`, uppercase. Tap target floors enforced (`min-height: 48px` for hero CTAs; `44px` for nav and footer affordances).

- **Primary** (`button-primary`): Atlas Gold background, Atlas Pitch text. Padding `0.95rem 2rem`. Hover swaps to Italic Gold + `translateY(-1px)`. Used for hero primary CTA, journal article CTAs, "Book Now" actions.

- **Ghost** (`button-ghost`, `.btn-ghost`): Transparent background, Atlas Gold text, 1px gold border at 0.35 alpha. Padding `14px 32px`. Hover applies `rgba(201,168,76,0.08)` tint background and brightens the border. Used for secondary actions across all pages — "Read Full Technique," "Browse Journal," "View Results."

- **Hero Ghost** (`.hero-cta-ghost`): Variant of ghost button with Manuscript Cream border instead of gold. Used only when the primary CTA is already gold and a contrasting secondary is needed. Hover shifts border to Atlas Gold.

### Chips & Pills

- **Trust Pill** (`.trust-pill`): Sage Mist text, `rgba(138,170,138,0.25)` border, `rgba(22,43,28,0.45)` background. Padding `0.45rem 1rem`. Used in the hero trust-bar above the CTAs ("Licensed Master Esthetician," "Visible results," etc.). Includes a Atlas Gold "✓" check-mark inline.

- **Service Badge** (`.service-badge`): Atlas Gold text, 1px gold border at 0.3 alpha, 2px hairline radius. Padding `3px 8px`. Used as category eyebrows inside service cards ("Signature Service," "Adjuvant Treatment").

- **Slide Tag** (`.slide-tag`, `.slide-tag-muted`): Smaller variant of trust-pill used inside before/after carousel slides. Two-tone — gold variant for primary tags, cream variant for muted/contextual tags.

### Cards / Containers

- **Service Card** (`.service-card`): Atlas Pitch background, no border-radius. Padding `2.2rem 2rem 2rem`. Hover transitions background to Atlas Substrate AND animates a 2px Atlas Gold bottom-stripe via `::after` from `scaleX(0)` to `scaleX(1)` over 0.35s ease. No drop-shadow, no lift. **The Bottom-Stripe Rule** applies (see below).

- **Result Card** (`.result-card`): Atlas Forest background. 3:4 aspect ratio. Image with gradient overlay on bottom 55%. Service-category label and Cormorant Garamond title positioned absolutely at bottom. No hover state beyond cursor pointer (cards link out to results page).

- **Review Slide** (`.review-slide`): Used in the live Google Reviews carousel. Cormorant Garamond italic quote with "" curly-quote pseudo-elements, hairline gold border separating quote from author block, author name in uppercase Jost label.

### Inputs / Fields

The site is mostly static with a Square iframe for booking. The few inputs that exist (search on policies page, contact form on contact page) use:

- Transparent background, 1px Sage Mist border at 0.3 alpha, no radius.
- Focus shifts border to Atlas Gold, plus `:focus-visible` outline (gold-light, 2px, 2px offset — defined in `base.css`).
- Cream text, Sage Mist placeholder.

### Navigation

- **Desktop Nav** (`nav`): Fixed top, 68px height, 0.97-alpha Atlas Pitch background, 1px gold-tinted bottom border. Brand mark on left (Cormorant uppercase letter-spaced 0.28em + Sage Mist subline). Link list center-right, all Jost 0.6rem uppercase letter-spaced 0.2em. Primary CTA pill on far right (Atlas Gold pill, Atlas Pitch text).

- **Mobile Menu** (`.mobile-menu`): Full-screen overlay at 60px top offset. Italic Cormorant Garamond links (1.75rem, italic), centered, gap 2.25rem. Backdrop-filter `blur(10px)` on a 0.98-alpha Atlas Pitch base. Tap target floor 48px on the menu CTA.

### Eyebrows / Section Heads

- **Eyebrow** (`.eyebrow`): Jost 400, `0.6rem`, letter-spacing `0.25em`, uppercase, Sage Mist. Always appears above a section heading and a gold-rule.
- **Gold Rule** (`.gold-rule`): 40×1px Atlas Gold at 0.5 alpha. Margin `1.25rem auto`. Variant `.gold-rule.left` aligns to the start.
- **Section Heading** (`.section-heading`): Cormorant Garamond 300, line-height 1.1. The `<em>` inside is Italic Gold. Each section's em is its own italic anchor at the section's scale (see The Italic Anchor Rule).

### Signature Component: The Before/After Slider

The hero showcase carousel features draggable before/after panels with a gold-handle divider. Slide track uses `transform` with `cubic-bezier(0.4, 0, 0.2, 1)` over 0.65s. Each slide pairs:

- Service badge (gold, uppercase, hairline radius) above
- Side-by-side image clip via `clip-path: inset(0 calc(100% - var(--split, 50%)) 0 0)`
- Atlas Gold 2px draggable divider with 32×32px pill-shaped handle (`box-shadow: 0 2px 12px rgba(0,0,0,0.5)`)
- "BEFORE" / "AFTER" labels in opposite corners (cream on left, gold on right)
- Cormorant Garamond italic result headline + Jost result note in the slide footer

This is the design's signature persuasion device for the skeptical-curious persona. The interaction itself is proof: drag to see the change.

### Named Rules

**The 1.5px Gridline Rule.** Multi-column grids (services, journal, results) use a 1.5px `gap` with a darker tint (`rgba(201,168,76,0.08)`) on the grid container as background. The gap reveals the tint, creating a hairline rule between cells without using cell borders. Never apply `border` to grid items — the gap IS the rule.

**The Bottom-Stripe Rule.** Hoverable cards (`.service-card`, `.journal-card`, any future card primitive linking out) get an animated 2px gold bottom-stripe via `::after` with `transform: scaleX(0)` → `scaleX(1)` and `transform-origin: left`. Never a glow, never a border-color shift, never a lift greater than 2px. The stripe is the entire hover affordance.

**The No-Radius Rule.** Border-radius is reserved for pill-shaped tap targets only — carousel dots (`50%`), the draggable carousel handle (`50%`), the round logo placeholder (`50%`), and one `2px` hairline radius on `.service-badge` and similar small label-pills. Everything else — cards, buttons, inputs, sections — is sharp-cornered. Radius is a feature, not a default.

## 6. Do's and Don'ts

### Do:

- **Do** lead every hero with one italic Cormorant Garamond phrase in Italic Gold (`#e8cc88`). One per page, always inside the `h1`'s `<em>`. The italic carries the emotional anchor.
- **Do** anchor color decisions to the seven named tokens (Atlas Pitch, Atlas Substrate, Atlas Forest, Atlas Gold, Italic Gold, Manuscript Cream, Sage Mist). No off-token greys, no off-token golds, no bright accents.
- **Do** use tonal layering (`atlas-pitch` → `atlas-substrate` → `atlas-forest`) for section depth. Adjacent sections must contrast tonally.
- **Do** apply the 1.5px gap pattern to all multi-column primary grids. The gap with tinted background creates the hairline rule.
- **Do** use the bottom-stripe pattern as the sole card-hover affordance. `transform: scaleX(0 → 1)` over 0.35s with `transform-origin: left`.
- **Do** cap body line length at 65–75ch and never drop body line-height below 1.6.
- **Do** name muscles, tissues, and mechanisms specifically. Buccinator, masseter, SMAS, mechanotransduction, lymphatic flow. Anatomy is the proof.
- **Do** number the studio menu apothecary-style (No. 1, No. 2) in pricing/booking surfaces. Atlas authority in editorial; apothecary precision in catalog.
- **Do** keep Atlas Gold at ≤10% of any given screen. Its rarity is the point.

### Don't:

- **Don't** use `#000` or `#fff` anywhere. Every neutral is tinted toward the forest-gold hue family.
- **Don't** use side-stripe `border-left` or `border-right` greater than 1px as a colored accent. Side stripes are an absolute ban (per impeccable shared design laws). Use full borders, tonal substrate shifts, or the bottom-stripe ::after pattern instead.
- **Don't** use gradient text (`background-clip: text` + gradient). Single-color text. Emphasis via italic + Italic Gold, not gradients.
- **Don't** introduce glassmorphism on cards or surfaces. The mobile menu's single `backdrop-filter` is the only sanctioned use.
- **Don't** apply `border-radius` to cards, buttons, inputs, or sections. Radius is reserved for pill-shaped tap targets. Sharp-cornered is the default — match the editorial-atlas register.
- **Don't** drop shadows on cards at rest. The system uses tonal layering, not box-shadows. Shadows appear only on the carousel handle and the live-update fade animation.
- **Don't** stack two italic accents in the same heading hierarchy. One italic em per page is the anchor; competing italics dilute the signal.
- **Don't** use generic wellness vocabulary — no "glow from within," "self-love ritual," "holistic healing journey," "transformative," "radiant." Replace with anatomical or mechanical language.
- **Don't** style the brand as a med-spa. No stock-photo smiling women, no before/after slider as the hero, no baby-pink or chrome accents, no "Specials This Month" banners, no "Schedule Your Consultation" formality. The single biggest reflex any reviewer might have for a Utah aesthetics studio — and the exact thing this brand is the opposite of.
- **Don't** style the brand as wellness-mystic. No crystals, soft-focus, sage-and-hand-lettered fonts, "glow from within" pull quotes, Pinterest-mood-board energy.
- **Don't** style the brand as corporate-clinical dermatologist. No stark white plus navy, no lab-coat photography, no sterile geometry, no stock cross-section diagrams.
- **Don't** style the brand as templated Squarespace day-spa. No centered-everything beige minimalism, no lavender fields, no "Mind Body Soul" headers.
- **Don't** format pricing as Groupon-style headlines. Pricing is supporting detail in apothecary-precision menu format (No. 1, name, duration, price) — never the headline.
- **Don't** use exclamation points or em dashes. Use commas, colons, semicolons, periods, or parentheses. No emojis anywhere.
