/** Animated node-graph: signals stream into the decision engine and a decision streams out. */
export function DecisionGraphic() {
  const inputs = [
    { y: 40, label: "Inventory" },
    { y: 108, label: "Lead times" },
    { y: 176, label: "Open POs" },
    { y: 244, label: "Demand signal" },
  ]

  const pathFor = (y: number) => `M96,${y} C150,${y} 150,150 210,150`
  const outPath = "M270,150 C330,150 330,150 372,150"

  return (
    <div className="fb-float relative border border-fb-black bg-fb-black p-6 md:p-8">
      <svg viewBox="0 0 460 300" className="h-auto w-full" role="img" aria-label="Signals flowing into the Flowbound decision engine and out as a recommended action">
        <defs>
          <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 Z" fill="#468B79" />
          </marker>
        </defs>

        {/* connecting lines: inputs -> core, with streaming dash texture */}
        {inputs.map((inp, i) => (
          <path
            key={i}
            d={pathFor(inp.y)}
            fill="none"
            stroke="#1F4438"
            strokeWidth="1.5"
            className="fb-dash-flow"
          />
        ))}

        {/* traveling packets, staggered per input */}
        {inputs.map((inp, i) => (
          <circle key={`p-${i}`} r="3.2" fill="#8FD0B8">
            <animateMotion dur="2.2s" repeatCount="indefinite" begin={`${i * 0.4}s`} path={pathFor(inp.y)} />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.85;1" dur="2.2s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
          </circle>
        ))}

        {/* core -> output */}
        <path d={outPath} fill="none" stroke="#468B79" strokeWidth="1.5" markerEnd="url(#arrow)" className="fb-dash-flow" />
        <circle r="3.6" fill="#E6F2EE">
          <animateMotion dur="1.5s" repeatCount="indefinite" begin="1.6s" path={outPath} />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1.5s" repeatCount="indefinite" begin="1.6s" />
        </circle>

        {/* input nodes */}
        {inputs.map((inp, i) => (
          <g key={i}>
            <rect
              x="8"
              y={inp.y - 14}
              width="88"
              height="28"
              fill="none"
              stroke="#468B79"
              className={`fb-label-glow-${i + 1}`}
            />
            <text x="16" y={inp.y + 4} fill="#C7E3DA" fontSize="10" fontFamily="IBM Plex Mono, monospace">
              {inp.label}
            </text>
          </g>
        ))}

        {/* core engine node */}
        <g className="fb-core-breathe">
          <circle cx="240" cy="150" r="34" fill="none" stroke="#468B79" strokeWidth="1.5" className="fb-core-pulse-ring" />
          <circle cx="240" cy="150" r="34" fill="#003828" stroke="#468B79" strokeWidth="1.5" />
          <circle cx="240" cy="150" r="34" fill="none" stroke="#468B79" strokeWidth="1" strokeDasharray="2 4">
            <animateTransform attributeName="transform" type="rotate" from="0 240 150" to="360 240 150" dur="14s" repeatCount="indefinite" />
          </circle>
          <text x="240" y="146" textAnchor="middle" fill="#E6F2EE" fontSize="9.5" fontFamily="IBM Plex Mono, monospace">DECISION</text>
          <text x="240" y="158" textAnchor="middle" fill="#E6F2EE" fontSize="9.5" fontFamily="IBM Plex Mono, monospace">ENGINE</text>
        </g>

        {/* output node */}
        <rect x="374" y="128" width="78" height="44" className="fb-output-flash fb-output-glow" />
        <text x="413" y="146" textAnchor="middle" fill="#0A0A0A" fontSize="9" fontFamily="IBM Plex Mono, monospace" fontWeight="600">RECOMMENDED</text>
        <text x="413" y="160" textAnchor="middle" fill="#0A0A0A" fontSize="9" fontFamily="IBM Plex Mono, monospace" fontWeight="600">ACTION</text>
      </svg>
      <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-fb-green-300">
        Reorder quantity adjusted for Supplier B. A 6 day lead time delay was flagged.
      </p>
    </div>
  )
}
