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

## Build, lint, and verify

```bash
npm run build     # runs `astro check` then `astro build`
npm run preview   # serve the production build locally
npm run lint      # oxlint
```

There's no test suite. For any UI change, `astro check` and `astro build` passing isn't enough on its own:
verify it visually with a real headless-browser screenshot against `npm run preview` before calling it done.

## Deployment

Live at flowbound.ai, hosted on Vercel, connected to the `MuhammadAli0297/flowboundai` GitHub repo. Every
push to `main` auto-deploys. No environment variables are required. Split commits by concern
(feature/bugfix/docs/content) rather than bundling unrelated changes.

## Pages

| Route | File | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | Homepage |
| `/product` | `src/pages/product.astro` | Expands the homepage's "What Flowbound does" section into its own page |
| `/how-it-works` | `src/pages/how-it-works.astro` | Expands the homepage's "How it works" section into its own page |
| `/services` | `src/pages/services.astro` | Services overview; content lives in `src/data/services.ts` |
| `/ask-flowbound`, `/customer-service`, `/quality-monitoring` | `src/pages/*.astro` | One-off pages, each covering a whole service on one page instead of splitting it into per-capability pages |
| `/demand-forecasting`, `/inventory-tracking`, `/shipping-optimization`, `/supplier-coordination`, `/wholesale-account-management`, `/reorder`, `/pricing` | `src/pages/*.astro` | Dedicated capability pages, all following the same five-section template: hero, what it is, what it does, what it watches, how it works, CTA |
| `/blog` | `src/pages/blog/[...page].astro` | Paginated blog index, see Blog below |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` | Individual post |
| `/blog/tags/[tag]` | `src/pages/blog/tags/[tag].astro` | Posts filtered by tag |
| `/rss.xml` | `src/pages/rss.xml.ts` | RSS feed of all posts |
| `/404` | `src/pages/404.astro` | Not found page |

**A few patterns worth knowing before adding a page:**
- `/product` and `/how-it-works` were promoted out of the homepage's own in-page sections: the nav and
  footer link to the dedicated page, but the original anchor and section still exist on the homepage
  (including its own hero button, which still scrolls in-page rather than navigating away). Each homepage
  section also keeps a small pill CTA under its grid linking through to the dedicated page. `/services`
  went through the same promotion earlier.
- `src/data/services.ts` is the single source of truth for `/services`: the nav dropdown and the page's
  JSON-LD both derive from it, so adding a service there is enough for it to show up in both. A capability,
  or a whole service, can set `href`/`ctaLabel` there to get a dedicated page wired up automatically
  (comments in that file spell out exactly how).
- Customer Service and Quality Monitoring are each told as one narrative page rather than split into a
  page per capability; every other Inventory, Supplier Management, and Autonomous capability gets its own
  page instead.
- Every secondary page gets its own full-bleed animated hero background component rather than reusing
  another page's file. See BRAND_GUIDELINES.md's "Secondary-page hero" section for the full catalog of
  existing compositions before building a new one.

## Blog

- Posts are Markdown files in `src/content/blog/`, schema in `src/content.config.ts`. Each post needs a
  `category`, one of the fixed list in `src/data/blogCategories.ts` (each mapped to a `SectionIcon`), and
  can carry any number of freeform `tags`, used by the `/blog/tags/[tag]` pages.
- `/blog` shows 9 posts per page, newest first, with a search box and per-category checkboxes in a
  sidebar. Every post on the site is rendered into every page's HTML (hidden if it isn't on that
  particular page), so search and category filters match across the whole blog, not just the page you're
  currently on. See `src/scripts/blogFilter.ts`. Sidebar category counts are computed from all posts, not
  just the current page.
- Card thumbnails (`src/components/BlogThumbnail.astro`) are generated from the post's category icon
  rather than real images, so there's no photography to source or maintain as more posts get added.
- `src/components/BlogBackground.astro` is the `/blog` hero's animated background: a real JS canvas hero
  ("Insight Stream"), following the same per-page hero convention as every other secondary page.

## Structure

- `src/pages/`: one file per route
- `src/layouts/BaseLayout.astro`: shared page shell (nav, footer, font preloads, `<Seo>`)
- `src/components/Seo.astro`: per-page title/description/canonical/OG/JSON-LD, used by every page
- `src/components/`: `LogoLockup`/`LogoMark` (logo), `Nav`/`Footer`, homepage sections (`Hero`,
  `ProductSystem`, `HowItWorks`, `WhyUs`, `SapComparison`, `Mission`, `Cta`), one animated hero background
  component per secondary page. The seven dedicated capability pages, three whole-service narrative pages,
  `/how-it-works`, and `/blog` all pair their `*Background.astro` file with a same-named script in
  `src/scripts/` for a real JS canvas hero; `HeroBackground` (homepage) and `ProductBackground` (`/product`)
  are real WebGL three.js particle systems instead, the two deliberate exceptions to the zero-framework rule
  above, see CLAUDE.md's "Homepage" section; `ServicesOrbit` is `/services`'s static, non-animated hero.
  No secondary hero still uses the original SVG/SMIL pattern; `FlowBackground` still exists on disk (the
  only surviving example of that pattern's shape) but isn't imported anywhere currently. `BlogThumbnail`
  (generated card images) and `icons/SectionIcon.astro` (the small monoline icons used as hero hubs and
  section decoration) round out the directory.
- `src/data/nav.ts`: nav links and the Services dropdown's curated slug list
- `src/data/services.ts`: single source of truth for `/services` content (see Pages above)
- `src/data/blogCategories.ts`: fixed blog category list, each mapped to a `SectionIcon` name
- `src/content/blog/`: blog posts (Markdown, via Astro's Content Layer API), schema in
  `src/content.config.ts`
- `src/lib/tags.ts`: slug helper shared by the tag pages and post pages
- `src/scripts/`: vanilla JS/TS, no framework ships anywhere on this site. `hoverGlow.ts` is the shared
  mouse-glow hover effect; `cardTilt.ts` is the shared cursor-follow card tilt; `scrollReveal.ts` toggles a
  reveal class on scroll (replays every re-entry, doesn't just play once); `sectionIconDrift.ts` drives the
  small scroll-linked drift on watermark `SectionIcon`s; `blogFilter.ts` is the `/blog`
  search-and-category-filter logic; `heroWave.ts`/`productHeroWave.ts` drive the homepage's and
  `/product`'s WebGL particle heroes, `heroScroll.ts`/`scrollProgress.ts` drive their shared scroll-linked
  fade/zoom; `askFlowboundHero.ts`, `demandForecastingHero.ts`, `inventoryTrackingHero.ts`,
  `shippingOptimizationHero.ts`, `supplierCoordinationHero.ts`, `wholesaleAccountManagementHero.ts`,
  `reorderHero.ts`, `pricingHero.ts`, `customerServiceHero.ts`, `qualityMonitoringHero.ts`,
  `howItWorksHero.ts`, `blogHero.ts` each drive one capability/narrative/blog page's Canvas 2D hero (see
  BRAND_GUIDELINES.md's "Secondary-page hero" section for what each one shows); `howItWorksHero.ts` is the
  one exception whose main motion is scroll-linked (via `scrollProgress.ts`) rather than self-timed
- `public/fonts/`: self-hosted Satoshi + IBM Plex Mono (sitewide) + Amulya (homepage/Nav/Footer/logo,
  `/product`, `/services`, all ten capability/narrative pages, `/how-it-works`, and `/blog`, see
  BRAND_GUIDELINES.md), none loaded from a third-party CDN
- `tailwind.config.js`: brand color scale, fonts, radius scale
- `public/favicon.svg`: favicon; `public/og-image.png`: default OG share image

## Known placeholders and things to double check

- The Customer Service and Quality Monitoring copy, on `/services` and their dedicated pages, is a
  reasonable extrapolation from Flowbound's existing positioning, not confirmed product capabilities yet.
  Review before relying on it.
- The pilot request buttons in the closing CTA open a plain mailto link. Swap in a real form or CRM
  integration whenever you're ready to capture leads properly.
