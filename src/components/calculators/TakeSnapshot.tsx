import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { CalculatorExportLayout } from './CalculatorExportLayout'
import logoImg from '../../assets/images/TEJAS SVG2.svg'

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
    console.log("Snapshot started");
    if (!exportRef.current || isGenerating) return
    setIsGenerating(true)

    const downloadFilename = filename || `TejasFinserv-${title.replace(/\\s+/g, '-')}.png`
    let fileHandle: any = null

    try {
      // 1. If supported, show the native Save As dialog first
      if ('showSaveFilePicker' in window) {
        try {
          fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: downloadFilename,
            types: [
              {
                description: 'PNG Image',
                accept: { 'image/png': ['.png'] },
              },
            ],
          })
        } catch (err: any) {
          // If the user simply cancelled the dialog, abort silently
          if (err.name === 'AbortError') {
            setIsGenerating(false)
            return
          }
          console.warn('Native save dialog failed, falling back to standard download...', err)
        }
      }

      // 2. Wait for fonts/charts to fully render
      await document.fonts.ready
      await new Promise((r) => setTimeout(r, 300))

      // 3. Clone node and convert OKLCH/OKLAB to RGB
      const originalNode = exportRef.current
      const cloneNode = originalNode.cloneNode(true) as HTMLElement
      // Append clone to body to compute styles properly (hidden)
      cloneNode.style.position = 'absolute'
      cloneNode.style.left = '-99999px'
      cloneNode.style.top = '0'
      cloneNode.style.width = '1600px'
      cloneNode.style.height = '900px'
      cloneNode.style.opacity = '1'
      document.body.appendChild(cloneNode)

      const getRgbFromCss = (colorStr: string): string => {
        if (!colorStr || (!colorStr.includes('oklch') && !colorStr.includes('oklab'))) return colorStr
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return colorStr
        ctx.fillStyle = colorStr
        ctx.fillRect(0, 0, 1, 1)
        const data = ctx.getImageData(0, 0, 1, 1).data
        return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`
      }

      const originalElements = Array.from(originalNode.querySelectorAll('*'))
      const clonedElements = Array.from(cloneNode.querySelectorAll('*'))
      const props = ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor']

      originalElements.forEach((orig, index) => {
        const cloneEl = clonedElements[index] as HTMLElement
        if (!cloneEl || !cloneEl.style) return
        const computed = window.getComputedStyle(orig)
        props.forEach(prop => {
          const val = (computed as any)[prop]
          if (val && (val.includes('oklch') || val.includes('oklab'))) {
            (cloneEl.style as any)[prop] = getRgbFromCss(val)
          }
        })
      })

      // Convert root node
      const computedRoot = window.getComputedStyle(originalNode)
      props.forEach(prop => {
        const val = (computedRoot as any)[prop]
        if (val && (val.includes('oklch') || val.includes('oklab'))) {
          (cloneNode.style as any)[prop] = getRgbFromCss(val)
        }
      })

      // 4. Generate the snapshot on the converted CLONE
      const canvas = await html2canvas(cloneNode, {
        backgroundColor: '#ffffff',
        scale: 2, // High resolution
        useCORS: true,
        allowTaint: true,
        logging: false,
      })

      console.log("Canvas generated", canvas.width, canvas.height);
      // Add footer text to the canvas
      const ctx = canvas.getContext('2d')
      if (ctx) {
        console.log("Drawing footer");
        ctx.save()
        // html2canvas leaves the context scaled (e.g. scale: 2). Reset it so our raw pixel coordinates work.
        ctx.setTransform(1, 0, 0, 1, 0, 0)

        const scale = 2
        const horizontalMargin = 65 * scale
        const bottomPadding = 45 * scale
        
        const yPos = canvas.height - bottomPadding

        ctx.fillStyle = '#0B1526' // dark navy color
        ctx.textBaseline = 'bottom'

        // Load and draw the logo
        let logoOffset = 0
        try {
          const logo = new Image()
          logo.src = logoImg
          await new Promise((resolve, reject) => {
            logo.onload = resolve
            logo.onerror = reject
          })
          
          // Height: 36px visually (which is ~50% larger than the original 24px layout logo)
          const logoHeight = 36 * scale
          const logoWidth = (logo.width / logo.height) * logoHeight
          
          // Align logo vertically with text baseline (roughly)
          const logoY = yPos - logoHeight + (5 * scale) 
          
          ctx.drawImage(logo, horizontalMargin, logoY, logoWidth, logoHeight)
          
          logoOffset = logoWidth + (16 * scale) // logo width + 16px gap
        } catch (e) {
          console.error("Failed to draw logo on snapshot", e)
        }

        // Bottom-left
        const leftFontSize = 28 * scale
        ctx.font = `700 ${leftFontSize}px sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText('Powered by TejasFinserv', horizontalMargin + logoOffset, yPos)

        // Bottom-right
        const rightFontSize = 24 * scale
        const rightLineHeight = rightFontSize * 1.5 // 1.5 line spacing
        ctx.font = `600 ${rightFontSize}px sans-serif`
        ctx.textAlign = 'right'
        ctx.fillText('ARN-251896', canvas.width - horizontalMargin, yPos - rightLineHeight)
        ctx.fillText('9490716662', canvas.width - horizontalMargin, yPos)

        ctx.restore()
      }

      // 5. Cleanup clone
      document.body.removeChild(cloneNode)

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas rendering failed (width or height is 0).')
      }

      // 6. Save the generated PNG
      console.log("Downloading image");
      if (fileHandle) {
        // Native Save: Write the blob directly to the selected location
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png', 1.0))
        if (!blob) throw new Error('PNG generation failed.')
        if (blob.size === 0) throw new Error('PNG generation failed (0 bytes).')
        
        const writable = await fileHandle.createWritable()
        await writable.write(blob)
        await writable.close()
      } else {
        // Fallback: Automatic download via anchor tag
        const image = canvas.toDataURL('image/png', 1.0)
        const link = document.createElement('a')
        link.href = image
        link.download = downloadFilename
        link.click()
      }
    } catch (err: any) {
      console.error('Snapshot failed:', err)
      alert(err.message || 'Failed to save the snapshot.')
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
