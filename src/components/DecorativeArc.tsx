interface DecorativeArcProps {
  className?: string
}

export function DecorativeArc({ className = '' }: DecorativeArcProps) {
  return (
    <svg
      className={`pointer-events-none absolute opacity-[0.08] ${className}`}
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 380 Q200 20 380 380"
        stroke="var(--brass-soft)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M60 360 Q200 60 340 360"
        stroke="var(--brass)"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      <circle cx="200" cy="120" r="60" stroke="var(--brass-soft)" strokeWidth="0.75" fill="none" />
      <line x1="200" y1="60" x2="200" y2="180" stroke="var(--brass)" strokeWidth="0.5" opacity="0.4" />
      <line x1="140" y1="120" x2="260" y2="120" stroke="var(--brass)" strokeWidth="0.5" opacity="0.4" />
    </svg>
  )
}
