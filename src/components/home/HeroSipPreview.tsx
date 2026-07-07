import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { calcSip } from '../../lib/calculators/math'
import { formatINR } from '../../lib/format'

const MONTHLY = 5000
const RATE = 12
const YEARS = 10

export function HeroSipPreview() {
  const result = calcSip(MONTHLY, RATE, YEARS)
  const targetTotal = Math.round(result.total)

  const [displayTotal, setDisplayTotal] = useState(0)
  const hasAnimated = useRef(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setDisplayTotal(targetTotal)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return
        hasAnimated.current = true
        const start = performance.now()
        const duration = 1800
        const step = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setDisplayTotal(Math.floor(eased * targetTotal))
          if (p < 1) requestAnimationFrame(step)
          else setDisplayTotal(targetTotal)
        }
        requestAnimationFrame(step)
        observer.unobserve(el)
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [targetTotal])

  return (
    <div ref={ref} className="hero-glass hero-reveal hero-reveal-5 relative rounded-2xl p-6 md:p-7">
      <p className="relative z-10 text-xs font-semibold uppercase tracking-widest text-brass-soft">
        SIP Preview
      </p>
      <p className="mt-2 text-sm text-ivory/70">
        {formatINR(MONTHLY)} / month · {RATE}% p.a. · {YEARS} yrs
      </p>
      <p className="mt-4 font-display text-3xl font-semibold text-ivory md:text-4xl">
        {formatINR(displayTotal, true)}
      </p>
      <p className="mt-1 text-xs text-ivory/50">Estimated maturity value</p>

      <div className="mt-6 flex h-16 items-end gap-3">
        <div className="flex flex-col items-center gap-1">
          <div
            className="hero-bar-invested w-10 rounded-t bg-navy-deep/90"
            style={{ height: `30px` }}
            aria-hidden="true"
          />
          <span className="text-[10px] text-ivory/50">Invested</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div
            className="hero-bar-returns w-10 rounded-t bg-brass/85"
            style={{ height: `40px` }}
            aria-hidden="true"
          />
          <span className="text-[10px] text-ivory/50">Returns</span>
        </div>
        <svg viewBox="0 0 120 60" className="h-14 w-28 flex-shrink-0" aria-hidden="true">
          <path
            className="hero-growth-line"
            d="M4 50 L30 42 L55 35 L80 22 L116 8"
            fill="none"
            stroke="var(--brass-soft)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <Link
        to="/calculators/sip"
        className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-brass-soft link-underline transition-colors hover:text-brass"
      >
        Try the SIP calculator
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}
