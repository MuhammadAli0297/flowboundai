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

### Hot Sauce rebuild (sitewide, complete as of 2026-10-11, started 2026-10-04)

**The whole site was rebuilt onto a new visual system, page by page, on a local branch
(`redesign/hot-sauce`), never pushed or merged until the user explicitly says so — that instruction
is still in force even though the rebuild itself is done.** The project kept the branch/internal name
"Hot Sauce" even after the palette itself moved on (see below), the same way code sometimes keeps an
original codename after a pivot. All 18 checklist items are approved and the promised cleanup pass
(old `ocean` tokens, old Amulya font) is done, see "Rollout discipline" below. The only page on the
whole site still describable as "not yet migrated" is `/404`, which was never in scope for this
rebuild (or the `ocean` one before it) by explicit, standing user decision, not an oversight. If
you're picking this up in a fresh session: check `git branch --show-current` and `git log` on that
branch before assuming this file is current, but as of this writing the `bold` system described here
is live everywhere except `/404`, and nothing has been pushed or merged to `main`.

**Why:** the user felt the existing `ocean`/Amulya system (see "Homepage" below) had gone "dull and
bland" and wanted something "dynamic, fresh, and bold" that makes content "jump off the screen," a
full visual rebuild, not a tweak. They set three process rules up front, all still in force: (1)
mockups first, reviewed and approved via the Artifact tool, no code until a direction is approved; (2)
once implementing, work strictly page by page, stop after each one and wait for the user to look at it
themselves (`http://localhost:4321`) before moving to the next; (3) nothing gets pushed to `main` or
deployed until they say so, full stop, independent of (2).

**Mockup process, five real rounds, worth knowing before re-deriving any of this:**
1. A literal translation of a user-given 5-color palette onto the *existing* page layouts. Rejected:
   "I'm not like drawn to the site. It just looks like every other web page out there."
2. "Manifest": a from-scratch dark, document/manifest-inspired direction (Big Shoulders Display, line-
   item rows instead of cards, routing-checkpoint diagrams, hard edges, a live-data-readout hero
   instead of abstract art). This direction was approved and became the structural foundation, but on
   the *first* palette tried with it.
3. Manifest re-skinned onto a second user-given palette (Shadow Grey/Pearl Aqua, teal-on-near-black).
   Palette swap only, same structure, to test the system's portability.
4. User, still not satisfied, gave a screenshot of 7 more palette options ("calm," "winter," "bold,"
   "option 5," "option 2," "hot sauce," "huda") and asked for **light mode**, using whatever "the
   newest/highest ranking tech sites" are doing. This produced the real pivot: researched conventions
   from Linear, Stripe, Arc, Vercel, Raycast, and Attio (bento grids, grain-textured gradient-blur
   heroes, glass panels over real-looking product UI instead of abstract art, annotated line diagrams
   with leader labels instead of card rows, a single dark "bookend" band breaking up an otherwise light
   page), picked "hot sauce" (the only warm, high-saturation option with both a real light tone and two
   usable accents) over the other 6, and delivered the result as five static "stills" with captions
   naming which real site's convention each piece borrowed from, not a working coded page, per the
   user's explicit request for that format. Approved: "this is fantastic, this is the direction I want
   to go." Extended with 5 more stills (a capability-page template, the blog) to confirm the system
   generalizes past the homepage before committing to it.
5. User asked for a full page-by-page checklist and to start implementing. Checkpoint 1 (shared chrome,
   see below) was built in "hot sauce" colors, at which point the user flagged a real external
   conflict: **the hot sauce palette and structural devices were too close to another live site they
   run, gogreenlit.com** (dark green ground, orange accent, cream sections, a grain+orb hero, a
   highlighted-text headline block, even a status-chip badge). Confirmed by fetching and screenshotting
   gogreenlit.com directly rather than taking the concern on faith. The real cause wasn't execution,
   it was the hue family itself (warm dark-green-plus-orange is a common "earthy modern SaaS" direction
   right now), so retinting wouldn't have fixed it. Repicked from the original 7 palettes to "Bold" (a
   cool eggplant-and-mint direction with no hue overlap with gogreenlit at all), re-mocked it in the
   same artifact, approved, then re-applied to checkpoint 1's actual code.

The approved mockup artifact (still live, reflects the "Bold" palette, five homepage stills plus five
template-check stills for a capability page and the blog) is the design reference for every page still
to come: `https://claude.ai/artifact/79AWJ5c2M8sCs3ARd24gFq`. Read it before building a new page type
rather than re-deriving the system from scratch.

**The approved design system, "Bold":**
- **Palette** — Tailwind namespace `bold` in `tailwind.config.js`, additive alongside `fb`/`ocean` (not
  yet removed, won't be until every page is migrated): `paper` `#EFF7F2` (primary light bg), `mist`
  `#C9EFE6` (derived pale mint tint, soft card/section fill), `ink` `#2E1630` (primary text + dark
  bookend sections), `ink-deep` `#170B19` (derived, vignette/gradient-edge only, never text), `taupe`
  `#6E5A52` (secondary text/borders on light bg), `teal` `#6E9CA3` (tertiary accent), `mint` `#8FE3D3`
  (the one bold accent, text/icon on dark surfaces), `mint-deep` `#1A7A64` (derived, accent text/fills
  on light surfaces). `ink` is enriched from the user's literal swatch (`#2A1F29`) at their explicit
  request after it read "too pastel and plain" once the glow effects were toned down, see the contrast
  and color-harmony notes below before changing any of these again.
- **Fonts** — Hanken Grotesk (self-hosted variable, one file covers weight 400-800, same
  one-file-many-weights trick Amulya already used) as `font-hanken`, Instrument Serif (self-hosted,
  regular + italic, both static) as `font-instrument`, used sparingly as an editorial accent (one
  emphasized word in a headline, a pull-quote), never as a running body face. IBM Plex Mono carries
  over unchanged as `font-mono`. All added alongside Satoshi/Amulya in `src/index.css`, not replacing
  them yet.
- **Structural devices**, all established in the mockup and now real code or real code waiting to
  happen: a grain-textured gradient-blur hero (reuses the existing `bg-grain` Tailwind utility, already
  defined before this rebuild started), a glass panel for showing real-looking product UI in the hero
  (`.bold-glass` in `src/index.css`) instead of abstract decorative art, a bento grid for capability
  lists instead of a uniform card row, an annotated line diagram with alternating leader-label text for
  "how it works" sections instead of another card row, a real accordion FAQ (`.bold-faq-row` +
  `src/scripts/faqAccordion.ts`, a generic single-row-open-at-a-time component, document-wide via
  `[data-faq-list]`, not scoped like the mobile nav's own accordion logic), and exactly one dark
  "bookend" section per page breaking up otherwise-light content (so dark-vs-light carries real
  emphasis instead of losing meaning from overuse). Pill buttons continue as the sitewide shape
  (unchanged convention from before this rebuild).
- **Dark sections need real depth, not a flat fill.** `Cta.astro`'s `.cta-depth` class is the reference
  pattern: a `background-image` stack combining a radial gradient (lighter near one edge, fading to
  `ink-deep` at the far edges, like the section is lit from one side) with the same grain SVG data URI
  `bg-grain` uses, declared together in one CSS property since a class-level `background-image` and an
  inline/scoped one can't composite, the later one just replaces the former. A flat `bg-bold-ink
  bg-grain` combo was tried first and called out directly as "too pastel and plain." Reuse this same
  two-layer recipe (gradient + grain, one declaration) for every future large dark section, starting
  with the homepage hero.
- **An ambient glow's color has to be picked relative to the actual background hue it sits on, re-
  learned the hard way on the CTA band.** The first version used two orbs (mint + taupe) tuned against
  the original, less-saturated `ink`. Once `ink` was enriched into a real saturated plum, mint (cool,
  roughly complementary to purple) started reading as a bold clashing contrast rather than soft
  atmosphere, and taupe (warm, muted) read muddy against a now-cool-saturated background. Fixed by
  dropping to one orb in teal, which sits closer to purple on the color wheel and reads as atmosphere
  instead of a competing color statement, while reserving mint exclusively for deliberate accents (the
  "right now" headline word, button fills) rather than also doing ambient-wash duty. **Before reusing
  an orb/glow color on a new section, check it against that section's actual background color, not
  just copy the hex from another section**, this exact mistake is easy to repeat.
- **Contrast rules specific to this palette** (worked out with real sRGB relative-luminance math, not
  eyeballed, same discipline the `contrast_compliance` memory already requires sitewide): `mint` only
  clears AA as text/icons on dark `ink` surfaces (~10.6:1); it measures only ~1.4:1 against `paper` and
  must never be small text or a fill there. `mint-deep` is the light-surface equivalent, ~4.8:1 against
  `paper`, safe as text or as a fill paired with `paper`-colored text on top (never `ink` text on a
  `mint-deep` fill, only ~3:1, this exact bug shipped once on the real CTA/Nav buttons and had to be
  fixed after the user flagged the button text as unreadable). `taupe` genuinely clears 4.5:1 against
  `paper` on its own, unlike hot sauce's `olive` before it, so it does real secondary-body-text duty
  with no workaround needed. `teal` is safe as text/icons on `ink` but, like `mint`, not as small text
  on `paper`.
- **A two-stop gradient within one hue, stretched across too wide a lightness range, reads muddy and
  washed-out in the middle of the blend, not vivid.** Hit this on the logo mark: the first "bold"
  gradient ran bright `mint` to `mint-deep`, both are "the same color" at different lightness, and the
  transition zone desaturated visually even though the math was a clean linear interpolation. Fixed by
  gradating `mint` to `taupe` instead, two real palette colors with an actual hue difference (cool to
  warm), so the blend stays colorful all the way through. If a future gradient looks flat or grey in
  the middle, check whether both stops are really the same hue before adding more stops or more
  contrast, that's usually the actual cause.
- **Logo** — `LogoMark.astro`'s `palette="bold"`: solid `ink` comma, `mint`-to-`taupe` gradient comma
  (see above), `teal` river/ring (not `paper`/white, not `taupe`: taupe was tried for the ring first
  but only clears 2.44:1 against the `ink` footer, too close to the comma it's supposed to separate
  from; `teal` clears 5.24:1 there). Continues this mark's standing rule (set when "ocean" first
  replaced "fb" here, re-confirmed explicitly by the user for "bold"): never fall back to white/near-
  white as the third color just because it's convenient, use a real color from the current palette and
  actually check its contrast in both the light (nav) and dark (footer) placements.

**Rollout discipline (historical) and cleanup (done 2026-10-11):** every addition (colors, fonts,
primitives) was additive alongside the existing `fb`/`ocean` system while the rebuild was in
progress; nothing was removed or renamed out from under a not-yet-converted page. Once all 18
checklist items were approved, the promised cleanup pass ran: the `ocean` Tailwind color palette
(`tailwind.config.js`) and the `amulya` font family token were both deleted outright (every real,
non-comment usage of either was gone, confirmed by grep across `src/` before touching anything, not
assumed); Amulya's two `@font-face` declarations (`src/index.css`) and its unconditional preload
(`BaseLayout.astro`) were removed, and the two actual font files
(`public/fonts/amulya-variable{,-italic}.woff2`) deleted from disk, the same pattern `ocean` itself
set when it replaced `fb`. `Breadcrumbs.astro`'s `tone` prop (a `"dark"`/ocean branch alongside the
`"light"`/Bold one, added specifically to distinguish converted from not-yet-converted pages) was
simplified away too, since every one of its 10 call sites had been passing `tone="light"` for a
while, leaving the "dark" branch dead; the prop and its now-redundant `tone="light"` argument were
removed from all 10 pages via a verified scripted replace (every file's exact expected string
confirmed present before the substitution ran, not a blind find-and-replace).

**`fb`/Satoshi are not part of this cleanup and were deliberately left untouched**, including the
full `fb` color palette (not trimmed down to just the handful `/404` uses) and every Satoshi
`@font-face`/preload: `/404` is still explicitly out of scope for either rebuild (`ocean` or
`Bold`), a standing decision repeated at every past redesign pass on this project, and it depends on
`fb-black`/`fb-white`/`fb-green-400`/`fb-green-500`/`.eyebrow` plus `font-display`/`font-body`
(Satoshi) directly. Satoshi also stays as the sitewide base-layer default (`src/index.css`'s
`h1-h4`/`body` rules) regardless of `/404`, the same safety-net role it's always had.

**What was deliberately left alone, and why, so a future pass doesn't "fix" it by mistake:** every
retired `*Background.astro` hero component and its matching `*Hero.ts`/`heroWave.ts`/
`productHeroWave.ts` script (`ReorderBackground.astro`/`reorderHero.ts`, `BlogBackground.astro`/
`blogHero.ts`, etc.) is still on disk, unused, and several still contain raw hex color values
commented `// ocean-950` etc. That's intentional and unrelated to the Tailwind token removal above
(they never referenced the `ocean-*` Tailwind classes, just literal hex matching those colors at
the time): the established, repeated precedent on this project (`FlowBackground.astro`,
`HeroBackground.astro`, and every capability page's own retired hero before it) is to keep a retired
*whole hero composition* on disk as a reference, only a page-specific script with zero other purpose
once orphaned (`servicesHeroWave.ts` was the one example of that) gets deleted outright.
`LogoMark.astro`'s unused `"fb"`/`"ocean"` palette branches were also left alone: unlike
`Breadcrumbs.astro`, they use independent hex literals, not the `ocean-*` Tailwind classes being
removed, so there was nothing actually broken by leaving them, and the component is small, well
commented, and still arguably useful if a future page ever wants a differently-toned mark.

**Verification gotcha specific to this rebuild, likely to resurface:** after editing `tailwind.config.js`
mid-session, a `npm run dev` restart can *appear* to not pick up new theme colors (new utility classes
show up in the rendered HTML with seemingly no CSS behind them) even after a restart. Before concluding
the dev server itself is broken and trying another restart, `curl` its actual served stylesheet
(`curl -s http://localhost:4321/src/index.css`) and grep for the specific rule
(e.g. `grep -o "\.bg-bold-ink {[^}]*}"`) to check the real compiled value. In the one case this came up
this session, the CSS was already correct both times it was checked, the apparent bug was a stale
browser tab loaded before an in-progress restart had finished, not a real compile failure, caught by
comparing the actual served CSS bytes rather than trusting what a screenshot from an already-open tab
showed.

**Checklist** (18 items, all complete and approved as of 2026-10-11, cleanup pass done; kept here as
the historical build record, not a chat message that scrolled away):
- [x] 1. Shared system: fonts, `bold` tokens, Nav, Footer, Cta, logo. Built, then revised across several
      rounds of direct feedback (button-fill text contrast, glow brightness, logo gradient muddiness,
      ink richness, glow color harmony), all fixes described above. Not yet committed.
- [x] 2. Homepage (`/`) — base Bold build (grain+orb hero, proof strip, bento capability grid,
      annotated-diagram "how it works", comparison band, see "Checkpoint 2 (homepage) detail" below),
      then the Signal Primitives merge on top (bento's featured/quiet tiles, magnetic buttons, the "how
      it works" diagram's real scroll-linked line, WhyUs brought up to the same tile language after the
      user flagged it still read flat next to the bento grid). User-approved 2026-10-07. Not committed.
- [x] 3. `/reorder` — base build done (see "Checkpoint 3" below for the template decisions items 4-9
      should reuse; it already originated the ink-tint + numbered-badge tile pattern the homepage's
      Signal Primitives pass then reused). Signal Primitives now applied: hero buttons are magnetic, the
      "what it does" lead capability tile upgraded to the featured glass + gradient-ring + tilt
      treatment (matching the homepage bento's lead tile), and the Stock Gauge widget sits beside the
      "what it watches" heading (drains 92% to 14%, crosses the 20% reorder threshold, reveals the same
      "Triggered" mint-deep badge the homepage hero panel uses, replays on scroll re-entry). The hero
      itself was then flagged directly as "just so plain": it was the one deliberate sitewide exception
      to the glass-panel-with-real-UI hero convention (explain one capability, don't showcase the whole
      product), which left its whole right side empty. Rather than contradict that reasoning outright,
      it got a glass panel showing the *other half* of the Stock Gauge's story, the order placed as a
      result of the threshold crossing (reorder point, quantity, supplier, an "Order placed" badge), so
      the two widgets read as one narrative (trigger math down in "what it watches", outcome up in the
      hero) instead of two unrelated add-ons. Every other capability page's hero should revisit this same
      "deliberately no glass panel" call the same way once it's that page's turn, not keep it by default.
      Locally verified: astro check/build clean, no console errors, no mobile overflow, gauge animation
      confirmed end-to-end via Playwright.

      One more revision after approval: the hero's glass panel first reused the homepage's generic
      live-data-rows template verbatim (different copy, identical structure), which was then flagged
      directly as reading like the same image as the homepage hero at a glance. The real fix wasn't
      different copy, it was making the hero panel BE the page's own Stock Gauge widget instead of a
      list, moved up from "what it watches" (which went back to a plain signal list so the widget isn't
      shown twice on one page). **Standing rule now: every capability page's hero panel should be built
      around that page's own assigned widget from the merged checklist, never the homepage's rows
      template**, a gauge and a chart have genuinely different silhouettes, which is what actually solves
      "every hero looks the same," not swapping the numbers inside an identical layout. Light-surface
      widget CSS (`.gauge-track`/`.gauge-fill`/`.gauge-threshold`, `.spark-history`/`.spark-projected`/
      `.spark-comet`) now lives in `src/index.css` for exactly this purpose.

      One more round on the "what it does" quiet-tile grid, caught from a user screenshot after both
      pages were already built: 5 items in `sm:grid-cols-2 md:grid-cols-3` leaves an empty gap in the
      trailing row (a 3+2 split at `md`), since 5 doesn't divide evenly into either column count.
      First fix spanned the LAST tile across the remainder to close the gap, but that made it visibly
      wider than the other four, flagged directly ("have the bottom 2 tiles be the same size as the
      top 3 so its all even"), uniform tile size mattered more than filling the space. Reverted on
      both `/reorder` and `/demand-forecasting` back to the plain grid with no span classes: five
      equal-width tiles (confirmed 357px each at desktop width), a trailing row with one empty cell
      on the right instead of a stretched tile. **Every remaining capability page (5-9) should default
      to this plain uniform grid**, not the span-based gap-fill, unless asked for the fill specifically.

      The FAQ accordion (`.bold-faq-row`/`.bold-faq-panel`, `src/scripts/faqAccordion.ts`) was also
      redone after direct feedback that it didn't feel "luxurious": the old version toggled the answer's
      `[hidden]` attribute directly, which snaps instantly with no animation (`display:none` has no
      transitionable intermediate state) and used a flat full-row grey fill for the open state with no
      shadow/elevation anywhere. Fixed with a CSS `grid-template-rows: 0fr -> 1fr` trick keyed off the
      button's `aria-expanded` (a sibling selector, so the panel itself can carry `aria-hidden`
      independently for assistive tech rather than `[hidden]`, which would block the animation); a subtle
      `inset` box-shadow accent bar on the open row instead of a flat tint, so it doesn't shift layout the
      way a real border would; a circular ring behind the chevron that tints when open; and a soft outer
      shadow on the whole FAQ card for real elevation. One real bug caught measuring this, not eyeballing
      it: the first attempt still left a ~30px gap under every CLOSED row, because padding on the
      animated child adds to its rendered height regardless of the grid track's computed size (a
      content-box height of 0 plus padding still renders the padding). Fixed by moving the vertical
      padding onto the same `aria-expanded`-gated selector as the height, confirmed with a scripted
      height sample during the transition (0 at rest, smooth growth to 78px open, back to a true 0 on
      close, not the former 30px floor). **Any future accordion on this site should reuse this same
      `.bold-faq-row`/`.bold-faq-panel` pair**, including the gated-padding detail, rather than a fresh
      `[hidden]`-based toggle.

      User-approved 2026-10-07. Not committed.
- [x] 4. `/demand-forecasting` (+ Forecast Spark widget) — built following `/reorder`'s approved
      template exactly: grain+orb hero whose glass panel IS the Forecast Spark widget (history line
      plus a dashed projected line with a traveling comet, pure CSS offset-path, no script), featured
      glass+gradient-ring lead tile in "what it does," plain signal list in "what it watches" (no
      duplicate widget there, see the hero-widget rule above), plain quiet-tile grid in "how it works,"
      and the luxurious FAQ accordion. All copy/schema carried over unchanged from the prior
      ocean-palette build. Locally verified: astro check/build clean, no console errors, no mobile
      overflow. User-approved 2026-10-07. Not committed.
- [x] 5. `/inventory-tracking` (+ Inventory Scan widget) — built following `/demand-forecasting`'s
      template exactly: grain+orb hero whose glass panel IS the new Inventory Scan widget (a 24-cell,
      8x3 stock grid; a sweep bar crosses it once per scroll-entry, each column lighting mint-deep as
      the sweep passes, 3 pre-flagged cells settle taupe instead of mint for "low," then a "3 flagged"
      badge reveals once the sweep finishes, replaying on every scroll re-entry, same shape as
      `reorderGauge.ts`), featured glass+gradient-ring lead tile in "what it does," plain signal list
      in "what it watches," plain quiet-tile grid in "how it works," and the luxurious FAQ accordion.
      New files: `src/scripts/inventoryScan.ts` (the widget driver) and the `.scan-grid`/`.scan-cell`/
      `.scan-sweep` CSS block in `src/index.css`, right after the Forecast Spark block. All copy/
      schema carried over unchanged from the prior ocean-palette build (already accurate). Locally
      verified: astro check/build clean (0 errors/warnings/hints, 154 pages), no console errors,
      scan widget confirmed mid-sweep and fully-settled via Playwright screenshots, FAQ accordion
      click-tested, no mobile overflow at 390px. User-approved 2026-10-07. Not committed.
- [x] 6. `/shipping-optimization` (+ Route Pick widget) — built following `/inventory-tracking`'s
      template exactly: grain+orb hero whose glass panel IS the new Route Pick widget (four carrier
      lanes, each a horizontal track; on scroll-entry a dot races down every lane to its own quoted
      distance, three stop short and dim to 35% opacity, the winning lane runs the full track and
      stays lit mint-deep, then a "Selected" badge reveals, replaying on every scroll re-entry, same
      IntersectionObserver/replay shape as `reorderGauge.ts`/`inventoryScan.ts`), featured
      glass+gradient-ring lead tile in "what it does," plain signal list in "what it watches," plain
      quiet-tile grid in "how it works," and the luxurious FAQ accordion. New files:
      `src/scripts/routePick.ts` (the widget driver) and the `.route-lanes`/`.route-lane`/
      `.route-track`/`.route-fill`/`.route-dot` CSS block in `src/index.css`, right after the
      Inventory Scan block; the winning lane is marked via each lane's own `data-winner` attribute in
      the markup, so the drawn result, the readout text, and the script's `LANE_ENDS` array can't
      silently drift apart. All copy/schema carried over unchanged from the prior ocean-palette build
      (already accurate). Locally verified: astro check/build clean (0 errors/warnings/hints, 154
      pages), no console errors, widget confirmed settled (winner lit, losers dimmed, badge revealed)
      via a zoomed Playwright screenshot plus a DOM-state dump, no mobile overflow at 390px.
      User-approved 2026-10-07. Not committed.
- [x] 7. `/supplier-coordination` (+ Supplier Ping widget) — built following
      `/shipping-optimization`'s template exactly: grain+orb hero whose glass panel IS the new
      Supplier Ping widget (a small hub-and-spokes diagram, four supplier nodes breathing calmly
      around a central hub via a continuous pure-CSS animation; on scroll-entry one node escalates
      and sends a pulse dot along its line into the hub via `offset-path`, the same technique
      `.spark-comet` uses, then that node stays flagged taupe/enlarged and a "1 flagged" badge
      reveals, replaying on every scroll re-entry, same IntersectionObserver/replay shape as the
      other three widgets), featured glass+gradient-ring lead tile in "what it does," plain signal
      list in "what it watches," plain quiet-tile grid in "how it works," and the luxurious FAQ
      accordion. New files: `src/scripts/supplierPing.ts` (the widget driver) and the
      `.ping-line`/`.ping-hub`/`.ping-node`/`.ping-pulse` CSS block in `src/index.css`, right after
      the Route Pick block. All copy/schema carried over unchanged from the prior ocean-palette build
      (already accurate). Locally verified: astro check/build clean (0 errors/warnings/hints, 154
      pages), no console errors, widget confirmed settled via a zoomed screenshot plus a DOM-state
      dump, replay-on-scroll-reentry specifically confirmed (flagged state clears when scrolled away,
      correctly replays when scrolled back), no mobile overflow at 390px. User-approved 2026-10-07.
      Not committed.
- [x] 8. `/wholesale-account-management` (+ Account Ladder widget) — built following
      `/supplier-coordination`'s template exactly: grain+orb hero whose glass panel IS the new
      Account Ladder widget (a 4-rung vertical pricing-tier stepper; on scroll-entry a fill line
      climbs from Tier 1 to the account's actual tier, Tier 3, each passed rung's dot lighting
      mint-deep in sequence via a per-rung `--step` stagger, same technique `.scan-cell`'s `--col`
      uses, then a "Terms applied" badge reveals, replaying on every scroll re-entry, same
      IntersectionObserver/replay shape as the other four widgets). The fill's target height is
      measured from the real rendered dot positions via `getBoundingClientRect` rather than guessed
      pixel math, since rung spacing comes from flex layout. Featured glass+gradient-ring lead tile
      in "what it does," plain signal list in "what it watches," plain quiet-tile grid in "how it
      works," and the luxurious FAQ accordion. New files: `src/scripts/accountLadder.ts` (the widget
      driver) and the `.ladder-widget`/`.ladder-track`/`.ladder-fill`/`.ladder-rung`/`.ladder-dot`
      CSS block in `src/index.css`, right after the Supplier Ping block. All copy/schema carried
      over unchanged from the prior ocean-palette build (already accurate). Locally verified: astro
      check/build clean (0 errors/warnings/hints, 154 pages), no console errors, widget confirmed
      settled (Tier 1-3 lit, Tier 3 marked current, Tier 4 dim, fill height correct, badge revealed)
      via a zoomed screenshot plus a DOM-state dump, replay-on-scroll-reentry specifically confirmed,
      no mobile overflow at 390px. User-approved 2026-10-07. Not committed.
- [x] 9. `/pricing` (+ Price Delta widget) — built following `/wholesale-account-management`'s
      template exactly: grain+orb hero whose glass panel IS the new Price Delta widget (a bounded
      horizontal track between a price floor and ceiling; on scroll-entry a marker slides from the
      old price position to the new one, a highlighted range segment growing to span the move,
      then a "+2.4%" badge reveals, replaying on every scroll re-entry, same
      IntersectionObserver/replay shape as the other six widgets). A single bounded line with a
      sliding marker is a deliberately different silhouette from the gauge arc, multi-lane race,
      radial hub, grid, and vertical ladder already used on the other six capability pages, so all
      seven capability-page widgets now read as genuinely distinct at a glance. Featured
      glass+gradient-ring lead tile in "what it does," plain signal list in "what it watches,"
      plain quiet-tile grid in "how it works," and the luxurious FAQ accordion. New files:
      `src/scripts/priceDelta.ts` (the widget driver) and the `.delta-track`/`.delta-tick`/
      `.delta-range`/`.delta-marker` CSS block in `src/index.css`, right after the Account Ladder
      block. All copy/schema carried over unchanged from the prior ocean-palette build (already
      accurate, including the FAQ's existing "is this what Flowbound costs" disambiguation
      question, see the "FAQ section added" note under "Data-driven pages" above). Locally
      verified: astro check/build clean (0 errors/warnings/hints, 154 pages), no console errors,
      widget confirmed settled via a zoomed screenshot plus a DOM-state dump, replay-on-reentry
      confirmed, no mobile overflow at 390px. User-approved 2026-10-07. Not committed. **This was
      the 7th and final dedicated capability page (items 3-9); remaining items 10-12 are the
      whole-service narrative pages (`/ask-flowbound`, `/customer-service`, `/quality-monitoring`),
      which have inline, non-`services.ts`-driven content per the existing "Data-driven pages vs.
      narrative pages" convention, so each build started from a fresh read of that page's current
      content rather than assuming the exact same six-section shape carries over unchanged.**
- [x] 10. `/ask-flowbound` (+ Decision Feed widget) — built from a fresh read of the page's prior
      content: unlike the 7 capability pages, this whole-service narrative page has no FAQ section
      (none existed in the prior ocean-palette build either) and its own 5-section shape (hero,
      what it is, what it does, "a few things teams ask," how it works), not the 6-section
      capability template. Followed the same visual grammar as every other page converted so far:
      grain+orb hero whose glass panel IS the new Decision Feed widget (a short feed of
      question/answer rows that reveal in sequence on scroll-entry, each row staggered via its own
      `--step` custom property, same technique as `.scan-cell`'s `--col`/`.ladder-rung`'s `--step`,
      taupe "Q" dots vs. mint-deep "A" dots, the third row left as an unanswered question so the
      feed reads as live/ongoing rather than a finished log, then an "Answered in 1.4s" badge
      reveals, replaying on every scroll re-entry, same IntersectionObserver/replay shape as the
      other eight widgets), icon-drift watermark in "what it is," featured glass+gradient-ring lead
      tile plus quiet ink-tint grid in "what it does," the sample-questions section kept as this
      page's one dark bookend (`.bold-depth-ink`, mint dot bullets replacing the old repeated chat
      icon for consistency with the other pages' signal lists), plain quiet-tile grid in "how it
      works." New files: `src/scripts/decisionFeed.ts` (the widget driver) and the `.feed-row`/
      `.feed-dot` CSS block in `src/index.css`, right after the Price Delta block. All copy/schema
      carried over unchanged from the prior ocean-palette build (already accurate; no FAQ was
      invented since none existed before). Locally verified: astro check/build clean (0
      errors/warnings/hints, 154 pages), no console errors, widget confirmed settled via a zoomed
      screenshot, replay-on-reentry confirmed, no mobile overflow at 390px. User-approved
      2026-10-07. Not committed.
- [x] 11. `/customer-service` (+ Ticket Flow widget) — built following `/ask-flowbound`'s
      narrative-page shape exactly: no FAQ (none existed in the prior build), the same 5-section
      layout (hero, what it is, what it does, "a few things customers ask," how it works). Hero's
      glass panel IS the new Ticket Flow widget (four small ticket cards in a row; on scroll-entry
      each card's status label reveals in sequence, staggered via its own `--step` custom property,
      same technique as the other staggered widgets; three settle "Answered" in mint-deep, the one
      marked `.is-routed` in the markup settles "Routed" in taupe instead, then a "3
      auto-answered" badge reveals, replaying on every scroll re-entry, same
      IntersectionObserver/replay shape as the other nine widgets), icon-drift watermark in "what
      it is," featured glass+gradient-ring lead tile plus quiet ink-tint grid in "what it does,"
      the sample-questions section as this page's one dark bookend (mint dot bullets, same
      treatment as `/ask-flowbound`), plain quiet-tile grid in "how it works." New files:
      `src/scripts/ticketFlow.ts` (the widget driver) and the `.ticket-flow`/`.ticket-card`/
      `.ticket-card-status` CSS block in `src/index.css`, right after the Decision Feed block.

      **Real build error, same class the "two TypeScript gotchas" note under "Capability,
      narrative, and blog pages" already warned about, just resurfacing here for widget scripts
      instead of hero scripts**: `decisionFeed.ts` and `ticketFlow.ts` both declared a top-level
      `const SETTLE_MS` with no top-level `import`/`export` in either file, so both were ambient
      *scripts* to TypeScript, not modules, and their `SETTLE_MS` consts collided in shared global
      scope the moment `astro check` type-checked the whole project (`ts(2451)`), exactly like the
      hero-script `CLAUDE`/`SHADOW` collisions described in that earlier note. Fixed the same way:
      added `export {}` to the top of both files. **Any new widget script should probably just
      start with `export {}` by default** rather than waiting for a name collision to surface one,
      since these widget scripts increasingly reuse the same few constant names (`SETTLE_MS`,
      `RUN_MS`, etc.) across files. All copy/schema carried over unchanged from the prior
      ocean-palette build (already accurate). Locally verified: astro check/build clean (0
      errors/warnings/hints, 154 pages, after the `export {}` fix), no console errors, widget
      confirmed settled (3 answered, 1 routed, badge revealed) via a zoomed screenshot,
      replay-on-reentry confirmed, no mobile overflow at 390px. User-approved 2026-10-07. Not
      committed.
- [x] 12. `/quality-monitoring` (+ Inspection Line widget) — the third and final whole-service
      narrative page. Unlike `/ask-flowbound`/`/customer-service`, this page's prior build used
      "what it watches" (signals, a dark bookend) rather than "a few things X ask" as its examples
      section, so it kept that shape instead: hero, what it is, what it does, what it watches, how
      it works, no FAQ (none existed before). Hero's glass panel IS the new Inspection Line widget
      (five units travel a horizontal conveyor through a fixed checkpoint gate, marked with a small
      shield-check glyph, on scroll-entry; four settle past the gate on the main line, mint-deep,
      passed; the one marked `FLAGGED_INDEX` in the script drops below the line as it clears the
      gate, taupe, flagged, then a "1 flagged" badge reveals, replaying on every scroll re-entry,
      same IntersectionObserver/replay shape as the other ten widgets). A perpendicular diversion
      off a single horizontal line is a deliberately different silhouette from every other
      horizontal-track widget (`.route-track`'s parallel lanes, `.delta-track`'s single bounded
      line with no branch). Real build note: `SectionIcon.astro`'s `Props` interface only accepts
      `name`/`class`, no `style`, so the small shield-check glyph positioned above the checkpoint
      gate had to be wrapped in a plain `<span style="left: calc(58% - 7px)">` rather than passing
      `style` to the component directly (`ts(2322)`, caught by `astro check`). Icon-drift watermark
      in "what it is," featured glass+gradient-ring lead tile plus quiet ink-tint grid in "what it
      does," plain signal list in "what it watches," plain quiet-tile grid in "how it works." New
      files: `src/scripts/inspectionLine.ts` (the widget driver, `export {}` from the start per the
      note above) and the `.inspect-line`/`.inspect-track`/`.inspect-gate`/`.inspect-unit` CSS
      block in `src/index.css`, right after the Ticket Flow block. All copy/schema carried over
      unchanged from the prior ocean-palette build (already accurate). Locally verified: astro
      check/build clean (0 errors/warnings/hints, 154 pages), no console errors, widget confirmed
      settled (4 passed on the line, 1 flagged and dropped below, badge revealed) via a zoomed
      screenshot plus a DOM-state dump, replay-on-reentry confirmed, no mobile overflow at 390px.
      User-approved 2026-10-07. Not committed. **This completed all three whole-service narrative
      pages (items 10-12) and all ten Signal Primitives widgets (Stock Gauge, Forecast Spark,
      Route Pick, Inventory Scan, Supplier Ping, Account Ladder, Price Delta, Decision Feed, Ticket
      Flow, Inspection Line), each a genuinely distinct silhouette, none reused across pages.**

**"Signal Primitives II" concept lab (2026-10-07).** Before starting items 13-15, the user asked to
invent new widgets for the three remaining one-off pages rather than leave them without one. Unlike
the ten capability/narrative widgets, none of these three pages (`/how-it-works`, `/services`,
`/product`) uses the small glass-panel hero pattern, each already has its own full-bleed canvas/WebGL
hero, so a widget here has to live inside page content instead, not the hero. Three concepts were
built as a live interactive artifact (same mockup-first discipline as every prior round) grounded in
each page's real copy, not generic placeholder content:
- **Plate Clear** (`/how-it-works`): replaces the static "what comes off your plate" checklist with
  one that visibly auto-clears item by item (checkmark + strikethrough), same 7 real items.
- **Signal Relay** (`/services`): a rotating ticker sampling one real capability + a live-sounding
  readout from each of the 5 real services in turn.
- **Core Convergence** (`/product`), first draft: four pillar nodes pulsing into a central hub.
  **Explicitly rejected**: "I need something that fits the new aesthetic of my site." The real
  problem wasn't execution, it was the shape itself, a radial hub-and-spokes diagram is already
  Supplier Ping's silhouette, and reads as a generic network graphic rather than anything distinctly
  this site. Replaced with **Pillar Spotlight**: no new shape at all, just the site's own already-
  shipped tile system (the ink-tint quiet tile and the glass + ink-to-mint gradient-ring featured
  tile, the exact recipe every bento/capability lead tile already uses) animated so one of the four
  real pillars (Decision Engine, Consulting Wrapper, Ask Flowbound, Web App) is "featured" at a time,
  opening to its real body copy on its turn. Approved as the `/product` concept.

All three approved 2026-10-07. **Lesson worth repeating for any future widget**: when a page already
has an established visual system (tiles, badges, gradient rings), a new widget should animate that
system rather than introduce an unrelated diagram shape, even a well-built one, or it reads as
generic/AI-templated rather than belonging to this specific site.

- [x] 13. `/how-it-works` (+ Plate Clear, + Step Trace) — two-round build, worth reading both
      rounds since the first one was flagged directly and reversed.

      **Round 1 (reversed)**: kept the page's old bespoke dark canvas hero ("Scroll-Driven
      Assembly") recolored to Bold (`HowItWorksBackground.astro`'s gradient swapped to the shared
      `.bold-depth-ink` recipe, `howItWorksHero.ts`'s `SHADOW`/`BRIGHT` constants and every
      hardcoded `rgba(219,233,238,...)` glow/line color swapped to bold-ink/bold-mint), reasoning
      that its scroll-tied comet through four checkpoints already mirrored this page's own
      four-step structure. **Flagged directly**: "the how it works page looks nothing like the
      other pages that were redone, and the hero section widget is also not the right one." Asked
      the user to choose explicitly rather than guess again: match every other converted page's
      light grain+orb + glass-panel hero exactly (chosen, recommended) vs. keep a dark hero with
      different contents. **Lesson: recoloring an old structural choice to the new palette doesn't
      make it "converted" if the structure itself reads as inconsistent with the rest of the
      rebuild** — this whole rebuild's throughline is the shared hero grammar, not just the color
      tokens, and a page that keeps a bespoke dark hero (even a well-crafted, content-accurate one)
      breaks that throughline the same way a leftover `ocean-*` class would.

      **Round 2 (current)**: hero switched to the standard light grain+orb + `bold-glass` panel
      pattern, same as every capability/narrative page. `HowItWorksBackground.astro`/
      `howItWorksHero.ts` left on disk unused (same precedent as every other retired
      `*Background.astro` file, not deleted). Built a new widget for the now-empty glass panel,
      **Step Trace**: a comet travels once along a straight 4-node path (Connect, Signal, Decide,
      Ask, the same four step names as the page's own steps section) on scroll-entry, using the
      same `offset-path` technique as `.spark-comet` but one-shot (`animation-fill-mode: forwards`)
      rather than a continuous loop; each node lights mint-deep in sequence as the comet reaches
      it, staggered via its own `--step` custom property (same technique as every other staggered
      widget); then a "Decision ready" badge reveals next to a real readout line ("Reorder 400
      units · Supplier B," pulled from the page's own step-03 example copy). New files:
      `src/scripts/stepTrace.ts` and the `.trace-track`/`.trace-node`/`.trace-comet` CSS block in
      `src/index.css`, right after the Plate Clear block. Rest of the page unchanged from round 1:
      magnetic buttons, numbered-badge quiet-tile grid for "the four steps" (no featured/lead tile,
      there's no 6-item list here), and the approved Plate Clear widget still replacing the static
      "what comes off your plate" checklist (each row gets a mint-deep checkmark + strikethrough on
      scroll-entry, staggered via `--step`, sitting directly on the `.bold-depth-ink` section
      background like every other dark-section signal list on the site). New files from round 1:
      `src/scripts/plateClear.ts` and the `.plate-check`/`.plate-text` CSS block in
      `src/index.css`, right after the Inspection Line block.

      Real build error (round 1): `plateClear.ts` initially declared `const list/tally/badge` from
      `getElementById`, guarded with an early-return null check, then referenced them (unguarded)
      inside nested closures (`settle`/`reset`/`play`); TypeScript doesn't carry that narrowing into
      a closure defined later in the same function (`ts(18047)`, 6 instances). Fixed by assigning
      the narrowed values to new `const`s (`list`/`tally`/`badge`, shadowing the original
      `*El`-suffixed names) immediately after the guard, which **does** carry the non-null type into
      every closure, cleaner than sprinkling `!` assertions at every call site.

      Locally verified (round 2): astro check/build clean (0 errors/warnings/hints, 154 pages), no
      console errors, hero now visually matches the capability-page template exactly, Step Trace
      confirmed settled (all 4 nodes lit, badge revealed) and replay-on-reentry confirmed, Plate
      Clear unaffected and still confirmed working, no mobile overflow at 390px. User-approved
      2026-10-07. Not committed.

      **Follow-up, later session**: direct feedback on revisiting the page: "why are these crossed
      out all the time... can we have like a moving workflow of these being crossed out at
      different times like a time lapse? And have it restart by clicking on the all clear button."
      Two real findings, not just a pacing preference:
      1. The original stagger was 110ms per row; with 7 rows the whole sequence finished in about a
         second, fast enough that a visitor almost always scrolled in on the already-settled end
         state and never caught a visible sequence, reading as "just crossed out" rather than an
         animation at all.
      2. A genuine bug, found by screenshotting mid-sequence rather than trusting the description:
         `text-decoration-line` (the "line-through" keyword itself) is not an animatable CSS
         property, only `text-decoration-color` is. Toggling `text-decoration: line-through` on
         `.plate-row.is-done .plate-text` made the line snap onto ALL 7 rows instantly the moment
         the `is-done` class was added to every row at once (which plateClear.ts does in a single
         `requestAnimationFrame`, relying entirely on each row's own `--step`-keyed
         `transition-delay` for the stagger), completely ignoring that delay, even though the
         color fade right next to it respected it correctly. A screenshot at the 1.8s mark with the
         old 110ms pacing would have shown this too, it just wasn't visible at that speed; slowing
         the pacing down to actually look at a mid-sequence frame is what surfaced it. **This, not
         just the pacing, was the real cause of "these are crossed out all the time": the
         strikethrough itself was never staggered.**

         Fixed by keeping the line permanently present but transparent at rest
         (`text-decoration-line: line-through; text-decoration-color: transparent;` as the base
         state) so only its color, which genuinely interpolates including from/to transparent, ever
         animates, which DOES respect `transition-delay`. **Any future CSS reveal that toggles
         `text-decoration`, `display`, or another non-animatable property via a class added to
         several elements at once should keep the property's "shape" constant and only animate a
         genuinely interpolable sub-value (color, opacity, transform) instead**, the same lesson
         this file already has for `clip-path`/`IntersectionObserver` geometry, just a different
         discrete-property trap.

         Pacing: per-row delay raised from 110ms to 480ms (`.plate-check`/`.plate-text` in
         `src/index.css`, `STEP_MS` in `plateClear.ts`, no shared source, keep both in sync by
         hand), stretching the 7-row sequence to roughly 3.5s. The `0 of 7 automated` tally now
         counts up in lockstep with each row (new per-row `setTimeout`s in `plateClear.ts`, timed to
         land the instant each row's CSS transition completes) instead of jumping straight from 0 to
         7 at the very end, so the counter itself reads as part of the time-lapse rather than a
         static label.

         `#plateBadge` ("All clear") changed from a plain `<span>` to a real `<button>`: clicking it
         calls the same `play()` the `IntersectionObserver` already uses, resetting every row and
         replaying the full time-lapse on demand, the user's explicit second ask. A small inline
         restart-icon SVG (generic two-arc circular-arrow shape, not any specific icon library)
         spins 180° on hover via `.plate-badge-icon`; the button's `pointer-events` is toggled
         inline in lockstep with its opacity (`none` while hidden/mid-sequence, `auto` once
         settled) so it can't be clicked or tabbed to before there's anything to replay.

         **Real near-miss, caught before screenshotting**: the button's hover/active treatment was
         first written as a separate `transition-opacity duration-300` Tailwind utility (for the
         show/hide fade) alongside a new `.plate-badge` custom class's `transition: background-color
         0.3s ease, transform 0.2s ease` shorthand. The `transition` shorthand fully REPLACES
         `transition-property` rather than merging with whatever another class already set for it,
         exactly the documented `tilt-card`/`reveal-item` trap elsewhere in this file, just with
         Tailwind's own `transition-opacity` utility as the victim instead of another custom class:
         the opacity fade would have silently stopped transitioning (snapping instantly) the moment
         `.plate-badge`'s shorthand won the cascade. Fixed by folding `opacity` into `.plate-badge`'s
         own transition list instead of splitting it across two classes. **Any time a new custom
         class's `transition` shorthand will sit on the same element as a Tailwind
         `transition-{property}` utility, fold that property into the custom class's own list
         instead of leaving the two to fight over `transition-property`.**

         Verified: astro check/build clean (154 pages, 0 errors), a scripted Playwright run sampling
         DOM state at six points across the sequence confirmed the tally counts up 0→2→4→6→7 in
         sync with each row's checkmark, a screenshot at the 1.8s mark confirmed exactly 4 of 7 rows
         visibly struck through (not all 7, the bug above), clicking `#plateBadge` after completion
         confirmed an immediate reset to "0 of 7" followed by a full replay to "7 of 7," no console
         errors, no mobile overflow at 390px. Not yet explicitly re-approved by the user; not
         committed.

         **Real bug, second round, same day**: user reported "i dont see it working after clicking
         all clear," directly contradicting the Playwright verification just above. Root cause:
         that verification ran with `page.emulateMedia({ reducedMotion: "no-preference" })`, the
         explicit override this file's own "Verification gotcha" note says to use so a real
         animation loop is actually visible, since this dev machine runs with OS-level Reduce
         Motion on and default screenshots otherwise silently show the static fallback frame. The
         click handler itself was never tested under the OS's actual (reduced) setting. Reproduced
         directly with `reducedMotion: "reduce"` emulation: clicking the badge called `play()`,
         which under `reduced` just calls `reset()` then `settle()` synchronously in the same tick,
         so the state (tally text, row classes) starts and ends identical with no visible change in
         between, meaning the click genuinely did nothing for a reduced-motion visitor, confirmed
         by a scripted click that read the tally as "7 of 7 automated" before, immediately after,
         and 2 full seconds after clicking.

         Fixed by splitting the automatic path from the click path instead of routing both through
         the same `reduced`-gated `play()`. A new `runSequence()` holds the actual staggered logic
         unconditionally (the per-row CSS transitions it drives still separately respect reduced
         motion via index.css's own `@media (prefers-reduced-motion: reduce)` rule, forcing them to
         `transition: none`, so a reduced-motion visitor still gets no per-row motion); `play()`
         (used only by the `IntersectionObserver`'s automatic scroll-triggered entry) still skips
         straight to `settle()` under `reduced`, same as before, since an autoplaying scroll-
         triggered effect is exactly what that preference is meant to suppress. The badge's click
         handler now calls `runSequence()` directly, bypassing the reduced check entirely, since a
         user's own deliberate click on a button labeled to replay something is a requested action,
         not ambient motion, the same reasoning a system accessibility setting's own "preview"
         button uses to still animate on click regardless of the user's reduced-motion preference.
         Even with the CSS-level checkmark/strikethrough transitions suppressed under reduced
         motion, the tally counter (plain text updates) and the badge's hide-then-reappear (a plain
         opacity/pointer-events toggle, not a CSS transition) still tick visibly over the same
         ~3.5s, which is what actually confirms to a reduced-motion visitor that their click did
         something, rather than the totally-silent no-op it was before. **Any future click-to-
         replay or similar explicit user-triggered animation on this site should follow this same
         split**: gate the automatic/scroll-triggered entry point on `prefers-reduced-motion`, but
         never gate a direct user-initiated replay action the same way, or a reduced-motion visitor
         (confirmed to include this dev machine, and apparently the user's own machine too) gets a
         button that silently does nothing. Also worth remembering for next time: **a Playwright
         verification pass that only uses `reducedMotion: "no-preference"` is not sufficient for
         anything with a click-triggered or otherwise user-initiated animation path**, since that
         path can have its own separate (and separately broken) relationship with the OS's actual
         reduced-motion setting; test both media states for those, not just the one needed to see
         the passive/autoplay animation at all.

         Re-verified: astro check/build clean (154 pages, 0 errors), reproduced the bug under
         `reducedMotion: "reduce"` emulation before fixing (confirmed via the flat "7 of 7"-the-
         whole-time reading above), then confirmed the fix under both `"reduce"` (click now reads
         "0 of 7" at 100ms, progresses to "4 of 7" by 2s, reaches "7 of 7 automated" by 4s) and
         `"no-preference"` (same end-to-end replay, unaffected), no console errors in either mode.
         User-approved 2026-10-11 (re-verified build/screenshots, no new issues raised). Not committed.

**Standing rule from the /how-it-works round-trip, applies to `/services` and `/product` too**:
before starting either, asked the user directly whether their existing full-screen WebGL heroes
(`ServicesOrbit`'s pill links, `ProductBackground`'s particle convergence, both real, previously-
approved work) should also switch to the light grain+orb + glass-panel pattern. Answer: **yes,
switch both**, discarding the WebGL heroes for sitewide consistency. Unlike `/how-it-works`'
canvas hero (kept once, then reversed), this was decided up front for both remaining pages, so
each needs its own new hero widget designed fresh, same as Step Trace was for `/how-it-works`;
the previously-approved Signal Relay/Pillar Spotlight concepts (originally scoped for a content
section, "near the hero or above the service sections" / "inside or beside the four pillars")
move into the hero glass panel instead, since a widget that visualizes a whole page's thesis
belongs at the top, not partway down. Each page therefore gets exactly one of its approved
widgets, in the hero, not duplicated into the content section it was originally scoped for.

- [x] 14. `/services` (+ Signal Relay, in the hero) — hero switched to the standard light
      grain+orb + `bold-glass` panel pattern, dropping `ServicesOrbit` (the WebGL particle hero)
      and the six floating pill-links scattered over it entirely (`ServicesOrbit.astro`/
      `servicesHeroWave.ts`'s already-deleted predecessor note still applies: `ServicesOrbit.astro`
      itself is left on disk unused, same precedent as every other retired `*Background.astro`).
      The approved Signal Relay widget now lives in the glass panel: a continuous ticker (not a
      settle-once animation like every other widget, the one widget on the site that loops
      rather than resetting) cycling through all 5 real services, each showing one real capability
      and the *same canonical readout number its own dedicated capability page already shows*
      (Forecast Spark's "+18%", Supplier Ping's "1 flagged," Stock Gauge's "Order placed," Ticket
      Flow's "3 of 4 answered," Inspection Line's "1 flagged this batch"), a deliberate cross-site
      continuity touch. `signalRelay.ts` pauses the interval on scroll-away and resumes on
      re-entry (play/pause, not reset/replay, since there's no "settled" end state to return to).

      Content below the hero: the old three-tone system (`paper`/`white`/`dark` from
      `services.ts`) collapsed to two Bold treatments, light (former paper+white, which were only
      subtly different ocean shades) and dark (the one service marked `dark`, Autonomous), keeping
      the page's real rhythm (4 light sections + 1 dark bookend) and matching the "exactly one
      dark bookend per page" convention every other Bold page follows, rather than inventing a
      second light shade or multiple dark sections. The page's own distinctive slide/scale/clip
      reveal-variety rotation (`revealCycle`, see the original "Services page" note above) carried
      over unchanged, including the `.reveal-clip-mask` wrapper discipline, since those CSS classes
      were never ocean-specific. Numbered circle badges follow the established light/dark-safe
      pairing (`bg-bold-ink`/paper digits on light sections, inverted `bg-bold-paper`/ink digits on
      the dark one, since a plain ink badge would blend into an ink background). `hoverGlow.ts`/
      `data-glow-container` (the cursor-follow glow, an ocean-system mechanic already dropped by
      every other converted page) removed; `cardTilt` was never used here either. All per-capability
      and per-service "Explore X" pills gained `data-magnetic`.

      Real near-miss, caught before shipping: the dark tone's pill button was first given a
      `bg-bold-mint` hover-sweep fill with the pill's existing `text-bold-paper` label, which would
      have repeated the exact class of contrast bug CLAUDE.md already warns about (`mint`, not
      `mint-deep`, only clears ~1.4:1 against `paper`, safe as text/icons on dark ink, not as a
      *fill* paired with paper text). Fixed before verification by reusing the exact same
      `bg-bold-mint-deep` text-`bold-paper` fill, sweep-to-`bg-bold-ink`, pairing already proven
      safe everywhere else on the site, rather than inventing an unverified mint-on-dark variant.
      **Any new pill/badge color pairing should default to an already-proven pairing from this
      list rather than a new one, unless there's a specific reason to check fresh contrast math.**

      New files: `src/scripts/signalRelay.ts` and the `.relay-track`/`.relay-fill`/`.relay-dot`
      CSS block in `src/index.css`, right after the Step Trace block. All copy/schema carried over
      unchanged from the prior ocean-palette build (already accurate). Locally verified: astro
      check/build clean (0 errors/warnings/hints, 154 pages), no console errors, Signal Relay
      confirmed advancing through items with the dot indicator and fill bar in sync, the Autonomous
      dark bookend confirmed rendering correctly among 4 light sections, reveal-variety rotation
      confirmed across sections, no mobile overflow at 390px.

      **Follow-up, same day**: direct feedback after reviewing the built page: "I want the first
      style of tiles on this page. Where we have the radiant [sic, gradient] border. I feel like
      it would look better here." Asked whether the gradient-ring treatment should go on one
      featured lead tile per section (matching the capability pages' bento pattern) or every
      tile; the user chose one lead tile per section. Every capability grid on the page (the
      "Ask Flowbound" teaser's 3 and each of the 5 services' 2-3) now stacks a featured
      `bold-tile-feature` lead tile (capability index 0) above a quiet grid of the rest, same
      `[data-reveal]` wrapper / `[data-tilt]` inner-element split every other featured tile on the
      site uses. The dark Autonomous section needed its own `featureCard` variant, since
      `.bold-glass`'s light frosted fill is built for sitting over imagery (the hero), not a dark
      content section: same gradient ring, but a plain `border-bold-paper/15 bg-bold-paper/8` fill
      instead (slightly stronger than the quiet tile's `/5`, to read as "the featured one" without
      `.bold-glass`). Per-capability "Explore X" pills that used to sit under every tile now only
      apply to the lead tile and the (possibly empty) quiet grid, same `capability.href` logic as
      before, just redistributed. Re-verified: astro check/build clean (154 pages, 0 errors), no
      console errors, gradient ring confirmed rendering on both light and dark sections (including
      the Autonomous one, where the mint half of the ring reads clearly against the dark
      background), no mobile overflow.

      **Second follow-up, same day**: a screenshot of the built page was flagged directly as not
      looking good: "I need a better way to display these tiles on the page that look high quality
      and professional." The real defect, visible once pointed at: each per-capability "Explore X"
      CTA was a large pill living OUTSIDE its card (`mt-5 flex justify-center`, `min-w-[19rem]`),
      separated from the card by a dead gap and centered independently of it, so a card and its
      button read as two unrelated objects, not one tile, and a long label wrapping to two lines
      (e.g. "Explore Demand Forecasting") made that pill a different height than a short one on the
      same row (e.g. "Explore Inventory Tracking"). Root cause wasn't the gradient ring or the
      palette, it was this card/button split, the same kind of "separate floating action" shape the
      Linear/Stripe/Attio bento convention this whole rebuild is modeled on explicitly avoids (see
      the mockup-process note at the top of this section).

      Fixed by moving the action INSIDE the card: every lead and quiet tile is now a single
      `flex h-full flex-col` box, the "Explore X" action is a plain text link (icon + label + arrow,
      not another filled pill) behind a hairline `border-t` divider, pinned to the card's bottom
      edge via `mt-auto` rather than following directly after the description. Two effects of this:
      (1) a card with no href just ends after its description, no dead space, since there's no
      detached button reserving room below it; (2) in the quiet-tile grid, where sibling cards
      stretch to match row height (`h-full` on a CSS Grid item defaults to `align-items: stretch`),
      two cards with different description lengths now still land their footer links at the exact
      same baseline, confirmed in a side-by-side screenshot, instead of each sitting at a different
      height below its own paragraph. New shared CSS: `.bold-tile-link` in `src/index.css` (a bare
      `transition: color` marker, the actual link styling is Tailwind utilities in markup), plus two
      new `toneStyles` fields (`footerBorder`, `link`) for the light/dark divider and link-text
      colors, reusing the same mint-deep-on-light / mint-on-dark pairing already proven elsewhere on
      this page rather than inventing a new one. `.bold-tile-feature`'s gradient ring was also
      nudged from 1.5px/0.6 opacity to 2px/0.8 opacity while in here, since the original was faint
      enough at 1x scale to read as a plain thin border rather than the "radiant border" effect the
      user had asked for ten days earlier (see the first follow-up above), not something caught by
      an oversampled or zoomed-in screenshot.

      This only touched the per-service capability grids (the ones with real `href`s): the "Ask
      Flowbound" teaser's 3 tiles have no `href` field in their data at all, so they had no
      detached-pill bug to begin with and weren't restructured. Re-verified: astro check/build clean
      (154 pages, 0 errors), the Inventory section (light) and Autonomous section (dark) both
      screenshotted at the card level confirming the footer link now sits inside the card behind a
      visible divider, quiet-tile footer-baseline alignment confirmed across two cards with
      different copy lengths, no mobile overflow at 390px. User-approved 2026-10-11. Not committed.

**Premium pill button system, sitewide (same day).** Direct feedback after seeing the tile-footer-
link fix above: "I like this way much better... can we apply this update site wide? ... any button
on the site let's enhance to fit this new design language." Two separate asks, handled together:

1. The tile-footer-link pattern itself only needed spreading to `/services`' own capability grids,
   since a grep confirmed `capability.href`/`capabilities[0].href` is only ever read in
   `services.astro`, every other page's featured/quiet tiles describe sub-features of that SAME
   page (no cross-page link), so they never had the detached-pill bug to begin with. Nothing further
   to change there.
2. "Any button on the site" was real scope: roughly 15 files (`Hero.astro`, `Cta.astro`, `Nav.astro`
   desktop + mobile CTAs, `HowItWorks.astro`/`ProductSystem.astro`'s homepage pill, `services.astro`'s
   hero + Ask Flowbound teaser + per-service closing pills, and all 11 already-converted capability/
   narrative pages' hero buttons) each repeated their own ad hoc Tailwind class string (a mint-deep
   fill, an ink outline, or a third ink-filled variant used for the homepage's two "See X" pills) plus
   a hand-copied `group-hover` sweep `<span>`, so the same pill idea looked and behaved subtly
   differently depending on which file last touched it. `/product` and `/blog` were deliberately
   EXCLUDED: both are still on the old `ocean`/`fb` system (checklist items 15 and 16-18, not yet
   built), so their buttons will pick up this system automatically when their own turn comes rather
   than being touched out of order while the rest of those pages isn't Bold yet.

   Replaced with one shared system in `src/index.css`: `.bold-btn` (base layout/motion, wrapped in
   `@layer components`, see the real bug below) plus one tone class (`-primary` / `-ink` /
   `-secondary` / `-secondary-dark`) plus one size class (`-lg` / `-md` / `-sm`). "Premium" here
   means a layered, color-tinted shadow (a tight contact shadow plus a wider glow matching the fill
   color) and a faint inset top highlight, replacing the old single flat `hover:shadow-[...]` value
   that read as a generic template pill rather than something considered. The hover sweep-fill is
   now a CSS `::before` pseudo-element (clipped automatically by the parent's existing
   `overflow-hidden` + rounded corners) instead of a hand-rolled `<span>` at every call site, so a
   button's markup only needs its label/icon/arrow content; those children get
   `position: relative; z-index: 1` for free via `.bold-btn > *`, so old `relative z-10` classes
   left on spans from the pre-existing markup are redundant but harmless. Primary is ground-agnostic
   (the mint-deep fill / paper text pairing already proven safe on both light and dark sections) so
   it needs no dark variant; only the outline secondary does, since its border/text color has to
   invert to stay legible on a dark section like `Cta.astro`'s `.bold-depth-ink` ground. The 11
   capability/narrative pages' hero buttons (identical markup across all of them, confirmed with
   grep before touching anything) were converted with a scripted literal-string replace rather than
   11 manual edits, verified `assert`-style (the script fails loudly if any file doesn't contain the
   exact expected old string) rather than trusting a blind find-and-replace.

   **Real bug, caught from a mobile screenshot, not anticipated in advance**: Nav's desktop CTA
   (`hidden sm:inline-flex` on the same element as the new `bold-btn` classes) stayed visible at a
   390px mobile width after the conversion. Root cause: `src/index.css` is plain CSS written after
   `@tailwind utilities` (line 3), so a bare `.bold-btn { display: inline-flex }` sits LATER in the
   compiled stylesheet than Tailwind's own `.hidden`/`.sm\:inline-flex` utilities; at equal
   single-class specificity, later source position wins, so `.bold-btn`'s unconditional
   `display: inline-flex` silently beat `hidden` at every breakpoint instead of only at `sm`+.
   This is the first custom class in this file to set `display` and also get combined with a
   Tailwind responsive-display utility on the same element, every other custom class so far
   happened to avoid this exact collision, so it hadn't surfaced before. Fixed by wrapping the whole
   `.bold-btn` block in `@layer components`, which tells Tailwind to splice it in at the
   components-layer position (before utilities) regardless of its physical position in the file, so
   `hidden`/`sm:inline-flex`/`w-full`/every other Tailwind utility reliably overrides it, matching
   what Tailwind's layering model already assumes for any custom component class. **Any future
   custom CSS class in this file that will ever be combined with a Tailwind utility on the same
   element (especially a responsive display/visibility one) should go in `@layer components` from
   the start**, not plain top-level CSS, this bug class is easy to miss until the one page/viewport
   combination that actually exercises the conflict gets screenshotted.

   Verified: `astro check`/`astro build` clean (154 pages, 0 errors/warnings/hints), zero console
   errors across `/`, `/services`, `/reorder`, `/how-it-works`. Screenshotted: homepage hero at rest
   and on primary-button hover (sweep-to-ink + layered shadow confirmed), the dark `Cta.astro`
   section (both the primary and the new `secondary-dark` outline read correctly against
   `.bold-depth-ink`), `/services`' Ask Flowbound teaser pill and the dark Autonomous section's
   capability tiles, `/reorder`'s hero (confirms the 11-page scripted batch rendered correctly), the
   homepage mobile nav (confirms the `@layer components` fix: desktop CTA now correctly hidden below
   `sm`, hamburger menu's own full-width "Request a pilot" button renders and centers correctly).
   User-approved 2026-10-11. Not committed.
- [x] 15. `/product` (+ Pillar Spotlight, in the hero) — hero switched to the standard light
      grain+orb + `bold-glass` panel pattern, dropping the "Convergent Signals" WebGL particle hero
      (`ProductBackground.astro`, left on disk unused, same precedent as every other retired
      `*Background.astro`) per the standing decision made before `/services` that both remaining
      WebGL heroes should go. The approved Pillar Spotlight widget lives in the hero glass panel: a
      2x2 grid of the page's own four real pillars (Decision Engine, Consulting Wrapper, Ask
      Flowbound, Web App), one highlighted at a time on a continuous loop (play/pause, not
      reset/replay, same shape as Signal Relay, since there's no single "done" pillar, the rotation
      itself is the thesis), with a readout line below showing the current pillar's real title and
      a one-line blurb condensed from its own body copy. The highlight reuses `.bold-tile-feature`'s
      own gradient ring directly, toggled onto the active `.pillar-chip` by index via
      `pillarSpotlight.ts`, "no new shape, just the site's tile system animated," per the originally
      approved Signal Primitives II concept.

      Direct request this round, not just "convert to Bold": "I need this page to be eye catching,
      stunning and the best page to be on visually to the site. Ensure all my tiles are the radiant
      tiles with the interactive hover mode." A deliberate, explicit exception to the sitewide
      "exactly one featured lead tile per grid" convention every other page follows: all 4 pillar
      tiles AND all 3 how-it-works step tiles get the full `.bold-tile-feature` gradient-ring +
      `[data-tilt]` treatment, not one lead tile with a quiet grid underneath. Light pillar tiles
      reuse the exact `tilt-card bold-tile-feature bold-glass` recipe (plus a per-pillar icon,
      bolt/document/spark/network, alongside the existing numbered-badge convention, for extra
      visual richness specific to this one flagship page); dark step tiles (the page's one
      `.bold-depth-ink` bookend) reuse the dark `featureCard` variant from `/services`' Autonomous
      section (`border-bold-paper/15 bg-bold-paper/8`, no `.bold-glass`). This makes `/product` the
      one page on the site where "featured" is the default tile treatment rather than the
      exception, by explicit request, to set it apart as the flagship page. `hoverGlow.ts`/
      `data-glow-container` (the old mouse-glow mechanic this page used to drive its pillar/step
      grids) and `heroScroll.ts` (no longer needed without the WebGL hero's scroll fade/zoom) were
      both removed, same precedent as every other converted page.

      New files: `src/scripts/pillarSpotlight.ts` and the `.pillar-chip`/`.pillar-dot` CSS block in
      `src/index.css`, right after the Signal Relay block.

      **Follow-up, same session: "Can we implement this [double-gradient orb hero] on all pages of
      my site? Make each one slightly different... Have the Homepage and product page heros the
      'best' of all the site."** A grep confirmed all 12 already-converted capability/narrative
      pages (the 7 dedicated capability pages, 3 narrative pages, `/services`, `/how-it-works`)
      shared one byte-for-byte identical single orb (`20rem`, same position, same `#C998CD` purple-
      tint, same `0.32` opacity), literally the "redundant hero" problem implied by the request.
      Gave each page a second orb: same established palette (`mint` `#8FE3D3`, `taupe` `#6E5A52`,
      the derived purple-tint `#C998CD`), unique size/position/color combination per page, sized
      and positioned to stay visibly quieter than the homepage's and `/product`'s large flagship
      orbs (now the two intentionally "best"/richest hero treatments on the site, per the user's
      explicit framing), preserving the existing "capability hero is deliberately quieter" rule
      while still giving every page a real second glow instead of one shared, identical orb.

      **Real finding, not just a tuning pass**: `teal` (`#6E9CA3`), used as the second orb's color
      on 4 of the 12 pages, read as essentially invisible against `bg-bold-paper` even after
      bumping its opacity well past what made mint/taupe/purple-tint clearly visible on the same
      background. The math: teal's own lightness is already close to paper's, so blending it at any
      reasonable "soft glow" opacity (where mint or taupe produce a clearly visible tinted blur)
      interpolates to a near-imperceptible, barely-greyed version of the background rather than a
      visible color statement, confirmed by computing the blended RGB at 30% opacity (lands within
      a few units of paper's own RGB) rather than just eyeballing a screenshot. This is a new,
      background-specific finding, not a contradiction of the existing CTA-band note that teal
      "reads as atmosphere" there: that reasoning was specific to blending over a dark, saturated
      `ink` ground, where teal's mid-lightness stands out; on a LIGHT `paper` ground the same
      mid-lightness is the problem; the same color can be background-appropriate on one ground and
      not the other. Fixed by swapping every second-orb use of `teal` for `mint` or `taupe` instead
      (both already proven to read clearly on `bg-bold-paper`) rather than inventing a new derived
      "teal but darker" glow color for a single use case. **Any future light-background glow should
      stick to mint, taupe, or the derived purple-tint, not the sitewide `teal` token**, which is
      safe as text/icon color on `ink` but not as a glow on `paper`, a distinct contrast failure
      mode from the ones already documented (not a "too dark," `ink`-style failure, a "too close to
      the background's own lightness" one).

      A second pass also found the new orbs individually too faint even in their safe colors at the
      original smaller size (13-16rem, scaled down from the homepage/product's 18-26rem on the
      assumption that smaller = quieter): since `.bold-orb`'s blur radius is a fixed 60px regardless
      of the orb's own diameter, a smaller circle devotes proportionally more of its area to the
      blurred-away edge, reading noticeably fainter than the same opacity at a larger size. Fixed by
      sizing every second orb to roughly `homepage/product orb size - 4rem to -8rem` (17-20rem, not
      13-16rem) rather than scaling it down arbitrarily; the "quieter than the flagship pages" effect
      now comes from a same-ballpark size paired with a smaller handful of total orbs (2 vs home's
      and product's own 2, so actually equal in count, the quietness comes from the capability pages'
      overall lower hero complexity: no two-line italic accent treatment variety, a narrower content
      column, etc., not from an artificially shrunken orb).

      Re-verified across all 12 affected pages plus `/`/`/product`: astro check/build clean (154
      pages, 0 errors), a scripted sweep of all 14 Bold-converted pages at both desktop and 390px
      mobile widths confirmed zero console errors and zero horizontal overflow anywhere, screenshots
      confirmed every second orb now reads as a clearly visible, distinctly colored/positioned glow
      relative to its neighbors.

      **Second follow-up, same session**: direct correction on the rollout above: "the gradients
      should all be in the top right corner like the product page. Also they should all be the
      green and purple gradient. I just need them to not be 100% the same." The per-page color
      variety (mint/taupe/purple-tint rotating, teal swapped out) and scattered positions
      (bottom-left, top-left, etc.) from the prior pass were exactly the wrong kind of "different,"
      not what was being asked for: the user wanted ONE consistent signature (mint-to-purple,
      top-right, matching `/product`'s own combo, since that's the one they said they "really
      like"), with only small enough variation that no two pages are pixel-identical, not a
      different color story per page. Rewrote all 12 pages' two orbs (plus swapped the homepage's
      own second orb from `taupe` to the same `#C998CD` purple-tint, since "they should all be"
      was read as including the homepage, not just the 12 capability/narrative pages) to the same
      `#8FE3D3` mint primary / `#C998CD` purple-tint secondary pairing `/product` uses, both
      anchored to the top-right corner (negative-to-small `top`/`right` offsets for the primary,
      a smaller inset `top`/`right` position for the secondary, same geometry `/product`'s own two
      orbs use), with every page's exact size/position/opacity numbers hand-varied by a few units
      so none are byte-for-byte identical to `/product`'s or to each other's, the literal reading
      of "not 100% the same." Homepage and `/product` keep the largest sizes in the set (24-26rem
      primary), every other page's primary sits around 18-21rem, preserving the already-established
      "capability hero is deliberately quieter than the homepage/product flagship" hierarchy via
      size while every page now shares the same two-color identity.

      Re-verified: astro check/build clean (154 pages, 0 errors), a scripted sweep across `/`,
      `/product`, and 6 of the 12 capability/narrative pages confirmed zero console errors and zero
      mobile overflow at 390px, screenshots confirmed every hero now reads as the same mint-to-
      purple top-right signature at a page-appropriate scale, distinct enough in exact size/position
      to not look cloned next to its neighbors in the nav. User-approved 2026-10-11 (re-verified
      build/screenshots this session, no new issues raised). Not committed.
- [x] 16. Blog index + pagination (`/blog`) — moved off the dark `ocean-900` canvas hero
      (`BlogBackground.astro`, "Insight Stream") onto the standard light grain+orb + `bold-glass`
      hero every other converted page uses, same two-orb mint/purple-tint top-right signature
      (`20rem`/`16rem`, hand-varied from its neighbors per the established rule). No Signal
      Primitives widget was ever scoped for the blog, so rather than invent an unapproved animated
      one, the hero's glass panel shows real, non-animated content: the actual latest post (title,
      category, description, date, read time), pulled from the same sorted `allPosts` array the
      rest of the page already uses. `BlogBackground.astro` left on disk unused, same precedent as
      every other retired `*Background.astro`. Post cards dropped the ocean-era
      `hoverGlow`/`cardTilt` mouse-glow+tilt mechanic (`data-glow-container`, `GLOW_SIZE`, the
      cursor `<div data-glow>`, all removed). Sidebar search/category filters and pagination
      controls restyled to Bold tokens, `blogFilter.ts`'s logic untouched (it only reads `data-*`
      attributes, not classes). Added `magneticButton` to the hero's two CTAs, matching every other
      page's hero buttons.

      **Real sitewide bug found while verifying this page, not specific to the blog**: see the
      "font-hanken on headings" note below, immediately following this checklist, fixed as part of
      this same pass before moving on to items 17-18.

      **Post card redesign, same day, before first approval.** The first pass restyled the cards to
      the same plain ink-tint quiet-tile hover every capability page's grid uses, keeping the old
      per-category `accent` system (a single muted hex per category, 3px top border, small icon
      token) unchanged. Flagged directly on the post page's "Related reading" cards (same component
      family): "the related reading posts are the old style not new," i.e. reskinned colors on an
      unchanged shape doesn't read as converted. Separately, the user then asked for the card design
      itself to be pushed further: "I also need each blog post preview tile to really stand out...
      show the different categories in a better more eye catching way." Handled as a real mockup
      round (same discipline as every structural decision in this rebuild, not improvised in code):
      three options built as a live interactive artifact using real posts/categories, not invented
      content — **A: Color Block Header** (a tinted masthead block with the icon and category name
      inside it), **B: Gradient Ring, Every Tile** (the site's own `.bold-tile-feature` ring, reused
      on every card, ring color tied to category), **C: Duotone Wash + Big Label** (a soft gradient
      wash of the category color across the whole card, a bold mono label with an underline rule,
      a large rotated watermark icon). Round 2 of the mockup added real two-stop gradients in place
      of flat tints, colored hover shadows (reusing `.bold-btn`'s own tinted-shadow recipe), a
      "pin hover" toggle so every card's hover state could be compared at once, and all 7
      categories shown together instead of 4. **User picked C.**

      Implementing C required replacing the category color system, not just the card markup: the
      old `blogCategories.ts` `accent` (one muted hex per category, tuned for the pre-Bold ocean
      palette, explicitly "no purple, no saturated/neon hues") read as flat and undersaturated once
      applied as a full-card wash rather than a 3px line. Replaced with a `tint`/`deep` pair per
      category, recalculated via real HSL rotation + sRGB contrast math (not eyeballed): seven hues
      spread around the wheel at a consistent saturation/lightness recipe so they read as one family,
      each `deep` value independently checked at 4.5:1 AA or better against `bold-paper` (Inventory
      5.36:1, Supplier 4.69:1, Shipping 4.54:1, Customer Service 5.31:1, Quality 4.80:1, Autonomous
      8.95:1, Industry Insights 6.17:1). `categoryAccent()` is gone; `categoryTint()`/`categoryDeep()`
      replace it. New shared `.bold-post-card` class in `index.css` (gradient wash via `color-mix()`,
      a large `.bold-post-watermark` icon bottom-right, `.bold-post-label` category label with a
      small underline rule, colored hover border/shadow), applied to both the blog index grid
      (`[...page].astro`) and the post page's related-reading cards (`[slug].astro`), the exact
      component-reuse the mockup's own closing note promised ("whichever direction wins, the same
      recipe would carry over... unchanged"). `BlogThumbnail.astro` (the old dark full-bleed
      thumbnail banner related-reading used) is now fully unused anywhere in the codebase and was
      deleted outright, not left on disk, since it's a small reusable component with no other
      purpose once its one caller stopped using it, unlike a retired `*Background.astro` hero
      composition (a whole alternate concept worth keeping for reference).

      Locally verified: astro check/build clean (154 pages, 0 errors/warnings/hints), no console
      errors, search/reset/pagination click-tested end to end (search "reorder" correctly narrowed
      to 7 of 45, reset correctly restored 9 of 45, clicking "Older" correctly navigated to
      `/blog/2/`), no mobile overflow at 390px, all 7 categories' wash/watermark/label/border
      confirmed rendering correctly on the real grid via screenshot.

      **Filter bar moved from a left sidebar to the top, same day.** The `lg:grid-cols-[240px_1fr]`
      two-column layout (a sticky 240px sidebar plus a `sm:grid-cols-2 xl:grid-cols-3` grid) gave up
      a whole column's worth of width to the sidebar, which is why the grid only reached 3 columns
      at `xl`, not `lg`. Direct ask: "move the filters to the top so that we can have 3 tiles on
      each row... change the filter part to a more interactive/better way to apply filters." Fixed
      both at once: the search input and category list moved into a single horizontal bar above the
      grid (search left, pills right, wrapping on narrow widths), freeing the full container width
      for a plain `sm:grid-cols-2 lg:grid-cols-3`, three real columns from `lg` up instead of `xl`.
      The category checkbox list became real toggle-button pills (`.category-pill` in `index.css`,
      `aria-pressed` as both the a11y state and the CSS hook, not a hidden checkbox), each carrying
      its own `--cat-deep` custom property so its pressed/active state fills with that category's
      own color (the same per-category-identity idea `.bold-post-card` already uses for the grid
      itself) rather than one generic active color. `blogFilter.ts` updated to match: `checkboxes`/
      `.checked` became `categoryButtons`/`getAttribute("aria-pressed")`, `change` listeners became
      `click` listeners that flip the attribute before re-applying filters; the actual filtering
      logic, `sessionStorage` scroll/filter-state persistence, and `data-post-card`/`data-category`/
      `data-search` attributes on the cards themselves were untouched, so the existing
      back-navigation state restore still works unchanged. Re-verified: astro check/build clean, no
      console errors, clicking two pills correctly narrowed to 12 of 45 (both show their own fill
      color simultaneously), reset correctly restored 9 of 45 and cleared every pill's pressed
      state, no mobile overflow at 390px (pills wrap to their own rows below the search input).

      **Watermark icon fixes, two rounds, same day.** Round 1 feedback: the icon ("logo" in the
      user's words) needed real cushion on every side at rest and shouldn't rotate, just bold on
      hover. Fixed: `.bold-post-watermark` dropped its rotation entirely (rest and hover alike) and
      moved from negative offsets bleeding past the card edge to positive ones (`bottom: 18px;
      right: 18px`) fully inside the card. The "bolden on hover" effect reuses real SVG
      `stroke-width`, not a scale transform: every `SectionIcon` glyph sets `stroke-width="1.5"` as
      a presentation attribute on its own `<path>`/`<g>` (see `SectionIcon.astro`), and a CSS rule
      targeting those same elements always wins over a presentation attribute regardless of
      specificity, so `.bold-post-card:hover .bold-post-watermark path/g { stroke-width: 2.75 }`
      overrides it directly with no change to the icon component itself.

      Round 2, from a screenshot: at 64px the icon still reached up far enough to straddle the
      footer's own `border-top` divider line, half above it in the body-copy area, half below it,
      "the logo should not go above that line... shrunk to fit under that." Fixed by measuring the
      real footer geometry on a live card rather than guessing a smaller size: the footer row plus
      the card's own bottom padding leaves `~49.6px` of vertical room below that divider line,
      consistent across cards regardless of title/description length (the description's `flex-1`
      always pins the footer close to the card's bottom edge). Shrunk to 34px, `bottom: 8px`,
      comfortably inside that band with clearance on both sides so it can never cross back above
      the line. Re-verified with a cropped screenshot of a single card at rest and hovered: icon
      fully contained below the divider, title turns `bold-mint-deep` on hover, no stray overlap
      with the footer text.

      **Post-card excerpt (SEO/UX fix), same day.** See "Every post needs an `excerpt`" under the
      main "Blog" section above for the full story: a dedicated, schema-enforced `excerpt` field
      (max 68 chars, empirically measured against the real card width) replaced `post.data.
      description` as the card body text on the grid, the hero's "latest post" panel, and
      "Related reading," fixing every post's description silently CSS-truncating mid-word with an
      ellipsis. All 45 existing posts backfilled with a real excerpt; `astro build` now refuses to
      compile a post missing one or over budget.

      **Real dev-server gotcha hit while verifying this, same class already documented elsewhere in
      this file**: right after adding the new required `excerpt` schema field, `/blog/` briefly
      rendered "0 of 45 posts" with zero post cards in the DOM, no browser console error. Root
      cause, found in the dev server's own terminal log (not the browser): a stale Vite SSR module
      error from much earlier in the session (a `categoryAccent is not defined` reference, from a
      mid-edit moment during the Option C card rework, long since fixed in the actual file) was
      still cached in the 167-hour-old `astro dev` process and never cleared itself even after the
      real source was correct again. Same root cause as the blog-content-layer-cache gotcha already
      documented under "Data-driven pages" above, just a different symptom (silently empty
      collection output instead of stale post content). Fixed by restarting the dev server (`astro
      dev stop` + relaunch), confirmed immediately after: "9 of 45 posts," 45 real cards in the DOM.
      **If a page ever renders an unexpectedly empty collection with no browser console error after
      an edit, check the dev server's own terminal/log output before assuming the new code is
      wrong**, a long-running `astro dev` process can hold a stale error from several edits ago.

      **Real bug, caught from direct feedback after the mockup's hover lift didn't show up on the
      live site**: "I also dont see the hover animation from the artifact. I need the tile to 'jump
      up' and the shading to appear when I hover." Porting the mockup's `.card:hover` rule into the
      real `.bold-post-card` only carried over the border-color and box-shadow declarations, the
      actual `transform: translateY(-5px)` "jump" was dropped along the way even though `transform`
      was still correctly listed in the `transition` property (so the transition was primed to
      animate a transform, just never given one to animate to). An easy class of bug to miss
      exactly because nothing looked wrong: no console error, no build error, the border/shadow
      half of the hover state worked fine, so a quick glance could read it as "done." Fixed by
      adding `transform: translateY(-5px)` back into `.bold-post-card:hover`; verified with a real
      Playwright hover (not just reading the CSS) measuring the card's bounding box shift (5px lift
      confirmed) and `getComputedStyle(...).boxShadow` (a real tinted shadow color confirmed, not
      just present/absent). **When porting a hover/interaction state from a mockup into real code,
      diff the full rule against the mockup's, don't just skim for "does it look similar," a
      partially-ported effect can pass every automated check while still being visibly incomplete.**

      **Pagination redesign + anchor-scroll fix, same day.** Two direct asks: "I need a bold page
      changing system, this doesnt match my current design language," and "when I navigate the
      pages, dont go to the top of the blog page, go to the filters." Pagination previously used
      plain `rounded-md` number boxes and bare underline-on-hover text links ("← Newer"/"Older →"),
      the pre-Bold convention, out of step with the `rounded-full` pill language the filter bar and
      every card already use. Redone as `.pagination-pill` (new class in `index.css`): page numbers
      are `h-9 w-9 rounded-full` circles (active state unchanged, `bold-mint-deep` fill), Newer/
      Older are bordered pill buttons with an arrow that nudges on hover, and all of them share the
      same small hover-lift + tinted shadow language `.bold-post-card`'s "jump up" already
      established, so pagination now reads as part of the same interactive system instead of a
      leftover component.

      The scroll-position fix is native, no JS: every pagination href (`pageHref()`, plus
      `page.url.prev`/`page.url.next`) now carries a `#posts` fragment, and `#posts` (the section
      wrapping the filter bar and grid) got `scroll-mt-20` so the anchor lands below the sticky
      `h-16` nav rather than tucked behind it. Clicking "Older"/"Newer"/a page number now lands the
      reader directly at the filter bar on the new page, not back at the hero. Verified with a real
      Playwright click-through (not just reading the markup): landing on `/blog/2/#posts` measured
      `scrollY: 605` (not 0) and the `#posts` section's own top at `~80px` from the viewport top,
      clear of the nav. No console errors, no mobile overflow (pills wrap to their own centered row
      under 640px).

      **Filter bar arrangement, same day.** Direct feedback on the pills themselves: "I like how
      they look, but not how they are arranged" (a screenshot showed uneven row breaks, e.g. one
      row with a single pill, the next with two). Root cause: the bar put search and category pills
      in one row (`lg:flex-row lg:justify-between`), so the pills were squeezed into whatever width
      was left beside the search box and right-justified, producing a ragged, unpredictable wrap
      with no relationship to the pills' own content width. Fixed by always stacking two full-width
      rows regardless of breakpoint: search on its own line (`max-w-xs`, not full-bleed), category
      pills on a second line below with the full container width to wrap into, left-justified
      (`flex flex-wrap`, no `justify-end`). Pills now break into even, predictable rows (6 then 1 at
      desktop widths, one-per-row at 390px) instead of an uneven right-aligned scatter.

      **Sitewide 768px horizontal-overflow bug, found here, fixed separately in `Footer.astro`
      (not blog-specific).** First suspected the ambient `.bold-orb`/`.posts-ambient-blob`/
      `.cta-orb` decorative elements (confirmed present at this width on the homepage and
      `/reorder` too), but that was a false lead: hiding every orb/blob element via
      `el.style.display = "none"` and re-measuring `document.documentElement.scrollWidth` showed
      zero change, proving they were already being clipped correctly by their ancestors'
      `overflow-hidden` and weren't the real cause. The actual culprit, found by scanning every
      `<a>` on the page for a bounding rect wider than the viewport: `Footer.astro`'s
      `hello@flowbound.ai` mailto link. The footer's three-column grid (`grid-cols-2 ...
      sm:grid-cols-3`) sits beside the logo/blurb block in a `flex-row` layout from `md` (768px)
      up, so right at 768px the "Contact" column measured only ~77px wide, 3 equal grid tracks
      squeezed into whatever width was left after the logo block, while the email itself rendered
      as an unbroken 123px-wide box (`overflow-wrap: normal` by default, and an email address has
      no spaces to wrap on), overflowing its own column by 46px and the viewport by 6px of that.
      168-1024px is a width range this project doesn't routinely check (the standard sweep is
      390/1024/1280/1440), so this had likely been live since the footer was first built.

      Fixed with `break-words` (`overflow-wrap: break-word`) on the email link, letting it wrap to
      a second line within its narrow column instead of overflowing. Tried adding a `<wbr/>` after
      `hello@` first, hoping for a cleaner `hello@` / `flowbound.ai` break instead of an arbitrary
      mid-word split, but that made it worse, not better: the column is narrow enough that even
      `flowbound.ai` alone doesn't fit one line at this font size, so forcing the first break at
      the `<wbr/>` just pushed `break-word` to force a SECOND break inside `flowbound.ai`, producing
      3 cramped lines instead of 2. Reverted to the plain `break-words` version (one mid-word break,
      2 lines) since it reads better despite the less elegant break point. **When a forced-wrap fix
      still has room to improve, verify the "improvement" by re-measuring rather than assuming a
      more deliberate break point is strictly better, a narrow-enough container can make an
      explicit break opportunity backfire into more wrapping, not less.**

      Verified with a full sweep, not just the one originally-flagged width: 10 widths (640 through
      1024px, plus 390px) across all three of `/`, `/reorder`, and `/blog`, zero horizontal overflow
      on any of them, both before confirming the bug (orb-hiding test) and after the real fix.
      `astro check`/`astro build` clean throughout.

      User-approved 2026-10-11. Not committed.
- [x] 17. Blog post template (`[slug].astro`, one template change, applies to all published posts)
      — same hero/prose conversion to Bold tokens. `@tailwindcss/typography`'s CSS hooks repointed
      from `.ocean-prose` to `.bold-prose` (`bold-ink` body/headings, `bold-mint-deep` links at
      ~4.8:1 against `bold-paper`, the same light-surface accent pairing used sitewide). Related-
      reading cards use the same `.bold-post-card` "Duotone Wash + Big Label" treatment as the blog
      index grid, see item 16 above for the full redesign story; `BlogThumbnail.astro` is deleted,
      not recolored. One muted ambient blob (`.related-ambient-blob`) added to the section,
      matching the "every light section gets grain + one muted blob" rule. FAQ/BlogPosting/
      BreadcrumbList JSON-LD schema, the named-author byline, and `parseFaqFromMarkdown` were
      untouched, pure styling change. Locally verified: astro check/build clean, no console errors,
      spot-checked on a real post (`what-real-time-inventory-actually-means`), no mobile overflow.
      User-approved 2026-10-11. Not committed.
- [x] 18. Blog tag pages (`/blog/tags/[tag]`) — same restyle to Bold tokens, structure (list of
      post rows, `noindex` below `MIN_POSTS_TO_INDEX`) unchanged. Locally verified: astro
      check/build clean, no console errors, spot-checked on a real tag (`pricing-strategy`), no
      mobile overflow. User-approved 2026-10-11. Not committed.

**Hot Sauce checklist complete as of 2026-10-11.** All 18 items approved. Every page on the site is
now on the Bold system except `/404`, which was never in scope (an explicit, standing user decision,
unchanged from every prior redesign pass on this project). Still nothing is committed or pushed:
per the project's standing rule, work stays local until the user explicitly says to commit/push/
deploy, independent of design approval. The only remaining work implied by the rebuild itself is the
one dedicated cleanup pass documented under "Rollout discipline" above (deleting the now-fully-
unused `fb-*`/`ocean-*` tokens, old font-faces, and this section's "in progress" framing), which was
always scoped to happen only once every page was migrated and approved, i.e. now.

Once 16-18 are approved, every page on the site will be on the Bold system except `/404`, which was
never in scope (see below). Still nothing is committed or pushed.

**Real sitewide bug found and fixed 2026-10-11, same class as the already-documented Amulya gotcha:
every `font-hanken` on a Bold page was put on a section/wrapper element, never directly on the `h1`-`h4`
tag itself.** `src/index.css`'s base layer still sets `h1, h2, h3, h4 { @apply font-display }` (Satoshi),
and a direct element-selector rule in the base layer always beats an *inherited* value from an ancestor's
class, regardless of layer order, exactly the mechanism CLAUDE.md's Amulya section already warns about.
Confirmed empirically (not just by reading the CSS) with a Playwright computed-style check:
`getComputedStyle(h1).fontFamily` read `"Satoshi, sans-serif"` on `/how-it-works/` before the fix. A repo-
wide audit found **zero** of the ~104 heading tags across all 19 affected files (the homepage's
`Hero.astro`/`ProductSystem.astro`/`WhyUs.astro`/`SapComparison.astro`/`HowItWorks.astro`/`Cta.astro`,
plus all 13 then-converted capability/narrative/`/services`/`/product`/`/how-it-works` pages) had
`font-hanken` on the tag itself, meaning **every heading on every Bold page built so far, including the
already-approved homepage, was silently rendering in Satoshi instead of Hanken Grotesk** since the
rebuild began. It went unnoticed this long because Satoshi and Hanken Grotesk are both modern grotesque
sans-serifs, close enough at a glance in a screenshot review that the wrong face didn't read as obviously
broken the way a missing color or layout bug would. Fixed with a scripted pass (not manual, given the
file count) inserting `font-hanken` as the first class on every `h1`-`h4` tag, including the two
dynamic `class={\`...\`}` headings in `services.astro` driven by `toneStyles`/`tone` objects. Re-verified
with the same Playwright computed-style check post-fix across `/`, `/how-it-works/`, `/services/`,
`/product/`, `/reorder/`: all five now read `"Hanken Grotesk", sans-serif`. `astro check`/`astro build`
clean (154 pages, 0 errors/warnings/hints) after the fix. **Any new Bold heading must carry `font-hanken`
directly on the tag, not just on an ancestor** — this is now the second time this exact mistake has
happened on this project (first Amulya, now Hanken), so treat it as a standing checklist item when adding
or reviewing any heading markup on a Bold page, not just a one-off fix.

Items 3-9 (the 7 capability pages) share one template, so once item 3 is approved the rest should move
fast. `/404` stays on the current `fb`/Satoshi system for now, per an explicit user decision, picked up
later if ever, same as every past redesign pass in this project.

**Signal Primitives merge (2026-10-07).** The user felt the live Bold pages, while the right palette,
still "fall flat" next to a modern AI-era SaaS product: not enough motion, depth, or tactile feedback.
Rather than design that blind, the missing layer was prototyped first as a standalone interactive
artifact ("Signal Primitives," built and iterated live with the user, not a static mockup round this
time since the ask was specifically about motion/interaction, which a still image can't demonstrate).
Approved primitives, now the standing vocabulary for every remaining item on the checklist above, each
used deliberately rather than stacked onto every element:
- **Tiles**, three treatments, picked per job, not all three on one page: a featured glass + ink-to-mint
  gradient-ring tile (`.bold-tile-feature` in `src/index.css`, reserved for the ONE tile per grid worth
  remembering, paired with `[data-tilt]`/`cardTilt.ts`), the ink-tint + numbered-badge tile `/reorder`
  already originated (`border-bold-ink/8 bg-bold-paper`, `hover:bg-bold-ink/[0.04]`, a solid `bg-bold-ink`
  circle badge with `bold-paper` digits, no new CSS needed, just the existing utility combo), and the
  plain hairline-border-that-lifts-on-hover treatment `WhyUs.astro` already uses, which was left as-is in
  the first pass and then updated anyway after the user flagged that, sitting right below the now-livelier
  bento grid, its old `hover:bg-bold-mist/20` and plain icons (no badges) read flat by comparison; it now
  carries the same numbered-badge + `hover:bg-bold-ink/[0.04]` language as the bento's quiet tiles for
  visual consistency, even though structurally it was already "option three."
- **Buttons** get real tactile feedback: a `[data-magnetic]` attribute (`src/scripts/magneticButton.ts`,
  generic, same desktop-only `(hover: hover) and (pointer: fine)` guard as `cardTilt.ts`/`hoverGlow.ts`)
  nudges the button a few px toward the cursor on hover. A button that opts in drops Tailwind's
  `hover:-translate-y-0.5` from its class list in markup: an inline `style.transform` (which is how the
  magnetic pull is applied) always wins over a class-based one, so the two would silently fight otherwise.
  The existing gradient-sweep fill and soft-wash secondary treatments are unchanged and still stack fine
  with magnetism (they animate `background`/`opacity`, not `transform`).
- **Depth** — the existing `.bold-depth-ink`/grain recipe was already validated and didn't need changes;
  the primitives pass mainly confirmed it as the standing dark-section recipe rather than replacing it.
- **Scroll** — a section's own scroll-linked progress (`watchScrollProgress` from `scrollProgress.ts`,
  the same helper `heroScroll.ts`/`missionScroll.ts` already use) can drive more than a fade/zoom or a
  word-by-word color scrub: `HowItWorks.astro`'s connecting line now fills in with real scroll position
  (`src/scripts/howItWorksDiagram.ts`, sets `--diagram-progress` on the section) instead of a one-shot
  reveal, and each node/label lights up as the fill reaches it, reversing cleanly on scroll-up like every
  other scroll-linked effect on the site. Tuned empirically with a scripted Playwright scroll (not
  guessed): a `1.5x` compression on the section's own progress makes the line finish drawing right as the
  diagram scrolls off the top of the viewport (about 18px of margin, independent of viewport height),
  rather than finishing early (looks done too soon) or late (finishes after it's already scrolled out of
  view, so nobody sees the last bit complete). If a future page reuses this technique on a section where
  the animated element sits at a different position within the section, re-tune and re-measure the same
  way rather than reusing `1.5` blindly.
- **Cursor** (a mouse-follow spotlight over a grid) and the **ten per-page widgets** (Stock Gauge,
  Forecast Spark, Route Pick, Inventory Scan, Supplier Ping, Account Ladder, Price Delta, Decision Feed,
  Ticket Flow, Inspection Line, one mapped to each of items 4-12 above plus `/reorder`) are approved but
  not yet built into real pages; they land with their respective page's own checklist item, not retrofitted
  onto the homepage, which has no widget of its own (its "real UI" moment is already the hero's
  `bold-glass` panel plus the bento's sparkline).

**Verification note specific to this pass**: a Playwright `fullPage: true` screenshot is unreliable for
this site and should not be used to judge scroll-reveal content. Chromium's full-page capture expands the
viewport virtually rather than performing a real scroll, so `[data-reveal]` elements below the first
viewport never receive a real intersection/scroll event and render in their pre-reveal (invisible) state,
making large stretches of an otherwise-correct page look blank or broken in the screenshot. This is not a
site bug, it reproduces on pages untouched by this session too. Verify scroll-reveal-heavy pages by
scrolling in real increments (`window.scrollTo` with `behavior: "instant"`, not the default: this project
sets `html { scroll-behavior: smooth }`, which was itself a separate false alarm this session, mid-transit
reads from a smooth scroll looked like missing content and washed-out text until the scroll was given time
to finish or set to instant) and screenshotting each step, the same "tour" shape as a real visitor's
scroll.

**New files from checkpoint 1, for reference:** `public/fonts/hanken-grotesk-variable.woff2`,
`public/fonts/instrument-serif-400.woff2`, `public/fonts/instrument-serif-400-italic.woff2`,
`src/scripts/faqAccordion.ts`.

**Checkpoint 2 (homepage) detail.** All seven homepage section components
(`Hero`/`TrustBar`/`ProductSystem`/`HowItWorks`/`WhyUs`/`SapComparison`/`Mission`) were rewritten in
place onto Bold/Hanken, matching the approved mockup's five homepage stills (hero, proof strip, bento,
annotated diagram, close) plus two sections the checklist names but the mockup didn't render as stills
(the bento-adjacent "how it works" diagram reuses the mockup's capability-page diagram pattern; the
comparison band reuses the old ocean homepage's SAP-comparison content on the new dark depth treatment,
since the mockup never produced a dedicated still for it). `BaseLayout.astro`'s body background moved to
`bg-bold-paper` (previously `bg-fb-paper`) since Nav/Footer are already bold-paper-colored and most
pages' own sections set explicit backgrounds anyway; its Amulya preload comment was updated since Amulya
is no longer the homepage's font, just every other not-yet-converted page's.

**"Depth" made a shared, universal rule, not a per-section judgment call.** The `Cta.astro` gradient+
grain recipe (`.cta-depth`) was pulled out into a shared `.bold-depth-ink` utility in `index.css`; the
proof strip, the comparison band, and `Cta.astro` itself all point at the one definition now rather than
each declaring their own gradient+grain stack. This was a direct, explicit user instruction mid-build
("I want depth to be universal on this redesign"), not an inferred preference, it applies to **every**
future dark section in this rebuild. It was then also applied to light sections, after a round of direct
feedback caught that the bento grid, the diagram, WhyUs, and Mission were flat single-color fills with no
texture at all (only the hero and the dark bands had grain). Every one of those four sections now gets the
same `bg-grain` overlay the hero uses, plus one soft, muted ambient blob (same `rgba(110, 156, 163, 0.14-
0.18)` dusty-teal recipe Mission's own blob already used, ~24s drift, `prefers-reduced-motion` disables
it) for real atmosphere. **Any future light section on this page, or a new page following this system,
should get the same grain + one muted teal blob treatment by default**, not a flat fill.

**One real color miscalibration, fixed by direct feedback, not by re-deriving contrast math.** The
diagram and Mission sections originally used `bg-bold-mist/30` (a diluted pale-mint tint) to differentiate
them from the plain-paper sections around them, mirroring how `ocean-100`/`ocean-200` used to alternate
on the old homepage. Flagged directly as "too bright": `mist` is a cyan-leaning mint that, even diluted,
reads as a saturated color statement next to the rest of the muted Bold palette, not a neutral section
break. Fixed by dropping both back to plain `bg-bold-paper` (matching what the approved mockup's stills
actually show, none of the five used a tinted section background) and relying on the hairline
`border-t`, the grain, and the two dark bookends to carry section rhythm instead. **`bold-mist` is still a
legitimate accent (the bento big-tile fill, card hover washes) but is not a safe default section
background at this saturation** — don't reach for it as a "lighter alternate" to paper without checking
how it actually reads next to the rest of the muted palette first.

**Two real layout bugs, both caught by measuring rendered geometry, not by eyeballing a screenshot:**
- The bento grid's small tiles (`ProductSystem.astro`) used a fixed `auto-rows` height sized for
  one-line body copy; two-line descriptions (and, on mobile specifically, titles like "Inventory
  Tracking" wrapping to two lines at the narrower column width) overflowed past the tile's own border.
  Fixed by sizing the row height to the actual worst-case content height per breakpoint
  (`auto-rows-[12.5rem]` mobile, `md:auto-rows-[9.5rem]` desktop) rather than guessing a round number.
  **A fixed `auto-rows` grid like this needs headroom for the longest real copy at the narrowest column
  width it'll render at, not just what looks right on one desktop screenshot.**
- The diagram's `absolute`-positioned step labels (`HowItWorks.astro`) sit outside their parent
  `.diagram-track`'s own fixed CSS height (an architectural necessity: the nodes need a defined height to
  position against `top: 50%`), so the container's own box doesn't reflect how far the longest label
  actually extends. The "See how it works in depth" button below it, spaced off that container's nominal
  height, ended up overlapping the last line of the "01 Connect" description by a few pixels, confirmed
  by measuring real `getBoundingClientRect()` values via Playwright rather than trusting a screenshot's
  first impression. Fixed with a larger desktop-only top margin (`mt-14 md:mt-28`) sized to the measured
  overflow plus a real gap, re-measured after the fix to confirm clearance. **When a reveal/label system
  intentionally overflows its own positioned container, don't size the next element's spacing off the
  container's CSS height, measure the actual rendered content extent, or the gap will be wrong in exactly
  this way.**

The diagram's connecting line was also bumped from the mockup's literal `rgba(...,0.12)` value to
`bg-bold-ink/30` (and `h-px` to `h-[1.5px]`): the mockup's own static HTML rendered it finely, but at 12%
opacity in a real browser over the `bold-paper`/grain background it was essentially invisible, caught from
a user screenshot, not from re-inspecting the mockup. **A value copied directly from the static mockup
isn't guaranteed to read the same once it's live in a real section with grain and ambient blobs layered
in, verify it actually renders rather than trusting the source number.**

**Checkpoint 3 (`/reorder`, the capability template) detail.** The existing six-section template (hero,
what it is, what it does, what it watches, how it works, FAQ, then the shared `<Cta />`) carried over
structurally unchanged; only the visual system moved to Bold/Hanken. Template decisions worth reusing
for items 4-9 (the other six capability pages, which share this exact shape):
- **Hero** follows the homepage's grain+orb grammar but deliberately quieter, per the approved mockup's
  own capability-hero still: one orb instead of two, no glass panel, since a capability page explains one
  thing well rather than showcasing the whole product. Breadcrumbs needed a real code change, not just a
  recolor: `Breadcrumbs.astro` was hardcoded to `ocean-100` text for the old dark-hero pages, so it
  gained a `tone?: "dark" | "light"` prop (`"dark"` stays the default, every not-yet-converted page is
  unaffected), `tone="light"` uses `bold-taupe`/`bold-mint-deep` for a light hero background. **Every
  remaining capability/narrative page's hero should pass `tone="light"`** once converted.
- **"What it is"** stays a plain paper section with the existing icon-spin/pulse-ring/`data-icon-drift`
  watermark treatment, just recolored, plus the grain + one muted teal ambient blob now standard on every
  light section (see the homepage's "depth made universal" note above).
- **"What it does"** does **not** reuse the mockup's 3-item stacked-bento (still 07) as-is: this page has
  6 capabilities, and the mockup's own caption is explicit that layout was sized for a 3-item list, not
  forced into a bigger one. The homepage's asymmetric bento (1 big tile + grid of small ones) was tried
  first, sized the same fixed-`auto-rows` way the homepage bento used — and overflowed on 3 of the 5 small
  tiles on mobile once real capability copy (longer and more length-variable than the homepage bento's
  tight one-liners) wrapped past what the fixed row height allowed. Fixed by dropping the fixed-row-span
  approach entirely for this page's content shape: one full-width lead tile (tinted `bold-mist`, no forced
  height) stacked above a plain `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` of the remaining five, every
  tile sized to its own natural content height. **A fixed-`auto-rows` bento is only safe when the real
  copy per tile is short and roughly uniform in length (the homepage bento); for longer or more
  variable capability-page copy, use the full-width-lead-tile-plus-natural-height-grid shape instead,
  verified on mobile specifically since that's the narrowest column width most likely to force an extra
  wrap.**
- **"What it watches"** became this page's one dark bookend (`.bold-depth-ink`, same shared recipe as
  everywhere else), replacing the old `ocean-900` treatment. This is a deliberate shape change from the
  old ocean template, where the *hero* was the page's dark moment; the Bold capability hero is light, so
  the page needs its one dark break somewhere else in the content, and the existing signals section
  (already visually distinct, already full-bleed) was the natural fit. Signal rows use a small mint dot
  bullet instead of a repeated icon.
- **"How it works"** stayed a plain 3-card row (thin border, hover tint, no tilt), not the homepage's
  annotated-line diagram: the diagram device is reserved for the homepage and `/how-it-works` per the
  existing sitewide convention (see "Hero backgrounds"/"Capability, narrative, and blog pages" above),
  not meant to spread to every page with a 3-step process.
- **FAQ** is a real single-open-at-a-time accordion now (`.bold-faq-row` + `data-faq-list` +
  `src/scripts/faqAccordion.ts`, all built in checkpoint 1, this is their first real usage), not the old
  static bordered blocks. The first question renders open by default (matches the mockup's own
  reasoning: "demonstrates both states at once," and mirrors the Linear/Vercel convention the mockup
  cites), the rest start closed via the `hidden` attribute.
- `ReorderBackground.astro` and `src/scripts/reorderHero.ts` (the old "Threshold Drop" canvas hero) are
  left on disk unused, same precedent as `FlowBackground.astro`/`HeroBackground.astro`. Every other
  capability page's own `*Background.astro`/`*Hero.ts` pair will end up unused the same way as items 4-9
  land; none need deleting as part of this rebuild.

**Purple accents, added after direct feedback on `/reorder`: "I hate how the only color on the page are
light mint green and one purple section... I want purple to be used more."** Explicitly scoped to accents
*within* the light sections (not a second full dark band, and not a change to the homepage, both offered
and declined), so the page stays mostly light. `bold-ink` now shows up repeatedly as small solid elements
rather than only as body text and the one dark bookend: every numbered tag (bento tiles, how-it-works
steps) is a small solid `bg-bold-ink` circle badge with `bold-paper` digits instead of plain mono text; the
bento's lead tile switched from a `bold-mist` (mint) tint to `bg-bold-ink/[0.06]` with a `border-bold-ink/15`
border; card/tile hover states switched from `hover:bg-bold-mist/20` to `hover:bg-bold-ink/[0.04]`; the FAQ's
open row gets `aria-expanded:bg-bold-ink/[0.05]` and its chevron moved from `bold-taupe` to `bold-ink`; the
hero's eyebrow icon now sits in a small solid `bg-bold-ink` circle instead of being a bare mint-deep icon;
the "what it is" watermark icon/ring opacity was bumped slightly (14% to 20%, border 10% to 15%) for a bit
more presence. **This is now the standing capability-page pattern, items 4-9 should carry it forward from
the start** rather than shipping the mint-only version and retrofitting purple in afterward. The homepage
(already approved) was explicitly left as-is, this treatment is not retroactive there unless asked.

Two follow-up corrections from the same round of feedback, both real findings, not just taste:
- The hero's eyebrow icon (bare `bolt`, next to the "REORDER" label) was tried inside a small solid
  `bg-bold-ink` circle badge, matching the other new purple accents. Flagged directly as not working:
  reverted back to the original bare `text-bold-mint-deep` icon, no circle. Not every accent position
  wants the same treatment, a small icon next to a short mono label reads better as a plain colored
  glyph than as a tiny badge.
- **The hero orb was asked to go purple (from mint) and literal `ink` (#2E1630) does not work as a
  blurred glow color, confirmed by testing it directly up to 32% opacity**: ink's lightness is only
  ~14%, and alpha-blending a near-black color over `bold-paper` just desaturates to gray well before it
  reads as "purple" to the eye, no matter how far you push the opacity short of making it an opaque
  shape. The ambient teal blobs work at similar low opacities (~16-18%) specifically because teal itself
  already has enough lightness to carry its hue through at that alpha; ink does not. Fixed by deriving a
  lighter tint at ink's own hue instead of using ink directly: `#C998CD` is ink's ~295° hue held at the
  same ~35% saturation but lifted to ~70% lightness, computed via HSL rather than picked by eye. **Any
  future purple glow/wash on a light background should use this derived light tint (or recompute one the
  same way for a different target lightness), never flat `ink` at low opacity**, that combination reads
  as gray regardless of the opacity value chosen.

### Page structure

- `src/pages/`: one file per route, mostly flat (no nested layouts beyond `BaseLayout`)
- `src/layouts/BaseLayout.astro`: shared shell (nav, footer, font preloads, `<Seo>`) used by every page
- `src/components/Seo.astro`: per-page title/description/canonical/OG/Twitter/JSON-LD, used by every page
- `src/content/blog/`: Markdown blog posts via Astro's Content Layer API, schema in `src/content.config.ts`;
  `/blog` (paginated index), `/blog/[slug]`, `/blog/tags/[tag]` all derive from this collection

### Navigation

**Mobile hamburger menu, added 2026-09-20** (`Nav.astro` had no mobile nav at all before this: below
`md`, the desktop `<nav>` just disappeared with no replacement, leaving the header logo and a CTA button
with nothing else reachable). A hamburger button (`md:hidden`, three bars that morph into an X via
`aria-expanded`-driven Tailwind `group-aria-expanded:` variants, no separate JS-toggled class needed)
opens a dropdown panel (`data-mobile-menu`, `visibility`/`opacity`/`translate` transition off a `data-state`
attribute, same mechanism as the desktop Services flyout just driven by a click instead of `:hover`) listing
`navLinks` plus a full-width "Request a pilot" CTA. `src/scripts/mobileMenu.ts` drives it: closes on a link
click, outside click, Escape, or resizing past `md`. Real bug fixed in the same pass: the header's
right-alignment came from `ml-auto` on the `<nav>` element itself, so once `<nav>` went `display:none` below
`md` that auto-margin vanished too and the hamburger (and the CTA before it) packed left next to the logo
instead of sitting at the right edge; fixed by moving `ml-auto` onto a wrapper `<div>` that's always present
regardless of which children inside it are hidden at a given breakpoint.

Services needs a second level: on desktop it's a hover flyout, and three of its entries
(`servicesMenu`'s `expand: true` ones, Inventory/Supplier Management/Autonomous) have their own nested
flyout of capability links. The mobile menu mirrors this as nested accordions, not flat links: the
top-level Services row expands to show Ask Flowbound plus each service, and the three `expand: true`
services are themselves toggle buttons that expand a further-indented list of that service's
`capabilities`. **First shipped without this nesting** (flat links only, silently dropping the whole
second level for those three services), caught when the user asked "where are the inventory/supplier
management/autonomous sub-menus." Fixed by generalizing `mobileMenu.ts`'s accordion logic: every
toggle/panel pair (the top-level Services one and each nested one) is wired the same generic way via
`data-accordion-toggle`/`aria-controls` matching a panel's `id`, so nesting one accordion inside another
just works with no extra script code, and a future fourth `expand: true` service needs no script changes
either. **A new expandable service in `servicesMenu` needs no manual mobile-menu wiring**, the nested
accordion is generated from the same `expand`/`capabilities` data the desktop flyout already reads.

### Blog

Every post needs a `category` (one fixed value from `src/data/blogCategories.ts`, each mapped to a
`SectionIcon` name and, as of 2026-09-13, an `accent` hex color) plus any number of freeform `tags` (used
only by `/blog/tags/[tag]`, unrelated to category). `/blog` (`src/pages/blog/[...page].astro`) shows 9 posts
per page, newest first, with a search box and category checkboxes in a sidebar. Search and category filters
match across **every** post on the site, not just the current page: every post is rendered into every page's
HTML (hidden via a class if it isn't on that particular page), and `src/scripts/blogFilter.ts` shows/hides
across all of them once a filter is active, hiding the pagination controls while it does. Sidebar category
counts are computed from the full collection, not the current page.

**Every post needs an `excerpt`, standing rule as of 2026-10-11, separate from `description`.**
Every post card (the `/blog` grid, the hero's "latest post" panel, a post page's "Related reading"
cards) shows 2 lines of body text (`line-clamp-2`) under the title. Before this, that text was
`post.data.description`, the same ~155-character string written for the SEO meta description/OG
tag/schema (see "SEO metadata length limits" below), sized to use that whole 155-char budget. A
155-char sentence almost never fits 2 lines on a card, so it was silently CSS-truncated mid-word
with an ellipsis on every single post, flagged directly from a screenshot: "I dont like how the
sentence is never finished." Fixed with a dedicated `excerpt` field in `content.config.ts`'s blog
schema (`z.string().max(68)`, a hard build-time gate, not just a style guideline: a post whose
excerpt runs over budget fails `astro check`/`astro build` outright instead of silently truncating
on the live site), decoupling the two concerns: `description` stays the 155-char SEO string
(meta/OG/schema, unchanged), `excerpt` is a short standalone hook sentence sized to actually fit a
card. The 68-char cap isn't a guess: measured empirically via canvas `measureText()` against the
real card description box at its narrowest actual rendered width (a 3-up grid row at exactly the
`lg` breakpoint, 1024px viewport, ~259px per card, the tightest real width the card ever renders
at), simulating word-wrap to find the longest text that still holds to 2 lines. ~70 characters was
the measured ceiling; 68 leaves a couple characters of margin for font-metric variance between the
canvas simulation and real DOM layout. All 45 existing posts got a real, hand-written excerpt
(derived from that post's own title/description, not invented content, same accuracy discipline as
everything else in this pipeline), backfilled via a script that validated every one against the
68-char cap before touching any file, not written loose and hoped to fit. **A new post's
frontmatter needs both `description` (155-char SEO string) and `excerpt` (68-char card hook) from
day one**, continuing this same split; `astro build` will refuse to compile if `excerpt` is missing
or over budget, so this isn't a rule that can be silently skipped.

Is this an SEO fix, strictly speaking? Only indirectly, worth being precise about rather than
overclaiming: `excerpt` never reaches a meta tag, OG tag, or schema block, so it doesn't change
what a search engine shows in a SERP snippet, that's still entirely `description`'s job, untouched.
The real benefits are (1) a genuinely better on-page experience (a card that ends on a complete,
intentional sentence instead of a mid-word ellipsis reads as considerably more polished, which this
project's own quality bar cares about regardless of SEO), and (2) a soft, real SEO-adjacent signal:
the text sitting next to an internal link is something crawlers do use as topical context for the
linked page, and a complete, on-topic sentence is cleaner context than a sentence fragment cut off
mid-clause. It is not, and shouldn't be sold as, a ranking-factor change on its own.

**Card design, redone 2026-09-13** at the user's request to mesh a reference design's compact card size with
this site's own sidebar-filter organization (which the user preferred over the reference's pill-row filter).
Each post card dropped the old full-width `BlogThumbnail` banner (`src/components/BlogThumbnail.astro`,
still used for the smaller "Related reading" cards on `[slug].astro`, just not the main grid) for a small
`h-10 w-10` icon token, added a 2-line-clamped excerpt (`post.data.description`, not shown at all before
this), and a footer with the date plus a real computed read time (`post.body` word count ÷ 200, not a
placeholder). Every category also got an `accent` hex color (`categoryAccent()` in `blogCategories.ts`),
used as a 3px top border on the card, a small dot in the category pill and the sidebar checkbox list, and a
light tint behind the icon token. These are deliberately **not** new `ocean-*`/`fb-*` Tailwind tokens: they're
a small fixed set of muted, desaturated "editorial" colors (no purple, nothing saturated/neon, picked to sit
next to `ocean-100`/`ocean-200` without clashing) applied via inline `style`, since they're one component's
decoration, not a sitewide design token. **When picking or adjusting an accent color, check it at the card's
actual size against `ocean-200`, not just in isolation**: the first Shipping & Logistics color
(`#CC9A3D`, a brighter gold) read as "too light, clashes" once actually on the page and was darkened to
`#96742E`, a muted bronze, keeping the same warm identity.

**Scroll and filter state now survive a trip into a post and back, standing rule as of 2026-09-13.** Before
this, "Back to Blog" was a hardcoded `href="/blog/"` and the browser's own back button landed on a fresh,
unfiltered reload, so a reader who filtered, scrolled, or was on page 2 of pagination lost all of that the
moment they opened a post and came back. Two pieces fixed this together:
- `src/scripts/blogBackLink.ts`: both "Back to Blog" links in `[slug].astro` (marked `data-back-to-blog`)
  call real `window.history.back()` instead of following their `href`, but only when `document.referrer` is
  actually a `/blog` page (a tag page or `/blog/2/` counts, so "back" lands on the right pagination page too,
  not always page 1); a direct visit (search result, shared link) has no real "back" to return to, so it
  falls through to the plain href.
- `blogFilter.ts` saves `{ path, search, categories, scrollY }` to `sessionStorage` on every filter/search
  change, a throttled scroll listener, and `pagehide` (not `beforeunload`, which can block the bfcache), then
  restores it on load, but **only** when `performance.getEntriesByType("navigation")[0].type ===
  "back_forward"**, so a fresh visit from Nav's Blog link still starts clean rather than replaying a stale
  filter from an earlier session. Verified with Playwright driving real navigation (`page.goBack()`, real
  link clicks, not `page.evaluate`): filter state, search text, and exact scroll position all survive a
  round trip through a post, on both the in-page link and the browser's own back button, on both `/blog/`
  and `/blog/2/`; a fresh nav-link visit was confirmed to ignore any leftover saved state.

**Every displayed post date needs `timeZone: "UTC"` on `toLocaleDateString`, real bug found 2026-09-13.**
A post's `publishDate: 2026-09-03` frontmatter value gets parsed as UTC midnight
(`2026-09-03T00:00:00.000Z`). `toLocaleDateString()` with no `timeZone` renders in whatever timezone the
*executing machine* is in, not UTC, so on a machine west of UTC (essentially all of North America) that
same instant is still September 2nd locally, and the date silently displays one calendar day early. This
had been present sitewide since the original blog build, on all four call sites
(`src/pages/blog/[...page].astro`, `[slug].astro` x2, `tags/[tag].astro`), just never surfaced because
nobody had checked a specific post's rendered date against its exact frontmatter value closely enough to
notice a one-day shift. **It only showed up in `npm run dev`, not on the deployed site**: Astro's dev server
renders on every request using the local machine's timezone, while a production build's HTML is rendered
once at build time on Vercel's build container (UTC), where midnight-UTC and the authored calendar day are
the same instant, so the bug happened to be invisible in production. Fixed by adding `timeZone: "UTC"` to
every `toLocaleDateString` call so the rendered date matches the frontmatter value regardless of what
timezone the rendering machine is in. **Any new date-formatting code must include `timeZone: "UTC"`
explicitly**, don't rely on the default locale/timezone.

**Numbered pagination, added 2026-09-13.** `/blog`'s pagination used to be prev/next links plus a plain
"Page X of Y" label, no way to jump more than one page at a time, meaning a jump from page 4 back to page 1
took three clicks. `[...page].astro`'s `paginationRange(current, last)` now renders real page-number links
(`/blog/`, `/blog/2/`, `/blog/3/`, ...), the current page highlighted, alongside the existing Newer/Older
links (still hidden together with the rest of `[data-blog-pagination]` while a filter is active, unchanged).
At <=7 total pages it shows every number; beyond that it switches to first/last plus a window around the
current page with an ellipsis for the gap, the standard scalable pattern, since this blog's stated growth
plan (project_scaling_plan memory: 2-3 posts/day for 6 months) would otherwise turn this into a wall of page
links. Verified with a real Playwright click (not `page.evaluate`) from page 3's "1" link landing on
`/blog/`.

**Tag pages (`/blog/tags/[tag]`) noindex below `MIN_POSTS_TO_INDEX` (3).** Freeform `tags` with no shared
taxonomy meant 47 tag pages existed for 21 posts, most carrying ~32 words (a heading plus one post card),
55% of the entire sitemap. Fixed 2026-09-13: `Seo.astro`/`BaseLayout.astro` both take an optional `noindex`
prop (renders `<meta name="robots" content="noindex, follow">` when true, nothing otherwise); `[tag].astro`
sets it whenever that tag's post count is under `MIN_POSTS_TO_INDEX`. `follow` is deliberate, the page stays
crawlable and passes link equity, it just stops asking Google to index a near-empty archive page. At the
current 21-post catalog this noindexes 40 of 47 tags, leaving 7 indexable (small business, inventory
management, supplier management, wholesale, customer service, quality monitoring, reorder points). **A new
post's `tags` should still be chosen for genuine cross-linking value, not to keep a specific tag page over
the threshold**, the noindex is a consequence of real post count, not something to game.

Tag pages are also excluded from the sitemap entirely (`astro.config.mjs`'s `sitemap({ filter })`, matching
on `/blog/tags/`), on top of the per-tag noindex above: it dropped the sitemap from 85 to 38 URLs. This
applies to every tag page, not just the noindexed ones, since even an indexable tag page is already
reachable by crawl from the posts linking to it and doesn't need sitemap-driven discovery priority. If a
future page type is similarly secondary (reachable by crawl, not meant to compete for discovery priority),
extend this same `filter` rather than adding a second mechanism.
`BlogBackground.astro` is the page's hero: a real JS canvas hero ("Insight Stream," see "Capability,
narrative, and blog pages" below for the shared canvas-hero conventions), the one hero on the site where
signal flows outward from the hub rather than converging into it (see BRAND_GUIDELINES.md).

Be cautious about publishing volume: a plan to add many posts a day for months risks Google's "scaled
content abuse" policy if quality drops to hit a quota. Favor fewer, genuinely useful posts over hitting a
cadence target.

**`blogCategories.ts` no longer has a "Company News" category, removed 2026-09-13.** It existed from the
original taxonomy design but no post was ever assigned it, so it sat in the `/blog` sidebar filter as a
permanent zero-result checkbox (flagged in the SEO audit's P2 list, see `seo_audit_2026_09.md`). It wasn't
replaced with a fabricated announcement post: this project's accuracy rule (check `services.ts` before a
capability claim, the content pipeline's EEAT self-review step) applies just as much to "is there real news
to report" as it does to product claims, don't invent a launch/funding/milestone post just to fill a
taxonomy slot. **If there's ever real company news** (a launch, funding, partnership, a real milestone),
re-add `{ name: "Company News", icon: "document" }` to `blogCategories.ts` at that point and write the post
from the actual facts, same pipeline as everything else. Until then, a new post's category should be one of
the seven remaining real ones.

**All 21 posts SEO-rewritten (2026-08-23).** Every existing post was rewritten through a real content
pipeline, not a stylistic pass: real competitor-article research (WebSearch/WebFetch against actual
top-ranking articles for the post's target keyword, never vendor homepages, which don't have the H2/H3
article structure needed for gap analysis), a content-gap analysis, a ~1,500-word outline with a tight
featured-snippet-targeted definition up front, a draft in the site's existing voice (no em dashes, concrete
numbers over generic advice), an EEAT self-review, internal links woven into sentences (not bare lists),
and 3 title-tag/meta-description options each, capped so the rendered `{title} | Flowbound` tag stays under
60 characters and the description under 155. The first 9 posts map to the site's core keyword list (Supply
Chain, SAP, Demand Forecasting, Inventory Tracking, Shipping Optimization, Supplier Coordination, Wholesale
Account Management, Reorder, Pricing); the other 12 were each assigned a realistic informational keyword
based on their existing angle (e.g. "dead stock," "PO approval workflow," "incoming inspection"). This
process is now the standing default for blog work, not a one-off, and a new post should follow the same
pipeline rather than being written ad hoc.

**Internal linking minimums, standing rule as of 2026-09-06.** Every post's body needs a minimum of 5
in-text links woven into sentences (not a bare "further reading" list), and the FAQ section needs its own
separate minimum of 3 in-text links across its answers, on top of the body's 5, not counted toward it. Link
targets are the usual pool: the seven dedicated capability pages, `/pricing/`, `/ask-flowbound/`,
`/customer-service/`, `/quality-monitoring/`, `/how-it-works/`, other blog posts, etc. This was retrofitted
into all 21 existing posts on 2026-09-06 (the FAQ sections had zero internal links before that pass; the
body minimum was already being hit). When linking a FAQ answer to a specific Flowbound capability page,
the same accuracy rule below applies: check `services.ts` before implying the capability does something it
doesn't (a capability page and its own product marketing page, like `/pricing/`, are two different things:
`/pricing/` is the autonomous **repricing** capability, not a page about what Flowbound itself costs, don't
conflate the two when picking a FAQ link target). A new post should hit both minimums as part of the
pipeline's linking step, not as an afterthought pass at the end.

**Every post has a named `Person` author, not a generic `Organization` byline, since 2026-10-04.**
Fixes a P1 from the 2026-10-04 SEO audit (`seo_audit_2026_10.md`): all 45 posts previously shared
`author: "Flowbound"`, rendered in schema as `{"@type": "Organization", name: "Flowbound"}`, no visible
byline anywhere on the page. Each post's frontmatter now has `author` (a real name) and `authorTitle` (their
role), assigned round-robin across three names in publish-date order: Ryo Shibata (CTO), Muhammad Hassan
(CEO), Muhammad Ali (CFO) — the user's explicit choice over a single standing author or topic-based
assignment. `[slug].astro`'s `BlogPosting` schema now emits `{"@type": "Person", name: post.data.author,
jobTitle: post.data.authorTitle}`, and the post hero also renders a small visible byline ("By {author},
{authorTitle}") next to the date, on the user's explicit request that this be more than schema-only, since a
visible byline is a stronger E-E-A-T signal than hidden JSON-LD alone. **A new post's frontmatter needs both
`author` and `authorTitle` set**, continuing the same round-robin rather than defaulting back to
"Flowbound": count the existing posts in publish-date order and give the new one whichever of the three names is next
in the cycle (post 46 went to Ryo Shibata and the cycle restarts there; with 50 posts as of 2026-10-18, the
51st goes to Muhammad Ali).

**8 posts have a real hand-built SVG diagram, added 2026-10-04, fixing another P1 from the same audit.**
Before this, all 45 posts had zero embedded images of any kind, a closed door to Google Images discovery and
genuinely thinner content than competitors' labeled charts/diagrams. Since there's no real product UI to
screenshot honestly and no analytics yet to identify actual highest-traffic posts (the P0 analytics finding
is still blocked on a GA4 ID), the 8 posts picked were the ones where a real, mathematically accurate diagram
genuinely clarifies the concept rather than decorates it: `reorder-point-math` (sawtooth inventory/lead-time
chart), `safety-stock-how-much-buffer-you-need` (buffer-absorbs-a-demand-spike chart), `economic-order-
quantity-eoq-explained` (the real EOQ cost curves, computed from the same kh=1/ko=20 cost functions the SVG
path data was generated from, not hand-drawn approximations), `inventory-cycle-counting-abc-method` (a
Pareto chart), `landed-cost-formula-explained` (a waterfall chart, deliberately rebuilt once already to
match this post's actual worked-example numbers, $10 → $12.20, not an arbitrary illustrative set), `capa-
process-supplier-quality-issues` (a 5-step flow diagram, also rebuilt once to match this post's actual 5
named steps — Containment, Root Cause Analysis, Corrective Action, Preventive Action, Verification — after
an initial 6-step draft invented an "Identify" step and a reopen-loop the post's text never describes),
`freight-class-explained-ltl-shipping` (a real NMFC density-to-class step chart), and `three-way-matching-
purchase-orders` (a three-document match/mismatch diagram). **Two of these diagrams were rebuilt mid-session
specifically because their first draft used plausible-sounding numbers that didn't match the post's own
worked example** — same accuracy discipline as the `services.ts` capability-claim rule elsewhere in this
file, just applied to a diagram's numbers instead of prose.

Deliberately **not** fabricated product screenshots: the audit's fix suggestion mentioned "annotated
screenshots" as one option, but Flowbound has no shipping product UI to screenshot honestly, and a faked
screenshot would be exactly the kind of dishonest marketing asset this project's accuracy rules exist to
prevent. SVG diagrams in the `ocean` palette, reusing each post's own category accent color as a single
highlight (`blogCategories.ts`'s `accent`, e.g. `#7E9471` sage for Supplier Management's three-way-match
diagram), were the honest alternative that still satisfies the actual SEO goal (real visual content, Google
Images indexability) without inventing a fake product artifact. Files live in `public/blog/diagrams/<slug>.
svg` (plain static assets, not Astro-processed, referenced via standard Markdown `![alt](...)` image syntax
with a real descriptive `alt` and an italicized caption line beneath), not `src/assets/`, since they don't
need Astro's image-optimization pipeline (SVGs don't rasterize-optimize) and a stable, predictable public
path is more useful here than content-hashed filenames. **A new post that would genuinely benefit from a
diagram should follow the same pattern**: a real SVG in `public/blog/diagrams/`, numbers that match the
post's own worked example exactly, the `ocean` palette plus that post's category accent, descriptive alt
text, and a short italic caption — not a decorative stock-style image and not a screenshot of a product
surface that doesn't exist.

**FAQPage schema is parsed from the existing Markdown, not duplicated into frontmatter.** Every post's
"## FAQ" section (see above) already has real, visible Q&A content; `src/lib/faq.ts`'s
`parseFaqFromMarkdown()` pulls it straight out of `post.body` (Astro's glob loader keeps the raw,
unrendered Markdown around for exactly this) at build time in `[slug].astro`, strips Markdown link/bold/code
syntax down to plain text, and emits `FAQPage` schema alongside the existing `BlogPosting`/`BreadcrumbList`
blocks. Added 2026-09-13, zero content files touched. If a post has no `## FAQ` section, the block is
omitted entirely rather than shipping empty/invalid schema, `faqs.length > 0` gates it. Verified at scale,
not just spot-checked: built and asserted all 21 posts (excluding the `/blog/2/`, `/blog/3/` pagination
pages, which correctly get none) produce a `FAQPage` block with the same 4-5 question count already known
from each post's visible FAQ section. **A new post's FAQ section needs no extra work for this**, writing
it in the same `**Question?**` / answer Markdown shape every existing post already uses is enough for the
parser to pick it up automatically.

**Every post gets a real, unique OG image, generated at build time, not one shared static file.**
Before 2026-09-13 every page and post shared one static `og-image.png`. `src/pages/og/[slug].png.ts` is
a static image endpoint (same `output: "static"` model as every HTML page, no server involved) that
renders a title card per post via `satori` (JSX-like tree -> SVG) and `@resvg/resvg-js` (SVG -> real PNG):
dark ocean-900 background, a radial gradient glow, the post's actual category icon as a watermark
(`src/lib/ogIcons.ts`, the same path data as `SectionIcon.astro`, kept in sync by hand), the category
label, the title, and the Flowbound wordmark. `[slug].astro`'s `ogImage={post.data.ogImage ?? `/og/${post.id}.png`}`
uses this by default; a post can still override it with a hand-made image via its existing `ogImage`
frontmatter field.

Two real, empirically-confirmed font constraints, not assumptions, worth knowing before touching this:
**satori cannot parse WOFF2 directly** ("Unsupported OpenType signature wOF2"), so `src/lib/ogFonts.ts`
decompresses this project's existing self-hosted `.woff2` files to raw sfnt via the `wawoff2` package
before handing them to satori. **Satori also cannot parse Amulya at all**, even after decompression,
because it's a variable font and satori's font parser doesn't support variable-font tables (`fvar`/`gvar`);
confirmed by testing Amulya alone (fails) against Satoshi/IBM Plex Mono alone (works) before writing the
real implementation. The OG cards use Satoshi (700/900) and IBM Plex Mono (500) for exactly this reason,
not a design choice, Amulya is simply not usable here. If a future change ever needs Amulya in a
satori-rendered image, it would need a static (non-variable) export of the font first.

New devDependencies from this: `satori`, `@resvg/resvg-js`, `wawoff2`. All three are build-time only
(nothing ships to the browser), consistent with how `@astrojs/check`/`tailwindcss`/`postcss` are already
classified in this project. `@resvg/resvg-js` specifically has a native binary component, worth knowing
since every other dependency here is pure JS. Adding `satori` pulled in one new moderate npm-audit
finding (`fflate`, a DoS via malformed ZIP64 archives) accepted as low real-world risk since the only
"archive" satori ever decompresses in this codebase is this project's own trusted font files, never
untrusted input; not fixed via `npm audit fix --force` since that would bump satori to a breaking version
without testing it. Separately, `npm audit` also surfaced a **pre-existing critical Astro RCE**
(AVIF image optimization, fixed in 7.3.2, this project is pinned to 7.1.3) unrelated to anything added
today; flagged for its own dedicated version-bump-and-test cycle rather than folded into this change.
**Fixed 2026-10-04**: upgraded to `astro@7.3.5` as part of a wider SEO/technical audit, see "SEO audit
fixes (2026-10-04)" below.

**Cross-linking is structural, not a per-post content task.** `src/pages/blog/[slug].astro` renders a
"Related reading" section under every post automatically: it scores every other published post (same
`category` +10, each shared `tags` entry +3), takes the top 3, and renders them as clickable cards
(thumbnail, date, title) using the same reveal/tilt conventions as the rest of the site. A new post needs no
manual related-links work, correct `category` and `tags` in its frontmatter are what drive good matches, so
get those right rather than trying to hand-pick related posts in the body.

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

**5 more posts added 2026-09-15**, spread across 5 of the 7 categories (Industry Insights, Autonomous
Decisions, Customer Service, Shipping & Logistics, Quality Monitoring) rather than another full per-category
batch: "What Supply Chain Visibility Actually Means," "Safety Stock: How Much Buffer You Actually Need,"
"First Contact Resolution for Wholesale Support," "Freight Class: What It Is and Why Rates Change," and "The
CAPA Process for Supplier Quality Issues." Same pipeline as every prior batch (competitor-gap research,
`services.ts` accuracy check, 5+ body links, 3+ FAQ links), dated 2026-09-05 through 2026-09-13 continuing
the archive's existing every-other-day cadence with no adjacent same-category accent-color repeats. The
catalog is 40 posts across 7 categories as of this batch. One accuracy check worth repeating: the CAPA post's
closing tie-in had to be written carefully to say Quality Monitoring flags the defect pattern and supplies
the supplier scorecard data a CAPA's root-cause step would use, not that it runs the CAPA process itself,
since `services.ts` doesn't describe any corrective-action-workflow capability.

**5 more posts added 2026-09-20**, one keyword target per post, picked from a real gap analysis against the
existing 40-post archive (no topic overlap) plus live competitor-article validation via WebSearch before
writing (real top-ranking H2/H3-structured articles, not vendor homepages), same as every prior batch:
"Inventory Cycle Counting: The ABC Method" (Inventory Management), "Three-Way Matching for Purchase Orders"
(Supplier Management), "Economic Order Quantity (EOQ), Explained" (Autonomous Decisions), "Reducing Where's
My Order Support Tickets" (Customer Service), and "Landed Cost: The Full Formula" (Shipping & Logistics),
dated 2026-09-22 through 2026-09-30 continuing the every-other-day cadence with no adjacent same-category
accent-color repeats. The catalog is 45 posts across 7 categories as of this batch. The WISMO post
(`reducing-wheres-my-order-support-tickets.md`) deliberately covers different ground than the existing
`wheres-my-order-is-a-supply-chain-question.md`: the older post frames order-status questions as a data-
visibility problem, this one is about concrete ticket-*volume*-reduction tactics, and each links to the
other rather than duplicating it. Same accuracy discipline as every batch: the landed-cost post's product
tie-in is careful to say Flowbound doesn't calculate customs duties or import paperwork, only that Shipping
Optimization keeps the freight component of landed cost down and Pricing adjusts sell price when costs
shift, since `services.ts` describes no customs/duty-calculation capability.

**5 more posts added 2026-10-18**, dated 2026-10-02 through 2026-10-10 (every-other-day cadence continued
from 2026-09-30), topics chosen from a gap check against all 45 existing posts plus a WebSearch pass on each
keyword (top results were vendor blogs and glossaries, so a worked example plus a real formula can compete;
no search-volume data was available, so keywords are informed picks, not measured): "Inventory Turnover
Ratio, Explained" (Inventory Management, Ryo Shibata), "Supplier Scorecard: Metrics and Weights" (Supplier
Management, Muhammad Hassan), "Dimensional Weight: How Carriers Bill Parcels" (Shipping & Logistics,
Muhammad Ali), "AQL Sampling for Incoming Inspection" (Quality Monitoring, Ryo Shibata), and "The Real Cost
of a Stockout" (Industry Insights, Muhammad Hassan). The catalog is 50 posts across 7 categories as of this
batch; the next post (51st) goes to Muhammad Ali in the author round-robin. Each was checked by script
against the standing rules (title + `| Flowbound` under 60, description under 155, excerpt under 69, 5+ body
links, 3+ FAQ links, no em dashes, every internal link resolving) before `astro build`. Each differentiates
from a neighbor rather than duplicating it (turnover owns the formula, not the dead-stock definitions;
the scorecard post is the how-to-build version of the "suppliers already have a quality track record"
argument; DIM weight is the parcel counterpart to freight class; AQL covers the sampling decision, not
whether to inspect; stockout cost prices the problem safety stock solves). Accuracy notes worth repeating:
the AQL post's tie-in says Inspection Tracking logs and flags results but Flowbound does not set sampling
plans, the DIM weight post says Shipping Optimization compares carriers but does not calculate dimensional
weight, and the scorecard post credits Quality Monitoring's existing "Supplier Quality Scorecards"
capability for the data. **Two things to verify by hand, not independently confirmed**: the AQL post's
sample-size code letter K / 125-unit sample and accept/reject numbers (written from memory of ISO 2859-1 /
ANSI Z1.4, the post tells readers to verify against the standard), and the 139 divisor in the DIM weight post
(framed as a common example, since search results disagreed on UPS). The stockout post's expedite cost and
attrition figures are labeled assumptions. No SVG diagrams were built for this batch (turnover, DIM weight,
and the stockout timeline were identified as good candidates, deferred).

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
six-section template: hero, what it is, what it does, what it watches, how it works, FAQ, CTA. Whole-service
narrative pages (`/ask-flowbound`, `/customer-service`, `/quality-monitoring`) and one-off pages
(`/product`, `/how-it-works`) have inline content in the page file rather than being data-driven, since
they're one-off pages rather than a repeating list of similar items. Don't try to generalize them into
`services.ts`.

**FAQ section added 2026-09-13** (was a five-section template with no FAQ before this; see
`seo_audit_2026_09.md` in memory, P2). Each page's frontmatter has its own `faqs` array (4 question/answer
pairs, plain text, no inline links, written from that page's own `capabilities`/`signals`/`steps` content
and `services.ts`'s actual capability description, never invented or extrapolated) rendered as a
`<section id="faq">` between "how it works" and `<Cta />`: stacked bordered blocks
(`border-ocean-700/20 bg-ocean-100`), each `data-reveal`/`reveal-item` only, no tilt, on an `ocean-200`
background matching the "capabilities" section's tone to keep the page's light/dark alternation going. The
same `faqs` array also builds an `FAQPage` JSON-LD block (`mainEntity`, same shape as the blog's), appended
to the page's existing `Service` schema via `schema={[schema, faqSchema]}` (`Seo.astro`'s `schema` prop
already accepts an array). Unlike the blog's FAQ schema, this isn't parsed from Markdown, there's no content
collection here, the array is just written directly in the page frontmatter like `capabilities`/`steps`
already are. `/pricing`'s FAQ opens with a direct disambiguation question ("Is this page about what
Flowbound costs?"), same reasoning as its keyword-rewritten title: this page is the autonomous repricing
capability, not what Flowbound itself costs to use. **A new capability page should ship its FAQ section from
day one, following this same pattern**: 4 real Q&A pairs grounded in that page's own content, no invented
capabilities, no inline links in the answer text (keeps the visible copy and the schema text identical,
no separate plain-text stripping step needed the way the blog's `parseFaqFromMarkdown` requires).

**Breadcrumbs added 2026-09-13** to all 10 capability/narrative pages (the 7 dedicated capability pages plus
`/ask-flowbound`, `/customer-service`, `/quality-monitoring`), fixing a gap the SEO audit found: only blog
posts had `BreadcrumbList` schema before this, and even there it was schema-only, no visible trail existed
anywhere on the site. `src/lib/breadcrumbs.ts`'s `buildBreadcrumbSchema(items, siteUrl)` and
`src/components/Breadcrumbs.astro` both take the same `items: {name, path}[]` array, one source of truth for
a page's trail feeding both the visible UI and the schema so they can't drift apart. Each page defines its
own `breadcrumbItems` (`Home > Services > <page>`, a real 3-level trail, unlike the blog's existing
2-level `Blog > post title` one, which wasn't touched, out of scope here) and renders `<Breadcrumbs
items={breadcrumbItems} />` at the top of the hero, above the existing icon+label eyebrow row, plus appends
`breadcrumbSchema` to the page's `schema` array. **A new capability or narrative page should do the same
from day one**: define `breadcrumbItems` for its place under `/services`, render `<Breadcrumbs>` in the
hero, and add `buildBreadcrumbSchema(...)` to its schema array.

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

### Hero animations on mobile (2026-09-20)

**Real bug, not a style choice: every one of the fourteen hero animations (the twelve canvas heroes above,
plus the homepage and `/product` WebGL ones) was drawn assuming a desktop layout where hero copy stays
confined to roughly the left 55-58% of the section, leaving the right side clear.** Below `md`, hero copy
runs the section's full width instead (no dedicated column reserved for it, see every hero's own `h1`/`p`
`max-w-*` classes, none of which are small enough to actually constrain width at a phone viewport), so the
same right-side composition ended up sitting directly under the text instead of beside it: a hub icon
overlapping specific words (`/ask-flowbound`'s spark sat directly on top of "calendar"), particle fields
scattered through paragraph copy (`/product`'s "Convergent Signals"). Caught from a user screenshot, not
proactively.

**Fix: a shared `.hero-canvas-chip` CSS class (`src/index.css`), applied to every one of the fourteen hero
canvases, shrinks the whole animation into a small round chip below `md` instead of trying to redesign each
of the fourteen bespoke compositions' internal geometry for a narrower strip** (which full-width copy would
still cross into). The chip sits in the section's own bottom padding (`py-20`/`pb-20` = 80px), real empty
space on every one of these pages by construction: flexbox padding is never consumed by overflowing
content, regardless of how tall the copy block gets, so this is a hard geometric guarantee the same way the
original desktop `CLIP_XF` clip was, not a percentage tuned by eye. `object-fit: cover` crops into each
composition's own focal point (`--hero-focal`, a CSS custom property set inline per component, matching that
script's `HUB_XF`/`HUB_YF` or equivalent) rather than shrinking the whole scene down to illegibility. At
`md`+ the class resets to the original full-bleed behavior, unchanged. Critically, **none of the fourteen
scripts' own draw/resize logic needed to change**: every one already measures the section (not the canvas
element) for its internal math, so shrinking the canvas element's own CSS box via `object-fit` is a pure
presentation change, decoupled from the drawing coordinate system. The two WebGL heroes' oversized ambient
glow layers (`ProductBackground.astro`'s `.hero-hub-glow`, `HeroBackground.astro`'s `.hero-streak`), both
independent full-bleed decorative elements positioned for the same desktop-only assumption, are hidden below
`md` for the same reason rather than also being chip-ified (a 26rem blur glow doesn't scale down
meaningfully into a 60px circle).

**The homepage got a bigger, content-aware treatment on top of the base chip, at the user's explicit
follow-up request ("is there no way to have my hero animations on mobile, at least for the homepage").**
`/` (and `/product`, `/services`, though the latter has no canvas hero) use `min-h-screen-nav` +
`justify-start` rather than the twelve canvas heroes' content-driven `min-h-[560px]`, which means the
section is pinned to the *full viewport height* with copy pinned to the *top*, leaving real, often
substantial (200px+), empty space below the buttons on a typical phone, not just the guaranteed-but-thin
80px padding strip. `src/scripts/heroWave.ts`'s existing `resize()` now also measures the real bottom edge
of the button row live (`data-hero-copy` on that row in `Hero.astro`) and exposes it as `--hero-copy-bottom`
on the section; `HeroBackground.astro` uses that to override `.hero-canvas-chip`'s mobile geometry (via a
higher-specificity `#hero-wave` id selector, scoped inside its own `@media (max-width: 767px)` block so it
never touches the desktop rule) into a full-width rounded band starting just below the buttons, rather than
a small fixed corner chip. This scales with whatever room actually exists on a given device instead of a
guessed percentage: verified at ~358×209px on an iPhone 13, ~396×317px on a Pro Max, and gracefully down to
a thin ~40px sliver (never negative, never overlapping) on an iPhone SE or a short landscape phone, where
content height leaves only the guaranteed 80px padding available, same floor the base chip relies on
everywhere else. **This bigger treatment is homepage-only for now**, scoped the same deliberate way every
other homepage-specific exception in this file is (`/product` shares the identical `min-h-screen-nav`/
`justify-start` layout shape and could reuse the same technique, but wasn't asked for yet, don't extend it
there without being asked, same standing rule as everything else in the "Homepage" section above).

### Site-wide UI refinement (2026-09-20)

At the user's request, the homepage was benchmarked against an external reference site (sunstice.com) for
"sharpness" and polish, not to copy its colors or layout (explicitly ruled out) but to identify what was
actually producing that feel, then translate the applicable parts into Flowbound's own identity. Inspecting
the reference's actual code (not just screenshots) turned up a useful fact worth remembering before treating
any polished site as requiring heavy tooling: it runs no animation framework at all (no GSAP, no Lenis, no
ScrollTrigger, just Webflow's native interactions), and its main visual lever was disciplined typography
(a distinctive display font, tight tracking) plus a genuinely restrained, thin-bordered card language, not
JS sophistication. That meant this site's existing vanilla-JS/Canvas approach was already fully capable of
matching it; the gap was in restraint and craft, not capability. Three changes came out of this, first
piloted on the homepage, then (on explicit request) extended to every page on the site:

**Pill buttons are now the only button shape on the site.** The old two-shape system (`rounded-md` square-ish
default, `rounded-full` pill reserved for "featured hand-off" CTAs, see `BRAND_GUIDELINES.md`) is gone.
Every button, everywhere, including `Nav.astro`'s CTA, `Cta.astro`'s two buttons, every page's hero CTAs, and
the blog's hero CTAs, is now `rounded-full`. The **only** remaining `rounded-md` anywhere in `src/` is the
blog post card's small category-icon token background (`src/pages/blog/[...page].astro`), which was never a
button and wasn't touched. `BRAND_GUIDELINES.md`'s "Buttons" section and its Layout-principles corner-radius
bullet need to reflect this if you're reading this before checking there; don't reintroduce `rounded-md` on
a new button without being asked, that's a reversed convention now, not an inconsistency to "fix."

**Headline tracking tightened site-wide.** `tracking-tight` (Tailwind's `-0.025em`) became `tracking-tighter`
(`-0.05em`) on every H1 and H2 across every page, plus Mission's headline-equivalent statement paragraph.
`/404` was deliberately excluded, same as every other pass in this file, it's still on the original
`fb-*`/Satoshi system and was never brought into any of this scope. The homepage Hero's H1 also picked up a
size bump (`3rem` → `3.35rem` at the `md` breakpoint) for more contrast against its small eyebrow line; that
resize was specific to that one composition and wasn't applied to any other page's H1, only the tracking
change was rolled out universally. A new headline anywhere on the site should default to `tracking-tighter`
going forward, not `tracking-tight`.

**Thin-border cards replaced `tilt-card` almost everywhere.** The cursor-follow 3D tilt (`data-tilt`, driven
by `src/scripts/cardTilt.ts`) plus solid tinted fill plus bottom accent-line hover-sweep, used on every
simple icon/number + heading + short-text card grid site-wide, was replaced with a flatter treatment: a
plain thin border sitting directly on the section's own background (transparent at rest, no separate tinted
panel), a hover-only border-darken plus faint background-tint, no tilt, no accent-line sweep. Converted:
homepage's `ProductSystem.astro`/`HowItWorks.astro`, all 7 dedicated capability pages' "capabilities" and
"how it works" step grids, all 3 whole-service narrative pages, `/product`, `/how-it-works`, and
`/services`' tone-based card system (`toneStyles.paper/white/dark.card` in `services.astro`, now defined
centrally there rather than per-instance, along with the two `data-tilt` usages and the two `accentLine`
divs it drove, all removed). The now-dead `cardTilt` script import was removed from every one of those
files. Homepage's `WhyUs.astro` had already been converted earlier in the same session as the initial
one-grid trial; this extended the same treatment to everywhere else that matched its pattern.

**`cardTilt.ts` is still real, actively-used code, not dead after this**, don't delete it or assume every
`tilt-card` reference is legacy. The blog's post-card grid (`src/pages/blog/[...page].astro`) and its
"Related reading" cards (`src/pages/blog/[slug].astro`) deliberately kept the original tilt-card treatment.
Those aren't the same kind of card this pass was flattening: they're a different, more bespoke design
(category-accent 3px top border, tinted icon token, date/read-time footer) from the "Card design, redone
2026-09-13" pass documented under "Blog" above, and converting them to the thin-border style would have
undone real, previously-approved, considered work for no reason connected to this pass's actual goal. If
the thin-border treatment ever needs to reach the blog's post cards too, that's a separate, explicit ask,
not an extension of this one.

**New scroll-scrubbed statement section, in `Mission.astro`.** The homepage's Mission section's headline
statement ("We're built for small and local businesses, period...") now splits into individually
scroll-scrubbed words via a new `src/scripts/missionScroll.ts` (same `watchScrollProgress` pattern as
`heroScroll.ts`, setting a `--mission-scroll` custom property consumed entirely in CSS `calc()`/`color-mix()`,
no per-frame JS style writes beyond the one property). Each word's color ramps from a dim to a fully-emphasized
state as the section scrolls through view, reversible scrolling back up like every other animation on this
site. The reveal is deliberately compressed into roughly the first 20% of the section's own scroll-through
(`--reveal-span: 0.2` on `.statement-line`), not spread across the whole section: the statement line sits
close to the section's top, so a reveal timed to the section's full height would still be finishing after
the line had already scrolled up under the sticky nav, invisible to the reader by the time it completed.
**Any future scroll-scrubbed effect on a short element near the top of a section needs this same compression**,
don't assume the section's full scroll-through is a safe timing budget for content that isn't near its
bottom.

**A real WCAG contrast bug was found and fixed while building the above, worth knowing before dimming text
toward a light background anywhere else.** The first version dimmed unrevealed words via `opacity` (fading
toward Mission's `ocean-200` background). Real contrast math on the actual shipped values showed the dim
state measured only 1.4:1, nowhere near the 4.5:1 AA minimum, genuinely unreadable, not just "a little
low." Getting it legible via opacity alone would have needed roughly 85%+ opacity as the *minimum*, leaving
almost no visible range for a dim/bright effect at all. Fixed by switching to `color-mix()` between two
already-legible solid colors instead of fading toward the background: `ocean-900` (`#166088`, 4.55:1
against `ocean-200`) for the dim/unrevealed state, `ocean-950` (`#104866`, 6.50:1, the same color the rest
of the section's body text already uses) for fully revealed. Contrast now stays above AA at every point
along the transition, not just at the two endpoints. **General rule, extending [[contrast_compliance]]'s
existing ones: fading text opacity toward a light background is not a safe way to create a "dim but still
legible" visual state, the blended pixel necessarily drifts toward the background color as opacity drops.
Use a real color transition between two colors independently checked for contrast instead, never assume a
partial-opacity state is legible just because full opacity was.**

**New `TrustBar.astro`**, a compact 3-tile strip between `Hero` and `ProductSystem` on the homepage, using
the new thin-border card style on a dark `ocean-900` background (extending the hero's dark moment by one
more section before the page goes light for `ProductSystem`). This is standing in for what the reference
site used stat tiles (client count, years, a rating) for, but Flowbound has no real numbers like that yet,
it's still pilot-stage per `Cta.astro`'s own copy ("onboarding a small group of business pilots right
now"), and this project's accuracy rule against inventing capability claims applies equally to inventing
company stats. The three tiles are short honest phrases instead, each already backed by existing copy
elsewhere on the page rather than a new claim: "Free pilot" (mirrors Hero's CTA), "Days, not months"
(mirrors `WhyUs`), "Reasoning included" (mirrors `ProductSystem`'s Consulting Wrapper tile). **Revisit with
real stat tiles once there are real pilot/client numbers to report**, don't fill this slot with invented
numbers in the meantime.

**Follow-up fix, same week: scroll-reveal trigger point was measurably too late, most noticeable scrolling
slowly.** The user reported a real, reproducible symptom: scrolling slowly (either direction) showed a
stretch of empty/unrevealed content sitting visible on screen before it "loaded all at once." Root cause
was `src/scripts/scrollReveal.ts`'s single shared `IntersectionObserver`, the mechanism behind every
`.reveal-item`/`.reveal-slide`/`.reveal-scale`/`.reveal-clip` element on the site: it required 20% of an
element's own height visible (`threshold: 0.2`) inside a viewport already shrunk 10% from the bottom
(`rootMargin: "0px 0px -10% 0px"`) before revealing. Measured empirically (scripted incremental scroll,
checking `getBoundingClientRect()` against `.is-revealed`, not just theorized) at a real **~140px dead
zone** between an element's top edge crossing the actual screen bottom and the reveal actually firing. At
normal scroll speed that gap crosses in well under a second and goes unnoticed; scrolled slowly, the same
138px takes seconds, reading as a stall, and a whole grid row sitting at nearly the same scroll position
means several cards cross that delayed threshold together, reading as a sudden batch. Fixed by dropping to
`threshold: 0.05, rootMargin: "0px"`; re-measured after the change at 6-13px across several different
elements and pages, and confirmed symmetric for the scroll-up re-entry-from-top case too. Not pushed to
literal 0: a small buffer avoids flicker from sub-pixel scroll jitter, and triggering before an element is
even visible would make the reveal invisible rather than just less delayed. `watchScrollProgress`-based
effects (Hero's fade/zoom, Mission's scroll-scrub, `/how-it-works`' scroll-driven comet) were checked and
don't have this problem, they're continuous/position-driven, not threshold-toggled, so they didn't need
touching. **If a future animation feels "delayed" or "batchy" specifically at slow scroll speeds, measure
the actual trigger gap in pixels (scripted scroll + state inspection) before guessing at a fix**, the
theoretical rootMargin/threshold math and the empirical measurement agreed here, but confirm rather than
assume next time too.

### Logo dark-mode outline and dual favicon (2026-09-20)

The founder shared the real source mark (`src/assets/logo.png`) for a fresh look at recoloring it; turned
out to be a request worth acting on for a real reason, not just a repaint. Comparing options in a
side-by-side artifact (light-mode candidates, dark-mode candidates, a favicon-size check, full lockup
previews, all with real computed WCAG contrast numbers rather than eyeballed) surfaced a genuine bug: on
the footer's `ocean-900` background, the ocean-palette mark's gradient stop and the background are the
exact same hex, `1.00:1` contrast, so the mark's right edge was invisible there, not just subtle. The user
picked "Ocean Classic" (today's live colors, unchanged) for light placements and "Ocean Outlined" for dark
ones over a full recolor: `LogoMark.astro` gained a `ring` prop (a thin `ocean-100` circle, `r="98"`,
`stroke-width="4"`, off by default) that defines the silhouette without touching the brand's actual fill
colors; `LogoLockup.astro` passes `ring={dark}` so Footer picks it up automatically and Nav is byte-for-byte
unchanged, confirmed with a real Playwright screenshot, not just "the code looks right." `public/
favicon-dark.svg` (the same ring treatment) is now served alongside the existing `favicon.svg` via two
`<link rel="icon">` tags in `BaseLayout.astro`, split on `media="(prefers-color-scheme: light/dark)"`, so a
browser with dark tab chrome gets the outlined version with no JS involved. `public/logo-mark-ocean-dark.svg`
is the same ring treatment as a standalone file, mirroring the existing `logo-mark-ocean.svg`. See
`BRAND_GUIDELINES.md`'s Logo section for the full contrast numbers and the file-by-file breakdown.
**Any future dark-background placement of the mark should pass `ring`, not a recolor.**

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

### SEO metadata length limits

**Every page's `description` prop (`Seo.astro`) must stay at or under 155 characters, no exceptions.**
Google reliably renders roughly 155-160 characters of a meta description before truncating it mid-sentence
or discarding it entirely for its own auto-generated snippet, so anything longer than that is dead weight:
copy nobody actually sees in search results. This was already the rule for blog posts (see "Blog" above,
the SEO content pipeline caps descriptions under 155 as part of the standard process), but the 14 static
pages in `src/pages/*.astro` (every one except `/404`) were written before that rule existed and all
exceeded it, some badly (`/product` ran 257 characters, `/services` 250). Fixed 2026-09-13 as part of an
SEO audit; see `seo_audit_2026_09.md` in memory for the full before/after. **When writing or editing any
page's `description`, count the characters before committing to it**, don't eyeball it: a description that
reads fine in the source can still be 40+ characters over budget once you actually count.

Title tags have the 60-character equivalent limit already enforced by the blog pipeline; that rule now
applies to every page's `title` prop too, not just blog posts.

**Titles name the actual keyword, not just the page's internal short name.** Before 2026-09-13, every
non-homepage page followed a bare "X | Flowbound" pattern (`/reorder` and `/pricing` were 19 characters
each), using a fraction of the 60-character budget and never naming what a searcher would actually type.
Rewritten to include a real keyword phrase while staying under 60 characters, e.g. `/reorder` is now
"Automated Reorder Point Software | Flowbound" (44 chars), `/pricing` is "Automated Repricing Software |
Flowbound" (40 chars, "Automated Repricing" rather than bare "Pricing" specifically to avoid reading as
"what Flowbound costs" instead of the actual autonomous-repricing capability). `index.astro`'s title was
already keyword-forward and wasn't touched. **A new page's title should follow this same pattern from the
start**: name the real keyword/benefit, not just the page's short internal name, while respecting the
60-character limit above.

### Sitewide Organization and WebSite schema

`Seo.astro` unconditionally prepends `Organization` and `WebSite` JSON-LD ahead of whatever
page-specific `schema` prop is passed in, so every page (down to `/404`) carries one shared brand
entity instead of leaving Google to infer "Flowbound the company" from scattered fragments. Added
2026-09-13. No `sameAs` (no real social profiles exist anywhere in the codebase, don't add
placeholder links just to fill the field) and no `SearchAction`/sitelinks searchbox (`blogFilter.ts`'s
search is client-side only and never reflects its query in the URL, so a `SearchAction` would claim a
capability that doesn't actually work; that would need wiring the search box to a real `?q=` URL
first, a separate change).

`Organization.logo` points at `public/logo-mark-ocean.svg`, a new static file, not an existing one:
`favicon.svg` turned out to be an unrelated purple abstract mark (not the brand at all, likely a leftover
from a much earlier concept), `public/logo-mark.svg` is a static export of the real comma-mark shape but
in the pre-rebrand "fb" palette (green/black), and `src/assets/logo.png` is unused specifically because it
can't be recolored without a re-export (see "Homepage" above) and would get a content-hashed, unstable
filename if referenced from `src/assets/` anyway. `logo-mark-ocean.svg` is `LogoMark.astro`'s
`palette="ocean"` output hand-exported to a standalone file (same path data, same hex values:
`#104866`/`#4A6FA5`→`#166088`/`#DBE9EE`), so schema, and anything else that needs a static logo URL,
points at something that actually matches the current brand. **If `LogoMark.astro`'s ocean colors ever
change, update this file to match by hand**, they're not derived from one shared source.

`favicon.svg` itself was also replaced with the same mark/palette (previously the same unrelated purple
shape mentioned above, an existing bug independent of this SEO pass, fixed while already in this file).

### SEO audit fixes (2026-10-04)

A fresh best-practices SEO/technical audit (not benchmarked against named competitors, by explicit choice)
turned up 12 findings; the 3 flagged critical were fixed one at a time with approval between each, 2 of the
3 shipped to prod, the third deliberately deferred:

- **Astro upgraded `7.1.3` → `7.3.5`**, closing the critical AVIF-optimization RCE flagged back in the
  2026-09-13 audit and left open since (see the "Blog" section's OG-image paragraph above). `npm audit`
  confirms `astro` no longer appears in the report at all (critical count: 1 → 0). Verified with a clean
  `astro check` (0 errors/warnings/hints) and `astro build` (same 154 pages), plus a real Playwright
  screenshot of the homepage and `/product` WebGL heroes and a blog post to confirm no visual regression
  from the version bump. No app code changed, only `package.json`/`package-lock.json`.
- **Sitemap now carries a real `<lastmod>` on every one of its 64 URLs**, via a `serialize()` function in
  `astro.config.mjs`. Before this it had none. Three sources, each chosen to be an honest "this actually
  changed" signal rather than a blanket build-time stamp (which would falsely tell Google every page
  changed on every deploy): blog posts read `updatedDate ?? publishDate` straight off their own frontmatter
  (parsed directly off disk at config-eval time, since `astro:content` isn't available yet that early);
  `/blog/` and its pagination pages use the most recent post's date, since a new post is what actually
  changes those listings; static pages use `git log -1 --format=%cI` against that page's own source file.
  **If a new top-level static page is added under `src/pages/`, add it to `astro.config.mjs`'s
  `staticPageFiles` map too**, or it silently ships with no lastmod.
- **No analytics (GA4) is still deliberately unresolved**, same blocker as the 2026-09-13 audit: no
  Measurement ID yet. User explicitly chose to skip it this round and ship the other two criticals to prod
  without it rather than wait. Pick this up the same way described in `seo_audit_2026_09.md`: ask for the
  GA4 Measurement ID first, the code change itself (one script in `BaseLayout.astro` plus a conversion event
  on "Request a pilot") is small.

Of the remaining 9 findings, three P1s were picked up and fixed in later sessions, all still 2026-10-04:

- **`heroWave.ts`/`productHeroWave.ts` now dynamically `import("three")` instead of a static top-level
  import**, so the ~500KB chunk is no longer bundled into `/`'s or `/product`'s eagerly-parsed initial
  script. Both scripts already had an `IntersectionObserver` that paused/resumed the render loop once
  loaded; that same observer now also triggers the one-time dynamic import on first intersection (both hero
  sections sit above the fold, so in practice the fetch kicks off within ~100ms of `DOMContentLoaded`, but as
  a separate async chunk request, not blocking the main script's parse/execution the way a static import
  does). A type-only `import type * as ThreeTypes from "three"` stays at the top of each file for type
  annotations (`BufferAttribute` casts) — this is fully erased at compile time and doesn't reintroduce a
  real module-graph dependency; the runtime namespace comes from the dynamic `import()` inside `start()`.
  Verified: `astro check`/`astro build` clean (154 pages), grepped `dist/index.html` and
  `dist/product/index.html` to confirm neither references `three.module*.js` directly anymore (no
  `<script>`/`modulepreload`), confirmed the compiled hero chunk contains the dynamic `import()` call, and a
  real Playwright run (two screenshots ~600ms apart, buffer-compared as different) confirmed both heroes
  still render and animate correctly end to end.
- **Named `Person` author + visible byline on all 45 posts**, replacing the generic `Organization` byline.
  See "Every post has a named `Person` author" under "Blog" above for the full detail (round-robin
  assignment, schema shape, the frontmatter convention a new post needs to follow).
- **8 posts got a real hand-built SVG diagram**, replacing the zero-images-across-45-posts finding for that
  subset. See "8 posts have a real hand-built SVG diagram" under "Blog" above for which posts, why those
  specific ones, and the convention (`public/blog/diagrams/`, numbers matched to the post's own worked
  example, no fabricated screenshots) a future post should follow.

Three more P2s were picked up in a later session, still 2026-10-04:

- **`prefetchAll: true` replaced with `prefetch: { defaultStrategy: "hover" }`** in `astro.config.mjs`.
  The site had grown to 154 built pages, each one eagerly firing a background prefetch request for every
  link it contained on page load; hover-triggered prefetch (Astro's own normal default when `prefetch` is
  enabled without `prefetchAll`) keeps the speed benefit for a link someone's actually about to click
  without the blanket eager-fetch cost. No per-link `data-astro-prefetch` attributes were added anywhere,
  so no page opted out of the new behavior by accident.
- **`/404` now passes `noindex` to `BaseLayout`**, closing the one page that had `Seo.astro`'s existing
  `noindex` prop available and simply never used it (see "Tag pages... noindex" under "Blog" above for the
  other existing user of this same prop).
- **`npm audit fix` (non-force) run**, clearing 7 of the then-14 findings (`baseline-browser-mapping`,
  `browserslist`, `devalue`, `fast-uri`, `http-cache-semantics`, `nanoid`, `postcss`) via lockfile-only
  patch bumps, no `package.json` version changes. `astro check`/`astro build` confirmed clean afterward
  (0 errors/warnings/hints, still 154 pages). The remaining 7 (the `braces`/`chokidar`/`micromatch`/
  `fast-glob` chain under `tailwindcss`, and `fflate` under `satori`) both only have a `--force` fix
  available, each a real breaking version bump (`tailwindcss@4`, a `satori` downgrade to `0.32.0`) that
  needs its own tested migration, not something to force through as part of a routine audit pass. Same
  discipline as the original `satori`/`fflate` finding noted under "Blog" above: both packages are
  build-time-only tooling (never shipped to the browser), so this is real debt worth a dedicated session,
  not a live-site risk in the meantime.

Of the 12 original findings, 3 P1s and these 3 P2s are now fixed. The remaining 6 (no About/Team page, the
other 37 blog posts still have no embedded image, the `tailwindcss`/`satori` npm audit chains just
described, no security response headers, no `sameAs` social links) are open and unscheduled. Full detail on
all 12, including what's already strong, is in the audit artifact linked from that session.

### Structured data: one `SoftwareApplication`, everything else is `Service`

**Only `index.astro` should ever emit `SoftwareApplication` JSON-LD.** Before 2026-09-13, 14 separate
schema blocks across the site (13 full pages plus one `agentSchema` constant embedded inside
`services.astro`) each declared their own `SoftwareApplication` with a different `name` ("Demand
Forecasting", "Reorder", "Ask Flowbound"...), none carrying the properties Google expects on that type
(`operatingSystem`, `offers`). To a search engine that read as 14 distinct, incompletely-described software
products; Flowbound is one product with capabilities, not fourteen products. Fixed 2026-09-13 (see
`seo_audit_2026_09.md` in memory):
- `index.astro` keeps `SoftwareApplication`, unchanged, it's the one authoritative entity for the whole
  product.
- `product.astro` dropped its schema block entirely rather than duplicating the homepage's entity with no
  shared identifier. `Seo.astro`'s `schema` prop is optional, a page doesn't need one.
- Every other page that used to claim `SoftwareApplication` (the 7 dedicated capability pages,
  `/how-it-works`, `/ask-flowbound`, `/customer-service`, `/quality-monitoring`, plus `services.astro`'s
  embedded `agentSchema`) now emits `Service` instead: `serviceType`, `name`, `description`, `provider:
  { "@type": "Organization", name: "Flowbound" }`, `audience`, the exact shape `services.astro`'s own
  `services.map(...)` array already used correctly. **A new capability or narrative page should copy this
  `Service` shape from day one**, never `SoftwareApplication`, that type is reserved for the homepage only.

## Deployment

Served from `https://www.flowbound.ai` on Vercel (the bare apex `flowbound.ai` 308-redirects to it on every
path, see "SEO and canonical URLs" above), connected to `MuhammadAli0297/flowboundai` on GitHub. Every push
to `main` auto-deploys to production; no environment variables required. Split commits by concern
(feature/bugfix/docs) rather than bundling unrelated changes.

**Standing rule, added 2026-09-20: `README.md` gets reviewed as part of any deploy that changes something
it describes**, not just when asked separately. The repo is public for portfolio purposes (see the
README's own "License" section), so it's the first thing a visitor sees, and a stale one undersells or
misrepresents real work the same way a stale doc anywhere else would. Before pushing a deploy, check
whether the change affects anything the README states as fact: page/post/category counts, the tech stack
table, the "Engineering highlights" list, the screenshot, or any specific convention it describes (button
shape, card treatment, etc.). If it does, update the README in the same push, don't let it drift and
catch up later. A screenshot only needs regenerating when the change is visually significant enough that
the current one would look wrong or misleading next to the live site, not for every deploy.

**Standing rule, added 2026-09-20: "push and deploy" means three things happen
together, every time, not just a `git push`:**
1. **Every markdown doc touched by the session's changes gets reviewed and updated in the same push**, not
   just `README.md`. That now explicitly includes `CLAUDE.md` (this file, append the session's work under
   the relevant section before pushing) and `BRAND_GUIDELINES.md` when a change affects anything it
   describes. This is a review-and-update pass done as part of staging the push, not a hard gate that stops
   and asks first, apply judgment the same way the README rule already does (a docs-only typo fix doesn't
   need a highlights-list entry; a new content batch or a new sitewide convention does).
2. **The public GitHub repo (`MuhammadAli0297/flowboundai`) gets the new code pushed.**
3. **A deploy actually happens**, and "stage" and "prod" are two different, deliberate destinations, not
   interchangeable words:
   - **Stage** = push the work to a non-`main` branch and open a PR (`gh pr create`). Vercel's existing
     GitHub integration auto-generates a Preview deployment for that branch/PR with no extra config, no
     second Vercel project, and no vercel.json. That preview URL is "stage." `main` is untouched, so
     production is not affected.
   - **Prod** = merging that PR's branch into `main` (or pushing straight to `main`), which is what
     actually triggers the live `www.flowbound.ai` deploy. This still only happens on an explicit
     later go-ahead, never automatically just because a stage push went out, matching the pre-existing
     "work locally, deploy only on an explicit ask" default this project has followed since its first
     production push (see the `deployment_reference` memory).

There is no separate staging *environment* (no second domain, no dedicated Vercel project) and none should
be silently created; "stage" is the branch-PR-preview flow above unless the user explicitly asks for a real
dedicated staging environment as its own infra task.

**User habit, noted 2026-09-20: after a prod deploy, the user closes the current session and starts a new
one.** This isn't an action for Claude to take (a session can't close itself), just context: don't expect a
long-running session to continue seamlessly past a "deploy to prod" instruction, and don't be surprised if
the next message arrives in a fresh session with no memory of this one beyond what's saved to project
memory and `CLAUDE.md`. Doesn't apply to a stage/preview push, only prod.
