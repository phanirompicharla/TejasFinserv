import { Outlet } from 'react-router-dom'
import { CookieConsent } from './CookieConsent'
import { Footer } from './Footer'
import { Header } from './Header'
import { StickyInvestCTA } from './StickyInvestCTA'
import { WhatsAppFloat } from './WhatsAppFloat'

export function Layout() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brass focus:px-4 focus:py-2 focus:text-navy"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <StickyInvestCTA />
      <CookieConsent />
    </>
  )
}
