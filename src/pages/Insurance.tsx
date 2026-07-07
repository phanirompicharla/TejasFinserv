import { useState } from 'react'
import { siteConfig } from '../lib/siteConfig'
import { Button } from '../components/Button'
import { LeadModal } from '../components/LeadModal'
import { InsurancePartnersStrip } from '../components/InsurancePartnersStrip'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'

const products = [
  {
    title: 'Pure Protection Term Life',
    description:
      'Uncompromising financial security for your family at an affordable premium. Provides a massive lump sum payout in case of unforeseen events.',
    icon: '🛡️',
  },
  {
    title: 'Comprehensive Health Mediclaim',
    description:
      'Robust hospitalization cover with zero room rent caps, no copayment clauses, and annual restoration benefits for individuals and families.',
    icon: '🏥',
  },
  {
    title: 'Personal Accident & Disability',
    description:
      'Crucial income replacement and lump sum support against permanent or temporary accidental disability that standard term life may exclude.',
    icon: '⚡',
  },
  {
    title: 'Super Top-Up Health Plans',
    description:
      'The most cost-effective strategy to multiply your health cover from ₹5 Lakhs to ₹50+ Lakhs using a smart deductible mechanism.',
    icon: '⬆️',
  },
  {
    title: 'Critical Illness Riders',
    description:
      'Lump sum cash payout upon diagnosis of 30+ major illnesses (cancer, heart attack, kidney failure) to cover specialized medical treatments.',
    icon: '❤️‍🩹',
  },
  {
    title: 'Keyman & Business Liability Cover',
    description:
      'Safeguard business continuity, partners, and key personnel against operational disruption or sudden loss of leadership.',
    icon: '🏢',
  },
]

const comparisonData = [
  {
    feature: 'Primary Objective',
    term: '100% Pure Family Protection',
    endowment: 'Mixed Savings & Insurance',
  },
  {
    feature: 'Coverage Amount (for ₹15k/yr)',
    term: '₹1 Crore+ Life Cover',
    endowment: '₹3 Lakh to ₹5 Lakh Cover',
  },
  {
    feature: 'Transparency & Complexity',
    term: 'Crystal clear, straightforward',
    endowment: 'Complex bonuses and charges',
  },
  {
    feature: 'Investment Return Efficiency',
    term: 'Invest savings separately in SIPs (12%+ p.a.)',
    endowment: 'Low returns (~4% to 5% p.a.)',
  },
  {
    feature: 'Liquidity & Lock-in',
    term: 'Pay as you go, cancel anytime',
    endowment: 'Rigid surrender penalties',
  },
]

export function Insurance() {
  const [annualIncome, setAnnualIncome] = useState<number>(1200000)
  const [age, setAge] = useState<number>(32)
  const [dependents, setDependents] = useState<number>(3)

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [leadModalMessage, setLeadModalMessage] = useState('')
  const [leadModalTitle, setLeadModalTitle] = useState('')
  const [leadModalSubtitle, setLeadModalSubtitle] = useState('')

  // HLV Calculation
  const multiplier = age < 35 ? 20 : age < 45 ? 15 : 10
  const recommendedTermCover = annualIncome * multiplier
  const recommendedHealthCover = dependents > 2 ? 2500000 : 1500000

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Crore`
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)} Lakhs`
    return `₹${val.toLocaleString('en-IN')}`
  }

  const whatsappMsgRaw = `Hi Phani, I checked my insurance cover requirements on TejasFinserv.\n\n• Annual Income: ₹${(annualIncome / 100000).toFixed(1)} Lakhs\n• Current Age: ${age} Years\n• Dependents: ${dependents}\n• Recommended Term Life Cover: ${formatINR(recommendedTermCover)}\n• Recommended Family Health Cover: ${formatINR(recommendedHealthCover)}\n\nPlease review these figures and share suitable policy options.`

  return (
    <>
      <Seo
        title={siteConfig.seo.insurance.title}
        description={siteConfig.seo.insurance.description}
        path="/insurance"
      />

      <section className="grain-overlay bg-navy pt-36 pb-20 text-ivory relative overflow-hidden">
        <div className="container-main relative z-10">
          <SectionReveal>
            <p className="mb-3 text-xs font-semibold tracking-widest text-brass uppercase">
              Independent Insurance Advisory
            </p>
            <h1 className="max-w-3xl font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              Protect what matters most.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-ivory/80 leading-relaxed">
              We help you secure pure protection term life and robust health mediclaim covers chosen with mathematical clarity, not fear or commission bias.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Interactive Coverage Check Tool (Addressing UX Report Page 7) */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-brass bg-navy/5 px-3 py-1.5 rounded-full border border-navy/10 inline-block mb-3">
                Instant Protection Check
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy">
                Human Life Value (HLV) Coverage Calculator
              </h2>
              <p className="mt-3 text-muted">
                Find out the exact insurance cover your family needs to maintain their lifestyle in any eventuality.
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
                  <span>22 Yrs</span>
                  <span>60 Yrs</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy">
                    Family Dependents (Spouse, Children, Parents)
                  </label>
                  <span className="font-display text-lg font-bold text-navy bg-cream px-3 py-1 rounded-lg border border-line">
                    {dependents} Members
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={dependents}
                  onChange={(e) => setDependents(Number(e.target.value))}
                  className="w-full accent-brass cursor-pointer"
                />
              </div>
            </div>

            <div className="md:col-span-6 bg-navy text-ivory p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between h-full">
              <div className="pointer-events-none absolute top-0 right-0 w-40 h-40 bg-brass/20 rounded-full blur-2xl -mr-10 -mt-10 animate-slow-pulse" />

              <div className="space-y-6 relative z-10">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-brass block mb-1">
                    Recommended Term Life Cover ({multiplier}x Income)
                  </span>
                  <div className="font-display text-3xl sm:text-4xl font-bold text-ivory">
                    {formatINR(recommendedTermCover)}
                  </div>
                  <p className="text-xs text-ivory/70 mt-1">
                    Ensures your family's living costs, child education, and loan payoffs remain secure.
                  </p>
                </div>

                <div className="pt-4 border-t border-ivory/15">
                  <span className="text-xs font-semibold uppercase tracking-widest text-brass block mb-1">
                    Recommended Family Health Cover
                  </span>
                  <div className="font-display text-2xl font-bold text-ivory">
                    {formatINR(recommendedHealthCover)}
                  </div>
                  <p className="text-xs text-ivory/70 mt-1">
                    Covers modern urban hospitalization costs in Andhra Pradesh without room rent caps.
                  </p>
                </div>
              </div>

              <div className="pt-6 relative z-10 flex justify-center">
                <Button 
                  onClick={() => {
                    setLeadModalMessage(whatsappMsgRaw)
                    setLeadModalTitle("Save & Send Calculation")
                    setLeadModalSubtitle("Fill in your details below to save your Insurance Cover requirements and instantly share it on WhatsApp.")
                    setIsLeadModalOpen(true)
                  }}
                  className="w-full sm:w-auto px-6 shadow-lg !bg-emerald-500 !text-white hover:!bg-emerald-600"
                >
                  💬 Send to WhatsApp →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Comparison Table (Addressing UX Report Page 7) */}
      <section className="section-padding bg-ivory">
        <div className="container-main max-w-4xl">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-brass bg-navy/5 px-3 py-1.5 rounded-full border border-navy/10 inline-block mb-3">
                Unbiased Analysis
              </span>
              <h2 className="font-display text-3xl font-semibold text-navy">
                Why Pure Term Protection Matters
              </h2>
              <p className="mt-3 text-muted">
                Never mix insurance with investment. Here is how pure term life compares against traditional endowment or investment-linked policies.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal>
            <div className="rounded-3xl border border-line bg-cream shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-navy text-ivory uppercase text-xs tracking-wider font-semibold border-b border-ivory/10">
                    <tr>
                      <th className="py-4 px-6 w-1/3">Evaluation Factor</th>
                      <th className="py-4 px-6 w-1/3 bg-brass/20 text-brass font-bold">
                        Pure Term Life Plan ✓ (Recommended)
                      </th>
                      <th className="py-4 px-6 w-1/3 text-ivory/60">
                        Traditional Endowment / ULIP
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {comparisonData.map((row, i) => (
                      <tr key={row.feature} className={i % 2 === 0 ? 'bg-ivory' : 'bg-cream/40'}>
                        <td className="py-4 px-6 font-display font-semibold text-navy">
                          {row.feature}
                        </td>
                        <td className="py-4 px-6 font-semibold text-navy bg-brass/10 border-l border-r border-brass/20">
                          {row.term}
                        </td>
                        <td className="py-4 px-6 text-muted">{row.endowment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-main">
          <SectionReveal>
            <h2 className="font-display text-3xl font-semibold text-navy text-center mb-12">
              Insurance Solutions We Structure
            </h2>
          </SectionReveal>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <SectionReveal key={product.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-line bg-ivory p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-brass/40 hover:shadow-xl flex flex-col justify-between">
                  <div>
                    <span className="text-3xl p-3 bg-cream rounded-2xl border border-line shadow-sm inline-block mb-4">
                      {product.icon}
                    </span>
                    <h3 className="font-display text-xl font-semibold text-navy">
                      {product.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted leading-relaxed">{product.description}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <InsurancePartnersStrip />

      <div className="hairline" />

      <section className="section-padding bg-ivory">
        <div className="container-main max-w-4xl">
          <SectionReveal>
            <div className="bg-cream rounded-3xl p-8 sm:p-12 border border-line shadow-card">
              <h2 className="font-display text-3xl font-semibold text-navy">
                How our insurance advisory works
              </h2>
              <p className="mt-4 text-base text-muted leading-relaxed">
                Insurance is not a commodity. We evaluate your existing liabilities, dependents, corporate cover limitations, and family health history before recommending any insurer. Our goal is bulletproof protection without over-insuring.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-6 pt-6 border-t border-line text-sm text-ink">
                <div className="flex items-start gap-3">
                  <span className="text-brass font-bold text-lg">✓</span>
                  <div>
                    <strong className="block text-navy font-semibold">Insurability & Claim Ratio Audit</strong>
                    <span>We only recommend insurers with consistent 98%+ claim settlement records.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-brass font-bold text-lg">✓</span>
                  <div>
                    <strong className="block text-navy font-semibold">Dedicated Claim Assistance</strong>
                    <span>In the moment of truth, we stand beside your family to ensure smooth claim processing.</span>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="grain-overlay section-padding bg-navy text-center text-ivory relative overflow-hidden">
        <div className="container-main relative z-10">
          <SectionReveal>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">
              Let's secure your family's future today.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory/80 text-lg">
              Reach out for a zero-obligation review of your existing insurance policies.
            </p>
            <div className="mt-8">
              <Button 
                onClick={() => {
                  setLeadModalMessage("Hi Phani, I want to request a free review of my existing insurance policies. Please connect with me.")
                  setLeadModalTitle("Request Free Policy Review")
                  setLeadModalSubtitle("Fill in your details below to save your request and get a free insurance policy review via WhatsApp.")
                  setIsLeadModalOpen(true)
                }} 
                variant="ghost-light"
              >
                💬 Start Policy Review on WhatsApp →
              </Button>
            </div>
          </SectionReveal>
        </div>
      </section>

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        defaultMessage={leadModalMessage}
        title={leadModalTitle}
        subtitle={leadModalSubtitle}
      />
    </>
  )
}
