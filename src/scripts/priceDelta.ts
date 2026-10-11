// Drives the Price Delta widget in pricing.astro's hero glass panel: a marker slides from the old
// price position to the new one along a bounded floor-to-ceiling track, a highlighted range
// segment growing to span the move, then the "+2.4%" badge reveals, replaying every time it
// scrolls into view, same replay-on-reentry rule as every other animation on this site. Same
// shape as reorderGauge.ts.
const OLD_PCT = 32
const NEW_PCT = 46

function initPriceDelta() {
  const widget = document.getElementById("priceDeltaWidget")
  const range = document.getElementById("deltaRange")
  const marker = document.getElementById("deltaMarker")
  const badge = document.getElementById("deltaBadge")
  if (!widget || !range || !marker || !badge) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  let timer: number | undefined

  function settle() {
    range!.style.left = `${OLD_PCT}%`
    range!.style.width = `${NEW_PCT - OLD_PCT}%`
    marker!.style.left = `${NEW_PCT}%`
    badge!.style.opacity = "1"
  }

  function reset() {
    window.clearTimeout(timer)
    range!.style.left = `${OLD_PCT}%`
    range!.style.width = "0%"
    marker!.style.left = `${OLD_PCT}%`
    badge!.style.opacity = "0"
  }

  function play() {
    window.clearTimeout(timer)
    if (reduced) {
      settle()
      return
    }
    reset()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        settle()
      })
    })
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) play()
        else if (!reduced) reset()
      }
    },
    { threshold: 0.4 }
  )
  observer.observe(widget)
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPriceDelta)
} else {
  initPriceDelta()
}
