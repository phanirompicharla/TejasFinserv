import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { siteConfig } from '../lib/siteConfig'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function Analytics() {
  const location = useLocation()
  const ga4Id = siteConfig.analytics.ga4Id

  useEffect(() => {
    if (!ga4Id) return

    // Inject gtag.js script if not already present
    const scriptId = 'ga4-gtag-script'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      window.gtag = function (...args: unknown[]) {
        window.dataLayer?.push(args)
      }
      window.gtag('js', new Date())
    }

    // Track SPA navigation (page views) whenever location changes
    if (typeof window.gtag === 'function') {
      window.gtag('config', ga4Id, {
        page_path: location.pathname + location.search,
      })
    }
  }, [location.pathname, location.search, ga4Id])

  return null
}
