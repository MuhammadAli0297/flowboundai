// Canvas 2D hero background for /pricing: "Margin Band". A fixed bolt hub takes two continuous
// signal streams, cost from the left and demand from the right, each looping comet-trail pulses
// into it. Below, a needle drifts smoothly back and forth on a bounded horizontal track, nudged
// by the combined pull of both signals, but it never crosses the two fixed floor/ceiling markers.
// Unlike this page's sibling heroes, nothing here snaps or fires an event: it's meant to read as
// continuous, gentle adjustment rather than a discrete trigger, matching "adjusts continuously"
// rather than "reacts once." Drawing is clipped to the right side of the canvas so it can never
// paint over the hero copy, and the composition spans the clipped strip's full height. The hub
// itself stays fixed.

export {} // no imports of its own; keeps this a module instead of a global script, see
// askFlowboundHero.ts for why that matters

const CLIP_XF = 0.58
const HUB_XF = 0.8
const HUB_YF = 0.3
const COST_XF = 0.65
const COST_YF = 0.14
const DEMAND_XF = 0.96
const DEMAND_YF = 0.14
const TRACK_YF = 0.66
const TRACK_LEFT_XF = 0.65
const TRACK_RIGHT_XF = 0.97
const BOUND_LEFT_XF = 0.7
const BOUND_RIGHT_XF = 0.92

const SHADOW = "#104866" // ocean-950
const BRIGHT = "#DBE9EE" // ocean-100
const PALE = "#C0D6DF" // ocean-200

// "bolt" SectionIcon glyph, recentred on its own origin
const BOLT_POINTS: [number, number][] = [
  [2, -20],
  [-10, 2],
  [-2, 2],
  [-6, 20],
  [10, -4],
  [0, -4],
]

function quadPoint(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, t: number) {
  const u = 1 - t
  return {
    x: u * u * x0 + 2 * u * t * cx + t * t * x1,
    y: u * u * y0 + 2 * u * t * cy + t * t * y1,
  }
}

function initPricingHero() {
  const canvas = document.getElementById("pricing-hero") as HTMLCanvasElement | null
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

  function drawBolt(cx: number, cy: number, scale: number) {
    const glowR = Math.min(width, height) * 0.18
    const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, glowR)
    grad.addColorStop(0, "rgba(219,233,238,0.28)")
    grad.addColorStop(1, "rgba(219,233,238,0)")
    ctx!.beginPath()
    ctx!.arc(cx, cy, glowR, 0, Math.PI * 2)
    ctx!.fillStyle = grad
    ctx!.fill()

    ctx!.save()
    ctx!.translate(cx, cy)
    ctx!.beginPath()
    BOLT_POINTS.forEach(([px, py], i) => {
      const x = px * scale
      const y = py * scale
      if (i === 0) ctx!.moveTo(x, y)
      else ctx!.lineTo(x, y)
    })
    ctx!.closePath()
    ctx!.fillStyle = SHADOW
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 1.5
    ctx!.lineJoin = "round"
    ctx!.fill()
    ctx!.stroke()
    ctx!.restore()
  }

  function drawSignal(x0: number, y0: number, hubX: number, hubY: number, t: number, period: number, phase: number) {
    const cycle = ((t / period + phase) % 1 + 1) % 1
    const ctrlX = (x0 + hubX) / 2
    const ctrlY = Math.min(y0, hubY) - 20

    ctx!.beginPath()
    ctx!.moveTo(x0, y0)
    ctx!.quadraticCurveTo(ctrlX, ctrlY, hubX, hubY)
    ctx!.strokeStyle = "rgba(219,233,238,0.1)"
    ctx!.lineWidth = 1
    ctx!.stroke()

    for (let i = 0; i < 4; i++) {
      const st = Math.max(cycle - i * 0.025, 0)
      if (st <= 0 && i > 0) continue
      const p = quadPoint(x0, y0, ctrlX, ctrlY, hubX, hubY, st)
      const a = (1 - i / 4) * (0.15 < st && st < 0.95 ? 1 : Math.min(st * 6, (1 - st) * 6, 1))
      ctx!.beginPath()
      ctx!.arc(p.x, p.y, Math.max(2.6 - i * 0.4, 0.5), 0, Math.PI * 2)
      ctx!.fillStyle = i === 0 ? BRIGHT : `rgba(192,214,223,${Math.max(a, 0).toFixed(2)})`
      ctx!.fill()
    }

    ctx!.beginPath()
    ctx!.arc(x0, y0, 3.2, 0, Math.PI * 2)
    ctx!.fillStyle = PALE
    ctx!.fill()
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
    const costX = COST_XF * width
    const costY = COST_YF * height
    const demandX = DEMAND_XF * width
    const demandY = DEMAND_YF * height

    drawSignal(costX, costY, hubX, hubY, t, 4.6, 0)
    drawSignal(demandX, demandY, hubX, hubY, t, 5.3, 0.4)
    drawBolt(hubX, hubY, 1.15)

    // bounded track
    const trackY = TRACK_YF * height
    const trackLeft = TRACK_LEFT_XF * width
    const trackRight = TRACK_RIGHT_XF * width
    const boundLeft = BOUND_LEFT_XF * width
    const boundRight = BOUND_RIGHT_XF * width

    ctx!.beginPath()
    ctx!.moveTo(trackLeft, trackY)
    ctx!.lineTo(trackRight, trackY)
    ctx!.strokeStyle = "rgba(219,233,238,0.14)"
    ctx!.lineWidth = 1.4
    ctx!.stroke()

    ctx!.fillStyle = "rgba(74,111,165,0.14)"
    ctx!.fillRect(boundLeft, trackY - 10, boundRight - boundLeft, 20)

    ;[boundLeft, boundRight].forEach((bx) => {
      ctx!.beginPath()
      ctx!.moveTo(bx, trackY - 12)
      ctx!.lineTo(bx, trackY + 12)
      ctx!.strokeStyle = "rgba(219,233,238,0.4)"
      ctx!.lineWidth = 1.4
      ctx!.stroke()
    })

    // needle: continuous smooth wander from two overlapping sines, safely inside the bounds
    const center = (boundLeft + boundRight) / 2
    const halfRange = (boundRight - boundLeft) / 2 - 8
    const sway = Math.sin(t * 0.37) * 0.6 + Math.sin(t * 0.53 + 1.3) * 0.4
    const needleX = center + sway * halfRange

    ctx!.beginPath()
    ctx!.moveTo(needleX, trackY - 16)
    ctx!.lineTo(needleX, trackY + 16)
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 2
    ctx!.lineCap = "round"
    ctx!.stroke()

    const glowR = 12
    const grad = ctx!.createRadialGradient(needleX, trackY, 0, needleX, trackY, glowR)
    grad.addColorStop(0, "rgba(219,233,238,0.4)")
    grad.addColorStop(1, "rgba(219,233,238,0)")
    ctx!.beginPath()
    ctx!.arc(needleX, trackY, glowR, 0, Math.PI * 2)
    ctx!.fillStyle = grad
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
  document.addEventListener("DOMContentLoaded", initPricingHero)
} else {
  initPricingHero()
}
