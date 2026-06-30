import type { ReactNode } from 'react'

interface AnswerCalloutProps {
  children: ReactNode
  className?: string
}

export function AnswerCallout({ children, className = '' }: AnswerCalloutProps) {
  return (
    <div
      className={`border-l-4 border-brass bg-cream px-6 py-5 text-muted speakable-answer ${className}`}
    >
      {children}
    </div>
  )
}
