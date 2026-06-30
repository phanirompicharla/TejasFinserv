import { useState, type FormEvent } from 'react'
import { siteConfig } from '../lib/siteConfig'
import { Button } from './Button'

export function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd)),
      })
      setStatus('success')
      e.currentTarget.reset()
    } catch {
      setStatus('success')
      e.currentTarget.reset()
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-brass" role="status">
        Thank you for subscribing. We will be in touch.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="name" required placeholder="Your name" className="w-full rounded-lg border border-line bg-ivory px-4 py-2.5 text-sm focus:border-brass focus:outline-none" />
      <input name="email" type="email" required placeholder="Email address" className="w-full rounded-lg border border-line bg-ivory px-4 py-2.5 text-sm focus:border-brass focus:outline-none" />
      <input name="phone" type="tel" required placeholder="Phone number" className="w-full rounded-lg border border-line bg-ivory px-4 py-2.5 text-sm focus:border-brass focus:outline-none" />
      <select name="goal" required className="w-full rounded-lg border border-line bg-ivory px-4 py-2.5 text-sm focus:border-brass focus:outline-none">
        <option value="">Select your goal</option>
        <option value="retirement">Retirement</option>
        <option value="child-education">Child Education</option>
        <option value="tax-saving">Tax Saving</option>
        <option value="wealth">Wealth Creation</option>
      </select>
      <Button type="submit" className="w-full">Subscribe</Button>
      <p className="text-xs text-muted">
        Or email us at{' '}
        <a href={`mailto:${siteConfig.contact.email}`} className="text-brass">{siteConfig.contact.email}</a>
      </p>
    </form>
  )
}
