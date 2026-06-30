import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonVariant = 'primary' | 'ghost' | 'ghost-light'

interface ButtonBaseProps {
  variant?: ButtonVariant
  children: ReactNode
  className?: string
  showArrow?: boolean
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: undefined
  to?: undefined
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string
  external?: boolean
  to?: undefined
  type?: undefined
  onClick?: undefined
  disabled?: undefined
}

interface ButtonAsRouterLink extends ButtonBaseProps {
  to: string
  href?: undefined
  type?: undefined
  onClick?: undefined
  disabled?: undefined
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsRouterLink

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brass text-navy hover:bg-brass-soft hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(194,145,63,0.5)]',
  ghost:
    'border-2 border-navy text-navy bg-transparent hover:bg-navy hover:text-ivory hover:-translate-y-0.5',
  'ghost-light':
    'border-2 border-ivory/60 text-ivory bg-transparent hover:bg-ivory/10 hover:-translate-y-0.5',
}

const baseStyles =
  'group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brass disabled:opacity-50 disabled:pointer-events-none'

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-300 group-hover:translate-x-1"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  showArrow = false,
  ...props
}: ButtonProps) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`
  const content = (
    <>
      {children}
      {showArrow && <ArrowIcon />}
    </>
  )

  if ('href' in props && props.href) {
    const { href, external } = props
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {content}
      </Link>
    )
  }

  const { type = 'button', onClick, disabled } = props as ButtonAsButton
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  )
}
