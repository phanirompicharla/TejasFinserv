import { siteConfig } from '../lib/siteConfig'
import { Button } from '../components/Button'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'
import { organizationSchema, personSchema } from '../schema'

const approachSteps = [
  {
    step: '01',
    title: 'Understand',
    description:
      'We begin by listening — understanding your goals, income, obligations, and risk comfort.',
  },
  {
    step: '02',
    title: 'Plan',
    description:
      'We craft a tailored financial roadmap aligned with your timeline and aspirations.',
  },
  {
    step: '03',
    title: 'Grow',
    description:
      'We implement, monitor, and refine your strategy as life and markets evolve.',
  },
]

const values = ['Integrity', 'Transparency', 'Long-term thinking']

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
      <section className="grain-overlay bg-navy pt-32 pb-20 text-ivory">
        <div className="container-main">
          <p className="mb-3 text-sm font-semibold tracking-widest text-brass-soft uppercase">
            About TejasFinserv
          </p>
          <h1 className="font-display font-semibold">Who we are.</h1>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-ivory">
        <div className="container-main max-w-3xl">
          <SectionReveal>
            <p className="text-lg text-muted">
              TejasFinserv is a dynamic and innovative financial services firm committed to
              helping individuals and businesses achieve their financial goals. Based in
              Vijayawada, we bring together experienced professionals who understand the
              local landscape and the broader investment universe.
            </p>
          </SectionReveal>
          <SectionReveal delay={80}>
            <p className="mt-6 text-lg text-muted">
              Our approach is rooted in relationships. We take the time to understand each
              client's unique circumstances — their income, goals, family responsibilities,
              and appetite for risk — before recommending any solution. We leverage modern
              tools to deliver real-time insights and data-driven strategies, ensuring you
              always have a clear picture of where you stand.
            </p>
          </SectionReveal>
          <SectionReveal delay={160}>
            <p className="mt-6 text-lg text-muted">
              Behind everything we do is our promise: <em>Assistance with Assurance</em>.
              Whether you are starting your first SIP, planning for retirement, or protecting
              your family with the right insurance cover, you can count on honest guidance
              from a registered mutual fund distributor you can trust.
            </p>
          </SectionReveal>
        </div>
      </section>

      <div className="hairline" />

      {/* Our Approach */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <SectionReveal>
            <p className="mb-3 text-sm font-semibold tracking-widest text-brass uppercase">
              Our Approach
            </p>
            <h2 className="font-display font-semibold text-navy">
              A simple, proven process
            </h2>
          </SectionReveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {approachSteps.map((item, i) => (
              <SectionReveal key={item.step} delay={i * 100}>
                <div className="relative rounded-2xl border border-line bg-ivory p-8">
                  <span className="font-display text-4xl font-semibold text-brass/30">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-muted">{item.description}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-ivory">
        <div className="container-main text-center">
          <SectionReveal>
            <p className="mb-3 text-sm font-semibold tracking-widest text-brass uppercase">
              Our Values
            </p>
            <h2 className="font-display font-semibold text-navy">
              What guides every decision
            </h2>
          </SectionReveal>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {values.map((value, i) => (
              <SectionReveal key={value} delay={i * 80}>
                <span className="rounded-full border border-brass/30 bg-cream px-6 py-3 font-display text-lg font-medium text-navy">
                  {value}
                </span>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Advisor Card */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <SectionReveal>
            <div className="mx-auto max-w-lg rounded-2xl border border-line bg-ivory p-10 text-center shadow-card">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-navy font-display text-2xl font-semibold text-brass">
                PR
              </div>
              <h3 className="font-display text-2xl font-semibold text-navy">
                {siteConfig.advisor.name}
              </h3>
              <p className="mt-1 text-brass">
                {siteConfig.advisor.title} ({siteConfig.advisor.arn})
              </p>
              <p className="mt-1 text-muted">{siteConfig.advisor.location}</p>
              <p className="mt-4 text-sm text-muted">{siteConfig.advisor.bio}</p>
              <p className="mt-2 text-xs text-brass">Experience: {siteConfig.advisor.experience}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button
                  href={`mailto:${siteConfig.contact.email}`}
                  variant="ghost"
                >
                  Email
                </Button>
                <Button href={`tel:${siteConfig.contact.phoneTel}`} variant="ghost">
                  Call
                </Button>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="grain-overlay section-padding bg-navy text-center text-ivory">
        <div className="container-main">
          <SectionReveal>
            <h2 className="font-display font-semibold">Ready to get started?</h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory/80">
              Open your account through our secure onboarding platform in minutes.
            </p>
            <div className="mt-8">
              <Button href={siteConfig.onboardingUrl} external>
                Open Your Account
              </Button>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
