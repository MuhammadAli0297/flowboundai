// Drives the Route Pick widget in shipping-optimization.astro's hero glass panel: four carrier
// lanes race a dot toward their own quoted distance, replaying every time it scrolls into view.
// Three lanes stop short and dim; the winning lane (the one Flowbound actually recommended) runs
// the full track and stays lit, then the "Selected" badge reveals. Same shape as
// reorderGauge.ts/inventoryScan.ts.
const LANE_ENDS = [58, 71, 100, 64]
const RUN_MS = 1300

function initRoutePick() {
  const root = document.getElementById("routePickLanes")
  const badge = document.getElementById("routePickBadge")
  if (!root || !badge) return

  const lanes = Array.from(root.querySelectorAll<HTMLElement>(".route-lane"))
  const dots = lanes.map((lane) => lane.querySelector<HTMLElement>(".route-dot")!)
  const fills = lanes.map((lane) => lane.querySelector<HTMLElement>(".route-fill")!)
  const winners = lanes.map((lane) => lane.dataset.winner === "true")
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  let timer: number | undefined

  function reset() {
    window.clearTimeout(timer)
    fills.forEach((f) => (f.style.width = "0%"))
    dots.forEach((d) => {
      d.style.left = "0%"
      d.style.opacity = "0"
    })
    badge!.style.opacity = "0"
  }

  function settle() {
    LANE_ENDS.forEach((end, i) => {
      fills[i].style.width = `${end}%`
      dots[i].style.left = `${end}%`
      dots[i].style.opacity = winners[i] ? "1" : "0.35"
    })
    badge!.style.opacity = "1"
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
        LANE_ENDS.forEach((end, i) => {
          dots[i].style.opacity = "1"
          dots[i].style.left = `${end}%`
          fills[i].style.width = `${end}%`
        })
      })
    })
    timer = window.setTimeout(() => {
      dots.forEach((d, i) => {
        if (!winners[i]) d.style.opacity = "0.35"
      })
      badge!.style.opacity = "1"
    }, RUN_MS)
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
  observer.observe(root)
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initRoutePick)
} else {
  initRoutePick()
}
