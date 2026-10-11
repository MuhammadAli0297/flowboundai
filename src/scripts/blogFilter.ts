function initBlogFilter() {
  const searchInput = document.querySelector<HTMLInputElement>("[data-blog-search]")
  // Real toggle buttons (aria-pressed), not checkboxes, since the filter bar moved from a plain
  // checkbox list to colored pills (see .category-pill in index.css); aria-pressed is both the
  // a11y state and the CSS hook the pill's active-fill styling keys off.
  const categoryButtons = document.querySelectorAll<HTMLButtonElement>("[data-category-filter]")
  const resetButton = document.querySelector<HTMLButtonElement>("[data-blog-reset]")
  // Every post on the site is present in the DOM (hidden if it's not on the current
  // paginated page), so search and category filters can match across all of them,
  // not just the ~9 cards this particular page happens to show by default.
  const cards = document.querySelectorAll<HTMLElement>("[data-post-card]")
  const resultsCount = document.querySelector<HTMLElement>("[data-blog-results-count]")
  const emptyState = document.querySelector<HTMLElement>("[data-blog-empty-state]")
  const pagination = document.querySelector<HTMLElement>("[data-blog-pagination]")

  if (!cards.length) return

  const total = cards.length
  const STORAGE_KEY = "blogListState"

  const activeCategories = () =>
    Array.from(categoryButtons)
      .filter((b) => b.getAttribute("aria-pressed") === "true")
      .map((b) => b.value)

  function applyFilters() {
    const query = (searchInput?.value ?? "").trim().toLowerCase()
    const checked = activeCategories()
    const isFiltering = query !== "" || checked.length > 0

    let visible = 0
    cards.forEach((card) => {
      let show: boolean
      if (isFiltering) {
        const matchesCategory = checked.length === 0 || checked.includes(card.dataset.category ?? "")
        const matchesSearch = query === "" || (card.dataset.search ?? "").includes(query)
        show = matchesCategory && matchesSearch
      } else {
        show = card.dataset.currentPage === "true"
      }
      card.classList.toggle("hidden", !show)
      if (show) visible++
    })

    if (resultsCount) resultsCount.textContent = `${visible} of ${total} posts`
    emptyState?.classList.toggle("hidden", visible !== 0)
    pagination?.classList.toggle("hidden", isFiltering)
  }

  // Reader loses their place otherwise: scrolled down or mid-filter, click into a post,
  // hit back, land at the hero on page 1. Saved on every interaction plus a throttled
  // scroll listener (so a plain scroll-then-click trip is covered too, not just a filter
  // change) and restored only on an actual back/forward navigation, via
  // performance.getEntriesByType("navigation"), not on a fresh visit from Nav's Blog
  // link, which should still start clean. Paired with blogBackLink.ts making "Back to
  // Blog" a real history.back() instead of a hardcoded href, so this fires there too.
  function saveState() {
    const state = {
      path: location.pathname,
      search: searchInput?.value ?? "",
      categories: activeCategories(),
      scrollY: window.scrollY,
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  function restoreState() {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return

    let state: { path: string; search: string; categories: string[]; scrollY: number }
    try {
      state = JSON.parse(raw)
    } catch {
      return
    }
    if (state.path !== location.pathname) return

    if (searchInput) searchInput.value = state.search
    categoryButtons.forEach((b) => b.setAttribute("aria-pressed", state.categories.includes(b.value) ? "true" : "false"))
    applyFilters()
    requestAnimationFrame(() => window.scrollTo(0, state.scrollY))
  }

  searchInput?.addEventListener("input", () => {
    applyFilters()
    saveState()
  })
  categoryButtons.forEach((b) =>
    b.addEventListener("click", () => {
      b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true")
      applyFilters()
      saveState()
    }),
  )
  resetButton?.addEventListener("click", () => {
    if (searchInput) searchInput.value = ""
    categoryButtons.forEach((b) => b.setAttribute("aria-pressed", "false"))
    applyFilters()
    saveState()
  })

  let scrollSaveTimer: number | undefined
  window.addEventListener(
    "scroll",
    () => {
      window.clearTimeout(scrollSaveTimer)
      scrollSaveTimer = window.setTimeout(saveState, 200)
    },
    { passive: true },
  )
  window.addEventListener("pagehide", saveState)

  const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
  if (navEntry?.type === "back_forward") restoreState()
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBlogFilter)
} else {
  initBlogFilter()
}
