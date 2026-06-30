interface AmcLogoProps {
  name: string
  logo: string
  variant?: 'card' | 'marquee'
}

export function AmcLogo({ name, logo, variant = 'card' }: AmcLogoProps) {
  if (variant === 'marquee') {
    return (
      <div className="flex h-14 shrink-0 items-center justify-center rounded-xl border border-line bg-cream px-5">
        <img
          src={logo}
          alt={name}
          width={140}
          height={48}
          loading="lazy"
          decoding="async"
          className="max-h-10 w-auto max-w-[140px] object-contain"
        />
      </div>
    )
  }

  return (
    <div className="flex h-[4.5rem] items-center justify-center rounded-2xl border border-line bg-ivory px-5 py-3 transition-shadow hover:shadow-card">
      <img
        src={logo}
        alt={name}
        width={160}
        height={56}
        loading="lazy"
        decoding="async"
        className="max-h-12 w-auto max-w-[160px] object-contain"
      />
    </div>
  )
}
