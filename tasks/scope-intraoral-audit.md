# Scope language audit — "intraoral / inside the cheek-or-mouth / deep"

> Standalone task brief (created 2026-05-29). Separate from the per-page polish pass.
> Goal: minimize Utah-esthetician SCOPE-sensitive language site-wide. Reframe toward
> **"buccal manipulation / buccal release / buccal technique"**. The service name
> "Restorative Buccal Facial" is approved; "buccal" (cheek) is fine. Avoid "intraoral"
> and "inside the cheek/mouth". Review "deep [tissue/muscle/manual]".

## Rules (do NOT blind find-replace — triage by category)
1. **Visible body copy** → revise freely to buccal framing. Don't invent claims; flag wording for Andrew.
2. **Image ALT text** → revise wording where easy. Lower priority.
3. **Image FILENAMES** (e.g. `buccal-massage-intraoral.webp`) → DO NOT rename (hosted assets; renaming breaks refs).
4. **SEO: `<meta description>`, `<meta keywords>`, JSON-LD schema** → "intraoral buccal facial Utah" is a deliberate SEARCH TERM. Removing it can cost ranking. Requires Andrew's explicit per-page SEO sign-off. Flag, don't auto-remove.

## Findings (file : line) — baseline 2026-05-29

### A. "intraoral" — visible body copy (HIGH, revise first)
- restorative-facial.html: 738, 771, 1043, 1051
- foundation-package.html: 822, 935, 1015, 1182
- results.html: 1012, 1060
- membership.html: 277
- book.html: 696, 764
- journal/what-is-buccal-release.html: 321, 332, 334, 350  (see special note)
- journal/myofascial-release-facial-salt-lake-city.html: 348
- index.html: 1614  (being handled in the active index polish — verify before editing)

### B. "intraoral" — SEO meta / keywords / schema (HIGH, needs SEO sign-off)
- restorative-facial.html: 13 (desc), 14 (keywords), 24 (og), 36 (twitter), 514 (schema category)
- foundation-package.html: 12, 597, 1459, 1502, 1534
- index.html: 1338 (schema desc)

### C. "intraoral" — image alt text / filenames (LOW; do not rename files)
- index.html: 2033-2034 (alt), 2040 (excerpt)
- journal.html: 322 (alt)
- journal/hands-first-facial-alternatives.html: 437
- journal/how-breathing-shapes-your-face.html: 474, 482
- journal/lymphatic-drainage-benefits-salt-lake-city.html: 426
- journal/myofascial-release-facial-salt-lake-city.html: 391, 450
- foundation-package.html: 991 (filename in src)

### D. "inside the cheek / inside the mouth"
- restorative-facial.html: 771, 1043
- foundation-package.html: 1015, 1182
- journal/what-is-buccal-release.html: 321, 334, 350

### E. "buccinator / masseter" (MEDIUM — clinical muscle names)
- journal/what-is-buccal-release.html: 332, 333, 334, 364
- restorative-facial.html: 738, 771, 952
- foundation-package.html: 805, 822, 869, 874, 882, 883, 1182, 1368, 1518
- welcome-bundle.html: 913, 918, 926, 927
- results.html: 1197
- journal.html: 341, 443

### F. "deep" — scope-relevant only (MOST "deep" is the `var(--deep)` CSS color token → IGNORE)
- welcome-bundle.html: 927 ("deep jaw muscles")
- journal/what-is-buccal-release.html: 321 ("deep muscles"), 346 ("too deep")
- book.html: 862 ("Deep manual work")
- foundation-package.html: 1049 ("Deep Integration")

## Priorities
- **Heaviest pages:** `restorative-facial.html`, `foundation-package.html`, `journal/what-is-buccal-release.html`.
- **Special note:** `journal/what-is-buccal-release.html` is an entire educational article *about* the intraoral technique. Minimizing there is delicate — decide whether to reframe heavily or keep more clinical detail (it ranks for the topic). Andrew's call.
- Standing rule recorded in `tasks/lessons.md` L9.
