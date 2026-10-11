import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { blogCategoryNames } from "./data/blogCategories"

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Card-display hook, distinct from `description` (the ~155-char SEO meta description/OG/
    // schema text). A post card can only show 2 lines before CSS line-clamp cuts it off, and a
    // 155-char meta description, written to use that whole SEO budget, always overflowed a card
    // mid-sentence with a stray ellipsis, see CLAUDE.md's blog section for the full story and the
    // empirical measurement behind this 68-char cap (the real worst-case card width, measured via
    // canvas text metrics at the narrowest real breakpoint, fits ~70 characters on 2 lines; 68
    // leaves a couple characters of safety margin). This is a hard schema gate, not just a style
    // guideline: a post with an excerpt over budget fails `astro check`/`astro build` outright
    // rather than silently truncating on the live site.
    excerpt: z.string().max(68),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("Flowbound"),
    authorTitle: z.string().optional(),
    category: z.enum(blogCategoryNames),
    tags: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
})

export const collections = { blog }
