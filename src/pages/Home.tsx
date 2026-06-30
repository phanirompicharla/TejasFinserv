import { Link } from 'react-router-dom'
import '../styles/home-hero.css'
import { AmcStrip } from '../components/AmcStrip'
import { AppOnboardingBand } from '../components/AppOnboardingBand'
import { Button } from '../components/Button'
import { ComplianceSection } from '../components/ComplianceSection'
import { FAQSection } from '../components/FAQSection'
import { HomeHero } from '../components/home/HomeHero'
import { NewsletterForm } from '../components/NewsletterForm'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'
import { ServiceCard } from '../components/ServiceCard'
import { StatCounter } from '../components/StatCounter'
import { Testimonials } from '../components/Testimonials'
import { globalFaqs } from '../content/faqs'
import { tier1Calculators } from '../lib/calculators/registry'
import { siteConfig } from '../lib/siteConfig'
import { faqPageSchema, financialServiceSchema, howToSchema, organizationSchema, websiteSchema } from '../schema'

export function Home() {
  const scrollToAbout = () => {
    document.getElementById('who-we-are')?.scrollIntoView({ behavior: 'smooth' })
  }

  const homeFaqs = globalFaqs.slice(0, 4)

  return (
    <>
      <Seo
        title={siteConfig.seo.home.title}
        description={siteConfig.seo.home.description}
        path="/"
        jsonLd={[
          organizationSchema(),
          financialServiceSchema(),
          websiteSchema(),
          faqPageSchema(homeFaqs),
          howToSchema(
            'How to start a SIP with TejasFinserv',
            'Start investing in mutual funds online through TejasFinserv.',
            ['Open account via onboarding link', 'Complete KYC with PAN and bank details', 'Set risk profile and start your SIP']
          ),
        ]}
      />

      <HomeHero onDiscover={scrollToAbout} />

      <section id="who-we-are" className="section-padding bg-ivory">
        <div className="container-main">
          <SectionReveal>
            <p className="mb-3 text-sm font-semibold tracking-widest text-brass uppercase">Who We Are</p>
            <h2 className="max-w-3xl font-display font-semibold text-navy">Building wealth through trusted relationships</h2>
          </SectionReveal>
          <SectionReveal delay={100}>
            <p className="mt-8 max-w-3xl text-lg text-muted">
              TejasFinserv is a dynamic financial services firm committed to helping individuals
              and businesses achieve their financial goals. With experienced professionals, we offer
              investments, savings, insurance, and financial planning — leveraging modern tools for
              real-time insights and data-driven strategies.
            </p>
            <div className="mt-8">
              <Button to="/about">Discover More</Button>
            </div>
          </SectionReveal>
        </div>
      </section>

      <div className="hairline" />

      <section className="grain-overlay section-padding bg-navy-deep">
        <div className="container-main">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            <StatCounter value={siteConfig.stats.schemes} suffix="+" label="Mutual Fund Schemes" />
            <StatCounter value={siteConfig.stats.amcs} suffix="+" label="Asset Management Companies" />
            <StatCounter value={siteConfig.stats.serviceLines} label="Core Service Lines" />
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-main">
          <SectionReveal>
            <p className="mb-3 text-sm font-semibold tracking-widest text-brass uppercase">Free Tools</p>
            <h2 className="font-display font-semibold text-navy">Financial calculators</h2>
            <p className="mt-4 max-w-2xl text-muted">
              Plan your SIP, retirement, EMI, and goals with live-updating calculators — free for every investor.
            </p>
          </SectionReveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tier1Calculators.map((calc, i) => (
              <SectionReveal key={calc.slug} delay={i * 60} className="h-full">
                <Link
                  to={`/calculators/${calc.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-ivory p-5 transition-all hover:-translate-y-1 hover:border-brass/40 hover:shadow-card"
                >
                  <h3 className="font-display font-semibold text-navy group-hover:text-brass">{calc.title}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted">{calc.description}</p>
                </Link>
              </SectionReveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button to="/calculators">View All Calculators</Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-ivory">
        <div className="container-main">
          <SectionReveal>
            <p className="mb-3 text-sm font-semibold tracking-widest text-brass uppercase">Our Services</p>
            <h2 className="font-display font-semibold text-navy">Comprehensive financial solutions</h2>
          </SectionReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {siteConfig.services.map((service, i) => (
              <ServiceCard key={service.path} {...service} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      <AmcStrip />
      <Testimonials />
      <AppOnboardingBand />

      <section className="section-padding bg-ivory">
        <div className="container-main grid gap-12 lg:grid-cols-2">
          <SectionReveal>
            <h2 className="font-display text-2xl font-semibold text-navy">Common questions</h2>
            <p className="mt-4 text-muted">Quick answers about SIP, safety, and getting started.</p>
            <Link to="/faq" className="mt-4 inline-block text-sm font-semibold text-brass link-underline">View all FAQ →</Link>
          </SectionReveal>
          <FAQSection faqs={homeFaqs} title="" />
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-main grid items-center gap-12 lg:grid-cols-2">
          <SectionReveal>
            <h2 className="font-display text-2xl font-semibold text-navy">Stay informed</h2>
            <p className="mt-4 text-muted">Get investment insights and planning tips delivered to your inbox.</p>
          </SectionReveal>
          <SectionReveal delay={100}>
            <NewsletterForm />
          </SectionReveal>
        </div>
      </section>

      <ComplianceSection />
    </>
  )
}
