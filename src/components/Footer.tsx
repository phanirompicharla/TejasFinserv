import { Link } from 'react-router-dom'
import { insights } from '../content/insights'
import { calculators } from '../lib/calculators/registry'
import { siteConfig } from '../lib/siteConfig'
import { ArnBadge } from './ArnBadge'
import { Logo } from './Logo'

function FooterLinks({
  title,
  links,
}: {
  title: string
  links: { label: string; to?: string; href?: string; external?: boolean }[]
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brass-soft">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.to ? (
              <Link to={link.to} className="link-underline text-sm text-ivory/80 hover:text-ivory">
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="link-underline text-sm text-ivory/80 hover:text-ivory"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const companyLinks: { label: string; to?: string; href?: string; external?: boolean }[] = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Insights', to: '/insights' },
    { label: 'Sitemap', to: '/sitemap' },
    { label: 'Open Your Account', href: siteConfig.onboardingUrl, external: true },
  ]

  const legalLinks = [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Use', to: '/terms' },
    { label: 'Disclaimer', to: '/disclaimer' },
    { label: 'Sitemap', to: '/sitemap' },
  ]

  const complianceLinks = [
    { label: 'SEBI SCORES', href: siteConfig.compliance.scoresUrl, external: true },
    { label: 'Investor Charter', href: siteConfig.compliance.investorCharterUrl, external: true },
    { label: 'Mutual Funds Sahi Hai', href: siteConfig.compliance.mfSahiHaiUrl, external: true },
    { label: 'AMFI', href: 'https://www.amfiindia.com/', external: true },
  ]

  return (
    <footer className="grain-overlay bg-navy pb-24 text-ivory md:pb-8">
      <div className="container-main section-padding pb-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo className="w-[48px] h-[48px]" imgClassName="w-full h-full object-contain object-left" />
            <p className="mt-4 text-sm leading-relaxed text-ivory/70">
              {siteConfig.tagline} — AMFI-registered mutual fund distribution, financial planning,
              and insurance advisory in Vijayawada, Andhra Pradesh.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/tejasfinserv/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TejasFinserv LinkedIn"
                className="inline-flex items-center text-ivory/70 transition-all duration-200 hover:text-[#0A66C2] hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb0cvTY0rGiK32jBw62H"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TejasFinserv WhatsApp Channel"
                className="inline-flex items-center text-ivory/70 transition-all duration-200 hover:text-[#25D366] hover:scale-110"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          <FooterLinks title="Company" links={companyLinks} />

          <FooterLinks
            title="Services"
            links={siteConfig.services.map((s) => ({ label: s.title, to: s.path }))}
          />

          <FooterLinks
            title="Goals"
            links={siteConfig.goals.map((g) => ({ label: g.title, to: g.path }))}
          />

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brass-soft">Contact</h3>
            <ul className="space-y-3 text-sm text-ivory/80">
              <li>
                <a
                  href={siteConfig.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline hover:text-ivory"
                >
                  {siteConfig.contact.address}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="link-underline hover:text-ivory">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.contact.phoneTel}`} className="link-underline hover:text-ivory">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline hover:text-ivory"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline my-10" />

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brass-soft">
              Calculators
            </h3>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              <li>
                <Link to="/calculators" className="link-underline text-sm font-semibold text-brass-soft hover:text-brass">
                  All Calculators
                </Link>
              </li>
              {calculators.map((calc) => (
                <li key={calc.slug}>
                  <Link
                    to={`/calculators/${calc.slug}`}
                    className="link-underline text-sm text-ivory/80 hover:text-ivory"
                  >
                    {calc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brass-soft">
              Insights
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/insights" className="link-underline text-sm font-semibold text-brass-soft hover:text-brass">
                  All Insights
                </Link>
              </li>
              {insights.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={`/insights/${post.slug}`}
                    className="link-underline text-sm text-ivory/80 hover:text-ivory"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-ivory/70">
          {legalLinks.map((link) => (
            <Link key={link.to} to={link.to!} className="link-underline hover:text-ivory">
              {link.label}
            </Link>
          ))}
          {complianceLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline hover:text-ivory"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <p className="text-xs leading-relaxed text-ivory/70">{siteConfig.regulatory.disclaimer}</p>
          <ArnBadge variant="light" />
          <div className="flex flex-col gap-2 text-xs text-ivory/70 sm:flex-row sm:items-center sm:justify-between">
            <p>{siteConfig.copyright}</p>
            <a href={`https://${siteConfig.domain}`} className="link-underline hover:text-ivory">
              {siteConfig.domain}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
