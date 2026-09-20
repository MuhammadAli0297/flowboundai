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

  // threshold/rootMargin were previously 0.2 / "0px 0px -10% 0px": an element needed 20% of its
  // own height visible past a viewport already shrunk 10% from the bottom before it revealed,
  // measured empirically at a ~140px dead zone (the gap between an element's top edge crossing
  // the true screen bottom and .is-revealed actually landing). At normal scroll speed that gap
  // crosses in a fraction of a second and goes unnoticed; scrolled slowly, it reads as a stall,
  // content visibly sitting in the viewport doing nothing before the reveal fires all at once.
  // 0.05 / no margin brings that down to a few px, near-immediate without pre-triggering content
  // that's still off-screen (which would make the reveal invisible instead of just less delayed).
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("is-revealed", entry.isIntersecting)
      }
    },
    { threshold: 0.05, rootMargin: "0px" }
  )

  items.forEach((el) => observer.observe(el))
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollReveal)
} else {
  initScrollReveal()
}
