# Flowbound Landing Page

Astro + TypeScript + Tailwind, static output, zero client-side JS framework. See `BRAND_GUIDELINES.md`
for palette, type, logo usage, and the copy rules (short version: no em dashes, ever, and keep the tone
warm and human).

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Astro prints (defaults to http://localhost:4321).

## Build

```bash
npm run build     # runs `astro check` then `astro build`
npm run preview   # serve the production build locally
```

## Deployment

Live at flowbound.ai, hosted on Vercel, connected to the `MuhammadAli0297/flowboundai` GitHub repo.
Every push to `main` auto-deploys. No environment variables are required.

## Pages

- `/`: homepage (`src/pages/index.astro`)
- `/services`: services overview: Ask Flowbound, Inventory, Supplier Management, Autonomous, Customer
  Service, Quality Monitoring (`src/pages/services.astro`, content lives in `src/data/services.ts`)
- `/blog`: paginated post index; `/blog/[slug]`: individual posts; `/blog/tags/[tag]`: tag pages
- `/404`: not found page

## Structure

- `src/pages/`: one file per route
- `src/layouts/BaseLayout.astro`: shared page shell (nav, footer, font preloads, `<Seo>`)
- `src/components/Seo.astro`: per-page title/description/canonical/OG/JSON-LD, used by every page
- `src/components/`: homepage section components (Hero, ProductSystem, HowItWorks, WhyUs,
  SapComparison, Mission, Cta, Nav, Footer, FlowBackground, ServicesOrbit) plus `icons/SectionIcon.astro`
- `src/data/nav.ts`: nav links and the Services dropdown's curated slug list
- `src/data/services.ts`: single source of truth for the Services page content; the nav dropdown and
  the page's JSON-LD both derive from it, so adding a new service here is enough to appear in both
- `src/content/blog/`: blog posts (Markdown, via Astro's Content Layer API, config in `src/content.config.ts`)
- `src/scripts/hoverGlow.ts`: shared vanilla-JS mouse-glow effect (no React or any JS framework ships
  anywhere on this site)
- `public/fonts/`: self-hosted Satoshi + IBM Plex Mono (not loaded from a third-party CDN)
- `tailwind.config.js`: brand color scale, fonts, radius scale
- `public/favicon.svg`: favicon; `public/og-image.png`: default OG share image

## Known placeholders and things to double check

- The Customer Service and Quality Monitoring copy on `/services` is a reasonable extrapolation from
  Flowbound's existing positioning, not confirmed product capabilities yet. Review before relying on it.
- The pilot request buttons in the closing CTA open a plain mailto link. Swap in a real form or CRM
  integration whenever you're ready to capture leads properly.
- Only one blog post exists so far, added as a pipeline sample. Add real posts as they're written.
