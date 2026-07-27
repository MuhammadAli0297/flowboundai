export function slugifyTag(tag: string) {
  return tag.trim().toLowerCase().replace(/\s+/g, "-")
}
