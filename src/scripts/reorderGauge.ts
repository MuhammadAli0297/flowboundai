// Drives the Stock Gauge widget in reorder.astro's hero glass panel: the arc drains from 92% to
// 14%, crossing the 20% reorder threshold and revealing the "Triggered" badge, replaying every
// time it scrolls into view (and once on initial load, since the hero is already in view then),
// same replay-on-reentry rule as every other animation on this site. Same arc-length math as the
// Signal Primitives lab prototype this was built from.
const ARC = 173
const START = 92
const END = 14
const THRESHOLD = 20

function gaugeOffset(pct: number) {
  return ARC * (1 - pct / 100)
}

function initReorderGauge() {
  const card = document.getElementById("reorder-gauge")
  const fill = document.getElementById("reorderGaugeFill")
  const num = document.getElementById("reorderGaugeNum")
  const badge = document.getElementById("reorderGaugeBadge")
  if (!card || !fill || !num || !badge) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  let timer: number | undefined

  function setInstant(pct: number, triggered: boolean) {
    fill!.style.transition = "none"
    fill!.style.strokeDashoffset = String(gaugeOffset(pct))
    num!.textContent = `${Math.round(pct)}%`
    badge!.style.opacity = triggered ? "1" : "0"
    requestAnimationFrame(() => {
      fill!.style.transition = ""
    })
  }

  function play() {
    if (reduced) {
      setInstant(END, true)
      return
    }
    setInstant(START, false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill!.style.strokeDashoffset = String(gaugeOffset(END))
      })
    })
    window.clearInterval(timer)
    const steps = 20
    let i = 0
    timer = window.setInterval(() => {
      i++
      const pct = START + (END - START) * (i / steps)
      num!.textContent = `${Math.round(pct)}%`
      badge!.style.opacity = pct <= THRESHOLD ? "1" : "0"
      if (i >= steps) window.clearInterval(timer)
    }, 1600 / steps)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) play()
        else if (!reduced) setInstant(START, false)
      }
    },
    { threshold: 0.4 }
  )
  observer.observe(card)
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReorderGauge)
} else {
  initReorderGauge()
}
