// Drives the Supplier Ping widget in supplier-coordination.astro's hero glass panel: four
// supplier nodes breathe calmly around a central hub (pure CSS, always running); on scroll-entry
// one node escalates and sends a pulse into the hub along its line, then stays flagged and the
// "1 flagged" badge reveals, replaying every time it scrolls into view, same replay-on-reentry
// rule as every other animation on this site. Same shape as reorderGauge.ts.
const ESCALATE_MS = 1400

function initSupplierPing() {
  const diagram = document.getElementById("supplierPingDiagram")
  const node = document.getElementById("supplierPingNode")
  const badge = document.getElementById("supplierPingBadge")
  if (!diagram || !node || !badge) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  let timer: number | undefined

  function settle() {
    node!.classList.add("is-flagged")
    badge!.style.opacity = "1"
  }

  function reset() {
    window.clearTimeout(timer)
    diagram!.classList.remove("is-playing")
    node!.classList.remove("is-flagged")
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
      diagram!.classList.add("is-playing")
    })
    timer = window.setTimeout(settle, ESCALATE_MS)
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
  observer.observe(diagram)
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSupplierPing)
} else {
  initSupplierPing()
}
