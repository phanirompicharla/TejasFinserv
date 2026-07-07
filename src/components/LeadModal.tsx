import { useState, useEffect, type FormEvent } from 'react'
import { Button } from './Button'

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMessage: string
  title?: string
  subtitle?: string
}

export function LeadModal({
  isOpen,
  onClose,
  defaultMessage,
  title = 'Connect on WhatsApp',
  subtitle = 'Please share your contact details to save your request and start the WhatsApp chat.'
}: LeadModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(defaultMessage)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [hasSavedData, setHasSavedData] = useState(false)

  // Reset states when modal is opened/closed or message changes
  useEffect(() => {
    if (isOpen) {
      const savedName = localStorage.getItem('tejas_user_name') || ''
      const savedPhone = localStorage.getItem('tejas_user_phone') || ''
      const savedEmail = localStorage.getItem('tejas_user_email') || ''
      
      setName(savedName)
      setPhone(savedPhone)
      setEmail(savedEmail)
      setHasSavedData(Boolean(savedPhone || savedEmail))
      
      setMessage(defaultMessage)
      setStatus('idle')
      setErrors({})
    }
  }, [isOpen, defaultMessage])

  if (!isOpen) return null

  const validate = () => {
    const errs: { [key: string]: string } = {}
    if (!name.trim()) errs.name = 'Full Name is required'
    if (!phone.trim()) errs.phone = 'WhatsApp Number is required'
    if (!email.trim()) {
      errs.email = 'Email Address is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Invalid email address'
    }
    if (!message.trim()) errs.message = 'Message cannot be empty'
    return errs
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setStatus('submitting')

    try {
      localStorage.setItem('tejas_user_name', name.trim())
      localStorage.setItem('tejas_user_phone', phone.trim())
      localStorage.setItem('tejas_user_email', email.trim())
    } catch (e) {
      console.warn('Could not access localStorage', e)
    }

    const formData = { name, email, phone, message }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('API unavailable')
      }
      
      setStatus('success')
    } catch (err) {
      console.warn('DB Save fallback to mailto/direct launch', err)
      setStatus('success')
    }

    // Launch WhatsApp
    const encodedMsg = encodeURIComponent(message)
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=919490716662&text=${encodedMsg}&type=phone_number&app_absent=0`
    
    // Slight delay to allow UI to register success state before redirect/close
    setTimeout(() => {
      window.open(whatsappUrl, '_blank')
      // Reset form on success
      setName('')
      setPhone('')
      setEmail('')
      onClose()
    }, 600)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
    >
      <div className="w-full max-w-lg bg-ivory rounded-3xl border border-line shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 relative flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-muted hover:text-navy transition-colors w-8 h-8 rounded-full border border-line flex items-center justify-center bg-cream/30 hover:bg-cream"
          aria-label="Close modal"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-6">
          <h2 className="font-display text-2xl font-bold text-navy leading-tight">{title}</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">{subtitle}</p>
          {hasSavedData && (
            <div className="mt-3 bg-brass/15 border border-brass/40 rounded-xl p-3 flex items-center gap-2.5 text-xs font-semibold text-navy animate-fade-in shadow-sm">
              <span className="text-base">⚡</span>
              <span>Welcome back! We've pre-filled your contact details for 1-click consultation.</span>
            </div>
          )}
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Name Field */}
          <div>
            <label htmlFor="modal-name" className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="modal-name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
              }}
              placeholder="e.g. Rahul Sharma"
              className={`w-full rounded-xl border bg-cream/40 px-4 py-3 text-sm text-ink transition-all focus:outline-none focus:ring-2 focus:ring-brass/30 ${
                errors.name ? 'border-red-400 focus:ring-red-200' : 'border-line focus:border-brass'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Contact & Email Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Phone Field */}
            <div>
              <label htmlFor="modal-phone" className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <input
                id="modal-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }))
                }}
                placeholder="e.g. 9876543210"
                className={`w-full rounded-xl border bg-cream/40 px-4 py-3 text-sm text-ink transition-all focus:outline-none focus:ring-2 focus:ring-brass/30 ${
                  errors.phone ? 'border-red-400 focus:ring-red-200' : 'border-line focus:border-brass'
                }`}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="modal-email" className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="modal-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
                }}
                placeholder="e.g. rahul@gmail.com"
                className={`w-full rounded-xl border bg-cream/40 px-4 py-3 text-sm text-ink transition-all focus:outline-none focus:ring-2 focus:ring-brass/30 ${
                  errors.email ? 'border-red-400 focus:ring-red-200' : 'border-line focus:border-brass'
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>

          {/* Message Field (pre-populated with calculation) */}
          <div>
            <label htmlFor="modal-message" className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Customized Message (Sent to WhatsApp) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="modal-message"
              required
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                if (errors.message) setErrors(prev => ({ ...prev, message: '' }))
              }}
              className={`w-full rounded-xl border bg-cream/40 px-4 py-3 text-sm text-ink transition-all focus:outline-none focus:ring-2 focus:ring-brass/30 font-mono text-[13px] leading-relaxed resize-none ${
                errors.message ? 'border-red-400 focus:ring-red-200' : 'border-line focus:border-brass'
              }`}
            />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <Button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full justify-center shadow-lg !bg-emerald-500 hover:!bg-emerald-600 !text-white py-3.5 text-base transition-transform active:scale-[0.99]"
            >
              {status === 'submitting' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Lead...
                </span>
              ) : status === 'success' ? (
                '✓ Directing to WhatsApp...'
              ) : (
                '💬 Send to WhatsApp & Connect →'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
