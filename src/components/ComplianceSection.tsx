import { siteConfig } from '../lib/siteConfig'
import { SectionReveal } from './SectionReveal'

export function ComplianceSection() {
  return (
    <section className="section-padding bg-cream">
      <div className="container-main">
        <SectionReveal>
          <h2 className="font-display text-2xl font-semibold text-navy">
            Compliance & Investor Protection
          </h2>
        </SectionReveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Grievance Redressal',
              text: `For complaints, contact ${siteConfig.compliance.grievanceEmail} or call ${siteConfig.compliance.grievancePhone}. We aim to resolve grievances within 21 calendar days.`,
            },
            {
              title: 'SEBI SCORES',
              text: 'Register complaints on SEBI SCORES portal for escalation to SEBI if not resolved satisfactorily.',
              link: siteConfig.compliance.scoresUrl,
              linkLabel: 'SEBI SCORES →',
            },
            {
              title: 'Investor Charter',
              text: 'Read the SEBI Investor Charter for your rights and responsibilities as a mutual fund investor.',
              link: siteConfig.compliance.investorCharterUrl,
              linkLabel: 'Investor Charter →',
            },
            {
              title: 'Mutual Funds Sahi Hai',
              text: 'An AMFI investor awareness initiative promoting informed mutual fund investing.',
              link: siteConfig.compliance.mfSahiHaiUrl,
              linkLabel: 'Learn more →',
            },
            {
              title: 'KYC Requirements',
              text: 'PAN, Aadhaar, and bank account proof are required for mutual fund KYC as per AMFI/SEBI regulations. Complete KYC through our onboarding platform.',
            },
            {
              title: 'Registration',
              text: siteConfig.regulatory.badgeLabel,
            },
          ].map((item, i) => (
            <SectionReveal key={item.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-line bg-ivory p-6">
                <h3 className="font-display text-lg font-semibold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-semibold text-brass link-underline"
                  >
                    {item.linkLabel}
                  </a>
                )}
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
