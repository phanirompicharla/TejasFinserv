import { siteConfig } from '../lib/siteConfig'

export function organizationSchema() {
  const verifiedSameAs = [
    siteConfig.social.linkedin,
    siteConfig.advisor.linkedinUrl,
    siteConfig.advisor.profileUrl,
  ].filter(Boolean) as string[]

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    legalName: `${siteConfig.name} (${siteConfig.regulatory.arn})`,
    url: siteConfig.baseUrl,
    logo: `${siteConfig.baseUrl}/logo.webp`,
    description: `${siteConfig.name} — ${siteConfig.tagline}. AMFI-registered Mutual Fund Distributor (${siteConfig.regulatory.arn}) based in Vijayawada, Andhra Pradesh.`,
    telephone: siteConfig.contact.phoneTel,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '23-221, Near Old Water Tank, Yanamalakuduru',
      addressLocality: 'Vijayawada',
      postalCode: '520007',
      addressRegion: 'Andhra Pradesh',
      addressCountry: 'IN',
    },
    founder: {
      '@type': 'Person',
      name: siteConfig.advisor.name,
      jobTitle: siteConfig.advisor.title,
      sameAs: [siteConfig.advisor.linkedinUrl, siteConfig.advisor.profileUrl].filter(Boolean),
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phoneTel,
      contactType: 'customer service',
      email: siteConfig.contact.email,
      areaServed: 'IN',
      availableLanguage: ['English', 'Telugu', 'Hindi'],
    },
    sameAs: verifiedSameAs,
  }
}

export function financialServiceSchema() {
  const verifiedSameAs = [
    siteConfig.social.linkedin,
    siteConfig.advisor.linkedinUrl,
    siteConfig.advisor.profileUrl,
  ].filter(Boolean) as string[]

  return {
    '@context': 'https://schema.org',
    '@type': ['FinancialService', 'LocalBusiness'],
    name: siteConfig.name,
    description: `AMFI-registered mutual fund distributor and insurance advisor in Vijayawada, Andhra Pradesh. ${siteConfig.regulatory.arn}.`,
    url: siteConfig.baseUrl,
    telephone: siteConfig.contact.phoneTel,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '23-221, Near Old Water Tank, Yanamalakuduru',
      addressLocality: 'Vijayawada',
      postalCode: '520007',
      addressRegion: 'Andhra Pradesh',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 16.5193, longitude: 80.6305 },
    areaServed: [{ '@type': 'City', name: 'Vijayawada' }, { '@type': 'State', name: 'Andhra Pradesh' }],
    priceRange: '$$',
    sameAs: verifiedSameAs,
  }
}

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.advisor.name,
    jobTitle: siteConfig.advisor.title,
    worksFor: { '@type': 'Organization', name: siteConfig.name },
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneTel,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Vijayawada',
      addressRegion: 'Andhra Pradesh',
      addressCountry: 'IN',
    },
    sameAs: [siteConfig.advisor.linkedinUrl, siteConfig.advisor.profileUrl].filter(Boolean),
    description: `AMFI-registered Mutual Fund Distributor (${siteConfig.regulatory.arn}) serving investors in Vijayawada and Andhra Pradesh.`,
  }
}

export function aboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${siteConfig.name} — AMFI Registered Advisor in Vijayawada`,
    url: `${siteConfig.baseUrl}/about`,
    mainEntity: organizationSchema(),
  }
}

export function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${siteConfig.name} — Vijayawada`,
    url: `${siteConfig.baseUrl}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: siteConfig.name,
      telephone: siteConfig.contact.phoneTel,
      email: siteConfig.contact.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '23-221, Near Old Water Tank, Yanamalakuduru',
        addressLocality: 'Vijayawada',
        postalCode: '520007',
        addressRegion: 'Andhra Pradesh',
        addressCountry: 'IN',
      },
    },
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.baseUrl}/calculators?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function howToSchema(name: string, description: string, steps: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: text,
      text,
    })),
  }
}

export function breadcrumbSchema(items: { name: string; path?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.path ? `${siteConfig.baseUrl}${item.path}` : `${siteConfig.baseUrl}/`,
    })),
  }
}

export function speakableSchema(url: string, cssSelectors: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: `${siteConfig.baseUrl}${url}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
  }
}

export function articleSchema(title: string, description: string, slug: string, datePublished: string, author: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished,
    dateModified: datePublished,
    author: { '@type': 'Person', name: author },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: { '@type': 'ImageObject', url: `${siteConfig.baseUrl}/logo.webp` },
    },
    mainEntityOfPage: `${siteConfig.baseUrl}/insights/${slug}`,
  }
}
