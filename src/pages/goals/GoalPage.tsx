import { Link, useParams } from 'react-router-dom'
import { AnswerCallout } from '../../components/AnswerCallout'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Button } from '../../components/Button'
import { FAQSection } from '../../components/FAQSection'
import { Seo } from '../../components/Seo'
import { siteConfig } from '../../lib/siteConfig'

const goalContent: Record<string, {
  title: string
  h1: string
  description: string
  intro: string
  calculator: string
  faqs: { question: string; answer: string }[]
}> = {
  retirement: {
    title: 'Retirement Planning Vijayawada',
    h1: 'Plan your retirement with confidence.',
    description: 'Retirement planning for Vijayawada professionals. Estimate corpus, start SIP, and secure your golden years.',
    intro: 'Retirement planning ensures you maintain your lifestyle after you stop earning. Factor in inflation, healthcare costs, and a 25+ year post-retirement horizon when building your corpus.',
    calculator: '/calculators/retirement',
    faqs: [
      { question: 'How much corpus do I need for retirement?', answer: 'A common approach is 25–30 times your annual expenses at retirement, adjusted for inflation. Use our Retirement Calculator for a personalised estimate based on your current age and expenses.' },
    ],
  },
  'child-education': {
    title: 'Child Education Planning',
    h1: 'Fund your child\'s education goals.',
    description: 'Plan for child education and marriage with inflation-adjusted goal planning and SIP calculators.',
    intro: 'Education costs rise faster than general inflation. Starting a goal-based SIP early — even ₹5,000 per month — can build a significant corpus over 12–15 years.',
    calculator: '/calculators/child-education',
    faqs: [
      { question: 'When should I start saving for child education?', answer: 'The earlier, the better. Starting when your child is born gives 15+ years for equity compounding. Even 10 years is valuable — use our Child Education Planner to see required monthly SIP.' },
    ],
  },
  'tax-saving': {
    title: 'Tax Saving Investments — ELSS & 80C',
    h1: 'Save tax while building wealth.',
    description: 'Tax-saving mutual funds (ELSS) under Section 80C. 3-year lock-in with equity growth potential.',
    intro: 'Section 80C allows deduction up to ₹1.5 lakh per year. ELSS mutual funds offer the shortest lock-in (3 years) among popular 80C options, with equity-linked growth potential.',
    calculator: '/calculators/elss',
    faqs: [
      { question: 'What is ELSS lock-in?', answer: 'ELSS funds have a mandatory 3-year lock-in from the date of each investment. This is the shortest lock-in among major Section 80C instruments like PPF (15 years) and tax-saving FD (5 years).' },
    ],
  },
  'wealth-creation': {
    title: 'Wealth Creation through Mutual Funds',
    h1: 'Build long-term wealth with discipline.',
    description: 'Wealth creation strategies with SIP investing. Start from ₹500/month with an AMFI-registered distributor.',
    intro: 'Wealth creation is a long-term endeavour. Consistent SIP investing in diversified equity mutual funds, combined with annual step-ups as income grows, is one of the most accessible paths for Indian investors.',
    calculator: '/calculators/sip',
    faqs: [
      { question: 'How much should I invest monthly for wealth creation?', answer: 'Start with what you can afford consistently — even ₹1,000–5,000 per month. Increase annually via step-up SIP. Use our SIP Calculator to project growth at different return assumptions.' },
    ],
  },
}

export function GoalPage() {
  const { slug } = useParams<{ slug: string }>()
  const goal = slug ? goalContent[slug] : undefined

  if (!goal) {
    return (
      <div className="container-main section-padding text-center">
        <h1 className="font-display text-2xl text-navy">Goal page not found</h1>
        <Link to="/" className="mt-4 text-brass">← Home</Link>
      </div>
    )
  }

  const path = `/goals/${slug}`

  return (
    <>
      <Seo title={`${goal.title} | TejasFinserv`} description={goal.description} path={path} />
      <section className="grain-overlay bg-navy pt-32 pb-16 text-ivory">
        <div className="container-main">
          <Breadcrumbs variant="light" items={[{ name: 'Home', path: '/' }, { name: goal.title }]} />
          <h1 className="font-display font-semibold">{goal.h1}</h1>
        </div>
      </section>
      <section className="section-padding bg-ivory">
        <div className="container-main max-w-3xl">
          <AnswerCallout>{goal.intro}</AnswerCallout>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button to={goal.calculator}>Use Calculator</Button>
            <Button href={siteConfig.onboardingUrl} external>Start Investing</Button>
          </div>
          <div className="mt-14">
            <FAQSection faqs={goal.faqs} />
          </div>
        </div>
      </section>
    </>
  )
}
