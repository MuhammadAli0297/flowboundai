function initBlogFilter() {
  const searchInput = document.querySelector<HTMLInputElement>("[data-blog-search]")
  const checkboxes = document.querySelectorAll<HTMLInputElement>("[data-category-filter]")
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

  function applyFilters() {
    const query = (searchInput?.value ?? "").trim().toLowerCase()
    const checked = Array.from(checkboxes)
      .filter((c) => c.checked)
      .map((c) => c.value)
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
      categories: Array.from(checkboxes)
        .filter((c) => c.checked)
        .map((c) => c.value),
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
    checkboxes.forEach((c) => (c.checked = state.categories.includes(c.value)))
    applyFilters()
    requestAnimationFrame(() => window.scrollTo(0, state.scrollY))
  }

  searchInput?.addEventListener("input", () => {
    applyFilters()
    saveState()
  })
  checkboxes.forEach((c) =>
    c.addEventListener("change", () => {
      applyFilters()
      saveState()
    }),
  )
  resetButton?.addEventListener("click", () => {
    if (searchInput) searchInput.value = ""
    checkboxes.forEach((c) => (c.checked = false))
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
