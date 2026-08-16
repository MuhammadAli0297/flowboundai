// Ties decorative watermark SectionIcons into the site's existing scroll-progress convention
// (see scrollProgress.ts, already used by heroScroll.ts and heroWave.ts) instead of leaving them
// fully static. Any element with [data-icon-drift] drifts gently as its own section scrolls
// through the viewport, reversing on scroll-up like every other scroll-linked animation on the
// site. Purely additive: the element still renders fine with --icon-drift unset.
import { watchScrollProgress } from "./scrollProgress"

function initIconDrift() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  document.querySelectorAll<HTMLElement>("[data-icon-drift]").forEach((el) => {
    const section = el.closest("section")
    if (!section) return
    watchScrollProgress(section as HTMLElement, (p) => {
      el.style.setProperty("--icon-drift", p.toFixed(4))
    })
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initIconDrift)
} else {
  initIconDrift()
}
