// Fixed taxonomy for blog posts: one category per post, used for the card badge,
// the generated thumbnail icon, and the /blog search-and-filter sidebar. Distinct
// from the freeform `tags` field on a post, which stays for cross-linking and the
// existing /blog/tags/[tag] pages.
export const blogCategories = [
  { name: "Inventory Management", icon: "crate" },
  { name: "Supplier Management", icon: "network" },
  { name: "Shipping & Logistics", icon: "bolt" },
  { name: "Customer Service", icon: "chat" },
  { name: "Quality Monitoring", icon: "shield-check" },
  { name: "Autonomous Decisions", icon: "compass" },
  { name: "Industry Insights", icon: "spark" },
  { name: "Company News", icon: "document" },
] as const

export type BlogCategoryName = (typeof blogCategories)[number]["name"]

export const blogCategoryNames = blogCategories.map((c) => c.name) as [BlogCategoryName, ...BlogCategoryName[]]

export function categoryIcon(name: string) {
  return blogCategories.find((c) => c.name === name)?.icon ?? "spark"
}
