import { siteConfig } from '../lib/siteConfig'
import { Button } from '../components/Button'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'

const categories = [
  {
    title: 'Equity',
    description:
      'Growth-oriented funds investing primarily in stocks. Higher risk, higher potential return over the long term.',
  },
  {
    title: 'Debt',
    description:
      'Stable, income-focused funds investing in bonds and fixed-income instruments. Lower volatility.',
  },
  {
    title: 'Hybrid',
    description:
      'Balanced funds combining equity and debt for moderate risk with diversified exposure.',
  },
  {
    title: 'ELSS (tax-saving)',
    description:
      'Equity-linked savings schemes with Section 80C benefits and a 3-year lock-in period.',
  },
  {
    title: 'Index / ETF',
    description:
      'Passive funds tracking market indices. Low-cost, transparent exposure to broad markets.',
  },
  {
    title: 'SIP-based investing',
    description:
      'Systematic Investment Plans that build discipline and harness rupee-cost averaging.',
  },
]

export function MutualFunds() {
  return (
    <>
      <Seo
        title={siteConfig.seo.mutualFunds.title}
        description={siteConfig.seo.mutualFunds.description}
        path="/mutual-funds"
      />

      <section className="grain-overlay bg-navy pt-32 pb-20 text-ivory">
        <div className="container-main">
          <p className="mb-3 text-sm font-semibold tracking-widest text-brass-soft uppercase">
            Mutual Funds
          </p>
          <h1 className="max-w-3xl font-display font-semibold">
            Mutual funds, matched to your goals.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/80">
            Access to 5,000+ schemes across 40+ AMCs, selected for your risk profile and
            investment horizon.
          </p>
        </div>
      </section>

      <section className="section-padding bg-ivory">
        <div className="container-main">
          <SectionReveal>
            <h2 className="font-display font-semibold text-navy">
              Fund categories explained
            </h2>
            <p className="mt-4 max-w-2xl text-muted">
              We help you navigate the vast mutual fund universe and select schemes that
              align with your objectives.
            </p>
          </SectionReveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <SectionReveal key={cat.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-line bg-cream p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brass/30 hover:shadow-card">
                  <h3 className="font-display text-lg font-semibold text-navy">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{cat.description}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="hairline" />

      <section className="section-padding bg-cream">
        <div className="container-main max-w-3xl">
          <SectionReveal>
            <h2 className="font-display font-semibold text-navy">
              Why invest via a distributor?
            </h2>
            <p className="mt-4 text-muted">
              As a registered mutual fund distributor ({siteConfig.regulatory.arn}),
              TejasFinserv provides personalized scheme selection, ongoing portfolio guidance,
              and a single point of contact across multiple AMCs. You benefit from expert
              curation without paying separate advisory fees on every transaction — and you
              always have someone to call when markets get turbulent or your goals change.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Market risk disclaimer */}
      <section className="bg-ivory py-12">
        <div className="container-main">
          <div className="rounded-2xl border border-brass/20 bg-cream p-6 text-center">
            <p className="text-sm font-medium text-navy">
              {siteConfig.regulatory.marketRiskNote}
            </p>
          </div>
        </div>
      </section>

      {/* SIP Highlight */}
      <section className="section-padding bg-ivory">
        <div className="container-main grid items-center gap-12 lg:grid-cols-2">
          <SectionReveal>
            <p className="mb-3 text-sm font-semibold tracking-widest text-brass uppercase">
              Start a SIP
            </p>
            <h2 className="font-display font-semibold text-navy">
              Small steps, compounding returns
            </h2>
            <p className="mt-4 text-muted">
              A Systematic Investment Plan lets you invest a fixed amount at regular
              intervals — building wealth steadily while smoothing out market volatility
              through rupee-cost averaging. Start with as little as you are comfortable
              with, and increase as your income grows.
            </p>
          </SectionReveal>
          <SectionReveal delay={100}>
            <div className="rounded-2xl border border-line bg-cream p-10 text-center shadow-card">
              <p className="font-display text-5xl font-semibold text-brass">SIP</p>
              <p className="mt-2 text-muted">Systematic Investment Plan</p>
              <div className="mt-8">
                <Button href={siteConfig.onboardingUrl} external>
                  Open Your Account
                </Button>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
