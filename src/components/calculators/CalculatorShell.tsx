import { useCallback, useMemo, useState } from 'react'
import { TakeSnapshot } from './TakeSnapshot'
import type { CalculatorDef } from '../../lib/calculators/registry'
import { CALC_DISCLAIMER, clamp, formatINR } from '../../lib/format'
import { Button } from '../Button'
import { siteConfig } from '../../lib/siteConfig'
import { CalculatorCharts } from './CalculatorCharts'
import { FAQSection } from '../FAQSection'
import { AnswerCallout } from '../AnswerCallout'

interface CalculatorShellProps {
  calculator: CalculatorDef
  headerNode?: React.ReactNode
  unifiedLayout?: boolean
}

export function CalculatorShell({ calculator, headerNode, unifiedLayout }: CalculatorShellProps) {
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

  const exportInputs = useMemo(() => {
    return calculator.fields.map(field => {
      const val = values[field.id]
      let valStr = ''
      if (field.id === 'regime') {
        valStr = val === 1 ? 'Old' : 'New'
      } else if (val !== undefined) {
        valStr = val.toLocaleString('en-IN')
      }
      return {
        label: field.label,
        value: `${field.prefix || ''}${valStr}${field.suffix && field.id !== 'regime' ? ` ${field.suffix}` : ''}`
      }
    })
  }, [calculator, values])

  const exportResultsNode = (
    <div className={unifiedLayout ? "w-full bg-navy p-10 h-full flex flex-col rounded-3xl" : "w-full h-full flex flex-col"}>
        <div className={unifiedLayout ? "flex-1 flex flex-col" : "rounded-2xl border border-line bg-cream p-10 shadow-card flex-1 flex flex-col"}>
          <div className="grid gap-6 grid-cols-3">
            <div className="rounded-xl bg-ivory p-6 text-center border border-line">
              <p className="text-sm uppercase tracking-wider text-muted">{labels.invested}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-navy">{formatINR(result.invested, true)}</p>
            </div>
            <div className="rounded-xl bg-ivory p-6 text-center border border-line">
              <p className="text-sm uppercase tracking-wider text-muted">{labels.returns}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-brass">
                {calculator.slug === 'income-tax'
                  ? formatINR(result.extra.tax as number)
                  : formatINR(result.returns, true)}
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

          <div className="mt-12 flex-1 min-h-[400px]">
            <CalculatorCharts
              invested={result.invested}
              returns={Math.max(0, result.returns)}
              monthlyInvestment={values.monthly}
              lumpsumAmount={values.amount}
              swpCorpus={values.corpus}
              swpWithdrawal={values.monthlyWithdrawal}
              annualReturn={values.annualReturn}
              years={values.years}
              isSnapshot={true}
            />
          </div>
        </div>
    </div>
  )

  return (
    <>
    <div className={unifiedLayout ? "flex flex-col lg:flex-row rounded-[2rem] overflow-hidden shadow-card border border-line bg-cream" : "grid gap-10 lg:grid-cols-2 lg:items-start"}>
      <div className={unifiedLayout ? "w-full lg:w-1/2 p-6 md:p-10 space-y-6" : "space-y-6 rounded-2xl border border-line bg-cream p-6 shadow-card md:p-8"}>
        {headerNode && <div className="mb-8">{headerNode}</div>}
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

      <div className={unifiedLayout ? "w-full lg:w-1/2 p-6 md:p-10 bg-navy space-y-6" : "space-y-6"}>
        <div className={unifiedLayout ? "" : "rounded-2xl border border-line bg-cream p-6 shadow-card md:p-8"}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`font-display text-xl font-semibold ${unifiedLayout ? 'text-ivory' : 'text-navy'}`}>Results</h2>
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
    </div>

    <div className="mt-12 lg:col-span-2">
      <AnswerCallout>
        {calculator.intro}
      </AnswerCallout>
      <div className="mt-10">
        <FAQSection faqs={calculator.faqs} title="Frequently Asked Questions" />
      </div>
    </div>
  </>
  )
}