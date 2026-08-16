// Canvas 2D hero background for /wholesale-account-management: "Ledger Sync". A fixed network
// hub sits among several wholesale account nodes, each carrying a small tier ring (ring size
// varies per node, standing in for pricing tier) and a steady checkmark. Unlike this page's
// sibling heroes, nothing here ever flags: every account breathes gently in the same phase,
// already in agreement. Every few seconds one synchronization wave ripples outward from the hub
// and sweeps past every account in turn, each flashing its checkmark bright as the wave passes,
// before everything settles back to calm. Drawing is clipped to the right side of the canvas so
// it can never paint over the hero copy, and the account field spans the clipped strip's full
// height. The hub itself stays fixed.

export {} // no imports of its own; keeps this a module instead of a global script, see
// askFlowboundHero.ts for why that matters

const CLIP_XF = 0.58
const HUB_XF = 0.66
const HUB_YF = 0.5
const SYNC_PERIOD = 6

const SHADOW = "#104866" // ocean-950
const BRIGHT = "#DBE9EE" // ocean-100
const PALE = "#C0D6DF" // ocean-200

type Account = { xf: number; yf: number; tier: 0 | 1 | 2 }

const TIER_RADII = [6, 9, 12]

const ACCOUNTS: Account[] = [
  { xf: 0.68, yf: 0.14, tier: 0 },
  { xf: 0.94, yf: 0.19, tier: 1 },
  { xf: 0.62, yf: 0.35, tier: 2 },
  { xf: 0.97, yf: 0.46, tier: 0 },
  { xf: 0.7, yf: 0.63, tier: 1 },
  { xf: 0.9, yf: 0.77, tier: 2 },
  { xf: 0.64, yf: 0.89, tier: 0 },
]

// "network" SectionIcon triangle, recentred and lightly scaled
const HUB_NODES: [number, number][] = [
  [-14, 11],
  [14, 11],
  [0, -16],
]

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t)
}

function initWholesaleAccountManagementHero() {
  const canvas = document.getElementById("wholesale-account-management-hero") as HTMLCanvasElement | null
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

  function drawCheck(x: number, y: number, scale: number, color: string, alpha: number) {
    ctx!.globalAlpha = alpha
    ctx!.beginPath()
    ctx!.moveTo(x - 3.2 * scale, y)
    ctx!.lineTo(x - 1 * scale, y + 2.4 * scale)
    ctx!.lineTo(x + 3.6 * scale, y - 2.8 * scale)
    ctx!.strokeStyle = color
    ctx!.lineWidth = 1.6
    ctx!.lineCap = "round"
    ctx!.lineJoin = "round"
    ctx!.stroke()
    ctx!.globalAlpha = 1
  }

  function drawHub(cx: number, cy: number, t: number) {
    const glowR = Math.min(width, height) * (0.18 + Math.sin(t * 0.6) * 0.01)
    const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, glowR)
    grad.addColorStop(0, "rgba(219,233,238,0.3)")
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
    const maxDist = Math.hypot(width, height)
    const cycleT = (t % SYNC_PERIOD) / SYNC_PERIOD
    const waveR = easeOutQuad(cycleT) * maxDist * 0.85

    // the sync wave itself, a thin expanding ring
    ctx!.beginPath()
    ctx!.arc(hubX, hubY, waveR, 0, Math.PI * 2)
    ctx!.strokeStyle = `rgba(219,233,238,${(0.25 * (1 - cycleT)).toFixed(3)})`
    ctx!.lineWidth = 1.5
    ctx!.stroke()

    // unison idle breathing, same phase for every account
    const breathe = Math.sin(t * 1.1) * 0.5

    ACCOUNTS.forEach((a) => {
      const x = a.xf * width
      const y = a.yf * height
      const dist = Math.hypot(x - hubX, y - hubY)

      ctx!.beginPath()
      ctx!.moveTo(x, y)
      ctx!.lineTo(hubX, hubY)
      ctx!.strokeStyle = "rgba(219,233,238,0.08)"
      ctx!.lineWidth = 1
      ctx!.stroke()

      const proximity = Math.max(0, 1 - Math.abs(waveR - dist) / 55)
      const flash = proximity * proximity

      const tierR = TIER_RADII[a.tier] + breathe
      ctx!.beginPath()
      ctx!.arc(x, y, tierR, 0, Math.PI * 2)
      ctx!.strokeStyle = `rgba(219,233,238,${(0.14 + flash * 0.4).toFixed(3)})`
      ctx!.lineWidth = 1.1
      ctx!.stroke()

      const dotR = 2.6 + breathe * 0.4 + flash * 1.4
      ctx!.beginPath()
      ctx!.arc(x, y, Math.max(dotR, 1.5), 0, Math.PI * 2)
      ctx!.fillStyle = flash > 0.15 ? BRIGHT : PALE
      ctx!.globalAlpha = 0.55 + flash * 0.45
      ctx!.fill()
      ctx!.globalAlpha = 1

      if (flash > 0.1) {
        const glowR = 10 + flash * 8
        const grad = ctx!.createRadialGradient(x, y, 0, x, y, glowR)
        grad.addColorStop(0, `rgba(219,233,238,${(flash * 0.35).toFixed(3)})`)
        grad.addColorStop(1, "rgba(219,233,238,0)")
        ctx!.beginPath()
        ctx!.arc(x, y, glowR, 0, Math.PI * 2)
        ctx!.fillStyle = grad
        ctx!.fill()
      }

      drawCheck(x, y + tierR + 6, 0.9, flash > 0.15 ? BRIGHT : PALE, 0.4 + flash * 0.6)
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
  document.addEventListener("DOMContentLoaded", initWholesaleAccountManagementHero)
} else {
  initWholesaleAccountManagementHero()
}
