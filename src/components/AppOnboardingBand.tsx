import laptopAppImg from '../assets/laptopapp.webp'
import { siteConfig } from '../lib/siteConfig'
import { howToSchema } from '../schema'
import { Button } from './Button'
import { SectionReveal } from './SectionReveal'

const steps = [
  'Complete KYC with your PAN and bank details',
  'Set your risk profile and investment preferences',
  'Start your first SIP or lumpsum investment',
]

export function AppOnboardingBand() {
  const howTo = howToSchema(
    'How to start investing with TejasFinserv',
    'Open your mutual fund account online through our secure AssetPlus onboarding platform.',
    steps
  )

  return (
    <section className="grain-overlay section-padding bg-navy text-ivory">
      <script type="application/ld+json">{JSON.stringify(howTo)}</script>
      <div className="container-main">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <SectionReveal>
            <p className="mb-3 text-sm font-semibold tracking-widest text-brass-soft uppercase">
              Start Investing
            </p>
            <h2 className="font-display text-3xl font-semibold lg:text-4xl">
              Download App / Open Your Account
            </h2>
            <p className="mt-4 max-w-xl text-ivory/80">
              Open your mutual fund account in minutes through our secure onboarding platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={siteConfig.onboardingUrl} external>
                Open Your Account
              </Button>
              <Button href={siteConfig.onboardingUrl} external variant="ghost-light">
                Invest Now
              </Button>
            </div>
          </SectionReveal>

          <SectionReveal delay={120}>
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none lg:ml-auto">
              <div
                className="pointer-events-none absolute inset-0 -z-10 scale-90 rounded-full bg-brass/15 blur-3xl"
                aria-hidden="true"
              />
              <img
                src={laptopAppImg}
                alt="TejasFinserv mutual fund onboarding app on laptop and mobile"
                width={640}
                height={480}
                loading="lazy"
                decoding="async"
                className="w-full object-contain drop-shadow-2xl"
              />
            </div>
          </SectionReveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <SectionReveal key={step} delay={i * 100}>
              <div className="flex h-full gap-4 rounded-2xl border border-ivory/10 bg-navy-deep/50 p-6">
                <span className="font-display shrink-0 text-3xl font-semibold leading-none text-brass">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-ivory/80">{step}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
