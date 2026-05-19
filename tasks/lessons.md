# Lessons learned — Altru Radiance

> Captured during the broken-link audit on 2026-05-19. Append to this file as new rules emerge.

## Build rules (from CLAUDE.md, session memory, and adjacent project lessons.md files)

- **Plan mode first.** Propose before executing.
- **Verify before deploying.** Self-verify end to end before handing back.
- **Repo is source of truth.** For link audits, do not make live HTTP requests; check against the actual files and `_redirects` entries.
- **Root cause only.** If multiple files share a broken pattern, fix the pattern (not each instance independently).
- **Never delete a link I can't fix.** Flag it in the report. Deleting silently hides the problem.
- **Static HTML + Cloudflare Pages.** No build framework, no node_modules.
- **No fabricated content.** No invented credentials, certifications, team members, or testimonials.
- **Don't auto-fix anything the user has flagged as intentional state** (see `feedback_intentional_states.md` in user memory). Ask first when in doubt.

## Lessons captured

### L1 — Internal-link audit needs a manifest, not glob-comparison

When auditing internal links, the URL might map to a file via Cloudflare Pages' default (`/foo` serves `foo.html`), via a `_redirects` rule, OR neither. Building a manifest from BOTH the file system AND the `_redirects` file before checking links catches both classes of valid URL. Cloudflare Pages also serves trailing-slash variants and `.html` extensions silently; the manifest should include both forms.

### L2 — Slug-vs-filename drift is the most common 404 source

Two patterns observed in this codebase:
1. Authors invented service-page slugs (`/buccal-massage-slc`, `/tmj-facial-massage-murray-ut`) that follow the *site's slug convention* but never got built as files. The slugs are plausible but the files don't exist.
2. Article files were imported with a `blog-` prefix that didn't match the canonical URL in their own `<link rel="canonical">` tags. Files were renamed to match canonicals in commit 5a8a500.

Whenever a link references a slug that doesn't exist, check: is this a typo, or is this a planned page that was never built? The fix differs.

### L3 — Nav links can be silently broken across an entire site

A nav item that points at a non-existent page (`/programs` in this case) shows up in every single HTML file's nav block. A single broken nav link → ~150 broken-link occurrences across a 30-page site. Auditing only one section (e.g. journal) catches the symptom but the right scope for any fix is site-wide. Always flag nav-level broken links as "structural" rather than per-file.

### L4 — `_redirects` is a useful tool for "ghost URL" handling

When a journal article links to a planned-but-never-built page, two paths exist:
1. Build the page.
2. Add a `_redirects` rule that 301s or 302s the ghost URL to the closest real page.

(2) is cheap, holds the URL safely, and can be removed when (1) ships. Both approaches preserve the article's internal links without rewriting them.

### L5 — Trailing-slash normalization is a footgun in `_redirects`

(Carried forward from acuity-website lessons.md L5.) A blanket `/*.html /:splat/ 301` rule will mis-redirect `/404.html` to `/404/` and break Cloudflare Pages' default 404 handling. Always enumerate explicit legacy redirects rather than blanket-rewriting an extension.

### L6 — Always update internal links when renaming a journal slug

When a journal article file is renamed (e.g., dropping a `blog-` prefix), the rename has three downstream consequences:
1. The journal index `<a href>` may already point at the new clean URL (since canonical tags often anticipate the rename) — verify.
2. Sister articles' "Continue reading" related-card hrefs DO need updating.
3. The `_redirects` file should preserve old URLs as 301s so external links / indexed URLs keep working.

A site-wide URL-rewrite script (Python regex pass over all `*.html`) is the cleanest way to do this in one operation.

### L7 — Use git mv for file renames to preserve history

`git mv old.html new.html` preserves git's rename detection so `git log --follow new.html` shows the full history pre-rename. `rm old.html && cp old.html new.html` does not.
