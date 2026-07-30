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

  searchInput?.addEventListener("input", applyFilters)
  checkboxes.forEach((c) => c.addEventListener("change", applyFilters))
  resetButton?.addEventListener("click", () => {
    if (searchInput) searchInput.value = ""
    checkboxes.forEach((c) => (c.checked = false))
    applyFilters()
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBlogFilter)
} else {
  initBlogFilter()
}
