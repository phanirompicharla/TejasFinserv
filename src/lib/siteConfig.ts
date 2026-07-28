export const siteConfig = {
  name: 'TejasFinserv',
  tagline: 'Assistance with Assurance',
  domain: 'tejasfinserv.com',
  baseUrl: 'https://tejasfinserv.com',

  regulatory: {
    arn: 'ARN-251896',
    badgeLabel: 'AMFI Registered · ARN-251896',
    registrationLabel: 'AMFI-registered Mutual Fund Distributor',
    disclaimer:
      'TejasFinserv is an AMFI-registered Mutual Fund Distributor (ARN-251896). Mutual Fund investments are subject to market risks, read all scheme related documents carefully. Past performance is not indicative of future returns.',
    marketRiskNote:
      'Mutual Fund investments are subject to market risks, read all scheme related documents carefully. Past performance is not indicative of future returns.',
  },

  contact: {
    address:
      '23-221, Near Old Water Tank, Yanamalakuduru, Vijayawada – 520007, Andhra Pradesh, India',
    email: 'phani.rompicharla@gmail.com',
    phone: '+91 94907 16662',
    phoneTel: '+919490716662',
    whatsappUrl: 'https://wa.me/919490716662',
    mapsUrl: 'https://maps.app.goo.gl/7saxjnh6xzKCHm8f8',
    mapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d315.3115456919365!2d80.66253927018474!3d16.48729682486066!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35fbd892544077%3A0xbc8ca84ca8f1bb85!2sTEJAS%20FINSERV!5e0!3m2!1sen!2sin!4v1784029080784!5m2!1sen!2sin',
    // TODO: confirm with client
    hours: '[CONFIRM] business hours',
  },

  onboardingUrl:
    'https://flow.assetplus.in/client_onboarding/?advisor=6313983220391d0009f3de64',

  app: {
    onboardingUrl:
      'https://flow.assetplus.in/client_onboarding/?advisor=6313983220391d0009f3de64',
    // TODO: confirm App Store / Play Store listing URLs
    appStoreUrl: undefined as string | undefined,
    playStoreUrl: undefined as string | undefined,
  },

  advisor: {
    name: 'Phani Rompicharla',
    title: 'Founder & Mutual Fund Distributor',
    arn: 'ARN-251896',
    location: 'Vijayawada',
    // TODO: confirm with client
    experience: '[CONFIRM] years',
    bio: 'Phani Rompicharla is the founder of TejasFinserv and an AMFI-registered Mutual Fund Distributor (ARN-251896) based in Vijayawada. He helps individuals and businesses across Andhra Pradesh with mutual fund investments, goal-based financial planning, and insurance advisory.',
  },

  stats: {
    schemes: 6000,
    amcs: 40,
    serviceLines: 3,
  },

  amcPartners: [
    { name: 'SBI Mutual Fund', slug: 'sbi' },
    { name: 'HDFC Mutual Fund', slug: 'hdfc' },
    { name: 'ICICI Prudential', slug: 'icici' },
    { name: 'Axis Mutual Fund', slug: 'axis' },
    { name: 'Nippon India', slug: 'nippon' },
    { name: 'Kotak Mutual Fund', slug: 'kotak' },
    { name: 'Aditya Birla Sun Life', slug: 'absl' },
    { name: 'Mirae Asset', slug: 'mirae' },
    { name: 'UTI Mutual Fund', slug: 'uti' },
    { name: 'DSP Mutual Fund', slug: 'dsp' },
    { name: 'Franklin Templeton', slug: 'franklin' },
    { name: 'Tata Mutual Fund', slug: 'tata' },
  ],

  testimonials: [
    {
      name: 'Sneha E',
      location: 'Vijayawada',
      quote: 'Excellent service at Tejas Finserv! A top-notch financial services firm. I was impressed by their quick turnaround time and attention to detail. They handle documentation and follow-ups very efficiently, making the whole experience hassle-free. 5 stars for their professionalism and customer support.',
    },
    {
      name: 'Sunkara Nagasindhu',
      location: 'Vijayawada',
      quote: 'I am happy to invest in TEJAS FINSERV and the guidance given by Mr. Phani Kishore sir.',
    },
    {
      name: 'Immidi Srikanth',
      location: 'Vijayawada',
      quote: 'I have been investing with TEJAS FINSERV for more than 4 years. I would strongly recommend TEJAS FINSERV to anyone looking to secure their future.',
    },
    {
      name: 'Krishna Chaitanya Bobba',
      location: 'Vijayawada',
      quote: 'Great experience with Mr. Phani Kishore. Clearly explained everything point by point in detail.',
    },
    {
      name: 'Surekha Solasa',
      location: 'Vijayawada',
      quote: 'He explains all funds in detail, responds on time, and frequently monitors the portfolio.',
    },
    {
      name: 'Misra Ravikanth',
      location: 'Vijayawada',
      quote: 'As an Assistant Professor, I appreciate their excellent guidance and support. They are never profit-minded and always strive to help clients, especially during insurance claim settlements. \'Assistance with Assurance\' truly reflects their service. They provide 24×7 guidance, support, motivation, insurance assistance, and financial advice.',
    },
  ],

  reviews: {
    // TODO: confirm Google Business Profile review URL
    googleUrl: undefined as string | undefined,
  },

  compliance: {
    scoresUrl: 'https://scores.sebi.gov.in/',
    smartOdrUrl: 'https://smartodr.in/login',
    investorCharterUrl: 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?menuCode=2000',
    mfSahiHaiUrl: 'https://www.mutualfundssahihai.com/',
    grievanceEmail: 'phani.rompicharla@gmail.com',
    grievancePhone: '+91 94907 16662',
  },

  copyright: '© 2026 TejasFinserv. All rights reserved.',

  assets: {
    logo: 'src/assets/logo.webp',
    laptopApp: 'src/assets/laptopapp.webp',
    topMutualFund: 'src/assets/topamutualfund.webp',
  },

  analytics: {
    ga4Id: (import.meta.env.VITE_GA4_ID as string | undefined) || 'G-D69S6DVF1W',
    gscVerification: import.meta.env.VITE_GSC_VERIFICATION as string | undefined,
    metaPixelId: import.meta.env.VITE_META_PIXEL_ID as string | undefined,
  },

  aiCrawlers: {
    allow: true, // Set false in robots.txt generation to block AI crawlers
  },

  nav: [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Calculators', path: '/calculators' },
    {
      label: 'Services',
      path: '/services', // or '#'
      children: [
        { label: 'Mutual Funds', path: '/mutual-funds' },
        { label: 'Term Insurance', path: '/term-insurance' },
        { label: 'Health Insurance', path: '/health-insurance' },
        { label: 'Savings Plans', path: '/savings-plans' },
      ],
    },
    { label: 'Insights', path: '/insights' },
    { label: 'Contact', path: '/contact' },
  ],

  services: [
    {
      title: 'Financial Planning',
      description: 'A clear roadmap for your goals, cash flow, and future.',
      path: '/financial-planning',
    },
    {
      title: 'Mutual Funds',
      description:
        'Access 6,000+ schemes across 40+ AMCs, matched to your risk profile.',
      path: '/mutual-funds',
    },
    {
      title: 'Insurance',
      description: 'Protect what matters with the right life and health cover.',
      path: '/insurance',
    },
    {
      title: 'Calculators',
      description: 'SIP, retirement, SIP delay, and 15+ free financial calculators.',
      path: '/calculators',
    },
  ],

  goals: [
    { title: 'Retirement', path: '/goals/retirement', calculator: '/calculators/retirement' },
    { title: 'Child Education', path: '/goals/child-education', calculator: '/calculators/child-education' },
    { title: 'Tax Saving', path: '/goals/tax-saving', calculator: '/calculators/elss' },
    { title: 'Wealth Creation', path: '/goals/wealth-creation', calculator: '/calculators/sip' },
  ],

  social: {
    linkedin: undefined as string | undefined,
    facebook: undefined as string | undefined,
    instagram: undefined as string | undefined,
    youtube: undefined as string | undefined,
    twitter: undefined as string | undefined,
  },

  seo: {
    home: {
      title: 'TejasFinserv — Mutual Fund Distributor Vijayawada',
      description:
        'AMFI-registered mutual fund distributor (ARN-251896) in Vijayawada. SIP, financial planning, insurance & free calculators. Start investing online.',
    },
    about: {
      title: 'About TejasFinserv — AMFI Advisor Vijayawada',
      description:
        'Meet Phani Rompicharla, AMFI-registered mutual fund distributor (ARN-251896). Trusted financial advisory in Vijayawada, Andhra Pradesh.',
    },
    financialPlanning: {
      title: 'Financial Planning Vijayawada — TejasFinserv',
      description:
        'Goal-based financial planning, retirement strategies, and portfolio reviews tailored to your life and goals in Vijayawada.',
    },
    mutualFunds: {
      title: 'Mutual Funds Vijayawada — 6000+ Schemes',
      description:
        'Start SIP online with an AMFI-registered distributor. Access 6,000+ mutual fund schemes across 40+ AMCs in Vijayawada.',
    },
    insurance: {
      title: 'Insurance Advisory — TejasFinserv Vijayawada',
      description:
        'Life, health, and business insurance advisory to protect what matters most. Personalized cover in Vijayawada.',
    },
    calculators: {
      title: 'Free Financial Calculators — SIP, SIP Delay, Retirement',
      description:
        '15+ free calculators: SIP, lumpsum, retirement, SIP delay, SWP, FD, PPF, and more. Plan investments with TejasFinserv Vijayawada.',
    },
    insights: {
      title: 'Investment Insights & Guides — TejasFinserv',
      description:
        'Expert articles on SIP, ELSS, retirement planning, and mutual fund investing for Vijayawada investors.',
    },
    faq: {
      title: 'FAQ — Mutual Funds & Investing | TejasFinserv',
      description:
        'Answers to common questions about SIP, ELSS, mutual fund safety, and starting investments with TejasFinserv.',
    },
    contact: {
      title: 'Contact TejasFinserv — Vijayawada',
      description:
        'Call, WhatsApp, or visit TejasFinserv in Yanamalakuduru, Vijayawada. AMFI-registered mutual fund distributor ARN-251896.',
    },
    privacy: {
      title: 'Privacy Policy — TejasFinserv',
      description: 'How TejasFinserv collects, uses, and protects your personal information.',
    },
    terms: {
      title: 'Terms of Use — TejasFinserv',
      description: 'Terms and conditions for using the TejasFinserv website and services.',
    },
    disclaimer: {
      title: 'Disclaimer — TejasFinserv',
      description: 'Important disclaimers regarding mutual fund investments and website information.',
    },
  },
} as const

export type SiteConfig = typeof siteConfig
