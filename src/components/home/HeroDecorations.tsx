import { useEffect, useRef, useState } from 'react'

export function HeroDecorations() {
  const layerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 18
      const y = (e.clientY / window.innerHeight - 0.5) * 12
      setOffset({ x, y })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
      aria-hidden="true"
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      <div className="hero-dot-grid absolute inset-0" />
      <div className="hero-topo-lines absolute bottom-0 right-0 h-[55%] w-[55%]" />

      <svg
        className="absolute right-[4%] top-[18%] h-[min(520px,55vh)] w-[min(520px,55vw)] opacity-[0.09]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path d="M30 370 Q200 30 370 370" stroke="var(--brass-soft)" strokeWidth="1" />
        <path d="M55 355 Q200 55 345 355" stroke="var(--brass)" strokeWidth="0.75" opacity="0.7" />
        <path d="M80 340 Q200 80 320 340" stroke="var(--brass-soft)" strokeWidth="0.5" opacity="0.5" />
        <circle cx="200" cy="110" r="72" stroke="var(--brass-soft)" strokeWidth="0.6" opacity="0.4" />
        <circle cx="200" cy="110" r="48" stroke="var(--brass)" strokeWidth="0.4" opacity="0.3" />
        <circle cx="200" cy="110" r="24" stroke="var(--brass-soft)" strokeWidth="0.3" opacity="0.25" />
      </svg>
    </div>
  )
}
