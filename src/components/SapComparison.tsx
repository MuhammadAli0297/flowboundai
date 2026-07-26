import { useRef, useState } from "react"

const rows = [
  {
    label: "Who it's built for",
    legacy: "Enterprise teams with a dedicated SI budget",
    flowbound: "Small and mid-sized businesses without one",
  },
  {
    label: "Time to a decision",
    legacy: "A consultant reviews the data and reports back in days",
    flowbound: "Continuous. The engine reads your signal in real time.",
  },
  {
    label: "Cost structure",
    legacy: "Licensing plus a consulting bill on top",
    flowbound: "One subscription, no SI required",
  },
  {
    label: "Rollout time",
    legacy: "Months of implementation and configuration",
    flowbound: "Connected in days",
  },
  {
    label: "Getting an answer",
    legacy: "File a ticket and wait for the consultant",
    flowbound: "Ask the agent directly and get context right away",
  },
]

const GLOW_SIZE = 300

export function SapComparison() {
  const sectionRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const section = sectionRef.current
    const glow = glowRef.current
    if (!section || !glow) return
    const rect = section.getBoundingClientRect()
    const x = e.clientX - rect.left - GLOW_SIZE / 2
    const y = e.clientY - rect.top - GLOW_SIZE / 2
    glow.style.transform = `translate(${x}px, ${y}px)`
  }

  return (
    <section
      id="sap"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative overflow-hidden border-b border-fb-black/10 bg-fb-black py-20 text-fb-white md:py-28"
    >
      {/* large, faint glow that trails the cursor across the whole section, using
          the same green and the same delayed easing as the hero's core glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 z-0 rounded-full blur-3xl transition-[transform,opacity] duration-700 ease-out ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          background:
            "radial-gradient(circle, rgba(70,139,121,0.4) 0%, rgba(70,139,121,0.14) 45%, transparent 75%)",
        }}
      />

      <div className="container-fb relative z-10">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-fb-green-400">Why not just use SAP</p>
          <h2 className="mt-4 text-[1.9rem] font-semibold leading-tight tracking-tight md:text-[2.2rem]">
            SAP isn't wrong. It just wasn't built for you.
          </h2>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-fb-white/60">
            SAP was priced and built for companies with a full consulting team on retainer. If that's not
            you, you're not the customer it was designed for, and that's not your fault. Flowbound gives
            small and mid-sized operations the same class of decision making, without the six-figure
            implementation and without the year-long rollout. We built this because we think you deserve the
            same clarity the big guys get, at a price that actually makes sense for you.
          </p>
        </div>

        <div className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-fb-white/15">
                <th className="w-1/4 py-4 pr-4 font-mono text-xs font-normal uppercase tracking-wider text-fb-white/40">&nbsp;</th>
                <th className="py-4 pr-8 font-mono text-xs font-normal uppercase tracking-wider text-fb-white/40">Legacy ERP plus consultants</th>
                <th className="py-4 font-mono text-xs font-normal uppercase tracking-wider text-fb-green-400">Flowbound</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-fb-white/10">
                  <td className="py-5 pr-4 text-[0.85rem] font-medium text-fb-white/50">{r.label}</td>
                  <td className="py-5 pr-8 text-[0.95rem] text-fb-white/55">{r.legacy}</td>
                  <td className="py-5 text-[0.95rem] text-fb-white">{r.flowbound}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
