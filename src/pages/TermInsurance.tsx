import { useState } from 'react'
import { siteConfig } from '../lib/siteConfig'
import { Button } from '../components/Button'
import { InsurancePartnersStrip } from '../components/InsurancePartnersStrip'
import { termInsurancePartners } from '../lib/clientLogos'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'

const termFeatures = [
  {
    title: '100% Pure Family Protection',
    description:
      'High sum assured at an extremely affordable premium. Unlike traditional endowment plans, every rupee of your premium goes towards securing financial protection for your family.',
    icon: '🛡️',
  },
  {
    title: 'Critical Illness Benefit Rider',
    description:
      'Provides an immediate lump-sum cash payout upon diagnosis of 30+ major illnesses (such as cancer, heart attack, kidney failure) to cover expensive medical treatments.',
    icon: '❤️‍🩹',
  },
  {
    title: 'Accidental Disability Support',
    description:
      'Crucial income replacement and lump-sum support against permanent or temporary accidental disability, ensuring your monthly household cash flow never stops.',
    icon: '⚡',
  },
  {
    title: 'Complete Tax Efficiency',
    description:
      'Enjoy tax deduction on premiums paid under Section 80C up to ₹1.5 Lakhs/year, and completely tax-free death benefit payouts under Section 10(10D).',
    icon: '📊',
  },
]

const comparisonData = [
  {
    feature: 'Primary Objective',
    term: '100% Pure Family Protection',
    endowment: 'Mixed Savings & Insurance',
    ulip: 'Market-linked Investment & Cover',
  },
  {
    feature: 'Coverage Amount (for ₹15k/yr)',
    term: '₹1 Crore+ Life Cover',
    endowment: '₹3 Lakh to ₹5 Lakh Cover',
    ulip: '₹5 Lakh to ₹10 Lakh Cover',
  },
  {
    feature: 'Transparency & Complexity',
    term: 'Crystal clear, zero hidden clauses',
    endowment: 'Complex bonuses and charges',
    ulip: 'High allocation & fund management charges',
  },
  {
    feature: 'Investment Return Efficiency',
    term: 'Invest savings separately in SIPs (~12%+ p.a.)',
    endowment: 'Low returns (~4% to 5% p.a.)',
    ulip: 'Volatile returns subject to high charges',
  },
  {
    feature: 'Liquidity & Surrender Terms',
    term: 'Pay as you go, cancel anytime without penalty',
    endowment: 'Rigid surrender penalties & lock-in',
    ulip: 'Mandatory 5-year lock-in period',
  },
]

export function TermInsurance() {
  const [annualIncome, setAnnualIncome] = useState<number>(1200000)
  const [age, setAge] = useState<number>(30)
  const [liabilities, setLiabilities] = useState<number>(2000000)

  // HLV Calculation: Recommended Term Cover = (Income * Multiplier) + Liabilities
  const multiplier = age < 35 ? 20 : age < 45 ? 15 : 10
  const recommendedTermCover = annualIncome * multiplier + liabilities

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Crore`
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)} Lakhs`
    return `₹${val.toLocaleString('en-IN')}`
  }

  const whatsappMsg = encodeURIComponent(
    `Hi Phani, I used the HLV Term Calculator on TejasFinserv.\n\n• Annual Income: ₹${(annualIncome / 100000).toFixed(1)} Lakhs\n• Age: ${age} Years\n• Existing Debt: ₹${(liabilities / 100000).toFixed(1)} Lakhs\n• Recommended Cover: ${formatINR(recommendedTermCover)}\n\nPlease share suitable pure term life quotes with 100% claim settlement support.`
  )
  const whatsappUrl = `https://wa.me/919848512345?text=${whatsappMsg}`

  return (
    <>
      <Seo
        title="Term Insurance Advisory Vijayawada — 100% Pure Life Cover | TejasFinserv"
        description="Secure your family's financial future with high-cover term life insurance in Vijayawada. Calculate your Human Life Value (HLV) and compare top term plans."
        path="/term-insurance"
      />

      <section className="grain-overlay bg-navy pt-36 sm:pt-40 pb-20 text-ivory relative overflow-hidden">
        <div className="container-main relative z-10">
          <SectionReveal>
            <p className="mb-3 text-xs font-semibold tracking-widest text-brass uppercase">
              Pure Protection Life Advisory
            </p>
            <h1 className="max-w-3xl font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              Uncompromising security for the people you love.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-ivory/80 leading-relaxed">
              Term insurance is the foundation of every sound financial plan. We help you determine your exact Human Life Value and select high claim-settlement term plans without commission bias.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={siteConfig.onboardingUrl} external className="shadow-lg">
                Get Customized Term Quotes
              </Button>
              <Button to="/contact" variant="secondary">
                Speak with Phani Rompicharla
              </Button>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Interactive Term Insurance Calculator */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-brass bg-navy/5 px-3 py-1.5 rounded-full border border-navy/10 inline-block mb-3">
                HLV Coverage Estimator
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy">
                Calculate Your Ideal Term Life Cover
              </h2>
              <p className="mt-3 text-muted">
                Your life insurance cover should replace your income and wipe out any existing loans if you are not around.
              </p>
            </div>
          </SectionReveal>

          <div className="max-w-4xl mx-auto rounded-3xl border border-line bg-ivory shadow-2xl p-6 sm:p-10 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy">
                    Your Annual Income
                  </label>
                  <span className="font-display text-lg font-bold text-navy bg-cream px-3 py-1 rounded-lg border border-line">
                    ₹{(annualIncome / 100000).toFixed(1)} Lakhs/yr
                  </span>
                </div>
                <input
                  type="range"
                  min={300000}
                  max={5000000}
                  step={100000}
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full accent-brass cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted mt-1 font-mono">
                  <span>₹3 Lakhs</span>
                  <span>₹50 Lakhs+</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy">
                    Your Current Age
                  </label>
                  <span className="font-display text-lg font-bold text-navy bg-cream px-3 py-1 rounded-lg border border-line">
                    {age} Years Old
                  </span>
                </div>
                <input
                  type="range"
                  min={22}
                  max={60}
                  step={1}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-brass cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted mt-1 font-mono">
                  <span>22 Yrs (20x Income)</span>
                  <span>60 Yrs (10x Income)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy">
                    Existing Loans / Liabilities
                  </label>
                  <span className="font-display text-lg font-bold text-navy bg-cream px-3 py-1 rounded-lg border border-line">
                    ₹{(liabilities / 100000).toFixed(1)} Lakhs
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10000000}
                  step={500000}
                  value={liabilities}
                  onChange={(e) => setLiabilities(Number(e.target.value))}
                  className="w-full accent-brass cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted mt-1 font-mono">
                  <span>₹0 (No Debt)</span>
                  <span>₹1 Crore+</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-6 bg-navy text-ivory p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between h-full">
              <div className="pointer-events-none absolute top-0 right-0 w-40 h-40 bg-brass/20 rounded-full blur-2xl -mr-10 -mt-10 animate-slow-pulse" />

              <div className="space-y-6 relative z-10">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-brass block mb-1">
                    Recommended Pure Term Cover
                  </span>
                  <div className="font-display text-3xl sm:text-4xl font-bold text-ivory">
                    {formatINR(recommendedTermCover)}
                  </div>
                  <p className="text-xs text-ivory/70 mt-2 leading-relaxed">
                    Based on your age ({age} yrs), this cover ensures your family replaces your income for the next 15–20 years while clearing ₹{(liabilities / 100000).toFixed(1)} Lakhs in debt immediately.
                  </p>
                </div>

                <div className="pt-4 border-t border-ivory/15 text-xs space-y-2 text-ivory/80">
                  <div className="flex justify-between">
                    <span>Income Replacement Portion:</span>
                    <span className="font-semibold">{formatINR(annualIncome * multiplier)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Debt / Liability Clearance:</span>
                    <span className="font-semibold">{formatINR(liabilities)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 relative z-10 space-y-3">
                <Button href={whatsappUrl} external className="w-full shadow-lg !bg-emerald-500 !text-white hover:!bg-emerald-600">
                  💬 Send My Calculation to WhatsApp →
                </Button>
                <Button to="/contact" variant="ghost-light" className="w-full text-xs">
                  Request Custom Evaluation via Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Term Insurance */}
      <section className="section-padding bg-ivory">
        <div className="container-main">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-brass block mb-2">
                The Pure Protection Advantage
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy">
                Why Term Life is Essential
              </h2>
              <p className="mt-3 text-muted">
                Never mix insurance with investment. Term life gives your family maximum financial coverage at minimum cost.
              </p>
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {termFeatures.map((feat, i) => (
              <SectionReveal key={feat.title} delay={i * 100}>
                <div className="bg-cream p-8 rounded-3xl border border-line h-full flex flex-col justify-between hover:border-brass/40 transition-all duration-300 shadow-sm hover:shadow-md">
                  <div>
                    <div className="text-4xl mb-6 bg-ivory w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-line">
                      {feat.icon}
                    </div>
                    <h3 className="font-display text-xl font-bold text-navy mb-3">{feat.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-cream">
        <div className="container-main max-w-5xl">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-brass block mb-2">
                Clarity vs Confusion
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy">
                Term Life vs Traditional Policies
              </h2>
              <p className="mt-3 text-muted">
                See why financial experts globally advise buying term insurance and investing the difference in mutual funds.
              </p>
            </div>
          </SectionReveal>

          <div className="sm:hidden flex items-center justify-center gap-2 text-xs font-semibold text-brass-dark bg-brass/10 py-2.5 px-4 rounded-xl mb-4 border border-brass/20">
            <span>← Swipe horizontally to compare plans →</span>
          </div>
          <div className="overflow-x-auto rounded-3xl border border-line bg-ivory shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-navy text-ivory text-sm font-display">
                  <th className="p-5 sm:p-6 border-b border-ivory/10">Feature / Parameter</th>
                  <th className="p-5 sm:p-6 border-b border-ivory/10 text-brass bg-navy-deep font-bold">Term Life (Recommended)</th>
                  <th className="p-5 sm:p-6 border-b border-ivory/10 font-normal">Endowment / Money Back</th>
                  <th className="p-5 sm:p-6 border-b border-ivory/10 font-normal">ULIP Plans</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {comparisonData.map((row) => (
                  <tr key={row.feature} className="hover:bg-cream/50 transition-colors">
                    <td className="p-5 sm:p-6 font-semibold text-navy">{row.feature}</td>
                    <td className="p-5 sm:p-6 font-semibold text-navy bg-brass/5 border-l border-r border-brass/20">{row.term}</td>
                    <td className="p-5 sm:p-6 text-muted">{row.endowment}</td>
                    <td className="p-5 sm:p-6 text-muted">{row.ulip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Partners Strip */}
      <InsurancePartnersStrip partners={termInsurancePartners} />

      {/* CTA Section */}
      <section className="section-padding bg-navy text-ivory relative overflow-hidden">
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-brass/10 rounded-full blur-3xl" />
        <div className="container-main max-w-4xl text-center relative z-10">
          <SectionReveal>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Ready to secure a 100% pure protection plan?
            </h2>
            <p className="mt-4 text-lg text-ivory/80 max-w-2xl mx-auto">
              Connect with Phani Rompicharla today for an unbiased, commission-transparent policy evaluation.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href={siteConfig.onboardingUrl} external className="shadow-xl">
                Start Online Onboarding
              </Button>
              <Button href={siteConfig.contact.whatsappUrl} external variant="secondary">
                Chat on WhatsApp →
              </Button>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
