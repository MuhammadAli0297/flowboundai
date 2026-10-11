// Generic FAQ accordion for the Hot Sauce rebuild's .bold-faq-row components. Each row is a
// <button aria-expanded> controlling a sibling .bold-faq-panel via aria-controls. Toggling flips
// aria-expanded, which drives both the chevron rotation and the panel's open/close animation in
// CSS (a grid-template-rows 0fr->1fr transition keyed off the button's sibling selector, not the
// panel's own attribute), plus aria-hidden on the panel itself for assistive tech, since a
// collapsed panel is still in the DOM (not [hidden]) to stay animatable. Only one row open at a
// time per <div data-faq-list>, matching the single-open-accordion convention most docs/FAQ
// sections use. Previously toggled the panel's [hidden] attribute directly, which snapped
// instantly with no animation (display:none has no transitionable intermediate state), flagged
// directly as not feeling "luxurious"; see index.css's .bold-faq-panel for the replacement.
export {}

const lists = document.querySelectorAll<HTMLElement>("[data-faq-list]")

lists.forEach((list) => {
  const rows = list.querySelectorAll<HTMLButtonElement>(".bold-faq-row")

  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const isOpen = row.getAttribute("aria-expanded") === "true"

      rows.forEach((other) => {
        other.setAttribute("aria-expanded", "false")
        const otherId = other.getAttribute("aria-controls")
        const otherAnswer = otherId ? document.getElementById(otherId) : null
        otherAnswer?.setAttribute("aria-hidden", "true")
      })

      if (!isOpen) {
        row.setAttribute("aria-expanded", "true")
        const answerId = row.getAttribute("aria-controls")
        const answer = answerId ? document.getElementById(answerId) : null
        answer?.setAttribute("aria-hidden", "false")
      }
    })
  })
})
