import { ALL_AMCS } from '../lib/amcData'
import { siteConfig } from '../lib/siteConfig'
import { SectionReveal } from './SectionReveal'

export function AmcStrip() {
  // Split the 46 AMCs into two rows of 23 each
  const row1 = ALL_AMCS.slice(0, 23)
  const row2 = ALL_AMCS.slice(23)

  return (
    <section className="section-padding bg-cream overflow-hidden">
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

        <SectionReveal delay={100}>
          <div className="amc-carousel-container mt-10">
            {/* Smooth Edge Gradients */}
            <div className="amc-carousel-fade-left" />
            <div className="amc-carousel-fade-right" />

            {/* Row 1: Scrolling Left */}
            <div className="amc-carousel-track amc-carousel-track-left mb-6">
              <div className="flex shrink-0 gap-6 pr-6">
                {row1.map((amc, i) => (
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
                      style={amc.scale ? { transform: `scale(${amc.scale})` } : undefined}
                    />
                  </div>
                ))}
              </div>
              <div className="flex shrink-0 gap-6 pr-6">
                {row1.map((amc, i) => (
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
                      style={amc.scale ? { transform: `scale(${amc.scale})` } : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Scrolling Right */}
            <div className="amc-carousel-track amc-carousel-track-right">
              <div className="flex shrink-0 gap-6 pr-6">
                {row2.map((amc, i) => (
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
                      style={amc.scale ? { transform: `scale(${amc.scale})` } : undefined}
                    />
                  </div>
                ))}
              </div>
              <div className="flex shrink-0 gap-6 pr-6">
                {row2.map((amc, i) => (
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
                      style={amc.scale ? { transform: `scale(${amc.scale})` } : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
