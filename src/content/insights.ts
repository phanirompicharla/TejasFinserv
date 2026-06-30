export interface InsightPost {
  slug: string
  title: string
  description: string
  datePublished: string
  author: string
  readTime: string
  tags: string[]
  content: string[]
}

export const insights: InsightPost[] = [
  {
    slug: 'what-is-sip',
    title: 'What is a SIP? A Beginner\'s Guide to Systematic Investment',
    description: 'Learn how SIPs work, why they suit Indian investors, and how to start your first mutual fund SIP in Vijayawada.',
    datePublished: '2025-01-15',
    author: 'Phani Rompicharla',
    readTime: '5 min',
    tags: ['SIP', 'Mutual Funds', 'Beginners'],
    content: [
      'A Systematic Investment Plan (SIP) is a method of investing a fixed sum regularly — usually monthly — into a mutual fund scheme. Instead of timing the market with a lumpsum, you invest consistently regardless of market conditions.',
      'SIPs harness rupee-cost averaging: when markets fall, your fixed amount buys more units; when markets rise, it buys fewer. Over time, this smooths out volatility and builds discipline.',
      'To start a SIP with TejasFinserv, open your account through our online onboarding platform, complete KYC, choose a fund matching your risk profile, and set your monthly amount. Minimum SIPs often start at ₹500.',
      'As of January 2025, SIP inflows in India continue to grow, reflecting rising retail participation. However, mutual fund investments are subject to market risks — returns are not guaranteed.',
    ],
  },
  {
    slug: 'elss-tax-saving-guide',
    title: 'ELSS vs PPF: Tax-Saving Options Under Section 80C',
    description: 'Compare ELSS mutual funds and PPF for tax saving. Understand lock-in periods, returns, and which suits your goals.',
    datePublished: '2025-02-01',
    author: 'Phani Rompicharla',
    readTime: '6 min',
    tags: ['ELSS', 'Tax Saving', '80C'],
    content: [
      'Section 80C of the Income Tax Act allows deductions up to ₹1.5 lakh per year. ELSS (Equity Linked Savings Scheme) and PPF (Public Provident Fund) are two popular options with very different risk-return profiles.',
      'ELSS has the shortest lock-in at 3 years and invests primarily in equities, offering higher growth potential with market risk. PPF has a 15-year lock-in with government-backed interest (~7.1% as of recent rates) and EEE tax status.',
      'For young investors with a 5+ year horizon, ELSS can complement long-term wealth goals while saving tax. For conservative investors prioritising capital safety, PPF remains attractive despite lower returns.',
    ],
  },
  {
    slug: 'goal-based-financial-planning',
    title: 'Goal-Based Financial Planning: Why It Matters',
    description: 'How goal-based planning helps you invest with purpose — retirement, education, and wealth creation strategies for Indian families.',
    datePublished: '2025-02-20',
    author: 'Phani Rompicharla',
    readTime: '5 min',
    tags: ['Financial Planning', 'Goals'],
    content: [
      'Goal-based financial planning aligns every investment decision with a specific life milestone — retirement at 60, a child\'s engineering degree, or a ₹1 crore corpus by 45.',
      'Without goals, investors often chase returns randomly or exit during market downturns. Goals provide clarity on asset allocation, time horizon, and how much to invest monthly.',
      'Start by listing goals with amounts and timelines. Apply inflation to future costs. Use our Goal SIP and Retirement calculators to estimate required monthly investments, then select appropriate mutual fund categories.',
    ],
  },
  {
    slug: 'how-to-choose-mutual-funds',
    title: 'How to Choose the Right Mutual Fund',
    description: 'A practical framework for selecting mutual funds based on risk profile, time horizon, and fund category — not just past returns.',
    datePublished: '2025-03-05',
    author: 'Phani Rompicharla',
    readTime: '7 min',
    tags: ['Mutual Funds', 'Fund Selection'],
    content: [
      'Choosing a mutual fund should begin with your risk profile and investment horizon, not last year\'s top performer. Equity funds suit 5+ year goals; debt funds suit shorter, stability-focused needs.',
      'Evaluate fund house track record, expense ratio, fund manager tenure, and consistency of returns across market cycles — not just 1-year rankings. Read the Scheme Information Document (SID) and Key Information Memorandum (KIM).',
      'A registered mutual fund distributor like TejasFinserv (ARN-251896) helps match schemes to your profile across 40+ AMCs without bias toward a single fund house.',
    ],
  },
  {
    slug: 'understanding-market-risk',
    title: 'Understanding Market Risk in Mutual Funds',
    description: 'What "mutual funds are subject to market risks" really means — and how to invest with eyes open.',
    datePublished: '2025-03-18',
    author: 'Phani Rompicharla',
    readTime: '4 min',
    tags: ['Risk', 'Education'],
    content: [
      'Every mutual fund advertisement carries the disclaimer: "Mutual Fund investments are subject to market risks, read all scheme related documents carefully." This is not boilerplate — equity funds can and do decline in the short term.',
      'Market risk means the value of your investment fluctuates with stock and bond market movements. Over 10+ year periods, diversified equity funds have historically delivered positive returns, but past performance is not indicative of future returns.',
      'Mitigate risk through diversification across asset classes, consistent SIP investing, adequate emergency funds, and aligning fund category to your time horizon. Consult a registered distributor for personalised guidance.',
    ],
  },
  {
    slug: 'retirement-planning-vijayawada',
    title: 'Retirement Planning for Vijayawada Professionals',
    description: 'Practical retirement planning steps for salaried professionals in Vijayawada and Andhra Pradesh — corpus targets, SIP amounts, and pension options.',
    datePublished: '2025-04-02',
    author: 'Phani Rompicharla',
    readTime: '6 min',
    tags: ['Retirement', 'Vijayawada'],
    content: [
      'Retirement planning starts with estimating your monthly expenses at retirement, adjusted for inflation. A common rule: accumulate 25–30 times your annual expenses at retirement age.',
      'For a 30-year-old in Vijayawada spending ₹50,000 monthly, assuming 6% inflation and retirement at 60, monthly expenses at retirement could exceed ₹2.8 lakh. Building a corpus to sustain 25 years requires early, consistent investing.',
      'Use our Retirement Calculator to estimate your corpus and required SIP. Combine equity mutual funds for growth during accumulation and consider SWP for regular income post-retirement. NPS can supplement with additional tax benefits.',
    ],
  },
]

export function getInsight(slug: string) {
  return insights.find((p) => p.slug === slug)
}
