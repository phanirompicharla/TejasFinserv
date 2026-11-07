import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Seo } from '../components/Seo'
import { breadcrumbSchema, financialServiceSchema } from '../schema'
import { sampleNavData } from '../data/navData'

const API_BASE = 'https://app.tejasfinserv.com/nav/api'

interface SchemeItem {
  code: string
  name: string
  amc: string
  category: string
  plan: string
  option: string
  nav: number
  change: number | null
  changePercent: number | null
  date: string
  dateLabel: string
}

type SortField = 'name' | 'category' | 'nav' | 'chg' | 'date'
type SortDir = 'asc' | 'desc'
type ViewMode = 'track' | 'all'

export function NavPage() {
  // Live Data States
  const [schemes, setSchemes] = useState<SchemeItem[]>([])
  const [amcs, setAmcs] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [navDate, setNavDate] = useState<string>('08 Nov 2026')
  const [totalSchemesInDb, setTotalSchemesInDb] = useState<number>(9716)
  const [totalMatching, setTotalMatching] = useState<number>(83)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // View Mode: 'track' (Funds we track, default 83) vs 'all' (Browse all 9,716)
  const [viewMode, setViewMode] = useState<ViewMode>('track')

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [debouncedQuery, setDebouncedQuery] = useState<string>('')
  const [selectedAmc, setSelectedAmc] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedPlan, setSelectedPlan] = useState<string>('Regular')
  const [selectedOption, setSelectedOption] = useState<string>('Growth')

  // Sort & Pagination
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [currentPage, setCurrentPage] = useState<number>(1)

  const isInitialMount = useRef(true)

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim())
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch from official AMFI API
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const loadData = async () => {
      setIsLoading(true)
      try {
        const p = new URLSearchParams()

        if (debouncedQuery) p.set('q', debouncedQuery)
        if (selectedAmc) p.set('amc', selectedAmc)
        if (selectedCategory) p.set('cat', selectedCategory)
        if (selectedPlan) p.set('plan', selectedPlan)
        if (selectedOption) p.set('opt', selectedOption)
        if (viewMode === 'all') p.set('view', 'all')

        if (sortField) p.set('sort', sortField)
        if (sortDir) p.set('dir', sortDir)
        p.set('page', String(currentPage))

        // Request metadata on first load
        if (isInitialMount.current) {
          p.set('meta', '1')
        }

        const res = await fetch(`${API_BASE}?${p.toString()}`, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        if (!isMounted) return

        if (isInitialMount.current) {
          isInitialMount.current = false
          if (Array.isArray(data.amcs)) setAmcs(data.amcs)
          if (Array.isArray(data.categories)) setCategories(data.categories)
          if (data.count) setTotalSchemesInDb(data.count)
        }

        if (data.nav_date) setNavDate(data.nav_date)
        if (typeof data.total === 'number') setTotalMatching(data.total)
        if (typeof data.pages === 'number') setTotalPages(Math.max(1, data.pages))
        setIsSearching(Boolean(data.searching))

        if (Array.isArray(data.schemes)) {
          const mapped: SchemeItem[] = data.schemes.map((s: Record<string, unknown>) => ({
            code: String(s.code || ''),
            name: String(s.name || ''),
            amc: String(s.amc || ''),
            category: String(s.category || 'Mutual Fund'),
            plan: String(s.plan || 'Regular'),
            option: String(s.option || 'Growth'),
            nav: typeof s.nav === 'number' ? s.nav : parseFloat(String(s.nav)) || 0,
            change: typeof s.change === 'number' ? s.change : null,
            changePercent: typeof s.change_pct === 'number' ? s.change_pct : null,
            date: String(s.date || ''),
            dateLabel: String(s.date_label || s.date || navDate),
          }))
          setSchemes(mapped)
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        // Safe offline fallback: populate from preloaded sample data
        if (isMounted && schemes.length === 0) {
          const fallback: SchemeItem[] = sampleNavData.map((s) => ({
            code: s.code,
            name: s.name,
            amc: s.amc,
            category: s.subCategory,
            plan: s.plan,
            option: s.plan,
            nav: s.nav,
            change: (s.nav * s.changePercent) / 100,
            changePercent: s.changePercent,
            date: s.date,
            dateLabel: s.date,
          }))
          setSchemes(fallback)
          setTotalMatching(fallback.length)
          setTotalPages(1)
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadData()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [debouncedQuery, selectedAmc, selectedCategory, selectedPlan, selectedOption, viewMode, sortField, sortDir, currentPage, navDate])

  // Switch to "Funds we track" mode
  const handleSelectTracked = () => {
    setViewMode('track')
    setSearchQuery('')
    setDebouncedQuery('')
    setSelectedAmc('')
    setSelectedCategory('')
    setSelectedPlan('Regular')
    setSelectedOption('Growth')
    setCurrentPage(1)
  }

  // Switch to "Browse all 9,716 NAVs" mode
  const handleSelectBrowseAll = () => {
    setViewMode('all')
    setSearchQuery('')
    setDebouncedQuery('')
    setSelectedAmc('')
    setSelectedCategory('')
    setSelectedPlan('All')
    setSelectedOption('All')
    setCurrentPage(1)
  }

  // Column sort toggle
  const handleSort = (field: SortField) => {
    setCurrentPage(1)
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir(field === 'nav' || field === 'chg' || field === 'date' ? 'desc' : 'asc')
    }
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('')
    setDebouncedQuery('')
    setSelectedAmc('')
    setSelectedCategory('')
    setSelectedPlan('All')
    setSelectedOption('All')
    setCurrentPage(1)
  }

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedAmc !== '' ||
    selectedCategory !== '' ||
    selectedPlan !== 'Regular' ||
    selectedOption !== 'Growth'

  return (
    <>
      <Seo
        title="Mutual Fund NAV Today — All Schemes | TejasFinserv"
        description="Latest daily Net Asset Value (NAV) of 9,700+ mutual fund schemes in India, updated daily from AMFI. Search, filter and compare. TejasFinserv, AMFI ARN-251896."
        path="/nav"
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Mutual Funds', path: '/mutual-funds' },
            { name: 'NAV Today', path: '/nav' },
          ]),
          financialServiceSchema(),
        ]}
      />

      {/* Hero Section */}
      <section className="grain-overlay bg-navy pt-32 sm:pt-36 lg:pt-40 pb-14 text-ivory relative overflow-hidden">
        <div className="container-main relative z-10">
          <Breadcrumbs
            variant="light"
            items={[
              { name: 'Home', path: '/' },
              { name: 'Mutual Funds', path: '/mutual-funds' },
              { name: 'NAV Today' },
            ]}
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-3 py-1 text-xs font-semibold text-brass">
              <span className="h-1.5 w-1.5 rounded-full bg-brass motion-safe:animate-pulse motion-reduce:animate-none" />
              Live AMFI Feed · NAV date {navDate}
            </span>
            <span className="text-xs text-ivory/60">
              AMFI ARN-251896 · Published every business day
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-ivory">
            Mutual Fund NAV Today
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-ivory/80 leading-relaxed font-body">
            The latest Net Asset Value (NAV) of every open-ended mutual fund scheme in India, updated every evening from AMFI.
          </p>

          {/* Quick Metrics Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl border border-ivory/10 bg-ivory/5 p-3.5 backdrop-blur-sm">
              <p className="text-xs text-brass font-semibold">AMCs covered</p>
              <p className="mt-1 font-display text-2xl font-bold text-ivory">
                {amcs.length > 0 ? `${amcs.length} AMCs` : '55 AMCs'}
              </p>
              <p className="text-[11px] text-ivory/60">Across India</p>
            </div>
            <div className="rounded-xl border border-ivory/10 bg-ivory/5 p-3.5 backdrop-blur-sm">
              <p className="text-xs text-brass font-semibold">Schemes tracked</p>
              <p className="mt-1 font-display text-2xl font-bold text-ivory">
                {totalSchemesInDb.toLocaleString('en-IN')}+
              </p>
              <p className="text-[11px] text-ivory/60">Regular &amp; Direct</p>
            </div>
            <div className="rounded-xl border border-ivory/10 bg-ivory/5 p-3.5 backdrop-blur-sm">
              <p className="text-xs text-brass font-semibold">Data source</p>
              <p className="mt-1 font-display text-2xl font-bold text-ivory">AMFI India</p>
              <p className="text-[11px] text-ivory/60">Official daily feed</p>
            </div>
            <div className="rounded-xl border border-ivory/10 bg-ivory/5 p-3.5 backdrop-blur-sm">
              <p className="text-xs text-brass font-semibold">Advisory licence</p>
              <p className="mt-1 font-display text-2xl font-bold text-ivory">ARN-251896</p>
              <p className="text-[11px] text-ivory/60">AMFI registered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Table Explorer Section */}
      <section className="section-padding bg-ivory min-h-screen">
        <div className="container-main">

          {/* Filter Bar */}
          <div className="rounded-2xl border border-line bg-cream p-5 sm:p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
              
              {/* Scheme Name Search */}
              <div className="lg:col-span-4">
                <label htmlFor="nav-scheme-search" className="block text-xs font-semibold text-muted mb-1.5">
                  Scheme name
                </label>
                <div className="relative">
                  <input
                    id="nav-scheme-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      if (e.target.value.trim() && viewMode !== 'all') {
                        setViewMode('all')
                      }
                      setCurrentPage(1)
                    }}
                    placeholder="Type a fund name, e.g. parag parikh, hdfc"
                    className="w-full rounded-xl border border-line bg-ivory py-2 px-3 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-brass focus:bg-white focus:outline-none focus:ring-1 focus:ring-brass"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('')
                        setCurrentPage(1)
                      }}
                      aria-label="Clear search query"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-ink active:scale-95"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Fund House Select */}
              <div className="lg:col-span-2">
                <label htmlFor="amc-select" className="block text-xs font-semibold text-muted mb-1.5">
                  Fund house
                </label>
                <select
                  id="amc-select"
                  value={selectedAmc}
                  onChange={(e) => {
                    setSelectedAmc(e.target.value)
                    if (e.target.value && viewMode !== 'all') {
                      setViewMode('all')
                    }
                    setCurrentPage(1)
                  }}
                  className="w-full rounded-xl border border-line bg-ivory py-2 px-2.5 text-sm text-ink transition-colors focus:border-brass focus:bg-white focus:outline-none focus:ring-1 focus:ring-brass"
                >
                  <option value="">All</option>
                  {amcs.map((amc) => (
                    <option key={amc} value={amc}>
                      {amc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Select */}
              <div className="lg:col-span-2">
                <label htmlFor="cat-select" className="block text-xs font-semibold text-muted mb-1.5">
                  Category
                </label>
                <select
                  id="cat-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    if (e.target.value && viewMode !== 'all') {
                      setViewMode('all')
                    }
                    setCurrentPage(1)
                  }}
                  className="w-full rounded-xl border border-line bg-ivory py-2 px-2.5 text-sm text-ink transition-colors focus:border-brass focus:bg-white focus:outline-none focus:ring-1 focus:ring-brass"
                >
                  <option value="">All</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plan Select (Regular / Direct / All) */}
              <div className="lg:col-span-2">
                <label htmlFor="plan-select" className="block text-xs font-semibold text-muted mb-1.5">
                  Plan
                </label>
                <select
                  id="plan-select"
                  value={selectedPlan}
                  onChange={(e) => {
                    setSelectedPlan(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full rounded-xl border border-line bg-ivory py-2 px-2.5 text-sm text-ink transition-colors focus:border-brass focus:bg-white focus:outline-none focus:ring-1 focus:ring-brass"
                >
                  <option value="Regular">Regular</option>
                  <option value="Direct">Direct</option>
                  <option value="All">All</option>
                </select>
              </div>

              {/* Option Select (Growth / IDCW / All) */}
              <div className="lg:col-span-2">
                <label htmlFor="option-select" className="block text-xs font-semibold text-muted mb-1.5">
                  Option
                </label>
                <select
                  id="option-select"
                  value={selectedOption}
                  onChange={(e) => {
                    setSelectedOption(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full rounded-xl border border-line bg-ivory py-2 px-2.5 text-sm text-ink transition-colors focus:border-brass focus:bg-white focus:outline-none focus:ring-1 focus:ring-brass"
                >
                  <option value="Growth">Growth</option>
                  <option value="IDCW">IDCW</option>
                  <option value="All">All</option>
                </select>
              </div>

            </div>

            {hasActiveFilters && (
              <div className="mt-3.5 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
                <span className="text-muted">
                  Custom filter applied
                </span>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="font-semibold text-brass-dark hover:text-navy underline flex items-center gap-1 active:scale-95"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

          {/* Table Header Controls: Title, View Toggles & Live NAV Date */}
          <div className="mt-6 mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
            
            {/* Title & View Toggle Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-lg sm:text-xl font-bold text-navy">
                {isLoading && schemes.length === 0
                  ? 'Loading NAVs…'
                  : isSearching
                  ? `${totalMatching.toLocaleString('en-IN')} results`
                  : viewMode === 'all'
                  ? `All ${totalMatching.toLocaleString('en-IN')} schemes`
                  : 'Funds we track'}
              </h2>

              {/* Toggle Buttons: "Funds we track" vs "Browse all 9,716 NAVs" */}
              <div className="inline-flex rounded-full border border-line bg-cream p-1 shadow-xs">
                <button
                  type="button"
                  onClick={handleSelectTracked}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all active:scale-95 ${
                    viewMode === 'track' && !isSearching
                      ? 'bg-navy text-ivory shadow-xs'
                      : 'text-muted hover:text-navy'
                  }`}
                >
                  Funds we track
                </button>
                <button
                  type="button"
                  onClick={handleSelectBrowseAll}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all active:scale-95 ${
                    viewMode === 'all' || isSearching
                      ? 'bg-navy text-ivory shadow-xs'
                      : 'text-muted hover:text-navy'
                  }`}
                >
                  Browse all {totalSchemesInDb.toLocaleString('en-IN')} NAVs
                </button>
              </div>
            </div>

            {/* Right Aligned: Official AMFI Date & Loading Badge */}
            <div className="flex items-center gap-2 text-xs text-muted">
              {isLoading && (
                <span className="text-brass font-medium inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-brass animate-pulse" />
                  Updating…
                </span>
              )}
              <span className="rounded-md bg-cream px-2.5 py-1 border border-line font-mono font-medium text-ink">
                NAV date {navDate}
              </span>
            </div>
          </div>

          {/* Empty State */}
          {!isLoading && schemes.length === 0 && (
            <div className="mt-6 rounded-2xl border border-line bg-cream p-12 text-center shadow-xs">
              <h3 className="font-display text-lg font-semibold text-navy">No schemes found</h3>
              <p className="mt-2 text-sm text-muted max-w-md mx-auto">
                No mutual fund schemes matched your search. Try fewer words or set Plan / Option to All.
              </p>
              <button
                type="button"
                onClick={handleSelectBrowseAll}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-ivory hover:bg-navy-deep active:scale-95"
              >
                Browse all schemes
              </button>
            </div>
          )}

          {/* Desktop & Tablet Table */}
          {schemes.length > 0 && (
            <div className={`mt-3 hidden md:block overflow-hidden rounded-2xl border border-line bg-cream shadow-sm transition-opacity duration-200 ${isLoading ? 'opacity-75' : 'opacity-100'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" aria-label="Mutual Fund NAV Table">
                  <thead>
                    <tr className="border-b border-line bg-navy text-xs font-semibold text-ivory">
                      
                      {/* Scheme Header */}
                      <th
                        scope="col"
                        onClick={() => handleSort('name')}
                        className="py-3.5 pl-6 pr-3 cursor-pointer select-none hover:text-brass"
                      >
                        <span className="inline-flex items-center gap-1">
                          Scheme
                          {sortField === 'name' && (
                            <span className="text-brass">{sortDir === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </span>
                      </th>

                      {/* Category Header */}
                      <th
                        scope="col"
                        onClick={() => handleSort('category')}
                        className="py-3.5 px-3 cursor-pointer select-none hover:text-brass"
                      >
                        <span className="inline-flex items-center gap-1">
                          Category
                          {sortField === 'category' && (
                            <span className="text-brass">{sortDir === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </span>
                      </th>

                      {/* NAV Header */}
                      <th
                        scope="col"
                        onClick={() => handleSort('nav')}
                        className="py-3.5 px-3 text-right cursor-pointer select-none hover:text-brass"
                      >
                        <span className="inline-flex items-center gap-1">
                          NAV (₹)
                          {sortField === 'nav' && (
                            <span className="text-brass">{sortDir === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </span>
                      </th>

                      {/* Change Header */}
                      <th
                        scope="col"
                        onClick={() => handleSort('chg')}
                        className="py-3.5 px-3 text-right cursor-pointer select-none hover:text-brass"
                      >
                        <span className="inline-flex items-center gap-1">
                          Change
                          {sortField === 'chg' && (
                            <span className="text-brass">{sortDir === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </span>
                      </th>

                      {/* NAV Date Header */}
                      <th
                        scope="col"
                        onClick={() => handleSort('date')}
                        className="py-3.5 px-3 text-center cursor-pointer select-none hover:text-brass"
                      >
                        <span className="inline-flex items-center gap-1">
                          NAV date
                          {sortField === 'date' && (
                            <span className="text-brass">{sortDir === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </span>
                      </th>

                      {/* Action */}
                      <th scope="col" className="py-3.5 pl-3 pr-6 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/70 bg-white">
                    {schemes.map((scheme, idx) => {
                      const isUp = scheme.change !== null && scheme.change >= 0
                      const isDn = scheme.change !== null && scheme.change < 0
                      return (
                        <tr
                          key={`${scheme.code}-${idx}`}
                          className="group hover:bg-cream/50 transition-colors"
                        >
                          {/* Scheme Name & Subtitle */}
                          <td className="py-3.5 pl-6 pr-3">
                            <div className="font-semibold text-navy group-hover:text-brass-dark transition-colors">
                              {scheme.name}
                            </div>
                            <div className="mt-0.5 text-xs text-muted">
                              <span>{scheme.amc}</span>
                              <span className="mx-1.5">·</span>
                              <span>{scheme.plan}</span>
                              <span className="mx-1.5">·</span>
                              <span>{scheme.option}</span>
                              {scheme.code && (
                                <>
                                  <span className="mx-1.5">·</span>
                                  <span className="font-mono text-[11px]">#{scheme.code}</span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-3 text-xs text-muted">
                            <span className="inline-block rounded-md bg-cream px-2 py-0.5 border border-line font-medium text-ink">
                              {scheme.category}
                            </span>
                          </td>

                          {/* NAV (₹) */}
                          <td className="py-3.5 px-3 text-right">
                            <span className="font-mono text-sm font-bold text-navy">
                              {scheme.nav.toFixed(4)}
                            </span>
                          </td>

                          {/* Change (Points & Percent) */}
                          <td className="py-3.5 px-3 text-right text-xs">
                            {scheme.change === null ? (
                              <span className="text-muted font-mono">—</span>
                            ) : (
                              <div>
                                <span className={`font-mono font-semibold ${isUp ? 'text-emerald-700' : isDn ? 'text-red-700' : 'text-muted'}`}>
                                  {isUp ? '+' : ''}{scheme.change.toFixed(4)}
                                </span>
                                {scheme.changePercent !== null && (
                                  <div className={`font-mono text-[11px] ${isUp ? 'text-emerald-600' : isDn ? 'text-red-600' : 'text-muted'}`}>
                                    {isUp ? '+' : ''}{scheme.changePercent.toFixed(2)}%
                                  </div>
                                )}
                              </div>
                            )}
                          </td>

                          {/* NAV Date */}
                          <td className="py-3.5 px-3 text-center text-xs text-muted font-mono whitespace-nowrap">
                            {scheme.dateLabel}
                          </td>

                          {/* Action */}
                          <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                            <Link
                              to="/calculators/sip"
                              className="inline-flex items-center rounded-full border border-brass/50 bg-brass/10 px-3 py-1 text-xs font-semibold text-brass-dark hover:bg-brass hover:text-navy active:scale-95 transition-all"
                            >
                              SIP Calc
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mobile Card List (< 768px) */}
          {schemes.length > 0 && (
            <div className={`mt-3 grid grid-cols-1 gap-3 md:hidden transition-opacity duration-200 ${isLoading ? 'opacity-75' : 'opacity-100'}`}>
              {schemes.map((scheme, idx) => {
                const isUp = scheme.change !== null && scheme.change >= 0
                const isDn = scheme.change !== null && scheme.change < 0
                return (
                  <div
                    key={`mob-${scheme.code}-${idx}`}
                    className="rounded-2xl border border-line bg-cream p-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-block rounded-md bg-ivory px-2 py-0.5 text-[11px] font-medium text-navy border border-line">
                        {scheme.category}
                      </span>
                      {scheme.changePercent !== null && (
                        <span className={`font-mono text-xs font-semibold ${isUp ? 'text-emerald-700' : isDn ? 'text-red-700' : 'text-muted'}`}>
                          {isUp ? '+' : ''}{scheme.changePercent.toFixed(2)}%
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 font-display text-base font-semibold text-navy leading-snug">
                      {scheme.name}
                    </h3>

                    <p className="mt-1 text-xs text-muted">
                      {scheme.amc} · {scheme.plan} · {scheme.option}
                    </p>

                    <div className="mt-3 pt-3 border-t border-line/60 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-muted font-semibold uppercase tracking-wider">NAV</p>
                        <p className="font-mono text-lg font-bold text-navy">₹{scheme.nav.toFixed(4)}</p>
                        <p className="text-[10px] text-muted font-mono">{scheme.dateLabel}</p>
                      </div>

                      <Link
                        to="/calculators/sip"
                        className="inline-flex items-center rounded-full bg-brass/10 border border-brass/50 px-3.5 py-1.5 text-xs font-semibold text-brass-dark hover:bg-brass hover:text-navy active:scale-95 transition-all"
                      >
                        Calculate SIP
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <p className="text-xs text-muted">
                Page <strong className="text-ink">{currentPage}</strong> of{' '}
                <strong className="text-ink">{totalPages}</strong>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1))
                    window.scrollTo({ top: 400, behavior: 'smooth' })
                  }}
                  className="rounded-lg border border-line bg-cream px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40 disabled:pointer-events-none hover:border-brass active:scale-95 transition-all"
                >
                  ‹ Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p = i + 1
                  if (totalPages > 5 && currentPage > 3) {
                    p = currentPage - 2 + i
                    if (p > totalPages) p = totalPages - (4 - i)
                  }
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setCurrentPage(p)
                        window.scrollTo({ top: 400, behavior: 'smooth' })
                      }}
                      className={`h-8 w-8 rounded-lg text-xs font-semibold active:scale-95 transition-all ${
                        currentPage === p
                          ? 'bg-navy text-ivory'
                          : 'border border-line bg-cream text-muted hover:border-brass hover:text-ink'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                    window.scrollTo({ top: 400, behavior: 'smooth' })
                  }}
                  className="rounded-lg border border-line bg-cream px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40 disabled:pointer-events-none hover:border-brass active:scale-95 transition-all"
                >
                  Next ›
                </button>
              </div>
            </div>
          )}

          {/* Statutory AMFI Disclosure */}
          <div className="mt-12 rounded-2xl border border-brass/30 bg-cream p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brass/20 text-brass-dark">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-display text-base font-semibold text-navy">
                  AMFI regulatory disclosure and information
                </h4>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  NAV source: AMFI, published once every business day. Information only — not a recommendation. Mutual fund investments are subject to market risks, read all scheme related documents carefully. Tejas Finserv is an AMFI-registered Mutual Fund Distributor bearing ARN-251896.
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
                  <a
                    href="https://www.amfiindia.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brass-dark hover:text-navy underline whitespace-nowrap"
                  >
                    AMFI official portal
                  </a>
                  <Link to="/contact" className="text-brass-dark hover:text-navy underline">
                    Talk to advisor Phani Rompicharla
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
