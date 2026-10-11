// Drives the Inspection Line widget in quality-monitoring.astro's hero glass panel: five units
// travel a horizontal conveyor through a fixed checkpoint gate on scroll-entry, four settling past
// the gate on the main line (passed) and one dropping below it (flagged), then the "1 flagged"
// badge reveals. Replays every time it scrolls into view, same replay-on-reentry rule as every
// other animation on this site. Same shape as routePick.ts, except the flagged unit also moves
// vertically off the main line rather than just stopping short.
// `export {}` makes this a module rather than an ambient script, avoiding the top-level-const
// global collision documented on ticketFlow.ts/decisionFeed.ts.
export {}

const FLAGGED_INDEX = 3
const END_LEFT = [15, 34, 53, 72, 91] // percent, evenly spaced across the track, through the gate

function initInspectionLine() {
  const widget = document.getElementById("inspectionLineWidget")
  const badge = document.getElementById("inspectionLineBadge")
  if (!widget || !badge) return

  const units = Array.from(widget.querySelectorAll<HTMLElement>(".inspect-unit"))
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  let timer: number | undefined

  function settle() {
    units.forEach((unit, i) => {
      const flagged = i === FLAGGED_INDEX
      unit.style.left = `${END_LEFT[i]}%`
      unit.style.top = flagged ? "calc(50% + 15px)" : "50%"
      unit.classList.toggle("is-flagged", flagged)
      unit.classList.toggle("is-passed", !flagged)
    })
    badge!.style.opacity = "1"
  }

  function reset() {
    window.clearTimeout(timer)
    units.forEach((unit) => {
      unit.style.left = "4%"
      unit.style.top = "50%"
      unit.classList.remove("is-flagged", "is-passed")
    })
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
  document.addEventListener("DOMContentLoaded", initInspectionLine)
} else {
  initInspectionLine()
}
