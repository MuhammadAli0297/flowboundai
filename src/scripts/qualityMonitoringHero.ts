// Canvas 2D hero background for /quality-monitoring: "Inspection Line". A horizontal conveyor
// runs through a fixed shield-check checkpoint. Small batch tokens travel left to right along it;
// most cross straight through with a quick checkmark flash and continue on. One, every fifth
// batch, stops right at the checkpoint instead, pulses with a growing alert ring and a small flag
// mark, holds a moment, then continues on marked, standing in for "a quality issue gets flagged
// while it's still one incident." Unlike every other hero on this site's capability pages (all
// hub-and-spokes networks or charts), this one is a straight line through a single checkpoint, a
// deliberately different shape to close out the set. Drawing is clipped to the right side of the
// canvas so it can never paint over the hero copy, and the inspection band spans a generous slice
// of the clipped strip's height. The hub itself stays fixed.

export {} // no imports of its own; keeps this a module instead of a global script, see
// askFlowboundHero.ts for why that matters

const CLIP_XF = 0.58
const LINE_YF = 0.5
const LINE_START_XF = 0.62
const LINE_END_XF = 0.99
const HUB_XF = 0.82
const BAND_TOP_YF = 0.26
const BAND_BOTTOM_YF = 0.74

const SPAWN_PERIOD = 1.1
const TRAVEL_DUR = 3.0
const HOLD_DUR = 0.7
const FLAG_EVERY = 5

const SHADOW = "#104866" // ocean-950
const BRIGHT = "#DBE9EE" // ocean-100
const PALE = "#C0D6DF" // ocean-200

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1)
  return t * t * (3 - 2 * t)
}

function initQualityMonitoringHero() {
  const canvas = document.getElementById("quality-monitoring-hero") as HTMLCanvasElement | null
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

  function drawShieldHub(cx: number, cy: number) {
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
    const s = 1.15
    ctx!.beginPath()
    ctx!.moveTo(0 * s, -20 * s)
    ctx!.lineTo(16 * s, -14 * s)
    ctx!.lineTo(16 * s, -2 * s)
    ctx!.bezierCurveTo(16 * s, 10 * s, 8 * s, 18 * s, 0 * s, 20 * s)
    ctx!.bezierCurveTo(-8 * s, 18 * s, -16 * s, 10 * s, -16 * s, -2 * s)
    ctx!.lineTo(-16 * s, -14 * s)
    ctx!.closePath()
    ctx!.fillStyle = SHADOW
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 1.5
    ctx!.lineJoin = "round"
    ctx!.fill()
    ctx!.stroke()

    ctx!.beginPath()
    ctx!.moveTo(-7 * s, 0)
    ctx!.lineTo(-2 * s, 5 * s)
    ctx!.lineTo(8 * s, -6 * s)
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 1.6
    ctx!.lineCap = "round"
    ctx!.lineJoin = "round"
    ctx!.stroke()
    ctx!.restore()
  }

  function draw(time: number) {
    const t = time / 1000
    ctx!.clearRect(0, 0, width, height)

    ctx!.save()
    ctx!.beginPath()
    ctx!.rect(width * CLIP_XF, 0, width * (1 - CLIP_XF), height)
    ctx!.clip()

    const lineY = LINE_YF * height
    const startX = LINE_START_XF * width
    const endX = LINE_END_XF * width
    const hubX = HUB_XF * width
    const bandTop = BAND_TOP_YF * height
    const bandBottom = BAND_BOTTOM_YF * height
    const hubFraction = (hubX - startX) / (endX - startX)
    const holdStart = TRAVEL_DUR * hubFraction

    // inspection band + conveyor line
    ctx!.fillStyle = "rgba(74,111,165,0.08)"
    ctx!.fillRect(startX, bandTop, endX - startX, bandBottom - bandTop)
    ctx!.beginPath()
    ctx!.moveTo(startX, lineY)
    ctx!.lineTo(endX, lineY)
    ctx!.strokeStyle = "rgba(219,233,238,0.16)"
    ctx!.lineWidth = 1.2
    ctx!.stroke()

    for (let k = 0; k < 5; k++) {
      const spawnIndex = Math.floor(t / SPAWN_PERIOD) - k
      const spawnT = spawnIndex * SPAWN_PERIOD
      const localT = t - spawnT
      const isFlagged = ((spawnIndex % FLAG_EVERY) + FLAG_EVERY) % FLAG_EVERY === 0
      const lifetime = TRAVEL_DUR + (isFlagged ? HOLD_DUR : 0)
      if (localT < 0 || localT > lifetime) continue

      let pt = localT
      let holding = false
      if (isFlagged) {
        if (localT >= holdStart && localT < holdStart + HOLD_DUR) {
          pt = holdStart
          holding = true
        } else if (localT >= holdStart + HOLD_DUR) {
          pt = localT - HOLD_DUR
        }
      }

      const travel = Math.min(Math.max(pt / TRAVEL_DUR, 0), 1)
      const x = startX + (endX - startX) * travel
      const jitter = Math.sin(spawnIndex * 12.9898) * 6
      const y = lineY + jitter

      const nearHub = Math.abs(x - hubX) < 6

      ctx!.save()
      ctx!.translate(x, y)
      const size = 5
      ctx!.beginPath()
      ctx!.rect(-size / 2, -size / 2, size, size)
      ctx!.fillStyle = holding ? BRIGHT : PALE
      ctx!.globalAlpha = holding ? 1 : 0.8
      ctx!.fill()
      ctx!.globalAlpha = 1
      ctx!.restore()

      if (nearHub && !isFlagged) {
        const flashAge = Math.abs(x - hubX) / 6
        const alpha = 1 - flashAge
        ctx!.save()
        ctx!.globalAlpha = Math.max(alpha, 0)
        ctx!.beginPath()
        ctx!.moveTo(x - 4, y - 7)
        ctx!.lineTo(x - 1, y - 4)
        ctx!.lineTo(x + 5, y - 10)
        ctx!.strokeStyle = BRIGHT
        ctx!.lineWidth = 1.6
        ctx!.lineCap = "round"
        ctx!.lineJoin = "round"
        ctx!.stroke()
        ctx!.restore()
      }

      if (isFlagged && localT >= holdStart) {
        const holdAge = Math.min((localT - holdStart) / HOLD_DUR, 1)
        const ringR = 6 + holdAge * 16
        const ringAlpha = holding ? 0.5 : Math.max(0, 0.5 - holdAge)
        ctx!.beginPath()
        ctx!.arc(x, y, ringR, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(219,233,238,${ringAlpha.toFixed(3)})`
        ctx!.lineWidth = 1.4
        ctx!.stroke()

        if (holdAge > 0.15) {
          ctx!.save()
          ctx!.globalAlpha = smoothstep(0.15, 0.35, holdAge)
          ctx!.beginPath()
          ctx!.moveTo(x, y - 12)
          ctx!.lineTo(x, y - 4)
          ctx!.moveTo(x, y - 2)
          ctx!.lineTo(x, y - 1.6)
          ctx!.strokeStyle = BRIGHT
          ctx!.lineWidth = 1.8
          ctx!.lineCap = "round"
          ctx!.stroke()
          ctx!.restore()
        }
      }
    }

    drawShieldHub(hubX, lineY)

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
  document.addEventListener("DOMContentLoaded", initQualityMonitoringHero)
} else {
  initQualityMonitoringHero()
}
