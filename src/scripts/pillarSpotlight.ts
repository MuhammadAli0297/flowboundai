// Drives the Pillar Spotlight widget in product.astro's hero glass panel: a 2x2 grid of the
// page's own four real pillars (Decision Engine, Consulting Wrapper, Ask Flowbound, Web App),
// one highlighted at a time on a continuous loop, with a readout line showing that pillar's real
// title and a short blurb condensed from its own body copy below the grid. "No new shape, just
// the site's own tile system animated" per the approved Signal Primitives II concept: the
// highlight is the exact same .bold-tile-feature gradient ring every other featured tile on the
// site uses, just toggled by index instead of applied once statically. Unlike every settle-once
// widget elsewhere on the site, this one loops continuously while in view (same shape as
// signalRelay.ts): IntersectionObserver pauses the interval on scroll-away and resumes it on
// re-entry, rather than resetting to a blank state, since there's no single "done" pillar, the
// thesis is the rotation itself.
export {}

const PILLARS = [
  { tag: "Core", title: "Decision Engine", blurb: "Every signal that matters, watched around the clock." },
  { tag: "Reasoning", title: "Consulting Wrapper", blurb: "The reasoning comes attached to every recommendation." },
  { tag: "Interface", title: "Ask Flowbound", blurb: "Ask a question, get an answer from your live data." },
  { tag: "Workspace", title: "Web App", blurb: "One workspace, nothing separate to stitch together." },
]
const STEP_MS = 2600

function initPillarSpotlight() {
  const widget = document.getElementById("pillarSpotlightWidget")
  const titleEl = document.getElementById("pillarReadoutTitle")
  const blurbEl = document.getElementById("pillarReadoutBlurb")
  const dotsEl = document.getElementById("pillarDots")
  if (!widget || !titleEl || !blurbEl || !dotsEl) return

  const chips = Array.from(widget.querySelectorAll<HTMLElement>(".pillar-chip"))
  if (chips.length === 0) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  dotsEl.innerHTML = ""
  const dots = PILLARS.map(() => {
    const d = document.createElement("span")
    d.className = "pillar-dot"
    dotsEl.appendChild(d)
    return d
  })

  let index = 0
  let timer: number | undefined

  function render() {
    const item = PILLARS[index]
    titleEl!.textContent = item.title
    blurbEl!.textContent = item.blurb
    chips.forEach((chip, i) => {
      chip.classList.toggle("is-active", i === index)
      chip.classList.toggle("bold-tile-feature", i === index)
    })
    dots.forEach((d, i) => d.classList.toggle("active", i === index))
  }

  function step() {
    render()
    index = (index + 1) % PILLARS.length
  }

  function play() {
    if (reduced) {
      render()
      return
    }
    window.clearInterval(timer)
    step()
    timer = window.setInterval(step, STEP_MS)
  }

  function pause() {
    window.clearInterval(timer)
  }

  if (reduced) {
    render()
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) play()
        else pause()
      }
    },
    { threshold: 0.4 }
  )
  observer.observe(widget)
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPillarSpotlight)
} else {
  initPillarSpotlight()
}
