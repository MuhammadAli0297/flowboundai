# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # local dev server, http://localhost:4321
npm run build      # `astro check` (type check) then `astro build` (static output to dist/)
npm run preview    # serve the production build locally (dist/), used for screenshot verification
npm run lint       # oxlint
```

There is no test suite. Verification is: `astro check` + `astro build` succeed, plus a real headless-browser
screenshot check (`shot.mjs` via Playwright, against `npm run preview` on port 4173) before calling any
visual change done. Always do this for UI changes; don't just trust the build passing.

## Architecture

Astro + TypeScript + Tailwind, static output (`output: "static"` in `astro.config.mjs`), zero client-side
JS framework: no React or any JS framework ships anywhere on this site. One-off interactivity (mouse-glow
hover effects, hero background animation) is vanilla JS/SVG in `.astro` files or `src/scripts/`.

### Page structure

- `src/pages/`: one file per route, mostly flat (no nested layouts beyond `BaseLayout`)
- `src/layouts/BaseLayout.astro`: shared shell (nav, footer, font preloads, `<Seo>`) used by every page
- `src/components/Seo.astro`: per-page title/description/canonical/OG/Twitter/JSON-LD, used by every page
- `src/content/blog/`: Markdown blog posts via Astro's Content Layer API, schema in `src/content.config.ts`;
  `/blog` (paginated index), `/blog/[slug]`, `/blog/tags/[tag]` all derive from this collection

### Data-driven pages vs. narrative pages

`src/data/services.ts` is the single source of truth for `/services` content. The nav dropdown
(`src/data/nav.ts` + `Nav.astro`) and the page's JSON-LD both derive from it, so adding a service here is
enough to appear in both places without touching nav code. Each capability, or a whole service, can
optionally set `href`/`ctaLabel`:
- Set on an individual capability → nav flyout links straight to that capability's dedicated page instead
  of the `/services#slug` anchor, and the services page grid gets a small per-tile pill CTA under that tile.
- Set on the whole service instead (used when the capabilities are better told as one narrative than split
  into separate pages, e.g. Customer Service, Quality Monitoring) → nav's top-level link and one
  section-level pill CTA under the whole capability grid both point to that one page.
- A service uses one or the other, never both.

Dedicated capability pages (`/demand-forecasting`, `/inventory-tracking`, `/shipping-optimization`,
`/supplier-coordination`, `/wholesale-account-management`, `/reorder`, `/pricing`) all follow the same
five-section template: hero, what it is, what it does, what it watches, how it works, CTA. Whole-service
narrative pages (`/ask-flowbound`, `/customer-service`, `/quality-monitoring`) and one-off pages
(`/product`, `/how-it-works`) have inline content in the page file rather than being data-driven, since
they're one-off pages rather than a repeating list of similar items. Don't try to generalize them into
`services.ts`.

### Hero backgrounds

Every secondary page gets its own full-bleed animated hero background component (`FooBackground.astro`),
never reusing another page's file verbatim. Copy the pattern (dark background, green glow palette, pulse-ring
motif, `SectionIcon` as the hub, vary whether the hub rotates or stays fixed), not the file: each is its
own composition. Two hard rules learned from prior bugs, apply to every hero:
- Never combine a `transform` attribute and a transform-animating CSS class on the same SVG element.
- None of the hubs use a small center "core dot": it reads as a stray artifact.

See `BRAND_GUIDELINES.md`'s "Secondary-page hero" section for the full list of existing compositions before
building a new one, so the new page's hub/motif doesn't duplicate an existing page's visual idea.

### Brand and copy rules (`BRAND_GUIDELINES.md`)

Read this before writing any user-facing copy or touching visual styling. Highlights:
- No em dashes, ever, anywhere in the project (copy, headlines, code comments, docs, commit messages) and
  never in Claude's own chat responses to the user in this repo, written or spoken. Rewrite as two
  sentences, or use a comma/period/colon/"and"/"but". This is a hard rule, not a style suggestion: if a
  reply is about to contain an em dash, rewrite it before sending instead of leaving it in.
- Voice: warm, plainspoken, operator-written, not corporate or "AI-generated" sounding.
- Square-ish corners (2-4px radius) everywhere by default; the nav's Services dropdown/flyouts and
  "featured" hand-off CTAs (`rounded-full` pill) are the only intentional exceptions. Don't "fix" them
  back to square.
- Left-aligned text blocks, not centered (this is an operator's tool, not a consumer app).
- Full brand palette, typography, and per-component notes live in `BRAND_GUIDELINES.md`. It's kept
  current and detailed, so check it rather than inferring style from a single existing page.

### Fonts and assets

Satoshi (headings/body) and IBM Plex Mono (labels/eyebrows/mono data) are self-hosted `.woff2` in
`public/fonts/`, declared in `src/index.css` and preloaded in `BaseLayout.astro`. No third-party font CDN.
The real logo is `src/assets/logo.png` run through Astro's image pipeline via `LogoLockup.astro`;
`LogoMark.astro`/`public/logo-mark.svg` are a hand-redrawn vector fallback, not the source of truth.

## Deployment

Live at flowbound.ai on Vercel, connected to `MuhammadAli0297/flowboundai` on GitHub. Every push to `main`
auto-deploys; no environment variables required. Split commits by concern (feature/bugfix/docs) rather than
bundling unrelated changes.
