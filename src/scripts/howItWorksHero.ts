// Canvas 2D hero background for /how-it-works: "Scroll-Driven Assembly". A single winding path
// runs the full height of the clipped strip through four checkpoint nodes, connect, read the
// signal, decide, ask, the same four steps as the cards below the fold. Two motion layers run at
// once: a faint dashed pattern flows along the whole path continuously (ambient, time-based, so
// the hero never looks static even before anyone scrolls), and a bright comet travels the path in
// lockstep with how far the visitor has scrolled through the hero section, using the same
// watchScrollProgress helper the homepage hero's fade/zoom uses. Each node lights up as the comet
// passes it and fades back out if you scroll back up past it, reversible like every other
// scroll-linked animation on the site, not a one-shot "play once" trigger. The four checkpoints
// stay fixed in place, nothing rotates.

import { watchScrollProgress } from "./scrollProgress"

const CLIP_XF = 0.58
const SHADOW = "#104866" // ocean-950
const BRIGHT = "#DBE9EE" // ocean-100

type NodeKind = "connect" | "signal" | "decision" | "ask"

interface PathNode {
  xf: number
  yf: number
  kind: NodeKind
}

const NODES: PathNode[] = [
  { xf: 0.68, yf: 0.14, kind: "connect" },
  { xf: 0.85, yf: 0.39, kind: "signal" },
  { xf: 0.67, yf: 0.64, kind: "decision" },
  { xf: 0.86, yf: 0.88, kind: "ask" },
]

const BULGE = [-0.055, 0.055, -0.055]

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  xf: 0.6 + ((i * 0.037) % 0.38),
  yf0: (i * 0.083) % 1,
  speed: 0.015 + (i % 3) * 0.007,
  phase: i * 0.7,
}))

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1)
  return t * t * (3 - 2 * t)
}

function quad(p0: number, c: number, p1: number, t: number) {
  const mt = 1 - t
  return mt * mt * p0 + 2 * mt * t * c + t * t * p1
}

function initHowItWorksHero() {
  const canvas = document.getElementById("how-it-works-hero") as HTMLCanvasElement | null
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

  function pointsAndControls() {
    const pts = NODES.map((n) => ({ x: n.xf * width, y: n.yf * height }))
    const controls = BULGE.map((b, i) => ({
      x: (pts[i].x + pts[i + 1].x) / 2 + b * width,
      y: (pts[i].y + pts[i + 1].y) / 2,
    }))
    return { pts, controls }
  }

  function pathPoint(t: number, pts: { x: number; y: number }[], controls: { x: number; y: number }[]) {
    const segF = Math.min(Math.max(t, 0), 1) * (pts.length - 1)
    const segIndex = Math.min(Math.floor(segF), pts.length - 2)
    const localT = segF - segIndex
    const p0 = pts[segIndex]
    const p1 = pts[segIndex + 1]
    const c = controls[segIndex]
    return { x: quad(p0.x, c.x, p1.x, localT), y: quad(p0.y, c.y, p1.y, localT) }
  }

  function drawConnect(cx: number, cy: number, alpha: number) {
    ctx!.save()
    ctx!.globalAlpha = alpha
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 1.6
    ;[-4, 4].forEach((dx) => {
      ctx!.beginPath()
      ctx!.arc(cx + dx, cy, 6, 0, Math.PI * 2)
      ctx!.stroke()
    })
    ctx!.restore()
  }

  function drawSignal(cx: number, cy: number, alpha: number) {
    ctx!.save()
    ctx!.globalAlpha = alpha
    ctx!.beginPath()
    ctx!.rect(cx - 11, cy - 8, 22, 16)
    ctx!.fillStyle = SHADOW
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 1.5
    ctx!.fill()
    ctx!.stroke()
    ctx!.beginPath()
    ctx!.moveTo(cx - 7, cy)
    ctx!.lineTo(cx - 3, cy)
    ctx!.lineTo(cx - 1, cy - 4)
    ctx!.lineTo(cx + 1, cy + 4)
    ctx!.lineTo(cx + 3, cy)
    ctx!.lineTo(cx + 7, cy)
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 1.3
    ctx!.lineCap = "round"
    ctx!.lineJoin = "round"
    ctx!.stroke()
    ctx!.restore()
  }

  function drawDecision(cx: number, cy: number, alpha: number) {
    ctx!.save()
    ctx!.globalAlpha = alpha
    ctx!.beginPath()
    ctx!.rect(cx - 10, cy - 8, 20, 16)
    ctx!.fillStyle = SHADOW
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 1.5
    ctx!.fill()
    ctx!.stroke()
    ctx!.beginPath()
    ctx!.moveTo(cx - 4, cy)
    ctx!.lineTo(cx - 1, cy + 4)
    ctx!.lineTo(cx + 5, cy - 4)
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 1.6
    ctx!.lineCap = "round"
    ctx!.lineJoin = "round"
    ctx!.stroke()
    ctx!.restore()
  }

  function drawAsk(cx: number, cy: number, alpha: number) {
    ctx!.save()
    ctx!.globalAlpha = alpha
    ctx!.beginPath()
    ctx!.rect(cx - 10, cy - 8, 20, 14)
    ctx!.fillStyle = SHADOW
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 1.5
    ctx!.fill()
    ctx!.stroke()
    ;[-4, 0, 4].forEach((dx) => {
      ctx!.beginPath()
      ctx!.arc(cx + dx, cy - 1, 1.2, 0, Math.PI * 2)
      ctx!.fillStyle = BRIGHT
      ctx!.fill()
    })
    ctx!.restore()
  }

  const GLYPHS: Record<NodeKind, (cx: number, cy: number, alpha: number) => void> = {
    connect: drawConnect,
    signal: drawSignal,
    decision: drawDecision,
    ask: drawAsk,
  }

  let scrollT = reduceMotion ? 1 : 0
  if (!reduceMotion) {
    watchScrollProgress(section, (progress) => {
      scrollT = progress
    })
  }

  function draw(time: number) {
    const t = time / 1000
    ctx!.clearRect(0, 0, width, height)

    ctx!.save()
    ctx!.beginPath()
    ctx!.rect(width * CLIP_XF, 0, width * (1 - CLIP_XF), height)
    ctx!.clip()

    const { pts, controls } = pointsAndControls()

    // ambient drifting particles
    PARTICLES.forEach((p) => {
      const yf = (p.yf0 + t * p.speed) % 1
      const x = (p.xf + Math.sin(t * 0.6 + p.phase) * 0.015) * width
      const y = yf * height
      const a = 0.12 + 0.12 * Math.sin(t * 1.3 + p.phase)
      ctx!.beginPath()
      ctx!.arc(x, y, 1.4, 0, Math.PI * 2)
      ctx!.fillStyle = BRIGHT
      ctx!.globalAlpha = Math.max(0, a)
      ctx!.fill()
      ctx!.globalAlpha = 1
    })

    // the full route, faint and static in shape, but flowing via an animated dash offset
    ctx!.beginPath()
    ctx!.moveTo(pts[0].x, pts[0].y)
    for (let i = 0; i < controls.length; i++) {
      ctx!.quadraticCurveTo(controls[i].x, controls[i].y, pts[i + 1].x, pts[i + 1].y)
    }
    ctx!.strokeStyle = "rgba(219,233,238,0.22)"
    ctx!.lineWidth = 1.4
    ctx!.setLineDash([3, 7])
    ctx!.lineDashOffset = reduceMotion ? 0 : -(t * 18)
    ctx!.stroke()
    ctx!.setLineDash([])

    // node lighting + glyphs
    NODES.forEach((n, i) => {
      const nodeT = i / (NODES.length - 1)
      const litLevel = smoothstep(nodeT - 0.05, nodeT, scrollT)
      const flash = Math.max(0, 1 - Math.abs(scrollT - nodeT) / 0.09)
      const flashSq = flash * flash
      const pulse = reduceMotion ? 0 : 0.5 + 0.5 * Math.sin(t * 1.6 + i * 1.1)

      const glowR = 22 + litLevel * 8 + flashSq * 16
      const grad = ctx!.createRadialGradient(pts[i].x, pts[i].y, 0, pts[i].x, pts[i].y, glowR)
      const glowAlpha = 0.1 + litLevel * 0.22 + flashSq * 0.35
      grad.addColorStop(0, `rgba(219,233,238,${glowAlpha.toFixed(3)})`)
      grad.addColorStop(1, "rgba(219,233,238,0)")
      ctx!.beginPath()
      ctx!.arc(pts[i].x, pts[i].y, glowR, 0, Math.PI * 2)
      ctx!.fillStyle = grad
      ctx!.fill()

      // idle breathing ring, always present so the hero reads as alive before any scroll happens
      const ringR = 16 + pulse * 2.5
      ctx!.beginPath()
      ctx!.arc(pts[i].x, pts[i].y, ringR, 0, Math.PI * 2)
      ctx!.strokeStyle = `rgba(219,233,238,${(0.16 + pulse * 0.12 + litLevel * 0.15).toFixed(3)})`
      ctx!.lineWidth = 1.2
      ctx!.stroke()

      GLYPHS[n.kind](pts[i].x, pts[i].y, 0.4 + litLevel * 0.6)
    })

    // the comet: scroll-driven, trailed by a fading comet tail
    for (let k = 6; k >= 0; k--) {
      const trailT = scrollT - k * 0.014
      if (trailT < 0) continue
      const p = pathPoint(trailT, pts, controls)
      const a = (1 - k / 7) * 0.85
      const r = 1.2 + (1 - k / 7) * 3.4
      ctx!.beginPath()
      ctx!.arc(p.x, p.y, r, 0, Math.PI * 2)
      ctx!.fillStyle = BRIGHT
      ctx!.globalAlpha = k === 0 ? 1 : a
      ctx!.fill()
      ctx!.globalAlpha = 1
    }

    const head = pathPoint(scrollT, pts, controls)
    const headGrad = ctx!.createRadialGradient(head.x, head.y, 0, head.x, head.y, 14)
    headGrad.addColorStop(0, "rgba(219,233,238,0.65)")
    headGrad.addColorStop(1, "rgba(219,233,238,0)")
    ctx!.beginPath()
    ctx!.arc(head.x, head.y, 14, 0, Math.PI * 2)
    ctx!.fillStyle = headGrad
    ctx!.fill()

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
  document.addEventListener("DOMContentLoaded", initHowItWorksHero)
} else {
  initHowItWorksHero()
}
