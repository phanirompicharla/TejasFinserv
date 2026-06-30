import { siteConfig } from '../lib/siteConfig'
import { Button } from '../components/Button'
import { InsurancePartnersStrip } from '../components/InsurancePartnersStrip'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'

const products = [
  {
    title: 'Term life',
    description:
      'Pure protection for your family at an affordable premium. Essential cover for earning members.',
  },
  {
    title: 'Health insurance',
    description:
      'Medical cover for hospitalization and treatments — individual and family floater plans.',
  },
  {
    title: 'Personal accident',
    description:
      'Financial support in case of accidental death or disability. A critical safety layer.',
  },
  {
    title: 'Savings / ULIP',
    description:
      'Investment-linked insurance products. Note: market-linked returns carry risk — we help you evaluate suitability.',
  },
  {
    title: 'Business cover',
    description:
      'Protect your business assets, key personnel, and operations against unforeseen events.',
  },
]

export function Insurance() {
  return (
    <>
      <Seo
        title={siteConfig.seo.insurance.title}
        description={siteConfig.seo.insurance.description}
        path="/insurance"
      />

      <section className="grain-overlay bg-navy pt-32 pb-20 text-ivory">
        <div className="container-main">
          <p className="mb-3 text-sm font-semibold tracking-widest text-brass-soft uppercase">
            Insurance
          </p>
          <h1 className="max-w-3xl font-display font-semibold">
            Protect what matters most.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/80">
            The right cover for your family and business — chosen with clarity, not confusion.
          </p>
        </div>
      </section>

      <section className="section-padding bg-ivory">
        <div className="container-main">
          <SectionReveal>
            <h2 className="font-display font-semibold text-navy">
              Insurance products we advise on
            </h2>
          </SectionReveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <SectionReveal key={product.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-line bg-cream p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brass/30 hover:shadow-card">
                  <h3 className="font-display text-lg font-semibold text-navy">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{product.description}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <InsurancePartnersStrip />

      <div className="hairline" />

      <section className="section-padding bg-cream">
        <div className="container-main max-w-3xl">
          <SectionReveal>
            <h2 className="font-display font-semibold text-navy">
              How we help you choose
            </h2>
            <p className="mt-4 text-muted">
              Insurance is not one-size-fits-all. We assess your life stage, dependents,
              income, existing cover, and liabilities before recommending any policy. Our
              goal is adequate protection without over-insuring — so you pay for cover you
              actually need, not products pushed for commission.
            </p>
            <ul className="mt-6 space-y-3 text-muted">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                Needs-based analysis of your protection gaps
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                Comparison across insurers for the best fit
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                Clear explanation of exclusions, waiting periods, and claim processes
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                Annual review to adjust cover as your life evolves
              </li>
            </ul>
          </SectionReveal>
        </div>
      </section>

      <section className="grain-overlay section-padding bg-navy text-center text-ivory">
        <div className="container-main">
          <SectionReveal>
            <h2 className="font-display font-semibold">
              Let's find the right cover for you.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory/80">
              Reach out for a no-obligation discussion about your insurance needs.
            </p>
            <div className="mt-8">
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
