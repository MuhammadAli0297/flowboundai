// Canvas 2D hero background for /demand-forecasting: "Forecast Horizon". A row of history bars
// (sales velocity per SKU) settles just left of a fixed crate hub, the pivot where history turns
// into prediction; past the pivot a smooth projected curve climbs into the empty space, trailed by
// a soft widening "confidence cone" and a traveling pulse. One bar periodically flares bright and
// grows (a bestseller about to run out, caught early), another dims and flattens toward the
// baseline (dead stock getting flagged), so the page's two watch-for cases read as bar behavior
// rather than decoration. Drawing is clipped to the right side of the canvas so it can never paint
// over the hero copy, and spans the clipped strip's full height rather than a thin mid-band. The
// hub itself does not rotate, unlike other hero hubs on this site, at the user's explicit request.

export {} // no imports of its own; this keeps the file a module instead of a global script, so
// its top-level consts don't collide with the same names in other per-page hero scripts

const CLIP_XF = 0.58
const BASELINE_YF = 0.58
const BAR_START_XF = 0.62
const PIVOT_XF = 0.76
const CURVE_END_XF = 0.97

const SHADOW = "#104866" // ocean-950
const BRIGHT = "#DBE9EE" // ocean-100
const PALE = "#C0D6DF" // ocean-200
const MID = "#4A6FA5" // ocean-500

const BAR_COUNT = 11
const BESTSELLER_IDX = 8
const DEAD_STOCK_IDX = 3

// deterministic pseudo-random per bar index, no stored state needed
function hash(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

// 6-point crate outline (SectionIcon's "crate" glyph) recentred on its own origin, plus the same
// 3-spoke "Y" the small icon uses, pulled back from the vertices to avoid a stroke-overlap dot.
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

function quadPoint(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, t: number) {
  const u = 1 - t
  return {
    x: u * u * x0 + 2 * u * t * cx + t * t * x1,
    y: u * u * y0 + 2 * u * t * cy + t * t * y1,
  }
}

function initDemandForecastingHero() {
  const canvas = document.getElementById("demand-forecasting-hero") as HTMLCanvasElement | null
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
    const glowR = Math.min(width, height) * (0.24 + Math.sin(t * 0.7) * 0.015)
    const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, glowR)
    grad.addColorStop(0, "rgba(219,233,238,0.35)")
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

  function drawBars(t: number, baseline: number) {
    const spacing = (PIVOT_XF - BAR_START_XF) * width / (BAR_COUNT - 1)
    const barW = spacing * 0.42
    const maxRise = height * 0.32

    for (let i = 0; i < BAR_COUNT; i++) {
      const x = BAR_START_XF * width + i * spacing
      let target = 0.18 + hash(i) * 0.62
      let color = PALE
      let alpha = 0.55

      if (i === BESTSELLER_IDX) {
        const cycle = ((t / 6.2) % 1 + 1) % 1
        const grow = cycle < 0.7 ? cycle / 0.7 : 1 - (cycle - 0.7) / 0.3
        target = 0.4 + grow * 0.58
        const flare = Math.max(0, (cycle - 0.55)) * 3
        color = BRIGHT
        alpha = 0.65 + Math.min(flare, 1) * 0.35
      } else if (i === DEAD_STOCK_IDX) {
        const cycle = ((t / 7.4 + 0.4) % 1 + 1) % 1
        const shrink = cycle < 0.6 ? 1 - cycle / 0.6 : (cycle - 0.6) / 0.4
        target = 0.12 + shrink * 0.3
        color = "#4F6D7A" // ocean-700, dimmed
        alpha = 0.3 + (1 - shrink) * 0.15
      } else {
        target *= 1 + Math.sin(t * 0.6 + i * 1.7) * 0.05
      }

      const h = Math.max(target, 0.05) * maxRise
      ctx!.fillStyle = color
      ctx!.globalAlpha = alpha
      ctx!.fillRect(x - barW / 2, baseline - h, barW, h)
      ctx!.globalAlpha = 1

      if (i === DEAD_STOCK_IDX) {
        const cycle = ((t / 7.4 + 0.4) % 1 + 1) % 1
        const shrink = cycle < 0.6 ? 1 - cycle / 0.6 : (cycle - 0.6) / 0.4
        if (shrink > 0.75) {
          ctx!.beginPath()
          ctx!.arc(x, baseline - h - 8, 2.4, 0, Math.PI * 2)
          ctx!.fillStyle = "rgba(219,233,238,0.6)"
          ctx!.fill()
        }
      }
    }
  }

  function curvePoints(baseline: number, pivotX: number, t: number) {
    const endX = CURVE_END_XF * width
    const endY = baseline - height * (0.4 + Math.sin(t * 0.35) * 0.02)
    const ctrlX = pivotX + (endX - pivotX) * 0.55
    const ctrlY = baseline - height * 0.08
    return { pivotX, baseline, ctrlX, ctrlY, endX, endY }
  }

  function drawForecast(baseline: number, pivotX: number, t: number) {
    const { ctrlX, ctrlY, endX, endY } = curvePoints(baseline, pivotX, t)
    const spread = 26

    // confidence cone: two offset curves filled between, widening toward the far edge
    ctx!.beginPath()
    ctx!.moveTo(pivotX, baseline)
    ctx!.quadraticCurveTo(ctrlX, ctrlY - spread * 0.3, endX, endY - spread)
    ctx!.lineTo(endX, endY + spread)
    ctx!.quadraticCurveTo(ctrlX, ctrlY + spread * 0.3, pivotX, baseline)
    ctx!.closePath()
    ctx!.fillStyle = "rgba(74,111,165,0.14)"
    ctx!.fill()

    // main projected line
    ctx!.beginPath()
    ctx!.moveTo(pivotX, baseline)
    ctx!.quadraticCurveTo(ctrlX, ctrlY, endX, endY)
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 2
    ctx!.stroke()

    // traveling pulse along the curve
    const cycle = (t / 3.2) % 1
    const p = quadPoint(pivotX, baseline, ctrlX, ctrlY, endX, endY, cycle)
    ctx!.beginPath()
    ctx!.arc(p.x, p.y, 3.4, 0, Math.PI * 2)
    ctx!.fillStyle = MID
    ctx!.fill()
    ctx!.beginPath()
    ctx!.arc(p.x, p.y, 6, 0, Math.PI * 2)
    ctx!.fillStyle = "rgba(74,111,165,0.35)"
    ctx!.fill()
  }

  function draw(time: number) {
    const t = time / 1000
    ctx!.clearRect(0, 0, width, height)

    ctx!.save()
    ctx!.beginPath()
    ctx!.rect(width * CLIP_XF, 0, width * (1 - CLIP_XF), height)
    ctx!.clip()

    const baseline = BASELINE_YF * height
    const pivotX = PIVOT_XF * width

    // faint baseline
    ctx!.beginPath()
    ctx!.moveTo(width * CLIP_XF, baseline)
    ctx!.lineTo(width, baseline)
    ctx!.strokeStyle = "rgba(219,233,238,0.1)"
    ctx!.lineWidth = 1
    ctx!.stroke()

    drawBars(t, baseline)
    drawForecast(baseline, pivotX, t)
    drawHub(pivotX, baseline, t)

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
  document.addEventListener("DOMContentLoaded", initDemandForecastingHero)
} else {
  initDemandForecastingHero()
}
