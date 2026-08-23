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
screenshot check (`shot.mjs` via Playwright, against `npm run preview`) before calling any visual change
done. Always do this for UI changes; don't just trust the build passing. `npm run preview` does not
reliably run on port 4173: Astro's actual default is 4321, falling back to the next free port (4322, etc.)
if something else, like `npm run dev`, already holds 4321. Check the actual port the command prints rather
than assuming one. Playwright is **not** a committed dependency (kept out of `package.json` on purpose,
it's dev-verification-only, not app code): check for a cached install in the npx cache first (an
`~/.npm/_npx/<hash>/node_modules/playwright` directory, shows up as an "Additional working directory" in
the environment info when present) before installing anything, copy the driver script in and run it from
there so ESM import resolution finds `playwright`, then delete the copy; otherwise
`npm install --no-save playwright@<version>` temporarily. When verifying a canvas/JS animation loop
specifically, pass `page.emulateMedia({ reducedMotion: 'no-preference' })` before `page.goto()`, this dev
machine has OS-level Reduce Motion on, which makes default screenshots always show the static
`prefers-reduced-motion` fallback frame instead of the live animation.

## Architecture

Astro + TypeScript + Tailwind, static output (`output: "static"` in `astro.config.mjs`), zero client-side
JS framework by default: no React or any JS framework ships on most of this site. One-off interactivity
(mouse-glow hover effects, hero background animation) is vanilla JS/SVG in `.astro` files or
`src/scripts/`. The homepage hero is a deliberate, scoped exception to this (real WebGL via three.js, see
"Homepage" below); it's confirmed to only ship on `/`, not any other page. Follow that same
scoped/lazy-loaded/single-page pattern rather than defaulting to zero JS if a future page genuinely needs
something heavier, don't add a framework or a heavy library site-wide.

### Page structure

- `src/pages/`: one file per route, mostly flat (no nested layouts beyond `BaseLayout`)
- `src/layouts/BaseLayout.astro`: shared shell (nav, footer, font preloads, `<Seo>`) used by every page
- `src/components/Seo.astro`: per-page title/description/canonical/OG/Twitter/JSON-LD, used by every page
- `src/content/blog/`: Markdown blog posts via Astro's Content Layer API, schema in `src/content.config.ts`;
  `/blog` (paginated index), `/blog/[slug]`, `/blog/tags/[tag]` all derive from this collection

### Blog

Every post needs a `category` (one fixed value from `src/data/blogCategories.ts`, each mapped to a
`SectionIcon` name) plus any number of freeform `tags` (used only by `/blog/tags/[tag]`, unrelated to
category). `/blog` (`src/pages/blog/[...page].astro`) shows 9 posts per page, newest first, with a search
box and category checkboxes in a sidebar. Search and category filters match across **every** post on the
site, not just the current page: every post is rendered into every page's HTML (hidden via a class if it
isn't on that particular page), and `src/scripts/blogFilter.ts` shows/hides across all of them once a
filter is active, hiding the pagination controls while it does. Sidebar category counts are computed from
the full collection, not the current page. Card thumbnails (`src/components/BlogThumbnail.astro`) are
generated from the category icon, not real photos, so there's no imagery to source as posts get added.
`BlogBackground.astro` is the page's hero: a real JS canvas hero ("Insight Stream," see "Capability,
narrative, and blog pages" below for the shared canvas-hero conventions), the one hero on the site where
signal flows outward from the hub rather than converging into it (see BRAND_GUIDELINES.md).

Be cautious about publishing volume: a plan to add many posts a day for months risks Google's "scaled
content abuse" policy if quality drops to hit a quota. Favor fewer, genuinely useful posts over hitting a
cadence target.

**All 21 posts SEO-rewritten (2026-08-23).** Every existing post was rewritten through a real content
pipeline, not a stylistic pass: real competitor-article research (WebSearch/WebFetch against actual
top-ranking articles for the post's target keyword, never vendor homepages, which don't have the H2/H3
article structure needed for gap analysis), a content-gap analysis, a ~1,500-word outline with a tight
featured-snippet-targeted definition up front, a draft in the site's existing voice (no em dashes, concrete
numbers over generic advice), an EEAT self-review, 5+ internal links woven into sentences (not bare lists),
and 3 title-tag/meta-description options each, capped so the rendered `{title} | Flowbound` tag stays under
60 characters and the description under 155. The first 9 posts map to the site's core keyword list (Supply
Chain, SAP, Demand Forecasting, Inventory Tracking, Shipping Optimization, Supplier Coordination, Wholesale
Account Management, Reorder, Pricing); the other 12 were each assigned a realistic informational keyword
based on their existing angle (e.g. "dead stock," "PO approval workflow," "incoming inspection"). This
process is now the standing default for blog work, not a one-off, and a new post should follow the same
pipeline rather than being written ad hoc.

One real accuracy bug surfaced and was fixed during this pass, worth knowing before writing another post's
closing product tie-in: a draft for `what-a-wholesale-account-actually-needs.md` described credit-limit and
credit-hold enforcement as something the product handles, but the actual Wholesale Account Management
capability (`src/data/services.ts`) only covers pricing tiers, order minimums, and standing agreements, not
AR/credit. **Before writing any paragraph that ties a post back to a specific Flowbound capability, read
that capability's actual description in `services.ts` and match it exactly**, don't extrapolate what the
product "probably" also does. A related dev-server gotcha found in the same session: a long-running
`astro dev` process's content-layer cache can go stale and keep serving an old post body even after the file
changed on disk and `astro check`/`astro build` both reflect the new content correctly; this isn't a browser
cache issue (confirmed with `curl` directly against the dev server) and the fix is restarting the dev server,
not investigating the browser.

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

The homepage is the one exception to this whole pattern: it no longer uses `FlowBackground.astro` (that
file still exists on disk but isn't imported anywhere currently, so don't delete it) or the green/black
`fb-*` palette. See "Homepage" below. `/product` became a second, later exception in the same shape (real
WebGL hero, `ocean` palette) at the user's explicit request; see "Homepage" below, the "Product page" note,
before touching `ProductBackground.astro`/`product.astro`. `/services` tried a WebGL hero too in the same
session, then had it explicitly removed again; its hero is back to a static (non-animated) `ocean`-palette
gradient. In a later session, all ten of the remaining dedicated capability and whole-service narrative
pages moved off this SVG/SMIL pattern too, onto a real JS canvas hero per page in the `ocean` palette; see
"Capability, narrative, and blog pages" below before touching any of their `*Background.astro`/`src/scripts/
*Hero.ts` files. `/how-it-works` followed in a still later session, its own canvas hero ("Scroll-Driven
Assembly"), and `/blog` followed in a later session still, its own canvas hero ("Insight Stream," see
"Capability, narrative, and blog pages" below for both). No secondary hero on the site still uses the
original SVG/SMIL pattern described in this section; `FlowBackground.astro` remains on disk, unused, as the
only surviving example of that pattern's shape (see below, don't delete it).

### Homepage

`/` (`src/pages/index.astro`) went through a full redesign in one session and now diverges from the rest
of the site on purpose in three ways. If you're picking this project back up, read this section before
touching `Hero.astro`, `HeroBackground.astro`, `ProductSystem.astro`, `HowItWorks.astro`, `WhyUs.astro`,
`SapComparison.astro`, `Mission.astro`, or `Cta.astro`.

**A second color palette, now also the sitewide chrome color.** `tailwind.config.js` has an `ocean` color
object (100/200/500/600/700/900/950, Alice Blue through Baltic Blue) alongside the site-wide `fb` palette.
It started as homepage-only and additive, but the user later explicitly asked to extend it to `Nav.astro`,
`Footer.astro`, and the logo (`LogoLockup.astro`/`LogoMark.astro`) too, so those three now use `ocean-*`
on every page, not just `/`. Everything else on secondary pages (page content, `fb-green` accents, section
heroes) is still unconverted `fb-*`: don't spread `ocean-*` further than Nav/Footer/logo plus the seven
homepage components without the user asking again, and don't "fix" any of this back to `fb-*`. **That was
true as of this session; later sessions extended `ocean-*` much further, one explicit ask at a time, to
`/product`, `/services`, all ten capability/narrative pages, then `/how-it-works`, and finally `/blog`, see
"Product page"/"Services page" below and "Capability, narrative, and blog pages" further down for the
current, much larger scope. As of that last conversion, every page on the site uses `ocean-*` except
`/404`, which was never brought into scope and is still on the original `fb-*` palette (it was never
mentioned anywhere in this file or BRAND_GUIDELINES.md as part of the redesign's scope, so this isn't drift,
just an untouched page).** One
correction to that "seven homepage components" framing while we're here: `Cta.astro` was never actually
homepage-exclusive, despite being described that way, it's the shared closing CTA reused at the bottom of
most secondary pages too (`/services`, `/product`, `/how-it-works`, every dedicated capability page, the
blog index). So `ocean-*` was already reaching most of the site before this session, just via that one
shared section, this session's Nav/Footer/logo change is additional to that, not the first time it
happened. Since
`LogoLockup.astro` now renders `LogoMark.astro` (the hand-redrawn vector, `palette="ocean"`) instead of the
real `logo.png` raster asset: the PNG can't be recolored without re-exporting it and risking gradient/edge
artifacts, but the vector's gradient stops are just hex values, so it became the reliable way to get an
ocean-toned mark. `logo.png` is unused in code now (still on disk, not deleted) and `LogoMark.astro` gained
a `palette` prop (`"fb"` keeps the original dark green, `"ocean"` is the new default caller) plus an `id`
prop, needed because Nav and Footer both render an instance on the same page at once and their gradient
defs would otherwise collide. On the seven original homepage components, it's additive, not a replacement:
dominant background is Alice Blue/Pale Sky (`ocean-100`/`ocean-200`, alternated between page and card surfaces
across sections); Hero and the SAP-comparison section stay full-bleed dark (`ocean-900`, Baltic Blue) as
the two intentional dark moments, matching the original `fb-black`/`fb-white` full-bleed-dark-section
pattern in `BRAND_GUIDELINES.md`. `ocean-950` is a darkened derivative of Baltic Blue used only for body/
heading text on the light sections, not one of the five source swatches: at full strength Baltic Blue only
just clears 4.5:1 contrast against Pale Sky, and any opacity below 100% drops it under that, so text needs
the extra margin `ocean-950` provides. **Whenever you touch homepage text color, check actual contrast
math, don't eyeball it** (see the `feedback` memory on this if you have memory access): the `.eyebrow`
utility class (`src/index.css`) bakes in `text-fb-green-500`, and composing it with a color-override
utility class on the same element is unreliable (Tailwind's generated cascade order isn't guaranteed to
put your override last), which shipped illegible eyebrow text once already. Write the mono-label styles
out explicitly (`font-mono text-xs uppercase tracking-[0.2em] text-ocean-*`) instead of using `.eyebrow`
anywhere on the homepage.

**A second display font, Amulya, scoped the same way as the ocean palette.** At the user's explicit
request, `Nav.astro`, `Footer.astro`, `LogoLockup.astro`, and the seven homepage components all use
`font-amulya` (Tailwind token, `tailwind.config.js`) instead of `font-display`/`font-body` (Satoshi).
Secondary-page content is unaffected, still Satoshi, same scoping shape as the ocean palette above,
including the same `Cta.astro` caveat: since it's the shared closing CTA reused on most secondary pages,
its `font-amulya` reaches those pages too, not just the homepage. Amulya (from Fontshare, self-hosted like
Satoshi and IBM Plex Mono, `@font-face` in `src/index.css`) ships as a genuine variable font, one file
covering weight 300 to 700 continuously plus a matching italic file, not a set of static per-weight files:
that's what makes it practical to actually vary weight across the page for typographic depth (the user's
explicit ask, "don't just use the same style everywhere") without a pile of extra font-file requests.
Tailwind's standard weight utilities (`font-light` 300 through `font-bold` 700) all land inside that range
and are used deliberately per role, not left at one default: section H2s are `font-semibold`, card/step H3s
one step down at `font-medium`, small body copy `font-normal` (large pull-quote-style text can safely go
`font-light`, small body copy shouldn't, it gets hard to read), buttons split `font-semibold` for primary
and `font-medium` for secondary. A few places also use `italic` as a one-off editorial accent on a single
phrase (Hero's "SAP consultant", Mission's "period"), not as a running style.
**One easy-to-forget gotcha**: `src/index.css`'s base layer sets `h1, h2, h3, h4 { @apply font-display }`
directly on the heading tags themselves, so putting `font-amulya` only on a wrapping `<section>` does
nothing for any `h1`-`h4` inside it, that direct element-selector rule always wins over inherited value
regardless of the ancestor's class. `font-amulya` has to go directly on every heading tag; non-heading text
(`p`, `span`, `a`, `li`) has no such competing rule sitewide, so it inherits from a section-level
`font-amulya` correctly. Learned this the hard way partway through wiring this up, worth checking first
next time rather than assuming inheritance handles headings too.

**Redesigned buttons, homepage and Nav.** The flat, square, instant-color-swap buttons (Hero's two, Cta's
two, Nav's one) were replaced with one shared treatment: `rounded-md` (still square-ish per the brand
guideline default, not the pill exception), a `&rarr;` that translates on `group-hover`, and
`hover:-translate-y-0.5` plus a soft shadow. Primary (filled) buttons get a sliding color-sweep fill
(the same `absolute inset-0 scale-x-0 origin-left → group-hover:scale-x-100` technique the pill CTAs
already used, now shared across both shapes, corner radius alone signals which is which) and `font-semibold`.
Secondary (outlined) buttons get a soft background wash fading in on hover instead of a hard color invert,
and `font-medium`, one step lighter than primary, another deliberate weight-based hierarchy cue. The
already-well-designed pill CTAs on `ProductSystem.astro`/`HowItWorks.astro` (`See the full product`,
`See how it works in depth`) weren't restructured, just switched to `font-amulya font-semibold` for
consistency with the rest. Fixing Nav's button for mobile surfaced a real, pre-existing near-zero-margin
fit at exactly the `md` breakpoint (768px: logo + four nav links + the button summed to what turned out to
be the *exact* available width, no slack at all), made worse by Amulya's bolder logo wordmark and the
button's new arrow icon tipping it into wrapping. Fixed by trimming nav's link `gap-8` to `gap-6` (back to
`lg:gap-8` at 1024px+) and delaying the button's `ml-10` to `lg:ml-10` (`ml-6` below that). If nav content
changes again, re-check widths in the 700-1024px range specifically, that's where the margin is thinnest.

**Only the hero is full-screen.** `min-h-screen-nav` (`src/index.css`, `calc(100dvh - 4rem)`, subtracting
the sticky nav's height) was tried on `ProductSystem.astro` and `HowItWorks.astro` too at one point, paired
with a companion mechanism (`data-reveal-group` in `scrollReveal.ts`) that waited for a whole section to
fill the screen before revealing its contents together, instead of each element revealing individually at
20% visible. Both were reverted at the user's explicit request, back to each section's natural content
height and the original per-element reveal. `scrollReveal.ts` is back to the single simple observer
described below; nothing in the codebase references `data-reveal-group` anymore. Only `Hero.astro` still
uses `min-h-screen-nav` among the *homepage's* sections, don't spread it to other homepage sections
without being asked again. `/services`'s hero picked up `min-h-screen-nav` too in a later session, at the
user's explicit request to make it "like the hero on the homepage"; see "Services page" below. `/product`'s
hero followed in a later session still, at the user's explicit request to make it "full page adaptible just
like the homepage and services page" (`min-h-screen-nav` on both the hero section and its text wrapper,
plus the homepage's `justify-start`/`pt-28 md:pt-36`/`pb-20` layout instead of the old fixed
`min-h-[560px] md:min-h-[680px]`/`justify-center py-20`). All three of these are separately-granted
exceptions, each asked for individually; still not a standing precedent to add it to a new page without
being asked.

**WhyUs/SapComparison/Mission/Cta got a liveliness pass too.** These four were static (no scroll-reveal, no
hover motion) while Hero/ProductSystem/HowItWorks already had the site's full animation language. Brought
in line, reusing existing patterns rather than inventing new ones: `WhyUs.astro`'s plain bullet list became
a 6-tile icon grid (one `SectionIcon` per reason, `tilt-card` plus mouse-glow plus staggered `data-reveal`,
the same treatment ProductSystem/HowItWorks already use for their card grids). `SapComparison.astro` got
scroll-reveal on its heading and table, a hover highlight per row, and a small checkmark icon on every
Flowbound-column cell so the "winning" answer reads visually, not just textually. `Mission.astro` (zero
animation before this) got staggered reveal on its three text blocks plus one slow-drifting ambient glow
for atmosphere. `Cta.astro` got staggered reveal, a breathing glow behind the button row, and a hover lift
on both buttons. All four use the standard per-element `data-reveal` (not `data-reveal-group`, see above).

**A real WebGL hero, via three.js.** `HeroBackground.astro` renders a `<canvas>` driven by
`src/scripts/heroWave.ts`: a particle-grid wave with real camera perspective, additive-blended glow, and a
scroll-linked camera move. `three` and `@types/three` are real dependencies (not devDependencies for
`three` itself), but the import lives only in that one script, so the ~500KB chunk only loads on `/`,
confirmed by grepping the built `dist/*.html` for the chunk filename. If three.js usage ever expands to
another component, keep this same discipline: one script, gated behind `IntersectionObserver` so the
render loop pauses when off-screen, checked afterward that the built chunk doesn't leak into other pages'
HTML.

**Scroll-linked animation, site-wide convention now, not just the hero.** The rule (explicit user
instruction): animations replay every time their section is on screen, scrolling down *or back up*, with
no page reload, they are never "play once and stay." Two systems implement this:
- `src/scripts/scrollProgress.ts` exports `watchScrollProgress()`, a shared helper (`IntersectionObserver`
  gates a `requestAnimationFrame`-throttled scroll listener) that reports 0 to 1 based on live
  `getBoundingClientRect()` position, recomputed on every tick. `heroScroll.ts` uses it to set
  `--hero-scroll` as a CSS custom property on `#top`; `Hero.astro`'s own `<style>` block reads that
  variable to fade the background and zoom the text in as you scroll (two independently animated layers,
  not one). Because it's live position, not a one-shot trigger, scrolling back up naturally reverses it.
- `src/scripts/scrollReveal.ts` toggles `.is-revealed` on any `[data-reveal]` element via
  `IntersectionObserver`, both ways (added AND removed), so it replays on re-entry. Used on
  `ProductSystem.astro`/`HowItWorks.astro` headings, cards, and CTAs. **The element needs both the
  `data-reveal` attribute (for the script to find it) and the `reveal-item` class (for the actual
  opacity/transform CSS in `src/index.css`)**, they're separate on purpose but easy to add one and forget
  the other, that exact mistake shipped once already.

Related: `src/scripts/cardTilt.ts` adds a cursor-follow 3D tilt to `[data-tilt]` cards (same
`hover: hover) and (pointer: fine)` guard as `hoverGlow.ts`). If a card needs both the reveal animation and
the tilt, **don't put `reveal-item` and `tilt-card` on the same element**: both classes set a `transition`
on `transform` at different speeds (0.7s settle-in vs 0.15s cursor-follow), and the `transition` shorthand
doesn't merge across classes, whichever rule is later in the stylesheet wins outright and silently drops
the other. Split into a wrapper (`data-reveal`, class `reveal-item`) containing an inner element
(`data-tilt`, class `tilt-card`) instead, see `ProductSystem.astro`/`HowItWorks.astro` for the pattern.

Also learned this session, general CSS/tooling gotchas worth knowing before debugging them again:
- After editing `tailwind.config.js`, restart `npm run dev`. Vite's cached Tailwind build doesn't reliably
  hot-reload newly added or changed theme colors; the class shows up in the HTML but has no CSS behind it
  until restart.
- A decorative element positioned absolutely "behind" a CSS grid's items at a fixed height will show
  through in the grid's column gaps, gaps run the full row height, not just the space between visible card
  edges. `HowItWorks.astro`'s connecting flow-line SVG shipped this bug once (visible as a stray line
  segment in the gap between cards) before being moved to its own strip above the grid instead of behind
  the cards.
- All new/changed reduced-motion-sensitive CSS needs a matching `@media (prefers-reduced-motion: reduce)`
  override with matching selector specificity, not just a same-named-but-lower-specificity rule, or the
  more specific animated rule wins and reduced motion is silently ignored.

**Product page.** In a later session, the user explicitly asked to bring `/product` (`src/pages/product.astro`)
in line with the homepage: `ocean` palette and `font-amulya` headings throughout (previously `fb-*`/
`font-display`, now alternating `ocean-100`/`ocean-200` light sections with two full-bleed `ocean-900` dark
moments, hero and "how it works", same shape as the homepage's light/dark alternation), the site's
scroll-reveal convention on every section and card (`data-reveal`/`reveal-item`, `data-tilt`/`tilt-card`
split into wrapper/inner per the rule above, staggered per-card `transition-delay`), and the new button
treatment. Unlike the rest of this "Homepage" section, this extension is scoped to exactly one page, not
sitewide: `ocean-*`/`font-amulya` still don't belong on any other secondary page's own content without the
user asking again (Nav/Footer/logo/`Cta.astro` were already sitewide before this).

The hero itself was redone as a second real WebGL hero, matching the homepage's `HeroBackground.astro`
approach rather than the SVG/SMIL pattern every other secondary page uses (see "Hero backgrounds" above).
`ProductBackground.astro` now renders a `<canvas>` driven by `src/scripts/productHeroWave.ts`: a composition
called "Convergent Signals", chosen from three concepts presented to the user (a wave field identical to the
homepage's, and an orbiting-core composition were the other two, both intentionally not implemented). Four
particle streams drift in from the four corners of the frame and merge into one glowing point positioned to
the right of the headline column, then fade and repeat on staggered, non-matching per-corner speeds so the
loop never reads as repeating, visualizing the page's actual thesis: four ways in, one engine underneath. A
CSS radial-gradient div (`.hero-hub-glow` in `ProductBackground.astro`) breathes at the same screen position
the WebGL streams converge on, standing in for the "hub"; if the convergence point (`TARGET` in
`productHeroWave.ts`) ever moves, nudge that div's `top`/`left` to match, they're two independent layers kept
in sync by hand, not derived from one shared source. Same discipline as the homepage hero: three.js only
ever loads on `/` and `/product` (confirmed by grepping `dist/*.html` for the chunk filename after a build),
the render loop pauses via `IntersectionObserver` when off-screen, and it falls back to a single static frame
under `prefers-reduced-motion`. The hero also picked up the homepage's scroll-linked fade/zoom
(`hero-bg-fade`/`hero-text-zoom`, reusing `heroScroll.ts` and `watchScrollProgress` as-is, no new script
needed since both just look for `id="top"` on the hero section). It originally shipped at the same
non-full-screen height every other secondary hero uses (`min-h-[560px] md:min-h-[680px]`, `justify-center
py-20`), deliberately **not** picking up `min-h-screen-nav` at the time. That was revisited in a later
session: the user explicitly asked to make `/product`'s hero "full page adaptible just like the homepage
and services page", so it now uses `min-h-screen-nav` and the homepage's `justify-start`/
`pt-28 md:pt-36`/`pb-20` layout on both the hero section and its text wrapper, same as `/services`'s hero
(see "Services page" below). The `ProductBackground.astro` particle system and `.hero-hub-glow` CSS wash
needed no changes for this, both already recompute off the section's live `getBoundingClientRect()` every
resize, so they adapt to whatever height the full-screen section ends up at.

One more small addition from the same session: the faint watermark `SectionIcon` in the "what it is" section
(`product.astro`) gained a slow continuous CSS spin, a breathing pulse-ring behind it, and a subtle
scroll-linked vertical drift via a new tiny script, `src/scripts/sectionIconDrift.ts`, built on the same
`watchScrollProgress` helper the hero scripts use (`[data-icon-drift]` elements report their own section's
scroll progress as a `--icon-drift` custom property). It's a generic, reusable attribute-driven script, not
product-specific, so any other page's watermark icon can opt in the same way by adding `data-icon-drift` to
its wrapper and importing the script. The `.icon-spin`/`.icon-pulse-ring`/`[data-icon-drift]` CSS itself
originally lived in `product.astro`'s own scoped `<style>` block; once `/services` became a second consumer
(see below) it was promoted to `src/index.css` next to `.reveal-item`/`.tilt-card`, the codebase's usual home
for reusable scroll/hover primitives. Don't duplicate it back into a page-local `<style>` block.

Also from that session: the shared `compass` `SectionIcon` (`src/components/icons/SectionIcon.astro`) had a
real bug, not a style choice. Its four tick marks touched the ring at exactly the ring's radius, and with
`stroke-linecap="round"` bulging past that point, the two semi-transparent strokes overlapped there and
compounded into a visibly darker dot at each of the four junctions (semi-transparent SVG strokes stack their
alpha on overlap; this is unrelated to the WebGL heroes' *additive* blending, which wants overlap). Fixed by
shrinking the ring slightly (r 13 → 12) and pulling the ticks back to a real ~1.5-unit gap instead of exactly
touching. If a new `SectionIcon` glyph ever has a tick, spoke, or line meeting a circular stroke at an exact
radius, check for this same artifact before shipping it, especially at large watermark sizes where a
sub-pixel-feeling overlap becomes obviously visible.

**Services page.** In a later session, the user asked for the same `/services` treatment as `/product`
(`ocean` palette, `font-amulya`, the site's scroll-reveal/tilt-card conventions), plus two things kept
deliberately different from both the homepage and `/product`, at the user's explicit request:

1. *A different reveal style than the other two pages, varied section-to-section on this page itself.*
   Reusing `.reveal-item` (the plain rise-and-fade both the homepage and `/product` use everywhere) would
   have made all three pages feel the same, so three new variants were added to `src/index.css`:
   `.reveal-slide` (fade + slide in from the left), `.reveal-scale` (fade + scale up from 88%, a "back out"
   easing so it slightly overshoots before settling), and `.reveal-clip` (fade + a left-to-right `clip-path`
   wipe, a mask-based reveal rather than a transform-based one, genuinely different in kind from the other
   two). All three hook into the exact same `[data-reveal]`/`.is-revealed` mechanism `scrollReveal.ts`
   already drives, so no script changes were needed, only new CSS. `services.astro` assigns one variant per
   section (`revealCycle` in the page's frontmatter) rotating slide → scale → clip → slide → scale → clip
   down the page, continuing across the Ask Flowbound teaser and all five services so no two *consecutive*
   sections repeat the same one. If a new section is added, extend the cycle rather than picking a variant
   ad hoc, that's what keeps the rotation legible.
2. *A hero animation, tried three ways, ultimately removed again.* This page's hero went through more
   churn than any other component this project has touched, worth the full history so it isn't re-derived
   from scratch next time. It started as this page's own SVG/SMIL composition (a hub with capability nodes
   orbiting it, the original `ServicesOrbit.astro`). Three real-WebGL concepts were then presented to the
   user as replacements: "Orbiting Constellation" (a literal 3D upgrade of that old SVG idea) was built
   first and explicitly rejected ("I dont like the animation chosen ... at all"). "Modular Assembly" (a
   ~140-particle field scattering, self-organizing into a hex lattice, holding, loosening, and repeating on
   a 10s loop, deterministic per-cycle pseudo-randomness via a sine hash so no stored state was needed) was
   built next and shipped, along with making the hero full-screen "like the hero section on the homepage":
   `min-h-screen-nav` on the hero section and its text wrapper, the homepage's `justify-start`/
   `pt-28 md:pt-36`/`pb-20` layout instead of the `justify-center`/fixed-height pattern every other
   secondary hero used at the time (`/product`'s later picked up the same full-screen treatment too, in a
   still-later session, see the "Product page" note above; every *other* secondary hero still uses the
   fixed-height pattern). "Signal Braid" (parallel weaving wave strands) was
   the third concept presented but never built. Then, in a later message, the user asked to remove the
   Modular Assembly animation entirely, without asking for a replacement. `ServicesOrbit.astro` is now back
   to a **static** dark gradient wash (`ocean-900`/`ocean-950` radial gradients, no canvas, no script,
   see the component's own doc comment for the full lineage), `src/scripts/servicesHeroWave.ts` was
   deleted outright rather than left unused (unlike `FlowBackground.astro`, which is a whole alternate
   composition worth keeping around; a page-specific script with no other purpose once its page stops
   using it isn't). The **full-screen layout and the floating pills below were kept**, since neither was
   part of "remove the animation": only the WebGL particle system and its accompanying
   `.hero-assembly-glow` CSS wash (which existed specifically to represent the lattice's ambient light, so
   it was removed alongside the particles rather than left as an unexplained orphaned blur) went away. If
   this hero comes up again, start from this history rather than re-presenting the same three concepts.
3. *Floating capability-name pills scattered across the hero's empty right side.* At the user's request
   ("bring up the different services in like fade in/fade out pop ups"), `services.astro`'s hero renders
   six small pill links (`heroPills` in the frontmatter: the five services plus Ask Flowbound), each an
   anchor to that section's `id` (`#agent`, `#inventory`, etc.), absolutely positioned at preset
   top/left percentages scattered down the right two-thirds of the hero, never above or left of the
   headline column (this site's left-aligned-text convention, unlike the centered reference screenshot the
   user linked). Each fades in, holds, and fades back out on its own independent duration/delay
   (`.hero-pill`/`hero-pill-float` keyframe in `services.astro`'s own `<style>`, not global since nothing
   else uses it) so the six never rise or fall in sync, hidden below `lg` since there's no safe empty space
   for them at narrower widths. They're real links but decorative/redundant ones (Nav's Services dropdown
   and normal scrolling reach the same sections), so the wrapper is `aria-hidden` and each link is
   `tabindex="-1"`, pulled out of the accessible/keyboard tab order rather than leaving six low-opacity,
   constantly fading link stops in front of assistive tech users. A parallel attempt to add smaller
   versions of these pills (showing each section's own capability names) around the watermark icon inside
   *every* section's header was started and then explicitly reverted by the user mid-build; if it comes up
   again, the groundwork (a `chip` tone-color entry, `sectionPillSlots` position presets) was removed
   cleanly, nothing was left half-wired.

The watermark `SectionIcon` on every section of `/services` (the agent's `spark`, and each service's own
icon) also got the same spin/pulse-ring/scroll-drift treatment described above for `/product`'s compass, via
the same generic `sectionIconDrift.ts` script and global CSS, no per-page duplication needed.

**A real bug, not a style choice: `.reveal-clip` used to make its own content permanently invisible.**
The original implementation put `opacity`/`clip-path` directly on the `[data-reveal]` element itself, the
one `scrollReveal.ts`'s `IntersectionObserver` watches. An element whose own `clip-path` collapses its
visible area to zero width (`inset(0 100% 0 0)`, the hidden/pre-reveal state) is reported by Chromium's
`IntersectionObserver` as **never intersecting**, confirmed empirically with a throwaway in-page observer,
regardless of the element's real on-screen position, its `getBoundingClientRect()`, or how long you wait.
`.is-revealed` could therefore never be added, so the clip could never open: a permanent, silent, total
content-invisibility bug, not a timing glitch. It only showed up on `/services` because `revealCycle`'s
rotation happened to land `reveal-clip` on Supplier Management and Quality Monitoring, whose text and cards
were reported "missing" from the page (they were rendering server-side the whole time, just permanently
clipped to zero width client-side). `.reveal-slide`/`.reveal-scale` never had this problem since `opacity`
and `transform` don't affect `IntersectionObserver` geometry the way `clip-path` does. **Fix**: `.reveal-clip`
itself is now inert (a bare marker class, no visual effect, so the observed element always has normal full
geometry); the actual clip-path animation lives on a `.reveal-clip-mask` child one level in
(`src/index.css`), keyed off the parent's `.is-revealed` via `.reveal-clip.is-revealed .reveal-clip-mask`.
In `services.astro`, wherever a section uses the `reveal-clip` variant, its text block, each capability
card, and the optional whole-service CTA pill all get `reveal-clip-mask` added onto their existing inner
element (or a new one-off wrapping `<div>` for the text block, which has no single existing child to reuse).
**If any future `[data-reveal]` variant uses `clip-path` for its hidden state, it needs this same
two-layer split from the start, applying `clip-path` directly to an observed element is exactly this bug
waiting to happen again.**

**SectionIcon overlap bugs found across four icons, not just `compass`.** After the `compass` fix (see the
"Also from that session" note in the "Product page" section above), the user asked to check the rest of
`SectionIcon.astro` the same way for icons used on `/services`. Three more had the exact same class of bug
(a stroke endpoint landing exactly on another shape's stroke, compounding into a visible dark dot under
`stroke-linecap="round"` at large low-opacity watermark sizes): `crate`'s three internal spokes touched the
outline's own vertices exactly, pulled back to 85% of the way out instead; `network`'s three connector
lines ran straight into each circle's *center* rather than stopping at its edge, shortened to stop ~7 units
short (clearing both the round-cap bulge and the circle's own stroke); `chat`'s tail touched the speech
bubble's bottom edge at its two top points. `spark`, `bolt`, and `shield-check` were already clean (no two
shapes share a coordinate) and weren't touched.

A fifth, `gear`, had the same bug too, just not caught in that original pass since `/how-it-works` (the
only page using it as a watermark icon) hadn't been converted to the ocean/canvas template yet at the
time. Its eight connector lines started at radius 18, exactly overlapping the tooth tips' own round-join
bulge at outer radius 17 (~17.75 after the join), producing a visible dark dot at all eight junctions once
the page finally got its watermark icon in a later session. This one took **two** fix attempts too, same
lesson as `chat` above:
- First attempt pushed the line's start radius out to 19.5 (tooth outline unchanged) for a real ~1-unit
  gap. Mathematically non-overlapping, and a `deviceScaleFactor: 3` screenshot looked clean, but that
  render oversamples the vector far beyond what a real screen does; at the icon's actual ~120px display
  size and 14% opacity, a 1-unit gap is only a couple of real pixels, thin enough after anti-aliasing to
  still read as touching. The oversampled screenshot was misleading precisely because it wasn't
  representative of the real render.
- Confirmed the "clean" verdict was wrong with actual pixel-level radial sampling (not eyeballing a
  screenshot): rendering the icon standalone and sampling color along a ray from center outward at each of
  the 8 node angles showed the tooth-to-line gap was real but only ~1 unit wide, thin enough to be
  perceptually ambiguous. Fixed properly by shrinking the gear itself (outer radius 17 to 15.5, inner 13 to
  11.5, the same "shrink the reference shape" approach `compass` used) rather than pushing the connector
  further out, which produced a ~2.5-unit real gap (pixel sampling confirmed a literal zero-ink, exact
  background-color band between tooth and connector at every angle, not just "less overlap").
- A second, separate defect surfaced after that: each connector line's *endpoint* was set to the node
  circle's own center, not its edge, so the line always crossed the ring's stroke and dangled into its
  hollow middle, a visible stray "tail" inside every node, unrelated to the radius/gap issue above. There's
  no room in this viewBox to give a connector a real gap on both the gear side and the node side without
  clipping, so the line was removed outright rather than patched again; the nodes are plain floating dots
  now.

**General lesson, worth repeating from the `chat` fix**: a high-oversample screenshot (or a
nearest-neighbor-upscaled one) is not a substitute for checking at the element's real render size, and
"doesn't overlap" isn't the same bar as "reads as a clear gap at actual size and opacity." When a fix's
correctness is genuinely in question, sample pixel color numerically along the suspect boundary instead of
eyeballing a screenshot at whatever resolution happens to be convenient.

`chat` needed **two** fix attempts, worth remembering before touching an icon in this family again: the
first attempt only moved the tail's two *endpoints* inside the bubble, off the exact boundary, and looked
fixed in a screenshot. But the tail's tip sits well *below* the bubble while the endpoints were now *above*
its edge, so the diagonal line connecting tip to endpoint still necessarily crossed straight through the
bubble's stroke somewhere in the middle, just no longer at the two ends. The user caught it anyway from a
screenshot ("teh customer service icon is not fixed"). The actual fix moved *both* tail points to below the
bubble's edge entirely (y=33.5 vs. the bubble's y=32 boundary), so the whole tail, tip and both arms, never
comes back above that line at any point along its length. **General lesson: when fixing one of these icons,
check where the entire path sits relative to other shapes, not just its endpoints** — a multi-point line or
curve can clear a shape at its own tangent points while still crossing straight through it in the middle.
Verified this fix with pixel sampling across 16 rotation angles (0° to 345°, since the icon spins)
rather than trusting a single screenshot: the darkest pixel value stayed flat across every angle,
confirming no compounded-alpha overlap anywhere in the rotation cycle, not just the one frame a screenshot
happens to catch.

**Uniform button/tile sizing.** The per-capability CTA pills (`Explore {capability.title}`, the small pill
under a card when `capability.href` is set) were capped at `max-w-[15rem]` with no minimum height, so a
short label ("Explore Reorder") rendered on one line while a long one ("Explore Wholesale Account
Management") wrapped to three, making two pills in the same grid row visibly different heights (flagged
directly: "buttons and tiles should all be a uniform size"). Fixed by widening to `max-w-[17rem]` (fewer
labels hit a 3-line wrap) and adding `min-h-[4.25rem]` (guarantees every pill renders at the same height
regardless of actual line count, `items-center`, already present, vertically centers shorter content within
that fixed box). The card tiles themselves were already uniform via the pre-existing `h-full`/`flex-1`/
CSS-Grid-row-stretch chain; this was purely a button-sizing gap.

Explicitly out of scope both times this page came up: the seven dedicated capability pages and three
whole-service narrative pages linked from `/services`'s grid (`/demand-forecasting`, `/inventory-tracking`,
`/shipping-optimization`, `/supplier-coordination`, `/wholesale-account-management`, `/reorder`, `/pricing`,
`/ask-flowbound`, `/customer-service`, `/quality-monitoring`) were explicitly excluded by the user and were
not touched *in this session*; they picked up the same treatment in a later session, see "Capability and
narrative pages" below, so don't take this paragraph as still describing their current state.

### Capability, narrative, and blog pages (2026-08)

In a later session, the user asked to redo all ten of the pages the paragraph just above lists as
"explicitly out of scope." All ten now use the `ocean` palette, `font-amulya` headings, the redesigned
buttons, and the site's scroll-reveal/tilt-card conventions, following `product.astro`'s section-level
template exactly (dark `ocean-900` hero, alternating `ocean-100`/`ocean-200` content sections, one full
`ocean-900` dark section as a spotlight anchor, `data-reveal`/`reveal-item` plus `data-tilt`/`tilt-card`
split into wrapper/inner on every card grid, `data-icon-drift` on the watermark icon), not `services.astro`'s
per-section reveal *variety* (that rotation is `/services`-specific and wasn't extended here).

**Process, worth repeating if more pages are ever added this way:** for each page, 1-3 hero animation
concepts were pitched and explicitly approved before any code was written, one page at a time. If this
pattern comes up again, follow the same loop rather than building ahead of approval.

**Every hero is a real JS canvas (`<canvas>` + Canvas 2D, `requestAnimationFrame`), not WebGL/three.js like
`/`/`/product`.** Reasoning: these heroes stay at the site's normal fixed content height
(`min-h-[560px] md:min-h-[680px]`, never `min-h-screen-nav`, that exception is still only `/`, `/product`,
`/services`), so three.js's per-page chunk cost isn't worth paying, and each composition (bar charts,
gauges, racing lanes, a conveyor, comet-trail pulses) is far more natural as imperative canvas draw calls
than declarative SMIL `<animate>` tags, the pattern this whole batch (originally the ten capability/
narrative pages, then `/how-it-works`, then `/blog` in a later session still) replaced. Three rules apply
to every one of them, all explicit user requirements:
- **The animation is clipped to a rect starting at roughly 58% of the section's width**
  (`ctx.clip()` on `rect(width * CLIP_XF, 0, width * (1 - CLIP_XF), height)`, `CLIP_XF = 0.58` in every
  script) so it can never paint over the headline/body text, a hard geometric guarantee rather than relying
  on the pre-existing dark gradient overlay to visually mask it.
- **Whatever the composition is, it spreads across the full height of that clipped strip**, not a small
  cluster near the hub, to actually use the empty space rather than sit in a corner.
- **Hub icons stay fixed, no rotation**, a deliberate reversal from the varied hub-rotation pattern the
  original SVG/SMIL heroes used (see "Hero backgrounds" above). Set after the user asked to stop
  `/ask-flowbound`'s hub spinning, then carried forward as the default on every later page without being
  asked again each time, including `/blog`'s later conversion. If a future page's hero should rotate its
  hub, that needs an explicit ask, same as every other deviation from this project's established pattern.

`/how-it-works` followed the same three rules in a still later session, but its hero
(`HowItWorksBackground.astro`/`src/scripts/howItWorksHero.ts`, "Scroll-Driven Assembly") departs from the
other ten in one deliberate way: instead of running on its own internal clock, the comet's position along
its path is driven directly by `watchScrollProgress` (the same helper `heroScroll.ts` uses for the
homepage/`/product` fade-zoom), so it advances through the four checkpoint nodes in lockstep with how far
the visitor has scrolled the hero section, and reverses cleanly on scroll-up like every other scroll-linked
animation on the site. A faint dashed pattern still flows along the path continuously, time-based, so the
hero isn't inert before anyone scrolls. If a future hero wants this same scroll-tied mechanism rather than
a self-timed loop, this is the file to copy from, not one of the other ten.

`/blog` followed in a later session still. Its content structure (categories, search/filter, thumbnails,
pagination, see "Blog" above) didn't change, but the page itself picked up the full visual conversion:
`ocean` palette and `font-amulya` headings throughout (hero, post cards, post-detail page, tag pages),
the redesigned buttons on the hero's two CTAs, and the site's scroll-reveal/tilt-card conventions
(`data-reveal`/`reveal-item` plus `data-tilt`/`tilt-card` split into wrapper/inner on every post card in
the grid, `data-reveal`/`reveal-item` alone, no tilt, on the simpler list rows on `/blog/tags/[tag]`). The
post-detail page (`[slug].astro`) also gained a scoped `<style>` block, `.ocean-prose`, repointing
`@tailwindcss/typography`'s CSS-variable color hooks (`--tw-prose-body`, `--tw-prose-headings`, etc.) at
ocean-palette hex values instead of the plugin's default gray scale, so Markdown post body copy reads as
part of the same system rather than a leftover neutral theme; `--tw-prose-body`/`--tw-prose-headings` use
the same `ocean-950` verified-contrast text color used everywhere else on `ocean-100`/`ocean-200`
backgrounds (see the contrast note above), not a value picked by eye. `BlogBackground.astro`'s hero itself
moved from the original SVG/SMIL pattern onto the same real JS canvas approach as the other eleven, its own
composition, "Insight Stream" (see the mechanism list below), rather than reusing the ten's clip/hub/full-
height-spread rules loosely, it follows them exactly.

**Twelve different mechanisms, not the same shape recolored twelve times**, following an explicit "mix the
elements" request after the first page's hero was pitched as three separate pure concepts (rather than
picking just one): Signal Field (`/ask-flowbound`: a fixed `spark` hub, ripple rings breathing outward, a
drifting node field spread across the full strip, comet-trail question/answer pulses on independent
per-node cycles); Forecast Horizon (`/demand-forecasting`: history bars settling into a fixed `crate` hub
at the pivot where history turns into a smoothly climbing projected curve, trailed by a confidence cone and
a traveling pulse, one bar flaring for a bestseller, another dimming and flattening for dead stock); Live
Scan (`/inventory-tracking`: a fixed `crate` hub anchoring static radar rings and a rotating sweep line
that flares a scattered status-cell grid as it passes each cell); Lane Race (`/shipping-optimization`: a
fixed `crate` hub racing a comet-trail dot down each of five fanned lanes every cycle, four slow and fade
partway, one runs the full distance and lights its destination, a different lane winning each cycle);
Supplier Pulse (`/supplier-coordination`: a fixed `network` hub among supplier nodes that mostly just
breathe calmly, one escalating on rotation and sending a signal into the hub before settling back down);
Ledger Sync (`/wholesale-account-management`: a fixed `network` hub among account nodes breathing in
unison, deliberately with *no* alert ever, just a synchronization wave rippling outward and flashing every
account in turn); Threshold Drop (`/reorder`: a vertical gauge draining toward a dashed reorder line, a
snap-action event cascade the instant it crosses, fixed `bolt` hub); Margin Band (`/pricing`: continuous
smooth needle sway on a bounded track fed by two looping cost/demand signals, deliberately with *no*
discrete event, the explicit contrast to Reorder, fixed `bolt` hub); Inbox Flow (`/customer-service`: a
linear queue of message bubbles into a fixed `chat` hub, most bounce back answered, one in four reroutes to
a handoff node); Inspection Line (`/quality-monitoring`: a straight conveyor through a fixed `shield-check`
checkpoint, the one hero among the original ten that isn't a hub-and-spokes shape at all); added in a
later session, Scroll-Driven Assembly (`/how-it-works`: a winding path through four fixed checkpoint nodes,
connect/signal/decide/ask, mirroring the page's own four step cards; a comet travels the path in lockstep
with scroll position rather than its own clock, the only hero of the twelve driven this way, and the second
one, after Inspection Line, that isn't a hub-and-spokes shape); and, added in a later session still,
Insight Stream (`/blog`: a fixed `document` hub, ripple rings breathing outward, and a spread of small
open-book "reader" nodes across the full clipped strip, each on its own comet-trail pulse cycle traveling
*outward* from the hub along a curved path, the only hero in the batch where the flow direction is reversed
from every other page's converge-on-the-hub story, matching the page's own "content reaching readers"
framing rather than "signal reaching a decision"). When building a thirteenth,
vary both the geometry (radial vs. chart vs. sweep vs. conveyor vs. path) and the emotional pacing
(constantly busy vs. calm-until-an-event vs. continuous drift vs. scroll-tied), not just the color. Full
per-page detail, file names, and exact composition names are in `BRAND_GUIDELINES.md`'s "Secondary-page
hero" section.

**Two TypeScript gotchas specific to this batch of scripts, both will resurface on a thirteenth hero:**
- **Every hero script needs `export {}` at the very top, unless it has a real top-level import already**
  (`howItWorksHero.ts` imports `watchScrollProgress`, so it's exempt). Every other hero script imports
  nothing, and a `.ts` file with zero top-level `import`/`export` is an ambient *script* to TypeScript, not
  a *module*, so its top-level `const`s leak into shared global scope and collide by name (`CLIP_XF`,
  `SHADOW`, `BRIGHT`, etc.) across every other hero script the moment `astro check` type-checks the whole
  project, even though each file works fine in isolation. This didn't surface until the second hero script
  existed, the first one alone had nothing to collide with. The DOM's global `Node` interface can silently
  shadow a same-named local type the same way (`type Node = {...}` on `/ask-flowbound`'s script had to be
  renamed to `SignalNode`).
- **`astro check` fails the build on unused top-level `const`s** (`ts(6133)`) left over from mid-build
  refactors, always rebuild after trimming code, not just after adding it.

**Verification gotcha likely to keep mattering: this dev machine has OS-level "Reduce Motion" on.** Default
Playwright screenshots on it show the `prefers-reduced-motion` static-fallback frame every time (every hero
script has one, correctly), not the live loop, because Chromium inherits the OS accessibility setting.
Confirmed by diffing default screenshots (identical across multiple timestamps) against
`page.emulateMedia({ reducedMotion: 'no-preference' })` screenshots of the same page (visibly progressing).
Pass that `emulateMedia` call before `page.goto()` whenever verifying a canvas/JS animation loop is
actually running, and check the plain default-media screenshot too, separately, since that's what confirms
the static fallback itself looks reasonable rather than blank or broken. For a rare/periodic event inside a
loop (a threshold crossing, a flag-and-hold), a short screenshot burst can still miss the exact window by
luck; when that happens, replicate the timeline math standalone in `node -e` (pure arithmetic, no browser
needed) to confirm the trigger condition is reachable at plausible `t` values before concluding it's broken.

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
`public/fonts/`, declared in `src/index.css` and preloaded in `BaseLayout.astro`, used sitewide. No
third-party font CDN. Amulya (also self-hosted, same directory) started scoped to the homepage, Nav,
Footer, and the logo, and has since been extended, one explicit ask at a time, to `/product`, `/services`,
all ten capability/narrative pages, `/how-it-works`, and finally `/blog`; see "Homepage" and "Capability,
narrative, and blog pages" above and `BRAND_GUIDELINES.md`'s Typography section for the full detail and
current scope. `/404` is the only page still on `font-display`/`font-body` (Satoshi).

`src/assets/logo.png` is still the source-of-truth brand mark, but as of the ocean-palette extension to
Nav/Footer, `LogoLockup.astro` no longer renders it: it renders `LogoMark.astro` (the hand-redrawn vector)
with `palette="ocean"` instead, since the PNG can't be recolored without re-exporting it. `logo.png` is
unused in code today, not deleted. The river dividing the mark's two "comma" shapes is `ocean-100` in that
palette (was, and still is in the original `"fb"` palette, pure white), a deliberate palette-matching tweak
at the user's request, see `BRAND_GUIDELINES.md`'s Logo section.

### SEO and canonical URLs

`astro.config.mjs` sets `site: "https://www.flowbound.ai"` (with `www`) and `trailingSlash: "always"`.
Neither is arbitrary: production on Vercel actually serves from `www.flowbound.ai` (200), with the bare
apex `flowbound.ai` 308-redirecting to it on every path, confirmed with `curl -I` against both hosts
directly rather than assumed from config. Every built page is a directory (`page/index.html`), so the real,
final URL for every route always carries a trailing slash to match.

This wasn't always right. `site` used to be the apex (no `www`), and `src/components/Seo.astro`'s canonical
was built straight off `Astro.url.pathname`/a `path` prop that never carried a trailing slash. That created
two independent mismatches between the sitemap/real URLs and what each page's own canonical tag claimed was
"official": wrong host (canonical pointed at the domain that redirects away from itself, not the one that
actually serves) and a missing trailing slash. Search Console surfaced this as "Alternate page with proper
canonical tag" across the blog, Google correctly deferring to a canonical that pointed at the wrong place,
so the real crawled URL never got indexed. Fixed in commit `08b4841` (2026-08-23): `site` now points at
`www`, and `Seo.astro`'s canonical always normalizes to a trailing slash regardless of what `path` is passed
in, so a future page can't reintroduce the slash half of this bug even by accident. `public/robots.txt`'s
`Sitemap:` line and `[slug].astro`'s breadcrumb JSON-LD (the one other spot that builds an absolute URL
straight from `Astro.site`, found via `grep -rl "Astro.site"`) needed matching fixes.

**Every internal link in the codebase has to carry a trailing slash.** `trailingSlash: "always"` makes
Astro's own dev server and `astro preview` enforce this strictly now: an internal `<a href>` missing the
slash 404s locally, which is the intended guardrail going forward, not a bug to route around. Fixing the
config surfaced about 15 stale non-slash `href`s across `src/data/nav.ts`, every capability/service `href`
in `src/data/services.ts`, `Nav.astro`'s services flyout, a few components (`ProductSystem.astro`,
`HowItWorks.astro`), the blog pagination/tag-page post cards, and, easy to miss, plain Markdown links inside
20 blog post bodies (`](/demand-forecasting)` style) that have nothing to do with any Astro component.
Before trusting a build that touches routing or links, don't rely on `astro check` alone: build, start
`npm run preview`, `grep` every `href="/..."` out of `dist/**/*.html`, and `curl` each one against the
preview server to confirm 200. Also worth scripting whenever `Seo.astro` or the sitemap changes: every
canonical tag in `dist/**/index.html` should have an exact string match in `dist/sitemap-0.xml`; if one
doesn't, something is generating a URL that disagrees with itself.

**Search Console takes time to catch up after this kind of fix; new-looking report buckets right after
deploy don't mean it failed.** Two more buckets appeared post-deploy, both artifacts of Google re-crawling
the same ~44 old apex-domain URLs it had already discovered under the pre-fix sitemap: "Discovered -
currently not indexed" (queued, not yet crawled) draining into "Page with redirect" (crawled, found the
clean 308 to `www`, correctly excluded since redirecting is the URL's whole job) as Google works through its
backlog. Confirmed the redirects are clean before concluding that (single-hop for path URLs, two-hop only
for the plain `http://` variant's protocol-then-domain upgrade, no loops, nothing longer) and that the `www`
targets are healthy (200, self-referencing canonical, no `noindex`, allowed by `robots.txt`). If picking
this back up, check Search Console's actual "Indexed" count/trend rather than the exclusion-reason buckets,
that's the real signal for whether the fix is paying off. A `site:www.flowbound.ai` search run directly on
Google.com (not through a general-purpose web-search API, which doesn't reliably reflect Google's actual
index for a smaller site, confirmed it returns unrelated results for this domain) or the URL Inspection tool
are the trustworthy ways to check a specific page's status.

## Deployment

Served from `https://www.flowbound.ai` on Vercel (the bare apex `flowbound.ai` 308-redirects to it on every
path, see "SEO and canonical URLs" above), connected to `MuhammadAli0297/flowboundai` on GitHub. Every push
to `main` auto-deploys; no environment variables required. Split commits by concern (feature/bugfix/docs)
rather than bundling unrelated changes.
