// Canvas 2D hero background for /shipping-optimization: "Lane Race". A fixed crate hub (the
// origin) sends a comet-trail dot down each of five candidate lanes fanned out toward the right
// edge every race cycle. Four lanes slow, fade, and stop partway at their own pace, standing in
// for carriers "compared and discarded"; one lane, a different one each cycle, runs the full
// distance and lights up a small marker at its destination when it wins, before the whole field
// resets and races again. Drawing is clipped to the right side of the canvas so it can never
// paint over the hero copy, and the lane fan spans the clipped strip's full height. The hub
// itself stays fixed, only the lanes race.

export {} // no imports of its own; keeps this a module instead of a global script, see
// askFlowboundHero.ts for why that matters

const CLIP_XF = 0.58
const HUB_XF = 0.64
const HUB_YF = 0.5
const END_XF = 0.97
const RACE_PERIOD = 5.5

const SHADOW = "#104866" // ocean-950
const BRIGHT = "#DBE9EE" // ocean-100
const PALE = "#C0D6DF" // ocean-200

type Lane = { yf: number; fade: number; speed: number }

const LANES: Lane[] = [
  { yf: 0.14, fade: 0.55, speed: 1.1 },
  { yf: 0.32, fade: 0.4, speed: 0.9 },
  { yf: 0.5, fade: 0.62, speed: 1.0 },
  { yf: 0.68, fade: 0.48, speed: 1.15 },
  { yf: 0.86, fade: 0.35, speed: 0.85 },
]

const CRATE_OUTLINE: [number, number][] = [
  [0, -18],
  [16, -9],
  [16, 9],
  [0, 18],
  [-16, 9],
  [-16, -9],
]
const CRATE_SPOKES: [number, number][] = [
  [0, -15.3],
  [13.6, 7.65],
  [-13.6, 7.65],
]

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function quadPoint(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, t: number) {
  const u = 1 - t
  return {
    x: u * u * x0 + 2 * u * t * cx + t * t * x1,
    y: u * u * y0 + 2 * u * t * cy + t * t * y1,
  }
}

function initShippingOptimizationHero() {
  const canvas = document.getElementById("shipping-optimization-hero") as HTMLCanvasElement | null
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

  function drawHub(cx: number, cy: number, t: number) {
    const glowR = Math.min(width, height) * (0.2 + Math.sin(t * 0.7) * 0.012)
    const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, glowR)
    grad.addColorStop(0, "rgba(219,233,238,0.32)")
    grad.addColorStop(1, "rgba(219,233,238,0)")
    ctx!.beginPath()
    ctx!.arc(cx, cy, glowR, 0, Math.PI * 2)
    ctx!.fillStyle = grad
    ctx!.fill()

    ctx!.save()
    ctx!.translate(cx, cy)
    const scale = 2.1
    ctx!.beginPath()
    CRATE_OUTLINE.forEach(([px, py], i) => {
      const x = px * scale
      const y = py * scale
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

    ctx!.beginPath()
    CRATE_SPOKES.forEach(([px, py]) => {
      ctx!.moveTo(0, 0)
      ctx!.lineTo(px * scale, py * scale)
    })
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 1.3
    ctx!.lineCap = "round"
    ctx!.stroke()
    ctx!.restore()
  }

  function laneGeometry(lane: Lane, hubX: number, hubY: number) {
    const endX = END_XF * width
    const endY = lane.yf * height
    const ctrlX = hubX + (endX - hubX) * 0.35
    const ctrlY = hubY + (endY - hubY) * 0.15
    return { hubX, hubY, ctrlX, ctrlY, endX, endY }
  }

  function drawComet(g: { hubX: number; hubY: number; ctrlX: number; ctrlY: number; endX: number; endY: number }, travel: number, alpha: number, color: string) {
    for (let i = 0; i < 4; i++) {
      const st = Math.max(travel - i * 0.02, 0)
      const p = quadPoint(g.hubX, g.hubY, g.ctrlX, g.ctrlY, g.endX, g.endY, st)
      const a = alpha * (1 - i / 4)
      const r = 3 - i * 0.45
      ctx!.beginPath()
      ctx!.arc(p.x, p.y, Math.max(r, 0.5), 0, Math.PI * 2)
      ctx!.fillStyle = i === 0 ? color : `rgba(192,214,223,${a.toFixed(2)})`
      if (i === 0) ctx!.globalAlpha = alpha
      ctx!.fill()
      ctx!.globalAlpha = 1
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
    const raceT = (t % RACE_PERIOD) / RACE_PERIOD
    const winner = Math.floor(t / RACE_PERIOD) % LANES.length

    LANES.forEach((lane, i) => {
      const g = laneGeometry(lane, hubX, hubY)

      // faint standing lane path
      ctx!.beginPath()
      ctx!.moveTo(g.hubX, g.hubY)
      ctx!.quadraticCurveTo(g.ctrlX, g.ctrlY, g.endX, g.endY)
      ctx!.strokeStyle = "rgba(219,233,238,0.1)"
      ctx!.lineWidth = 1
      ctx!.stroke()

      // idle destination marker
      ctx!.beginPath()
      ctx!.arc(g.endX, g.endY, 2.6, 0, Math.PI * 2)
      ctx!.fillStyle = "rgba(219,233,238,0.18)"
      ctx!.fill()

      const isWinner = i === winner
      if (isWinner) {
        const travel = easeInOutQuad(raceT)
        drawComet(g, travel, 1, BRIGHT)
        if (travel > 0.93) {
          const arriveAlpha = (travel - 0.93) / 0.07
          const glowR = 12 + arriveAlpha * 6
          const grad = ctx!.createRadialGradient(g.endX, g.endY, 0, g.endX, g.endY, glowR)
          grad.addColorStop(0, `rgba(219,233,238,${(arriveAlpha * 0.5).toFixed(3)})`)
          grad.addColorStop(1, "rgba(219,233,238,0)")
          ctx!.beginPath()
          ctx!.arc(g.endX, g.endY, glowR, 0, Math.PI * 2)
          ctx!.fillStyle = grad
          ctx!.fill()
        }
      } else {
        const pos = Math.min(raceT * lane.speed, lane.fade)
        const overshoot = raceT * lane.speed - lane.fade
        const alpha = overshoot > 0 ? Math.max(0, 1 - overshoot * 2.2) : 1
        if (alpha > 0.02) drawComet(g, pos, alpha * 0.75, PALE)
      }
    })

    drawHub(hubX, hubY, t)

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
  document.addEventListener("DOMContentLoaded", initShippingOptimizationHero)
} else {
  initShippingOptimizationHero()
}
