interface ChartSegment {
  label: string
  value: number
}

interface CalculatorChartsProps {
  invested: number
  returns: number
}

const COLORS = ['var(--navy)', 'var(--brass)']

export function CalculatorCharts({ invested, returns }: CalculatorChartsProps) {
  const total = invested + returns
  const segments: ChartSegment[] = [
    { label: 'Invested', value: Math.max(0, invested) },
    { label: 'Returns', value: Math.max(0, returns) },
  ]
  const safeTotal = total > 0 ? total : 1

  let cumulative = 0
  const arcs = segments.map((seg, i) => {
    const pct = seg.value / safeTotal
    const start = cumulative
    cumulative += pct
    const startAngle = start * 360 - 90
    const endAngle = cumulative * 360 - 90
    const largeArc = pct > 0.5 ? 1 : 0
    const r = 60
    const cx = 80
    const cy = 80
    const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180)
    const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180)
    const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180)
    const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180)
    const d =
      pct >= 0.999
        ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r}`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    return { d, color: COLORS[i], label: seg.label, pct }
  })

  const barInvestedPct = (Math.max(0, invested) / safeTotal) * 100

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 160 160" className="h-40 w-40" aria-label="Investment breakdown donut chart">
          {arcs.map((arc) => (
            <path key={arc.label} d={arc.d} fill={arc.color} />
          ))}
          <circle cx="80" cy="80" r="35" fill="var(--cream)" />
        </svg>
        <div className="mt-4 flex gap-4 text-xs text-muted">
          {segments.map((s, i) => (
            <span key={s.label} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-navy">Allocation</p>
        <div className="flex h-8 overflow-hidden rounded-lg">
          <div className="bg-navy transition-all duration-500" style={{ width: `${barInvestedPct}%` }} />
          <div className="bg-brass flex-1 transition-all duration-500" />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>Invested {barInvestedPct.toFixed(0)}%</span>
          <span>Returns {(100 - barInvestedPct).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  )
}
