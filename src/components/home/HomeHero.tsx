import { siteConfig } from '../../lib/siteConfig'
import { Button } from '../Button'
import { AmcMarquee } from './AmcMarquee'
import { HeroDecorations } from './HeroDecorations'
import { HeroSipPreview } from './HeroSipPreview'

interface HomeHeroProps {
  onDiscover: () => void
}

export function HomeHero({ onDiscover: _onDiscover }: HomeHeroProps) {
  void _onDiscover
  return (
    <>
      <section className="hero-home w-full bg-gradient-to-b from-navy to-navy-deep grain-overlay relative flex flex-col justify-center lg:min-h-[90vh] overflow-hidden text-ivory">
        <HeroDecorations />

        <div className="hero-grid container-main relative z-10 pt-36 pb-24 lg:pt-40 lg:pb-28">
          <div className="hero-copy min-w-0">
            <p className="hero-reveal hero-reveal-1 mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-brass">
              {siteConfig.tagline} · Vijayawada
            </p>
            <h1 className="hero-reveal hero-reveal-2 font-display text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[1.05]">
              <span className="hero-headline-line">
                An investment in <span className="text-brass">knowledge</span>
              </span>{' '}
              <span className="hero-headline-line">pays the best interest.</span>
            </h1>
            <p className="hero-reveal hero-reveal-2 mt-3 text-sm italic text-ivory/50">— Benjamin Franklin</p>
            <p className="hero-reveal hero-reveal-3 mt-6 max-w-lg text-lg leading-relaxed text-ivory/80">
              AMFI-registered mutual fund distributor ({siteConfig.regulatory.arn}). Start a SIP across 40+ fund houses,
              link it to your goals, and stay protected with health, term &amp; vehicle insurance.
              Simple explanations, no pressure.
            </p>
            <div className="hero-reveal hero-reveal-4 mt-10 flex flex-wrap gap-4">
              <Button href={siteConfig.onboardingUrl} external showArrow>
                Start Your SIP
              </Button>
              <a
                href={`${siteConfig.contact.whatsappUrl}?text=${encodeURIComponent('Hi Phani, I would like a free review of my mutual fund portfolio.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#25D366] px-6 py-3 text-sm font-semibold text-ivory transition-all hover:bg-[#25D366]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.49.07-1.12.1-1.8-.11a16.4 16.4 0 0 1-1.63-.6c-2.87-1.24-4.74-4.13-4.89-4.32-.14-.19-1.17-1.56-1.17-2.97s.74-2.11 1-2.4c.26-.29.57-.36.76-.36h.55c.18 0 .41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.1.19-.14.31-.29.48-.14.17-.3.38-.43.5-.14.14-.29.3-.12.59.17.29.74 1.22 1.59 1.98 1.09.98 2.01 1.28 2.3 1.42.29.14.45.12.62-.07.17-.19.71-.83.9-1.12.19-.29.38-.24.64-.14.26.1 1.67.79 1.95.93.29.14.48.21.55.33.07.12.07.69-.17 1.37z"/></svg>
                Free portfolio review
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <span className="hero-chip-schemes-wrap hidden min-[480px]:block">
              <span className="hero-chip hero-float-delayed inline-block rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap text-ivory/80">
                6,000+ schemes
              </span>
            </span>
            <span className="hero-chip-amcs-wrap">
              <span className="hero-chip hero-float inline-block rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap text-ivory/80">
                40+ AMCs
              </span>
            </span>
            <HeroSipPreview />
          </div>
        </div>

        <a
          href="#who-we-are"
          className="hero-scroll-cue absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/40 transition-colors hover:text-brass-soft"
          aria-label="Scroll to content"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest">Scroll</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 4v12M5 11l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>

      <AmcMarquee />
    </>
  )
}
