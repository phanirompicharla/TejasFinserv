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
            <span className="inline-flex items-center justify-center w-[72px] h-[72px] bg-white rounded-xl p-3 overflow-hidden shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
              <Logo imgClassName="w-full h-full object-contain object-center" />
            </span>
            <p className="mt-4 text-sm leading-relaxed text-ivory/70">
              {siteConfig.tagline} — AMFI-registered mutual fund distribution, financial planning,
              and insurance advisory in Vijayawada, Andhra Pradesh.
            </p>
            <a
              href="https://www.linkedin.com/company/tejasfinserv/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TejasFinserv LinkedIn"
              className="mt-4 inline-flex items-center text-ivory/70 transition-all duration-200 hover:text-[#0A66C2] hover:scale-110"
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
