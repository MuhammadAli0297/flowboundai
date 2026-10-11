// Drives the Signal Relay widget in services.astro's hero glass panel: a continuous ticker
// cycling through all 5 real services, each showing one real capability and a live-sounding
// readout (the same canonical numbers each service's own dedicated capability page already
// shows, e.g. Forecast Spark's +18%, Supplier Ping's "1 flagged"). Unlike every settle-once
// widget elsewhere on the site, this one loops continuously while in view: the
// IntersectionObserver pauses the interval when scrolled away and resumes it on re-entry, rather
// than resetting to a blank state. Respects prefers-reduced-motion by showing the first item
// statically with no cycling.
export {}

const RELAY_ITEMS = [
  { service: "Inventory", cap: "Demand Forecasting", readout: "SKU-2208, +18% projected" },
  { service: "Inventory", cap: "Shipping Optimization", readout: "Carrier C selected, 2 days" },
  { service: "Supplier Management", cap: "Supplier Coordination", readout: "1 lead time flagged" },
  { service: "Autonomous", cap: "Reorder", readout: "Order placed, threshold crossed" },
  { service: "Customer Service", cap: "Order Status & Tracking", readout: "3 of 4 tickets answered live" },
  { service: "Quality Monitoring", cap: "Inspection Tracking", readout: "1 unit flagged this batch" },
]
const STEP_MS = 1900

function initSignalRelay() {
  const widget = document.getElementById("signalRelayWidget")
  const serviceEl = document.getElementById("relayService")
  const capEl = document.getElementById("relayCap")
  const fillEl = document.getElementById("relayFill")
  const dotsEl = document.getElementById("relayDots")
  if (!widget || !serviceEl || !capEl || !fillEl || !dotsEl) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  dotsEl.innerHTML = ""
  const dots = RELAY_ITEMS.map(() => {
    const d = document.createElement("span")
    d.className = "relay-dot"
    dotsEl.appendChild(d)
    return d
  })

  let index = 0
  let timer: number | undefined

  function render() {
    const item = RELAY_ITEMS[index]
    serviceEl!.textContent = item.service
    capEl!.textContent = `${item.cap} — ${item.readout}`
    dots.forEach((d, i) => d.classList.toggle("active", i === index))
    if (reduced) {
      fillEl!.style.transition = "none"
      fillEl!.style.width = "100%"
      return
    }
    fillEl!.style.transition = "none"
    fillEl!.style.width = "0%"
    requestAnimationFrame(() => {
      fillEl!.style.transition = `width ${STEP_MS - 150}ms linear`
      fillEl!.style.width = "100%"
    })
  }

  function step() {
    render()
    index = (index + 1) % RELAY_ITEMS.length
  }

  function play() {
    if (reduced) {
      render()
      return
    }
    window.clearInterval(timer)
    step()
    timer = window.setInterval(step, STEP_MS)
  }

  function pause() {
    window.clearInterval(timer)
  }

  if (reduced) {
    render()
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) play()
        else pause()
      }
    },
    { threshold: 0.4 }
  )
  observer.observe(widget)
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSignalRelay)
} else {
  initSignalRelay()
}
