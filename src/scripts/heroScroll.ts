// Drives the hero's scroll-linked fade/zoom (see Hero.astro's <style> block, which reads the
// --hero-scroll custom property this sets). Runs continuously off live layout, so it replays every
// time the section re-enters the viewport, scrolling down into it or back up into it, no reload
// required.
import { watchScrollProgress } from "./scrollProgress"

function initHeroScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  const section = document.getElementById("top")
  if (!section) return

  watchScrollProgress(section, (progress) => {
    section.style.setProperty("--hero-scroll", progress.toFixed(4))
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroScroll)
} else {
  initHeroScroll()
}
