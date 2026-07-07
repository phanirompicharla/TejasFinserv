import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Seo } from '../components/Seo'
import { breadcrumbSchema } from '../schema'

interface SitemapSection {
  title: string
  icon: string
  description: string
  links: { label: string; path: string; desc?: string }[]
}

const sitemapData: SitemapSection[] = [
  {
    title: 'Company & Advisory',
    icon: '🏢',
    description: 'Learn about TejasFinserv, our AMFI registration, and our mission in Vijayawada.',
    links: [
      { label: 'Home Page', path: '/', desc: 'Main portal for mutual fund distribution and financial planning.' },
      { label: 'About Phani Rompicharla', path: '/about', desc: 'Founder philosophy and regulatory AMFI credentials.' },
      { label: 'Our Services Hub', path: '/services', desc: 'Comprehensive wealth management and advisory offerings.' },
      { label: 'Contact Us', path: '/contact', desc: 'Visit our Yanamalakuduru office or connect on WhatsApp.' },
      { label: 'Frequently Asked Questions', path: '/faq', desc: 'Answers about SIPs, mutual funds, tax saving, and safety.' },
      { label: 'Investment Insights & Blog', path: '/insights', desc: 'Market guides, SIP strategies, and personal finance articles.' },
    ],
  },
  {
    title: 'Wealth & Investment Advisory',
    icon: '📈',
    description: 'Tailored investment distribution across mutual funds and structured goal planning.',
    links: [
      { label: 'Mutual Fund Distribution', path: '/mutual-funds', desc: 'Expert scheme selection, rebalancing, and portfolio tracking.' },
      { label: 'Financial Planning', path: '/financial-planning', desc: 'Holistic wealth mapping for short and long-term milestones.' },
      { label: 'Child Higher Education Goal', path: '/goals/education', desc: 'Dedicated planning for future education expenses.' },
      { label: 'Retirement Corpus Planning', path: '/goals/retirement', desc: 'Build a stress-free financial cushion for post-retirement life.' },
      { label: 'Long-Term Wealth Creation', path: '/goals/wealth', desc: 'Systematic compounding strategies for financial independence.' },
    ],
  },
  {
    title: 'Insurance Protection Shield',
    icon: '🛡️',
    description: 'Risk management advisory to protect your family and financial assets.',
    links: [
      { label: 'Insurance Advisory Hub', path: '/insurance', desc: 'Overview of human life value and family risk protection.' },
      { label: 'Pure Term Life Insurance', path: '/term-insurance', desc: 'High-cover term life policies with 100% claim assistance.' },
      { label: 'Cashless Family Health Cover', path: '/health-insurance', desc: 'Comprehensive medical insurance with zero room rent capping.' },
    ],
  },
  {
    title: 'Free Financial Calculators',
    icon: '🧮',
    description: 'Interactive online tools to calculate returns, SIP amounts, and financial goals.',
    links: [
      { label: 'All Calculators Hub', path: '/calculators', desc: 'Browse our complete suite of 18+ free financial calculators.' },
      { label: 'SIP Investment Calculator', path: '/calculators/sip', desc: 'Calculate wealth accumulation through monthly SIPs.' },
      { label: 'Step-Up SIP Calculator', path: '/calculators/step-up-sip', desc: 'See how increasing SIP by 5-10% yearly accelerates wealth.' },
      { label: 'Retirement Corpus Calculator', path: '/calculators/retirement', desc: 'Estimate required corpus for your desired retirement lifestyle.' },
      { label: 'Child Education Estimator', path: '/calculators/education', desc: 'Calculate inflation-adjusted costs for college degrees.' },
      { label: 'Lump-Sum Investment Calculator', path: '/calculators/lumpsum', desc: 'Project returns on one-time mutual fund investments.' },
      { label: 'SIP Delay Cost Calculator', path: '/calculators/sip-delay', desc: 'Understand the exponential cost of delaying your investment.' },
      { label: 'Systematic Withdrawal Plan (SWP)', path: '/calculators/swp', desc: 'Plan regular monthly income from an accumulated corpus.' },
      { label: 'Systematic Transfer Plan (STP)', path: '/calculators/stp', desc: 'Transfer funds systematically from debt to equity schemes.' },
      { label: 'Mutual Fund vs FD Calculator', path: '/calculators/mf-vs-fd', desc: 'Compare post-tax returns between mutual funds and fixed deposits.' },
      { label: 'Fixed Deposit (FD) Calculator', path: '/calculators/fd', desc: 'Calculate bank fixed deposit maturity and interest.' },
      { label: 'Recurring Deposit (RD) Calculator', path: '/calculators/rd', desc: 'Estimate returns on monthly bank recurring deposits.' },
      { label: 'Public Provident Fund (PPF)', path: '/calculators/ppf', desc: 'Calculate 15-year tax-free PPF maturity value.' },
      { label: 'Employees Provident Fund (EPF)', path: '/calculators/epf', desc: 'Estimate retirement accumulation through EPF deductions.' },
      { label: 'Sukanya Samriddhi Yojana (SSY)', path: '/calculators/ssy', desc: 'Plan tax-free savings for your daughter’s future.' },
      { label: 'National Pension System (NPS)', path: '/calculators/nps', desc: 'Calculate NPS pension wealth and annuity income.' },
      { label: 'Interest Calculator', path: '/calculators/interest', desc: 'Calculate simple and compound interest growth.' },
      { label: 'Home / Auto EMI Calculator', path: '/calculators/emi', desc: 'Calculate monthly loan installments and interest breakdown.' },
      { label: 'CAGR Return Calculator', path: '/calculators/cagr', desc: 'Compute compound annual growth rate of your investments.' },
      { label: 'Inflation & Purchasing Power', path: '/calculators/inflation', desc: 'Calculate future purchasing power erosion due to inflation.' },
    ],
  },
  {
    title: 'Legal & Regulatory Disclaimers',
    icon: '📜',
    description: 'AMFI regulatory compliance, user privacy, and terms of service.',
    links: [
      { label: 'Privacy Policy', path: '/privacy', desc: 'How TejasFinserv collects and safeguards your client data.' },
      { label: 'Terms of Use', path: '/terms', desc: 'Legal terms and rules for accessing tejasfinserv.com.' },
      { label: 'Regulatory Disclaimers', path: '/disclaimer', desc: 'AMFI ARN-251896 disclosures and mutual fund risk notices.' },
      { label: 'Admin Portal Login', path: '/admin', desc: 'Authorized personnel login for client consultation review.' },
    ],
  },
]

export function Sitemap() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = sitemapData
    .map((section) => ({
      ...section,
      links: section.links.filter(
        (link) =>
          link.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (link.desc && link.desc.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    }))
    .filter((section) => section.links.length > 0)

  return (
    <>
      <Seo
        title="Sitemap — TejasFinserv All Pages & Calculators"
        description="Browse the complete directory of TejasFinserv pages, financial calculators, mutual fund distribution guides, and insurance advisory tools."
        path="/sitemap"
        jsonLd={[
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Sitemap', path: '/sitemap' }]),
        ]}
      />

      <main className="bg-cream min-h-screen pb-20">
        <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Sitemap' }]} />

        {/* Hero Banner */}
        <section className="bg-navy py-14 text-ivory relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d2b68d_1px,transparent_1px)] [background-size:16px_16px]" aria-hidden="true" />
          <div className="container-main relative z-10 text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-brass/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brass mb-4">
              Directory
            </span>
            <h1 className="font-display text-4xl font-bold md:text-5xl tracking-tight">
              TejasFinserv Sitemap
            </h1>
            <p className="mt-4 text-base md:text-lg text-ivory/80 leading-relaxed">
              An organized guide to all our advisory pages, wealth management services, and 18+ free financial calculators in Vijayawada.
            </p>

            {/* Search Filter Box */}
            <div className="mt-8 max-w-md mx-auto relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg">🔍</span>
              <input
                type="text"
                placeholder="Search any page or calculator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl bg-ivory/10 border border-ivory/20 py-3 pl-12 pr-4 text-ivory placeholder:text-ivory/50 focus:bg-ivory focus:text-navy focus:outline-none focus:ring-2 focus:ring-brass transition-all text-sm font-body shadow-inner"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-ivory/20 hover:bg-ivory/30 text-ivory px-2 py-1 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Sitemap Grid */}
        <div className="container-main mt-12">
          {filteredData.length === 0 ? (
            <div className="rounded-2xl bg-ivory p-12 text-center border border-line shadow-sm max-w-xl mx-auto">
              <span className="text-4xl block mb-3">📭</span>
              <h3 className="font-display text-xl font-bold text-navy">No matching pages found</h3>
              <p className="mt-2 text-sm text-muted">
                We couldn't find any links matching "<span className="font-semibold text-navy">{searchTerm}</span>". Try searching for "SIP", "Term", or "Contact".
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-6 rounded-xl bg-navy px-6 py-2.5 text-xs font-semibold text-ivory hover:bg-navy-deep transition-all shadow-md active:scale-95"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredData.map((section) => (
                <div
                  key={section.title}
                  className="bg-ivory rounded-2xl border border-line p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="flex items-center gap-3 pb-4 border-b border-line mb-4">
                    <span className="text-3xl p-2 bg-cream rounded-xl">{section.icon}</span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-navy">
                        {section.title}
                      </h2>
                      <p className="text-xs text-muted leading-tight mt-0.5">
                        {section.links.length} {section.links.length === 1 ? 'page' : 'pages'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-ink/70 mb-5 leading-relaxed bg-cream/60 p-3 rounded-xl border border-line/50">
                    {section.description}
                  </p>

                  <ul className="space-y-3 flex-1">
                    {section.links.map((link) => (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className="group block rounded-xl p-2.5 hover:bg-cream transition-colors border border-transparent hover:border-line/60"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-navy group-hover:text-brass transition-colors flex items-center gap-1.5">
                              <span className="text-brass opacity-0 group-hover:opacity-100 transition-opacity -ml-3 group-hover:ml-0">→</span>
                              {link.label}
                            </span>
                            <span className="text-[10px] font-mono text-muted bg-cream group-hover:bg-ivory px-2 py-0.5 rounded border border-line/40">
                              {link.path}
                            </span>
                          </div>
                          {link.desc && (
                            <p className="text-xs text-muted mt-1 leading-normal pl-4 border-l-2 border-brass/30 group-hover:border-brass transition-colors">
                              {link.desc}
                            </p>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action Banner */}
        <div className="container-main mt-16">
          <div className="rounded-3xl bg-navy p-8 md:p-12 text-ivory text-center relative overflow-hidden border border-line/20 shadow-xl">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brass/10 blur-2xl pointer-events-none" />
            <h3 className="font-display text-2xl font-bold md:text-3xl">
              Need Personalized Guidance on These Services?
            </h3>
            <p className="mt-2 text-sm md:text-base text-ivory/80 max-w-2xl mx-auto">
              Connect directly with Phani Rompicharla, our AMFI-registered mutual fund distributor (ARN-251896) in Vijayawada, for a 1-on-1 consultation.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="rounded-xl bg-brass px-6 py-3 text-sm font-bold text-navy shadow-lg hover:bg-brass-soft transition-all active:scale-95"
              >
                Schedule Consultation →
              </Link>
              <Link
                to="/calculators"
                className="rounded-xl border border-ivory/30 bg-ivory/10 px-6 py-3 text-sm font-semibold text-ivory hover:bg-ivory/20 transition-all active:scale-95"
              >
                Try Free Calculators
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
