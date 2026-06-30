import { siteConfig } from '../../lib/siteConfig'
import { Button } from '../Button'
import { AmcMarquee } from './AmcMarquee'
import { HeroDecorations } from './HeroDecorations'
import { HeroSipPreview } from './HeroSipPreview'

interface HomeHeroProps {
  onDiscover: () => void
}

export function HomeHero({ onDiscover }: HomeHeroProps) {
  return (
    <>
      <section className="hero-home w-full bg-navy grain-overlay relative flex min-h-[92vh] items-center overflow-hidden text-ivory">
        <HeroDecorations />

        <div className="hero-grid container-main relative z-10 py-28 pb-20 min-[900px]:py-32 min-[900px]:pb-24">
          <div className="hero-copy min-w-0">
            <p className="hero-reveal hero-reveal-1 mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-brass">
              Trusted mutual fund guidance in Vijayawada
            </p>
            <h1 className="hero-reveal hero-reveal-2 font-display text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[1.05]">
              <span className="hero-headline-line">
                An investment with <span className="text-brass">knowledge</span>
              </span>{' '}
              <span className="hero-headline-line">pays the best interest.</span>
            </h1>
            <p className="hero-reveal hero-reveal-3 mt-6 max-w-lg text-lg leading-relaxed text-ivory/80">
              Personalized, data-driven financial guidance for individuals and businesses.
              Mutual fund distribution, financial planning, and insurance advisory.
            </p>
            <div className="hero-reveal hero-reveal-4 mt-10 flex flex-wrap gap-4">
              <Button href={siteConfig.onboardingUrl} external showArrow>
                Get Started
              </Button>
              <Button variant="ghost-light" onClick={onDiscover}>
                Discover More
              </Button>
            </div>
          </div>

          <div className="hero-visual">
            <span className="hero-chip-schemes-wrap hidden min-[480px]:block">
              <span className="hero-chip hero-float-delayed inline-block rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap text-ivory/80">
                5,000+ schemes
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
