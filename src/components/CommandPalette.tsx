import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { siteConfig } from '../lib/siteConfig'

interface CommandItem {
  id: string
  title: string
  category: string
  url: string
  external?: boolean
  icon: string
}

const COMMAND_ITEMS: CommandItem[] = [
  { id: '1', title: 'Home', category: 'Navigation', url: '/', icon: '🏠' },
  { id: '2', title: 'About TejasFinserv & Phani Rompicharla', category: 'Navigation', url: '/about', icon: '📄' },
  { id: '3', title: 'Wealth & Mutual Fund Services', category: 'Navigation', url: '/services', icon: '💼' },
  { id: '4', title: 'Mutual Fund Distribution & SIP Guide', category: 'Advisory', url: '/mutual-funds', icon: '📊' },
  { id: '5', title: 'Comprehensive Financial Planning', category: 'Advisory', url: '/financial-planning', icon: '🎯' },
  { id: '6', title: 'Pure Term Life Insurance Planner', category: 'Insurance', url: '/term-insurance', icon: '🛡️' },
  { id: '7', title: 'Smart Family Health Insurance Shield', category: 'Insurance', url: '/health-insurance', icon: '🏥' },
  { id: '8', title: 'All Financial Calculators Hub', category: 'Tools', url: '/calculators', icon: '🧮' },
  { id: '9', title: 'SIP Investment Calculator', category: 'Tools', url: '/calculators/sip', icon: '📈' },
  { id: '10', title: 'Step-Up SIP Calculator', category: 'Tools', url: '/calculators/step-up-sip', icon: '🚀' },
  { id: '11', title: 'Retirement Corpus Planner', category: 'Tools', url: '/calculators/retirement', icon: '🏖️' },
  { id: '12', title: 'Child Higher Education Goal Estimator', category: 'Tools', url: '/calculators/education', icon: '🎓' },
  { id: '13', title: 'Lump-Sum Investment Calculator', category: 'Tools', url: '/calculators/lumpsum', icon: '💰' },
  { id: '14', title: 'Insurance Needs & HLV Check Tool', category: 'Tools', url: '/insurance', icon: '⚖️' },
  { id: '15', title: 'Frequently Asked Questions (FAQ)', category: 'Support', url: '/faq', icon: '❓' },
  { id: '16', title: 'Chat Directly on WhatsApp', category: 'Contact', url: siteConfig.contact.whatsappUrl, external: true, icon: '💬' },
  { id: '17', title: 'Contact Phani Rompicharla (Vijayawada Office)', category: 'Contact', url: '/contact', icon: '📞' },
  { id: '18', title: 'Legal, Privacy & AMFI ARN Disclaimers', category: 'Compliance', url: '/legal', icon: '📜' },
]

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    const handleCustomOpen = () => setIsOpen(true)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-command-palette', handleCustomOpen)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-command-palette', handleCustomOpen)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const filteredItems = COMMAND_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleSelect = (item: CommandItem) => {
    setIsOpen(false)
    if (item.external) {
      window.open(item.url, '_blank', 'noopener,noreferrer')
    } else {
      navigate(item.url)
    }
  }

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1))
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault()
      handleSelect(filteredItems[selectedIndex])
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-navy/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl bg-ivory rounded-2xl border border-line shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onKeyDown={handleListKeyDown}
      >
        <div className="p-4 border-b border-line flex items-center gap-3 bg-cream">
          <span className="text-xl">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search calculators, term insurance, AMFI ARN, contact..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-navy font-body text-base sm:text-lg placeholder:text-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-xs font-semibold bg-line/50 text-muted px-2.5 py-1 rounded-lg hover:bg-line transition-colors font-mono"
          >
            ESC
          </button>
        </div>

        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-line/30 flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-muted text-sm font-body">
              No results found for <span className="font-semibold text-navy">"{query}"</span>. Try searching for "SIP", "Term", or "Contact".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-navy text-ivory shadow-md' : 'hover:bg-cream text-ink'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div className="truncate">
                      <div className={`text-sm font-semibold truncate ${isSelected ? 'text-ivory' : 'text-navy'}`}>
                        {item.title}
                      </div>
                      <div className={`text-xs ${isSelected ? 'text-brass' : 'text-muted'}`}>
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded shrink-0 ${isSelected ? 'bg-brass text-navy font-bold' : 'bg-cream text-muted'}`}>
                    {item.external ? '↗ 0pen' : 'Jump →'}
                  </span>
                </button>
              )
            })
          )}
        </div>

        <div className="p-3 bg-cream border-t border-line text-[11px] text-muted flex items-center justify-between font-mono">
          <span>⚡ Tip: Use ↑↓ arrows to navigate, ENTER to select</span>
          <span className="text-navy font-semibold">AMFI ARN-251896</span>
        </div>
      </div>
    </div>
  )
}
