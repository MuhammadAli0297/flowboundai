import type { APIRoute, GetStaticPaths } from "astro"
import { getCollection } from "astro:content"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import { loadOgFonts } from "../../lib/ogFonts"
import { categoryIconTree } from "../../lib/ogIcons"

// One real, unique social-preview image per post instead of the single static og-image.png every
// page previously shared, rendered once at build time (this is a static route, same as every HTML
// page, no server involved). A post can still override this with a hand-made image via its
// `ogImage` frontmatter field, [slug].astro only falls back to /og/<slug>.png when that's unset.
export const getStaticPaths = (async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }))
}) satisfies GetStaticPaths

const WIDTH = 1200
const HEIGHT = 630

export const GET: APIRoute = async ({ props }) => {
  const { post } = props
  const fonts = await loadOgFonts()

  const icon = categoryIconTree(post.data.category, {
    size: 280,
    color: "#FAFCFC",
    style: { position: "absolute", right: "50px", top: "175px", opacity: 0.14 },
  })

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: `${WIDTH}px`,
          height: `${HEIGHT}px`,
          display: "flex",
          position: "relative",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#104866",
          overflow: "hidden",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                inset: "0",
                backgroundImage: "radial-gradient(circle at 78% 50%, rgba(74,111,165,0.55), transparent 60%)",
              },
            },
          },
          icon,
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                fontFamily: "IBM Plex Mono",
                fontSize: 24,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#8FB2E8",
                marginBottom: 24,
              },
              children: post.data.category,
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                fontFamily: "Satoshi",
                fontWeight: 700,
                fontSize: 56,
                lineHeight: 1.15,
                color: "#FAFCFC",
                maxWidth: "800px",
              },
              children: post.data.title,
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                marginTop: "48px",
                fontFamily: "IBM Plex Mono",
                fontSize: 22,
                color: "#8FB2E8",
              },
              children: "Flowbound.ai",
            },
          },
        ],
      },
    },
    { width: WIDTH, height: HEIGHT, fonts }
  )

  const png = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng()

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" },
  })
}
