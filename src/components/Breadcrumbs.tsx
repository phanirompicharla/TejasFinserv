import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  name: string
  path?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  variant?: 'light' | 'dark'
}

export function Breadcrumbs({ items, variant = 'dark' }: BreadcrumbsProps) {
  const base = variant === 'light' ? 'text-ivory/60' : 'text-muted'
  const active = variant === 'light' ? 'text-ivory' : 'text-navy'
  const linkHover = variant === 'light' ? 'hover:text-brass-soft' : 'hover:text-brass'

  return (
    <nav aria-label="Breadcrumb" className={`mb-6 text-sm ${base}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.path && i < items.length - 1 ? (
              <Link to={item.path} className={`link-underline ${linkHover}`}>
                {item.name}
              </Link>
            ) : (
              <span className={i === items.length - 1 ? `${active} font-medium` : ''}>{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
