# Spec — Service duration 110 min → 90 min (site-wide)

> Executed 2026-06-03. Edit #1 of the site-wide polish pass. Status: **done in working tree,
> awaiting Andrew's commit/deploy.** No commit, no push performed.

## What changed & why

Two services shortened from **110 → 90 minutes** (prices unchanged): **Restorative Buccal
Facial** and **Soothe Lymphatic Drainage**. Customer-facing duration now reads **90 minutes,
flat** — no "110" anywhere on the live site, no compound "+ aesthetic support" framing (none
existed). Two packages kept consistent: **Murray Welcome Bundle** (1 of each) and **Foundation
Package** (3× Restorative Buccal Facial).

## Decisions (Andrew)

- Proceed with this plan-mode spec (not the /ultraplan workflow).
- Prose wording: **Option A — flat "90 minutes"** applied to all 7 prose lines (P6 total = "Three hours").
- Update all six non-site reference files too; flag external platforms.

## Result: 71 replacements / 21 files

**Live pages (15) — 54 numeric + 7 prose:**

| File | Numeric 110→90 | Prose |
|---|---|---|
| restorative-facial.html | 20 (meta/OG/Twitter, JSON-LD ×4, body, aria-label, mobile bar) | — |
| book.html | 4 (bundle list ×2, Restorative + Soothe menu rows) | — |
| services/restorative-buccal-release.html | 4 (JSON-LD, meta-item, body, sidebar) | — |
| services/lymphatic-drainage-murray-utah.html | 2 (meta-item, sidebar) | — |
| index.html | 6 (JSON-LD ×3, 2 service cards, `2 × 90 min` bundle card) | — |
| foundation-package.html | 4 (FAQ ×2, JSON-LD ×2) | P7 (963): "approximately 90 minutes" |
| welcome-bundle.html | 4 (FAQ, JSON-LD ×3) | P1 652, P2 689 badge, P3 1000, P4/P5 1002-3 `(90 min)`, **P6 1016 "Three hours"** |
| membership.html | 1 (monthly session) | — |
| thanks-restorative.html | 1 | — |
| thanks-soothe.html | 1 | — |
| journal/tmj-relief-facial-release.html | 2 | — |
| journal/lymphatic-drainage-benefits-salt-lake-city.html | 2 (body, JSON-LD) | — |
| journal/what-is-buccal-manipulation.html | 1 | — |
| journal/myofascial-release-facial-salt-lake-city.html | 1 | — |
| journal/hands-first-facial-alternatives.html | 1 | — |

**Non-site reference files (6) — 10 numeric:** CLAUDE.md (1), DESIGN.json (2),
ADS-PLAYBOOK.md (2), SQUARE-REDIRECTS-WALKTHROUGH.md (2), gbp-posts.md (1),
docs/superpowers/specs/2026-05-24-book-page-shape.md (2).

## Bundle totals

- **Welcome Bundle:** 2 × 90 = 180 min. Prose total "Four hours" → **"Three hours"** (exact).
- **Foundation Package:** 3 × 90 = 270 min (4 hr 30). **No summed total is displayed anywhere**
  on the site — only per-session prose ("approximately 90 minutes") — so no 270/4hr30 figure was
  invented. If a total is ever added, use 270 min / 4 hr 30.

## Left untouched (verified non-duration)

`110px`/`1100px`/`110%` CSS; SVG coords; `index.html` "50-minute" Facial Architecture Ritual;
all prep/aftercare/policy/business-hours "hours"; `220`/`330` (SVG, Utah bill SB 330, line refs);
`sitemap.xml`/`robots.txt` (no durations; no `llms.txt`). **`.brainstorm/*.html` scratch files
(4 files, 12 hits) excluded per `todo.md`.** Pre-existing dirty `ads-import/bulk-upload.csv` and
3 untracked `tasks/*.md` files not touched / not staged.

## Flagged for MANUAL update — cannot change from repo

1. **Square booking backend** — `book.html` embeds the Square appointments iframe; the bookable
   durations live in Square's dashboard. Update there.
2. **Live Google Business Profile** — if the gbp-posts.md content was already posted, edit the live post.
3. **Live Google Ads** (acct 857-072-1509) — check RSA copy/assets for "110 min".
4. **Data hygiene (separate):** `DESIGN.json` sample shows Soothe `60 min` / Facial Architecture
   `75 min`, inconsistent with the live site (now 90 / 50). Pre-existing; out of scope.

## Verification performed

- Re-grep: zero `110 min`/`110-minute`/`110 minutes`/`110m` duration tokens in any live/doc file
  (only `.brainstorm` scratch retains them, by design).
- Re-grep: all old prose strings gone; new 90-min prose present and reads naturally.
- `DESIGN.json` still valid JSON. `index.html` card now `2 × 90 min`. Diffstat balanced 75/75.
