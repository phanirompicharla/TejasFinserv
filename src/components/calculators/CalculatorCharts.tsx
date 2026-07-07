import { useMemo } from 'react'

interface CalculatorChartsProps {
  invested: number
  returns: number
  /** SIP-specific: monthly investment amount */
  monthlyInvestment?: number
  /** SIP-specific: annual return percentage */
  annualReturn?: number
  /** Number of years (for year-by-year bar chart) */
  years?: number
}

/** Format value in Indian compact style for Y-axis labels */
function compactINR(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(1)} Cr`
  if (abs >= 1_00_000) return `₹${(value / 1_00_000).toFixed(0)}L`
  if (abs >= 1_000) return `₹${(value / 1_000).toFixed(0)}K`
  return `₹${value.toFixed(0)}`
}

/** Compute year-by-year SIP accumulation */
function computeYearlyData(monthly: number, annualReturn: number, years: number) {
  const monthlyRate = annualReturn / 12 / 100
  const data: { year: number; invested: number; totalValue: number; returns: number }[] = []

  for (let y = 1; y <= years; y++) {
    const n = y * 12
    const invested = monthly * n
    const totalValue =
      monthlyRate === 0
        ? invested
        : monthly * (((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate))
    data.push({
      year: y,
      invested,
      totalValue,
      returns: Math.max(0, totalValue - invested),
    })
  }
  return data
}

/** Generate nice Y-axis tick values */
function computeYTicks(maxValue: number): number[] {
  if (maxValue <= 0) return [0]
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)))
  let step = magnitude
  if (maxValue / step < 3) step = magnitude / 2
  if (maxValue / step > 8) step = magnitude * 2

  const ticks: number[] = [0]
  let v = step
  while (v <= maxValue * 1.1) {
    ticks.push(v)
    v += step
  }
  return ticks
}

const COLORS = {
  invested: 'var(--navy, #071321)',
  returns: 'var(--brass, #C89A52)',
}

export function CalculatorCharts({
  invested,
  returns,
  monthlyInvestment,
  annualReturn,
  years,
}: CalculatorChartsProps) {
  const total = invested + returns
  const safeTotal = total > 0 ? total : 1
  const investedPct = (Math.max(0, invested) / safeTotal) * 100

  // Compute year-by-year data for the stacked bar chart
  const yearlyData = useMemo(() => {
    if (monthlyInvestment && annualReturn !== undefined && years) {
      return computeYearlyData(monthlyInvestment, annualReturn, years)
    }
    return null
  }, [monthlyInvestment, annualReturn, years])

  // Chart dimensions
  const chartMarginLeft = 55
  const chartMarginRight = 10
  const chartMarginTop = 10
  const chartMarginBottom = 35
  const chartWidth = 500
  const chartHeight = 220
  const plotWidth = chartWidth - chartMarginLeft - chartMarginRight
  const plotHeight = chartHeight - chartMarginTop - chartMarginBottom

  // Y-axis computation
  const maxValue = yearlyData
    ? Math.max(...yearlyData.map((d) => d.totalValue))
    : total
  const yTicks = computeYTicks(maxValue)
  const yMax = yTicks[yTicks.length - 1] || 1

  // Bar layout
  const barCount = yearlyData ? yearlyData.length : 0
  const barGap = barCount > 15 ? 2 : barCount > 8 ? 4 : 6
  const barWidth = barCount > 0 ? Math.max(8, (plotWidth - barGap * (barCount + 1)) / barCount) : 30

  const getY = (value: number) =>
    chartMarginTop + plotHeight - (value / yMax) * plotHeight

  const getBarX = (index: number) =>
    chartMarginLeft + barGap + index * (barWidth + barGap)

  // Determine how many x-axis labels to show (avoid overlap)
  const maxLabels = Math.floor(plotWidth / 40)
  const labelInterval = barCount > maxLabels ? Math.ceil(barCount / maxLabels) : 1

  return (
    <div className="space-y-6">
      {/* Stacked bar chart (only when yearly data is available) */}
      {yearlyData && yearlyData.length > 0 ? (
        <div>
          {/* Legend */}
          <div className="mb-3 flex items-center gap-5 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: COLORS.invested }}
              />
              Invested
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: COLORS.returns }}
              />
              Returns
            </span>
          </div>

          {/* SVG Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full"
              style={{ minWidth: barCount > 20 ? '600px' : undefined }}
              aria-label="Stacked investment bar chart"
              role="img"
            >
              {/* Grid lines */}
              {yTicks.map((tick) => (
                <line
                  key={`grid-${tick}`}
                  x1={chartMarginLeft}
                  x2={chartWidth - chartMarginRight}
                  y1={getY(tick)}
                  y2={getY(tick)}
                  stroke="var(--line, #e5e1d8)"
                  strokeWidth="0.5"
                  strokeDasharray={tick === 0 ? undefined : '3,3'}
                />
              ))}

              {/* Y-axis labels */}
              {yTicks.map((tick) => (
                <text
                  key={`ylabel-${tick}`}
                  x={chartMarginLeft - 6}
                  y={getY(tick) + 3}
                  textAnchor="end"
                  fontSize="8"
                  fill="var(--muted, #888)"
                  fontFamily="inherit"
                >
                  {compactINR(tick)}
                </text>
              ))}

              {/* Bars */}
              {yearlyData.map((d, i) => {
                const investedHeight = (d.invested / yMax) * plotHeight
                const returnsHeight = (d.returns / yMax) * plotHeight
                const totalBarHeight = investedHeight + returnsHeight
                const barX = getBarX(i)
                const barY = chartMarginTop + plotHeight - totalBarHeight

                return (
                  <g key={d.year}>
                    {/* Returns section (top) — drawn first as full bar with rounded top */}
                    <rect
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={Math.max(0, totalBarHeight)}
                      rx={Math.min(3, barWidth / 3)}
                      ry={Math.min(3, barWidth / 3)}
                      fill={COLORS.returns}
                      className="transition-all duration-500"
                    />
                    {/* Invested section (bottom) — overlaid with flat top */}
                    <rect
                      x={barX}
                      y={chartMarginTop + plotHeight - investedHeight}
                      width={barWidth}
                      height={Math.max(0, investedHeight)}
                      fill={COLORS.invested}
                      className="transition-all duration-500"
                    />
                    {/* Tooltip area (invisible hover target) */}
                    <title>
                      {`Year ${d.year}\nInvested: ${compactINR(d.invested)}\nReturns: ${compactINR(d.returns)}\nTotal: ${compactINR(d.totalValue)}`}
                    </title>
                  </g>
                )
              })}

              {/* X-axis labels */}
              {yearlyData.map((d, i) => {
                if (i % labelInterval !== 0 && i !== yearlyData.length - 1) return null
                return (
                  <text
                    key={`xlabel-${d.year}`}
                    x={getBarX(i) + barWidth / 2}
                    y={chartHeight - chartMarginBottom + 15}
                    textAnchor="middle"
                    fontSize="7.5"
                    fill="var(--muted, #888)"
                    fontFamily="inherit"
                  >
                    {barCount <= 5 ? `Year ${d.year}` : `Y${d.year}`}
                  </text>
                )
              })}

              {/* Y-axis line */}
              <line
                x1={chartMarginLeft}
                x2={chartMarginLeft}
                y1={chartMarginTop}
                y2={chartMarginTop + plotHeight}
                stroke="var(--line, #e5e1d8)"
                strokeWidth="1"
              />
              {/* X-axis line */}
              <line
                x1={chartMarginLeft}
                x2={chartWidth - chartMarginRight}
                y1={chartMarginTop + plotHeight}
                y2={chartMarginTop + plotHeight}
                stroke="var(--line, #e5e1d8)"
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>
      ) : (
        /* Fallback: allocation bar for non-SIP calculators */
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="flex flex-col items-center justify-center">
            <div className="flex gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-navy" />
                Invested
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brass" />
                Returns
              </span>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-navy">Allocation</p>
            <div className="flex h-8 overflow-hidden rounded-lg">
              <div
                className="bg-navy transition-all duration-500"
                style={{ width: `${investedPct}%` }}
              />
              <div className="bg-brass flex-1 transition-all duration-500" />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted">
              <span>Invested {investedPct.toFixed(0)}%</span>
              <span>Returns {(100 - investedPct).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Allocation bar — shown below chart for SIP calculators too */}
      {yearlyData && yearlyData.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-navy">Allocation</p>
          <div className="flex h-8 overflow-hidden rounded-lg">
            <div
              className="bg-navy transition-all duration-500"
              style={{ width: `${investedPct}%` }}
            />
            <div className="bg-brass flex-1 transition-all duration-500" />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted">
            <span>Invested {investedPct.toFixed(0)}%</span>
            <span>Returns {(100 - investedPct).toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  )
}
