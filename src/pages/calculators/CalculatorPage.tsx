import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { CalculatorShell } from '../../components/calculators/CalculatorShell'
import { Seo } from '../../components/Seo'
import { getCalculator } from '../../lib/calculators/registry'
import { breadcrumbSchema, faqPageSchema, speakableSchema } from '../../schema'

export function CalculatorPage() {
  const { slug } = useParams<{ slug: string }>()
  const calculator = slug ? getCalculator(slug) : undefined

  if (!calculator) {
    return (
      <div className="container-main section-padding text-center">
        <h1 className="font-display text-2xl text-navy">Calculator not found</h1>
        <Link to="/calculators" className="mt-4 inline-block text-brass link-underline">← All Calculators</Link>
      </div>
    )
  }

  const path = `/calculators/${calculator.slug}`

  return (
    <>
      <Seo
        title={calculator.seoTitle}
        description={calculator.seoDescription}
        path={path}
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Calculators', path: '/calculators' },
            { name: calculator.title, path },
          ]),
          faqPageSchema(calculator.faqs),
          speakableSchema(path, ['.speakable-answer']),
        ]}
      />
      <section className="grain-overlay bg-navy pt-32 pb-12 text-ivory">
        <div className="container-main">
          <Breadcrumbs variant="light" items={[
            { name: 'Home', path: '/' },
            { name: 'Calculators', path: '/calculators' },
            { name: calculator.title },
          ]} />
          <h1 className="font-display font-semibold">{calculator.title}</h1>
          <p className="mt-4 max-w-2xl text-ivory/80">{calculator.description}</p>
        </div>
      </section>
      <section className="section-padding bg-ivory">
        <div className="container-main">
          <CalculatorShell calculator={calculator} />
        </div>
      </section>
    </>
  )
}
