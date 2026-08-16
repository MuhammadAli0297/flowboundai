// Canvas 2D hero background for /inventory-tracking: "Live Scan". A fixed crate hub anchors two
// faint static radar rings, and a bright sweep line rotates slowly around it. A grid of status
// cells sits scattered across the strip, each idle at a low baseline glow; as the sweep passes a
// cell's angle it flares bright and reveals what kind of stock it is, a solid dot for on-hand, a
// hollow ring for incoming, a short strike for already committed, then fades back to idle as the
// sweep moves on. One full rotation touches every cell once, so "real-time visibility into what's
// on hand, incoming, and spoken for" reads directly in the motion. Drawing is clipped to the right
// side of the canvas so it can never paint over the hero copy, and the grid spans the clipped
// strip's full height. The hub itself stays fixed, only the sweep line and the cells move.

export {} // no imports of its own; keeps this a module instead of a global script, see
// askFlowboundHero.ts for why that matters

const CLIP_XF = 0.58
const HUB_XF = 0.7
const HUB_YF = 0.5
const SWEEP_PERIOD = 9

const SHADOW = "#104866" // ocean-950
const BRIGHT = "#DBE9EE" // ocean-100
const PALE = "#C0D6DF" // ocean-200
const DIM = "#4F6D7A" // ocean-700

type Cell = { xf: number; yf: number; type: 0 | 1 | 2 }

const CELLS: Cell[] = [
  { xf: 0.63, yf: 0.14, type: 0 },
  { xf: 0.74, yf: 0.1, type: 1 },
  { xf: 0.9, yf: 0.13, type: 2 },
  { xf: 0.98, yf: 0.22, type: 0 },
  { xf: 0.62, yf: 0.3, type: 1 },
  { xf: 0.83, yf: 0.28, type: 0 },
  { xf: 0.96, yf: 0.42, type: 1 },
  { xf: 0.66, yf: 0.68, type: 2 },
  { xf: 0.8, yf: 0.62, type: 0 },
  { xf: 0.93, yf: 0.58, type: 1 },
  { xf: 0.61, yf: 0.82, type: 0 },
  { xf: 0.75, yf: 0.88, type: 1 },
  { xf: 0.9, yf: 0.84, type: 2 },
  { xf: 0.98, yf: 0.7, type: 0 },
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

function norm(angle: number) {
  const twoPi = Math.PI * 2
  return ((angle % twoPi) + twoPi) % twoPi
}

function angleDiff(a: number, b: number) {
  const d = Math.abs(norm(a) - norm(b))
  return Math.min(d, Math.PI * 2 - d)
}

function initInventoryTrackingHero() {
  const canvas = document.getElementById("inventory-tracking-hero") as HTMLCanvasElement | null
  const section = document.getElementById("top")
  if (!canvas || !section) return

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  let width = 0
  let height = 0
  const lastActive = new Array(CELLS.length).fill(-10)

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

    for (const r of [0.16, 0.3]) {
      ctx!.beginPath()
      ctx!.arc(cx, cy, Math.min(width, height) * r, 0, Math.PI * 2)
      ctx!.strokeStyle = "rgba(219,233,238,0.08)"
      ctx!.lineWidth = 1
      ctx!.stroke()
    }

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

  function drawSweep(cx: number, cy: number, angle: number) {
    const radius = Math.max(width, height) * 0.75
    const steps = 26
    for (let k = 0; k < steps; k++) {
      const a = angle - k * 0.018
      const alpha = (1 - k / steps) * 0.16
      const x = cx + Math.cos(a) * radius
      const y = cy + Math.sin(a) * radius
      ctx!.beginPath()
      ctx!.moveTo(cx, cy)
      ctx!.lineTo(x, y)
      ctx!.strokeStyle = `rgba(219,233,238,${alpha.toFixed(3)})`
      ctx!.lineWidth = k === 0 ? 1.6 : 1
      ctx!.stroke()
    }
  }

  function drawCellGlyph(x: number, y: number, type: 0 | 1 | 2, color: string, alpha: number) {
    ctx!.globalAlpha = alpha
    if (type === 0) {
      ctx!.beginPath()
      ctx!.arc(x, y, 3.2, 0, Math.PI * 2)
      ctx!.fillStyle = color
      ctx!.fill()
    } else if (type === 1) {
      ctx!.beginPath()
      ctx!.arc(x, y, 4, 0, Math.PI * 2)
      ctx!.strokeStyle = color
      ctx!.lineWidth = 1.4
      ctx!.stroke()
    } else {
      ctx!.beginPath()
      ctx!.moveTo(x - 4.5, y)
      ctx!.lineTo(x + 4.5, y)
      ctx!.strokeStyle = color
      ctx!.lineWidth = 2
      ctx!.lineCap = "round"
      ctx!.stroke()
    }
    ctx!.globalAlpha = 1
  }

  function drawCells(t: number, cx: number, cy: number, sweepAngle: number) {
    CELLS.forEach((cell, i) => {
      const x = cell.xf * width
      const y = cell.yf * height
      const cellAngle = Math.atan2(y - cy, x - cx)

      if (angleDiff(cellAngle, sweepAngle) < 0.1) {
        lastActive[i] = t
      }

      const sinceActive = t - lastActive[i]
      const activeAlpha = Math.max(0, 1 - sinceActive / 1.4)

      // idle baseline marker, always faintly visible
      drawCellGlyph(x, y, cell.type, PALE, 0.16)

      if (activeAlpha > 0.02) {
        const glowR = 10 + activeAlpha * 6
        const grad = ctx!.createRadialGradient(x, y, 0, x, y, glowR)
        grad.addColorStop(0, `rgba(219,233,238,${(activeAlpha * 0.35).toFixed(3)})`)
        grad.addColorStop(1, "rgba(219,233,238,0)")
        ctx!.beginPath()
        ctx!.arc(x, y, glowR, 0, Math.PI * 2)
        ctx!.fillStyle = grad
        ctx!.fill()

        const color = cell.type === 2 ? DIM : BRIGHT
        drawCellGlyph(x, y, cell.type, color, Math.min(activeAlpha * 1.3, 1))
      }
    })
  }

  function draw(time: number) {
    const t = time / 1000
    ctx!.clearRect(0, 0, width, height)

    ctx!.save()
    ctx!.beginPath()
    ctx!.rect(width * CLIP_XF, 0, width * (1 - CLIP_XF), height)
    ctx!.clip()

    const cx = HUB_XF * width
    const cy = HUB_YF * height
    const angle = (t / SWEEP_PERIOD) * Math.PI * 2

    drawSweep(cx, cy, angle)
    drawCells(t, cx, cy, angle)
    drawHub(cx, cy, t)

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
  document.addEventListener("DOMContentLoaded", initInventoryTrackingHero)
} else {
  initInventoryTrackingHero()
}
