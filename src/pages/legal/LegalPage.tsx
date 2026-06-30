import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Seo } from '../../components/Seo'
import { siteConfig } from '../../lib/siteConfig'

interface LegalSection {
  title: string
  paragraphs: string[]
}

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'disclaimer'
  title: string
  sections: LegalSection[]
}

const legalContent: Record<LegalPageProps['type'], { seoKey: keyof typeof siteConfig.seo; sections: LegalSection[] }> = {
  privacy: {
    seoKey: 'privacy',
    sections: [
      { title: 'Information We Collect', paragraphs: ['We collect information you provide through contact forms, newsletter sign-ups, and account onboarding — including name, email, phone number, and investment preferences. We may also collect anonymised usage data via analytics tools.'] },
      { title: 'How We Use Your Information', paragraphs: ['Your information is used to respond to enquiries, provide financial advisory services, send relevant updates (with your consent), and improve our website. We do not sell your personal data to third parties.'] },
      { title: 'Data Security', paragraphs: ['We implement industry-standard security measures to protect your information. Financial transactions are processed through regulated third-party platforms (AssetPlus) with their own security protocols.'] },
      { title: 'Your Rights', paragraphs: ['You may request access, correction, or deletion of your personal data by contacting us at phani.rompicharla@gmail.com.'] },
      { title: 'Cookies', paragraphs: ['We use cookies for site functionality and analytics. You can manage cookie preferences through your browser settings or our cookie consent banner.'] },
    ],
  },
  terms: {
    seoKey: 'terms',
    sections: [
      { title: 'Acceptance of Terms', paragraphs: ['By accessing tejasfinserv.com, you agree to these Terms of Use. If you do not agree, please do not use this website.'] },
      { title: 'Services', paragraphs: ['TejasFinserv is an AMFI-registered Mutual Fund Distributor (ARN-251896) providing mutual fund distribution, financial planning guidance, and insurance advisory. We do not guarantee investment returns.'] },
      { title: 'Calculators & Tools', paragraphs: ['Financial calculators provide illustrative estimates based on assumptions you enter. Results are not guaranteed and should not be treated as financial advice. Consult a qualified advisor before investing.'] },
      { title: 'Intellectual Property', paragraphs: ['All content on this website — text, design, logos, and tools — is owned by TejasFinserv unless otherwise stated. Reproduction without permission is prohibited.'] },
      { title: 'Limitation of Liability', paragraphs: ['TejasFinserv is not liable for investment losses arising from decisions made based on website content. Mutual fund investments are subject to market risks.'] },
    ],
  },
  disclaimer: {
    seoKey: 'disclaimer',
    sections: [
      { title: 'Mutual Fund Disclaimer', paragraphs: [siteConfig.regulatory.disclaimer] },
      { title: 'Investment Risk', paragraphs: ['All investments in mutual funds and securities are subject to market risks. NAVs can go up or down based on market conditions. There is no assurance or guarantee of returns. Investors should read all scheme-related documents carefully before investing.'] },
      { title: 'Calculator Disclaimer', paragraphs: ['Financial calculators on this website provide illustrative projections based on user-entered assumptions. Actual returns may differ materially. These tools do not constitute investment advice or an offer to buy/sell securities.'] },
      { title: 'Third-Party Links', paragraphs: ['This website may link to third-party platforms (AssetPlus, SEBI SCORES, Google Maps). TejasFinserv is not responsible for the content or privacy practices of external sites.'] },
      { title: 'Regulatory Status', paragraphs: [`TejasFinserv operates as a Mutual Fund Distributor registered with AMFI (${siteConfig.regulatory.arn}). We are not a SEBI-registered Investment Adviser unless separately stated.`] },
    ],
  },
}

export function LegalPage({ type }: { type: LegalPageProps['type'] }) {
  const content = legalContent[type]
  const seo = siteConfig.seo[content.seoKey]
  const pageTitle = type.charAt(0).toUpperCase() + type.slice(1)

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={`/${type}`} />
      <section className="grain-overlay bg-navy pt-32 pb-12 text-ivory">
        <div className="container-main">
          <Breadcrumbs variant="light" items={[{ name: 'Home', path: '/' }, { name: pageTitle }]} />
          <h1 className="font-display font-semibold">{pageTitle}</h1>
        </div>
      </section>
      <section className="section-padding bg-ivory">
        <div className="container-main max-w-3xl space-y-10">
          {content.sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-xl font-semibold text-navy">{section.title}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 30)} className="mt-3 text-muted">{p}</p>
              ))}
            </div>
          ))}
          <p className="text-sm text-muted">Last updated: June 2025. For questions, contact {siteConfig.contact.email}.</p>
        </div>
      </section>
    </>
  )
}
