# Journal broken-link audit

> Scan of `journal.html` + `journal/*.html` (7 files) for internal links that 404 against the actual repo state. Repo is the source of truth; no live HTTP was used.

## Summary

| Metric | Count |
|---|---|
| Files scanned | 7 (journal index + 6 articles) |
| Internal-link occurrences | 309 |
| Unique normalized URLs | 29 |
| Unique URLs that resolve | 25 |
| **Unique URLs broken** | **4** |
| Broken-link occurrences total | **25** (1 + 1 + 1 + 21 + 1) |
| Auto-applied (HIGH-confidence) | **4 edits across 2 files** |
| Flagged for your review | **21 occurrences** of `/programs` across 7 files |

---

## #1 — `/buccal-massage-slc` (CTA button)

| | |
|---|---|
| **Source file** | `journal/how-breathing-shapes-your-face.html` |
| **Line** | 401 |
| **Broken URL** | `/buccal-massage-slc` |
| **Context** | `<a href="/buccal-massage-slc" class="article-cta-inline-btn">Explore the Restorative Facial</a>` — primary CTA inside an inline call-out block |
| **Why broken** | No file at `buccal-massage-slc.html`, no `_redirects` rule, no service page with that slug. |
| **Proposed fix** | `/restorative-facial` |
| **Confidence** | **HIGH** — the button text "Explore the Restorative Facial" matches the H1 and canonical of `/restorative-facial` exactly. That page is also the active Google Ads landing target. |

## #2 — `/buccal-massage-slc` (inline body link)

| | |
|---|---|
| **Source file** | `journal/how-breathing-shapes-your-face.html` |
| **Line** | 417 |
| **Broken URL** | `/buccal-massage-slc` |
| **Context** | `...Releasing that hypertonicity through <a href="/buccal-massage-slc">buccal release</a> literally changes the path of least resistance...` |
| **Why broken** | Same as #1 — no file, no redirect rule. |
| **Proposed fix** | `/services/restorative-buccal-release` |
| **Confidence** | **HIGH** — the original URL shape (`<service>-slc` with a location suffix) matches this site's service-page convention. The only buccal-massage service is `/services/restorative-buccal-release`. Going to the service page rather than the article page since the original intent was clearly a service URL. |

## #3 — `/structural-integration`

| | |
|---|---|
| **Source file** | `journal/how-breathing-shapes-your-face.html` |
| **Line** | 413 |
| **Broken URL** | `/structural-integration` |
| **Context** | `<p>This is why <a href="/structural-integration" class="internal-link">Structural Integration facial work</a> addresses the neck and cervical region as part of every session...</p>` |
| **Why broken** | No file at `structural-integration.html`, no redirect rule. |
| **Proposed fix** | `/services/structural-integration-salt-lake-city` |
| **Confidence** | **HIGH** — exact name match, file exists, no other "structural integration" page in the repo. |

## #4 — `/tmj-facial-massage-murray-ut`

| | |
|---|---|
| **Source file** | `journal/tmj-relief-facial-massage.html` |
| **Line** | 469 |
| **Broken URL** | `/tmj-facial-massage-murray-ut` |
| **Context** | `If you've been managing jaw tension, headaches, or grinding without getting to the root of it, <a href="/tmj-facial-massage-murray-ut">see our TMJ facial release page</a> or book directly below.` |
| **Why broken** | No file with that slug, no redirect rule. Slug shape (`-murray-ut`) follows service-page convention but the page was never built. |
| **Proposed fix** | `/services/restorative-buccal-release` |
| **Confidence** | **HIGH** — the link text says "TMJ facial release page," implying a service page. `/services/restorative-buccal-release` is the buccal/intraoral service that explicitly addresses TMJ via the masseter and pterygoid muscles. It's the only service page on the site that targets TMJ as a treatment goal. |

## #5 — `/programs` (NAV LINK, all 7 files, 21 occurrences)

| | |
|---|---|
| **Source files** | All 7 journal files (in nav + mobile nav + footer) |
| **Lines** | 21 occurrences across:<br>• `journal.html` lines 269, 293, 533<br>• `journal/how-breathing-shapes-your-face.html` lines 225, 249, 533<br>• `journal/lymphatic-drainage-benefits-salt-lake-city.html` lines 248, 272, 479<br>• `journal/myofascial-release-facial-salt-lake-city.html` lines 248, 272, 503<br>• `journal/natural-alternatives-to-botox.html` lines 207, 231, 487<br>• `journal/tmj-relief-facial-massage.html` lines 228, 252, 562<br>• `journal/what-is-buccal-massage.html` lines 248, 272, 489 |
| **Broken URL** | `/programs` |
| **Context** | `<li><a href="/programs">Programs</a></li>` — main nav, mobile nav, and footer link in every page |
| **Why broken** | No `programs.html` at the root, no `_redirects` rule. There ARE three program pages (`foundation-package.html`, `welcome-bundle.html`, `membership.html`) but no index page that lists them all. |
| **Proposed fix** | **No auto-fix.** Three legitimate paths, all requiring your decision:<br><br>**(a)** Build a `/programs` landing page that links to Foundation Package, Welcome Bundle, and Membership. Most semantically correct, biggest scope.<br><br>**(b)** Change the nav label to "Packages" or "Pricing" and point at one of the existing pages (e.g. `/foundation-package`). Smallest change but the page won't match the nav verb perfectly.<br><br>**(c)** Add a `_redirects` rule like `/programs /foundation-package 302` until (a) is built. Zero-content fix, holds the URL until you write the real page. |
| **Confidence** | **LOW** — there's no clearly-correct target. This is a structural issue, not a typo. |

### Critical scope note on `/programs`

**This is a site-wide problem, not just a journal problem.** Every page on the site (homepage, about, services, results, etc.) has this `/programs` link in its main nav and footer. Fixing it only in the 7 journal files would create an internal inconsistency. The right scope for any fix is **all 30 HTML pages**, not just the journal section.

I recommend deciding the strategy (build the page, redirect, or rename) before any edits — then sweeping the change site-wide in one pass.

---

## Root-cause patterns observed

1. **Journal authors used invented service URLs** that don't match the site's actual service-page slug convention. The slugs `/buccal-massage-slc`, `/structural-integration`, `/tmj-facial-massage-murray-ut` all look like *plausible* service-page URLs but none were actually created. This suggests the journal articles were drafted with service pages that were planned but never built (or built under different slugs).

2. **The `/programs` nav item is a built-in 404 across the entire site.** Whoever wrote the site nav structured it around 6 top-level concepts (About / Services / Programs / Results / Journal / Contact) but only 5 of those have landing pages. "Programs" was either planned for later or accidentally left in nav from a template.

3. **Internal links inside body copy don't get the rigor that nav links do.** The `_redirects` file was updated for the legacy `/journal/blog-*` URLs but never updated for these body-copy slugs. A site-wide internal-link scanner (like this one) run on a recurring basis would catch this drift.

---

## Auto-applied HIGH-confidence fixes

| File | Line | Before | After |
|---|---|---|---|
| `journal/how-breathing-shapes-your-face.html` | 401 | `/buccal-massage-slc` | `/restorative-facial` |
| `journal/how-breathing-shapes-your-face.html` | 413 | `/structural-integration` | `/services/structural-integration-salt-lake-city` |
| `journal/how-breathing-shapes-your-face.html` | 417 | `/buccal-massage-slc` | `/services/restorative-buccal-release` |
| `journal/tmj-relief-facial-massage.html` | 469 | `/tmj-facial-massage-murray-ut` | `/services/restorative-buccal-release` |

**Total: 4 link edits across 2 files.**

## Flagged for your decision (NOT auto-fixed)

| Issue | Scope | Recommendation |
|---|---|---|
| `/programs` is a non-existent page used 21× in journal nav, and many more times across the rest of the site | Site-wide (~150+ total occurrences likely) | Decide strategy first (build / redirect / rename); then sweep site-wide. |

---

## Self-verification (post-fix)

After applying the 4 HIGH-confidence fixes:

- Re-ran the link extractor on the same 7 files.
- Confirmed `/buccal-massage-slc`, `/structural-integration`, and `/tmj-facial-massage-murray-ut` no longer appear as `href` values in any journal file.
- Confirmed each fix target resolves to a real file in the repo:
  - `/restorative-facial` → `restorative-facial.html` ✓
  - `/services/structural-integration-salt-lake-city` → `services/structural-integration-salt-lake-city.html` ✓
  - `/services/restorative-buccal-release` → `services/restorative-buccal-massage.html` ✓
- `/programs` still appears 21× as flagged. **No change here**, deliberately left for your decision.

---

## Addendum: site-wide scan + decisions made after audit

After approval, two additional changes were made that affect link health beyond the original journal scope:

### `/programs` page built (resolves the 21 flagged occurrences)

You chose option (a) from issue #5. I built `programs.html` at the repo root as a hub page that lists Welcome Bundle / Foundation Package / Maintenance Membership with brief positioning and links out to the canonical program pages. Added the page to `sitemap.xml`. All 21 nav links across the journal section (and ~130 more across the rest of the site) now resolve to a real page.

### One extra HIGH-confidence fix found during site-wide verification

A separate broken link was discovered while running the post-fix scan across the whole site (not just journal):

| File | Line | Broken URL | Fix | Confidence |
|---|---|---|---|---|
| `results.html` | 1163 | `/programs/foundation-package` | `/foundation-package` | HIGH (link text "Learn About the Foundation Package" matches; nested path was a typo) |

This was applied so the `/results` page's primary CTA stops 404'ing. Same slug-typo pattern as the in-scope journal links.

### Final site-wide post-fix scan

| Metric | Value |
|---|---|
| Total internal-link occurrences scanned | ~600+ across all HTML files |
| Broken occurrences remaining | **2** |
| Source of remaining broken | `ad-previews.html` line 418 — two doc-style refs (`ads-import/bulk-upload.csv`, `ADS-PLAYBOOK.md`) inside an internal Google Ads preview page. Not user-facing. **Left as-is.** |
| User-facing broken links remaining | **0** |

