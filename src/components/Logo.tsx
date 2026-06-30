import logoImg from '../assets/images/TEJAS SVG.svg'

interface LogoProps {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center leading-none ${className}`}>
      <img
        src={logoImg}
        alt="TejasFinserv"
        width={150}
        height={60}
        loading="eager"
        decoding="async"
        className="block h-12 w-auto object-contain object-left"
      />
    </span>
  )
}
