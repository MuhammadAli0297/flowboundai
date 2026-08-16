// Canvas 2D hero background for /ask-flowbound: "Signal Field". A spark hub sits toward the
// right edge of the hero and trades comet-trail pulses with a scattered field of drifting data
// nodes (questions traveling in, answers traveling back out along a different bow), while slow
// sonar-style rings breathe outward from the hub. Everything is drawn clipped to a rect on the
// right side of the canvas, so no matter how the section resizes, the animation can never paint
// over the hero copy on the left. The node field spans the full height of that clipped strip
// rather than clustering near the hub, to use the empty space rather than sit in a small corner.

export {} // no imports of its own; this keeps the file a module instead of a global script, so
// its top-level consts don't collide with the same names in other per-page hero scripts

const HUB_XF = 0.79
const HUB_YF = 0.48
const CLIP_XF = 0.58

const SHADOW = "#104866" // ocean-950
const BRIGHT = "#DBE9EE" // ocean-100
const PALE = "#C0D6DF" // ocean-200

const CYCLE = 4.6 // seconds for one node's full question-out/answer-back loop

type SignalNode = { xf: number; yf: number; phase: number; bow: number }

// Spread across the full height of the clipped right-hand strip, not just around the hub, so the
// field reads as filling the empty space rather than a small cluster.
const NODES: SignalNode[] = [
  { xf: 0.67, yf: 0.13, phase: 0, bow: 1 },
  { xf: 0.96, yf: 0.1, phase: 0.14, bow: -1 },
  { xf: 0.61, yf: 0.35, phase: 0.28, bow: 1 },
  { xf: 0.98, yf: 0.44, phase: 0.42, bow: -1 },
  { xf: 0.63, yf: 0.6, phase: 0.57, bow: -1 },
  { xf: 0.93, yf: 0.76, phase: 0.71, bow: 1 },
  { xf: 0.71, yf: 0.91, phase: 0.85, bow: -1 },
]

// 8-point "spark" star, matching SectionIcon's spark glyph, centred on its own origin.
const SPARK_POINTS: [number, number][] = [
  [0, -20],
  [4, -4],
  [20, 0],
  [4, 4],
  [0, 20],
  [-4, 4],
  [-20, 0],
  [-4, -4],
]

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
  const offset = len * 0.18 * bow
  return { x: mx + px * offset, y: my + py * offset }
}

function initAskFlowboundHero() {
  const canvas = document.getElementById("ask-flowbound-hero") as HTMLCanvasElement | null
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

  function drawHub(cx: number, cy: number) {
    const glowR = Math.min(width, height) * 0.32
    const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, glowR)
    grad.addColorStop(0, "rgba(219,233,238,0.4)")
    grad.addColorStop(1, "rgba(219,233,238,0)")
    ctx!.beginPath()
    ctx!.arc(cx, cy, glowR, 0, Math.PI * 2)
    ctx!.fillStyle = grad
    ctx!.fill()

    ctx!.save()
    ctx!.translate(cx, cy)
    ctx!.beginPath()
    SPARK_POINTS.forEach(([px, py], i) => {
      const x = px * 3.2
      const y = py * 3.2
      if (i === 0) ctx!.moveTo(x, y)
      else ctx!.lineTo(x, y)
    })
    ctx!.closePath()
    ctx!.fillStyle = SHADOW
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 1.6
    ctx!.lineJoin = "round"
    ctx!.fill()
    ctx!.stroke()
    ctx!.restore()
  }

  function drawRipples(cx: number, cy: number, t: number) {
    const period = 2.8
    const maxRadius = Math.max(width, height) * 0.55
    for (let k = 0; k < 3; k++) {
      const age = ((t + (k * period) / 3) % period) / period
      const radius = age * maxRadius
      const alpha = (1 - age) * 0.22
      ctx!.beginPath()
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx!.strokeStyle = `rgba(219,233,238,${alpha.toFixed(3)})`
      ctx!.lineWidth = 1.4
      ctx!.stroke()
    }
  }

  function drawComet(x0: number, y0: number, cxp: number, cyp: number, x1: number, y1: number, t: number) {
    for (let i = 0; i < 4; i++) {
      const st = Math.max(t - i * 0.028, 0)
      const p = quadPoint(x0, y0, cxp, cyp, x1, y1, st)
      const alpha = (1 - i / 4) * 0.9
      const r = 3.2 - i * 0.5
      ctx!.beginPath()
      ctx!.arc(p.x, p.y, Math.max(r, 0.6), 0, Math.PI * 2)
      ctx!.fillStyle = i === 0 ? BRIGHT : `rgba(192,214,223,${alpha.toFixed(2)})`
      ctx!.fill()
    }
  }

  function drawNode(n: SignalNode, t: number, hubX: number, hubY: number) {
    const baseX = n.xf * width
    const baseY = n.yf * height
    const x = baseX + Math.sin(t * 0.5 + n.phase * 10) * 6
    const y = baseY + Math.cos(t * 0.42 + n.phase * 10) * 6

    // faint standing connection to the hub
    ctx!.beginPath()
    ctx!.moveTo(x, y)
    const cIn = controlPoint(x, y, hubX, hubY, n.bow)
    ctx!.quadraticCurveTo(cIn.x, cIn.y, hubX, hubY)
    ctx!.strokeStyle = "rgba(219,233,238,0.12)"
    ctx!.lineWidth = 1
    ctx!.stroke()

    ctx!.beginPath()
    ctx!.arc(x, y, 3, 0, Math.PI * 2)
    ctx!.fillStyle = PALE
    ctx!.fill()

    const cycleT = ((t / CYCLE + n.phase) % 1 + 1) % 1
    if (cycleT < 0.35) {
      // question travels node -> hub
      const local = cycleT / 0.35
      const c = controlPoint(x, y, hubX, hubY, n.bow)
      drawComet(x, y, c.x, c.y, hubX, hubY, local)
    } else if (cycleT >= 0.5 && cycleT < 0.85) {
      // answer travels hub -> node, opposite bow so it reads as a distinct return path
      const local = (cycleT - 0.5) / 0.35
      const c = controlPoint(hubX, hubY, x, y, -n.bow)
      drawComet(hubX, hubY, c.x, c.y, x, y, local)
    }
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
  document.addEventListener("DOMContentLoaded", initAskFlowboundHero)
} else {
  initAskFlowboundHero()
}
