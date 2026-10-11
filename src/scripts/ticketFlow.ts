// Drives the Ticket Flow widget in customer-service.astro's hero glass panel: four ticket cards
// reveal their outcome status in sequence on scroll-entry (each card's own stagger is pure CSS,
// keyed off its --step custom property), then the "3 auto-answered" badge reveals. Replays every
// time it scrolls into view, same replay-on-reentry rule as every other animation on this site.
// Same shape as decisionFeed.ts/supplierPing.ts.
// `export {}` makes this a module rather than an ambient script, see decisionFeed.ts's comment.
export {}
const SETTLE_MS = 950

function initTicketFlow() {
  const widget = document.getElementById("ticketFlowWidget")
  const badge = document.getElementById("ticketFlowBadge")
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
  document.addEventListener("DOMContentLoaded", initTicketFlow)
} else {
  initTicketFlow()
}
