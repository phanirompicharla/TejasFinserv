import { insurancePartners as defaultInsurancePartners } from '../lib/clientLogos'
import { SectionReveal } from './SectionReveal'

interface InsurancePartnersStripProps {
  partners?: { name: string; slug: string; logo: string }[]
}

export function InsurancePartnersStrip({ partners = defaultInsurancePartners }: InsurancePartnersStripProps) {
  return (
    <section className="section-padding bg-ivory" aria-label="Trusted insurance partners">
      <div className="container-main text-center">
        <SectionReveal>
          <p className="mb-3 text-sm font-semibold tracking-widest text-brass uppercase">
            Insurance Partners
          </p>
          <h2 className="font-display text-2xl font-semibold text-navy">
            Trusted insurers we work with
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Compare and choose cover from leading insurance providers — guided by your needs, not sales targets.
          </p>
        </SectionReveal>
      </div>

      {/* Marquee carousel */}
      <div className="relative mt-10 overflow-hidden">
        {/* Fade gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ivory to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ivory to-transparent" />

        <div className="amc-carousel-track amc-carousel-track-left">
          {/* First set */}
          <div className="flex shrink-0 gap-6 pr-6">
            {partners.map((partner, i) => (
              <div
                key={`${partner.slug}-${i}`}
                className="amc-carousel-item"
                title={partner.name}
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={160}
                  height={60}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
          {/* Duplicate set for seamless infinite loop */}
          <div className="flex shrink-0 gap-6 pr-6">
            {partners.map((partner, i) => (
              <div
                key={`${partner.slug}-dup-${i}`}
                className="amc-carousel-item"
                title={partner.name}
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={160}
                  height={60}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
