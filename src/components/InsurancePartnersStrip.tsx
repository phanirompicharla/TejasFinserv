import { insurancePartners } from '../lib/clientLogos'
import { AmcLogo } from './AmcLogo'
import { SectionReveal } from './SectionReveal'

export function InsurancePartnersStrip() {
  return (
    <section className="section-padding bg-ivory">
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
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {insurancePartners.map((partner, i) => (
            <SectionReveal key={partner.slug} delay={i * 60}>
              <AmcLogo name={partner.name} logo={partner.logo} />
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
