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
                  className="relative group"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 link-underline text-sm font-medium transition-colors ${
                      dropdownOpen || item.children.some(child => isNavActive(location.pathname, child.path)) ? 'text-brass' : 'text-ink hover:text-brass'
                    }`}
                  >
                    {item.label}
                    <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-card bg-ivory border border-line py-2 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block px-4 py-2 text-sm font-medium transition-colors hover:bg-cream hover:text-brass ${
                            isNavActive(location.pathname, child.path) ? 'text-brass bg-cream' : 'text-ink'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
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
          <Button href={siteConfig.onboardingUrl} external>Invest Now</Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-navy lg:hidden"
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

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col overflow-y-auto bg-navy grain-overlay transition-opacity duration-300 lg:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-20 items-center justify-between border-b border-ivory/10 bg-ivory px-5 py-4">
          <Logo />
          <button type="button" className="flex h-10 w-10 items-center justify-center text-navy" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-1 flex-col items-center justify-center gap-6 py-8" aria-label="Mobile navigation">
          {siteConfig.nav.map((item, i) => {
            if ('children' in item && item.children) {
              return (
                <div key={item.label} className="flex flex-col items-center gap-4 w-full" style={{ animation: menuOpen ? `fade-up 0.5s ease ${i * 80}ms forwards` : undefined, opacity: menuOpen ? undefined : 0 }}>
                  <span className="font-display text-2xl text-ivory">{item.label}</span>
                  <div className="flex flex-col items-center gap-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="font-display text-xl text-ivory/70 transition-colors hover:text-brass-soft"
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
    </header>
  )
}
