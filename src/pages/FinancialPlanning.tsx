import { useState } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../lib/siteConfig'
import { Button } from '../components/Button'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'

const included = [
  {
    title: 'Goal-based planning',
    description: 'Define and fund the milestones that matter — education, home, retirement.',
    icon: '🎯',
  },
  {
    title: 'Cash-flow & budgeting',
    description: 'Understand where your money goes and redirect it toward what counts.',
    icon: '💰',
  },
  {
    title: 'Retirement planning',
    description: 'Build a corpus that lets you retire on your own terms.',
    icon: '🏖️',
  },
  {
    title: 'Tax-efficient strategies',
    description: 'Structure investments to minimize tax impact within legal frameworks.',
    icon: '🛡️',
  },
  {
    title: 'Portfolio review',
    description: 'Regular check-ins to keep your investments aligned with changing goals.',
    icon: '📊',
  },
  {
    title: 'Emergency fund design',
    description: 'Ensure you have a safety net before you invest for growth.',
    icon: '🚨',
  },
]

const process = [
  { phase: 'Discovery', detail: 'We map your current finances, goals, and constraints.' },
  { phase: 'Plan', detail: 'We design a personalized roadmap with clear milestones.' },
  { phase: 'Implement', detail: 'We help you execute — selecting funds, policies, and allocations.' },
  { phase: 'Review', detail: 'We revisit regularly to adjust for life changes and market shifts.' },
]

const checklistItems = [
  { id: 'retire', label: 'Retirement Corpus & Pension Planning', category: 'Long Term' },
  { id: 'child', label: 'Child Education & Marriage Funding', category: 'Family' },
  { id: 'tax', label: 'Tax Optimization via ELSS & Asset Allocation', category: 'Wealth' },
  { id: 'emergency', label: '3-6 Months Liquid Emergency Fund Setup', category: 'Security' },
  { id: 'insurance', label: 'Term Life & Family Mediclaim Coverage Audit', category: 'Protection' },
  { id: 'debt', label: 'High-Interest Liability & Loan Payoff Strategy', category: 'Cashflow' },
]

export function FinancialPlanning() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['retire', 'tax'])

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  const score = Math.round((selectedGoals.length / checklistItems.length) * 100)

  return (
    <>
      <Seo
        title={siteConfig.seo.financialPlanning.title}
        description={siteConfig.seo.financialPlanning.description}
        path="/financial-planning"
      />

      <section className="grain-overlay bg-navy pt-36 pb-20 text-ivory relative overflow-hidden">
        <div className="container-main relative z-10">
          <SectionReveal>
            <p className="mb-3 text-xs font-semibold tracking-widest text-brass uppercase">
              Financial Planning & Advisory
            </p>
            <h1 className="max-w-3xl font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              Financial planning that fits your life.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-ivory/80 leading-relaxed">
              A roadmap that aligns your income, goals, and risk tolerance over time — so every financial decision moves you closer to where you want to be.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="section-padding bg-ivory">
        <div className="container-main">
          <SectionReveal>
            <h2 className="font-display text-3xl font-semibold text-navy">
              What's included in our advisory
            </h2>
            <p className="mt-4 max-w-2xl text-muted text-base">
              Our financial planning service covers every dimension of your financial life, from day-to-day cash flow to multi-generational wealth creation.
            </p>
          </SectionReveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((item, i) => (
              <SectionReveal key={item.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-line bg-cream p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-brass/40 hover:shadow-xl flex flex-col justify-between">
                  <div>
                    <span className="text-3xl p-3 bg-ivory rounded-2xl border border-line shadow-sm inline-block mb-4">
                      {item.icon}
                    </span>
                    <h3 className="font-display text-xl font-semibold text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="hairline" />

      <section className="section-padding bg-cream">
        <div className="container-main">
          <SectionReveal>
            <h2 className="font-display text-3xl font-semibold text-navy">Our 4-Phase Process</h2>
            <p className="mt-3 text-muted">A disciplined framework designed to bring clarity and control.</p>
          </SectionReveal>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {process.map((step, i) => (
              <SectionReveal key={step.phase} delay={i * 100}>
                <div className="relative border-l-2 border-brass/40 px-6 py-4 md:border-l-0 md:border-t-2 md:pt-8 bg-ivory/50 rounded-2xl md:rounded-none md:bg-transparent p-6">
                  <span className="absolute -left-[9px] top-4 h-4 w-4 rounded-full bg-brass md:-top-[9px] md:left-6 shadow-sm" />
                  <span className="text-xs font-bold font-mono uppercase text-brass block mb-1">
                    Phase 0{i + 1}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-navy">
                    {step.phase}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{step.detail}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Goal Discovery Checklist Widget (Addressing UX Report Page 5) */}
      <section className="section-padding bg-ivory">
        <div className="container-main max-w-4xl">
          <SectionReveal>
            <div className="rounded-3xl border border-brass/40 bg-cream p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 bg-brass/10 rounded-full blur-3xl -mr-20 -mt-20" />

              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-semibold uppercase tracking-widest text-brass bg-navy/5 px-3 py-1.5 rounded-full border border-navy/10 inline-block mb-3">
                  Interactive Assessment
                </span>
                <h2 className="font-display text-3xl font-semibold text-navy">
                  Interactive Goal Discovery Checklist
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Select the financial priorities currently on your mind. We will help you structure a unified roadmap for your selected goals.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mb-10">
                {checklistItems.map((item) => {
                  const isChecked = selectedGoals.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleGoal(item.id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex items-center gap-4 ${
                        isChecked
                          ? 'bg-ivory border-brass shadow-md scale-[1.01]'
                          : 'bg-ivory/60 border-line hover:bg-ivory hover:border-line-dark'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          isChecked ? 'bg-navy text-brass' : 'border-2 border-line'
                        }`}
                      >
                        {isChecked && <span className="text-xs font-bold">✓</span>}
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-semibold uppercase text-brass tracking-wider block">
                          {item.category}
                        </span>
                        <span className={`text-sm font-medium ${isChecked ? 'text-navy font-semibold' : 'text-ink'}`}>
                          {item.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Dynamic Readiness Feedback */}
              <div className="bg-ivory rounded-2xl p-6 border border-line flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-navy text-brass font-display font-bold text-lg flex items-center justify-center">
                      {score}%
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-semibold text-navy">
                        {selectedGoals.length} Focus Area{selectedGoals.length !== 1 ? 's' : ''} Identified
                      </h4>
                      <p className="text-xs text-muted">
                        {selectedGoals.length === 0
                          ? 'Please select at least one financial priority above.'
                          : `Great start! We can model a tailored SIP & allocation strategy for these ${selectedGoals.length} goals.`}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-navy px-7 py-3 text-sm font-semibold text-ivory shadow-lg hover:bg-navy-deep transition-all active:scale-95 whitespace-nowrap"
                >
                  Discuss My Custom Plan →
                </Link>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="grain-overlay section-padding bg-navy text-center text-ivory relative overflow-hidden">
        <div className="container-main relative z-10">
          <SectionReveal>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">Let's build your financial roadmap today.</h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory/80 text-lg">
              Start with a conversation or open your account directly through our secure onboarding platform.
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
