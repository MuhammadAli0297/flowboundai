import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"

export default defineConfig({
  site: "https://flowbound.ai",
  output: "static",
  integrations: [sitemap()],
  prefetch: {
    prefetchAll: true,
  },
})
