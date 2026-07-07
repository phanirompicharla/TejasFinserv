import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { SectionReveal } from '../components/SectionReveal'
import { Seo } from '../components/Seo'
import { insights, type InsightPost } from '../content/insights'
import { siteConfig } from '../lib/siteConfig'
import { breadcrumbSchema, websiteSchema } from '../schema'

export function Insights() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('All')
  const [dbInsights, setDbInsights] = useState<InsightPost[]>([])

  useEffect(() => {
    const fetchDbInsights = async () => {
      try {
        const res = await fetch('/api/insights')
        if (res.ok) {
          const data = await res.json()
          const mapped: InsightPost[] = data.map((item: any) => ({
            slug: item.slug,
            title: item.title,
            description: item.description || '',
            datePublished: item.published_at ? item.published_at.substring(0, 10) : new Date().toISOString().substring(0, 10),
            author: item.author || 'Phani Rompicharla',
            readTime: item.read_time || '5 min read',
            tags: item.tags ? item.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
            content: item.content ? item.content.split('\n\n') : []
          }))
          setDbInsights(mapped)
        }
      } catch (err) {
        console.error('Failed to load DB insights:', err)
      }
    }
    fetchDbInsights()
  }, [])

  // Combine DB insights and static insights (DB overrides static if slug matches)
  const combinedInsights = useMemo(() => {
    const staticFiltered = insights.filter(
      (staticItem) => !dbInsights.some((dbItem) => dbItem.slug === staticItem.slug)
    )
    return [...dbInsights, ...staticFiltered]
  }, [dbInsights])

  // Extract unique tags from all articles
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    combinedInsights.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)))
    return ['All', ...Array.from(tagSet)]
  }, [combinedInsights])

  // Filter articles based on search query and selected tag
  const filteredInsights = useMemo(() => {
    return combinedInsights.filter((post) => {
      const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag)
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesTag && matchesSearch
    })
  }, [combinedInsights, searchQuery, selectedTag])

  return (
    <>
      <Seo
        title={siteConfig.seo.insights.title}
        description={siteConfig.seo.insights.description}
        path="/insights"
        jsonLd={[
          websiteSchema(),
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Insights', path: '/insights' }]),
        ]}
      />
      
      <section className="grain-overlay bg-navy pt-36 pb-20 text-ivory relative overflow-hidden">
        <div className="container-main relative z-10">
          <Breadcrumbs variant="light" items={[{ name: 'Home', path: '/' }, { name: 'Insights' }]} />
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold">
            Investment Insights & Knowledge Hub
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ivory/80">
            Expert guides on SIP strategies, tax optimization, retirement planning, and mutual fund selection — authored by Phani Rompicharla, ARN-251896.
          </p>

          {/* Search and Filter Bar (Addressing UX Report Page 8) */}
          <div className="mt-8 max-w-xl relative">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted text-lg">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search articles by title, topic, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-ivory/10 border border-ivory/20 pl-12 pr-10 py-3.5 text-sm text-ivory placeholder-ivory/50 focus:bg-ivory/25 focus:outline-none focus:ring-2 focus:ring-brass transition-all backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-ivory/70 hover:text-brass text-sm font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tag Filtering Bar */}
      <section className="bg-ivory border-b border-line sticky top-20 z-30 shadow-sm backdrop-blur-md">
        <div className="container-main py-4 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted mr-2 shrink-0">
            Filter Topics:
          </span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                selectedTag === tag
                  ? 'bg-navy text-ivory shadow-md scale-105'
                  : 'bg-cream border border-line text-ink hover:border-brass hover:text-navy'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="section-padding bg-cream min-h-[50vh]">
        <div className="container-main">
          {filteredInsights.length === 0 ? (
            <div className="bg-ivory rounded-3xl border border-line p-12 text-center max-w-lg mx-auto shadow-sm">
              <span className="text-4xl block mb-3">🧐</span>
              <h3 className="font-display text-xl font-semibold text-navy">
                No matching articles found
              </h3>
              <p className="text-sm text-muted mt-2">
                We could not find any guides matching "{searchQuery}" under "{selectedTag}". Try selecting a different topic or clearing your search.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedTag('All')
                }}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-navy px-6 py-2.5 text-xs font-semibold text-ivory hover:bg-navy-deep transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredInsights.map((post, i) => (
                <SectionReveal key={post.slug} delay={i * 60}>
                  <article className="flex h-full flex-col rounded-3xl border border-line bg-ivory p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-brass/40 hover:shadow-2xl justify-between group">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <time dateTime={post.datePublished} className="text-xs font-mono font-medium text-brass">
                          {new Date(post.datePublished).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </time>
                        <span className="text-xs font-semibold bg-cream px-2.5 py-1 rounded-md border border-line text-muted">
                          ⏱️ {post.readTime}
                        </span>
                      </div>

                      <h2 className="font-display text-xl font-semibold text-navy group-hover:text-brass transition-colors leading-snug">
                        <Link to={`/insights/${post.slug}`} className="block">
                          {post.title}
                        </Link>
                      </h2>

                      <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-3">
                        {post.description}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.preventDefault()
                              setSelectedTag(tag)
                            }}
                            className="text-[11px] font-medium bg-cream hover:bg-brass/15 text-ink px-2.5 py-1 rounded-full border border-line/60 transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-line flex items-center justify-between text-xs text-muted">
                      <span>By {post.author}</span>
                      <Link
                        to={`/insights/${post.slug}`}
                        className="font-semibold text-navy hover:text-brass transition-colors inline-flex items-center gap-1 group-hover:translate-x-1 duration-200"
                      >
                        Read Article →
                      </Link>
                    </div>
                  </article>
                </SectionReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
