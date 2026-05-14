# Altru Radiance

Static marketing site for Altru Radiance — aesthetic wellness studio in Murray, Utah specializing in fascial-driven regenerative beauty treatments.

- Site: https://altruradiance.com
- Studio: 164 E 5900 S, Suite A108, Murray, UT 84107
- Practitioner: Mechelle, Licensed Master Esthetician

## Stack

- Hand-written static HTML / CSS / JS (no build step)
- Cormorant Garamond + Jost via Google Fonts
- Images served from Cloudinary (`res.cloudinary.com/dec9xzaxl`) with `f_auto,q_auto` transforms
- Hosted on Cloudflare Pages, connected to this GitHub repo
- Cloudflare Pages build configuration: no build command, output directory is the repo root

## Repo layout

```
/                       top-level pages (index, about, services, results, journal,
                        membership, book, contact, policies, privacy, 404)
/services/              individual service pages
/journal/               long-form articles (called "Journal", never "blog")
/assets/                logo, studio photos, results photos
/assets/images/         additional imagery referenced from pages
_headers                Cloudflare Pages security + cache headers
_redirects              clean-URL rewrites and legacy slug redirects
sitemap.xml             canonical URL list for search engines
robots.txt              crawl directives
CLAUDE.md               brand voice, design system, content rules for AI assistants
```

## Local preview

```sh
python serve.py
```

Serves the repo root on http://localhost:8000 with `.html` extensions stripped so links behave the same as on Cloudflare Pages.

## Deploy

1. Push to `main` on GitHub
2. Cloudflare Pages auto-builds and deploys to `altruradiance.com`
3. No build command — Pages serves the repo root as-is
4. `_headers` and `_redirects` are applied by Pages at the edge

## Brand and content rules

See `CLAUDE.md` for the full voice guide, design tokens, and content conventions. Key constraints:

- "Journal" not "blog" in all copy
- No injectables claims — Altru Radiance does not offer Botox or fillers
- Anatomical language with explanations, not wellness buzzwords
- No promises of permanent results — frame all outcomes as cumulative

## URL conventions

Internal links and the sitemap use clean URLs without `.html` (e.g. `/services/restorative-buccal-massage`). The `_redirects` file maps these to the underlying `.html` files and 301-redirects any `.html` access to the clean form.
