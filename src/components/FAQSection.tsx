import { SectionReveal } from './SectionReveal'

interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQ[]
  title?: string
}

export function FAQSection({ faqs, title = 'FAQ' }: FAQSectionProps) {
  return (
    <section>
      {title && (
        <SectionReveal>
          <h2 className="font-display text-2xl font-semibold text-navy">{title}</h2>
        </SectionReveal>
      )}
      <div className="mt-8 space-y-4">
        {faqs.map((faq, i) => (
          <SectionReveal key={faq.question} delay={i * 60}>
            <details className="group rounded-2xl border border-line bg-ivory p-6">
              <summary className="cursor-pointer font-display text-lg font-semibold text-navy marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="text-brass transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="speakable-answer mt-4 text-muted">{faq.answer}</p>
            </details>
          </SectionReveal>
        ))}
      </div>
    </section>
  )
}
