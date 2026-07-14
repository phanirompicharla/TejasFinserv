import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { CalculatorExportLayout } from './CalculatorExportLayout'

interface ExportInput {
  label: string
  value: string
}

interface TakeSnapshotProps {
  title: string
  inputs: ExportInput[]
  resultsNode: React.ReactNode
  filename?: string
}

export function TakeSnapshot({ title, inputs, resultsNode, filename }: TakeSnapshotProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

  const handleSnapshot = async () => {
    if (!exportRef.current || isGenerating) return
    setIsGenerating(true)
    try {
      // Give time for charts to animate/render and fonts to load
      await new Promise((r) => setTimeout(r, 800))

      const canvas = await html2canvas(exportRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#FDFBF7', // Match the ivory/cream background
      })

      const image = canvas.toDataURL('image/png', 1.0)
      const link = document.createElement('a')
      link.href = image
      link.download = filename || `TejasFinserv-${title.replace(/\s+/g, '-')}.png`
      link.click()
    } catch (err) {
      console.error('Snapshot failed', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <button
        onClick={handleSnapshot}
        disabled={isGenerating}
        aria-label="Take Snapshot"
        title="Take Snapshot"
        className="flex items-center gap-2 px-4 py-2 bg-white border border-brass text-navy rounded-full shadow-sm hover:shadow-md hover:bg-ivory transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-brass">
          {/* Camera Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </span>
        <span className="text-sm font-semibold">{isGenerating ? 'Generating...' : 'Take Snapshot'}</span>
      </button>

      {/* Render the off-screen layout */}
      <CalculatorExportLayout
        ref={exportRef}
        title={title}
        inputs={inputs}
        resultsNode={resultsNode}
      />
    </>
  )
}
