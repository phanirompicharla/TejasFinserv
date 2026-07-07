import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    try {
      window.scrollTo(0, 0)
    } catch {
      // Fallback in case window is undefined or scrollTo fails
    }
  }, [pathname])

  return null
}
