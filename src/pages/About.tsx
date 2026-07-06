import { siteConfig } from '../lib/siteConfig'
import { Button } from '../components/Button'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'
import { organizationSchema, personSchema } from '../schema'

const approachSteps = [
  {
    step: '01',
    title: 'Discovery & Understanding',
    description:
      'We begin by listening — auditing your income, existing obligations, family goals, and personal comfort with market volatility.',
    icon: '👂',
  },
  {
    step: '02',
    title: 'Tailored Strategy & Planning',
    description:
      'We construct a personalized financial roadmap using AMFI-aligned mutual fund schemes and pure protection insurance plans.',
    icon: '🗺️',
  },
  {
    step: '03',
    title: 'Execution & Continuous Growth',
    description:
      'We implement via paperless digital platforms, monitor market shifts, and conduct annual portfolio rebalancing.',
    icon: '📈',
  },
]

const milestones = [
  {
    year: '2018',
    title: 'Foundation in Vijayawada',
    desc: 'Started with a singular mission: bringing transparent, fee-unbiased financial guidance to families and professionals across Andhra Pradesh.',
  },
  {
    year: '2021',
    title: 'AMFI Accreditation (ARN-251896)',
    desc: 'Formally registered as an AMFI Mutual Fund Distributor, committing to rigorous SEBI compliance and investor education standards.',
  },
  {
    year: '2023',
    title: 'Digital Platform Integration',
    desc: 'Partnered with AssetPlus and 40+ leading Asset Management Companies (AMCs) to provide 100% paperless onboarding and tracking.',
  },
  {
    year: '2025+',
    title: 'Trusted by 5,000+ Investors',
    desc: 'Milestone reached: distributing over 6,000 schemes across retirement, education, and wealth creation portfolios.',
  },
]

const values = [
  {
    title: 'Uncompromising Integrity',
    desc: 'We never push high-commission products. Your financial wellbeing is our sole benchmark of success.',
    icon: '🛡️',
  },
  {
    title: 'Complete Transparency',
    desc: 'No hidden clauses or jargon. You will always know exactly where your money is invested and why.',
    icon: '🔍',
  },
  {
    title: 'Long-Term Stewardship',
    desc: 'Wealth is built over decades, not days. We act as steady navigators during market ups and downs.',
    icon: '⚓',
  },
]

export function About() {
  return (
    <>
      <Seo
        title={siteConfig.seo.about.title}
        description={siteConfig.seo.about.description}
        path="/about"
        jsonLd={[organizationSchema(), personSchema()]}
      />

      {/* Hero strip */}
      <section className="grain-overlay bg-navy pt-36 pb-20 text-ivory relative overflow-hidden">
        <div className="container-main relative z-10">
          <SectionReveal>
            <p className="mb-3 text-xs font-semibold tracking-widest text-brass uppercase">
              About TejasFinserv
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold">
              Assistance with Assurance.
            </h1>
            <p className="mt-4 text-lg text-ivory/80 max-w-2xl">
              We are an AMFI-registered financial advisory firm based in Vijayawada, dedicated to guiding families and enterprises toward lasting financial independence.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-ivory">
        <div className="container-main max-w-4xl">
          <SectionReveal>
            <div className="grid gap-8 md:grid-cols-12 items-center">
              <div className="md:col-span-7 space-y-6">
                <h2 className="font-display text-3xl font-semibold text-navy">
                  Local roots, national investment access.
                </h2>
                <p className="text-base text-muted leading-relaxed">
                  TejasFinserv was founded on a simple realization: while financial markets have become democratized, accessible, and digital, most investors still struggle with information overload and emotional decision-making.
                </p>
                <p className="text-base text-muted leading-relaxed">
                  Based in Vijayawada, we bridge the gap between complex financial instruments and everyday life aspirations. We take the time to understand each client's unique circumstances — their income, family obligations, and risk tolerance — before formulating any recommendation.
                </p>
                <p className="text-base text-navy font-semibold">
                  Whether you are starting your first SIP of ₹2,000 or restructuring a ₹1 Crore retirement portfolio, our commitment remains identical: honest, SEBI-compliant guidance you can trust for a lifetime.
                </p>
              </div>
              <div className="md:col-span-5 bg-cream p-8 rounded-3xl border border-line shadow-card text-center">
                <div className="w-16 h-16 rounded-2xl bg-navy text-brass flex items-center justify-center mx-auto mb-4 text-3xl shadow-md">
                  🤝
                </div>
                <h3 className="font-display text-xl font-semibold text-navy">
                  Why Work With Us?
                </h3>
                <ul className="mt-4 space-y-3 text-left text-sm text-ink">
                  <li className="flex items-start gap-2">
                    <span className="text-brass font-bold">✓</span>
                    <span>AMFI Registered (ARN-251896)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brass font-bold">✓</span>
                    <span>100% Paperless & Secure Onboarding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brass font-bold">✓</span>
                    <span>Direct Access via WhatsApp & Phone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brass font-bold">✓</span>
                    <span>Unbiased Fund Selection Across 40+ AMCs</span>
                  </li>
                </ul>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <div className="hairline" />

      {/* Chronological Timeline Layout (Addressing UX Evaluation Report Page 3) */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="mb-2 text-xs font-semibold tracking-widest text-brass uppercase">
                Our Journey
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy">
                Milestones of Trust & Growth
              </h2>
              <p className="mt-3 text-muted">
                A timeline of how we evolved from a local consultancy into a trusted regional distribution powerhouse.
              </p>
            </div>
          </SectionReveal>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-line -translate-x-1/2 hidden sm:block" />

            <div className="space-y-12">
              {milestones.map((m, i) => {
                const isEven = i % 2 === 0
                return (
                  <SectionReveal key={m.year} delay={i * 100}>
                    <div className={`flex flex-col sm:flex-row items-center gap-8 ${isEven ? 'sm:flex-row-reverse' : ''}`}>
                      <div className="w-full sm:w-1/2" />
                      
                      <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-navy text-brass font-display font-bold text-sm shadow-lg border-4 border-cream shrink-0">
                        {m.year.slice(0, 4)}
                      </div>

                      <div className="w-full sm:w-1/2 bg-ivory p-6 sm:p-8 rounded-3xl border border-line shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-xs font-semibold text-brass uppercase tracking-wider block mb-1">
                          Milestone · {m.year}
                        </span>
                        <h3 className="font-display text-xl font-semibold text-navy">
                          {m.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  </SectionReveal>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-padding bg-ivory">
        <div className="container-main">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="mb-2 text-xs font-semibold tracking-widest text-brass uppercase">
                Our Methodology
              </p>
              <h2 className="font-display text-3xl font-semibold text-navy">
                A simple, structured 3-step process
              </h2>
            </div>
          </SectionReveal>

          <div className="grid gap-8 md:grid-cols-3">
            {approachSteps.map((item, i) => (
              <SectionReveal key={item.step} delay={i * 100}>
                <div className="h-full rounded-3xl border border-line bg-cream p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brass/40 hover:shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl p-3 bg-ivory rounded-2xl border border-line shadow-sm">
                        {item.icon}
                      </span>
                      <span className="font-display text-3xl font-bold text-brass/40">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values with Icons (Addressing Humanizing Visual Elements) */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="mb-2 text-xs font-semibold tracking-widest text-brass uppercase">
                Core Philosophy
              </p>
              <h2 className="font-display text-3xl font-semibold text-navy">
                What guides every recommendation
              </h2>
            </div>
          </SectionReveal>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((v, i) => (
              <SectionReveal key={v.title} delay={i * 80}>
                <div className="bg-ivory rounded-3xl p-8 border border-line text-center shadow-sm hover:shadow-card transition-all">
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="font-display text-xl font-semibold text-navy mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Humanizing Advisor Profile Card (Addressing UX Evaluation Report Page 3) */}
      <section className="section-padding bg-ivory">
        <div className="container-main">
          <SectionReveal>
            <div className="mx-auto max-w-3xl rounded-3xl border border-brass/30 bg-cream p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="pointer-events-none absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full bg-brass/10 blur-2xl" aria-hidden="true" />
              
              <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left relative z-10">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-navy font-display text-4xl font-bold text-brass shadow-xl border-4 border-ivory">
                  PR
                </div>
                
                <div className="space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-brass/15 text-navy font-semibold text-xs uppercase tracking-wider">
                    AMFI Registered · {siteConfig.advisor.arn}
                  </div>
                  <h3 className="font-display text-3xl font-semibold text-navy">
                    {siteConfig.advisor.name}
                  </h3>
                  <p className="text-brass font-medium text-base">
                    {siteConfig.advisor.title} · {siteConfig.advisor.location}
                  </p>
                  <p className="text-sm text-muted leading-relaxed pt-2">
                    {siteConfig.advisor.bio}
                  </p>
                  <div className="pt-4 flex flex-wrap justify-center sm:justify-start gap-3">
                    <Button
                      href={`mailto:${siteConfig.contact.email}`}
                      className="px-5 py-2 text-xs"
                    >
                      Email Advisor
                    </Button>
                    <Button href={`tel:${siteConfig.contact.phoneTel}`} variant="ghost" className="px-5 py-2 text-xs">
                      Call Direct
                    </Button>
                    <a
                      href={siteConfig.contact.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border-2 border-[#25D366] bg-[#25D366]/10 px-5 py-2 text-xs font-semibold text-[#128C7E] transition-all hover:bg-[#25D366] hover:text-white"
                    >
                      WhatsApp Chat
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="grain-overlay section-padding bg-navy text-center text-ivory relative overflow-hidden">
        <div className="container-main relative z-10">
          <SectionReveal>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">Ready to begin your investment journey?</h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory/80 text-lg">
              Open your mutual fund account online via our SEBI-compliant platform in under 5 minutes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href={siteConfig.onboardingUrl} external>
                Open Account Online
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
