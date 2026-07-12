import type { CalcResult } from './math'
import * as math from './math'

export interface CalcField {
  id: string
  label: string
  min: number
  max: number
  step: number
  defaultValue: number
  suffix?: string
  prefix?: string
}

export interface CalcFAQ {
  question: string
  answer: string
}

export interface CalculatorDef {
  slug: string
  title: string
  tier: 1 | 2 | 3
  description: string
  intro: string
  seoTitle: string
  seoDescription: string
  fields: CalcField[]
  compute: (values: Record<string, number>) => CalcResult
  resultLabels?: { invested?: string; returns?: string; total?: string }
  stub?: boolean
  faqs: CalcFAQ[]
}

export const calculators: CalculatorDef[] = [
  {
    slug: 'sip',
    title: 'SIP Calculator',
    tier: 1,
    description: 'Estimate wealth from a monthly Systematic Investment Plan.',
    intro:
      'A SIP (Systematic Investment Plan) lets you invest a fixed sum every month in mutual funds. Use this calculator to see how your monthly contributions can grow with compounding over time.',
    seoTitle: 'SIP Calculator — Mutual Fund SIP Returns | TejasFinserv',
    seoDescription:
      'Free SIP calculator for mutual fund investors in Vijayawada. Estimate returns from monthly SIP with expected return and tenure.',
    fields: [
      { id: 'monthly', label: 'Monthly Investment', min: 5000, max: 500000, step: 500, defaultValue: 10000, prefix: '₹' },
      { id: 'annualReturn', label: 'Expected Return (p.a.)', min: 1, max: 30, step: 0.5, defaultValue: 12, suffix: '%' },
      { id: 'years', label: 'Investment Period', min: 1, max: 40, step: 1, defaultValue: 10, suffix: 'yrs' },
    ],
    compute: (v) => math.calcSip(v.monthly, v.annualReturn, v.years),
    faqs: [
      { question: 'What is a SIP?', answer: 'A SIP is a disciplined way to invest a fixed amount in mutual funds every month. It helps average purchase cost over time and builds wealth through compounding.' },
      { question: 'How much should I invest monthly to reach ₹1 crore?', answer: 'At 12% annual return, investing about ₹43,000 per month for 10 years or ₹10,000 per month for 20 years can reach ₹1 crore. Use this calculator with your target and horizon.' },
      { question: 'Is SIP better than FD?', answer: 'SIPs in equity mutual funds historically offer higher long-term growth potential than fixed deposits, but carry market risk. FDs provide fixed, guaranteed returns with lower risk.' },
    ],
  },
  {
    slug: 'lumpsum',
    title: 'Lumpsum Calculator',
    tier: 1,
    description: 'Project growth of a one-time mutual fund investment.',
    intro: 'Investing a single amount upfront can compound significantly over years. Enter your lumpsum, expected return, and duration to see the projected value.',
    seoTitle: 'Lumpsum Calculator — One-Time Investment | TejasFinserv',
    seoDescription: 'Calculate lumpsum mutual fund returns. See how a one-time investment grows with compounding in Vijayawada.',
    fields: [
      { id: 'amount', label: 'Investment Amount', min: 1000, max: 10000000, step: 1000, defaultValue: 100000, prefix: '₹' },
      { id: 'annualReturn', label: 'Expected Return (p.a.)', min: 1, max: 30, step: 0.5, defaultValue: 12, suffix: '%' },
      { id: 'years', label: 'Investment Period', min: 1, max: 40, step: 1, defaultValue: 10, suffix: 'yrs' },
    ],
    compute: (v) => math.calcLumpsum(v.amount, v.annualReturn, v.years),
    faqs: [
      { question: 'When should I choose lumpsum over SIP?', answer: 'Lumpsum suits investors with a large amount ready to deploy, often during market corrections. SIPs reduce timing risk by spreading investments over months.' },
      { question: 'What return should I assume?', answer: 'Equity funds have historically delivered 10–14% over long periods, but past performance is not guaranteed. Use conservative assumptions for planning.' },
    ],
  },
  {
    slug: 'step-up-sip',
    title: 'Step-up SIP Calculator',
    tier: 1,
    description: 'SIP with annual increase in contribution amount.',
    intro: 'Increase your SIP every year as your income grows. This calculator shows how stepping up contributions accelerates wealth creation.',
    seoTitle: 'Step-up SIP Calculator | TejasFinserv',
    seoDescription: 'Calculate returns from a step-up SIP with annual increase. Plan growing monthly investments in mutual funds.',
    fields: [
      { id: 'monthly', label: 'Starting Monthly SIP', min: 5000, max: 500000, step: 500, defaultValue: 10000, prefix: '₹' },
      { id: 'stepUpPct', label: 'Annual Step-up', min: 0, max: 50, step: 1, defaultValue: 10, suffix: '%' },
      { id: 'annualReturn', label: 'Expected Return (p.a.)', min: 1, max: 30, step: 0.5, defaultValue: 12, suffix: '%' },
      { id: 'years', label: 'Investment Period', min: 1, max: 40, step: 1, defaultValue: 15, suffix: 'yrs' },
    ],
    compute: (v) => math.calcStepUpSip(v.monthly, v.stepUpPct, v.annualReturn, v.years),
    faqs: [
      { question: 'What is a step-up SIP?', answer: 'A step-up SIP automatically increases your monthly investment by a fixed percentage each year, aligning investments with rising income without manual changes.' },
    ],
  },
  {
    slug: 'goal-sip',
    title: 'Goal / Target SIP Calculator',
    tier: 1,
    description: 'Find the monthly SIP needed to reach a financial goal.',
    intro: 'How much should I invest monthly to reach ₹1 crore? Enter your target amount, expected return, and timeline to find the required monthly SIP.',
    seoTitle: 'Goal SIP Calculator — Target Amount Planner | TejasFinserv',
    seoDescription: 'Calculate monthly SIP required to reach your financial goal. Free goal-based SIP planner for investors in Vijayawada.',
    fields: [
      { id: 'target', label: 'Target Amount', min: 100000, max: 50000000, step: 100000, defaultValue: 10000000, prefix: '₹' },
      { id: 'annualReturn', label: 'Expected Return (p.a.)', min: 1, max: 30, step: 0.5, defaultValue: 12, suffix: '%' },
      { id: 'years', label: 'Time to Goal', min: 1, max: 40, step: 1, defaultValue: 15, suffix: 'yrs' },
    ],
    compute: (v) => math.calcGoalSip(v.target, v.annualReturn, v.years),
    resultLabels: { invested: 'Total Invested', returns: 'Est. Returns', total: 'Goal Amount' },
    faqs: [
      { question: 'How much to invest for ₹1 crore?', answer: 'At 12% return over 15 years, you need roughly ₹20,000 per month. At 10 years, about ₹43,000 per month. Adjust inputs above for your timeline.' },
    ],
  },
  {
    slug: 'swp',
    title: 'SWP Calculator',
    tier: 1,
    description: 'Systematic Withdrawal Plan — corpus longevity estimator.',
    intro: 'A SWP lets you withdraw a fixed amount monthly from your mutual fund corpus while the remainder stays invested. See how long your corpus may last.',
    seoTitle: 'SWP Calculator — Systematic Withdrawal Plan | TejasFinserv',
    seoDescription: 'Calculate SWP withdrawals from mutual fund corpus. Estimate how long your retirement corpus lasts with monthly withdrawals.',
    fields: [
      { id: 'corpus', label: 'Starting Corpus', min: 100000, max: 50000000, step: 100000, defaultValue: 5000000, prefix: '₹' },
      { id: 'monthlyWithdrawal', label: 'Monthly Withdrawal', min: 1000, max: 500000, step: 1000, defaultValue: 40000, prefix: '₹' },
      { id: 'annualReturn', label: 'Expected Return (p.a.)', min: 1, max: 20, step: 0.5, defaultValue: 8, suffix: '%' },
      { id: 'years', label: 'Withdrawal Period', min: 1, max: 40, step: 1, defaultValue: 25, suffix: 'yrs' },
    ],
    compute: (v) => math.calcSwp(v.corpus, v.monthlyWithdrawal, v.annualReturn, v.years),
    resultLabels: { invested: 'Starting Corpus', returns: 'Est. Returns', total: 'Total Value' },
    faqs: [
      { question: 'What is a SWP?', answer: 'A Systematic Withdrawal Plan pays you a fixed sum regularly from your mutual fund holdings. It is popular for retirement income while keeping the balance invested.' },
    ],
  },
  {
    slug: 'retirement',
    title: 'Retirement Calculator',
    tier: 1,
    description: 'Plan retirement corpus and monthly SIP to get there.',
    intro: 'Estimate the inflation-adjusted corpus you need at retirement and the monthly SIP required to build it, based on your current expenses and timeline.',
    seoTitle: 'Retirement Planning Calculator | TejasFinserv Vijayawada',
    seoDescription: 'Free retirement calculator for Vijayawada investors. Estimate corpus needed and monthly SIP for retirement planning.',
    fields: [
      { id: 'currentAge', label: 'Current Age', min: 18, max: 60, step: 1, defaultValue: 30, suffix: 'yrs' },
      { id: 'retirementAge', label: 'Retirement Age', min: 40, max: 70, step: 1, defaultValue: 60, suffix: 'yrs' },
      { id: 'monthlyExpense', label: 'Current Monthly Expense', min: 10000, max: 500000, step: 5000, defaultValue: 50000, prefix: '₹' },
      { id: 'inflation', label: 'Inflation Rate', min: 1, max: 15, step: 0.5, defaultValue: 6, suffix: '%' },
      { id: 'preRetReturn', label: 'Pre-Retirement Return', min: 1, max: 20, step: 0.5, defaultValue: 12, suffix: '%' },
      { id: 'postRetReturn', label: 'Post-Retirement Return', min: 1, max: 15, step: 0.5, defaultValue: 7, suffix: '%' },
      { id: 'lifeExpectancy', label: 'Life Expectancy', min: 65, max: 100, step: 1, defaultValue: 85, suffix: 'yrs' },
    ],
    compute: (v) =>
      math.calcRetirement(
        v.currentAge, v.retirementAge, v.monthlyExpense, v.inflation,
        v.preRetReturn, v.postRetReturn, v.lifeExpectancy
      ),
    resultLabels: { invested: 'Total SIP Invested', returns: 'Est. Returns', total: 'Corpus Required' },
    faqs: [
      { question: 'How much corpus do I need for retirement?', answer: 'A common approach is 25–30 times your annual expenses at retirement, adjusted for inflation. This calculator uses your expenses, inflation, and life expectancy for a personalised estimate.' },
    ],
  },
  {
    slug: 'sip-delay',
    title: 'SIP Delay Calculator',
    tier: 1,
    description: 'Calculate wealth lost by delaying your monthly SIP.',
    intro: 'Delaying your Systematic Investment Plan, even by a few months, can cost you lakhs in long-term compounded wealth. See the cost of delay now.',
    seoTitle: 'SIP Delay Calculator — Cost of Delay Planner | TejasFinserv',
    seoDescription: 'Calculate estimated wealth lost by delaying your mutual fund SIP. Plan investments early with TejasFinserv.',
    fields: [
      { id: 'monthly', label: 'Monthly SIP Amount', min: 5000, max: 500000, step: 500, defaultValue: 10000, prefix: '₹' },
      { id: 'annualReturn', label: 'Expected Return (p.a.)', min: 1, max: 30, step: 0.5, defaultValue: 12, suffix: '%' },
      { id: 'years', label: 'Total Investment Period', min: 1, max: 40, step: 1, defaultValue: 10, suffix: 'yrs' },
      { id: 'delayMonths', label: 'Delay Period', min: 1, max: 120, step: 1, defaultValue: 12, suffix: 'months' },
    ],
    compute: (v) => math.calcSipDelay(v.monthly, v.annualReturn, v.years, v.delayMonths),
    resultLabels: { invested: 'Investment (Start Today)', returns: 'Est. Returns (Start Today)', total: 'Future Value (Start Today)' },
    faqs: [
      { question: 'What is the cost of delaying a SIP?', answer: 'When you delay starting a SIP, you lose the compounding benefit on your earliest contributions. Over 10–20 years, even a 1-year delay can reduce your final corpus by lakhs of rupees.' },
    ],
  },
  {
    slug: 'lumpsum-vs-sip',
    title: 'Lumpsum vs SIP',
    tier: 2,
    description: 'Compare outcomes for the same total amount invested.',
    intro: 'Should you invest monthly via SIP or deploy the full amount as lumpsum? Compare projected outcomes when the same total sum is invested.',
    seoTitle: 'Lumpsum vs SIP Comparison Calculator | TejasFinserv',
    seoDescription: 'Compare lumpsum and SIP returns for the same investment amount. Make informed mutual fund investment decisions.',
    fields: [
      { id: 'monthly', label: 'Monthly SIP Amount', min: 5000, max: 100000, step: 500, defaultValue: 10000, prefix: '₹' },
      { id: 'annualReturn', label: 'Expected Return (p.a.)', min: 1, max: 30, step: 0.5, defaultValue: 12, suffix: '%' },
      { id: 'years', label: 'Investment Period', min: 1, max: 30, step: 1, defaultValue: 10, suffix: 'yrs' },
    ],
    compute: (v) => math.calcLumpsumVsSip(v.monthly, v.annualReturn, v.years),
    resultLabels: { invested: 'Total Invested', returns: 'SIP Returns', total: 'SIP Value' },
    faqs: [
      { question: 'Is SIP better than lumpsum?', answer: 'SIP reduces timing risk through rupee-cost averaging. Lumpsum can outperform in rising markets but underperforms if invested at peaks. Both have merit depending on market conditions.' },
    ],
  },
  {
    slug: 'cagr',
    title: 'CAGR Calculator',
    tier: 2,
    description: 'Compound Annual Growth Rate between two values.',
    intro: 'CAGR shows the smoothed annual growth rate of an investment between a starting and ending value over a given period.',
    seoTitle: 'CAGR Calculator — Investment Growth Rate | TejasFinserv',
    seoDescription: 'Calculate Compound Annual Growth Rate (CAGR) for mutual fund and investment returns.',
    fields: [
      { id: 'begin', label: 'Beginning Value', min: 1000, max: 10000000, step: 1000, defaultValue: 100000, prefix: '₹' },
      { id: 'end', label: 'Ending Value', min: 1000, max: 50000000, step: 1000, defaultValue: 310585, prefix: '₹' },
      { id: 'years', label: 'Period', min: 1, max: 40, step: 1, defaultValue: 10, suffix: 'yrs' },
    ],
    compute: (v) => math.calcCagr(v.begin, v.end, v.years),
    resultLabels: { invested: 'Beginning Value', returns: 'CAGR', total: 'Ending Value' },
    faqs: [
      { question: 'What is CAGR?', answer: 'CAGR (Compound Annual Growth Rate) is the mean annual growth rate of an investment over a specified period, assuming profits are reinvested. Formula: (End/Begin)^(1/years) − 1.' },
    ],
  },
  {
    slug: 'inflation',
    title: 'Inflation Calculator',
    tier: 2,
    description: 'Future cost of today\'s expenses.',
    intro: 'Inflation erodes purchasing power. See what today\'s expense will cost in future years at an assumed inflation rate.',
    seoTitle: 'Inflation Calculator — Future Cost Estimator | TejasFinserv',
    seoDescription: 'Calculate future cost of expenses with inflation. Plan financial goals with inflation-adjusted targets.',
    fields: [
      { id: 'presentCost', label: 'Present Cost', min: 1000, max: 10000000, step: 1000, defaultValue: 500000, prefix: '₹' },
      { id: 'inflation', label: 'Inflation Rate', min: 1, max: 15, step: 0.5, defaultValue: 6, suffix: '%' },
      { id: 'years', label: 'Years from Now', min: 1, max: 40, step: 1, defaultValue: 15, suffix: 'yrs' },
    ],
    compute: (v) => math.calcInflation(v.presentCost, v.inflation, v.years),
    resultLabels: { invested: 'Present Cost', returns: 'Inflation Impact', total: 'Future Cost' },
    faqs: [
      { question: 'Why factor inflation in financial planning?', answer: 'Goals like education and retirement cost more in future rupees. Planning with inflation-adjusted targets ensures your corpus is adequate when you need it.' },
    ],
  },
  {
    slug: 'child-education',
    title: 'Child Education Planner',
    tier: 2,
    description: 'Education goal with inflation-adjusted target SIP.',
    intro: 'Plan for your child\'s higher education by estimating future costs with inflation and the monthly SIP needed to reach that goal.',
    seoTitle: 'Child Education Planner — Goal SIP Calculator | TejasFinserv',
    seoDescription: 'Plan child education costs with inflation. Calculate monthly SIP needed for education goals in India.',
    fields: [
      { id: 'currentCost', label: 'Current Education Cost', min: 100000, max: 10000000, step: 50000, defaultValue: 2000000, prefix: '₹' },
      { id: 'inflation', label: 'Education Inflation', min: 1, max: 15, step: 0.5, defaultValue: 8, suffix: '%' },
      { id: 'years', label: 'Years Until Needed', min: 1, max: 25, step: 1, defaultValue: 12, suffix: 'yrs' },
      { id: 'annualReturn', label: 'Expected Return (p.a.)', min: 1, max: 20, step: 0.5, defaultValue: 12, suffix: '%' },
    ],
    compute: (v) => math.calcChildEducation(v.currentCost, v.inflation, v.years, v.annualReturn),
    resultLabels: { invested: 'Total SIP Invested', returns: 'Est. Returns', total: 'Future Education Cost' },
    faqs: [
      { question: 'How to plan for child education?', answer: 'Estimate current course fees, apply education inflation (often 8–10%), and start a goal-based SIP early. Equity-oriented funds suit long horizons of 10+ years.' },
    ],
  },
  {
    slug: 'fd',
    title: 'FD Calculator',
    tier: 2,
    description: 'Fixed deposit maturity with quarterly compounding.',
    intro: 'Calculate maturity value of a fixed deposit with compound interest. Compare FD returns against inflation and mutual fund alternatives.',
    seoTitle: 'FD Calculator — Fixed Deposit Returns | TejasFinserv',
    seoDescription: 'Calculate fixed deposit maturity amount with compound interest. Compare FD vs mutual fund returns.',
    fields: [
      { id: 'principal', label: 'Deposit Amount', min: 1000, max: 10000000, step: 1000, defaultValue: 500000, prefix: '₹' },
      { id: 'annualRate', label: 'Interest Rate (p.a.)', min: 1, max: 12, step: 0.1, defaultValue: 7, suffix: '%' },
      { id: 'years', label: 'Tenure', min: 1, max: 10, step: 1, defaultValue: 5, suffix: 'yrs' },
    ],
    compute: (v) => math.calcFd(v.principal, v.annualRate, v.years),
    faqs: [
      { question: 'Is FD better than mutual funds?', answer: 'FDs offer guaranteed returns suitable for short-term safety. Equity mutual funds target higher long-term growth but carry market risk. Diversification across both is common.' },
    ],
  },
  {
    slug: 'rd',
    title: 'RD Calculator',
    tier: 2,
    description: 'Recurring deposit maturity calculator.',
    intro: 'Estimate the maturity value of a monthly recurring deposit at your bank\'s interest rate.',
    seoTitle: 'RD Calculator — Recurring Deposit Returns | TejasFinserv',
    seoDescription: 'Calculate recurring deposit maturity value. Plan monthly savings with RD return estimates.',
    fields: [
      { id: 'monthly', label: 'Monthly Deposit', min: 500, max: 100000, step: 500, defaultValue: 5000, prefix: '₹' },
      { id: 'annualRate', label: 'Interest Rate (p.a.)', min: 1, max: 12, step: 0.1, defaultValue: 6.5, suffix: '%' },
      { id: 'years', label: 'Tenure', min: 1, max: 10, step: 1, defaultValue: 5, suffix: 'yrs' },
    ],
    compute: (v) => math.calcRd(v.monthly, v.annualRate, v.years),
    faqs: [
      { question: 'What is an RD?', answer: 'A Recurring Deposit requires a fixed monthly deposit for a set tenure. Interest is compounded quarterly, making it a disciplined savings tool.' },
    ],
  },
  {
    slug: 'ppf',
    title: 'PPF Calculator',
    tier: 2,
    description: 'Public Provident Fund 15-year projection.',
    intro: 'PPF is a government-backed long-term savings scheme with tax benefits. Project your 15-year PPF corpus at the current interest rate.',
    seoTitle: 'PPF Calculator — Public Provident Fund | TejasFinserv',
    seoDescription: 'Calculate PPF maturity value over 15 years. Compare PPF returns with ELSS and mutual funds.',
    fields: [
      { id: 'annual', label: 'Annual Contribution', min: 500, max: 150000, step: 500, defaultValue: 150000, prefix: '₹' },
      { id: 'annualRate', label: 'Interest Rate (p.a.)', min: 1, max: 10, step: 0.1, defaultValue: 7.1, suffix: '%' },
      { id: 'years', label: 'Tenure', min: 15, max: 15, step: 1, defaultValue: 15, suffix: 'yrs' },
    ],
    compute: (v) => math.calcPpf(v.annual, v.annualRate, v.years),
    faqs: [
      { question: 'What is PPF lock-in?', answer: 'PPF has a 15-year lock-in with partial withdrawal allowed from year 7. It offers EEE tax status — exempt at investment, accrual, and withdrawal.' },
    ],
  },
  {
    slug: 'elss',
    title: 'ELSS / 80C Calculator',
    tier: 3,
    description: 'Tax-saving mutual fund with Section 80C benefit.',
    intro: 'ELSS funds offer tax deduction under Section 80C with a 3-year lock-in. Estimate corpus and approximate tax savings.',
    seoTitle: 'ELSS Tax Saving Calculator — Section 80C | TejasFinserv',
    seoDescription: 'Calculate ELSS returns and tax savings under Section 80C. Plan tax-efficient mutual fund investments.',
    stub: true,
    fields: [
      { id: 'annual', label: 'Annual Investment', min: 10000, max: 150000, step: 5000, defaultValue: 150000, prefix: '₹' },
      { id: 'annualReturn', label: 'Expected Return (p.a.)', min: 1, max: 20, step: 0.5, defaultValue: 12, suffix: '%' },
      { id: 'years', label: 'Investment Period', min: 3, max: 20, step: 1, defaultValue: 5, suffix: 'yrs' },
    ],
    compute: (v) => math.calcElss(v.annual, v.annualReturn, v.years),
    faqs: [
      { question: 'What is ELSS lock-in?', answer: 'ELSS (Equity Linked Savings Scheme) has a mandatory 3-year lock-in — the shortest among Section 80C options. Investments up to ₹1.5 lakh per year qualify for deduction.' },
    ],
  },
  {
    slug: 'nps',
    title: 'NPS Calculator',
    tier: 3,
    description: 'National Pension System corpus estimator.',
    intro: 'Estimate your NPS corpus from monthly contributions. NPS offers additional tax benefit under Section 80CCD(1B).',
    seoTitle: 'NPS Calculator — National Pension System | TejasFinserv',
    seoDescription: 'Calculate NPS corpus from monthly contributions. Plan retirement with National Pension System.',
    stub: true,
    fields: [
      { id: 'monthly', label: 'Monthly Contribution', min: 500, max: 50000, step: 500, defaultValue: 5000, prefix: '₹' },
      { id: 'annualReturn', label: 'Expected Return (p.a.)', min: 1, max: 15, step: 0.5, defaultValue: 10, suffix: '%' },
      { id: 'years', label: 'Contribution Period', min: 5, max: 35, step: 1, defaultValue: 25, suffix: 'yrs' },
    ],
    compute: (v) => math.calcNps(v.monthly, v.annualReturn, v.years),
    faqs: [
      { question: 'What is NPS?', answer: 'The National Pension System is a government-sponsored retirement scheme. It offers tax benefits and market-linked returns through equity and debt allocation.' },
    ],
  },
  {
    slug: 'sukanya-samriddhi',
    title: 'Sukanya Samriddhi Calculator',
    tier: 3,
    description: 'Girl child savings scheme maturity estimator.',
    intro: 'Sukanya Samriddhi Yojana is a government scheme for girl children with attractive interest rates and tax benefits.',
    seoTitle: 'Sukanya Samriddhi Calculator | TejasFinserv',
    seoDescription: 'Calculate Sukanya Samriddhi Yojana maturity value. Plan girl child education and marriage goals.',
    stub: true,
    fields: [
      { id: 'annual', label: 'Annual Deposit', min: 250, max: 150000, step: 250, defaultValue: 50000, prefix: '₹' },
      { id: 'annualRate', label: 'Interest Rate (p.a.)', min: 1, max: 10, step: 0.1, defaultValue: 8.2, suffix: '%' },
      { id: 'years', label: 'Deposit Period', min: 15, max: 15, step: 1, defaultValue: 15, suffix: 'yrs' },
    ],
    compute: (v) => math.calcSukanya(v.annual, v.annualRate, v.years),
    faqs: [
      { question: 'Who can open Sukanya Samriddhi?', answer: 'Parents or guardians can open an SSY account for a girl child below 10 years. Deposits can be made for 15 years; the account matures after 21 years from opening.' },
    ],
  },
  {
    slug: 'income-tax',
    title: 'Income Tax Calculator',
    tier: 1,
    description: 'Old vs new tax regime comparison (FY 2025-26).',
    intro: 'Compare estimated income tax under India\'s old and new tax regimes. Slabs are configurable and should be updated each financial year.',
    seoTitle: 'Income Tax Calculator — Old vs New Regime | TejasFinserv',
    seoDescription: 'Compare old and new tax regime liability for FY 2025-26. Estimate income tax with updated slabs.',
    fields: [
      { id: 'annualIncome', label: 'Annual Income', min: 250000, max: 10000000, step: 50000, defaultValue: 1200000, prefix: '₹' },
      { id: 'regime', label: 'Regime (0=New, 1=Old)', min: 0, max: 1, step: 1, defaultValue: 0 },
    ],
    compute: (v) => math.calcIncomeTax(v.annualIncome, v.regime === 1 ? 'old' : 'new'),
    resultLabels: { invested: 'Gross Income', returns: 'Tax Payable', total: 'Net Income' },
    faqs: [
      { question: 'Which tax regime is better?', answer: 'The new regime offers lower rates but fewer deductions. The old regime suits those with significant 80C, HRA, and home loan deductions. Compare both with this calculator.' },
    ],
  },
]

export function getCalculator(slug: string): CalculatorDef | undefined {
  return calculators.find((c) => c.slug === slug)
}

export const tier1Calculators = calculators.filter((c) => c.tier === 1)
export const tier2Calculators = calculators.filter((c) => c.tier === 2)
export const tier3Calculators = calculators.filter((c) => c.tier === 3)
