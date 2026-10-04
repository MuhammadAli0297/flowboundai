// Generic FAQ accordion for the Hot Sauce rebuild's .bold-faq-row components. Each row is a
// <button aria-expanded> controlling a sibling answer element via aria-controls; toggling flips
// aria-expanded (drives the chevron rotation in CSS) and the answer's [hidden] attribute. Only one
// row open at a time per <div data-faq-list>, matching the single-open-accordion convention most
// docs/FAQ sections use.
export {}

const lists = document.querySelectorAll<HTMLElement>("[data-faq-list]")

lists.forEach((list) => {
  const rows = list.querySelectorAll<HTMLButtonElement>(".bold-faq-row")

  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const isOpen = row.getAttribute("aria-expanded") === "true"
      const answerId = row.getAttribute("aria-controls")
      const answer = answerId ? document.getElementById(answerId) : null

      rows.forEach((other) => {
        other.setAttribute("aria-expanded", "false")
        const otherId = other.getAttribute("aria-controls")
        const otherAnswer = otherId ? document.getElementById(otherId) : null
        otherAnswer?.setAttribute("hidden", "")
      })

      if (!isOpen) {
        row.setAttribute("aria-expanded", "true")
        answer?.removeAttribute("hidden")
      }
    })
  })
})
