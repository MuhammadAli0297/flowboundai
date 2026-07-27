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
      },
      fontFamily: {
        display: ["Satoshi", "sans-serif"],
        body: ["Satoshi", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
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
