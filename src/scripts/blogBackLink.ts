// "Back to Blog" on a post page always pointed at a hardcoded /blog/ href, so a reader
// coming from page 2 of pagination, a tag page, or a scrolled/filtered position on the
// main grid landed back at the very top of page 1 instead of where they actually were.
// When the referrer really is a blog page, use real history.back() instead: a true back
// navigation, which browsers restore scroll position for, and which blogFilter.ts's own
// sessionStorage restore (keyed on the "back_forward" navigation type) also relies on.
// Falls through to the plain href for a direct visit (search engine, shared link, new
// tab) where there's no real "back" to return to.
document.querySelectorAll<HTMLAnchorElement>("[data-back-to-blog]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (window.history.length <= 1 || !document.referrer) return
    try {
      const referrer = new URL(document.referrer)
      if (referrer.origin === location.origin && referrer.pathname.startsWith("/blog")) {
        event.preventDefault()
        window.history.back()
      }
    } catch {
      // Malformed/unavailable referrer: fall through to the plain href.
    }
  })
})
