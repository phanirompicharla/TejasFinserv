import { useState, type FormEvent } from 'react'
import { siteConfig } from '../lib/siteConfig'
import { Button } from './Button'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.name.trim()) errors.name = 'Name is required'
  if (!data.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address'
  }
  const cleanPhone = data.phone.replace(/[\s+\-()]/g, '')
  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required'
  } else if (!/^(?:91|0)?[6-9]\d{9}$/.test(cleanPhone)) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)'
  }

  return errors
}

function mailtoFallback(data: FormData) {
  const subject = encodeURIComponent(`Enquiry from ${data.name} — TejasFinserv`)
  const body = encodeURIComponent(
    `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nMessage:\n${data.message}`
  )
  window.location.href = `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`
}

export function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', message: '' })
      } else {
        throw new Error('API unavailable')
      }
    } catch {
      mailtoFallback(form)
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    }
  }

  const inputClass = (field: keyof FormData) =>
    `w-full rounded-lg border bg-cream px-4 py-3 text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-brass/50 ${
      errors[field] ? 'border-red-400' : 'border-line focus:border-brass'
    }`

  if (status === 'success') {
    return (
      <div
        className="rounded-2xl border border-brass/30 bg-cream p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brass/20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12l5 5L19 7"
              stroke="#C2913F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-semibold text-navy">Message Received!</h3>
        <p className="mt-2 text-base text-muted font-medium">
          Thanks! We'll get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-semibold text-brass link-underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-navy">
          Your Full Name <span className="text-brass">*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. Ramesh Kumar"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={inputClass('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          autoComplete="name"
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-navy">
          Email Address <span className="text-brass">*</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="e.g. ramesh@example.com"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={inputClass('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          autoComplete="email"
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-navy">
          Phone Number / WhatsApp <span className="text-brass">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={inputClass('phone')}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          autoComplete="tel"
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-navy">
          How Can We Help You? (Optional)
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="e.g. I want to start a monthly SIP for retirement. Please let me know the required documents."
          value={form.message}
          onChange={(e) => handleChange('message', e.target.value)}
          className={`${inputClass('message')} resize-y`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600" role="alert">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <Button type="submit" disabled={status === 'submitting'} className="w-full sm:w-auto">
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  )
}
