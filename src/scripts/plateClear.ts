// Drives the Plate Clear widget in how-it-works.astro's "what comes off your plate" section: each
// row of the manual-busywork list gets a checkmark and a strikethrough in sequence, one at a time
// (a real time-lapse, not a near-simultaneous flash), staggered via each row's own --step custom
// property (CSS handles the visual stagger; this file schedules matching timers so the tally
// counter ticks up in lockstep). Replays on scroll re-entry, same rule as every other animation on
// this site, and also replays on demand: once settled, #plateBadge becomes a click target that
// resets and restarts the whole sequence. Same shape as decisionFeed.ts/ticketFlow.ts.
export {}

// Must match index.css's `.plate-check`/`.plate-text` transition-delay (`calc(var(--step) *
// 480ms)`) so each row's JS-driven tally update lands in the same instant as its CSS-driven
// checkmark/strikethrough. No shared source for this value, keep both in sync by hand.
const STEP_MS = 480
const CHECK_MS = 400
const BADGE_BUFFER_MS = 250

function initPlateClear() {
  const listEl = document.getElementById("plateList")
  const tallyEl = document.getElementById("plateTally")
  const badgeEl = document.getElementById("plateBadge")
  if (!listEl || !tallyEl || !badgeEl) return
  const list = listEl
  const tally = tallyEl
  const badge = badgeEl

  const rows = Array.from(list.querySelectorAll<HTMLElement>(".plate-row"))
  const total = rows.length
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  let timers: number[] = []

  function clearTimers() {
    timers.forEach((t) => window.clearTimeout(t))
    timers = []
  }

  function showBadge() {
    badge.style.opacity = "1"
    badge.style.pointerEvents = "auto"
  }

  function hideBadge() {
    badge.style.opacity = "0"
    badge.style.pointerEvents = "none"
  }

  function settle() {
    rows.forEach((row) => row.classList.add("is-done"))
    tally.textContent = `${total} of ${total} automated`
    showBadge()
  }

  function reset() {
    clearTimers()
    rows.forEach((row) => row.classList.remove("is-done"))
    tally.textContent = `0 of ${total} automated`
    hideBadge()
  }

  // The actual staggered sequence, unconditional. The per-row CSS transitions it drives (the
  // checkmark fill, the strikethrough) still respect prefers-reduced-motion on their own (see the
  // `@media (prefers-reduced-motion: reduce)` rule in index.css, which forces those specific
  // transitions to `none`), so a reduced-motion visitor still doesn't get per-row motion. But the
  // tally counter ticking 0 -> 7 and the badge hiding then reappearing are plain text/opacity
  // changes driven by these timers, not transitions, so they stay visible regardless, which is
  // what actually confirms to a reduced-motion visitor that their click did something.
  function runSequence() {
    clearTimers()
    rows.forEach((row) => row.classList.remove("is-done"))
    tally.textContent = `0 of ${total} automated`
    hideBadge()
    requestAnimationFrame(() => {
      rows.forEach((row) => row.classList.add("is-done"))
    })
    rows.forEach((_, i) => {
      const t = window.setTimeout(() => {
        tally.textContent = `${i + 1} of ${total} automated`
      }, i * STEP_MS + CHECK_MS)
      timers.push(t)
    })
    const finalTimer = window.setTimeout(() => {
      showBadge()
    }, (total - 1) * STEP_MS + CHECK_MS + BADGE_BUFFER_MS)
    timers.push(finalTimer)
  }

  // Automatic, scroll-triggered entry: skips straight to the settled end state under reduced
  // motion, same as every other widget on the site (an ambient/autoplay effect is exactly what
  // that preference is meant to suppress).
  function play() {
    reset()
    if (reduced) {
      settle()
      return
    }
    runSequence()
  }

  // Real bug, found from a user report ("i dont see it working after clicking all clear") and
  // reproduced with Playwright's reducedMotion: "reduce" emulation (this dev machine, and the
  // user's own per the OS-level Reduce Motion note elsewhere in this file, run with that setting
  // on): clicking the badge used to call play(), which under reduced motion just calls reset()
  // then settle() synchronously in the same tick, same start and end state, zero visible change,
  // so the click appeared to do nothing at all. A deliberate click on a button labeled to replay
  // something is a user-requested action, not the kind of ambient motion prefers-reduced-motion is
  // meant to suppress (the same reasoning a system accessibility setting's own "preview" button
  // uses to still animate when clicked), so the click handler now always calls runSequence()
  // directly, bypassing the reduced check that only gates the automatic scroll-triggered path.
  badge.addEventListener("click", () => {
    runSequence()
  })

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) play()
        else if (!reduced) reset()
      }
    },
    { threshold: 0.3 }
  )
  observer.observe(list)
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPlateClear)
} else {
  initPlateClear()
}
