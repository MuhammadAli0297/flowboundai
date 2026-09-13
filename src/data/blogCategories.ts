// Fixed taxonomy for blog posts: one category per post, used for the card badge,
// the generated thumbnail icon, and the /blog search-and-filter sidebar. Distinct
// from the freeform `tags` field on a post, which stays for cross-linking and the
// existing /blog/tags/[tag] pages.
//
// `accent` is a per-category identity color for the /blog card grid (top border, pill
// dot, icon-token tint), added 2026-09-13 at the user's explicit request to bring more
// color into the card design. Deliberately not new `ocean-*`/`fb-*` Tailwind tokens:
// these are muted, desaturated "editorial" tones picked to sit alongside the ocean
// palette without clashing (no purple, no saturated/neon hues, matching ocean-100/200's
// low-saturation feel), applied via inline style rather than Tailwind classes since
// they're a small, fixed, non-reusable set scoped to one component's decoration, not a
// sitewide design token. If this ever needs to be a Tailwind token instead (e.g. reused
// elsewhere), promote it to tailwind.config.js then, not preemptively.
export const blogCategories = [
  { name: "Inventory Management", icon: "crate", accent: "#B8704F" },
  { name: "Supplier Management", icon: "network", accent: "#7E9471" },
  { name: "Shipping & Logistics", icon: "bolt", accent: "#96742E" },
  { name: "Customer Service", icon: "chat", accent: "#4C8480" },
  { name: "Quality Monitoring", icon: "shield-check", accent: "#6F7F45" },
  { name: "Autonomous Decisions", icon: "compass", accent: "#57647D" },
  { name: "Industry Insights", icon: "spark", accent: "#B99A6B" },
] as const

export type BlogCategoryName = (typeof blogCategories)[number]["name"]

export const blogCategoryNames = blogCategories.map((c) => c.name) as [BlogCategoryName, ...BlogCategoryName[]]

export function categoryIcon(name: string) {
  return blogCategories.find((c) => c.name === name)?.icon ?? "spark"
}

export function categoryAccent(name: string) {
  return blogCategories.find((c) => c.name === name)?.accent ?? "#57647D"
}
