import { useRef, useState } from "react"

const steps = [
  {
    n: "01",
    title: "Connect your systems",
    body: "Point Flowbound at your ERP, spreadsheets, or supplier feeds. No migration, no new system of record.",
  },
  {
    n: "02",
    title: "The engine reads the signal",
    body: "Inventory levels, lead times, open orders, and demand history get reconciled continuously, not once a month.",
  },
  {
    n: "03",
    title: "You get a decision, not a dashboard",
    body: "Reorder 400 units from Supplier B, expedite shipment #4471, or hold the PO to Supplier A. Every call comes with the reasoning attached.",
  },
  {
    n: "04",
    title: "Ask it anything",
    body: "The same engine answers your team's questions in plain language, pulling from the same live data behind the decision.",
  },
]

const GLOW_SIZE = 420

export function HowItWorks() {
  const gridRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const grid = gridRef.current
    const glow = glowRef.current
    if (!grid || !glow) return
    const rect = grid.getBoundingClientRect()
    const x = e.clientX - rect.left - GLOW_SIZE / 2
    const y = e.clientY - rect.top - GLOW_SIZE / 2
    glow.style.transform = `translate(${x}px, ${y}px)`
  }

  return (
    <section id="how-it-works" className="border-b border-fb-black/10 bg-fb-white py-20 md:py-28">
      <div className="container-fb">
        <div className="max-w-xl">
          <p className="eyebrow mb-4">How it works</p>
          <h2 className="text-[1.9rem] font-semibold leading-tight tracking-tight text-fb-black md:text-[2.2rem]">
            From raw signal to a decision you can act on.
          </h2>
        </div>

        <div
          ref={gridRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative mt-12 grid grid-cols-1 gap-6 overflow-hidden md:grid-cols-4"
        >
          {steps.map((s) => (
            <div
              key={s.n}
              className="group relative z-10 overflow-hidden border border-fb-green-400/30 bg-fb-green-50 p-8 transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-fb-green-500/40"
            >
              <span className="font-mono text-sm text-fb-green-500">{s.n}</span>
              <h3 className="relative z-30 mt-3 text-[1.05rem] font-semibold leading-snug text-fb-black">{s.title}</h3>
              <p className="relative z-30 mt-3 text-[0.92rem] leading-relaxed text-fb-black">{s.body}</p>
              <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-fb-green-500 transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </div>
          ))}

          {/* rendered last so it paints on top of the cards; a soft white highlight
              tracks the cursor across the already-tinted pale green cards */}
          <div
            ref={glowRef}
            aria-hidden="true"
            className={`pointer-events-none absolute left-0 top-0 z-20 rounded-full mix-blend-screen blur-3xl transition-[transform,opacity] duration-700 ease-out ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
            style={{
              width: GLOW_SIZE,
              height: GLOW_SIZE,
              background: "radial-gradient(circle, rgba(255,255,255,0.55), transparent 70%)",
            }}
          />
        </div>
      </div>
    </section>
  )
}
