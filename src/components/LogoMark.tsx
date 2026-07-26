type LogoMarkProps = {
  size?: number
  className?: string
}

/** Inline recreation of the Flowbound mark: a black and green comma split by a white river. */
export function LogoMark({ size = 32, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fb-green-grad-inline" x1="60" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#468B79" />
          <stop offset="1" stopColor="#003828" />
        </linearGradient>
        <clipPath id="fb-circle-clip-inline">
          <circle cx="100" cy="100" r="100" />
        </clipPath>
      </defs>
      <g clipPath="url(#fb-circle-clip-inline)">
        <path
          d="M100,0 A100,100 0 0,0 100,200 A50,50 0 0,0 100,100 A50,50 0 0,1 100,0 Z"
          fill="#0A0A0A"
        />
        <path
          d="M100,0 A100,100 0 0,1 100,200 A50,50 0 0,1 100,100 A50,50 0 0,0 100,0 Z"
          fill="url(#fb-green-grad-inline)"
        />
        <path
          d="M100,-4 A52,52 0 0,1 100,100 A52,52 0 0,0 100,204"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="30"
          strokeLinecap="round"
        />
        <path d="M118,36 A20,20 0 0,1 128,54" fill="none" stroke="#0A0A0A" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
        <path d="M82,146 A20,20 0 0,1 72,164" fill="none" stroke="#0A0A0A" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function LogoLockup({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/logo.png" alt="Flowbound logo" width={30} height={30} className="h-[30px] w-[30px]" />
      <span
        className={`font-display text-[1.15rem] font-semibold tracking-tight ${
          dark ? "text-fb-white" : "text-fb-black"
        }`}
      >
        Flowbound<span className={dark ? "text-fb-green-400" : "text-fb-green-500"}>.ai</span>
      </span>
    </div>
  )
}
