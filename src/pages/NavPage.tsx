import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Seo } from '../components/Seo'
import { breadcrumbSchema, financialServiceSchema } from '../schema'
import { sampleNavData, type SchemeNav } from '../data/navData'

type CategoryFilter = 'All' | 'Equity' | 'Debt' | 'Hybrid' | 'ELSS' | 'Index / ETF' | 'Liquid'
type SortField = 'name' | 'nav' | 'changePercent' | 'date'
type SortOrder = 'asc' | 'desc'

function mapApiCategory(cat: string): 'Equity' | 'Debt' | 'Hybrid' | 'ELSS' | 'Index / ETF' | 'Liquid' {
  const c = (cat || '').toLowerCase()
  if (c.includes('elss')) return 'ELSS'
  if (c.includes('index') || c.includes('etf')) return 'Index / ETF'
  if (c.includes('liquid') || c.includes('overnight') || c.includes('money market')) return 'Liquid'
  if (c.includes('debt') || c.includes('bond') || c.includes('gilt') || c.includes('duration') || c.includes('credit')) return 'Debt'
  if (c.includes('hybrid') || c.includes('balanced') || c.includes('arbitrage') || c.includes('multi asset')) return 'Hybrid'
  return 'Equity'
}

export function NavPage() {
  const [schemes, setSchemes] = useState<SchemeNav[]>(sampleNavData)
  const [_isLoadingLive, setIsLoadingLive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All')
  const [selectedAmc, setSelectedAmc] = useState<string>('All')
  const [selectedPlan, setSelectedPlan] = useState<'All' | 'Growth' | 'IDCW'>('All')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  // Fetch live AMFI scheme feeds directly into single React UI (replaces obsolete external widget)
  useEffect(() => {
    let isMounted = true
    const fetchLiveNav = async () => {
      try {
        setIsLoadingLive(true)
        const res = await fetch('https://app.tejasfinserv.com/nav/api?meta=1')
        if (!res.ok) return
        const data = await res.json()
        if (data && Array.isArray(data.schemes) && data.schemes.length > 0) {
          const liveSchemes: SchemeNav[] = data.schemes.map((s: Record<string, unknown>) => ({
            code: String(s.code || ''),
            name: String(s.name || ''),
            amc: String(s.amc || 'Mutual Fund'),
            category: mapApiCategory(String(s.category || '')),
            subCategory: String(s.category || 'Mutual Fund'),
            plan: s.option === 'IDCW' ? 'IDCW' : 'Growth',
            nav: typeof s.nav === 'number' ? s.nav : parseFloat(String(s.nav)) || 0,
            changePercent: typeof s.change_pct === 'number' ? s.change_pct : (s.change ? parseFloat(String(s.change)) : 0),
            date: String(s.date_label || s.date || 'Today'),
            riskLevel: 'Moderate',
          }))
          if (isMounted) {
            setSchemes(liveSchemes)
          }
        }
      } catch {
        // Safe fallback to preloaded sampleNavData
      } finally {
        if (isMounted) setIsLoadingLive(false)
      }
    }
    fetchLiveNav()
    return () => {
      isMounted = false
    }
  }, [])

  // Extract unique AMCs
  const amcList = useMemo(() => {
    const set = new Set<string>()
    schemes.forEach((s) => set.add(s.amc))
    return ['All', ...Array.from(set).sort()]
  }, [schemes])

  // Filter and sort schemes
  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.code.includes(searchQuery.trim()) ||
        scheme.amc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.subCategory.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'All' || scheme.category === selectedCategory

      const matchesAmc =
        selectedAmc === 'All' || scheme.amc === selectedAmc

      const matchesPlan =
        selectedPlan === 'All' || scheme.plan === selectedPlan

      return matchesSearch && matchesCategory && matchesAmc && matchesPlan
    }).sort((a, b) => {
      let comparison = 0
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortField === 'nav') {
        comparison = a.nav - b.nav
      } else if (sortField === 'changePercent') {
        comparison = a.changePercent - b.changePercent
      } else if (sortField === 'date') {
        comparison = a.date.localeCompare(b.date)
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [schemes, searchQuery, selectedCategory, selectedAmc, selectedPlan, sortField, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredSchemes.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedSchemes = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize
    return filteredSchemes.slice(start, start + pageSize)
  }, [filteredSchemes, safeCurrentPage, pageSize])

  const handleSort = (field: SortField) => {
    setCurrentPage(1)
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedAmc('All')
    setSelectedPlan('All')
    setSortField('name')
    setSortOrder('asc')
    setCurrentPage(1)
  }

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedAmc !== 'All' ||
    selectedPlan !== 'All'

  return (
    <>
      <Seo
        title="Mutual Fund NAV Today — All Schemes | TejasFinserv"
        description="Latest daily Net Asset Value (NAV) of mutual fund schemes in India, updated from AMFI. Search by fund name, category, or fund house. TejasFinserv, AMFI ARN-251896."
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
              Daily AMFI verified feed
            </span>
            <span className="text-xs text-ivory/60">
              AMFI ARN-251896 · Updated daily
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-ivory">
            Mutual Fund NAV Today
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-ivory/80 leading-relaxed font-body">
            Track daily Net Asset Value across Indian mutual fund schemes.
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl border border-ivory/10 bg-ivory/5 p-3.5 backdrop-blur-sm">
              <p className="text-xs text-brass font-semibold">AMCs covered</p>
              <p className="mt-1 font-display text-2xl font-bold text-ivory">40+ AMCs</p>
              <p className="text-[11px] text-ivory/60">Across India</p>
            </div>
            <div className="rounded-xl border border-ivory/10 bg-ivory/5 p-3.5 backdrop-blur-sm">
              <p className="text-xs text-brass font-semibold">Schemes tracked</p>
              <p className="mt-1 font-display text-2xl font-bold text-ivory">6,000+</p>
              <p className="text-[11px] text-ivory/60">Direct and regular</p>
            </div>
            <div className="rounded-xl border border-ivory/10 bg-ivory/5 p-3.5 backdrop-blur-sm">
              <p className="text-xs text-brass font-semibold">Data source</p>
              <p className="mt-1 font-display text-2xl font-bold text-ivory">AMFI India</p>
              <p className="text-[11px] text-ivory/60">End-of-day NAV</p>
            </div>
            <div className="rounded-xl border border-ivory/10 bg-ivory/5 p-3.5 backdrop-blur-sm">
              <p className="text-xs text-brass font-semibold">Advisory licence</p>
              <p className="mt-1 font-display text-2xl font-bold text-ivory">ARN-251896</p>
              <p className="text-[11px] text-ivory/60">AMFI registered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main NAV Explorer Section */}
      <section className="section-padding bg-ivory min-h-screen">
        <div className="container-main">
          {/* Controls Bar: Search + Category Pills */}
          <div className="rounded-2xl border border-line bg-cream p-5 sm:p-6 shadow-sm">
            {/* Search Input & AMC/Plan Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
              {/* Search Field */}
              <div className="sm:col-span-6 relative">
                <label htmlFor="nav-search" className="sr-only">
                  Search mutual fund scheme or code
                </label>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="nav-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search scheme name, code (e.g. 122639) or AMC"
                  className="w-full rounded-xl border border-line bg-ivory/80 py-2.5 pl-10 pr-9 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-brass focus:bg-white focus:outline-none focus:ring-1 focus:ring-brass"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setCurrentPage(1)
                    }}
                    aria-label="Clear search query"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-ink active:scale-95 transition-transform"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Fund House (AMC) Select */}
              <div className="sm:col-span-3">
                <label htmlFor="amc-select" className="sr-only">
                  Filter by Fund House
                </label>
                <select
                  id="amc-select"
                  value={selectedAmc}
                  onChange={(e) => {
                    setSelectedAmc(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full rounded-xl border border-line bg-ivory/80 py-2.5 px-3 text-sm text-ink transition-colors focus:border-brass focus:bg-white focus:outline-none focus:ring-1 focus:ring-brass"
                >
                  <option value="All">All fund houses</option>
                  {amcList.filter((a) => a !== 'All').map((amc) => (
                    <option key={amc} value={amc}>
                      {amc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plan Option Select */}
              <div className="sm:col-span-3">
                <label htmlFor="plan-select" className="sr-only">
                  Filter by Plan
                </label>
                <select
                  id="plan-select"
                  value={selectedPlan}
                  onChange={(e) => {
                    setSelectedPlan(e.target.value as 'All' | 'Growth' | 'IDCW')
                    setCurrentPage(1)
                  }}
                  className="w-full rounded-xl border border-line bg-ivory/80 py-2.5 px-3 text-sm text-ink transition-colors focus:border-brass focus:bg-white focus:outline-none focus:ring-1 focus:ring-brass"
                >
                  <option value="All">All plans (growth &amp; IDCW)</option>
                  <option value="Growth">Growth option</option>
                  <option value="IDCW">IDCW option</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-4 pt-4 border-t border-line/60 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Scheme Categories">
                {(['All', 'Equity', 'Hybrid', 'Debt', 'ELSS', 'Index / ETF', 'Liquid'] as CategoryFilter[]).map((cat) => {
                  const isActive = selectedCategory === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        setSelectedCategory(cat)
                        setCurrentPage(1)
                      }}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold active:scale-95 transition-colors transition-transform ${
                        isActive
                          ? 'bg-navy text-ivory shadow-sm'
                          : 'bg-ivory border border-line text-muted hover:border-brass/50 hover:text-ink'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-brass-dark hover:text-navy underline flex items-center gap-1 py-1 active:scale-95 transition-transform"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reset filters
                </button>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                <span>Active filters:</span>
                {searchQuery && (
                  <span className="rounded-md bg-ivory px-2 py-0.5 border border-line font-medium text-ink">
                    Keyword: &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="rounded-md bg-ivory px-2 py-0.5 border border-line font-medium text-ink">
                    Category: {selectedCategory}
                  </span>
                )}
                {selectedAmc !== 'All' && (
                  <span className="rounded-md bg-ivory px-2 py-0.5 border border-line font-medium text-ink">
                    AMC: {selectedAmc}
                  </span>
                )}
                {selectedPlan !== 'All' && (
                  <span className="rounded-md bg-ivory px-2 py-0.5 border border-line font-medium text-ink">
                    Plan: {selectedPlan}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Summary Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-muted px-1">
            <p>
              Showing <strong className="text-ink">{filteredSchemes.length}</strong> schemes
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {selectedAmc !== 'All' && ` from ${selectedAmc}`}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted">Sort:</span>
              <button
                type="button"
                onClick={() => handleSort('nav')}
                className={`font-medium active:scale-95 transition-transform ${sortField === 'nav' ? 'text-navy underline font-bold' : 'text-muted hover:text-ink'}`}
              >
                NAV {sortField === 'nav' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </button>
              <button
                type="button"
                onClick={() => handleSort('changePercent')}
                className={`font-medium active:scale-95 transition-transform ${sortField === 'changePercent' ? 'text-navy underline font-bold' : 'text-muted hover:text-ink'}`}
              >
                1D change {sortField === 'changePercent' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </button>
              <button
                type="button"
                onClick={() => handleSort('name')}
                className={`font-medium active:scale-95 transition-transform ${sortField === 'name' ? 'text-navy underline font-bold' : 'text-muted hover:text-ink'}`}
              >
                Name {sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </button>
            </div>
          </div>

          {/* Empty State */}
          {filteredSchemes.length === 0 && (
            <div className="mt-8 rounded-2xl border border-line bg-cream p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy/5 text-navy">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-navy">No schemes found</h3>
              <p className="mt-2 text-sm text-muted max-w-md mx-auto">
                No mutual fund schemes matched your search criteria. Try modifying your search keywords or clearing some filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-xs font-semibold text-ivory hover:bg-navy-deep active:scale-95 transition-colors transition-transform"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* Desktop & Tablet Table View */}
          {filteredSchemes.length > 0 && (
            <div className="mt-4 hidden md:block overflow-hidden rounded-2xl border border-line bg-cream shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" aria-label="Mutual Fund NAV Table">
                  <thead>
                    <tr className="border-b border-line bg-ivory/60 text-xs font-semibold text-muted">
                      <th scope="col" className="py-4 pl-6 pr-3">
                        <button
                          type="button"
                          onClick={() => handleSort('name')}
                          className="flex items-center gap-1.5 hover:text-navy active:scale-95 transition-transform"
                        >
                          Scheme name and code
                          {sortField === 'name' && (
                            <span className="text-brass">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </button>
                      </th>
                      <th scope="col" className="py-4 px-3">
                        Category and plan
                      </th>
                      <th scope="col" className="py-4 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleSort('nav')}
                          className="inline-flex items-center gap-1.5 hover:text-navy active:scale-95 transition-transform"
                        >
                          NAV (₹)
                          {sortField === 'nav' && (
                            <span className="text-brass">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </button>
                      </th>
                      <th scope="col" className="py-4 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleSort('changePercent')}
                          className="inline-flex items-center gap-1.5 hover:text-navy active:scale-95 transition-transform"
                        >
                          1D change
                          {sortField === 'changePercent' && (
                            <span className="text-brass">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </button>
                      </th>
                      <th scope="col" className="py-4 px-3 text-center">
                        Date
                      </th>
                      <th scope="col" className="py-4 pl-3 pr-6 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/70">
                    {paginatedSchemes.map((scheme) => {
                      const isPositive = scheme.changePercent >= 0
                      return (
                        <tr
                          key={scheme.code}
                          className="group transition-colors hover:bg-ivory/80"
                        >
                          {/* Scheme Name & AMC */}
                          <td className="py-4 pl-6 pr-3">
                            <div className="font-semibold text-navy group-hover:text-brass-dark transition-colors">
                              {scheme.name}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                              <span>{scheme.amc}</span>
                              <span>·</span>
                              <span className="text-[11px] text-muted/80">Code: <span className="font-mono">{scheme.code}</span></span>
                            </div>
                          </td>

                          {/* Category & Plan */}
                          <td className="py-4 px-3">
                            <div className="flex flex-col gap-1 items-start">
                              <span className="inline-flex items-center rounded-md bg-navy/5 px-2 py-0.5 text-xs font-medium text-navy border border-navy/10">
                                {scheme.subCategory}
                              </span>
                              <span className="text-[11px] text-muted font-medium">
                                Plan: {scheme.plan}
                              </span>
                            </div>
                          </td>

                          {/* NAV */}
                          <td className="py-4 px-3 text-right">
                            <span className="font-mono text-base font-bold text-navy">
                              ₹{scheme.nav.toFixed(2)}
                            </span>
                          </td>

                          {/* 1D Change */}
                          <td className="py-4 px-3 text-right">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                isPositive
                                  ? 'bg-brass/10 text-brass-dark border border-brass/30'
                                  : 'bg-navy/5 text-navy border border-navy/20'
                              }`}
                            >
                              <span className="font-mono">{isPositive ? '+' : ''}{scheme.changePercent.toFixed(2)}%</span>
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-4 px-3 text-center text-xs text-muted">
                            <span className="font-mono">{scheme.date}</span>
                          </td>

                          {/* Action */}
                          <td className="py-4 pl-3 pr-6 text-right">
                            <Link
                              to="/calculators/sip"
                              className="inline-flex items-center rounded-full border border-brass/50 bg-brass/10 px-3 py-1 text-xs font-semibold text-brass-dark hover:bg-brass hover:text-navy active:scale-95 transition-colors transition-transform"
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

          {/* Mobile Card List View (< 768px) */}
          {filteredSchemes.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-3.5 md:hidden">
              {paginatedSchemes.map((scheme) => {
                const isPositive = scheme.changePercent >= 0
                return (
                  <div
                    key={scheme.code}
                    className="rounded-2xl border border-line bg-cream p-4 shadow-sm hover:border-brass/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex items-center rounded-md bg-navy/5 px-2 py-0.5 text-[11px] font-medium text-navy border border-navy/10">
                        {scheme.subCategory}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isPositive
                            ? 'bg-brass/10 text-brass-dark border border-brass/30'
                            : 'bg-navy/5 text-navy border border-navy/20'
                        }`}
                      >
                        <span className="font-mono">{isPositive ? '+' : ''}{scheme.changePercent.toFixed(2)}%</span>
                      </span>
                    </div>

                    <h3 className="mt-2.5 font-display text-base font-semibold text-navy leading-snug">
                      {scheme.name}
                    </h3>

                    <p className="mt-1 text-xs text-muted">
                      {scheme.amc} · #{scheme.code}
                    </p>

                    <div className="mt-3.5 pt-3 border-t border-line/60 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-muted font-semibold">Latest NAV</p>
                        <p className="font-mono text-lg font-bold text-navy">₹{scheme.nav.toFixed(2)}</p>
                        <p className="text-[10px] text-muted font-mono">{scheme.date}</p>
                      </div>

                      <Link
                        to="/calculators/sip"
                        className="inline-flex items-center rounded-full bg-brass/10 border border-brass/50 px-3.5 py-1.5 text-xs font-semibold text-brass-dark hover:bg-brass hover:text-navy active:scale-95 transition-colors transition-transform"
                      >
                        Calculate SIP
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <p className="text-xs text-muted">
                Page <strong className="text-ink">{safeCurrentPage}</strong> of{' '}
                <strong className="text-ink">{totalPages}</strong>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-line bg-cream px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40 disabled:pointer-events-none hover:border-brass active:scale-95 transition-colors transition-transform"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-lg text-xs font-semibold active:scale-95 transition-colors transition-transform ${
                      safeCurrentPage === page
                        ? 'bg-navy text-ivory'
                        : 'border border-line bg-cream text-muted hover:border-brass hover:text-ink'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg border border-line bg-cream px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40 disabled:pointer-events-none hover:border-brass active:scale-95 transition-colors transition-transform"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Regulatory Compliance Callout */}
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
                  Net Asset Value (NAV) figures displayed are sourced from official AMFI daily data feeds and published for investor educational and reference purposes. Net Asset Values fluctuate in accordance with underlying portfolio movements. Mutual Fund investments are subject to market risks; please read all scheme-related documents carefully before investing. TejasFinserv is an AMFI-registered Mutual Fund Distributor bearing ARN-251896.
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
