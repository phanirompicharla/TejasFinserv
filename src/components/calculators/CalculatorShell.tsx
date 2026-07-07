import { useCallback, useMemo, useState } from 'react'
import type { CalculatorDef } from '../../lib/calculators/registry'
import { CALC_DISCLAIMER, clamp, formatINR } from '../../lib/format'
import { Button } from '../Button'
import { siteConfig } from '../../lib/siteConfig'
import { CalculatorCharts } from './CalculatorCharts'
import { FAQSection } from '../FAQSection'
import { AnswerCallout } from '../AnswerCallout'

interface CalculatorShellProps {
  calculator: CalculatorDef
}

export function CalculatorShell({ calculator }: CalculatorShellProps) {
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
                {field.prefix}{field.id === 'regime' ? (values[field.id] === 1 ? 'Old' : 'New') : values[field.id].toLocaleString('en-IN')}{field.suffix && field.id !== 'regime' ? ` ${field.suffix}` : ''}
              </span>
            </div>
            <input
              id={field.id}
              type="range"
              min={field.min}
              max={field.max}
              step={field.step}
              value={values[field.id]}
              onChange={(e) => update(field.id, Number(e.target.value), field.min, field.max)}
              className="w-full accent-brass"
            />
            <input
              type="number"
              min={field.min}
              max={field.max}
              step={field.step}
              value={values[field.id]}
              onChange={(e) => update(field.id, Number(e.target.value), field.min, field.max)}
              className="mt-2 w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30"
            />
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-line bg-cream p-6 shadow-card md:p-8">
          <h2 className="font-display text-xl font-semibold text-navy">Results</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-ivory p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted">{labels.invested}</p>
              <p className="mt-1 font-display text-lg font-semibold text-navy">{formatINR(result.invested, true)}</p>
            </div>
            <div className="rounded-xl bg-ivory p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted">{labels.returns}</p>
              <p className="mt-1 font-display text-lg font-semibold text-brass">
                {calculator.slug === 'income-tax'
                  ? formatINR(result.extra.tax as number)
                  : formatINR(result.returns, true)}
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

          <div className="mt-8">
            <CalculatorCharts
              invested={result.invested}
              returns={Math.max(0, result.returns)}
              monthlyInvestment={values.monthly}
              lumpsumAmount={values.amount}
              swpCorpus={values.corpus}
              swpWithdrawal={values.monthlyWithdrawal}
              annualReturn={values.annualReturn}
              years={values.years}
            />
          </div>

          <p className="mt-6 text-xs text-muted italic">{CALC_DISCLAIMER}</p>
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