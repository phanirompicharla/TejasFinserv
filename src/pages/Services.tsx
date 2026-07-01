import { useState } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../lib/siteConfig'
import { Button } from '../components/Button'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'

const serviceLines = [
  {
    id: 'mutual-funds',
    title: 'Mutual Funds & SIPs',
    tagline: 'Wealth creation tailored to your life goals',
    description:
      'Access 5,000+ schemes across 40+ top AMCs in India. We analyze risk-adjusted returns, expense ratios, and portfolio overlap to construct a diversified portfolio for long-term growth.',
    features: [
      'Goal-based SIP & Lump Sum recommendations',
      'Portfolio rebalancing & tax-harvesting strategies',
      'Zero-paperwork online onboarding via AssetPlus',
      'Continuous performance monitoring & review',
    ],
    path: '/mutual-funds',
    icon: (
      <svg className="w-8 h-8 text-brass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    id: 'financial-planning',
    title: 'Comprehensive Financial Planning',
    tagline: 'Your holistic roadmap to financial freedom',
    description:
      'We align your income, cash flows, existing assets, and life aspirations into a structured, step-by-step financial plan designed to navigate market cycles and life changes.',
    features: [
      'Retirement corpus & cash flow modeling',
      'Child higher education & marriage fund planning',
      'Emergency fund setup & liability management',
      'Tax-efficient asset structuring under current laws',
    ],
    path: '/financial-planning',
    icon: (
      <svg className="w-8 h-8 text-brass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'term-insurance',
    title: 'Term & Life Insurance Advisory',
    tagline: 'Uncompromising financial security for your family',
    description:
      'True wealth planning begins with protection. We help you calculate your exact Human Life Value (HLV) and select pure protection term plans with high claim settlement ratios.',
    features: [
      'Human Life Value (HLV) risk assessment',
      'Unbiased comparison of top insurers',
      'Critical illness & accidental disability rider analysis',
      'Dedicated claim assistance for beneficiaries',
    ],
    path: '/term-insurance',
    icon: (
      <svg className="w-8 h-8 text-brass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'health-insurance',
    title: 'Health Insurance & Mediclaim',
    tagline: 'Safeguard savings against medical emergencies',
    description:
      'Medical inflation in India is over 14% annually. We guide families and senior citizens to robust health plans featuring zero room rent limits, no copays, and comprehensive coverage.',
    features: [
      'Comprehensive family floater & individual health covers',
      'Pre existing disease waiting period optimization',
      'Super top up plans to multiply coverage affordably',
      'Cashless hospital network verification in Andhra Pradesh',
    ],
    path: '/health-insurance',
    icon: (
      <svg className="w-8 h-8 text-brass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
]

export function Services() {
  const [activeInquiry, setActiveInquiry] = useState<string | null>(null)
  const [inquirySent, setInquirySent] = useState(false)

  const handleInquire = (serviceTitle: string) => {
    setActiveInquiry(serviceTitle)
    setInquirySent(false)
  }

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault()
    setInquirySent(true)
    setTimeout(() => {
      setActiveInquiry(null)
      setInquirySent(false)
    }, 2500)
  }

  return (
    <>
      <Seo
        title="Our Services — Mutual Funds, Insurance & Planning | TejasFinserv"
        description="Explore AMFI-registered mutual fund distribution, holistic financial planning, term life insurance, and family health mediclaim advisory in Vijayawada."
        path="/services"
      />

      {/* Hero Section */}
      <section className="grain-overlay bg-navy pt-36 pb-20 text-ivory relative overflow-hidden">
        <div className="container-main relative z-10">
          <SectionReveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brass">
              Core Offerings
            </p>
            <h1 className="font-display text-4xl font-semibold sm:text-5xl lg:text-6xl max-w-3xl leading-tight">
              Strategic financial guidance for every stage of life.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-ivory/80 leading-relaxed">
              We combine data-driven fund analysis with unbiased advisory. No jargon, no hidden agendas—just transparent wealth strategies tailored to your goals.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Modular Service Grids */}
      <section className="section-padding bg-ivory">
        <div className="container-main">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-3xl font-semibold text-navy">
                Specialized Advisory Solutions
              </h2>
              <p className="mt-4 text-muted">
                Whether you are starting your first SIP or structuring a multi-generational retirement corpus, our specialized service lines provide complete peace of mind.
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-10 lg:grid-cols-2">
            {serviceLines.map((service, i) => (
              <SectionReveal key={service.id} delay={i * 100}>
                <div className="h-full flex flex-col justify-between rounded-3xl border border-line bg-cream p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1.5 hover:border-brass/40 hover:shadow-2xl group">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-ivory border border-line flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                        {service.icon}
                      </div>
                      <span className="text-xs font-semibold tracking-wider uppercase text-brass bg-navy/5 px-3 py-1.5 rounded-full border border-navy/10">
                        AMFI & IRDAI Aligned
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-semibold text-navy group-hover:text-brass transition-colors duration-200">
                      {service.title}
                    </h3>
                    <p className="text-sm font-medium text-brass mt-1 mb-4">
                      {service.tagline}
                    </p>
                    <p className="text-muted text-base leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="border-t border-line/60 pt-6 mb-8">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-navy mb-4">
                        Key Advantages:
                      </h4>
                      <ul className="space-y-2.5">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm text-ink">
                            <span className="text-brass font-bold mt-0.5">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Contextual Micro-Actions (UX Report Item) */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-line/60">
                    <Link
                      to={service.path}
                      className="inline-flex items-center justify-center rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-ivory transition-all hover:bg-navy-deep hover:shadow-lg active:scale-95"
                    >
                      Explore Details →
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleInquire(service.title)}
                      className="inline-flex items-center justify-center rounded-xl border border-line bg-ivory px-5 py-2.5 text-sm font-medium text-navy transition-all hover:border-brass hover:text-brass active:scale-95"
                    >
                      Inquire About This Service
                    </button>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contextual Inquiry Modal / Overlay */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-ivory rounded-3xl border border-line shadow-2xl p-6 sm:p-8 max-w-lg w-full relative">
            <button
              type="button"
              onClick={() => setActiveInquiry(null)}
              className="absolute top-6 right-6 text-muted hover:text-navy text-xl font-bold p-1"
              aria-label="Close modal"
            >
              ✕
            </button>

            <h3 className="font-display text-2xl font-semibold text-navy mb-1">
              Inquire: {activeInquiry}
            </h3>
            <p className="text-sm text-muted mb-6">
              Connect directly with Phani Rompicharla for specialized guidance on this service.
            </p>

            {inquirySent ? (
              <div className="bg-cream border border-brass/30 rounded-2xl p-6 text-center animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-brass/20 text-brass text-2xl flex items-center justify-center mx-auto mb-3">
                  ✓
                </div>
                <h4 className="font-display font-semibold text-navy text-lg">Inquiry Received!</h4>
                <p className="text-sm text-muted mt-1">
                  Thanks! We will review your request regarding <strong className="text-navy">{activeInquiry}</strong> and get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy uppercase mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy uppercase mb-1.5">
                    Phone Number / WhatsApp *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy uppercase mb-1.5">
                    Message / Preferred Call Time
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={`I am interested in exploring ${activeInquiry}. Please guide me on the next steps.`}
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <Button type="submit" className="w-full">
                    Submit Inquiry
                  </Button>
                </div>
                <p className="text-center text-xs text-muted mt-2">
                  Prefer instant response?{' '}
                  <a href={siteConfig.contact.whatsappUrl} target="_blank" rel="noreferrer" className="text-brass font-medium underline">
                    Chat on WhatsApp
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <section className="grain-overlay section-padding bg-navy text-center text-ivory relative overflow-hidden">
        <div className="container-main relative z-10">
          <SectionReveal>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Ready to take control of your financial future?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory/80 text-lg">
              Open your mutual fund account online in minutes or schedule a 1-on-1 discovery consultation.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href={siteConfig.onboardingUrl} external>
                Open Account Online
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
