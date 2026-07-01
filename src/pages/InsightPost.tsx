import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Seo } from '../components/Seo'
import { getInsight } from '../content/insights'
import { siteConfig } from '../lib/siteConfig'
import { articleSchema, breadcrumbSchema, personSchema } from '../schema'

export function InsightPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getInsight(slug) : undefined

  if (!post) {
    return (
      <div className="container-main section-padding text-center">
        <h1 className="font-display text-2xl text-navy">Article not found</h1>
        <Link to="/insights" className="mt-4 inline-block text-brass">← All Insights</Link>
      </div>
    )
  }

  const path = `/insights/${post.slug}`

  return (
    <>
      <Seo
        title={`${post.title} | TejasFinserv`}
        description={post.description}
        path={path}
        jsonLd={[
          articleSchema(post.title, post.description, post.slug, post.datePublished, post.author),
          personSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/insights' },
            { name: post.title, path },
          ]),
        ]}
      />
      <article className="section-padding bg-ivory pt-36 sm:pt-40">
        <div className="container-main max-w-3xl">
          <Breadcrumbs items={[
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/insights' },
            { name: post.title },
          ]} />
          <header>
            <time dateTime={post.datePublished} className="text-sm text-brass">{post.datePublished}</time>
            <h1 className="mt-2 font-display text-4xl font-semibold text-navy">{post.title}</h1>
            <p className="mt-4 text-muted">By <strong>{post.author}</strong> · {post.readTime} · {siteConfig.regulatory.arn}</p>
          </header>
          <div className="prose-custom mt-10 space-y-6 text-muted">
            {post.content.map((para) => (
              <p key={para.slice(0, 40)} className="text-lg leading-relaxed">{para}</p>
            ))}
          </div>
          <p className="mt-10 border-t border-line pt-6 text-xs text-muted italic">
            {siteConfig.regulatory.marketRiskNote}
          </p>
        </div>
      </article>
    </>
  )
}
