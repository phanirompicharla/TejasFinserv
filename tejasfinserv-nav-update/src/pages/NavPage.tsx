import { useEffect } from 'react'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Seo } from '../components/Seo'
import { breadcrumbSchema } from '../schema'

const WIDGET_SRC = 'https://app.tejasfinserv.com/nav/widget.js'

export function NavPage() {
  useEffect(() => {
    // The widget draws the NAV table into #tejas-nav. Load it fresh each time this page opens.
    const s = document.createElement('script')
    s.src = `${WIDGET_SRC}?v=${new Date().toISOString().slice(0, 10)}`
    s.defer = true
    document.body.appendChild(s)
    return () => {
      s.remove()
    }
  }, [])

  return (
    <>
      <Seo
        title="Mutual Fund NAV Today — All Schemes | TejasFinserv"
        description="Latest NAV of every mutual fund scheme in India, updated daily from AMFI. Search by fund name or fund house, sort and compare. TejasFinserv, ARN-251896."
        path="/nav"
        jsonLd={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'NAV Today', path: '/nav' }])]}
      />
      <section className="grain-overlay bg-navy pt-36 sm:pt-40 pb-16 text-ivory">
        <div className="container-main">
          <Breadcrumbs variant="light" items={[{ name: 'Home', path: '/' }, { name: 'NAV Today' }]} />
          <h1 className="font-display font-semibold">Mutual Fund NAV Today</h1>
          <p className="mt-4 max-w-2xl text-ivory/80">
            The latest NAV of every open-ended mutual fund scheme in India, updated every evening from AMFI. Search by
            name or fund house, filter by category and sort any column.
          </p>
        </div>
      </section>
      <section className="section-padding bg-ivory">
        <div className="container-main">
          <div id="tejas-nav" className="min-h-[420px]" />
          <noscript>
            Please enable JavaScript, or open the NAV list at{' '}
            <a href="https://app.tejasfinserv.com/nav/">app.tejasfinserv.com/nav</a>.
          </noscript>
        </div>
      </section>
    </>
  )
}
