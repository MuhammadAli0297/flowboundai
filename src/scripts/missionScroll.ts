// Drives Mission.astro's scroll-scrubbed statement line (see its <style> block, which reads the
// --mission-scroll custom property this sets on the section). Same pattern as heroScroll.ts: runs
// continuously off live layout, so each word's reveal reverses cleanly on scroll-up too.
import { watchScrollProgress } from "./scrollProgress"

function initMissionScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  const section = document.getElementById("smb")
  if (!section) return

  watchScrollProgress(section, (progress) => {
    section.style.setProperty("--mission-scroll", progress.toFixed(4))
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMissionScroll)
} else {
  initMissionScroll()
}
