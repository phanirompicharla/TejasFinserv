import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { siteConfig } from '../lib/siteConfig'
import { Button } from './Button'
import { Logo } from './Logo'

function isNavActive(pathname: string, path: string) {
  if (path === '/') return pathname === '/'
  return pathname === path || pathname.startsWith(`${path}/`)
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-line bg-ivory/95 backdrop-blur-md transition-all duration-300 ${
        scrolled ? 'shadow-sm' : 'shadow-none'
      }`}
    >
      <div className="container-main flex h-20 items-center justify-between py-4">
        <Link to="/" className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass" aria-label="TejasFinserv home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex" aria-label="Main navigation">
          {siteConfig.nav.map((item) => {
            if ('children' in item && item.children) {
              return (
                <div 
                  key={item.label} 
                  className="relative group py-2"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="flex items-center gap-1">
                    <Link
                      to={item.path}
                      onClick={() => setDropdownOpen(false)}
                      className={`link-underline text-sm font-medium transition-colors ${
                        dropdownOpen || item.children.some(child => isNavActive(location.pathname, child.path)) ? 'text-brass' : 'text-ink hover:text-brass'
                      }`}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      aria-expanded={dropdownOpen}
                      aria-label="Toggle services dropdown"
                      className={`p-1 rounded transition-transform duration-200 ${
                        dropdownOpen ? 'rotate-180 text-brass' : 'text-ink hover:text-brass'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 pt-1 w-56 z-50 animate-fade-in">
                      <div className="rounded-xl shadow-card bg-ivory border border-line py-2 overflow-hidden backdrop-blur-md">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setDropdownOpen(false)}
                            className={`block px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-cream hover:text-brass hover:pl-5 ${
                              isNavActive(location.pathname, child.path) ? 'text-brass bg-cream font-semibold' : 'text-ink'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`link-underline text-sm font-medium transition-colors ${
                  isNavActive(location.pathname, item.path) ? 'text-brass' : 'text-ink hover:text-brass'
                }`}
                aria-current={isNavActive(location.pathname, item.path) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
            className="flex items-center gap-2 bg-cream text-muted hover:text-navy px-3 py-1.5 rounded-xl border border-line text-xs font-medium transition-all shadow-sm hover:border-brass/50 cursor-pointer"
            title="Search site (Ctrl+K or Cmd+K)"
          >
            <span>🔍 Search</span>
            <kbd className="bg-line/40 text-navy px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold">⌘K</kbd>
          </button>
          <Button href={siteConfig.onboardingUrl} external>Invest Now</Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-navy cursor-pointer"
            aria-label="Open search palette"
          >
            <span className="text-lg">🔍</span>
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-navy cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-navy grain-overlay transition-opacity duration-300 lg:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-ivory/10 bg-ivory px-5 py-4">
          <Logo />
          <button type="button" className="flex h-10 w-10 items-center justify-center text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-1 flex-col items-center justify-center gap-6 py-8" aria-label="Mobile navigation">
          {siteConfig.nav.map((item, i) => {
            if ('children' in item && item.children) {
              return (
                <div key={item.label} className="flex flex-col items-center gap-3 w-full" style={{ animation: menuOpen ? `fade-up 0.5s ease ${i * 80}ms forwards` : undefined, opacity: menuOpen ? undefined : 0 }}>
                  <Link
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-2xl font-semibold text-ivory transition-colors hover:text-brass-soft"
                  >
                    {item.label}
                  </Link>
                  <div className="flex flex-col items-center gap-2.5 bg-ivory/5 rounded-2xl py-3 px-6 w-full max-w-xs border border-ivory/10">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={() => setMenuOpen(false)}
                        className="font-display text-lg text-ivory/80 transition-colors hover:text-brass-soft"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                className="font-display text-2xl text-ivory transition-colors hover:text-brass-soft"
                style={{ animation: menuOpen ? `fade-up 0.5s ease ${i * 80}ms forwards` : undefined, opacity: menuOpen ? undefined : 0 }}
              >
                {item.label}
              </Link>
            )
          })}
          <div className="mt-4">
            <Button href={siteConfig.onboardingUrl} external>Invest Now</Button>
          </div>
        </nav>
      </div>
    </>
  )
}
