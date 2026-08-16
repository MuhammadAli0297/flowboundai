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
sections). `public/logo-mark.svg` and `src/components/LogoMark.astro` are a hand-redrawn vector version,
kept around for anywhere a crisp scalable version is useful (also the basis for the generated OG image).
The favicon is `public/favicon.svg`, a separate crisp vector version, not the PNG.

Clear space: keep at least the width of the mark itself as padding on all sides. Don't place it on busy
photographic backgrounds.

**Nav and Footer now render the recolored vector, not the PNG.** `src/components/LogoLockup.astro` (mark
plus wordmark, used in the nav and footer) used to import `logo.png` through Astro's image pipeline, since
that PNG was the source of truth for the real brand mark. At the user's explicit request extending the
homepage's `ocean` palette to Nav/Footer/the logo, it now renders `LogoMark.astro` instead, with a new
`palette="ocean"` prop that swaps the gradient stops (the raster PNG has no equivalent recolor path short
of re-exporting the asset, which risks gradient-banding and edge artifacts the vector doesn't have to
worry about). `logo.png` is still the source of truth for the original dark-green mark and is unused in
code today, not deleted. `LogoMark.astro` also takes an `id` prop now (Nav and Footer each render their
own instance on the same page load, so their `<defs>` gradient ids can't collide).

**The river is no longer pure white in the ocean palette.** The white line dividing the mark's two "comma"
shapes was white in both palettes originally. At the user's request, the `"ocean"` palette now uses
`ocean-100` (Alice Blue, `#DBE9EE`) for it instead: still light enough to read as a clean divide against
the dark comma (`ocean-950`) and the mid-blue gradient comma, but pulled from the same five-color family
instead of sitting outside it. The `"fb"` palette (the untouched original mark, unused in code today but
preserved) still uses true white, don't change that one.

## Color palette
Sampled directly from the real logo file (`public/logo.png`), not estimated.

| Token | Hex | Use |
|---|---|---|
| `fb-black` | `#0A0A0A` | Primary text, dark sections (footer is now `ocean-900`, see below) |
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

**Homepage exception, now also sitewide chrome, and now most of the site.** `/` uses a second, additive
`ocean` palette (Alice Blue `#DBE9EE`, Pale Sky `#C0D6DF`, Smart Blue `#4A6FA5`, Blue Slate `#4F6D7A`,
Baltic Blue `#166088`, plus a darkened `ocean-950` derivative for text) instead of `fb-*`, at the user's
explicit request, originally scoped only to `Hero.astro`, `ProductSystem.astro`, `HowItWorks.astro`,
`WhyUs.astro`, `SapComparison.astro`, `Mission.astro`, and `Cta.astro` (that last one only nominally:
`Cta.astro` is actually the shared closing CTA reused at the bottom of most secondary pages too, so
`ocean-*` was already reaching most of the site before Nav/Footer/logo, just via that one shared section).
The user then explicitly extended it, one request at a time, to: `Nav.astro`, `Footer.astro`, and the logo
(nav background `ocean-100`/90 with a sticky blur, link text full-opacity `ocean-950`, not the `/70`
fb-black used before, at nav's lighter `ocean-100` background `ocean-950` at 70% opacity works out to
roughly 3.8:1 contrast, below the 4.5:1 AA text needs, checked with the actual blended-color math; hover
`ocean-600`; footer background moved from `fb-black` to `ocean-900`, Baltic Blue, matching the same
full-bleed dark already used by the hero and the SAP-comparison section); then `/product`; then
`/services`; then, in a later session still, all ten dedicated capability and whole-service narrative pages
(`/demand-forecasting`, `/inventory-tracking`, `/shipping-optimization`, `/supplier-coordination`,
`/wholesale-account-management`, `/reorder`, `/pricing`, `/ask-flowbound`, `/customer-service`,
`/quality-monitoring`); then `/how-it-works`; then `/blog`, in a later session still. Each extension was its
own explicit ask, never assumed or offered proactively.
**As of the `/blog` conversion, every page on the site uses `ocean-*` except `/404`**, which was never
brought into scope and is still `fb-*`, an untouched page rather than drift. Don't spread `ocean-*` to `/404`
without being asked, the pattern this whole project has followed is "ask first, every time," not "finish
the job," and don't revert any of the pages already converted back to `fb-*` either, none of this is drift
to be "fixed." See `CLAUDE.md`'s "Homepage" and "Capability, narrative, and blog pages" sections for
the full detail, including a real contrast bug (illegible eyebrow text) that shipped once from composing
the shared `.eyebrow` class with a color override, worth reading before touching text color on any of these
pages again.

## Typography
- **Display / headings and body:** Satoshi (one family across the whole site, differentiated by weight)
- **Mono / labels / eyebrows / data callouts:** IBM Plex Mono
- **Homepage / Nav / Footer / logo / `/product` / `/services` / all ten capability and narrative pages /
  `/how-it-works` / `/blog`:** Amulya, a second display font, same scope as the ocean palette (see above,
  every page except `/404`), applied via the `font-amulya` Tailwind token, not a replacement for
  `font-display`/`font-body` anywhere else

Satoshi and IBM Plex Mono are self-hosted (not loaded from a third-party CDN) as `.woff2` files in
`public/fonts/`, declared via `@font-face` in `src/index.css` and preloaded in
`src/layouts/BaseLayout.astro`. That was a deliberate performance call: no third-party font origin sitting
in the critical path. Satoshi is free for personal and commercial use and doesn't ship a monospace
companion, so IBM Plex Mono stays in place for the small uppercase mono labels (eyebrows, data callouts)
since there's no "Satoshi Mono" to swap in. Headings are semibold with tight tracking, no letter-spacing
tricks beyond what's already set. Eyebrow labels use mono, uppercase, wide tracking, and the section's
accent color (green off the homepage, ocean on it).

Amulya (from Fontshare, at the user's request) follows the same self-hosting rule but is a genuine
variable font, one `.woff2` covers weight 300 to 700 continuously (plus a second file for italic), rather
than a set of static per-weight files like Satoshi above. That range is used deliberately across the
homepage/Nav/Footer for typographic depth, not left at one weight everywhere: `font-semibold` for section
headings, `font-medium` one step down for card/step titles, `font-normal` for body copy, occasionally
`font-light` for large pull-quote-style text (not small body text, thin weights get hard to read at small
sizes), plus the occasional single-phrase `italic` accent (Hero's "SAP consultant", Mission's "period") as
a one-off flourish, not a running style. See `CLAUDE.md`'s "Homepage" section for the full detail,
including a real gotcha: `h1`-`h4` have their own direct font-family rule in `src/index.css`'s base layer,
so `font-amulya` has to go on every heading tag itself, not just a wrapping section, inheritance alone
doesn't reach headings the way it does for `p`/`span`/`a`.

## Buttons
Two shapes, used deliberately: pill (`rounded-full`) is reserved for the "featured hand-off to another
page" CTA (see the pill exception under Layout principles below), everything else is `rounded-md`,
square-ish per the default rule. As of the button redesign on the homepage and Nav, both shapes share one
hover language so they read as the same system despite the shape difference: a `&rarr;` that translates
right on `group-hover`, `hover:-translate-y-0.5` plus a soft shadow, and for filled (primary) buttons a
left-to-right color-sweep fill (`absolute inset-0 scale-x-0 origin-left` → `group-hover:scale-x-100`,
clipped by `overflow-hidden`). Outlined (secondary) buttons get a soft background wash fading in on hover
instead of a hard instant color invert, that reads more deliberate at this weight of button. Primary
buttons are `font-semibold`, secondary `font-medium`, one more place weight (not just color/fill) carries
hierarchy.

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
  homepage hero used to be, but each page gets its **own** graphic composition rather than reusing
  `FlowBackground` verbatim. The homepage itself no longer follows this pattern at all: its hero
  (`HeroBackground.astro`) is now a real WebGL particle wave via three.js in the `ocean` palette, not an
  SVG/SMIL line-art composition in the green/black palette, see `CLAUDE.md`'s "Homepage" section.
  `/product` followed suit in a later session (see `CLAUDE.md`'s "Homepage" section, "Product page" note):
  it has a WebGL hero (`productHeroWave.ts`, "Convergent Signals": four particle streams drifting in from
  the corners to merge into one glowing hub), in the `ocean` palette, scoped to just that one script.
  `/services` tried a WebGL hero too in the same session ("Modular Assembly": a particle field that
  scatters, assembles into a hex lattice, holds, loosens, repeats), but it was explicitly removed again
  at the user's request; `ServicesOrbit.astro` is back to a **static** `ocean`-palette gradient wash, no
  canvas, no script, see `CLAUDE.md`'s "Services page" note for the full history before reintroducing
  motion there. `/services` did keep one exception from that session: the full-screen `min-h-screen-nav`
  hero treatment. `/product`'s hero picked up the same full-screen treatment in a still-later session, so
  `/`, `/product`, and `/services` are now the three full-screen heroes on the site. `/services` itself is
  now neither SVG/SMIL nor WebGL, just a static gradient, a category of its own.
  `FlowBackground.astro` still exists but isn't imported anywhere currently; left on disk rather than
  deleted, in case a future secondary page wants that exact composition.

  In a later session still, ten more secondary heroes moved off the SVG/SMIL pattern too: every dedicated
  capability page and every whole-service narrative page, each onto its own real JS canvas hero (Canvas 2D,
  `requestAnimationFrame`, not WebGL) in the `ocean` palette instead of the green/black `fb-*` one. See
  `CLAUDE.md`'s "Capability, narrative, and blog pages" section for the shared technical rules: drawing is
  `ctx.clip()`-ed to roughly the right 40% of the section so it can never cross under the headline, the
  composition fills that clipped strip's full height rather than clustering, and every hub stays fixed
  rather than rotating (a deliberate reversal from the rotate-or-not variation the SVG/SMIL heroes used).
  `/how-it-works` followed in a still later session, its own canvas hero too, described below. `/blog`
  followed in a later session still, also its own canvas hero, described below: **no secondary hero on the
  site still follows the original SVG/SMIL pattern** described at the top of this bullet; `FlowBackground.astro`
  remains on disk, unused, as the only surviving example of that pattern's shape (see "Where things live"
  below, don't delete it).

  The twelve canvas heroes, each a genuinely different mechanism per an explicit "mix the elements" request
  after the first page's hero was pitched as three separate pure concepts, not just a different color:
  `AskFlowboundBackground.astro`/`src/scripts/askFlowboundHero.ts` for `/ask-flowbound`, **"Signal Field"**
  (a fixed `spark` hub, ripple rings breathing outward, a drifting node field spread across the full strip,
  comet-trail question/answer pulses on independent per-node cycles); `DemandForecastingBackground.astro`/
  `demandForecastingHero.ts` for `/demand-forecasting`, **"Forecast Horizon"** (history bars settling into
  a fixed `crate` hub at the pivot where history turns into a smoothly climbing projected curve, trailed by
  a soft confidence cone and a traveling pulse; one bar flares bright for a bestseller, another dims and
  flattens for dead stock); `InventoryTrackingBackground.astro`/`inventoryTrackingHero.ts` for
  `/inventory-tracking`, **"Live Scan"** (a fixed `crate` hub anchoring two static radar rings and a
  rotating sweep line; a scattered grid of status cells flares and reveals on-hand/incoming/committed as
  the sweep passes each one); `ShippingOptimizationBackground.astro`/`shippingOptimizationHero.ts` for
  `/shipping-optimization`, **"Lane Race"** (a fixed `crate` hub sending a comet-trail dot down each of
  five fanned candidate lanes every race cycle; four slow, fade, and stop partway, one runs the full
  distance and lights its destination, a different lane winning each cycle); `SupplierCoordinationBackground.astro`/
  `supplierCoordinationHero.ts` for `/supplier-coordination`, **"Supplier Pulse"** (a fixed `network` hub
  among several supplier nodes that mostly just breathe calmly; one, a different one each cycle, escalates
  and sends a comet-trail signal into the hub before settling back down); `WholesaleAccountManagementBackground.astro`/
  `wholesaleAccountManagementHero.ts` for `/wholesale-account-management`, **"Ledger Sync"** (a fixed
  `network` hub among account nodes each carrying a tier ring and a checkmark, breathing in unison,
  deliberately with *no* alert ever; a synchronization wave ripples outward from the hub every few seconds
  and flashes each account as it passes); `ReorderBackground.astro`/`reorderHero.ts` for `/reorder`,
  **"Threshold Drop"** (a vertical stock gauge drains toward a dashed reorder-point line; the instant it
  crosses, a flash fires a bolt-shaped streak into the fixed `bolt` hub, which fires back out to three
  purchase-order nodes lighting up in sequence, before the gauge resets); `PricingBackground.astro`/
  `pricingHero.ts` for `/pricing`, **"Margin Band"** (a fixed `bolt` hub taking two continuous cost/demand
  signal loops; a needle drifts smoothly on a bounded track below it, nudged by both but never crossing the
  fixed floor/ceiling markers, deliberately with *no* discrete event, the explicit contrast to Reorder);
  `CustomerServiceBackground.astro`/`customerServiceHero.ts` for `/customer-service`, **"Inbox Flow"** (a
  steady stream of message bubbles travels toward a fixed `chat` hub; most bounce back answered with a
  checkmark flash, one in four reroutes to a separate handoff node and settles there instead);
  `QualityMonitoringBackground.astro`/`qualityMonitoringHero.ts` for `/quality-monitoring`, **"Inspection
  Line"** (a horizontal conveyor runs through a fixed `shield-check` checkpoint; most batches cross straight
  through with a checkmark flash, one in five stops, pulses an alert ring and a flag mark, then continues on
  marked); `HowItWorksBackground.astro`/`howItWorksHero.ts` for `/how-it-works`, **"Scroll-Driven
  Assembly"** (a winding path runs the full height of the strip through four checkpoint nodes, connect,
  signal, decide, ask, the same four steps as the page's own step cards; a faint dash pattern flows along
  it continuously as ambient motion, but a bright comet's *position* along the path is driven directly by
  `watchScrollProgress` rather than its own clock, so it advances through the four steps in lockstep with
  how far the visitor has scrolled the hero, reversible scrolling back up, each node lighting up as the
  comet passes and dimming again if you scroll back past it); and, added in a later session still,
  `BlogBackground.astro`/`blogHero.ts` for `/blog`, **"Insight Stream"** (a fixed `document` hub sends
  ripple rings breathing outward and comet-trail pulses traveling *outward* along curved paths to a spread
  of small open-book "reader" nodes across the full clipped strip, each node on its own independent pulse
  cycle; the only hero in the batch where the flow direction is reversed from every other page's
  converge-on-the-hub story, standing in for insight reaching readers instead of signal reaching a
  decision). "Scroll-Driven Assembly" is the only one of the twelve canvas heroes whose main motion is
  scroll-linked rather than self-timed, borrowing the mechanism the homepage and `/product` WebGL heroes use
  for their fade/zoom, applied to a canvas hero's actual composition instead. It's also the second hero on
  the site, after Quality Monitoring's conveyor, that isn't a hub-and-spokes shape: a sequential path
  through four checkpoints instead of spokes converging on one hub. Insight Stream, by contrast, is
  hub-and-spokes like the first ten, just with the spoke traffic reversed.

  Copy the pattern, not the file, whichever category a new hero falls into: same dark background, same
  glow palette and pulse-ring motif (SVG/SMIL pair, no longer used by any live page but still the shape
  `FlowBackground.astro` preserves) or same clip/fill-the-strip/fixed-hub rules (canvas twelve), new
  composition every time. None of the hubs, SVG/SMIL or canvas, use a small center "core dot": a few early
  ones shipped with one to fill the empty middle of a hollow icon, but it read as a stray artifact once you
  looked for it, so it was dropped everywhere and never brought back.
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
- `src/assets/logo.png`: the real logo file, cropped and transparent, still the source of truth for the
  brand mark, but not imported anywhere in code today, `LogoLockup.astro` renders `LogoMark.astro` instead
  now (see the Logo section above)
- `src/components/LogoLockup.astro`: logo lockup (mark plus wordmark), used in nav and footer, renders
  `LogoMark.astro` with `palette="ocean"`
- `src/components/LogoMark.astro`: hand-redrawn vector mark on its own, for anywhere the wordmark isn't
  needed, takes `palette` (`"fb"` or `"ocean"`) and `id` props
- `public/logo-mark.svg`: source vector for the mark, also the basis for the generated OG image
- `public/favicon.svg`: the favicon (a vector version, not the PNG logo)
- `public/fonts/`: self-hosted Satoshi, IBM Plex Mono, and Amulya (homepage/Nav/Footer/logo, `/product`,
  `/services`, all ten capability/narrative pages, `/how-it-works`, and `/blog`, see Typography above)
  `.woff2` files
- `src/components/HeroBackground.astro`: full-bleed WebGL hero background for the homepage only (three.js
  particle wave, `ocean` palette, driven by `src/scripts/heroWave.ts`), not an SVG/SMIL composition like
  every other secondary-page hero except `/product`'s. See `CLAUDE.md`'s "Homepage" section before
  touching it.
- `src/components/FlowBackground.astro`: full-bleed animated SVG/SMIL hero background (signals flowing
  into the core), not imported anywhere currently, left on disk rather than deleted, now the only surviving
  example of the SVG/SMIL secondary-hero pattern's shape since every live secondary hero (including
  `/blog`, the last holdout) has moved to canvas or WebGL
- `src/components/ServicesOrbit.astro`: static (non-animated) full-bleed `ocean`-palette gradient
  background for `/services` only. Previously a WebGL particle system ("Modular Assembly"), explicitly
  removed at the user's request; see `CLAUDE.md`'s "Homepage" section, "Services page" note, for the full
  history before reintroducing any hero animation here. The twelve capability/narrative/blog-page heroes
  below it, plus `HowItWorksBackground.astro`, are canvas-based, see `CLAUDE.md`'s "Capability, narrative,
  and blog pages" section.
- `src/components/AskFlowboundBackground.astro`, `DemandForecastingBackground.astro`,
  `InventoryTrackingBackground.astro`, `ShippingOptimizationBackground.astro`,
  `SupplierCoordinationBackground.astro`, `WholesaleAccountManagementBackground.astro`,
  `ReorderBackground.astro`, `PricingBackground.astro`, `CustomerServiceBackground.astro`,
  `QualityMonitoringBackground.astro`, `HowItWorksBackground.astro`, `BlogBackground.astro`: full-bleed hero
  backgrounds for the seven dedicated capability pages, three whole-service narrative pages, `/how-it-works`,
  and `/blog`. Each is just a `<canvas>` wrapper (plus a static CSS base-gradient and grain overlay)
  importing its own same-named script from `src/scripts/` (e.g. `askFlowboundHero.ts`, `howItWorksHero.ts`,
  `blogHero.ts`), not an SVG/SMIL composition, that's a change from how `AskFlowboundBackground.astro`/
  `HowItWorksBackground.astro`/`BlogBackground.astro` used to work. See the "Secondary-page hero" bullet
  above for what each one shows and `CLAUDE.md`'s "Capability, narrative, and blog pages" section for the
  shared technical rules (clipped drawing, fixed hubs, the `export {}` module-scope gotcha, though
  `howItWorksHero.ts` is exempt from that last one since it has a real import) before adding a thirteenth.
- `src/components/ProductBackground.astro`: full-bleed WebGL hero background for `/product` only (three.js
  particle streams, `ocean` palette, driven by `src/scripts/productHeroWave.ts`), not an SVG/SMIL or canvas
  composition like every other secondary-page hero. See `CLAUDE.md`'s "Homepage" section, "Product page"
  note, before touching it.
- `src/components/icons/SectionIcon.astro`: small monoline section icons (crate, network, bolt, chat,
  shield-check, spark, compass, gear, document), used top-right of a section's text block on content pages.
  `gear`
  is computed rather than hand-drawn: a proper flat-toothed cog outline (an 8-point polygon alternating
  outer/inner radius per tooth, not spokes on a ring) orbited by eight small hollow nodes, echoing "the
  engine, wired into everything else." The nodes used to each carry a connecting line back to the gear, but
  the line's endpoint sat at the node circle's own center, so it always crossed the ring's stroke and
  dangled into its hollow middle, a stray "tail" inside every node with no room to fix cleanly (no gap
  fits on both the gear side and the node side without clipping the viewBox); removed rather than patched,
  the nodes are plain floating dots now. `gear` is
  also the watermark icon on `/how-it-works`'s "what it is" section (spin/pulse-ring/drift treatment, same
  as every other capability page's watermark); the hero itself no longer duplicates the gear geometry now
  that `HowItWorksBackground.astro` is canvas-based, it draws the four step glyphs instead (see
  "Secondary-page hero" above).
- `src/components/Seo.astro`: per-page title, description, canonical, OG/Twitter tags, and JSON-LD schema
- `src/layouts/BaseLayout.astro`: the shared page shell (nav, footer, font preloads, `<Seo>`), used by
  every page
- `tailwind.config.js`: full color scale, font families, radius scale
- `src/index.css`: base styles, `@font-face` declarations, shared utility classes (`.container-fb`,
  `.eyebrow`), motion keyframes
