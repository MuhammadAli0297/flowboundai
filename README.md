# Flowbound Landing Page

Vite + React + TypeScript + Tailwind. See `BRAND_GUIDELINES.md` for palette, type, logo usage, and the
copy rules (short version: no em dashes, ever, and keep the tone warm and human).

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints (defaults to http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # serve the production build locally
```

## Deploying later (Vercel)

Not deployed yet, by design. When you're ready, push this folder to a GitHub repo and import it in
Vercel. It will auto-detect the Vite framework preset (build command `npm run build`, output directory
`dist`). No environment variables are required for the current static page.

## Structure

- `src/App.tsx`: page composition
- `src/components/`: Nav, Hero, FlowBackground, ProductSystem, HowItWorks, WhyUs, SapComparison, Mission,
  Cta, Footer, LogoMark, DecisionGraphic (currently unused, kept in case you want a boxed diagram again)
- `tailwind.config.js`: brand color scale, fonts, radius
- `public/logo-mark.svg`: standalone logo mark, also used as favicon

## Known placeholders and things to double check

- The logo mark is a hand-recreated SVG based on the reference image you shared. Exact colors were
  estimated since no source file was available. Swap in your original logo asset if you have a vector
  file and want pixel-exact reproduction.
- The pilot request buttons in the closing CTA open a plain mailto link. Swap in a real form or CRM
  integration whenever you're ready to capture leads properly.
- Copy has been through a couple of passes now, but give it one more read before this goes live.
