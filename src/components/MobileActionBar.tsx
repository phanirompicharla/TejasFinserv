import { Link } from 'react-router-dom'
import { siteConfig } from '../lib/siteConfig'

export function MobileActionBar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy/95 text-ivory border-t border-ivory/10 backdrop-blur-md px-3 py-2.5 flex items-center justify-around shadow-[0_-8px_24px_rgba(0,0,0,0.35)]">
      <a
        href={siteConfig.contact.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors px-2"
      >
        <span className="text-lg leading-none">💬</span>
        <span>WhatsApp</span>
      </a>

      <div className="h-6 w-[1px] bg-ivory/15" />

      <a
        href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
        className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-brass hover:text-brass-soft transition-colors px-2"
      >
        <span className="text-lg leading-none">📞</span>
        <span>Call Now</span>
      </a>

      <div className="h-6 w-[1px] bg-ivory/15" />

      <Link
        to="/calculators"
        className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-ivory hover:text-brass transition-colors px-2"
      >
        <span className="text-lg leading-none">🧮</span>
        <span>Calculators</span>
      </Link>
    </div>
  )
}
