function initHoverGlow() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

  const containers = document.querySelectorAll<HTMLElement>("[data-glow-container]")

  containers.forEach((container) => {
    const glow = container.querySelector<HTMLElement>("[data-glow]")
    if (!glow) return

    const size = Number(container.dataset.glowSize ?? 300)
    let frame = 0
    let pending: { x: number; y: number } | null = null

    function paint() {
      frame = 0
      if (!pending || !glow) return
      glow.style.transform = `translate(${pending.x}px, ${pending.y}px)`
      pending = null
    }

    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect()
      pending = {
        x: e.clientX - rect.left - size / 2,
        y: e.clientY - rect.top - size / 2,
      }
      if (!frame) frame = requestAnimationFrame(paint)
    })

    container.addEventListener("mouseenter", () => glow.classList.add("is-glow-active"))
    container.addEventListener("mouseleave", () => glow.classList.remove("is-glow-active"))
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHoverGlow)
} else {
  initHoverGlow()
}
