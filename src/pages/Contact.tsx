import { siteConfig } from '../lib/siteConfig'
import { Button } from '../components/Button'
import { ContactForm } from '../components/ContactForm'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'

export function Contact() {
  return (
    <>
      <Seo
        title={siteConfig.seo.contact.title}
        description={siteConfig.seo.contact.description}
        path="/contact"
      />

      <section className="grain-overlay bg-navy pt-36 sm:pt-40 pb-20 text-ivory">
        <div className="container-main">
          <p className="mb-3 text-sm font-semibold tracking-widest text-brass-soft uppercase">
            Contact
          </p>
          <h1 className="font-display font-semibold">Let's talk.</h1>
        </div>
      </section>

      <section className="section-padding bg-ivory">
        <div className="container-main grid gap-16 lg:grid-cols-2">
          <SectionReveal>
            <h2 className="font-display text-2xl font-semibold text-navy">
              Get in touch
            </h2>
            <p className="mt-4 text-muted">
              Whether you have a question about mutual funds, need help with financial
              planning, or want to discuss insurance — we are here to help.
            </p>

            <dl className="mt-10 space-y-6">
              <div>
                <dt className="text-sm font-semibold text-brass uppercase tracking-wider">
                  Address
                </dt>
                <dd className="mt-1">
                  <a
                    href={siteConfig.contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-muted transition-colors hover:text-navy"
                  >
                    {siteConfig.contact.address}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-brass uppercase tracking-wider">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="link-underline text-muted transition-colors hover:text-navy"
                  >
                    {siteConfig.contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-brass uppercase tracking-wider">
                  Phone
                </dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${siteConfig.contact.phoneTel}`}
                    className="link-underline text-muted transition-colors hover:text-navy"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-brass uppercase tracking-wider">
                  Hours
                </dt>
                <dd className="mt-1 text-muted">
                  {siteConfig.contact.hours}
                  <span className="mt-1 block text-xs text-brass">
                    [CONFIRM] — please confirm business hours with client before launch.
                  </span>
                </dd>
              </div>
            </dl>

            <div className="mt-10">
              <Button href={siteConfig.onboardingUrl} external>
                Open Your Account
              </Button>
            </div>
          </SectionReveal>

          <SectionReveal delay={100}>
            <div className="rounded-2xl border border-line bg-cream p-8 shadow-card">
              <h2 className="font-display text-xl font-semibold text-navy">
                Send us a message
              </h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Map */}
      <section className="bg-cream pb-0">
        <div className="container-main section-padding pt-0">
          <SectionReveal>
            <h2 className="mb-8 font-display text-2xl font-semibold text-navy">
              Find us
            </h2>
            <div className="overflow-hidden rounded-2xl border border-line shadow-card">
              <iframe
                title="TejasFinserv office location in Yanamalakuduru, Vijayawada"
                src={siteConfig.contact.mapsEmbedUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
