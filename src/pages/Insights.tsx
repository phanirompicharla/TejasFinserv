import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'
import { insights } from '../content/insights'
import { siteConfig } from '../lib/siteConfig'
import { breadcrumbSchema, websiteSchema } from '../schema'

export function Insights() {
  return (
    <>
      <Seo
        title={siteConfig.seo.insights.title}
        description={siteConfig.seo.insights.description}
        path="/insights"
        jsonLd={[websiteSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Insights', path: '/insights' }])]}
      />
      <section className="grain-overlay bg-navy pt-32 pb-16 text-ivory">
        <div className="container-main">
          <Breadcrumbs variant="light" items={[{ name: 'Home', path: '/' }, { name: 'Insights' }]} />
          <h1 className="font-display font-semibold">Investment Insights</h1>
          <p className="mt-4 max-w-2xl text-ivory/80">
            Expert guides on SIP, tax saving, retirement, and mutual fund investing — by Phani Rompicharla, ARN-251896.
          </p>
        </div>
      </section>
      <section className="section-padding bg-ivory">
        <div className="container-main grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((post, i) => (
            <SectionReveal key={post.slug} delay={i * 60}>
              <article className="flex h-full flex-col rounded-2xl border border-line bg-cream p-6 transition-all hover:-translate-y-1 hover:shadow-card">
                <time dateTime={post.datePublished} className="text-xs text-brass">{post.datePublished}</time>
                <h2 className="mt-2 font-display text-lg font-semibold text-navy">
                  <Link to={`/insights/${post.slug}`} className="hover:text-brass">{post.title}</Link>
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted">{post.description}</p>
                <p className="mt-4 text-xs text-muted">By {post.author} · {post.readTime}</p>
              </article>
            </SectionReveal>
          ))}
        </div>
      </section>
    </>
  )
}
