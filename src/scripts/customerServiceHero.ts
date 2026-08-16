// Canvas 2D hero background for /customer-service: "Inbox Flow". A steady stream of small
// message bubbles travels from one source point toward the fixed chat hub. Most bounce straight
// back out along the same path with a quick checkmark flash, an instant answer. Every fourth one
// instead reroutes from the hub to a separate handoff node and settles there, standing in for the
// cases that need a person. Unlike Ask Flowbound's "Signal Field" (a radial network of nodes each
// on their own cycle), this reads as one linear queue arriving at a single point, closer to an
// actual inbox. Drawing is clipped to the right side of the canvas so it can never paint over the
// hero copy, and the composition spans the clipped strip's full height. The hub itself stays
// fixed.

export {} // no imports of its own; keeps this a module instead of a global script, see
// askFlowboundHero.ts for why that matters

const CLIP_XF = 0.58
const HUB_XF = 0.76
const HUB_YF = 0.4
const SOURCE_XF = 0.64
const SOURCE_YF = 0.14
const HANDOFF_XF = 0.95
const HANDOFF_YF = 0.76
const SPAWN_PERIOD = 1.5

const SHADOW = "#104866" // ocean-950
const BRIGHT = "#DBE9EE" // ocean-100
const PALE = "#C0D6DF" // ocean-200

const CHAT_RECT: [number, number, number, number] = [-18, -12, 36, 24] // x, y, w, h
const CHAT_TAIL: [number, number][] = [
  [-10, 13.5],
  [-14, 20],
  [-4, 13.5],
]
const CHAT_DOTS: [number, number][] = [
  [-6, 0],
  [0, 0],
  [6, 0],
]

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1)
  return t * t * (3 - 2 * t)
}

function quadPoint(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, t: number) {
  const u = 1 - t
  return {
    x: u * u * x0 + 2 * u * t * cx + t * t * x1,
    y: u * u * y0 + 2 * u * t * cy + t * t * y1,
  }
}

function initCustomerServiceHero() {
  const canvas = document.getElementById("customer-service-hero") as HTMLCanvasElement | null
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
    const glowR = Math.min(width, height) * 0.19
    const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, glowR)
    grad.addColorStop(0, "rgba(219,233,238,0.28)")
    grad.addColorStop(1, "rgba(219,233,238,0)")
    ctx!.beginPath()
    ctx!.arc(cx, cy, glowR, 0, Math.PI * 2)
    ctx!.fillStyle = grad
    ctx!.fill()

    ctx!.save()
    ctx!.translate(cx, cy)
    const scale = 1.15

    const [rx, ry, rw, rh] = CHAT_RECT
    ctx!.beginPath()
    ctx!.roundRect(rx * scale, ry * scale, rw * scale, rh * scale, 6 * scale)
    ctx!.fillStyle = SHADOW
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 1.5
    ctx!.fill()
    ctx!.stroke()

    ctx!.beginPath()
    CHAT_TAIL.forEach(([px, py], i) => {
      const x = px * scale
      const y = py * scale
      if (i === 0) ctx!.moveTo(x, y)
      else ctx!.lineTo(x, y)
    })
    ctx!.strokeStyle = BRIGHT
    ctx!.lineWidth = 1.5
    ctx!.lineJoin = "round"
    ctx!.lineCap = "round"
    ctx!.stroke()

    CHAT_DOTS.forEach(([px, py]) => {
      ctx!.beginPath()
      ctx!.arc(px * scale, py * scale, 1.6 * scale, 0, Math.PI * 2)
      ctx!.fillStyle = BRIGHT
      ctx!.fill()
    })
    ctx!.restore()
  }

  function drawHandoff(x: number, y: number, flash: number) {
    ctx!.beginPath()
    ctx!.arc(x, y, 12, 0, Math.PI * 2)
    ctx!.strokeStyle = `rgba(219,233,238,${(0.15 + flash * 0.35).toFixed(3)})`
    ctx!.lineWidth = 1.2
    ctx!.stroke()

    // small person glyph: head + shoulders
    ctx!.beginPath()
    ctx!.arc(x, y - 3.5, 3, 0, Math.PI * 2)
    ctx!.fillStyle = flash > 0.1 ? BRIGHT : PALE
    ctx!.fill()
    ctx!.beginPath()
    ctx!.arc(x, y + 8, 7, Math.PI, 0)
    ctx!.strokeStyle = flash > 0.1 ? BRIGHT : PALE
    ctx!.lineWidth = 2
    ctx!.lineCap = "round"
    ctx!.stroke()

    if (flash > 0.05) {
      const glowR = 10 + flash * 10
      const grad = ctx!.createRadialGradient(x, y, 0, x, y, glowR)
      grad.addColorStop(0, `rgba(219,233,238,${(flash * 0.4).toFixed(3)})`)
      grad.addColorStop(1, "rgba(219,233,238,0)")
      ctx!.beginPath()
      ctx!.arc(x, y, glowR, 0, Math.PI * 2)
      ctx!.fillStyle = grad
      ctx!.fill()
    }
  }

  function drawComet(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, travel: number, alpha: number, color: string) {
    for (let i = 0; i < 4; i++) {
      const st = Math.max(travel - i * 0.03, 0)
      const p = quadPoint(x0, y0, cx, cy, x1, y1, st)
      const a = alpha * (1 - i / 4)
      ctx!.beginPath()
      ctx!.arc(p.x, p.y, Math.max(2.8 - i * 0.5, 0.5), 0, Math.PI * 2)
      ctx!.fillStyle = i === 0 ? color : `rgba(192,214,223,${a.toFixed(2)})`
      ctx!.fill()
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
    const sourceX = SOURCE_XF * width
    const sourceY = SOURCE_YF * height
    const handoffX = HANDOFF_XF * width
    const handoffY = HANDOFF_YF * height

    // faint standing paths
    ctx!.beginPath()
    ctx!.moveTo(sourceX, sourceY)
    ctx!.quadraticCurveTo((sourceX + hubX) / 2, sourceY - 10, hubX, hubY)
    ctx!.strokeStyle = "rgba(219,233,238,0.08)"
    ctx!.lineWidth = 1
    ctx!.stroke()
    ctx!.beginPath()
    ctx!.moveTo(hubX, hubY)
    ctx!.quadraticCurveTo((hubX + handoffX) / 2, (hubY + handoffY) / 2 - 20, handoffX, handoffY)
    ctx!.setLineDash([3, 4])
    ctx!.strokeStyle = "rgba(219,233,238,0.1)"
    ctx!.stroke()
    ctx!.setLineDash([])

    ctx!.beginPath()
    ctx!.arc(sourceX, sourceY, 2.6, 0, Math.PI * 2)
    ctx!.fillStyle = PALE
    ctx!.fill()

    let handoffFlash = 0

    for (let k = 0; k < 3; k++) {
      const spawnIndex = Math.floor(t / SPAWN_PERIOD) - k
      const spawnT = spawnIndex * SPAWN_PERIOD
      const localT = t - spawnT
      const isHandoff = ((spawnIndex % 4) + 4) % 4 === 0

      if (localT < 0 || localT > 2.2) continue

      const inCtrlX = (sourceX + hubX) / 2
      const inCtrlY = sourceY - 10

      if (localT < 0.9) {
        const travel = smoothstep(0, 0.9, localT)
        drawComet(sourceX, sourceY, inCtrlX, inCtrlY, hubX, hubY, travel, 1, BRIGHT)
      } else if (localT < 1.05) {
        const flash = 1 - smoothstep(0.9, 1.05, localT)
        const glowR = 10 + flash * 8
        const grad = ctx!.createRadialGradient(hubX, hubY, 0, hubX, hubY, glowR)
        grad.addColorStop(0, `rgba(219,233,238,${(flash * 0.5).toFixed(3)})`)
        grad.addColorStop(1, "rgba(219,233,238,0)")
        ctx!.beginPath()
        ctx!.arc(hubX, hubY, glowR, 0, Math.PI * 2)
        ctx!.fillStyle = grad
        ctx!.fill()
      } else if (!isHandoff && localT < 1.75) {
        const travel = smoothstep(1.05, 1.75, localT)
        const alpha = 1 - smoothstep(1.55, 1.75, localT)
        drawComet(hubX, hubY, inCtrlX, inCtrlY, sourceX, sourceY, travel, alpha, BRIGHT)
      } else if (isHandoff && localT < 1.85) {
        const outCtrlX = (hubX + handoffX) / 2
        const outCtrlY = (hubY + handoffY) / 2 - 20
        const travel = smoothstep(1.05, 1.85, localT)
        drawComet(hubX, hubY, outCtrlX, outCtrlY, handoffX, handoffY, travel, 1, BRIGHT)
        if (travel > 0.9) handoffFlash = Math.max(handoffFlash, (travel - 0.9) / 0.1)
      } else if (isHandoff) {
        const settle = 1 - smoothstep(1.85, 2.2, localT)
        handoffFlash = Math.max(handoffFlash, settle)
      }
    }

    drawHandoff(handoffX, handoffY, handoffFlash)
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
  document.addEventListener("DOMContentLoaded", initCustomerServiceHero)
} else {
  initCustomerServiceHero()
}
