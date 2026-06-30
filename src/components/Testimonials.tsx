import { siteConfig } from '../lib/siteConfig'
import { SectionReveal } from './SectionReveal'

export function Testimonials() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-main">
        <SectionReveal>
          <p className="mb-3 text-sm font-semibold tracking-widest text-brass uppercase">
            Client Stories
          </p>
          <h2 className="font-display text-2xl font-semibold text-navy">
            Trusted by investors in Vijayawada
          </h2>
        </SectionReveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {siteConfig.testimonials.map((t, i) => (
            <SectionReveal key={t.name} delay={i * 80}>
              <blockquote className="h-full rounded-2xl border border-line bg-cream p-6">
                <p className="text-muted italic">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4">
                  <cite className="not-italic font-semibold text-navy">{t.name}</cite>
                  <p className="text-xs text-muted">{t.location}</p>
                </footer>
              </blockquote>
            </SectionReveal>
          ))}
        </div>
        {siteConfig.reviews.googleUrl && (
          <p className="mt-8 text-center text-sm">
            <a
              href={siteConfig.reviews.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brass link-underline font-semibold"
            >
              Read more on Google Reviews →
            </a>
          </p>
        )}
      </div>
    </section>
  )
}
