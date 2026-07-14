import { useCallback, useMemo, useState } from 'react'
import { TakeSnapshot } from './TakeSnapshot'
import type { CalculatorDef } from '../../lib/calculators/registry'
import { CALC_DISCLAIMER, clamp, formatINR } from '../../lib/format'
import { Button } from '../Button'
import { siteConfig } from '../../lib/siteConfig'
import { FAQSection } from '../FAQSection'
import { AnswerCallout } from '../AnswerCallout'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface CalculatorShellProps {
  calculator: CalculatorDef
}

export function RetirementCalculatorShell({ calculator }: CalculatorShellProps) {
  const initial = useMemo(() => {
    const v: Record<string, number> = {}
    calculator.fields.forEach((f) => { v[f.id] = f.defaultValue })
    return v
  }, [calculator])

  const [values, setValues] = useState(initial)

  const update = useCallback((id: string, raw: number, min: number, max: number) => {
    setValues((prev) => ({ ...prev, [id]: clamp(raw, min, max) }))
  }, [])

  const result = useMemo(() => calculator.compute(values), [calculator, values])

  const labels = {
    invested: calculator.resultLabels?.invested ?? 'Amount Invested',
    returns: calculator.resultLabels?.returns ?? 'Est. Returns',
    total: calculator.resultLabels?.total ?? 'Total Value',
  }

  const chartData = [
    { name: 'Current Savings', value: result.invested },
    { name: 'Additional Savings Required', value: result.returns }
  ]

  const exportInputs = useMemo(() => {
    return calculator.fields.map(field => {
      const val = values[field.id]
      const valStr = val !== undefined ? val.toLocaleString('en-IN') : ''
      return {
        label: field.label,
        value: `${field.prefix || ''}${valStr}${field.suffix ? ` ${field.suffix}` : ''}`
      }
    })
  }, [calculator, values])

  const exportResultsNode = (
    <div className="w-full h-full flex flex-col">
        <div className="rounded-2xl border border-line bg-cream p-10 shadow-card flex-1 flex flex-col justify-center">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-ivory p-6 text-center border border-line">
              <p className="text-sm uppercase tracking-wider text-muted">{labels.invested}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-navy">{formatINR(result.invested, true)}</p>
            </div>
            <div className="rounded-xl bg-ivory p-6 text-center border border-line">
              <p className="text-sm uppercase tracking-wider text-muted">{labels.returns}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-brass">
                {formatINR(result.returns, true)}
              </p>
            </div>
            <div className="rounded-xl bg-navy p-6 text-center text-ivory shadow-card">
              <p className="text-sm uppercase tracking-wider text-ivory/70">{labels.total}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-brass-soft">{formatINR(result.total, true)}</p>
            </div>
          </div>

          {Object.keys(result.extra).length > 0 && (
            <dl className="mt-8 space-y-3 border-t border-line pt-6">
              {Object.entries(result.extra).map(([key, val]) => (
                <div key={key} className="flex justify-between text-lg">
                  <dt className="text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                  <dd className="font-semibold text-navy">
                    {typeof val === 'number' && key !== 'cagr' && key !== 'yearsLasted' && key !== 'monthsLasted' ? formatINR(val) : String(val)}{key === 'cagr' ? '%' : ''}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-16 flex-1 min-h-[350px]">
            <div className="relative mx-auto flex h-[350px] w-full max-w-lg flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={130}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={5}
                    isAnimationActive={false}
                    label={(entry: any) => formatINR(entry.value, true)}
                    labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                  >
                    <Cell fill="#C89A52" />
                    <Cell fill="#071321" />
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => formatINR(value as number)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e1d8', backgroundColor: '#FDFBF7' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Text overlay */}
              <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                <p className="font-display text-4xl font-bold text-navy">{formatINR(result.total, true)}</p>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-lg text-muted">
              <span className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full bg-brass"></span>
                Current Savings
              </span>
              <span className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full bg-navy"></span>
                Additional Savings Required
              </span>
            </div>
          </div>
        </div>
    </div>
  )

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
      <div className="space-y-6 rounded-2xl border border-line bg-cream p-6 shadow-card md:p-8">
        <h2 className="font-display text-xl font-semibold text-navy">Inputs</h2>
        {calculator.fields.map((field) => (
          <div key={field.id}>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor={field.id} className="text-sm font-medium text-ink">
                {field.label}
              </label>
              <span className="text-sm font-semibold text-brass">
                {field.prefix}{field.id === 'regime' ? (values[field.id] === 1 ? 'Old' : 'New') : (values[field.id] !== undefined ? values[field.id].toLocaleString('en-IN') : '')}{field.suffix && field.id !== 'regime' ? ` ${field.suffix}` : ''}
              </span>
            </div>
            <input
              id={field.id}
              type="range"
              min={field.min}
              max={field.max}
              step={field.step}
              value={values[field.id] ?? field.defaultValue}
              onChange={(e) => update(field.id, Number(e.target.value), field.min, field.max)}
              className="w-full accent-brass"
            />
            <input
              type="number"
              min={field.min}
              max={field.max}
              step={field.step}
              value={values[field.id] ?? field.defaultValue}
              onChange={(e) => update(field.id, Number(e.target.value), field.min, field.max)}
              className="mt-2 w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30"
            />
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-line bg-cream p-6 shadow-card md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-navy">Results</h2>
            <TakeSnapshot
              title={calculator.title}
              inputs={exportInputs}
              resultsNode={exportResultsNode}
              filename={`TejasFinserv-${calculator.slug}-Calculator.png`}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-ivory p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted">{labels.invested}</p>
              <p className="mt-1 font-display text-lg font-semibold text-navy">{formatINR(result.invested, true)}</p>
            </div>
            <div className="rounded-xl bg-ivory p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted">{labels.returns}</p>
              <p className="mt-1 font-display text-lg font-semibold text-brass">
                {formatINR(result.returns, true)}
              </p>
            </div>
            <div className="rounded-xl bg-navy p-4 text-center text-ivory">
              <p className="text-xs uppercase tracking-wider text-ivory/70">{labels.total}</p>
              <p className="mt-1 font-display text-lg font-semibold text-brass-soft">{formatINR(result.total, true)}</p>
            </div>
          </div>

          {Object.keys(result.extra).length > 0 && (
            <dl className="mt-6 space-y-2 border-t border-line pt-4">
              {Object.entries(result.extra).map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm">
                  <dt className="text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                  <dd className="font-semibold text-navy">
                    {typeof val === 'number' && key !== 'cagr' && key !== 'yearsLasted' && key !== 'monthsLasted' ? formatINR(val) : String(val)}{key === 'cagr' ? '%' : ''}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-10">
            <div className="relative mx-auto flex h-[260px] w-full max-w-sm flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={5}
                    label={(entry: any) => formatINR(entry.value, true)}
                    labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                  >
                    <Cell fill="#C89A52" /> {/* Brass / Gold */}
                    <Cell fill="#071321" /> {/* Navy / Black */}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => formatINR(value as number)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e1d8', backgroundColor: '#FDFBF7' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Text overlay */}
              <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                <p className="font-display text-3xl font-bold text-navy">{formatINR(result.total, true)}</p>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-brass"></span>
                Current Savings
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-navy"></span>
                Additional Savings Required
              </span>
            </div>
          </div>

          <p className="mt-10 text-xs text-muted italic">{CALC_DISCLAIMER}</p>
        </div>

        <div className="text-center">
          <Button href={siteConfig.onboardingUrl} external>Start Investing</Button>
        </div>
      </div>

      <div className="lg:col-span-2">
        <AnswerCallout>
          {calculator.intro}
        </AnswerCallout>
        <div className="mt-10">
          <FAQSection faqs={calculator.faqs} title="Frequently Asked Questions" />
        </div>
      </div>
    </div>
  )
}