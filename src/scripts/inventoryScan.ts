// Drives the Inventory Scan widget in inventory-tracking.astro's hero glass panel: a sweep bar
// crosses the stock-cell grid once per scroll-entry, each column lighting up as the sweep passes
// it (most settle in-stock, a few pre-flagged cells settle low), then the "flagged" badge reveals
// once the sweep finishes, replaying every time it scrolls into view, same replay-on-reentry rule
// as every other animation on this site. Same shape as reorderGauge.ts.
const SWEEP_MS = 1300

function initInventoryScan() {
  const grid = document.getElementById("inventoryScanGrid")
  const badge = document.getElementById("inventoryScanBadge")
  if (!grid || !badge) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  let timer: number | undefined

  function play() {
    window.clearTimeout(timer)
    if (reduced) {
      grid!.classList.add("is-playing")
      badge!.style.opacity = "1"
      return
    }
    grid!.classList.remove("is-playing")
    badge!.style.opacity = "0"
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        grid!.classList.add("is-playing")
      })
    })
    timer = window.setTimeout(() => {
      badge!.style.opacity = "1"
    }, SWEEP_MS)
  }

  function reset() {
    window.clearTimeout(timer)
    grid!.classList.remove("is-playing")
    badge!.style.opacity = "0"
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
  observer.observe(grid)
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInventoryScan)
} else {
  initInventoryScan()
}
