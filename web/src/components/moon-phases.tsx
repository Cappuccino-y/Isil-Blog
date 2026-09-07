const PHASES = [
  '/moonphases/1-moon-new.svg',
  '/moonphases/2-moon-waxing-crescent-6.svg',
  '/moonphases/3-moon-first-quarter.svg',
  '/moonphases/4-moon-waxing-gibbous-6.svg',
  '/moonphases/5-moon-full.svg',
  '/moonphases/6-moon-waning-gibbous-6.svg',
  '/moonphases/7-moon-third-quarter.svg',
  '/moonphases/8-moon-waning-crescent-6.svg',
]

export function MoonPhases({
  height = 18,
  glass = false,
}: {
  height?: number
  glass?: boolean
}) {
  return (
    <div
      className={`moon-float-soft inline-flex items-center justify-between gap-2 ${
        glass
          ? 'moon-glass rounded-full px-4 py-2'
          : ''
      }`}
      aria-hidden="true"
    >
      {PHASES.map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          className="moon-phase block h-auto"
          style={{ height }}
        />
      ))}
    </div>
  )
}

export function Crescent({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <mask id="crescent-mask">
          <rect width="24" height="24" fill="white" />
          <circle cx="17.2" cy="6.8" r="7.4" fill="black" />
        </mask>
      </defs>
      <circle cx="11" cy="13" r="9" fill="currentColor" mask="url(#crescent-mask)" />
    </svg>
  )
}
