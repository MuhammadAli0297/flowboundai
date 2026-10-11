// Drives the Account Ladder widget in wholesale-account-management.astro's hero glass panel: a
// fill line climbs a 4-rung pricing-tier ladder once per scroll-entry, each passed rung's dot
// lighting mint-deep in sequence (the stagger itself is pure CSS, keyed off each rung's own
// --step custom property), then the "Terms applied" badge reveals. Replays every time it scrolls
// into view, same replay-on-reentry rule as every other animation on this site. Same shape as
// reorderGauge.ts, except the fill's target height is measured from the real rendered dot
// positions (getBoundingClientRect) rather than guessed pixel math, since rung spacing comes from
// flex layout, not a value this script controls directly.
const REACHED_INDEX = 2 // 0 = Tier 1 ... 3 = Tier 4; this account sits at Tier 3

function initAccountLadder() {
  const widget = document.getElementById("ladderWidget")
  const fill = document.getElementById("ladderFill")
  const badge = document.getElementById("ladderBadge")
  if (!widget || !fill || !badge) return

  const rungs = Array.from(widget.querySelectorAll<HTMLElement>(".ladder-rung"))
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  let timer: number | undefined

  function targetFillHeight() {
    const widgetRect = widget!.getBoundingClientRect()
    const bottomDot = rungs[0].querySelector(".ladder-dot")!.getBoundingClientRect()
    const targetDot = rungs[REACHED_INDEX].querySelector(".ladder-dot")!.getBoundingClientRect()
    const bottomCenter = bottomDot.top + bottomDot.height / 2 - widgetRect.top
    const targetCenter = targetDot.top + targetDot.height / 2 - widgetRect.top
    return Math.max(0, bottomCenter - targetCenter)
  }

  function settle() {
    rungs.forEach((rung, i) => {
      rung.classList.toggle("is-lit", i <= REACHED_INDEX)
      rung.classList.toggle("is-current", i === REACHED_INDEX)
    })
    fill!.style.height = `${targetFillHeight()}px`
    badge!.style.opacity = "1"
  }

  function reset() {
    window.clearTimeout(timer)
    rungs.forEach((rung) => {
      rung.classList.remove("is-lit", "is-current")
    })
    fill!.style.height = "0px"
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
  document.addEventListener("DOMContentLoaded", initAccountLadder)
} else {
  initAccountLadder()
}
