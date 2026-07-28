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
- `/product`: dedicated page for the product as a whole (`src/pages/product.astro`), expanding the
  homepage's "What Flowbound does" section (`ProductSystem.astro`, the four-tile Decision Engine /
  Consulting Wrapper / Ask Flowbound / Web App grid) into its own hero, unifying "what it is" narrative, a
  deeper pass on each of the four pillars, and a how-it-works walkthrough. The nav's "Product" link and
  the footer's "What it is" link both point here now instead of the homepage's `#product` anchor (the
  anchor and section still exist on the homepage itself, just no longer the nav target, the same
  promotion `/services` already went through). The homepage section also gets a centered "See the full
  product" pill CTA under its grid, linking here, matching the Ask Flowbound teaser pattern. Content is
  inline in the page file, not data-driven, since it's a one-off narrative page.
- `/how-it-works`: dedicated page for the process (`src/pages/how-it-works.astro`), expanding the
  homepage's "How it works" section (`HowItWorks.astro`, the four-step Connect / Read the Signal /
  Decide / Ask grid) into its own hero, a "set up once, runs continuously" narrative, a deeper pass on
  each of the four steps, and a closing "what comes off your plate" list contrasting the manual busywork
  it replaces. Same promotion as `/product`: the nav's and footer's "How it works" links point here now
  instead of the homepage's `#how-it-works` anchor (the anchor and section still exist on the homepage,
  including the homepage hero's own "See how it works" button, which still scrolls to that in-page
  section rather than navigating away, same as every other page's hero secondary button). The homepage
  section also gets a centered "See how it works in depth" pill CTA under its grid.
- `/services`: services overview: Ask Flowbound, Inventory, Supplier Management, Autonomous, Customer
  Service, Quality Monitoring (`src/pages/services.astro`, content lives in `src/data/services.ts`). The
  Ask Flowbound section here is a short teaser with a CTA button through to `/ask-flowbound`, not the
  full pitch. Any capability with an `href` set in `services.ts` gets the same treatment: a centered pill
  CTA button directly under that capability's tile, linking to its own dedicated page. A whole service can
  also set `href`/`ctaLabel` (instead of its individual capabilities): Customer Service and Quality
  Monitoring do this, so their section gets one centered pill CTA under the full capability grid, linking
  to one dedicated page for the whole service, the same treatment the Ask Flowbound section gets.
- `/ask-flowbound`, `/customer-service`, `/quality-monitoring`: one-off narrative pages, each covering an
  entire service (or the agent, for Ask Flowbound) as a single page rather than splitting it into one page
  per capability (`src/pages/ask-flowbound.astro`, `customer-service.astro`, `quality-monitoring.astro`).
  Each expands its Services page teaser into its own hero, capability grid, a third list section (sample
  questions for Ask Flowbound and Customer Service, since both are chat-agent-facing; signals watched for
  Quality Monitoring, matching the capability-page pattern), and a how-it-works walkthrough. Content is
  inline in the page file, not data-driven like `services.ts`, since these are one-off narrative pages
  rather than a repeating list of similar items.
- Dedicated capability pages, one per capability with a page built so far, each following the same
  five-section template (hero, what it is, what it does, what it watches, how it works, CTA):
  `/demand-forecasting`, `/inventory-tracking`, `/shipping-optimization`, `/supplier-coordination`,
  `/wholesale-account-management` (Inventory and Supplier Management), plus `/reorder` and `/pricing`
  (Autonomous). Each has its own hero background component (see Structure below). Customer Service and
  Quality Monitoring capabilities intentionally do NOT get this per-capability treatment; see the
  one-off narrative pages above instead.
- `/blog`: paginated post index; `/blog/[slug]`: individual posts; `/blog/tags/[tag]`: tag pages
- `/404`: not found page

## Structure

- `src/pages/`: one file per route
- `src/layouts/BaseLayout.astro`: shared page shell (nav, footer, font preloads, `<Seo>`)
- `src/components/Seo.astro`: per-page title/description/canonical/OG/JSON-LD, used by every page
- `src/components/`: homepage section components (Hero, ProductSystem, HowItWorks, WhyUs,
  SapComparison, Mission, Cta, Nav, Footer, FlowBackground, ServicesOrbit, AskFlowboundBackground,
  DemandForecastingBackground, InventoryTrackingBackground, ShippingOptimizationBackground,
  SupplierCoordinationBackground, WholesaleAccountManagementBackground, ReorderBackground,
  PricingBackground, CustomerServiceBackground, QualityMonitoringBackground, ProductBackground,
  HowItWorksBackground) plus `icons/SectionIcon.astro`. Each secondary page gets its own full-bleed
  animated hero background component rather than reusing another page's file; see BRAND_GUIDELINES.md's
  "Secondary-page hero" note. An early version of `ProductBackground.astro` used the real `LogoMark`
  component as its hub; that was scrapped (the brand mark read as a generic yin-yang symbol at hero
  scale, not as Flowbound) in favor of a new `compass` `SectionIcon`, same as every other hero. None of
  the hero hubs carry the small center "core dot" some of them shipped with originally; it read as a
  stray artifact once you looked for it, so it was removed everywhere, not just where first noticed.
- `src/data/nav.ts`: nav links and the Services dropdown's curated slug list. The dropdown's "Ask
  Flowbound" entry is hardcoded in `Nav.astro` (not part of the curated list) and links straight to
  `/ask-flowbound`. Each service's nested flyout lists its capabilities; a capability with an `href` set
  in `services.ts` links straight to its dedicated page instead of the `/services#slug` anchor. A
  non-expanding top-level service entry (Customer Service, Quality Monitoring) links straight to the
  service's own `href` when set, the same fallback logic as capabilities.
- `src/data/services.ts`: single source of truth for the Services page content; the nav dropdown and
  the page's JSON-LD both derive from it, so adding a new service here is enough to appear in both. A
  capability can optionally set `href` and `ctaLabel` to get a dedicated page: doing so wires up the nav
  flyout link and the services-page CTA button automatically, no other file needs to change. A whole
  service can set the same two fields instead, when its capabilities are better told as one narrative
  page rather than split into one page each (see Customer Service and Quality Monitoring): doing so wires
  up the nav's top-level link and a section-level CTA button under the whole capability grid.
- `src/content/blog/`: blog posts (Markdown, via Astro's Content Layer API, config in `src/content.config.ts`)
- `src/scripts/hoverGlow.ts`: shared vanilla-JS mouse-glow effect (no React or any JS framework ships
  anywhere on this site)
- `public/fonts/`: self-hosted Satoshi + IBM Plex Mono (not loaded from a third-party CDN)
- `tailwind.config.js`: brand color scale, fonts, radius scale
- `public/favicon.svg`: favicon; `public/og-image.png`: default OG share image

## Known placeholders and things to double check

- The Customer Service and Quality Monitoring copy, on `/services` and their dedicated pages
  (`/customer-service`, `/quality-monitoring`), is a reasonable extrapolation from Flowbound's existing
  positioning, not confirmed product capabilities yet. Review before relying on it.
- The pilot request buttons in the closing CTA open a plain mailto link. Swap in a real form or CRM
  integration whenever you're ready to capture leads properly.
- Only one blog post exists so far, added as a pipeline sample. Add real posts as they're written.
