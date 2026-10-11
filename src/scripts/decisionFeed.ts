// Drives the Decision Feed widget in ask-flowbound.astro's hero glass panel: a short feed of
// question/answer rows reveals in sequence on scroll-entry (each row's own stagger is pure CSS,
// keyed off its --step custom property), then the "Answered in 1.4s" badge reveals. Replays every
// time it scrolls into view, same replay-on-reentry rule as every other animation on this site.
// Same shape as supplierPing.ts.
// `export {}` makes this a module rather than an ambient script, so its top-level consts don't
// leak into global scope and collide with another widget script's same-named const (this file and
// ticketFlow.ts both declare SETTLE_MS; astro check caught the collision project-wide).
export {}
const SETTLE_MS = 950

function initDecisionFeed() {
  const widget = document.getElementById("feedWidget")
  const badge = document.getElementById("feedBadge")
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
  document.addEventListener("DOMContentLoaded", initDecisionFeed)
} else {
  initDecisionFeed()
}
