import { Breadcrumbs } from '../components/Breadcrumbs'
import { FAQSection } from '../components/FAQSection'
import { Seo } from '../components/Seo'
import { globalFaqs } from '../content/faqs'
import { siteConfig } from '../lib/siteConfig'
import { breadcrumbSchema, faqPageSchema, speakableSchema } from '../schema'

export function FAQ() {
  return (
    <>
      <Seo
        title={siteConfig.seo.faq.title}
        description={siteConfig.seo.faq.description}
        path="/faq"
        jsonLd={[
          faqPageSchema(globalFaqs),
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }]),
          speakableSchema('/faq', ['.speakable-answer']),
        ]}
      />
      <section className="grain-overlay bg-navy pt-36 sm:pt-40 pb-16 text-ivory">
        <div className="container-main">
          <Breadcrumbs variant="light" items={[{ name: 'Home', path: '/' }, { name: 'FAQ' }]} />
          <h1 className="font-display font-semibold">Frequently Asked Questions</h1>
          <p className="mt-4 max-w-2xl text-ivory/80">
            Clear answers about mutual funds, SIP, tax saving, and investing with TejasFinserv in Vijayawada.
          </p>
        </div>
      </section>
      <section className="section-padding bg-ivory">
        <div className="container-main max-w-3xl">
          <FAQSection faqs={globalFaqs} title="Investing with TejasFinserv" />
        </div>
      </section>
    </>
  )
}
