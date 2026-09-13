import { readFile } from "node:fs/promises"
import { decompress } from "wawoff2"

// Satori (the OG-image renderer, see src/pages/og/[slug].png.ts) can't parse WOFF2 directly
// ("Unsupported OpenType signature wOF2", confirmed empirically before writing this) and can't
// parse Amulya specifically at all even after decompression, since Amulya is a variable font and
// satori's font parser doesn't support variable-font tables (fvar/gvar), confirmed the same way.
// Satoshi and IBM Plex Mono are static, non-variable fonts, so this project's existing self-hosted
// files work once decompressed WOFF2 -> sfnt via wawoff2, no separate font asset needed.
let cachedFonts: { name: string; data: Buffer; weight: 700 | 900 | 500; style: "normal" }[] | null = null

async function toSfnt(path: string): Promise<Buffer> {
  const woff2 = await readFile(path)
  return Buffer.from(await decompress(woff2))
}

export async function loadOgFonts() {
  if (cachedFonts) return cachedFonts
  const [satoshi700, satoshi900, plexMono500] = await Promise.all([
    toSfnt("./public/fonts/satoshi-700.woff2"),
    toSfnt("./public/fonts/satoshi-900.woff2"),
    toSfnt("./public/fonts/ibm-plex-mono-500.woff2"),
  ])
  cachedFonts = [
    { name: "Satoshi", data: satoshi700, weight: 700, style: "normal" },
    { name: "Satoshi", data: satoshi900, weight: 900, style: "normal" },
    { name: "IBM Plex Mono", data: plexMono500, weight: 500, style: "normal" },
  ]
  return cachedFonts
}
