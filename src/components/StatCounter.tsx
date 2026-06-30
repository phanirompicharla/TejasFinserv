import { useEffect, useRef, useState } from 'react'

interface StatCounterProps {
  value: number | string
  suffix?: string
  label: string
  duration?: number
}

export function StatCounter({ value, suffix = '+', label, duration = 2000 }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState<string | number>(
    typeof value === 'number' ? 0 : value
  )
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplay(value)
      return
    }

    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const animate = () => {
      if (hasAnimated.current) return
      hasAnimated.current = true

      if (prefersReduced) {
        setDisplay(value)
        return
      }

      const start = performance.now()
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.floor(eased * value))
        if (progress < 1) requestAnimationFrame(step)
        else setDisplay(value)
      }
      requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate()
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  const displayText =
    typeof value === 'number'
      ? `${typeof display === 'number' ? display.toLocaleString('en-IN') : display}${suffix}`
      : `${display}${suffix}`

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl font-semibold text-brass md:text-5xl">
        {displayText}
      </div>
      <p className="mt-2 text-sm text-ivory/80">{label}</p>
    </div>
  )
}
