import { ALL_AMCS } from '../../lib/amcData'

export function AmcMarquee() {
  return (
    <section className="border-y border-line bg-ivory py-8 overflow-hidden" aria-label="Trusted AMC partners">
      <div className="container-main mb-5 text-center">
        <p className="text-sm font-medium text-muted">
          Distributing <span className="font-semibold text-navy">5,000+ schemes</span> across{' '}
          <span className="font-semibold text-navy">46 Asset Management Companies</span>
        </p>
      </div>
      <div className="relative overflow-hidden">
        {/* Fade gradients blending into the ivory background */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ivory to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ivory to-transparent" />
        
        <div className="amc-carousel-track amc-carousel-track-left">
          <div className="flex shrink-0 gap-6 pr-6">
            {ALL_AMCS.map((amc, i) => (
              <div
                key={`${amc.name}-${i}`}
                className="amc-carousel-item"
                title={amc.name}
              >
                <img
                  src={amc.logo}
                  alt={`${amc.name} logo`}
                  width={160}
                  height={60}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
          <div className="flex shrink-0 gap-6 pr-6">
            {ALL_AMCS.map((amc, i) => (
              <div
                key={`${amc.name}-dup-${i}`}
                className="amc-carousel-item"
                title={amc.name}
              >
                <img
                  src={amc.logo}
                  alt={`${amc.name} logo`}
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

