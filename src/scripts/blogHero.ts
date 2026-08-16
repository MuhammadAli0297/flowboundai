// Canvas 2D hero background for /blog: "Insight Stream". A fixed `document` hub sends
// comet-trail pulses outward to a spread of small open-book "reader" nodes, the only hero on the
// site where signal flows OUT of the hub rather than converging into it, standing in for insight
// reaching readers instead of a decision engine reaching a conclusion. Everything is drawn
// clipped to a rect on the right side of the canvas, so no matter how the section resizes, the
// animation can never paint over the hero copy on the left. The reader nodes span the full height
// of that clipped strip rather than clustering near the hub, to use the empty space rather than
// sit in a small corner.

export {} // no imports of its own; this keeps the file a module instead of a global script, so
// its top-level consts don't collide with the same names in other per-page hero scripts

const HUB_XF = 0.8
const HUB_YF = 0.5
const CLIP_XF = 0.58

const SHADOW = "#104866" // ocean-950
const BRIGHT = "#DBE9EE" // ocean-100
const PALE = "#C0D6DF" // ocean-200

const CYCLE = 3.6 // seconds for one node's pulse-out cycle

type ReaderNode = { xf: number; yf: number; phase: number; bow: number }

// Spread across the full height of the clipped right-hand strip, not just around the hub, so the
// field reads as filling the empty space rather than a small cluster.
const NODES: ReaderNode[] = [
  { xf: 0.65, yf: 0.16, phase: 0, bow: 1 },
  { xf: 0.95, yf: 0.12, phase: 0.22, bow: -1 },
  { xf: 0.61, yf: 0.46, phase: 0.44, bow: -1 },
  { xf: 0.97, yf: 0.58, phase: 0.66, bow: 1 },
  { xf: 0.7, yf: 0.86, phase: 0.88, bow: -1 },
]

// The "document" icon path (SectionIcon), recentred on (0,0) so it can be drawn as the fixed hub.
const DOC_OUTLINE = new Path2D("M-10,-20 L5,-20 L12,-13 L12,20 L-10,20 Z")
const DOC_FOLD = new Path2D("M5,-20 L5,-13 L12,-13")
const DOC_LINES = new Path2D("M-5,-4 L7,-4 M-5,3 L7,3 M-5,10 L2,10")

// A small open-book mark, matching the reader node glyph the original SVG/SMIL hero used.
const BOOK_OUTLINE = new Path2D("M-9,-6 Q0,-9 9,-6 L9,7 Q0,4 -9,7 Z")
const BOOK_SPINE = new Path2D("M0,-7.5 L0,5.5")

function quadPoint(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, t: number) {
  const u = 1 - t
  return {
    x: u * u * x0 + 2 * u * t * cx + t * t * x1,
    y: u * u * y0 + 2 * u * t * cy + t * t * y1,
  }
}

function controlPoint(x0: number, y0: number, x1: number, y1: number, bow: number) {
  const mx = (x0 + x1) / 2
  const my = (y0 + y1) / 2
  const dx = x1 - x0
  const dy = y1 - y0
  const len = Math.hypot(dx, dy) || 1
  const px = -dy / len
  const py = dx / len
  const offset = len * 0.15 * bow
  return { x: mx + px * offset, y: my + py * offset }
}

function initBlogHero() {
  const canvas = document.getElementById("blog-hero") as HTMLCanvasElement | null
  const section = document.getElementById("top")
  if (!canvas || !section) return

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  let width = 0
  let height = 0

  function resize() {
    const rect = section!.getBoundingClientRect()
    width = Math.max(rect.width, 1)
    height = Math.max(rect.height, 1)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas!.width = width * dpr
    canvas!.height = height * dpr
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  window.addEventListener("resize", resize)

  function drawRipples(cx: number, cy: number, t: number) {
    const period = 2.8
    const maxRadius = Math.min(width, height) * 0.42
    for (let k = 0; k < 3; k++) {
      const age = ((t + (k * period) / 3) % period) / period
      const radius = age * maxRadius
      const alpha = (1 - age) * 0.24
      ctx!.beginPath()
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx!.strokeStyle = `rgba(219,233,238,${alpha.toFixed(3)})`
      ctx!.lineWidth = 1.4
      ctx!.stroke()
    }
  }

  function drawHub(cx: number, cy: number) {
    const glowR = Math.min(width, height) * 0.3
    const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, glowR)
    grad.addColorStop(0, "rgba(219,233,238,0.4)")
    grad.addColorStop(1, "rgba(219,233,238,0)")
    ctx!.beginPath()
    ctx!.arc(cx, cy, glowR, 0, Math.PI * 2)
    ctx!.fillStyle = grad
    ctx!.fill()

    ctx!.save()
    ctx!.translate(cx, cy)
    ctx!.scale(2.4, 2.4)
    ctx!.fillStyle = SHADOW
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 0.65
    ctx!.lineJoin = "round"
    ctx!.fill(DOC_OUTLINE)
    ctx!.stroke(DOC_OUTLINE)
    ctx!.stroke(DOC_FOLD)
    ctx!.lineWidth = 0.6
    ctx!.lineCap = "round"
    ctx!.stroke(DOC_LINES)
    ctx!.restore()
  }

  function drawComet(x0: number, y0: number, cxp: number, cyp: number, x1: number, y1: number, t: number) {
    for (let i = 0; i < 4; i++) {
      const st = Math.max(t - i * 0.03, 0)
      const p = quadPoint(x0, y0, cxp, cyp, x1, y1, st)
      const alpha = (1 - i / 4) * 0.9
      const r = 3.2 - i * 0.5
      ctx!.beginPath()
      ctx!.arc(p.x, p.y, Math.max(r, 0.6), 0, Math.PI * 2)
      ctx!.fillStyle = i === 0 ? BRIGHT : `rgba(192,214,223,${alpha.toFixed(2)})`
      ctx!.fill()
    }
  }

  function drawNode(n: ReaderNode, t: number, hubX: number, hubY: number) {
    const baseX = n.xf * width
    const baseY = n.yf * height
    const bob = Math.sin(t * 0.7 + n.phase * 12) * 5

    // faint standing connection back to the hub
    const c = controlPoint(hubX, hubY, baseX, baseY, n.bow)
    ctx!.beginPath()
    ctx!.moveTo(hubX, hubY)
    ctx!.quadraticCurveTo(c.x, c.y, baseX, baseY)
    ctx!.strokeStyle = "rgba(219,233,238,0.12)"
    ctx!.lineWidth = 1
    ctx!.stroke()

    const glowR = 26
    const grad = ctx!.createRadialGradient(baseX, baseY, 0, baseX, baseY, glowR)
    grad.addColorStop(0, "rgba(219,233,238,0.28)")
    grad.addColorStop(1, "rgba(219,233,238,0)")
    ctx!.beginPath()
    ctx!.arc(baseX, baseY, glowR, 0, Math.PI * 2)
    ctx!.fillStyle = grad
    ctx!.fill()

    const cycleT = ((t / CYCLE + n.phase) % 1 + 1) % 1
    if (cycleT < 0.4) {
      const local = cycleT / 0.4
      drawComet(hubX, hubY, c.x, c.y, baseX, baseY, local)
    }

    ctx!.save()
    ctx!.translate(baseX, baseY + bob)
    ctx!.scale(1.15, 1.15)
    ctx!.fillStyle = SHADOW
    ctx!.strokeStyle = PALE
    ctx!.lineWidth = 1.1
    ctx!.lineJoin = "round"
    ctx!.fill(BOOK_OUTLINE)
    ctx!.stroke(BOOK_OUTLINE)
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 0.9
    ctx!.lineCap = "round"
    ctx!.stroke(BOOK_SPINE)
    ctx!.restore()
  }

  function draw(time: number) {
    const t = time / 1000
    ctx!.clearRect(0, 0, width, height)

    ctx!.save()
    ctx!.beginPath()
    ctx!.rect(width * CLIP_XF, 0, width * (1 - CLIP_XF), height)
    ctx!.clip()

    const hubX = HUB_XF * width
    const hubY = HUB_YF * height

    drawRipples(hubX, hubY, t)
    for (const n of NODES) drawNode(n, t, hubX, hubY)
    drawHub(hubX, hubY)

    ctx!.restore()
  }

  if (reduceMotion) {
    draw(0)
    return
  }

  let frame = 0
  function loop(time: number) {
    draw(time)
    frame = requestAnimationFrame(loop)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries[0]?.isIntersecting
      if (visible && !frame) {
        frame = requestAnimationFrame(loop)
      } else if (!visible && frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    },
    { threshold: 0 }
  )
  observer.observe(section)
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBlogHero)
} else {
  initBlogHero()
}
