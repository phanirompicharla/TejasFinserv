import { Helmet } from 'react-helmet-async'
import { siteConfig } from '../lib/siteConfig'

interface SeoProps {
  title: string
  description: string
  path?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  noindex?: boolean
}

export function Seo({ title, description, path = '/', jsonLd, noindex }: SeoProps) {
  const url = `${siteConfig.baseUrl}${path === '/' ? '' : path}`
  const schemas = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : []

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}

      {siteConfig.analytics.gscVerification && (
        <meta name="google-site-verification" content={siteConfig.analytics.gscVerification} />
      )}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:image" content={`${siteConfig.baseUrl}/favicon.svg`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
