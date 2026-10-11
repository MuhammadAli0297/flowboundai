// Drives the Step Trace widget in how-it-works.astro's hero glass panel: a comet travels once
// along the 4-node path (Connect, Signal, Decide, Ask) on scroll-entry, each node lighting
// mint-deep in sequence as the comet reaches it, then a "Decision ready" badge reveals. Replays
// every time it scrolls into view, same replay-on-reentry rule as every other animation on this
// site. Same shape as reorderGauge.ts.
export {}

const SETTLE_MS = 1500

function initStepTrace() {
  const widget = document.getElementById("stepTraceWidget")
  const badge = document.getElementById("stepTraceBadge")
  if (!widget || !badge) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  let timer: number | undefined

  function settle() {
    widget!.classList.add("is-playing")
    badge!.style.opacity = "1"
  }

  function reset() {
    window.clearTimeout(timer)
    widget!.classList.remove("is-playing")
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
      widget!.classList.add("is-playing")
    })
    timer = window.setTimeout(() => {
      badge!.style.opacity = "1"
    }, SETTLE_MS)
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
  document.addEventListener("DOMContentLoaded", initStepTrace)
} else {
  initStepTrace()
}
