import type { BlogCategoryName } from "../data/blogCategories"
import { categoryIcon } from "../data/blogCategories"

// Same viewBox and path data as src/components/icons/SectionIcon.astro (the on-site category
// watermark), reproduced here rather than shared, since satori (the OG-image renderer, see
// src/pages/og/[slug].png.ts) needs a plain object tree, not an .astro component. "gear" is
// omitted, it's only ever used on /how-it-works, never as a blog category icon. Keep this in sync
// by hand if SectionIcon.astro's paths ever change.
type Node = { type: string; props: Record<string, unknown> }

const g = (props: Record<string, unknown>, children: Node[]): Node => ({ type: "g", props: { ...props, children } })
const path = (d: string): Node => ({ type: "path", props: { d } })
const circle = (cx: number, cy: number, r: number, extra: Record<string, unknown> = {}): Node => ({
  type: "circle",
  props: { cx, cy, r, ...extra },
})

const ICON_INNER: Record<string, Node[]> = {
  spark: [path("M24,4 L28,20 L44,24 L28,28 L24,44 L20,28 L4,24 L20,20 Z")],
  crate: [
    path("M24,6 L40,15 L40,33 L24,42 L8,33 L8,15 Z"),
    path("M24,24 L24,8.7 M24,24 L37.6,31.7 M24,24 L10.4,31.7"),
  ],
  network: [
    path("M19,34 L29,34 M15.13,27.74 L20.87,16.26 M32.87,27.74 L27.13,16.26"),
    circle(12, 34, 4),
    circle(36, 34, 4),
    circle(24, 10, 4),
  ],
  bolt: [path("M26,4 L14,26 L22,26 L18,44 L34,20 L24,20 Z")],
  chat: [
    { type: "rect", props: { x: 6, y: 8, width: 36, height: 24, rx: 6 } },
    path("M14,33.5 L10,40 L20,33.5"),
    circle(18, 20, 1.6, { fill: "currentColor", stroke: "none" }),
    circle(24, 20, 1.6, { fill: "currentColor", stroke: "none" }),
    circle(30, 20, 1.6, { fill: "currentColor", stroke: "none" }),
  ],
  "shield-check": [
    path("M24,4 L40,10 L40,22 C40,34 32,42 24,44 C16,42 8,34 8,22 L8,10 Z"),
    path("M17,24 L22,29 L32,18"),
  ],
  compass: [circle(24, 24, 12), path("M24,4 L24,9 M24,39 L24,44 M4,24 L9,24 M39,24 L44,24")],
  document: [
    path("M14,4 L29,4 L36,11 L36,44 L14,44 Z"),
    path("M29,4 L29,11 L36,11"),
    path("M19,20 L31,20 M19,27 L31,27 M19,34 L26,34"),
  ],
}

export function categoryIconTree(category: BlogCategoryName, opts: { size: number; color: string; style: Record<string, unknown> }): Node {
  const name = categoryIcon(category)
  const inner = ICON_INNER[name] ?? ICON_INNER.spark
  return {
    type: "svg",
    props: {
      viewBox: "0 0 48 48",
      width: opts.size,
      height: opts.size,
      style: opts.style,
      children: [
        g(
          {
            stroke: opts.color,
            fill: "none",
            "stroke-width": 1.5,
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          inner
        ),
      ],
    },
  }
}
