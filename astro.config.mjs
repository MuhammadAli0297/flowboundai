import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"

export default defineConfig({
  site: "https://www.flowbound.ai",
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      // Tag pages are a lightweight cross-linking mechanism, not primary content: the ones with
      // enough posts to stay indexable are already reachable by crawl from the posts that link to
      // them, and the rest are noindexed anyway (see [tag].astro). Keeping either out of the
      // sitemap avoids asking Google to prioritize crawling pages that either aren't indexable or
      // don't need the discovery help.
      filter: (page) => !page.includes("/blog/tags/"),
    }),
  ],
  prefetch: {
    prefetchAll: true,
  },
})
