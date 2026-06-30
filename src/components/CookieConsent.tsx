import { useEffect, useState } from 'react'

const STORAGE_KEY = 'tejasfinserv-cookie-consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-16 inset-x-4 z-50 max-w-lg rounded-2xl border border-line bg-cream p-5 shadow-soft md:bottom-6 md:left-6 md:right-auto"
    >
      <p className="text-sm text-muted">
        We use cookies to improve your experience and analyse site traffic. By continuing, you agree to our{' '}
        <a href="/privacy" className="text-brass link-underline">Privacy Policy</a>.
      </p>
      <button
        type="button"
        onClick={accept}
        className="mt-4 rounded-full bg-brass px-5 py-2 text-sm font-semibold text-navy transition-colors hover:bg-brass-soft"
      >
        Accept
      </button>
    </div>
  )
}
