import { siteConfig } from '../lib/siteConfig'
import { Button } from './Button'

export function StickyInvestCTA() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-ivory/95 p-3 backdrop-blur-md md:hidden">
      <Button href={siteConfig.onboardingUrl} external className="w-full">
        Invest Now
      </Button>
    </div>
  )
}
