// Generic magnetic pull for [data-magnetic] buttons/links: nudges the element a few px toward the
// cursor on hover, settling back on mouseleave via the transition in index.css. Same desktop-only
// guard as cardTilt.ts/hoverGlow.ts, and the same inline-style + rAF-batching shape as cardTilt.ts.
// A [data-magnetic] button drops Tailwind's hover:-translate-y-0.5 in markup: inline style.transform
// always wins over a class, so the two would otherwise fight silently.
function initMagneticButtons() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

  const targets = document.querySelectorAll<HTMLElement>("[data-magnetic]")

  targets.forEach((el) => {
    let frame = 0
    let pending: { x: number; y: number } | null = null

    function paint() {
      frame = 0
      if (!pending) return
      el.style.transform = `translate(${pending.x}px, ${pending.y}px)`
      pending = null
    }

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * 0.22
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3
      pending = { x, y }
      if (!frame) frame = requestAnimationFrame(paint)
    })

    el.addEventListener("mouseleave", () => {
      pending = null
      el.style.transform = ""
    })
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMagneticButtons)
} else {
  initMagneticButtons()
}
