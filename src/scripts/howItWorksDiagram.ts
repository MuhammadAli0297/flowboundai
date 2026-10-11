// Drives HowItWorks.astro's annotated diagram: the connecting line fills in with real scroll
// position (via watchScrollProgress, same helper heroScroll.ts/missionScroll.ts use) instead of a
// one-shot fade-in, and each node/label lights up once the fill reaches it. Reverses cleanly on
// scroll-up, same as every other scroll-linked effect on the site, since progress is recomputed
// from live layout on every tick rather than triggered once.
import { watchScrollProgress } from "./scrollProgress"

function initHowItWorksDiagram() {
  const section = document.getElementById("how-it-works")
  const line = section?.querySelector<HTMLElement>("[data-diagram-line]")
  const nodes = section?.querySelectorAll<HTMLElement>("[data-diagram-node]")
  if (!section || !line || !nodes?.length) return

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    section.style.setProperty("--diagram-progress", "1")
    nodes.forEach((n) => {
      n.querySelector("[data-diagram-dot]")?.classList.add("is-lit")
      n.querySelector("[data-diagram-label]")?.classList.add("is-lit")
    })
    return
  }

  // The diagram sits roughly in the section's middle third, not right at its top (unlike
  // Mission's statement line), so it needs a smaller compression than Mission's 0.2 span, not a
  // tiny one: tuned so the line finishes drawing before the section's bottom (and the "see how it
  // works" button below it) scrolls past the viewport top.
  watchScrollProgress(section, (progress) => {
    const p = Math.min(Math.max(progress * 1.5, 0), 1)
    section.style.setProperty("--diagram-progress", p.toFixed(4))
    nodes.forEach((n) => {
      const x = Number(n.dataset.diagramNode ?? 0)
      const lit = p * 100 >= x - 4
      n.querySelector("[data-diagram-dot]")?.classList.toggle("is-lit", lit)
      n.querySelector("[data-diagram-label]")?.classList.toggle("is-lit", lit)
    })
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHowItWorksDiagram)
} else {
  initHowItWorksDiagram()
}
