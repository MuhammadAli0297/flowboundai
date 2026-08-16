// Cursor-follow 3D tilt for [data-tilt] cards. Desktop-with-precise-pointer only, same guard as
// hoverGlow.ts, and the two are meant to be used together (glow tracks the cursor across the
// whole grid, tilt responds per-card).
function initCardTilt() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

  const cards = document.querySelectorAll<HTMLElement>("[data-tilt]")

  cards.forEach((card) => {
    let frame = 0
    let pending: { rx: number; ry: number } | null = null

    function paint() {
      frame = 0
      if (!pending) return
      card.style.transform = `perspective(900px) rotateX(${pending.rx}deg) rotateY(${pending.ry}deg) translateY(-3px)`
      pending = null
    }

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      pending = { rx: py * -7, ry: px * 7 }
      if (!frame) frame = requestAnimationFrame(paint)
    })

    card.addEventListener("mouseleave", () => {
      pending = null
      card.style.transform = ""
    })
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCardTilt)
} else {
  initCardTilt()
}
