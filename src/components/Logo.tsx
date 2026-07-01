import logoImg from '../assets/images/TEJAS SVG.svg'

interface LogoProps {
  className?: string
  imgClassName?: string
}

export function Logo({ className = '', imgClassName = 'h-12 w-auto' }: LogoProps) {
  return (
    <span className={`inline-flex items-center leading-none ${className}`}>
      <img
        src={logoImg}
        alt="TejasFinserv"
        width={150}
        height={60}
        loading="eager"
        decoding="async"
        className={`block object-contain object-left ${imgClassName}`}
      />
    </span>
  )
}
