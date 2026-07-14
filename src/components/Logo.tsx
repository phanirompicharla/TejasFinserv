import logoImg from '../assets/images/TEJAS SVG2.svg'

interface LogoProps {
  className?: string
  imgClassName?: string
}

export function Logo({ className = '', imgClassName = 'h-12 w-auto' }: LogoProps) {
  return (
    <span className={`inline-flex items-center leading-none overflow-visible ${className}`}>
      <img
        src={logoImg}
        alt="TejasFinserv"
        loading="eager"
        decoding="async"
        crossOrigin="anonymous"
        className={`block object-contain object-left overflow-visible ${imgClassName}`}
      />
    </span>
  )
}
