# Journal broken-link audit — todo

> Job: scan `journal.html` + `journal/*.html` for internal links that 404, report each, and apply HIGH-confidence fixes.

## Plan checklist

- [x] **Discovery**: extract every internal `<a href>` from journal index + all 6 article files, with line numbers
- [x] **Manifest**: build the set of valid URLs in the repo (root HTML, `services/*.html`, `journal/*.html`, `_redirects` entries)
- [x] **Classify**: for each link, mark VALID / BROKEN. For BROKEN, propose a fix with HIGH / MEDIUM / LOW confidence
- [x] **Report**: write `tasks/journal-broken-links.md` with summary + per-link detail
- [x] **Apply**: edit affected files for HIGH-confidence fixes only
- [x] **Self-verify**: re-run scan, confirm zero HIGH-confidence breakage remains
- [x] **Review section** below: summarize what changed, what was flagged, what assumptions were made
- [ ] **Wait for user verification** before commit/deploy

## Rules applied

- Plan-mode first; verify before executing.
- Root cause only — if multiple files share a broken pattern, fix the pattern.
- Never delete a link I can't fix; flag it.
- Repo is the source of truth, no live HTTP requests.
- HIGH-confidence fixes only auto-apply; MEDIUM and LOW flag for user decision.
- Self-verify end to end before handing back.

---

## Review

### What I changed

Applied **4 HIGH-confidence link edits across 2 files** in `journal/`:

| File | Line | Before | After |
|---|---|---|---|
| `journal/how-breathing-shapes-your-face.html` | 401 | `/buccal-massage-slc` (CTA "Explore the Restorative Facial") | `/restorative-facial` |
| `journal/how-breathing-shapes-your-face.html` | 413 | `/structural-integration` (inline body link) | `/services/structural-integration-salt-lake-city` |
| `journal/how-breathing-shapes-your-face.html` | 417 | `/buccal-massage-slc` (inline body link "buccal massage") | `/services/restorative-buccal-massage` |
| `journal/tmj-relief-facial-massage.html` | 469 | `/tmj-facial-massage-murray-ut` (inline body link) | `/services/restorative-buccal-massage` |

Each fix points at a file that genuinely exists in the repo (verified by glob, not by HTTP).

### What I flagged

- **`/programs` — 21 occurrences across all 7 journal files** (and another ~130+ occurrences across the rest of the site, since `/programs` is in the main nav of every page). No clear single target; this is a **structural issue**, not a typo. The site has three program pages (`foundation-package`, `welcome-bundle`, `membership`) but no index page that lists them. Three legitimate paths forward, all flagged in `tasks/journal-broken-links.md` for your decision. **No auto-fix applied.**

### Assumptions I made

1. **`/buccal-massage-slc` (line 401) → `/restorative-facial`** rather than `/services/restorative-buccal-massage`, because the CTA text "Explore the Restorative Facial" *exactly* matches the H1 of the `restorative-facial.html` page (which is also your live Google Ads landing target). Service page would be a defensible alternative; ads landing page is the better fit for a CTA.

2. **`/buccal-massage-slc` (line 417) → `/services/restorative-buccal-massage`** rather than `/journal/what-is-buccal-massage`, because the original URL shape (`<service>-slc` with location suffix) followed the site's service-page slug convention. The sister lymphatic article uses the article-page convention for a similar inline link, so this is a slight inconsistency — but the original intent here was clearly a service URL.

3. **`/tmj-facial-massage-murray-ut` → `/services/restorative-buccal-massage`** rather than the structural-integration service. The buccal service page is the more TMJ-focused content on the site (it explicitly mentions the masseter and pterygoid muscles, which drive TMJ dysfunction).

### Root-cause observation

These broken URLs share a common origin: **the journal articles were drafted with service-page URLs that were planned but never built.** `/buccal-massage-slc`, `/structural-integration`, `/tmj-facial-massage-murray-ut` all look like plausible service-page slugs — they just don't exist. The site's actual service pages live under `/services/<slug>-<location>` (e.g., `services/structural-integration-salt-lake-city.html`).

The fixes redirect the "ghost" URLs to the canonical service pages. A future improvement would be either:
- Build the planned pages (most thorough)
- Establish `_redirects` rules for the ghost URLs so they 301 to the canonical pages (zero-content fix, holds the URL)

### Why no commit/deploy yet

Per the workflow, I'm not committing or pushing until you've verified the changes. The 4 edits are in your working tree (`git status` will show them); the report is at `tasks/journal-broken-links.md`. After your sign-off, I'll commit and deploy.
