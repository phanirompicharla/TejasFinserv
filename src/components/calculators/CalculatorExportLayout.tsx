import { forwardRef } from 'react'
import { Logo } from '../Logo'

interface ExportInput {
  label: string
  value: string
}

interface Props {
  title: string
  inputs: ExportInput[]
  resultsNode: React.ReactNode
}

export const CalculatorExportLayout = forwardRef<HTMLDivElement, Props>(
  ({ title, inputs, resultsNode }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          position: 'absolute',
          left: '-99999px',
          top: 0,
          width: '1600px',
          height: '900px',
          background: 'white',
          opacity: 1,
        }}
        className="flex flex-col font-sans overflow-hidden z-[-50]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-16 py-10 border-b border-line bg-ivory">
          <h1 className="text-4xl font-display font-bold text-navy">{title}</h1>
          <div className="flex items-center h-12">
            <Logo imgClassName="h-12 w-auto object-contain" />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 grid grid-cols-12 gap-16 px-16 py-12 bg-cream">
          {/* Left Panel: Inputs */}
          <div className="col-span-4 flex flex-col gap-10 justify-center pr-8 border-r border-line/50">
            {inputs.map((input, idx) => (
              <div key={idx}>
                <p className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">
                  {input.label}
                </p>
                <p className="text-4xl font-display font-bold text-navy">
                  {input.value}
                </p>
              </div>
            ))}
          </div>

          {/* Right Panel: Results & Chart */}
          <div className="col-span-8 flex flex-col justify-center w-full h-full">
            {resultsNode}
          </div>
        </div>

        {/* Footer */}
        <div className="px-16 py-6 bg-navy text-ivory flex justify-between items-center border-t-4 border-brass">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold">
              Calculators are for illustration purposes only. Returns assumed, not guaranteed.
            </p>
            <p className="text-xs text-ivory/70 mt-1">
              Mutual Funds are subject to market risks.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-brass font-medium text-sm">Powered by</span>
            <div className="h-6 w-auto flex items-center brightness-0 invert">
              <Logo imgClassName="h-6 w-auto object-contain" />
            </div>
          </div>
        </div>
      </div>
    )
  }
)
