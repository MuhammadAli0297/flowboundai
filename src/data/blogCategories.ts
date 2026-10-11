// Fixed taxonomy for blog posts: one category per post, used for the card badge,
// the generated thumbnail icon, and the /blog search-and-filter sidebar. Distinct
// from the freeform `tags` field on a post, which stays for cross-linking and the
// existing /blog/tags/[tag] pages.
//
// `tint`/`deep` are a per-category identity color pair for the /blog card grid (the
// "Duotone Wash + Big Label" treatment, picked 2026-10-11 from three mocked options,
// see CLAUDE.md's Hot Sauce section), replacing the single muted `accent` hex this
// taxonomy used before. That old set (`#B8704F`, `#7E9471`, etc.) was explicitly
// tuned to sit alongside the old `ocean-100`/`ocean-200` palette ("no purple, no
// saturated/neon hues") and reads as flat/undersaturated next to Bold's own vivid
// `mint`/`ink` identity. `tint` is the pale wash used behind the whole card
// (gradient, not flat fill, see `.bold-post-card` in index.css); `deep` is the
// saturated color used for the watermark icon, the category label, the border, and
// the hover shadow. Every `deep` value is independently verified at 4.5:1 (WCAG AA)
// or better against `bold-paper` (#EFF7F2) via real sRGB relative-luminance math, not
// eyeballed, same discipline CLAUDE.md's contrast rules require everywhere else:
//   Inventory Management  5.36:1   Supplier Management  4.69:1
//   Shipping & Logistics  4.54:1   Customer Service      5.31:1
//   Quality Monitoring    4.80:1   Autonomous Decisions  8.95:1
//   Industry Insights     6.17:1
// Deliberately not new `ocean-*`/`bold-*` Tailwind tokens: like the set they
// replace, these are a small, fixed, non-reusable pair scoped to one component's
// decoration, applied via inline CSS custom properties rather than Tailwind classes.
// If this ever needs to be a Tailwind token instead (e.g. reused elsewhere), promote
// it to tailwind.config.js then, not preemptively.
export const blogCategories = [
  { name: "Inventory Management", icon: "crate", tint: "#EACAB8", deep: "#995229" },
  { name: "Supplier Management", icon: "network", tint: "#B8EAD1", deep: "#217D4F" },
  { name: "Shipping & Logistics", icon: "bolt", tint: "#EADAB8", deep: "#8D6B25" },
  { name: "Customer Service", icon: "chat", tint: "#B8D5EA", deep: "#296A99" },
  { name: "Quality Monitoring", icon: "shield-check", tint: "#B8EAE4", deep: "#20796D" },
  { name: "Autonomous Decisions", icon: "compass", tint: "#BFB8EA", deep: "#3E2DA9" },
  { name: "Industry Insights", icon: "spark", tint: "#EAB8D8", deep: "#A12B76" },
] as const

export type BlogCategoryName = (typeof blogCategories)[number]["name"]

export const blogCategoryNames = blogCategories.map((c) => c.name) as [BlogCategoryName, ...BlogCategoryName[]]

export function categoryIcon(name: string) {
  return blogCategories.find((c) => c.name === name)?.icon ?? "spark"
}

export function categoryTint(name: string) {
  return blogCategories.find((c) => c.name === name)?.tint ?? "#BFB8EA"
}

export function categoryDeep(name: string) {
  return blogCategories.find((c) => c.name === name)?.deep ?? "#3E2DA9"
}
