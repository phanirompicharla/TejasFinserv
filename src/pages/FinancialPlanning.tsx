import { siteConfig } from '../lib/siteConfig'
import { Button } from '../components/Button'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'

const included = [
  {
    title: 'Goal-based planning',
    description: 'Define and fund the milestones that matter — education, home, retirement.',
  },
  {
    title: 'Cash-flow & budgeting',
    description: 'Understand where your money goes and redirect it toward what counts.',
  },
  {
    title: 'Retirement planning',
    description: 'Build a corpus that lets you retire on your own terms.',
  },
  {
    title: 'Tax-efficient strategies',
    description: 'Structure investments to minimize tax impact within legal frameworks.',
  },
  {
    title: 'Portfolio review',
    description: 'Regular check-ins to keep your investments aligned with changing goals.',
  },
  {
    title: 'Emergency fund design',
    description: 'Ensure you have a safety net before you invest for growth.',
  },
]

const process = [
  { phase: 'Discovery', detail: 'We map your current finances, goals, and constraints.' },
  { phase: 'Plan', detail: 'We design a personalized roadmap with clear milestones.' },
  { phase: 'Implement', detail: 'We help you execute — selecting funds, policies, and allocations.' },
  { phase: 'Review', detail: 'We revisit regularly to adjust for life changes and market shifts.' },
]

export function FinancialPlanning() {
  return (
    <>
      <Seo
        title={siteConfig.seo.financialPlanning.title}
        description={siteConfig.seo.financialPlanning.description}
        path="/financial-planning"
      />

      <section className="grain-overlay bg-navy pt-32 pb-20 text-ivory">
        <div className="container-main">
          <p className="mb-3 text-sm font-semibold tracking-widest text-brass-soft uppercase">
            Financial Planning
          </p>
          <h1 className="max-w-3xl font-display font-semibold">
            Financial planning that fits your life.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/80">
            A roadmap that aligns your income, goals, and risk tolerance over time — so every
            financial decision moves you closer to where you want to be.
          </p>
        </div>
      </section>

      <section className="section-padding bg-ivory">
        <div className="container-main">
          <SectionReveal>
            <h2 className="font-display font-semibold text-navy">
              What's included
            </h2>
            <p className="mt-4 max-w-2xl text-muted">
              Our financial planning service covers every dimension of your financial life,
              from day-to-day cash flow to long-term wealth creation.
            </p>
          </SectionReveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((item, i) => (
              <SectionReveal key={item.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-line bg-cream p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brass/30 hover:shadow-card">
                  <h3 className="font-display text-lg font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
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
            <h2 className="font-display font-semibold text-navy">Our process</h2>
          </SectionReveal>
          <div className="mt-12 grid gap-0 md:grid-cols-4">
            {process.map((step, i) => (
              <SectionReveal key={step.phase} delay={i * 100}>
                <div className="relative border-l-2 border-brass/30 px-6 py-4 md:border-l-0 md:border-t-2 md:pt-8">
                  <span className="absolute -left-[9px] top-4 h-4 w-4 rounded-full bg-brass md:-top-[9px] md:left-6" />
                  <h3 className="font-display text-lg font-semibold text-navy">
                    {step.phase}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{step.detail}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="grain-overlay section-padding bg-navy text-center text-ivory">
        <div className="container-main">
          <SectionReveal>
            <h2 className="font-display font-semibold">Let's build your plan.</h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory/80">
              Start with a conversation or open your account directly through our secure
              platform.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href={siteConfig.onboardingUrl} external>
                Open Your Account
              </Button>
              <Button to="/contact" variant="ghost-light">
                Contact Us
              </Button>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
