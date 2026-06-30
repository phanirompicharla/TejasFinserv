import { siteConfig } from '../lib/siteConfig'

interface ArnBadgeProps {
  variant?: 'light' | 'dark'
}

export function ArnBadge({ variant = 'dark' }: ArnBadgeProps) {
  const cls =
    variant === 'light'
      ? 'border-ivory/20 bg-ivory/10 text-ivory'
      : 'border-brass/30 bg-cream text-navy'

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-brass" aria-hidden="true" />
      {siteConfig.regulatory.badgeLabel}
    </span>
  )
}
