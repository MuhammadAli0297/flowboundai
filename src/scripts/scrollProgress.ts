// Shared by heroScroll.ts (drives the CSS fade/zoom) and heroWave.ts (drives the Three.js camera).
// Reports how far a section has scrolled past the top of the viewport, as 0 (not yet scrolled to)
// to 1 (fully scrolled past). Recomputed from live layout on every tick, so it naturally reverses
// when the user scrolls back up: nothing is "played once" and stuck, it just tracks position.
export function watchScrollProgress(section: HTMLElement, onProgress: (progress: number) => void) {
  let frame = 0

  function paint() {
    frame = 0
    const rect = section.getBoundingClientRect()
    const total = rect.height || 1
    const scrolled = Math.min(Math.max(-rect.top, 0), total)
    onProgress(scrolled / total)
  }

  function onScroll() {
    if (!frame) frame = requestAnimationFrame(paint)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const isNear = entries[0]?.isIntersecting
      if (isNear) {
        paint()
        window.addEventListener("scroll", onScroll, { passive: true })
      } else {
        window.removeEventListener("scroll", onScroll)
      }
    },
    { rootMargin: "100% 0px 100% 0px" }
  )

  observer.observe(section)

  return () => {
    window.removeEventListener("scroll", onScroll)
    observer.disconnect()
  }
}
