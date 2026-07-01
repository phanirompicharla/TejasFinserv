import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { SectionReveal } from '../../components/SectionReveal'
import { Seo } from '../../components/Seo'
import { calculators, tier1Calculators, tier2Calculators, tier3Calculators } from '../../lib/calculators/registry'
import { siteConfig } from '../../lib/siteConfig'
import { breadcrumbSchema, faqPageSchema, financialServiceSchema, websiteSchema } from '../../schema'

const hubFaqs = [
  { question: 'Are these calculators free?', answer: 'Yes, all calculators on TejasFinserv are completely free. Use them to plan SIP amounts, retirement corpus, EMI, and more before you start investing.' },
  { question: 'How accurate are the results?', answer: 'Results are illustrative based on assumed returns you enter. Actual mutual fund returns vary with market conditions. Mutual fund investments are subject to market risks.' },
]

function CalcGrid({ items, title }: { items: typeof calculators; title: string }) {
  return (
    <div className="mt-10">
      <h2 className="font-display text-xl font-semibold text-navy">{title}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((calc, i) => (
          <SectionReveal key={calc.slug} delay={i * 50} className="h-full">
            <Link
              to={`/calculators/${calc.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-line bg-cream p-6 transition-all hover:-translate-y-1 hover:border-brass/40 hover:shadow-card"
            >
              <h3 className="font-display text-lg font-semibold text-navy group-hover:text-brass">{calc.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{calc.description}</p>
              {calc.stub && <span className="mt-2 text-xs text-brass">Extended model</span>}
              <span className="mt-4 text-sm font-semibold text-brass">Calculate →</span>
            </Link>
          </SectionReveal>
        ))}
      </div>
    </div>
  )
}

export function CalculatorsHub() {
  return (
    <>
      <Seo
        title={siteConfig.seo.calculators.title}
        description={siteConfig.seo.calculators.description}
        path="/calculators"
        jsonLd={[financialServiceSchema(), websiteSchema(), breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/calculators' },
        ]), faqPageSchema(hubFaqs)]}
      />
      <section className="grain-overlay bg-navy pt-36 sm:pt-40 pb-16 text-ivory">
        <div className="container-main">
          <Breadcrumbs variant="light" items={[{ name: 'Home', path: '/' }, { name: 'Calculators' }]} />
          <h1 className="font-display font-semibold">Financial Calculators</h1>
          <p className="mt-4 max-w-2xl text-ivory/80">
            Plan your SIP, retirement, EMI, and investment goals with free, live-updating calculators. All results in Indian Rupees.
          </p>
        </div>
      </section>
      <section className="section-padding bg-ivory">
        <div className="container-main">
          <CalcGrid items={tier1Calculators} title="Essential Calculators" />
          <CalcGrid items={tier2Calculators} title="Planning Tools" />
          <CalcGrid items={tier3Calculators} title="Tax & Government Schemes" />
        </div>
      </section>
    </>
  )
}
