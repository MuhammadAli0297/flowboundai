import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"
import { readdirSync, readFileSync } from "node:fs"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// Blog posts already carry their own editorial publishDate/updatedDate in frontmatter (the same
// dates rendered on the page), so that's the lastmod source for every /blog/<slug>/ URL, read
// straight off disk here rather than via astro:content (not available yet at config-eval time).
const blogDir = path.join(rootDir, "src/content/blog")
const blogLastmod = new Map()
let latestBlogDate = null
for (const file of readdirSync(blogDir)) {
  if (!file.endsWith(".md")) continue
  const slug = file.replace(/\.md$/, "")
  const text = readFileSync(path.join(blogDir, file), "utf-8")
  const publishMatch = text.match(/^publishDate:\s*"?([\d-]+)"?\s*$/m)
  const updatedMatch = text.match(/^updatedDate:\s*"?([\d-]+)"?\s*$/m)
  const dateStr = updatedMatch?.[1] ?? publishMatch?.[1]
  if (!dateStr) continue
  const iso = new Date(dateStr).toISOString()
  blogLastmod.set(slug, iso)
  if (!latestBlogDate || iso > latestBlogDate) latestBlogDate = iso
}

// Static pages have no frontmatter date to read, so lastmod comes from each source file's real
// last git commit date instead of a build-time stamp, which would falsely claim every page
// changed on every deploy regardless of whether its content actually did.
function gitLastmod(relPath) {
  try {
    const out = execSync(`git log -1 --format=%cI -- "${relPath}"`, { cwd: rootDir }).toString().trim()
    return out || null
  } catch {
    return null
  }
}
const staticPageFiles = {
  "/": "src/pages/index.astro",
  "/ask-flowbound/": "src/pages/ask-flowbound.astro",
  "/customer-service/": "src/pages/customer-service.astro",
  "/demand-forecasting/": "src/pages/demand-forecasting.astro",
  "/how-it-works/": "src/pages/how-it-works.astro",
  "/inventory-tracking/": "src/pages/inventory-tracking.astro",
  "/pricing/": "src/pages/pricing.astro",
  "/product/": "src/pages/product.astro",
  "/quality-monitoring/": "src/pages/quality-monitoring.astro",
  "/reorder/": "src/pages/reorder.astro",
  "/services/": "src/pages/services.astro",
  "/shipping-optimization/": "src/pages/shipping-optimization.astro",
  "/supplier-coordination/": "src/pages/supplier-coordination.astro",
  "/wholesale-account-management/": "src/pages/wholesale-account-management.astro",
}
const staticLastmod = new Map(
  Object.entries(staticPageFiles).map(([route, file]) => [route, gitLastmod(file)]),
)

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
      // Real per-URL lastmod dates: blog posts from their own frontmatter, the blog index/
      // pagination from the most recent post (adding a post changes what those pages list),
      // static pages from git history. Anything unmatched is left without a lastmod rather than
      // guessing one.
      serialize(item) {
        const pathname = new URL(item.url).pathname

        const blogPostMatch = pathname.match(/^\/blog\/([^/]+)\/$/)
        if (blogPostMatch && blogLastmod.has(blogPostMatch[1])) {
          item.lastmod = blogLastmod.get(blogPostMatch[1])
          return item
        }

        if (pathname === "/blog/" || /^\/blog\/\d+\/$/.test(pathname)) {
          if (latestBlogDate) item.lastmod = latestBlogDate
          return item
        }

        const staticLm = staticLastmod.get(pathname)
        if (staticLm) item.lastmod = staticLm
        return item
      },
    }),
  ],
  prefetch: {
    prefetchAll: true,
  },
})
