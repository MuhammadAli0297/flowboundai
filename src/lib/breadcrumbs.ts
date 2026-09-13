export type BreadcrumbItem = { name: string; path: string }

// Shared by every page that renders <Breadcrumbs> (src/components/Breadcrumbs.astro): one `items`
// array feeds both the visible trail and this schema, so they can't drift apart the way a
// hand-duplicated BreadcrumbList would.
export function buildBreadcrumbSchema(items: BreadcrumbItem[], siteUrl: string | URL) {
  const base = siteUrl.toString().replace(/\/$/, "")
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.path.endsWith("/") ? item.path : `${item.path}/`}`,
    })),
  }
}
