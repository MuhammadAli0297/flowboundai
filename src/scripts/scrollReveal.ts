// Generic scroll-in reveal: any element with [data-reveal] gets .is-revealed toggled based on
// viewport intersection. Toggled both ways (not just added once) so it replays every time a
// section re-enters view, scrolling down or back up, matching how the hero's animations behave.
function initScrollReveal() {
  const items = document.querySelectorAll<HTMLElement>("[data-reveal]")
  if (!items.length) return

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("is-revealed"))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("is-revealed", entry.isIntersecting)
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  )

  items.forEach((el) => observer.observe(el))
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollReveal)
} else {
  initScrollReveal()
}
