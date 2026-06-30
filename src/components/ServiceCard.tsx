import { Link } from 'react-router-dom'
import { SectionReveal } from './SectionReveal'

interface ServiceCardProps {
  title: string
  description: string
  path: string
  delay?: number
}

export function ServiceCard({ title, description, path, delay = 0 }: ServiceCardProps) {
  return (
    <SectionReveal delay={delay}>
      <Link
        to={path}
        className="group flex h-full flex-col rounded-2xl border border-line bg-cream p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brass/40 hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brass"
      >
        <h3 className="font-display text-xl font-semibold text-navy transition-colors group-hover:text-brass">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-muted">{description}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brass">
          Learn more
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Link>
    </SectionReveal>
  )
}
