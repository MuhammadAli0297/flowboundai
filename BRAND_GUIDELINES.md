# Flowbound Brand Guidelines (v1)

## Copy rules (read this first)
No em dashes, ever, anywhere in this project. Not in headlines, body copy, button labels, code comments,
or documentation. If a sentence wants an em dash, rewrite it as two sentences, or use a comma, a period,
a colon, or "and" / "but" instead. This applies to every piece of text tied to Flowbound, not just the
homepage.

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
  - A single "featured" CTA that hands off to another page (e.g. the `Explore Ask Flowbound` button on
    `/services`, linking to `/ask-flowbound`) can be a fully rounded pill (`rounded-full`), by explicit
    design direction, to visually distinguish "go explore this other thing" from the site's normal
    square action buttons. Use sparingly, one per section at most, not as the new default button shape.
  Don't "fix" either of these back to square; they're intentional, not an inconsistency.
- No purple, no gradients beyond the subtle green gradient in the logo mark and the hero background glow.
- Secondary-page hero: full-bleed dark section with an animated line-art graphic, same "vibe" as the
  homepage hero, but each page gets its **own** graphic composition rather than reusing `FlowBackground`
  verbatim. Three exist so far: `ServicesOrbit.astro` for `/services` (a hub with capabilities orbiting
  it, vs. the homepage's signals converging from fixed sources), and `AskFlowboundBackground.astro` for
  `/ask-flowbound` (the `spark` `SectionIcon` itself, enlarged and slowly rotating, as the hub, trading
  bidirectional question/answer pulses with small chat-bubble nodes rather than converging or orbiting).
  Copy the pattern, not the file: same dark background, same green glow palette and pulse-ring motif,
  new composition each time.
- A "featured" CTA button that hands off to a deeper page (see the pill-button exception above) can use a
  left-to-right color-sweep hover instead of an instant color change: an absolute `inset-0` overlay in the
  darker shade, `scale-x-0 origin-left`, transitioning to `scale-x-100` on `group-hover`, clipped by the
  parent's `overflow-hidden` and rounded shape. This reads as more deliberate than a flat color fade and
  pairs well with the pill shape above; it's not meant to replace the flat hover fades used elsewhere.
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
- `src/components/icons/SectionIcon.astro`: small monoline section icons (crate, network, bolt, chat,
  shield-check, spark), used top-right of a section's text block on content pages
- `src/components/Seo.astro`: per-page title, description, canonical, OG/Twitter tags, and JSON-LD schema
- `src/layouts/BaseLayout.astro`: the shared page shell (nav, footer, font preloads, `<Seo>`), used by
  every page
- `tailwind.config.js`: full color scale, font families, radius scale
- `src/index.css`: base styles, `@font-face` declarations, shared utility classes (`.container-fb`,
  `.eyebrow`), motion keyframes
