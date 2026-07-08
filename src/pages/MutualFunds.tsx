import { useState } from 'react'

import { siteConfig } from '../lib/siteConfig'
import { Button } from '../components/Button'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'
import { CalculatorShell } from '../components/calculators/CalculatorShell'
import { getCalculator } from '../lib/calculators/registry'

const categories = [
  {
    title: 'Equity Funds',
    description:
      'Growth-oriented schemes investing primarily in listed stocks. Designed for higher inflation-beating returns over long-term horizons (5+ years).',
    icon: '📈',
    badge: 'High Growth',
  },
  {
    title: 'Debt & Bond Funds',
    description:
      'Income-focused funds investing in government securities and corporate bonds. Ideal for capital preservation and lower volatility.',
    icon: '🛡️',
    badge: 'Stable Income',
  },
  {
    title: 'Hybrid / Balanced Advantage',
    description:
      'Dynamic funds that dynamically balance between equity and debt based on market valuations, providing built-in risk management.',
    icon: '⚖️',
    badge: 'Balanced Risk',
  },
  {
    title: 'ELSS (Tax-Saving Funds)',
    description:
      'Equity-linked savings schemes offering Section 80C tax deduction benefits up to ₹1.5 Lakh with the shortest lock-in period of just 3 years.',
    icon: '💡',
    badge: 'Tax Saving',
  },
  {
    title: 'Index & ETF Funds',
    description:
      'Passive schemes tracking major market indices like Nifty 50 or Sensex. Ultra-low expense ratios with transparent market exposure.',
    icon: '🌐',
    badge: 'Low Cost',
  },
  {
    title: 'Goal-Based SIP Portfolios',
    description:
      'Customized multi-fund baskets structured specifically for retirement, child education, or wealth accumulation milestones.',
    icon: '🎯',
    badge: 'Custom Strategy',
  },
]

export function MutualFunds() {
  const [mode, setMode] = useState<'sip' | 'lumpsum'>('sip')

  const sipCalculator = getCalculator('sip')
  const lumpsumCalculator = getCalculator('lumpsum')

  return (
    <>
      <Seo
        title={siteConfig.seo.mutualFunds.title}
        description={siteConfig.seo.mutualFunds.description}
        path="/mutual-funds"
      />

      <section className="grain-overlay bg-navy pt-36 pb-20 text-ivory relative overflow-hidden">
        <div className="container-main relative z-10">
          <SectionReveal>
            <p className="mb-3 text-xs font-semibold tracking-widest text-brass uppercase">
              Mutual Fund Distribution & SIP Advisory
            </p>
            <h1 className="max-w-3xl font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              Mutual funds, matched to your life goals.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-ivory/80 leading-relaxed">
              Access to 6,000+ schemes across 40+ top AMCs in India, rigorously selected based on risk-adjusted returns, portfolio overlap, and expense ratios.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Interactive SIP / Lumpsum Growth Simulator Widget (Addressing UX Report Page 6) */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-brass bg-navy/5 px-3 py-1.5 rounded-full border border-navy/10 inline-block mb-3">
                Interactive Wealth Simulator
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy">
                Visualize Your Wealth Creation Potential
              </h2>
              <p className="mt-3 text-muted">
                Adjust investment amount, tenure, and expected returns to see how compounding accelerates your savings.
              </p>
            </div>
          </SectionReveal>

          <div className="max-w-7xl mx-auto mb-8 grid lg:grid-cols-2 gap-10">
            <div className="flex bg-ivory p-1 rounded-2xl border border-line shadow-sm">
              <button
                type="button"
                onClick={() => setMode('sip')}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all ${
                  mode === 'sip' ? 'bg-navy text-ivory shadow-md' : 'text-ink hover:text-navy bg-transparent'
                }`}
              >
                Monthly SIP
              </button>
              <button
                type="button"
                onClick={() => setMode('lumpsum')}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all ${
                  mode === 'lumpsum' ? 'bg-navy text-ivory shadow-md' : 'text-ink hover:text-navy bg-transparent'
                }`}
              >
                One-Time Lumpsum
              </button>
            </div>
            <div className="hidden lg:block" />
          </div>
          
          <div className="max-w-7xl mx-auto">
            {mode === 'sip' && sipCalculator ? (
              <CalculatorShell key="sip" calculator={sipCalculator} />
            ) : mode === 'lumpsum' && lumpsumCalculator ? (
              <CalculatorShell key="lumpsum" calculator={lumpsumCalculator} />
            ) : null}
          </div>
        </div>
      </section>

      {/* Fund Categories Grid */}
      <section className="section-padding bg-ivory">
        <div className="container-main">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="mb-2 text-xs font-semibold tracking-widest text-brass uppercase">
                The Investment Universe
              </p>
              <h2 className="font-display text-3xl font-semibold text-navy">
                Fund Categories Explained
              </h2>
              <p className="mt-3 text-muted">
                We help you navigate the vast mutual fund landscape and construct a portfolio structured for your specific risk appetite.
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <SectionReveal key={cat.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-line bg-cream p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-brass/40 hover:shadow-xl flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl p-3 bg-ivory rounded-2xl border border-line shadow-sm group-hover:scale-110 transition-transform">
                        {cat.icon}
                      </span>
                      <span className="text-xs font-semibold tracking-wider uppercase text-brass bg-navy/5 px-3 py-1 rounded-full border border-navy/10">
                        {cat.badge}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-navy group-hover:text-brass transition-colors">
                      {cat.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted leading-relaxed">{cat.description}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="hairline" />

      {/* Why Invest via Distributor */}
      <section className="section-padding bg-cream">
        <div className="container-main max-w-4xl">
          <SectionReveal>
            <div className="bg-ivory rounded-3xl p-8 sm:p-12 border border-line shadow-card">
              <span className="text-xs font-semibold uppercase tracking-widest text-brass block mb-2">
                The Advisory Advantage
              </span>
              <h2 className="font-display text-3xl font-semibold text-navy">
                Why invest via a registered mutual fund distributor?
              </h2>
              <p className="mt-4 text-base text-muted leading-relaxed">
                As an AMFI-registered mutual fund distributor ({siteConfig.regulatory.arn}), TejasFinserv provides personalized scheme selection, ongoing portfolio rebalancing, and a dedicated single point of contact across multiple AMCs.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-6 pt-6 border-t border-line text-sm text-ink">
                <div className="flex items-start gap-3">
                  <span className="text-brass font-bold text-lg">✓</span>
                  <div>
                    <strong className="block text-navy font-semibold">Zero Direct Transaction Hassle</strong>
                    <span>We manage all KYC, nominee modifications, and AMC follow-ups digitally.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-brass font-bold text-lg">✓</span>
                  <div>
                    <strong className="block text-navy font-semibold">Emotional Anchor in Market Dips</strong>
                    <span>When markets correct, we prevent panic withdrawals and identify rebalancing opportunities.</span>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Market risk disclaimer */}
      <section className="bg-ivory py-10">
        <div className="container-main">
          <div className="rounded-2xl border border-brass/30 bg-cream p-6 text-center shadow-sm">
            <p className="text-xs sm:text-sm font-medium text-navy leading-relaxed">
              ⚠️ {siteConfig.regulatory.marketRiskNote}
            </p>
          </div>
        </div>
      </section>

      <section className="grain-overlay section-padding bg-navy text-center text-ivory relative overflow-hidden">
        <div className="container-main relative z-10">
          <SectionReveal>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">Start your compounding journey today.</h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory/80 text-lg">
              Open your mutual fund account online in minutes via AssetPlus or schedule a portfolio review.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href={siteConfig.onboardingUrl} external>
                Open Your Account Online
              </Button>
              <Button to="/contact" variant="ghost-light">
                Schedule Consultation
              </Button>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
