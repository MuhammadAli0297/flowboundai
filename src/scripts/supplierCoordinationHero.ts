// Canvas 2D hero background for /supplier-coordination: "Supplier Pulse". A fixed network hub
// sits among several supplier nodes, each tied to it by a faint standing line. Most of the time
// everything just breathes quietly, a slow, small, steady pulse per node, standing in for calm
// suppliers nobody needs to think about. Every so often one supplier, a different one each cycle,
// escalates: its pulse speeds up and brightens, and a comet-trail signal travels from that node
// into the hub, flashing on arrival, before it settles back to calm. Unlike this site's other new
// hero canvases, which read as continuously busy, this one is meant to read as watchful stillness
// punctuated by a clear alert. Drawing is clipped to the right side of the canvas so it can never
// paint over the hero copy, and the node field spans the clipped strip's full height. The hub
// itself stays fixed.

export {} // no imports of its own; keeps this a module instead of a global script, see
// askFlowboundHero.ts for why that matters

const CLIP_XF = 0.58
const HUB_XF = 0.66
const HUB_YF = 0.5
const ESCALATE_PERIOD = 7

const SHADOW = "#104866" // ocean-950
const BRIGHT = "#DBE9EE" // ocean-100
const PALE = "#C0D6DF" // ocean-200

type Supplier = { xf: number; yf: number }

const SUPPLIERS: Supplier[] = [
  { xf: 0.68, yf: 0.12 },
  { xf: 0.93, yf: 0.17 },
  { xf: 0.62, yf: 0.33 },
  { xf: 0.97, yf: 0.42 },
  { xf: 0.7, yf: 0.62 },
  { xf: 0.9, yf: 0.74 },
  { xf: 0.64, yf: 0.86 },
  { xf: 0.98, yf: 0.9 },
]

// "network" SectionIcon triangle, recentred and lightly scaled
const HUB_NODES: [number, number][] = [
  [-14, 11],
  [14, 11],
  [0, -16],
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

function initSupplierCoordinationHero() {
  const canvas = document.getElementById("supplier-coordination-hero") as HTMLCanvasElement | null
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

  function drawHub(cx: number, cy: number, t: number, flashAlpha: number) {
    const glowR = Math.min(width, height) * (0.18 + Math.sin(t * 0.7) * 0.01 + flashAlpha * 0.05)
    const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, glowR)
    grad.addColorStop(0, `rgba(219,233,238,${(0.3 + flashAlpha * 0.35).toFixed(3)})`)
    grad.addColorStop(1, "rgba(219,233,238,0)")
    ctx!.beginPath()
    ctx!.arc(cx, cy, glowR, 0, Math.PI * 2)
    ctx!.fillStyle = grad
    ctx!.fill()

    ctx!.save()
    ctx!.translate(cx, cy)
    const scale = 1.7

    ctx!.beginPath()
    HUB_NODES.forEach(([px, py], i) => {
      const x = px * scale
      const y = py * scale
      if (i === 0) ctx!.moveTo(x, y)
      else ctx!.lineTo(x, y)
    })
    ctx!.strokeStyle = "rgba(219,233,238,0.5)"
    ctx!.lineWidth = 1.4
    ctx!.lineCap = "round"
    ctx!.stroke()

    HUB_NODES.forEach(([px, py]) => {
      ctx!.beginPath()
      ctx!.arc(px * scale, py * scale, 5, 0, Math.PI * 2)
      ctx!.fillStyle = SHADOW
      ctx!.strokeStyle = BRIGHT
      ctx!.lineWidth = 1.4
      ctx!.fill()
      ctx!.stroke()
    })
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

    const cyclePos = t / ESCALATE_PERIOD
    const escalating = Math.floor(cyclePos) % SUPPLIERS.length
    const escalateT = cyclePos - Math.floor(cyclePos)

    // envelope: ramps up 0.1-0.3, holds, ramps down 0.55-0.7, off otherwise
    const envelope = smoothstep(0.1, 0.3, escalateT) * (1 - smoothstep(0.55, 0.7, escalateT))
    // signal travel happens early in the active window
    const travel = smoothstep(0.15, 0.45, escalateT) * (escalateT < 0.5 ? 1 : 0)
    const arrived = escalateT >= 0.45 && escalateT < 0.55
    const flashAlpha = arrived ? 1 - smoothstep(0.45, 0.55, escalateT) : 0

    SUPPLIERS.forEach((s, i) => {
      const x = s.xf * width
      const y = s.yf * height

      // standing connection
      ctx!.beginPath()
      ctx!.moveTo(x, y)
      ctx!.lineTo(hubX, hubY)
      ctx!.strokeStyle = "rgba(219,233,238,0.08)"
      ctx!.lineWidth = 1
      ctx!.stroke()

      const isEscalating = i === escalating
      const idleR = 3 + Math.sin(t * 1.1 + i * 1.7) * 0.5
      const activeR = 3 + Math.sin(t * 6 + i) * 2

      const r = idleR + (activeR - idleR) * envelope
      const color = envelope > 0.05 ? BRIGHT : PALE
      const alpha = 0.35 + envelope * 0.65

      ctx!.globalAlpha = alpha
      ctx!.beginPath()
      ctx!.arc(x, y, Math.max(r, 1.5), 0, Math.PI * 2)
      ctx!.fillStyle = color
      ctx!.fill()
      ctx!.globalAlpha = 1

      if (envelope > 0.15) {
        const ringR = 8 + envelope * 10
        ctx!.beginPath()
        ctx!.arc(x, y, ringR, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(219,233,238,${(envelope * 0.4).toFixed(3)})`
        ctx!.lineWidth = 1.2
        ctx!.stroke()
      }

      if (isEscalating && travel > 0 && travel < 1) {
        for (let k = 0; k < 4; k++) {
          const st = Math.max(travel - k * 0.03, 0)
          const p = quadPoint(x, y, (x + hubX) / 2, (y + hubY) / 2, hubX, hubY, st)
          const a = (1 - k / 4) * 0.95
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, Math.max(3 - k * 0.5, 0.5), 0, Math.PI * 2)
          ctx!.fillStyle = k === 0 ? BRIGHT : `rgba(219,233,238,${a.toFixed(2)})`
          ctx!.fill()
        }
      }
    })

    drawHub(hubX, hubY, t, flashAlpha)

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
  document.addEventListener("DOMContentLoaded", initSupplierCoordinationHero)
} else {
  initSupplierCoordinationHero()
}
