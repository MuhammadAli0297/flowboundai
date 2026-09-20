export {}

const toggle = document.querySelector<HTMLButtonElement>("[data-mobile-menu-toggle]")
const panel = document.querySelector<HTMLElement>("[data-mobile-menu]")
const accordionToggles = panel ? Array.from(panel.querySelectorAll<HTMLButtonElement>("[data-accordion-toggle]")) : []

if (toggle && panel) {
  const closeAccordions = () => {
    accordionToggles.forEach((accordionToggle) => {
      const panelId = accordionToggle.getAttribute("aria-controls")
      const accordionPanel = panelId ? document.getElementById(panelId) : null
      accordionToggle.setAttribute("aria-expanded", "false")
      accordionPanel?.setAttribute("data-state", "closed")
    })
  }

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false")
    panel.setAttribute("data-state", "closed")
    closeAccordions()
  }

  const openMenu = () => {
    toggle.setAttribute("aria-expanded", "true")
    panel.setAttribute("data-state", "open")
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true"
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  })

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu)
  })

  // Every accordion (the top-level Services row, plus a nested one per expandable service like
  // Inventory/Supplier Management/Autonomous) is wired the same generic way: the toggle names its
  // own panel via aria-controls, so nesting them just works without any extra script code.
  accordionToggles.forEach((accordionToggle) => {
    const panelId = accordionToggle.getAttribute("aria-controls")
    const accordionPanel = panelId ? document.getElementById(panelId) : null
    if (!accordionPanel) return

    accordionToggle.addEventListener("click", () => {
      const isOpen = accordionToggle.getAttribute("aria-expanded") === "true"
      accordionToggle.setAttribute("aria-expanded", String(!isOpen))
      accordionPanel.setAttribute("data-state", isOpen ? "closed" : "open")
    })
  })

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu()
  })

  document.addEventListener("click", (event) => {
    const target = event.target as Node
    if (toggle.getAttribute("aria-expanded") !== "true") return
    if (panel.contains(target) || toggle.contains(target)) return
    closeMenu()
  })

  // Tailwind's `md` breakpoint (768px): the desktop nav takes over above it, so a menu left open
  // while resizing past that point (e.g. rotating a tablet, or a real desktop resize) shouldn't
  // stay open and fight the always-visible desktop nav underneath.
  const desktopQuery = window.matchMedia("(min-width: 768px)")
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) closeMenu()
  })
}
