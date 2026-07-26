import { useRef, useState } from "react"

const modules = [
  {
    tag: "Core",
    title: "Decision Engine",
    body:
      "Keeps an eye on your inventory, lead times, and open purchase orders around the clock, and tells you what to do next. Reorder, hold, or reroute, before a stockout or an overbuy catches you off guard.",
  },
  {
    tag: "Reasoning",
    title: "Consulting Wrapper",
    body:
      "Every recommendation comes with the reasoning behind it, explained in plain language. It's the part you used to pay a consultant good money to walk you through.",
  },
  {
    tag: "Interface",
    title: "Ask Flowbound",
    body:
      "A chatbot that actually knows your supply chain. Ask why a reorder happened, or what a lead time slip would mean for next month, and get a real answer instead of a help doc.",
  },
]

const GLOW_SIZE = 420

export function ProductSystem() {
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
    <section id="product" className="border-b border-fb-black/10 bg-fb-white py-20 md:py-28">
      <div className="container-fb">
        <div className="max-w-xl">
          <p className="eyebrow mb-4">What Flowbound does</p>
          <h2 className="text-[1.9rem] font-semibold leading-tight tracking-tight text-fb-black md:text-[2.2rem]">
            One supply chain decision engine. Three ways to use it.
          </h2>
        </div>

        {/* mouse tracking is scoped to just this grid, so the glow can never
            wander off into the section's padding and look disconnected */}
        <div
          ref={gridRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative mt-12 grid grid-cols-1 gap-6 overflow-hidden md:grid-cols-3"
        >
          {modules.map((m) => (
            <div
              key={m.title}
              className="group relative z-10 overflow-hidden border border-fb-black/10 bg-fb-white p-8 transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-fb-green-500/35 hover:bg-fb-green-50/50"
            >
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-fb-green-500">
                {m.tag}
              </span>
              <h3 className="mt-3 text-[1.2rem] font-semibold leading-snug text-fb-black">{m.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-fb-black/65">{m.body}</p>
              <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-fb-green-500 transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </div>
          ))}

          {/* rendered last so it paints on top of the cards; mix-blend-multiply lets it
              tint straight through their opaque white background instead of hiding behind it */}
          <div
            ref={glowRef}
            aria-hidden="true"
            className={`pointer-events-none absolute left-0 top-0 z-20 rounded-full mix-blend-multiply blur-3xl transition-[transform,opacity] duration-700 ease-out ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
            style={{
              width: GLOW_SIZE,
              height: GLOW_SIZE,
              background: "radial-gradient(circle, rgba(0,88,64,0.16), transparent 70%)",
            }}
          />
        </div>
      </div>
    </section>
  )
}
