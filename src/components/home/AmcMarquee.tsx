import { resolvePartnerLogo } from '../../lib/clientLogos'
import { siteConfig } from '../../lib/siteConfig'
import { AmcLogo } from '../AmcLogo'

export function AmcMarquee() {
  const items = [...siteConfig.amcPartners, ...siteConfig.amcPartners]

  return (
    <section className="border-y border-line bg-ivory py-8" aria-label="Trusted AMC partners">
      <div className="container-main mb-5 text-center">
        <p className="text-sm font-medium text-muted">
          Distributing <span className="font-semibold text-navy">5,000+ schemes</span> across{' '}
          <span className="font-semibold text-navy">40+ AMCs</span>
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ivory to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ivory to-transparent" />
        <div className="hero-marquee-track flex w-max items-center gap-4 px-4">
          {items.map((amc, i) => (
            <AmcLogo
              key={`${amc.slug}-${i}`}
              name={amc.name}
              logo={resolvePartnerLogo(amc.slug)}
              variant="marquee"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
