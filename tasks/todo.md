# Site-wide polish pass — 2026-05-25

> Per-page polish loop. Andrew supplies copy + visual changes per page (verbatim). Claude applies them precisely and proposes UX/engagement improvements within the restrained brand. Marketing pages get sharper focus toward conversion; standard pages get consistency polish only. Loop defined in CLAUDE.md.

## Division of labor

- **Andrew owns copy.** Verbatim find/replace only. No silent edits. Spelling/grammar issues are FLAGGED, never auto-fixed.
- **Claude owns frontend.** Layout, structure, styling, components, motion, responsiveness, accessibility, performance.
- Marketing pages — sharper hierarchy and CTA emphasis. Same calm palette + voice as the rest of the site.
- Standard pages — consistency polish only (spacing, type rhythm, focus states, links).

## Page inventory (full repo)

Legend: ⬜ pending · 🔄 in review · ✅ approved/done · ⏸ no changes needed · ❓ confirm scope

### Marketing pages — root level
- [x] ✅ `index.html` — homepage *(reviewed 2026-05-26 — changes applied — APPROVED)*
- [ ] ⬜ `restorative-facial.html` — primary Google Ads landing (highest revenue impact)
- [ ] ⬜ `services.html` — services hub (top-of-funnel)
- [ ] ⬜ `programs.html` — programs hub
- [ ] ⬜ `foundation-package.html` — package landing
- [ ] ⬜ `welcome-bundle.html` — package landing
- [ ] ⬜ `membership.html` — membership landing
- [ ] ⬜ `about.html` — practitioner positioning + trust
- [ ] ⬜ `results.html` — proof / portfolio
- [ ] ⬜ `book.html` — booking
- [ ] ⬜ `contact.html` — contact

### Service detail pages — `/services/` (SEO + service depth)
- [ ] ⬜ `services/restorative-buccal-release.html`
- [ ] ⬜ `services/facial-architecture-ritual.html`
- [ ] ⬜ `services/lymphatic-drainage-murray-utah.html`
- [ ] ⬜ `services/microneedling-murray-utah.html`
- [ ] ⬜ `services/aqua-peel-murray-utah.html`
- [ ] ⬜ `services/back-facial-murray-utah.html`

### Journal — `/journal/` (content/SEO)
- [ ] ⬜ `journal.html` — journal index
- [ ] ⬜ `journal/what-is-buccal-release.html`
- [ ] ⬜ `journal/how-breathing-shapes-your-face.html`
- [ ] ⬜ `journal/tmj-relief-facial-release.html`
- [ ] ⬜ `journal/myofascial-release-facial-salt-lake-city.html`
- [ ] ⬜ `journal/lymphatic-drainage-benefits-salt-lake-city.html`
- [ ] ⬜ `journal/hands-first-facial-alternatives.html`

### Standard / utility
- [ ] ⬜ `policies.html`
- [ ] ⬜ `privacy.html`
- [ ] ⬜ `404.html`
- [ ] ⬜ `thanks-restorative.html` — post-conversion thank-you
- [ ] ⬜ `thanks-procell.html` — post-conversion thank-you
- [ ] ⬜ `thanks-soothe.html` — post-conversion thank-you

### ❓ Confirm scope — Andrew, are these live/public or internal?
- [ ] ❓ `ad-previews.html` — looks like internal ad-creative preview. Include in pass or skip?
- [ ] ❓ `small-video-about.html` — looks like a scratch/draft. Live or skip?

### Excluded (exploration only — not live)
- `.brainstorm/*.html` (5 files) — scratch / design exploration. Skipped.

**Inventory totals:** 33 live pages confirmed + 2 to confirm = up to 35 pages in scope.

## Per-page loop (every page gets this)

1. **INTAKE** — Andrew pastes block: `PAGE` / `TEXT CHANGES` / `VISUAL CHANGES` / `PAGE TYPE`.
2. **PLAN** — restate; list verbatim text changes; flag spelling/grammar (no auto-fix); restate visuals; propose numbered Claude UX/engagement improvements. Wait for approval.
3. **IMPLEMENT** — apply approved changes; minimum code surface; no bolt-ons.
4. **SELF-VERIFY** — render, responsive (375/768/1280), internal links resolve, prefers-reduced-motion honored, copy untouched beyond approved find/replace.
5. **INVENTORY + HANDOFF** — close with `INVENTORY STATUS: <filename> — reviewed — [changes applied | no changes needed] — APPROVED`. Update this file. Suggest next page.

## Suggested priority order (Andrew confirms or redirects)

1. `index.html` — Andrew's starting choice
2. `restorative-facial.html` — primary ads landing, direct revenue
3. `services.html` — funnel entry
4. `programs.html` + 3 package landings (foundation, welcome bundle, membership)
5. `about.html` — practitioner authority
6. `results.html`, `book.html`, `contact.html`
7. 6 service-detail pages
8. `journal.html` + 6 articles
9. Standard/utility (`policies`, `privacy`, `404`, 3 thanks pages)
10. ❓ pages — pending Andrew's scope call

## Standing constraints (carried into every page)

- No deploys — Andrew deploys himself after sign-off.
- No edits to files outside the current page's scope without flagging.
- Preserve forest-green/gold palette + Outfit/Inter type voice. No new colors/fonts without approval.
- Honor existing CSS variables / tokens — read `DESIGN.md` / `DESIGN.json` when in doubt.
- Motion = slow, organic, breathing. Transform/opacity only. `prefers-reduced-motion` wrapper always.
- Accessibility — readable contrast, focus states, heading order, alt text present (flag missing, don't invent).
- Internal-link changes must respect `_redirects` (see `lessons.md` L1, L4, L5).

## Per-page review log

### `index.html` — reviewed 2026-05-26 — APPROVED

**Andrew's verbatim text changes (6 applied):**
1. Hero sub (line ~1447) — added "facial architecture" (lowercase, no "Ritual"), single space (FLAG 1 fixed).
2. Philosophy paragraph (line ~1840) — "body as a whole system" → "skin as a whole system".
3. Result card 1 label — `Facial Lift & Lymphatic Support · 1 Session` → `Tissue Lift & Lymphatic Support`.
4. Result card 2 label — `Cervical Softening & Jaw Release · 1 Session` → `Profile Architecture & Buccal Support`.
5. Result card 3 label — `Skin Vitality & Visible Radiance · 1 Session` → `Skin Vitality & Fascia Support`.
6. Results disclaimer — appended `after 1 session.`

**Andrew's visual changes (5 applied):**
- **V1** Hero glossary readability — opacity 0.58 → 0.75, font bumped to clamp(0.84rem, 1.55vw, 0.94rem), soft text-shadow halo so it reads over rotating video.
- **V2** Hero breathing room — eyebrow/H1/sub/glossary margins bumped ~30%, H1 line-height 1.12 → 1.18. Mobile sizes followed proportionally.
- **V3** Hero CTA pair removed — HTML block + all `.hero-cta-*` CSS (incl. mobile overrides) deleted.
- **V4** Carousel before/after labels fade as divider passes — CSS `clamp(0, calc((var(--split-num) ± thresh)/12), 1)` driven by JS-maintained unitless `--split-num`.
- **V5** Real Results section — removed three `result-card-tag` overlays AND three `result-card-service` category labels. CSS for both classes also removed. Each card now shows image + descriptive label only.

**Claude proposals (all approved + applied):**
- **P1** Result cards quieter at rest — gradient 0.95 → 0.7, brightens to 0.88 on hover. Image zoom to 1.03× on hover (0.6s cubic-bezier).
- **P3** `cursor: pointer` dropped from `.result-card` (cards are decorative, not links).
- **P4** Hero gold rule breathing — 5s ease-in-out infinite opacity oscillation (0.6 ↔ 1.0). Reduced-motion honored via global rule.
- **P5** Hero glossary fade-in on first paint — 1.2s ease-out 0.4s delay, both fill mode. Reduced-motion honored.
- **P6** Service card arrow opacity 0.3 → 0.5 at rest (still hover-brightens to full).
- **P7** Reviews carousel pause-on-hover — verified already implemented in `assets/js/reviews-widget.js:185-192` (mouseenter/mouseleave + focusin/focusout). No code added.

**New carousel handle lifecycle (replaces old has-hint pulse):**
- Default at rest: outline only, 1px gold border at 35% alpha, ↔ symbol hidden via `color: transparent`.
- Active (hover, drag, focus-visible): 30% gold fill, ↔ visible, divider line brightens to full gold.
- 1s slow ease back to rest after interaction; 0.25s fast ease into active state.
- 800ms post-interaction linger via JS timer so brief pointerup doesn't snap-fade.
- First-paint affordance hint: JS-driven 3× brief active-state flash on slide-1's handle (no scale pulse). Cancels on first real user interaction. Skipped under `prefers-reduced-motion`.
- Old `@keyframes ba-handle-pulse` + `.has-hint` CSS removed.

**FLAG 2 — facial architecture rename:** held at scope (a) hero-only per Andrew's confirmation. Page `<title>`, meta description, OG title/description, BeautySalon schema, and the two Service schema entries (Facial Architecture Ritual at line ~1281, founder bio at ~1179) still reference the full uppercase "Facial Architecture Ritual" intentionally — service is unchanged, hero is doing philosophical work. No SEO/Ads risk.

**Self-verify results:**
- Grep confirms zero orphan references to removed classes (`hero-cta*`, `result-card-tag`, `result-card-service`, `ba-handle-pulse`, `has-hint`).
- All 6 verbatim text changes confirmed in place.
- All new CSS variables and JS hooks (`--split-num`, `activateHandle`, `scheduleDeactivate`, `hero-line-breathe`, `hero-glossary-fade`, `.is-active`) wired correctly.
- Internal links on the page unchanged (no link edits made).
- `prefers-reduced-motion` honored — new animations inherit the global rule that sets `animation-duration: 0.01ms` and `transition-duration: 0.01ms`.

**INVENTORY STATUS: index.html — reviewed — changes applied — APPROVED**

---

*(next entries populate as each page completes)*

---

## Site-wide data edits (cross-cutting)

> For changes that touch one fact across many pages (durations, prices, address, phone, hours).
> Not part of the per-page loop. Reusable loop: **INTAKE** (what fact, old → new) → **PLAN**
> (grep a full catalog of every hit; classify change / leave / flag; pick prose wording) →
> **IMPLEMENT** (encoding-safe byte pass scoped to the catalog; never `.brainstorm` scratch) →
> **VERIFY** (re-grep zero old tokens; spot-check schema, meta, cards) → **FLAG** external stores
> (Square backend, GBP, Google Ads) → stage, no deploy. To start the next one, hand me the fact + old → new.

- [x] **Edit 1 — Service duration 110 → 90 min** *(2026-06-03)*. Restorative Buccal Facial +
  Soothe Lymphatic Drainage 110 → 90; Welcome Bundle prose total → "Three hours" (180 min);
  Foundation per-session → 90 min. **71 replacements across 21 files** (15 live + 6 reference docs).
  Prose set to flat "90 minutes" (Option A). Spec: `tasks/duration-90-edit-2026-06-03.md`.
  Flagged for manual update: Square booking backend, live GBP posts, live Google Ads.
  **Done in working tree — awaiting Andrew's commit/deploy.**
- [ ] **Edit 2 — (next)**: hand me the fact + old → new.

---

# Archived passes

## Archived: Journal broken-link audit (completed 2026-05-19)

> Job: scan `journal.html` + `journal/*.html` for internal links that 404, report each, and apply HIGH-confidence fixes.

### Plan checklist

- [x] **Discovery**: extract every internal `<a href>` from journal index + all 6 article files, with line numbers
- [x] **Manifest**: build the set of valid URLs in the repo (root HTML, `services/*.html`, `journal/*.html`, `_redirects` entries)
- [x] **Classify**: for each link, mark VALID / BROKEN. For BROKEN, propose a fix with HIGH / MEDIUM / LOW confidence
- [x] **Report**: write `tasks/journal-broken-links.md` with summary + per-link detail
- [x] **Apply**: edit affected files for HIGH-confidence fixes only
- [x] **Self-verify**: re-run scan, confirm zero HIGH-confidence breakage remains
- [x] **Review section** below: summarize what changed, what was flagged, what assumptions were made
- [x] **Wait for user verification** before commit/deploy → user chose option (a), build /programs page
- [x] **Build /programs hub page** (resolves the 21 flagged occurrences)
- [x] **Site-wide verification scan** → found one extra HIGH-confidence fix on `/results`
- [x] **Commit + deploy** → live at https://altru-radiance.pages.dev/programs

### Result summary

Applied **4 HIGH-confidence link edits across 2 files** in `journal/`; built `/programs` hub page to resolve 21 nav-level `/programs` references; site-wide verification scan caught one additional HIGH-confidence fix on `/results`. Commit + deploy live. Root cause: journal articles referenced planned-but-never-built service slugs (`/buccal-massage-slc`, `/structural-integration`, `/tmj-facial-massage-murray-ut`). Full detail in `tasks/journal-broken-links.md`.
