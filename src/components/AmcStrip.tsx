import { resolvePartnerLogo } from '../lib/clientLogos'
import { siteConfig } from '../lib/siteConfig'
import { AmcLogo } from './AmcLogo'
import { SectionReveal } from './SectionReveal'

export function AmcStrip() {
  return (
    <section className="section-padding bg-cream">
      <div className="container-main text-center">
        <SectionReveal>
          <p className="mb-3 text-sm font-semibold tracking-widest text-brass uppercase">
            AMC Partners
          </p>
          <h2 className="font-display text-2xl font-semibold text-navy">
            Access to {siteConfig.stats.amcs}+ Asset Management Companies
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Invest across India's leading mutual fund houses through a single, AMFI-registered distributor.
          </p>
        </SectionReveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {siteConfig.amcPartners.map((amc, i) => (
            <SectionReveal key={amc.slug} delay={i * 40}>
              <AmcLogo name={amc.name} logo={resolvePartnerLogo(amc.slug)} />
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
