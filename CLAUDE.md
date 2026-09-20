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
