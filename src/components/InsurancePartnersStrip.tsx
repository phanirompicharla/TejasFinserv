import { useState } from 'react'
import { insurancePartners as defaultInsurancePartners } from '../lib/clientLogos'
import { SectionReveal } from './SectionReveal'

interface Partner {
  name: string
  slug: string
  logo: string
}

interface InsurancePartnersStripProps {
  partners?: Partner[]
}

/** Returns up to 2 initials from significant words (skip short words like "of", "MS", "and") */
function getInitials(name: string): string {
  const words = name.split(/\s+/).filter((w) => w.length > 2)
  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

/** Single logo card with graceful onError fallback placeholder */
function LogoCard({ partner }: { partner: Partner }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="amc-carousel-item" title={partner.name}>
      {imgError ? (
        <div className="insurance-logo-placeholder">
          <span className="insurance-logo-initials">{getInitials(partner.name)}</span>
          <span className="insurance-logo-name">{partner.name}</span>
        </div>
      ) : (
        <img
          src={partner.logo}
          alt={`${partner.name} logo`}
          width={160}
          height={60}
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  )
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
              <LogoCard key={`${partner.slug}-${i}`} partner={partner} />
            ))}
          </div>
          {/* Duplicate set for seamless infinite loop */}
          <div className="flex shrink-0 gap-6 pr-6">
            {partners.map((partner, i) => (
              <LogoCard key={`${partner.slug}-dup-${i}`} partner={partner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
