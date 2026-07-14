import { useState } from 'react'
import { Button } from '../components/Button'
import { LeadModal } from '../components/LeadModal'
import { InsurancePartnersStrip } from '../components/InsurancePartnersStrip'
import { healthInsurancePartners } from '../lib/clientLogos'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'

const healthPillars = [
  {
    title: 'Zero Room Rent Caps',
    description:
      'Never settle for policies that cap your hospital room rent at 1% of sum insured. A room rent cap causes proportionate deductions on surgery, surgeon fees, and ICUs. We ensure your policy has zero sub-limits.',
    icon: '🏥',
  },
  {
    title: 'No Copayment Clauses',
    description:
      'Many health plans force you to pay 10% to 20% of every hospital bill out of pocket. Our recommended comprehensive policies feature 100% bill settlement without copay restrictions.',
    icon: '🚫',
  },
  {
    title: '100% Annual Restoration',
    description:
      'If you exhaust your entire health cover during a hospitalization, modern mediclaim plans automatically restore 100% of your base sum insured for subsequent claims in the same policy year.',
    icon: '🔄',
  },
  {
    title: '540+ Daycare Treatments',
    description:
      'Advancements in medical science mean surgeries like cataract, kidney stone removal, or chemotherapy take less than 24 hours. Enjoy full cashless coverage without mandatory overnight hospitalization.',
    icon: '⚡',
  },
]

const topUpSteps = [
  {
    step: '01',
    title: 'Base Mediclaim (₹5 Lakhs to ₹10 Lakhs)',
    description: 'Covers minor and medium hospitalizations up to your initial threshold without any deductible.',
  },
  {
    step: '02',
    title: 'Super Top-Up Trigger (Deductible Point)',
    description: 'Once medical expenses in a year exceed your base cover threshold, the Super Top-Up policy activates immediately.',
  },
  {
    step: '03',
    title: 'Massive Cover (₹50+ Lakhs Protection)',
    description: 'The Super Top-Up pays for major surgeries, cancer care, or prolonged organ transplants at 80% lower premium than buying a standalone ₹50L plan.',
  },
]

const healthPlansData = [
  { company: 'Care Health Insurance', name: 'Care Supreme' },
  { company: 'HDFC ERGO', name: 'Optima Secure' },
  { company: 'Niva Bupa Health Insurance', name: 'Aspire' },
  { company: 'ICICI Lombard', name: 'Elevate' },
  { company: 'Tata AIG', name: 'Medicare Premier' },
  { company: 'Star Health', name: 'Comprehensive Health Insurance Policy' },
  { company: 'Bajaj Allianz General Insurance', name: 'Health Guard' },
  { company: 'SBI General Insurance', name: 'Arogya Supreme' },
  { company: 'Reliance General Insurance', name: 'Health Gain' },
  { company: 'ManipalCigna Health Insurance', name: 'ProHealth Prime' },
  { company: 'ACKO General Insurance', name: 'Platinum Health Plan' },
  { company: 'Digit Insurance', name: 'Digit Health Insurance' },
  { company: 'Go Digit General Insurance', name: 'World Care Health Insurance' },
  { company: 'Future Generali', name: 'Health Total' },
  { company: 'Kotak General Insurance', name: 'Health Premier' },
  { company: 'Liberty General Insurance', name: 'Health Connect Supreme' },
  { company: 'Royal Sundaram', name: 'Lifeline Supreme' },
  { company: 'National Insurance', name: 'National Mediclaim Plus Policy' },
  { company: 'New India Assurance', name: 'New India Mediclaim Policy' },
  { company: 'Oriental Insurance', name: 'Happy Family Floater' },
  { company: 'United India Insurance', name: 'Family Medicare Policy' },
  { company: 'IFFCO Tokio General Insurance', name: 'Health Protector' },
  { company: 'Cholamandalam MS General Insurance', name: 'Flexi Health' },
  { company: 'Shriram General Insurance', name: 'Shri Health Suraksha 2.0' },
]

export function HealthInsurance() {
  const [familyType, setFamilyType] = useState<'individual' | 'couple' | 'family' | 'parents'>('family')
  const [cityTier, setCityTier] = useState<'metro' | 'non-metro'>('non-metro')

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [leadModalMessage, setLeadModalMessage] = useState('')
  const [leadModalTitle, setLeadModalTitle] = useState('')
  const [leadModalSubtitle, setLeadModalSubtitle] = useState('')

  // Health Cover Recommendation calculation
  const getRecommendation = () => {
    if (familyType === 'individual') {
      return {
        base: 500000,
        topUp: 2000000,
        total: 2500000,
        estPremium: cityTier === 'metro' ? '~₹8,500/yr' : '~₹6,800/yr',
        note: 'Ideal for young professionals seeking individual cashless protection.'
      }
    }
    if (familyType === 'couple') {
      return {
        base: 1000000,
        topUp: 4000000,
        total: 5000000,
        estPremium: cityTier === 'metro' ? '~₹16,000/yr' : '~₹13,500/yr',
        note: 'Family floater covering couple with maternity and zero room rent sub-limits.'
      }
    }
    if (familyType === 'family') {
      return {
        base: 1500000,
        topUp: 3500000,
        total: 5000000,
        estPremium: cityTier === 'metro' ? '~₹22,000/yr' : '~₹18,500/yr',
        note: 'Comprehensive family floater for couple + up to 2 children with annual restoration.'
      }
    }
    return {
      base: 1000000,
      topUp: 1500000,
      total: 2500000,
      estPremium: cityTier === 'metro' ? '~₹35,000/yr' : '~₹29,000/yr',
      note: 'Specialized senior citizen cover with minimal waiting periods for pre-existing diseases.'
    }
  }

  const rec = getRecommendation()

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Crore`
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)} Lakhs`
    return `₹${val.toLocaleString('en-IN')}`
  }

  const whatsappMsgRaw = `Hi Phani, I used the Smart Health Insurance Planner on TejasFinserv.\n\n• Insured Group: ${familyType.toUpperCase()}\n• City Tier: ${cityTier === 'metro' ? 'Metro / Tier 1' : 'Tier 2 / Vijayawada'}\n• Recommended Base Mediclaim: ${formatINR(rec.base)}\n• Recommended Super Top-Up: ${formatINR(rec.topUp)}\n• Total Shield: ${formatINR(rec.total)} (${rec.estPremium})\n\nPlease recommend the best cashless plans with zero room rent capping.`

  return (
    <>
      <Seo
        title="Health Insurance Advisory Vijayawada — Cashless Family Mediclaim | TejasFinserv"
        description="Get comprehensive health insurance without room rent caps or copayment clauses in Vijayawada. Compare family floater mediclaim and super top-up health plans."
        path="/health-insurance"
      />

      <section className="grain-overlay bg-navy pt-36 sm:pt-40 pb-20 text-ivory relative overflow-hidden">
        <div className="container-main relative z-10">
          <SectionReveal>
            <p className="mb-3 text-xs font-semibold tracking-widest text-brass uppercase">
              Comprehensive Health Advisory
            </p>
            <h1 className="max-w-3xl font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              Zero compromise on your family’s healthcare.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-ivory/80 leading-relaxed">
              Medical inflation is rising at over 14% annually. We help you secure robust health mediclaim and super top-up plans with 100% cashless hospitalization across Vijayawada and all over India.
            </p>
            <div className="mt-8">
              <Button 
                onClick={() => {
                  setLeadModalMessage("Hi Phani, I want to consult on health insurance plans. Please connect with me.")
                  setLeadModalTitle("Consult on Health Insurance")
                  setLeadModalSubtitle("Fill in your details below to save your request and get customized health plan advice via WhatsApp.")
                  setIsLeadModalOpen(true)
                }} 
                className="shadow-lg"
              >
                💬 Get Health Quote on WhatsApp →
              </Button>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Interactive Health Cover Estimator */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-brass bg-navy/5 px-3 py-1.5 rounded-full border border-navy/10 inline-block mb-3">
                Smart Mediclaim Planner
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy">
                Estimate Your Ideal Family Health Cover
              </h2>
              <p className="mt-3 text-muted">
                Combine a Base Mediclaim policy with a Super Top-Up to unlock ₹50 Lakhs+ protection at a fraction of standard costs.
              </p>
            </div>
          </SectionReveal>

          <div className="max-w-4xl mx-auto rounded-3xl border border-line bg-ivory shadow-2xl p-6 sm:p-10 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-navy block mb-3">
                  Select Who You Want to Insure
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'individual', label: 'Individual (Self)' },
                    { id: 'couple', label: 'Couple (2 Adults)' },
                    { id: 'family', label: 'Family (2A + 2C)' },
                    { id: 'parents', label: 'Senior Parents' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFamilyType(item.id as any)}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center ${
                        familyType === item.id
                          ? 'bg-navy text-ivory border-navy shadow-md scale-[1.02]'
                          : 'bg-cream text-ink border-line hover:border-brass/50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-navy block mb-3">
                  Select Your City Category
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'non-metro', label: 'Vijayawada / Tier 2' },
                    { id: 'metro', label: 'Metro City (Hyd/Chn/Blr)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCityTier(item.id as any)}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center ${
                        cityTier === item.id
                          ? 'bg-brass text-navy border-brass shadow-md font-extrabold'
                          : 'bg-cream text-ink border-line hover:border-brass/50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cream border border-line text-xs text-muted leading-relaxed">
                <strong className="text-navy">Pro Tip:</strong> By using a deductible (Super Top-Up), you avoid paying high recurring premiums while keeping full coverage for cardiac care, oncology, or major emergencies.
              </div>
            </div>

            <div className="md:col-span-6 bg-navy text-ivory p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between h-full">
              <div className="pointer-events-none absolute top-0 right-0 w-40 h-40 bg-brass/20 rounded-full blur-2xl -mr-10 -mt-10 animate-slow-pulse" />

              <div className="space-y-6 relative z-10">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-brass block mb-1">
                    Total Recommended Protection
                  </span>
                  <div className="font-display text-3xl sm:text-4xl font-bold text-ivory">
                    {formatINR(rec.total)}
                  </div>
                  <p className="text-xs text-ivory/70 mt-2 leading-relaxed">
                    {rec.note}
                  </p>
                </div>

                <div className="pt-4 border-t border-ivory/15 text-xs space-y-2.5 text-ivory/80">
                  <div className="flex justify-between items-center">
                    <span>Base Mediclaim Cover:</span>
                    <span className="font-semibold text-ivory bg-ivory/10 px-2 py-0.5 rounded">{formatINR(rec.base)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Super Top-Up Shield:</span>
                    <span className="font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">{formatINR(rec.topUp)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-ivory/10">
                    <span className="text-brass font-medium">Estimated Market Premium:</span>
                    <span className="font-bold text-brass">{rec.estPremium}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 relative z-10 flex justify-center">
                <Button 
                  onClick={() => {
                    setLeadModalMessage(whatsappMsgRaw)
                    setLeadModalTitle("Save & Send Calculation")
                    setLeadModalSubtitle("Fill in your details below to save your Smart Health Insurance calculation and instantly share it on WhatsApp.")
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

      {/* 4 Pillars of Good Health Insurance */}
      <section className="section-padding bg-ivory">
        <div className="container-main">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-brass block mb-2">
                What to look for
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy">
                The 4 Pillars of Robust Mediclaim
              </h2>
              <p className="mt-3 text-muted">
                We carefully screen health insurance policies to ensure you never face claim rejections due to hidden fine print or restrictive sub-limits.
              </p>
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {healthPillars.map((feat, i) => (
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

      {/* How Super Top-Up Works */}
      <section className="section-padding bg-cream">
        <div className="container-main max-w-5xl">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-brass block mb-2">
                The Smartest Health Strategy
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy">
                How Super Top-Up Multiplies Your Cover
              </h2>
              <p className="mt-3 text-muted">
                Why pay ₹40,000/year for a ₹50 Lakh policy when you can get the same protection for less than half the cost?
              </p>
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {topUpSteps.map((step, i) => (
              <div key={step.step} className="bg-ivory p-8 rounded-3xl border border-line relative overflow-hidden shadow-md flex flex-col justify-between">
                <div>
                  <span className="font-display text-4xl font-extrabold text-brass/30 block mb-4">
                    {step.step}
                  </span>
                  <h3 className="font-display text-xl font-bold text-navy mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-brass font-bold text-2xl z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Strip */}
      <InsurancePartnersStrip partners={healthInsurancePartners} />

      {/* Product Matrix Table */}
      <section className="section-padding bg-ivory border-t border-line">
        <div className="container-main">
          <SectionReveal>
            <div className="mb-10 text-center max-w-3xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-widest text-brass bg-navy/5 px-3 py-1.5 rounded-full border border-navy/10 inline-block mb-3">
                PRODUCT MATRIX
              </span>
              <h2 className="font-display text-3xl font-semibold text-navy">
                Health Insurance Plans
              </h2>
              <p className="mt-3 text-muted">
                Compare popular health insurance plans from leading insurers and choose the medical coverage that best protects you and your family.
              </p>
            </div>

            {/* Responsive Table Design */}
            <div className="overflow-x-auto rounded-3xl border border-line bg-cream shadow-xl">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-navy text-ivory font-display border-b border-line">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider w-16 text-center">S.No</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Insurance Company</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Health Insurance Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-ink">
                  {healthPlansData.map((plan, idx) => (
                    <tr
                      key={idx}
                      className="transition-colors duration-150 hover:bg-ivory/50 odd:bg-cream even:bg-cream-light/30"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-muted font-mono text-center">{idx + 1}</td>
                      <td className="px-6 py-4 text-sm font-bold text-navy">{plan.company}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-brass">{plan.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-navy text-ivory relative overflow-hidden">
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-brass/10 rounded-full blur-3xl" />
        <div className="container-main max-w-4xl text-center relative z-10">
          <SectionReveal>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Want a cashless mediclaim check for your family?
            </h2>
            <p className="mt-4 text-lg text-ivory/80 max-w-2xl mx-auto">
              Let Phani Rompicharla analyze your hospital networks in Vijayawada and recommend zero-compromise health cover.
            </p>
            <div className="mt-8">
              <Button 
                onClick={() => {
                  setLeadModalMessage("Hi Phani, I want to start onboarding for cashless health insurance. Please guide me.")
                  setLeadModalTitle("Start Online Onboarding")
                  setLeadModalSubtitle("Fill in your details below to save your request and connect on WhatsApp for your onboarding.")
                  setIsLeadModalOpen(true)
                }} 
                className="shadow-xl"
              >
                💬 Start Onboarding on WhatsApp →
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
