// Canvas 2D hero background for /reorder: "Threshold Drop". A vertical stock gauge drains
// steadily toward a dashed reorder-point line. The instant the fill crosses it, a bright flash
// fires at the crossing point, a jagged bolt-shaped streak shoots into the fixed bolt hub, and the
// hub immediately fires back out to three purchase-order nodes that light up in quick succession,
// each settling into a small confirmed checkmark, before the gauge resets and drains again. The
// whole reaction happens fast, standing in for "the reorder goes out the moment it's needed, not
// when someone gets to it." Drawing is clipped to the right side of the canvas so it can never
// paint over the hero copy, and the gauge spans the clipped strip's full height. The hub itself
// stays fixed.

export {} // no imports of its own; keeps this a module instead of a global script, see
// askFlowboundHero.ts for why that matters

const CLIP_XF = 0.58
const GAUGE_XF = 0.68
const GAUGE_TOP_YF = 0.14
const GAUGE_BOTTOM_YF = 0.86
const GAUGE_WIDTH = 16
const THRESHOLD_LEVEL = 0.32
const HUB_XF = 0.88
const HUB_YF = 0.5
const PERIOD = 6

const SHADOW = "#104866" // ocean-950
const BRIGHT = "#DBE9EE" // ocean-100

// "bolt" SectionIcon glyph, recentred on its own origin
const BOLT_POINTS: [number, number][] = [
  [2, -20],
  [-10, 2],
  [-2, 2],
  [-6, 20],
  [10, -4],
  [0, -4],
]

const PO_NODES: [number, number][] = [
  [30, -34],
  [38, 4],
  [26, 40],
]

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1)
  return t * t * (3 - 2 * t)
}

function initReorderHero() {
  const canvas = document.getElementById("reorder-hero") as HTMLCanvasElement | null
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

  function drawBolt(cx: number, cy: number, scale: number, fill: string, stroke: string) {
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
    ctx!.fillStyle = fill
    ctx!.strokeStyle = stroke
    ctx!.lineWidth = 1.5
    ctx!.lineJoin = "round"
    ctx!.fill()
    ctx!.stroke()
    ctx!.restore()
  }

  function drawCheck(x: number, y: number, alpha: number) {
    ctx!.globalAlpha = alpha
    ctx!.beginPath()
    ctx!.moveTo(x - 3, y)
    ctx!.lineTo(x - 0.8, y + 2.4)
    ctx!.lineTo(x + 3.6, y - 2.8)
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 1.5
    ctx!.lineCap = "round"
    ctx!.lineJoin = "round"
    ctx!.stroke()
    ctx!.globalAlpha = 1
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
    const gaugeX = GAUGE_XF * width
    const gaugeTop = GAUGE_TOP_YF * height
    const gaugeBottom = GAUGE_BOTTOM_YF * height
    const gaugeH = gaugeBottom - gaugeTop
    const thresholdY = gaugeBottom - THRESHOLD_LEVEL * gaugeH

    const cycleT = (t % PERIOD) / PERIOD
    const level = 1 - cycleT
    const fillY = gaugeBottom - level * gaugeH
    const eventStart = 1 - THRESHOLD_LEVEL
    const eventT = (cycleT - eventStart) / (1 - eventStart)
    const eventActive = eventT >= 0 && eventT < 1

    // gauge outline
    ctx!.strokeStyle = "rgba(219,233,238,0.25)"
    ctx!.lineWidth = 1.4
    ctx!.strokeRect(gaugeX - GAUGE_WIDTH / 2, gaugeTop, GAUGE_WIDTH, gaugeH)

    // fill
    ctx!.fillStyle = "rgba(192,214,223,0.4)"
    ctx!.fillRect(gaugeX - GAUGE_WIDTH / 2, fillY, GAUGE_WIDTH, gaugeBottom - fillY)

    // reorder-point dashed line
    ctx!.save()
    ctx!.setLineDash([4, 4])
    ctx!.beginPath()
    ctx!.moveTo(gaugeX - GAUGE_WIDTH / 2 - 14, thresholdY)
    ctx!.lineTo(gaugeX + GAUGE_WIDTH / 2 + 14, thresholdY)
    ctx!.strokeStyle = "rgba(219,233,238,0.4)"
    ctx!.lineWidth = 1.2
    ctx!.stroke()
    ctx!.restore()

    if (eventActive) {
      // flash right at the crossing point
      const crossFlash = Math.max(0, 1 - eventT / 0.12)
      if (crossFlash > 0.02) {
        const glowR = 8 + crossFlash * 14
        const grad = ctx!.createRadialGradient(gaugeX, thresholdY, 0, gaugeX, thresholdY, glowR)
        grad.addColorStop(0, `rgba(219,233,238,${(crossFlash * 0.7).toFixed(3)})`)
        grad.addColorStop(1, "rgba(219,233,238,0)")
        ctx!.beginPath()
        ctx!.arc(gaugeX, thresholdY, glowR, 0, Math.PI * 2)
        ctx!.fillStyle = grad
        ctx!.fill()
      }

      // jagged streak from threshold to hub
      const streakT = smoothstep(0, 0.16, eventT) * (eventT < 0.2 ? 1 : Math.max(0, 1 - (eventT - 0.2) / 0.08))
      if (streakT > 0.02) {
        const midX = gaugeX + (hubX - gaugeX) * 0.5
        const midY = thresholdY + (hubY - thresholdY) * 0.5 - 18
        ctx!.beginPath()
        ctx!.moveTo(gaugeX, thresholdY)
        ctx!.quadraticCurveTo(midX, midY, hubX, hubY)
        ctx!.strokeStyle = `rgba(219,233,238,${(streakT * 0.9).toFixed(3)})`
        ctx!.lineWidth = 1.8
        ctx!.stroke()
      }

      // hub flash, peaks as the streak arrives
      const hubFlash = smoothstep(0.1, 0.2, eventT) * (1 - smoothstep(0.3, 0.45, eventT))
      if (hubFlash > 0.02) {
        const glowR = 14 + hubFlash * 16
        const grad = ctx!.createRadialGradient(hubX, hubY, 0, hubX, hubY, glowR)
        grad.addColorStop(0, `rgba(219,233,238,${(hubFlash * 0.55).toFixed(3)})`)
        grad.addColorStop(1, "rgba(219,233,238,0)")
        ctx!.beginPath()
        ctx!.arc(hubX, hubY, glowR, 0, Math.PI * 2)
        ctx!.fillStyle = grad
        ctx!.fill()
      }

      // purchase-order nodes cascading to life
      PO_NODES.forEach(([dx, dy], i) => {
        const x = hubX + dx
        const y = hubY + dy
        const startT = 0.2 + i * 0.08
        const popT = smoothstep(startT, startT + 0.08, eventT)
        const settleAlpha = smoothstep(startT, startT + 0.15, eventT)

        ctx!.beginPath()
        ctx!.moveTo(hubX, hubY)
        ctx!.lineTo(x, y)
        ctx!.strokeStyle = `rgba(219,233,238,${(popT * 0.3).toFixed(3)})`
        ctx!.lineWidth = 1
        ctx!.stroke()

        if (popT > 0.02) {
          const r = 2.4 + popT * 1.6
          ctx!.beginPath()
          ctx!.arc(x, y, r, 0, Math.PI * 2)
          ctx!.fillStyle = BRIGHT
          ctx!.globalAlpha = settleAlpha
          ctx!.fill()
          ctx!.globalAlpha = 1

          if (eventT > startT + 0.1) {
            drawCheck(x + 6, y - 6, settleAlpha)
          }
        }
      })
    }

    drawBolt(hubX, hubY, 1.3, SHADOW, BRIGHT)

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
  document.addEventListener("DOMContentLoaded", initReorderHero)
} else {
  initReorderHero()
}
