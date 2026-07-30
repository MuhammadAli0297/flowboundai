# Flowbound Brand Guidelines (v1)

## Copy rules (read this first)
No em dashes, ever, anywhere in this project. Not in headlines, body copy, button labels, code comments,
or documentation, and not in Claude's own chat responses while working in this repo, written or spoken
aloud. If a sentence wants an em dash, rewrite it as two sentences, or use a comma, a period, a colon, or
"and" / "but" instead. This applies to every piece of text tied to Flowbound, not just the homepage, and
it applies for the life of the project, not just this session: treat it as a permanent hard rule, and
rewrite on the spot the moment an em dash shows up, rather than letting it stand.

Overall voice: warm and human, not corporate, not "AI-generated" sounding. Write like a person who has
actually talked to small business owners about their supply chain headaches, not like a pitch deck. Short
sentences are good. Contractions are good. The goal is that a small business owner reads this and feels
like Flowbound is written for them specifically, not for a Fortune 500 procurement committee.

## Positioning
Flowbound is an autonomous decision engine for supply chain. It's part decision-making system, part
consulting wrapper, part chatbot agent that answers questions using a company's live operational data.
It targets small and mid-sized businesses first, building a track record before moving upmarket to
enterprise. The core pitch against SAP: making SAP-grade decision support accessible to companies that
can't staff an SAP consulting engagement, and closing the gap legacy ERP leaves for everyone below
enterprise scale. SAP isn't wrong for what it does. It's just priced for a different customer, and
Flowbound exists for the ones SAP left behind.

Voice: direct, plainspoken, a little blunt about the SAP-consultant-cost pain point. Not hype-y, not
"AI will change everything." Reads like an operator wrote it, not a marketing team. Warm, not stiff.

## Logo
The mark is a circular badge split into a black "comma" and a green "comma" by a winding white river,
representing flow through a decision process. The real logo file lives at `src/assets/logo.png` (cropped
tight to the circle with a transparent background, so it drops cleanly onto both light and dark
sections), imported through Astro's image pipeline in `src/components/LogoLockup.astro` (mark plus
wordmark, used in the nav and footer) so it's automatically optimized and resized at build time.
`public/logo-mark.svg` and `src/components/LogoMark.astro` are a hand-redrawn vector version, kept around
for anywhere a crisp scalable version is useful (also the basis for the generated OG image), but the
shipped `logo.png` is the source of truth for the real brand mark. The favicon is `public/favicon.svg`,
a separate crisp vector version, not the PNG.

Clear space: keep at least the width of the mark itself as padding on all sides. Don't recolor the mark,
and don't place it on busy photographic backgrounds.

## Color palette
Sampled directly from the real logo file (`public/logo.png`), not estimated.

| Token | Hex | Use |
|---|---|---|
| `fb-black` | `#0A0A0A` | Primary text, dark sections, footer |
| `fb-green-500` | `#005840` | Primary brand green: CTAs, accents, links (matches the logo's flat green) |
| `fb-green-600` | `#004838` | Hover states on green |
| `fb-green-400` | `#468B79` | Lighter accent green, matches the logo's gloss highlight |
| `fb-green-300` | `#66AE95` | Muted green accents on dark backgrounds |
| `fb-white` | `#FFFFFF` | Cards, high-contrast surfaces |
| `fb-paper` | `#F6F5F0` | Default page background (soft off-white, not stark white) |

Full green scale (50 to 900) is defined in `tailwind.config.js` under `colors.fb.green` for tints and
shades as needed. This is a deeper, more teal-leaning green than earlier drafts of this site used. If
you ever update the logo file again, re-sample the palette rather than eyeballing it (there's a quick
Python and Pillow script for this, ask and it can be redone in a couple of minutes).

## Typography
- **Display / headings and body:** Satoshi (one family across the whole site, differentiated by weight)
- **Mono / labels / eyebrows / data callouts:** IBM Plex Mono

Both are self-hosted (not loaded from a third-party CDN) as `.woff2` files in `public/fonts/`, declared
via `@font-face` in `src/index.css` and preloaded in `src/layouts/BaseLayout.astro`. That was a deliberate
performance call: no third-party font origin sitting in the critical path. Satoshi is free for personal
and commercial use and doesn't ship a monospace companion, so IBM Plex Mono stays in place for the small
uppercase mono labels (eyebrows, data callouts) since there's no "Satoshi Mono" to swap in. Headings are
semibold with tight tracking, no letter-spacing tricks beyond what's already set. Eyebrow labels use mono,
uppercase, wide tracking, green.

## Layout principles
- Left-aligned text blocks, not centered. This is an operator's tool, not a consumer app.
- Card grids and bullet checklists over long paragraphs for feature breakdowns.
- A full-bleed dark hero and a full-bleed black comparison section, so the dark end of the palette gets
  used meaningfully and not just as an accent.
- Square-ish corners (2 to 4px radius) on cards, buttons, and page-level surfaces. No uniform pill or
  rounded-card look. **Exceptions:**
  - Small floating overlay UI (the nav's Services dropdown and its nested flyouts) is deliberately
    rounded (`rounded-2xl`), by explicit design direction, to read as a lighter-weight interactive layer
    distinct from the page's structural cards.
  - A "featured" CTA that hands off to another page can be a fully rounded pill (`rounded-full`), by
    explicit design direction, to visually distinguish "go explore this other thing" from the site's
    normal square action buttons. Two variants exist on `/services`, plus the same section-level variant
    on the homepage's `ProductSystem.astro` (`See the full product`, under the four-tile grid, linking to
    `/product`) and `HowItWorks.astro` (`See how it works in depth`, under the four-step grid, linking to
    `/how-it-works`): the section-level button (one per section, centered under the whole capability grid, e.g.
    `Explore Ask Flowbound`, `Explore Customer Service`, `Explore Quality Monitoring`, wired via
    `href`/`ctaLabel` set on the whole service in `services.ts` rather than on an individual capability),
    and a smaller per-capability version centered
    directly under an individual tile whenever that capability has a dedicated page (`href` set on the
    capability instead), e.g. `Explore Demand Forecasting` under the Demand Forecasting tile. A service
    sets `href` at either the whole-service level or the per-capability level depending on whether its
    capabilities are better told as one narrative page or split into one page each, never both at once.
    A section can have multiple of the smaller per-tile pills (one per capability with its own page)
    without breaking the "sparingly" rule, since each pill belongs to its own tile rather than competing
    for the same spotlight. Don't animate this pill's hover state via `gap` (it changes the label's
    wrapped line count inside the `max-w` pill and shifts the tile above it); use `translate-x` on the
    icon and arrow instead to get the "spread apart" feel without affecting layout. The larger
    section-level pill is the exception: it's a fixed-width, one-per-section button, so `hover:gap-4` is
    fine there and won't shift surrounding layout.
  Don't "fix" either of these back to square; they're intentional, not an inconsistency.
- No purple, no gradients beyond the subtle green gradient in the logo mark and the hero background glow.
- Secondary-page hero: full-bleed dark section with an animated line-art graphic, same "vibe" as the
  homepage hero, but each page gets its **own** graphic composition rather than reusing `FlowBackground`
  verbatim. Thirteen exist so far: `ServicesOrbit.astro` for `/services` (a hub with capabilities orbiting
  it, vs. the homepage's signals converging from fixed sources); `AskFlowboundBackground.astro` for
  `/ask-flowbound` (the `spark` `SectionIcon` itself, enlarged and slowly rotating, as the hub, trading
  bidirectional question/answer pulses with small chat-bubble nodes); `DemandForecastingBackground.astro`
  for `/demand-forecasting` (a rotating `crate` hub with historical sales nodes flowing in and a forecast
  trend line climbing out); `InventoryTrackingBackground.astro` for `/inventory-tracking` (a fixed `crate`
  hub with a rotating radar-sweep wedge and three orbiting live-status nodes); `ShippingOptimizationBackground.astro`
  for `/shipping-optimization` (a fixed `crate` hub with several candidate lanes fanned out, one clearly
  brighter with a package actually moving along it, the rest dim and still being compared);
  `SupplierCoordinationBackground.astro` for `/supplier-coordination` (a rotating `network` hub with calm,
  idle supplier nodes and one actively flagged and pulsing); `WholesaleAccountManagementBackground.astro`
  for `/wholesale-account-management` (a fixed `network` hub with steady, synced account nodes each
  carrying a tier badge and a checkmark, no alert, no urgency); `ReorderBackground.astro` for `/reorder`
  (a fixed `bolt` hub with a stock gauge draining toward a dashed reorder-point line that fires a pulse
  into the hub the instant it crosses, which fires straight back out to purchase-order nodes flashing to
  life); `PricingBackground.astro` for `/pricing` (a rotating `bolt` hub with a supplier-cost signal
  and a demand signal flowing in, and a price-tag node whose needle sweeps back and forth but never passes
  two fixed bound markers); `CustomerServiceBackground.astro` for `/customer-service` (a fixed `chat` hub
  with customer questions flowing in, most answered directly with a return pulse along the same path, and
  one routed out to a separate handoff node instead, standing in for the cases that need a person);
  `QualityMonitoringBackground.astro` for `/quality-monitoring` (a rotating `shield-check` hub with three
  calm, passing inspection batches and one actively flagged with a brighter, pulsing ring and an alert
  mark); `ProductBackground.astro` for `/product` (four pillar nodes, one per corner, converging on a
  fixed `compass` hub, standing in for "one system, reached four ways," the compass's four ticks echoing
  the four pillars converging on it); and `HowItWorksBackground.astro` for `/how-it-works` (a single
  `gear` hub, rotating clockwise, with the four step nodes, connect, signal, decision, ask, flowing into
  it); and `BlogBackground.astro` for `/blog` (a fixed `document` hub sending pulses outward to three small
  open-book "reader" nodes, the only hero where signals flow out from the hub rather than converging into
  it, standing in for insight reaching readers instead of signal reaching a decision). Copy the pattern, not
  the file: same
  dark background, same green glow palette and pulse-ring motif, new composition each time, and vary
  whether the hub itself rotates or stays fixed so consecutive pages don't feel identical. None of the
  hubs use a small center "core dot" anymore; a few early ones shipped with one to fill the empty middle
  of a hollow icon, but it read as a stray artifact once you looked for it, so it was dropped everywhere.
- A "featured" CTA button that hands off to a deeper page (see the pill-button exception above) can use a
  left-to-right color-sweep hover instead of an instant color change: an absolute `inset-0` overlay in the
  darker shade, `scale-x-0 origin-left`, transitioning to `scale-x-100` on `group-hover`, clipped by the
  parent's `overflow-hidden` and rounded shape. This reads as more deliberate than a flat color fade and
  pairs well with the pill shape above; it's not meant to replace the flat hover fades used elsewhere.
- Capability tiles within the same row of a grid stay equal height (`flex-1` on the card inside a
  `flex flex-col` wrapper), even when descriptions run different lengths, so per-tile CTA buttons line up
  at a consistent baseline instead of trailing off at whatever height the shortest card happens to be.
- For a page with multiple repeating content sections (like the Services page's per-service sections),
  alternate section backgrounds (paper/white) rather than stacking the same background repeatedly, and
  use one full dark "spotlight" section as a deliberate visual anchor partway down rather than none. A
  small faint monoline icon (see `SectionIcon.astro`) in the top-right of each section's text block fills
  the empty space next to left-aligned copy without competing with it.

## Where things live
- `src/assets/logo.png`: the real logo file, cropped and transparent, run through Astro's image pipeline
  wherever it's used
- `src/components/LogoLockup.astro`: logo lockup (mark plus wordmark), used in nav and footer
- `src/components/LogoMark.astro`: hand-redrawn vector mark on its own, for anywhere the wordmark isn't
  needed
- `public/logo-mark.svg`: source vector for the mark, also the basis for the generated OG image
- `public/favicon.svg`: the favicon (a vector version, not the PNG logo)
- `public/fonts/`: self-hosted Satoshi and IBM Plex Mono `.woff2` files
- `src/components/FlowBackground.astro`: full-bleed animated hero background for the homepage (signals
  flowing into the core)
- `src/components/ServicesOrbit.astro`: full-bleed animated hero background for the Services page (hub
  and orbiting capability nodes); the template to follow for other secondary-page heroes, not to reuse
  directly
- `src/components/AskFlowboundBackground.astro`: full-bleed animated hero background for `/ask-flowbound`
  (the `spark` icon as a rotating hub, trading pulses with small chat nodes); a second reference example
  of the "own composition per page" rule above
- `src/components/DemandForecastingBackground.astro`, `InventoryTrackingBackground.astro`,
  `ShippingOptimizationBackground.astro`, `SupplierCoordinationBackground.astro`,
  `WholesaleAccountManagementBackground.astro`: full-bleed animated hero backgrounds for the five
  dedicated capability pages under Inventory and Supplier Management, each its own composition per the
  "Secondary-page hero" rule above
- `src/components/ReorderBackground.astro`, `PricingBackground.astro`: full-bleed animated hero
  backgrounds for the two dedicated capability pages under Autonomous, same rule, using the `bolt` icon
  as their hub instead of `crate` or `network`
- `src/components/CustomerServiceBackground.astro`, `QualityMonitoringBackground.astro`: full-bleed
  animated hero backgrounds for the two whole-service narrative pages (`/customer-service`,
  `/quality-monitoring`), same rule, using the `chat` and `shield-check` icons as their hub respectively,
  the first hero use of either icon
- `src/components/ProductBackground.astro`: full-bleed animated hero background for `/product`, same
  rule, a fixed `compass` hub with four pillar nodes converging on it
- `src/components/HowItWorksBackground.astro`: full-bleed animated hero background for `/how-it-works`,
  same rule, a single rotating `gear` hub with the four step nodes flowing in
- `src/components/BlogBackground.astro`: full-bleed animated hero background for `/blog`, same rule, a
  fixed `document` hub sending pulses outward to three open-book reader nodes
- `src/components/icons/SectionIcon.astro`: small monoline section icons (crate, network, bolt, chat,
  shield-check, spark, compass, gear, document), used top-right of a section's text block on content pages.
  `gear`
  is computed rather than hand-drawn: a proper flat-toothed cog outline (an 8-point polygon alternating
  outer/inner radius per tooth, not spokes on a ring) plus eight small connector nodes radiating off it,
  each a short line ending in a hollow dot, echoing "the engine, wired into everything else." The same
  `gearOutline`/`polar` helpers are duplicated (not imported) in `HowItWorksBackground.astro` for the
  hero's rotating hub, matching this codebase's convention of small per-component duplication over a
  shared utils file.
- `src/components/Seo.astro`: per-page title, description, canonical, OG/Twitter tags, and JSON-LD schema
- `src/layouts/BaseLayout.astro`: the shared page shell (nav, footer, font preloads, `<Seo>`), used by
  every page
- `tailwind.config.js`: full color scale, font families, radius scale
- `src/index.css`: base styles, `@font-face` declarations, shared utility classes (`.container-fb`,
  `.eyebrow`), motion keyframes
