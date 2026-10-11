import typography from "@tailwindcss/typography"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        fb: {
          black: "#0A0A0A",
          ink: "#151714",
          green: {
            50: "#E6F2EE",
            100: "#C7E3DA",
            200: "#96C9B7",
            300: "#66AE95",
            400: "#468B79",
            500: "#005840",
            600: "#004838",
            700: "#003828",
            800: "#002A1D",
            900: "#001C13",
          },
          white: "#FFFFFF",
          paper: "#F6F5F0",
          line: "#22261F",
        },
        // Hot Sauce rebuild (see CLAUDE.md), "Bold": the second palette that rebuild used, the
        // first ("hot sauce", warm dark-green + orange) turned out to overlap with another site the
        // user runs (gogreenlit.com) closely enough to require a repick, not just a retint, since
        // the conflict was the hue family itself. Bold is a cool eggplant/mint direction with no hue
        // overlap with that site. Full rationale + contrast math worked out in the approved mockup
        // round. Now the sitewide default, used by every page except `/404`, which stays on `fb`/
        // Satoshi by explicit, standing decision (never in scope for either rebuild). The
        // intermediate `ocean` palette this one replaced (and `fb` carried, briefly, before that)
        // was removed from this file once every page finished migrating, 2026-10-11, the same
        // pattern this rebuild itself now follows for any future one.
        bold: {
          paper: "#EFF7F2", // pale mint-white, primary light background
          mist: "#C9EFE6", // derived pale mint tint, soft section/card fill, decorative only
          // Deepened from the user's literal #2A1F29 swatch at their request ("too pastel and
          // plain" after the glow got toned down) — same lightness/contrast margin, more actual
          // purple separation between channels (R46/G22/B48 vs the original's close-together
          // R42/G31/B41) so it reads as a real plum instead of a desaturated dark grey. Still 14.5:1
          // on paper, 10.6:1 against mint, both comfortably unchanged from the original.
          ink: "#2E1630", // plum, primary text + dark bookend sections
          "ink-deep": "#170B19", // derived, even darker, vignette/gradient edge only, not for text
          taupe: "#6E5A52", // secondary text/borders on light bg, clears 4.5:1 on paper, safe for small text too
          teal: "#6E9CA3", // dusty teal, tertiary accent (large text/non-text only on light; fine as text on ink)
          mint: "#8FE3D3", // bright mint, accent text/icon on dark ink bg (~10.6:1); too light for paper text
          "mint-deep": "#1A7A64", // derived, accent fill (pairs with paper text, ~4.8:1) and accent text on paper
        },
      },
      fontFamily: {
        display: ["Satoshi", "sans-serif"],
        body: ["Satoshi", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
        // Hot Sauce rebuild: Hanken Grotesk is the display/body face for every page except `/404`
        // (still `font-display`/`font-body`, Satoshi), Instrument Serif is an editorial accent used
        // sparingly (one emphasized word in a headline, pull-quotes). Applied explicitly via
        // `font-hanken`/`font-instrument`. Amulya, the previous rebuild's equivalent scoped display
        // face, was removed from this file (and its font files, and its @font-face declarations in
        // src/index.css) once every page that used it finished migrating to Hanken, 2026-10-11.
        hanken: ["Hanken Grotesk", "sans-serif"],
        instrument: ["Instrument Serif", "Georgia", "serif"],
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "2px",
        md: "3px",
        lg: "4px",
      },
    },
  },
  plugins: [typography],
}
