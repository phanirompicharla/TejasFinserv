import { useState } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../lib/siteConfig'
import { Button } from '../components/Button'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'

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
  const [amount, setAmount] = useState<number>(10000)
  const [years, setYears] = useState<number>(15)
  const [rate, setRate] = useState<number>(12)

  // SIP calculation formula
  const calculateSIP = (monthlyAmount: number, tenureYears: number, annualRate: number) => {
    const n = tenureYears * 12
    const r = annualRate / 12 / 100
    const invested = monthlyAmount * n
    const corpus = monthlyAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
    const returns = corpus - invested
    return { invested: Math.round(invested), returns: Math.round(returns), corpus: Math.round(corpus) }
  }

  // Lumpsum calculation formula
  const calculateLumpsum = (initialAmount: number, tenureYears: number, annualRate: number) => {
    const invested = initialAmount
    const corpus = initialAmount * Math.pow(1 + annualRate / 100, tenureYears)
    const returns = corpus - invested
    return { invested: Math.round(invested), returns: Math.round(returns), corpus: Math.round(corpus) }
  }

  const results =
    mode === 'sip'
      ? calculateSIP(amount, years, rate)
      : calculateLumpsum(amount * 10, years, rate)

  const investedPercent = Math.max(10, Math.min(90, Math.round((results.invested / results.corpus) * 100)))
  const returnsPercent = 100 - investedPercent

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`
    return `₹${val.toLocaleString('en-IN')}`
  }

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

          <div className="max-w-5xl mx-auto rounded-3xl border border-line bg-ivory shadow-2xl overflow-hidden grid md:grid-cols-12">
            {/* Controls Left */}
            <div className="md:col-span-7 p-6 sm:p-10 space-y-8 border-b md:border-b-0 md:border-r border-line">
              <div className="flex bg-cream p-1 rounded-2xl border border-line/60 w-fit">
                <button
                  type="button"
                  onClick={() => {
                    setMode('sip')
                    if (amount > 100000) setAmount(15000)
                  }}
                  className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                    mode === 'sip' ? 'bg-navy text-ivory shadow-md' : 'text-ink hover:text-navy'
                  }`}
                >
                  Monthly SIP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('lumpsum')
                    if (amount < 50000) setAmount(100000)
                  }}
                  className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                    mode === 'lumpsum' ? 'bg-navy text-ivory shadow-md' : 'text-ink hover:text-navy'
                  }`}
                >
                  One-Time Lumpsum
                </button>
              </div>

              {/* Amount Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy">
                    {mode === 'sip' ? 'Monthly Investment' : 'Initial Investment Amount'}
                  </label>
                  <span className="font-display text-xl font-bold text-navy bg-cream px-3 py-1 rounded-lg border border-line">
                    ₹{(mode === 'sip' ? amount : amount * 10).toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={mode === 'sip' ? 1000 : 10000}
                  max={mode === 'sip' ? 100000 : 1000000}
                  step={mode === 'sip' ? 1000 : 10000}
                  value={mode === 'sip' ? amount : amount * 10}
                  onChange={(e) =>
                    mode === 'sip'
                      ? setAmount(Number(e.target.value))
                      : setAmount(Number(e.target.value) / 10)
                  }
                  className="w-full accent-brass cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted mt-1 font-mono">
                  <span>{mode === 'sip' ? '₹1,000' : '₹10,000'}</span>
                  <span>{mode === 'sip' ? '₹1 Lakh/mo' : '₹10 Lakhs'}</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy">
                    Investment Time Horizon
                  </label>
                  <span className="font-display text-xl font-bold text-navy bg-cream px-3 py-1 rounded-lg border border-line">
                    {years} Years
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-brass cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted mt-1 font-mono">
                  <span>1 Year</span>
                  <span>15 Years</span>
                  <span>30 Years</span>
                </div>
              </div>

              {/* Return Rate Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy">
                    Expected Annual Return Rate
                  </label>
                  <span className="font-display text-xl font-bold text-navy bg-cream px-3 py-1 rounded-lg border border-line">
                    {rate}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={20}
                  step={0.5}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-brass cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted mt-1 font-mono">
                  <span>8% (Conservative)</span>
                  <span>12% (Moderate)</span>
                  <span>20% (Aggressive)</span>
                </div>
              </div>
            </div>

            {/* Results Right */}
            <div className="md:col-span-5 bg-navy text-ivory p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 bg-brass/15 rounded-full blur-3xl -mr-10 -mt-10" />

              <div className="space-y-6 relative z-10">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-brass block mb-1">
                    Estimated Wealth Corpus
                  </span>
                  <div className="font-display text-4xl sm:text-5xl font-bold text-ivory tracking-tight">
                    {formatINR(results.corpus)}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-ivory/15 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-ivory/70 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-ivory/40 inline-block" />
                      Total Amount Invested:
                    </span>
                    <span className="font-mono font-bold text-ivory">{formatINR(results.invested)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-brass flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-brass inline-block" />
                      Estimated Wealth Gain:
                    </span>
                    <span className="font-mono font-bold text-brass">{formatINR(results.returns)}</span>
                  </div>
                </div>

                {/* Visual Ratio Bar */}
                <div className="pt-2">
                  <div className="h-4 w-full bg-ivory/20 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${investedPercent}%` }}
                      className="bg-ivory/60 h-full transition-all duration-500"
                      title="Invested Capital"
                    />
                    <div
                      style={{ width: `${returnsPercent}%` }}
                      className="bg-brass h-full transition-all duration-500"
                      title="Compounding Growth"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-ivory/70 mt-2 font-mono">
                    <span>Invested ({investedPercent}%)</span>
                    <span>Growth Gain ({returnsPercent}%)</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 relative z-10 space-y-3">
                <Button href={siteConfig.onboardingUrl} external className="w-full shadow-lg">
                  Start This {mode === 'sip' ? 'SIP' : 'Investment'} Online
                </Button>
                <Link
                  to="/calculators"
                  className="block text-center text-xs text-brass underline hover:text-ivory transition-colors"
                >
                  Explore All 10+ Specialized Financial Calculators →
                </Link>
              </div>
            </div>
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
