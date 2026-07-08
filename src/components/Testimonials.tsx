import { useState, useEffect } from 'react'
import { siteConfig } from '../lib/siteConfig'
import { SectionReveal } from './SectionReveal'
import { Button } from './Button'

interface Review {
  name: string;
  quote: string;
  location: string;
}

function TestimonialCard({ t }: { t: Review }) {
  return (
    <blockquote className="testimonial-card">
      <p className="text-muted italic whitespace-pre-wrap line-clamp-5 flex-grow">&ldquo;{t.quote}&rdquo;</p>
      <footer className="mt-6 pt-4 border-t border-line/40 shrink-0">
        <cite className="not-italic font-semibold text-navy block">{t.name}</cite>
        <p className="text-xs text-muted">{t.location}</p>
      </footer>
    </blockquote>
  )
}

function TestimonialCarousel({ reviews }: { reviews: Review[] }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  if (prefersReducedMotion) {
    return (
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((t, i) => (
          <SectionReveal key={`${t.name}-${i}`} delay={i * 80}>
            <TestimonialCard t={t} />
          </SectionReveal>
        ))}
      </div>
    )
  }

  return (
    <SectionReveal delay={100}>
      <div className="testimonial-carousel-container mt-10">
        {/* Fade gradients */}
        <div className="testimonial-carousel-fade-left" />
        <div className="testimonial-carousel-fade-right" />

        {/* Scrolling track: two identical sets for seamless loop */}
        <div className="testimonial-carousel-track">
          <div className="flex shrink-0 gap-6 pr-6">
            {reviews.map((t, i) => (
              <div key={`${t.name}-${i}`} className="testimonial-carousel-slide">
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
          <div className="flex shrink-0 gap-6 pr-6">
            {reviews.map((t, i) => (
              <div key={`${t.name}-dup-${i}`} className="testimonial-carousel-slide">
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  )
}

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([...siteConfig.testimonials])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', city: '', review_text: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const res = await fetch('/api/reviews')
        if (res.ok) {
          const data = await res.json()
          const apiReviews: Review[] = data.map((r: any) => ({
            name: r.name,
            quote: r.review_text,
            location: r.city
          }))
          setReviews([...siteConfig.testimonials, ...apiReviews])
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err)
      }
    }
    fetchApprovedReviews()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setSubmitSuccess(true)
        setTimeout(() => {
          setIsModalOpen(false)
          setSubmitSuccess(false)
          setFormData({ name: '', city: '', review_text: '' })
        }, 3000)
      } else {
        const data = await res.json()
        setErrorMsg(data.error || 'Failed to submit review. Please try again.')
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section-padding bg-ivory relative overflow-hidden">
      <div className="container-main">
        <SectionReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-sm font-semibold tracking-widest text-brass uppercase">
                Client Stories
              </p>
              <h2 className="font-display text-2xl font-semibold text-navy">
                Trusted by investors in Vijayawada
              </h2>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="w-fit">
              Write a Review
            </Button>
          </div>
        </SectionReveal>
        
        <TestimonialCarousel reviews={reviews} />
        
        {siteConfig.reviews.googleUrl && (
          <p className="mt-8 text-center text-sm">
            <a
              href={siteConfig.reviews.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brass link-underline font-semibold"
            >
              Read more on Google Reviews →
            </a>
          </p>
        )}
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
          <div className="bg-ivory rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative animate-fade-in">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-muted hover:text-navy transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="font-display text-2xl font-semibold text-navy mb-2">Share Your Experience</h3>
            <p className="text-sm text-muted mb-6">Your feedback helps us improve and helps others make informed decisions.</p>
            
            {submitSuccess ? (
              <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl text-center border border-emerald-200">
                <svg className="w-12 h-12 text-emerald-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-semibold text-lg">Thank you!</p>
                <p className="text-sm mt-1">Your review has been submitted for approval.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
                    {errorMsg}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass/50"
                    placeholder="e.g. Ravi K."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass/50"
                    placeholder="e.g. Vijayawada"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">Review</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.review_text}
                    onChange={e => setFormData({...formData, review_text: e.target.value})}
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass/50 resize-none"
                    placeholder="Share your experience working with TejasFinserv..."
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center py-3.5">
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
