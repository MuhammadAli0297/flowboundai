import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"

export default defineConfig({
  site: "https://www.flowbound.ai",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  prefetch: {
    prefetchAll: true,
  },
})
