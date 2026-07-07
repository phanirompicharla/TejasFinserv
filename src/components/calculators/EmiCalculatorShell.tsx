import { useCallback, useMemo, useState } from 'react'
import type { CalculatorDef } from '../../lib/calculators/registry'
import { CALC_DISCLAIMER, clamp, formatINR } from '../../lib/format'
import { Button } from '../Button'
import { siteConfig } from '../../lib/siteConfig'
import { FAQSection } from '../FAQSection'
import { AnswerCallout } from '../AnswerCallout'

interface CalculatorShellProps {
  calculator: CalculatorDef
}

export function EmiCalculatorShell({ calculator }: CalculatorShellProps) {
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

  // EMI specific values
  const principal = result.invested
  const totalInterest = result.returns
  const totalAmount = result.total
  const emi = result.extra.emi as number

  const principalPct = (principal / totalAmount) * 100
  const interestPct = (totalInterest / totalAmount) * 100

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
                {field.prefix}{values[field.id] !== undefined ? values[field.id].toLocaleString('en-IN') : ''}{field.suffix ? ` ${field.suffix}` : ''}
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
          
          {/* Top Values & Horizontal Allocation Bar */}
          <div className="mb-8">
            <div className="mb-2 font-display text-2xl font-bold text-navy">
              {formatINR(totalAmount, true)}
            </div>
            <div className="flex h-4 overflow-hidden rounded-full mb-3 shadow-sm bg-line">
              <div className="bg-navy transition-all duration-500" style={{ width: `${principalPct}%` }} />
              <div className="bg-brass transition-all duration-500" style={{ width: `${interestPct}%` }} />
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-navy" />
                Loan Amount ({formatINR(principal, true)})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brass" />
                Interest Payable ({formatINR(totalInterest, true)})
              </span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 text-left md:text-center border-t border-line">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">Loan Amount</p>
              <p className="mt-1 font-display text-lg font-semibold text-navy">{formatINR(principal, true)}</p>
            </div>
            <div className="md:col-auto col-span-2">
              <p className="text-xs uppercase tracking-wider text-muted">Total Amount Payable</p>
              <p className="mt-1 font-display text-lg font-semibold text-navy">{formatINR(totalAmount, true)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">Interest Payable</p>
              <p className="mt-1 font-display text-lg font-semibold text-brass">{formatINR(totalInterest, true)}</p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-muted">Monthly EMI</p>
              <p className="mt-1 font-display text-3xl font-bold text-navy">{formatINR(emi)}</p>
            </div>
          </div>

          <p className="mt-8 text-xs text-muted italic">{CALC_DISCLAIMER}</p>
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