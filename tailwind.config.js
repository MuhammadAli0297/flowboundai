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
        // Homepage-only palette (see palette source: coolors.co/4f6d7a-c0d6df-dbe9ee-4a6fa5-166088).
        // Additive namespace so the rest of the site keeps using fb-*; only Hero/ProductSystem/
        // HowItWorks/WhyUs/SapComparison/Mission/Cta reference these. 950 is a darkened derivative
        // of Baltic Blue (900), not one of the five source colors: at full strength Baltic Blue only
        // just clears 4.5:1 against Pale Sky (200), so body/heading text uses the darker 950 for a
        // real safety margin instead of relying on opacity tricks that would drop below AA.
        ocean: {
          100: "#DBE9EE", // alice blue
          200: "#C0D6DF", // pale sky
          500: "#4A6FA5", // smart blue
          600: "#4C6E92", // interpolated smart-blue -> blue-slate, button hover
          700: "#4F6D7A", // blue slate
          900: "#166088", // baltic blue
          950: "#104866", // darkened baltic blue, body/heading text only
        },
      },
      fontFamily: {
        display: ["Satoshi", "sans-serif"],
        body: ["Satoshi", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
        // Homepage + Nav + Footer + logo only, applied explicitly via `font-amulya`, see the
        // @font-face comment in src/index.css. Everywhere else keeps `font-display`/`font-body`.
        amulya: ["Amulya", "sans-serif"],
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
