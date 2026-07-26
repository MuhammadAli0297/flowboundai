/**
 * Full-bleed ambient hero background. Signals stream in from four clearly
 * marked sources and converge into a glowing decision core, then flow
 * onward. Same "dots into the engine" idea as before, rendered as
 * atmosphere rather than a labeled diagram.
 */
export function FlowBackground() {
  const coreX = 1180
  const coreY = 450

  const inputs = [
    { x: 150, y: 110 },
    { x: 190, y: 330 },
    { x: 130, y: 570 },
    { x: 175, y: 790 },
  ]

  const pathFor = (x: number, y: number) =>
    `M${x},${y} C${coreX * 0.45},${y} ${coreX * 0.7},${coreY} ${coreX - 46},${coreY}`

  const outPath = `M${coreX + 46},${coreY} C${coreX + 160},${coreY} ${coreX + 220},${coreY - 40} 1600,${coreY - 120}`

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <pattern id="fb-grid" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M64,0 L0,0 L0,64" fill="none" stroke="#1B4234" strokeWidth="1" />
        </pattern>
        <radialGradient id="fb-grid-fade" cx={`${(coreX / 1600) * 100}%`} cy={`${(coreY / 900) * 100}%`} r="80%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="70%" stopColor="white" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="fb-grid-mask">
          <rect width="1600" height="900" fill="url(#fb-grid-fade)" />
        </mask>
        <radialGradient id="fb-core-glow-outer" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#468B79" stopOpacity="0.38" />
          <stop offset="55%" stopColor="#468B79" stopOpacity="0.17" />
          <stop offset="100%" stopColor="#468B79" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fb-core-glow-inner" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8FD0B8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#468B79" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fb-source-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#468B79" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#468B79" stopOpacity="0" />
        </radialGradient>
        <marker id="fb-arrow-bg" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 Z" fill="#66AE95" fillOpacity="0.85" />
        </marker>
        {/* keeps the incoming lines dim under the headline text, then brings them
            up to full strength once they're clear of the text column */}
        <linearGradient id="fb-line-fade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0">
          <stop offset="0" stopColor="white" stopOpacity="0.1" />
          <stop offset="0.5" stopColor="white" stopOpacity="0.1" />
          <stop offset="0.68" stopColor="white" stopOpacity="0.5" />
          <stop offset="0.8" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="fb-line-fade-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900">
          <rect width="1600" height="900" fill="url(#fb-line-fade)" />
        </mask>
      </defs>

      {/* backdrop grid, faded toward the core */}
      <rect width="1600" height="900" fill="url(#fb-grid)" mask="url(#fb-grid-mask)" />

      {/* big soft glow behind the core, plus a brighter tighter core glow */}
      <circle cx={coreX} cy={coreY} r="640" fill="url(#fb-core-glow-outer)" />
      <circle cx={coreX} cy={coreY} r="300" fill="url(#fb-core-glow-inner)" />

      {/* incoming signal streams, dimmed under the text via fb-line-fade-mask */}
      {inputs.map((inp, i) => (
        <g key={i}>
          <g mask="url(#fb-line-fade-mask)">
            <path d={pathFor(inp.x, inp.y)} fill="none" stroke="#2C6E58" strokeWidth="2" strokeOpacity="0.8" />
            <circle r="4" fill="#8FD0B8">
              <animateMotion dur="4.2s" repeatCount="indefinite" begin={`${i * 0.7}s`} path={pathFor(inp.x, inp.y)} />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.85;1" dur="4.2s" repeatCount="indefinite" begin={`${i * 0.7}s`} />
            </circle>
          </g>

          {/* clearly marked source hub */}
          <circle cx={inp.x} cy={inp.y} r="60" fill="url(#fb-source-glow)" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1={inp.x + Math.cos((angle * Math.PI) / 180) * 26}
              y1={inp.y + Math.sin((angle * Math.PI) / 180) * 26}
              x2={inp.x + Math.cos((angle * Math.PI) / 180) * 36}
              y2={inp.y + Math.sin((angle * Math.PI) / 180) * 36}
              stroke="#66AE95"
              strokeWidth="2"
              strokeOpacity="0.55"
            />
          ))}
          <circle cx={inp.x} cy={inp.y} r="20" fill="#0C1F19" stroke="#66AE95" strokeWidth="2" strokeOpacity="0.95" />
          <circle cx={inp.x} cy={inp.y} r="8" fill="#8FD0B8">
            <animate attributeName="opacity" values="0.65;1;0.65" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
          </circle>
          <circle cx={inp.x} cy={inp.y} r="20" fill="none" stroke="#8FD0B8" strokeOpacity="0.7" strokeWidth="1.5">
            <animate attributeName="r" values="20;40;20" dur="4.2s" repeatCount="indefinite" begin={`${i * 0.7}s`} />
            <animate attributeName="stroke-opacity" values="0.75;0;0.75" dur="4.2s" repeatCount="indefinite" begin={`${i * 0.7}s`} />
          </circle>
        </g>
      ))}

      {/* outgoing decision stream */}
      <path d={outPath} fill="none" stroke="#2C6E58" strokeWidth="2" strokeOpacity="0.75" markerEnd="url(#fb-arrow-bg)" />
      <circle r="4.4" fill="#E6F2EE">
        <animateMotion dur="2.4s" repeatCount="indefinite" begin="2.8s" path={outPath} />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="2.4s" repeatCount="indefinite" begin="2.8s" />
      </circle>

      {/* decision core */}
      <circle cx={coreX} cy={coreY} r="50" fill="none" stroke="#8FD0B8" strokeOpacity="0.6" className="fb-core-pulse-ring" style={{ transformOrigin: `${coreX}px ${coreY}px` }} />
      <circle cx={coreX} cy={coreY} r="32" fill="#003828" stroke="#66AE95" strokeWidth="2" />
      <circle cx={coreX} cy={coreY} r="32" fill="none" stroke="#8FD0B8" strokeWidth="1.2" strokeDasharray="2 5" strokeOpacity="0.8">
        <animateTransform attributeName="transform" type="rotate" from={`0 ${coreX} ${coreY}`} to={`360 ${coreX} ${coreY}`} dur="16s" repeatCount="indefinite" />
      </circle>
      <circle cx={coreX} cy={coreY} r="7" fill="#C7E3DA" />
    </svg>
  )
}
