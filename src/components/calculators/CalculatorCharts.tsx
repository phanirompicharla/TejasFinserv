import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface CalculatorChartsProps {
  invested: number
  returns: number
  /** SIP-specific: monthly investment amount */
  monthlyInvestment?: number
  /** Lumpsum-specific: initial investment amount */
  lumpsumAmount?: number
  /** SWP-specific: starting corpus */
  swpCorpus?: number
  /** SWP-specific: monthly withdrawal */
  swpWithdrawal?: number
  /** Annual return percentage */
  annualReturn?: number
  /** Number of years (for year-by-year bar chart) */
  years?: number
  /** True if rendered inside the export snapshot to disable animations */
  isSnapshot?: boolean
}

/** Format value in Indian compact style for Y-axis labels */
function compactINR(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(1)} Cr`
  if (abs >= 1_00_000) return `₹${(value / 1_00_000).toFixed(0)}L`
  if (abs >= 1_000) return `₹${(value / 1_000).toFixed(0)}K`
  return `₹${value.toFixed(0)}`
}

/** Format value in Indian currency style for Tooltips */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
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

/** Compute year-by-year Lumpsum accumulation */
function computeLumpsumYearlyData(amount: number, annualReturn: number, years: number) {
  const annualRate = annualReturn / 100
  const data: { year: number; invested: number; totalValue: number; returns: number }[] = []

  for (let y = 1; y <= years; y++) {
    const totalValue = amount * Math.pow(1 + annualRate, y)
    data.push({
      year: y,
      invested: amount,
      totalValue,
      returns: Math.max(0, totalValue - amount),
    })
  }
  return data
}

/** Compute year-by-year SWP accumulation */
function computeSwpYearlyData(corpus: number, monthlyWithdrawal: number, annualReturn: number, years: number) {
  const monthlyRate = annualReturn / 12 / 100
  const data: { year: number; invested: number; totalValue: number; returns: number }[] = []

  let balance = corpus
  let totalWithdrawn = 0

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      if (balance > 0) {
        balance = balance * (1 + monthlyRate) - monthlyWithdrawal
        if (balance < 0) balance = 0
        totalWithdrawn += monthlyWithdrawal
      }
    }
    data.push({
      year: y,
      invested: balance, // Portfolio Balance
      returns: totalWithdrawn, // Total Withdrawn
      totalValue: balance + totalWithdrawn, // Only for technical consistency, won't show in SWP tooltip
    })
  }
  return data
}

const COLORS = {
  invested: '#071321', // navy
  returns: '#C89A52',  // brass
}

const CustomTooltip = ({ active, payload, label, labelInvested, labelReturns, isSwp }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border border-line bg-cream p-4 shadow-card">
        <p className="mb-3 text-sm font-semibold text-navy">Year {label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-6 text-sm">
            <span className="flex items-center gap-1.5 text-muted">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.invested }} />
              {labelInvested}
            </span>
            <span className="font-medium text-navy">
              {formatCurrency(data.invested)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 text-sm">
            <span className="flex items-center gap-1.5 text-muted">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.returns }} />
              {labelReturns}
            </span>
            <span className="font-medium text-navy">
              {formatCurrency(data.returns)}
            </span>
          </div>
        </div>
        {!isSwp && (
          <div className="mt-3 flex items-center justify-between gap-6 border-t border-line pt-3 text-sm">
            <span className="font-semibold text-navy">Total Value</span>
            <span className="font-semibold text-brass">
              {formatCurrency(data.totalValue)}
            </span>
          </div>
        )}
      </div>
    )
  }
  return null
}

export function CalculatorCharts({
  invested,
  returns,
  monthlyInvestment,
  lumpsumAmount,
  swpCorpus,
  swpWithdrawal,
  annualReturn,
  years,
  isSnapshot = false,
}: CalculatorChartsProps) {
  const total = invested + returns
  const safeTotal = total > 0 ? total : 1
  const investedPct = (Math.max(0, invested) / safeTotal) * 100

  // Compute year-by-year data for the stacked bar chart
  const yearlyData = useMemo(() => {
    if (swpCorpus && swpWithdrawal !== undefined && annualReturn !== undefined && years) {
      return computeSwpYearlyData(swpCorpus, swpWithdrawal, annualReturn, years)
    }
    if (monthlyInvestment && annualReturn !== undefined && years) {
      return computeYearlyData(monthlyInvestment, annualReturn, years)
    }
    if (lumpsumAmount && annualReturn !== undefined && years) {
      return computeLumpsumYearlyData(lumpsumAmount, annualReturn, years)
    }
    return null
  }, [monthlyInvestment, lumpsumAmount, swpCorpus, swpWithdrawal, annualReturn, years])

  // Chart configuration based on type
  const isSwp = swpCorpus !== undefined
  const labelInvested = isSwp ? 'Portfolio Balance' : 'Invested'
  const labelReturns = isSwp ? 'Total Withdrawn' : 'Returns'

  // Calculate label interval based on number of years to avoid overlapping X-axis labels
  const barCount = yearlyData ? yearlyData.length : 0
  const labelInterval = barCount > 15 ? Math.ceil(barCount / 10) : 1
  const barSize = barCount > 20 ? 10 : barCount > 10 ? 16 : 30

  return (
    <div className="space-y-6">
      {/* Stacked bar chart (only when yearly data is available) */}
      {yearlyData && yearlyData.length > 0 ? (
        <div>
          {/* Legend */}
          <div className="mb-4 flex items-center justify-center gap-5 text-xs text-muted sm:justify-start">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: COLORS.invested }}
              />
              {labelInvested}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: COLORS.returns }}
              />
              {labelReturns}
            </span>
          </div>

          {/* Recharts Chart */}
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={yearlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                barSize={barSize}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e1d8" />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={{ stroke: '#e5e1d8' }}
                  tickFormatter={(val: any) => `Year ${val}`}
                  tick={{ fontSize: 11, fill: '#888' }}
                  interval={labelInterval - 1}
                  dy={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={compactINR}
                  tick={{ fontSize: 11, fill: '#888' }}
                  width={55}
                />
                <Tooltip 
                  content={
                    <CustomTooltip 
                      labelInvested={labelInvested} 
                      labelReturns={labelReturns} 
                      isSwp={isSwp}
                    />
                  } 
                  cursor={{ fill: 'rgba(7, 19, 33, 0.04)' }} 
                />
                <Bar
                  dataKey="invested"
                  stackId="a"
                  fill={COLORS.invested}
                  radius={[0, 0, 0, 0]}
                  isAnimationActive={!isSnapshot}
                  animationDuration={800}
                />
                <Bar
                  dataKey="returns"
                  stackId="a"
                  fill={COLORS.returns}
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={!isSnapshot}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        /* Fallback: allocation bar for non-SIP/Lumpsum/SWP calculators */
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
                className={`bg-navy ${!isSnapshot ? 'transition-all duration-500' : ''}`}
                style={{ width: `${investedPct}%` }}
              />
              <div className={`bg-brass flex-1 ${!isSnapshot ? 'transition-all duration-500' : ''}`} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted">
              <span>Invested {investedPct.toFixed(0)}%</span>
              <span>Returns {(100 - investedPct).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
