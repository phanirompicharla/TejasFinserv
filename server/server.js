import './config/env.js';
import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import validator from 'validator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enforce JWT_SECRET strictly from environment variable (.env)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    if (process.env.NODE_ENV !== 'test') {
        console.error('FATAL: JWT_SECRET environment variable is missing.');
        console.error('Please define JWT_SECRET in your .env file or hosting environment variables.');
        process.exit(1);
    }
}
const SECRET_KEY = JWT_SECRET || 'test-fallback-secret-for-offline-unit-tests-only';

// 1. Strict Login Brute-Force Rate Limiter (Max 5 failed attempts per 15 minutes)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many failed login attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// 2. Public API Spam/DoS Rate Limiter (Max 25 requests per 10 minutes per IP)
const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 25,
    message: { error: 'Too many requests from this IP. Please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// 3. General Read API Rate Limiter
const readLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 150,
    message: { error: 'Too many read requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Security Middleware with Helmet + HSTS + CSP
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://app.tejasfinserv.com",
                "https://www.googletagmanager.com",
                "https://*.googletagmanager.com",
                "https://*.google-analytics.com"
            ],
            connectSrc: [
                "'self'",
                "https://app.tejasfinserv.com",
                "https://www.google-analytics.com",
                "https://region1.google-analytics.com",
                "https://*.google-analytics.com",
                "https://*.analytics.google.com",
                "https://*.googletagmanager.com",
                "https://*.google.com",
                "https://*.google.co.in"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "blob:",
                "https:",
                "https://*.google.com",
                "https://*.google.co.in",
                "https://*.gstatic.com",
                "https://*.googleapis.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com",
                "data:"
            ],
            frameSrc: [
                "'self'",
                "https://www.google.com",
                "https://*.google.com",
                "https://www.google.co.in",
                "https://*.google.co.in",
                "https://maps.google.com",
                "https://maps.google.co.in",
                "https://*.googleapis.com",
                "https://*.googletagmanager.com",
                "https://flow.assetplus.in",
                "https://app.tejasfinserv.com"
            ],
            childSrc: [
                "'self'",
                "https://www.google.com",
                "https://*.google.com",
                "https://www.google.co.in",
                "https://*.google.co.in",
                "https://maps.google.com",
                "https://maps.google.co.in",
                "https://*.googleapis.com",
                "https://flow.assetplus.in",
                "https://app.tejasfinserv.com"
            ],
            frameAncestors: ["'self'"],
            baseUri: ["'self'"]
        }
    },
    hsts: {
        maxAge: 31536000, // 1 Year
        includeSubDomains: true,
        preload: true
    },
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    }
}));

// Additional defense-in-depth headers
app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self "https://www.google.com" "https://maps.google.com" "https://www.google.co.in")');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

app.set('trust proxy', 1);

const distPath = path.join(__dirname, '../dist');
const publicPath = path.join(__dirname, '../public');

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://tejasfinserv.com',
        'https://www.tejasfinserv.com'
    ],
    credentials: true
}));

// Request size limits to prevent request flooding DoS
app.use(express.json({ limit: '100kb' }));

// --- SEO META DATA MAPS ---
const staticRoutesMap = {
    '': {
        title: 'TejasFinserv — Mutual Fund Distributor Vijayawada',
        description: 'AMFI-registered mutual fund distributor (ARN-251896) in Vijayawada. SIP, financial planning, insurance & free calculators. Start investing online.'
    },
    '/about': {
        title: 'About TejasFinserv — AMFI Advisor Vijayawada',
        description: 'Meet Phani Rompicharla, AMFI-registered mutual fund distributor (ARN-251896). Trusted financial advisory in Vijayawada, Andhra Pradesh.'
    },
    '/services': {
        title: 'Services — Mutual Funds, Insurance & Planning | TejasFinserv',
        description: 'AMFI-registered mutual fund distribution, pure protection term insurance, family mediclaim, and goal planning in Vijayawada.'
    },
    '/financial-planning': {
        title: 'Financial Planning Vijayawada — TejasFinserv',
        description: 'Goal-based financial planning, retirement strategies, and portfolio reviews tailored to your life and goals in Vijayawada.'
    },
    '/savings-plans': {
        title: 'Financial Planning Vijayawada — TejasFinserv',
        description: 'Goal-based financial planning, retirement strategies, and portfolio reviews tailored to your life and goals in Vijayawada.'
    },
    '/mutual-funds': {
        title: 'Mutual Funds Vijayawada — 6000+ Schemes',
        description: 'Start SIP online with an AMFI-registered distributor. Access 6,000+ mutual fund schemes across 40+ AMCs in Vijayawada.'
    },
    '/insurance': {
        title: 'Insurance Advisory — TejasFinserv Vijayawada',
        description: 'Life, health, and business insurance advisory to protect what matters most. Personalized cover in Vijayawada.'
    },
    '/term-insurance': {
        title: 'Insurance Advisory — TejasFinserv Vijayawada',
        description: 'Life, health, and business insurance advisory to protect what matters most. Personalized cover in Vijayawada.'
    },
    '/health-insurance': {
        title: 'Insurance Advisory — TejasFinserv Vijayawada',
        description: 'Life, health, and business insurance advisory to protect what matters most. Personalized cover in Vijayawada.'
    },
    '/calculators': {
        title: 'Free Financial Calculators — SIP, SIP Delay, Retirement',
        description: '15+ free calculators: SIP, lumpsum, retirement, SIP delay, SWP, FD, PPF, and more. Plan investments with TejasFinserv Vijayawada.'
    },
    '/insights': {
        title: 'Investment Insights & Guides — TejasFinserv',
        description: 'Expert articles on SIP, ELSS, retirement planning, and mutual fund investing for Vijayawada investors.'
    },
    '/nav': {
        title: 'Mutual Fund NAV Today — All Schemes | TejasFinserv',
        description: 'Latest NAV of every mutual fund scheme in India, updated daily from AMFI. Search, sort and compare. TejasFinserv, ARN-251896.'
    },
    '/faq': {
        title: 'FAQ — Mutual Funds & Investing | TejasFinserv',
        description: 'Answers to common questions about SIP, ELSS, mutual fund safety, and starting investments with TejasFinserv.'
    },
    '/contact': {
        title: 'Contact TejasFinserv — Vijayawada',
        description: 'Call, WhatsApp, or visit TejasFinserv in Yanamalakuduru, Vijayawada. AMFI-registered mutual fund distributor ARN-251896.'
    },
    '/privacy': {
        title: 'Privacy Policy — TejasFinserv',
        description: 'How TejasFinserv collects, uses, and protects your personal information.'
    },
    '/terms': {
        title: 'Terms of Use — TejasFinserv',
        description: 'Terms and conditions for using the TejasFinserv website and services.'
    },
    '/disclaimer': {
        title: 'Disclaimer — TejasFinserv',
        description: 'Important disclaimers regarding mutual fund investments and website information.'
    },
    '/legal': {
        title: 'Regulatory Disclaimers & Disclosures — TejasFinserv',
        description: 'AMFI ARN-251896 regulatory disclosures, SEBI compliance, and investor charters.'
    },
    '/sitemap': {
        title: 'Sitemap — TejasFinserv',
        description: 'Comprehensive directory of all pages, financial calculators, and resources on TejasFinserv.'
    }
};

const staticInsightsMap = {
    'what-is-sip': {
        title: "What is a SIP? A Beginner's Guide to Systematic Investment",
        description: 'Learn how SIPs work, why they suit Indian investors, and how to start your first mutual fund SIP in Vijayawada.',
        datePublished: '2025-01-15',
        author: 'Phani Rompicharla'
    },
    'elss-tax-saving-guide': {
        title: 'ELSS vs PPF: Tax-Saving Options Under Section 80C',
        description: 'Compare ELSS mutual funds and PPF for tax saving. Understand lock-in periods, returns, and which suits your goals.',
        datePublished: '2025-02-01',
        author: 'Phani Rompicharla'
    },
    'goal-based-financial-planning': {
        title: 'Goal-Based Financial Planning: Why It Matters',
        description: 'How goal-based planning helps you invest with purpose — retirement, education, and wealth creation strategies for Indian families.',
        datePublished: '2025-02-20',
        author: 'Phani Rompicharla'
    },
    'how-to-choose-mutual-funds': {
        title: 'How to Choose the Right Mutual Fund',
        description: 'A practical framework for selecting mutual funds based on risk profile, time horizon, and fund category — not just past returns.',
        datePublished: '2025-03-05',
        author: 'Phani Rompicharla'
    },
    'understanding-market-risk': {
        title: 'Understanding Market Risk in Mutual Funds',
        description: 'What "mutual funds are subject to market risks" really means — and how to invest with eyes open.',
        datePublished: '2025-03-18',
        author: 'Phani Rompicharla'
    },
    'retirement-planning-vijayawada': {
        title: 'Retirement Planning for Vijayawada Professionals',
        description: 'Practical retirement planning steps for salaried professionals in Vijayawada and Andhra Pradesh — corpus targets, SIP amounts, and pension options.',
        datePublished: '2025-04-02',
        author: 'Phani Rompicharla'
    }
};

const staticCalculatorsMap = {
    'sip': { title: 'SIP Calculator | TejasFinserv', description: 'Calculate future wealth from monthly Systematic Investment Plans with adjustable returns and tenure.' },
    'lumpsum': { title: 'Lumpsum Calculator | TejasFinserv', description: 'Estimate maturity returns on one-time mutual fund investments over your chosen time horizon.' },
    'step-up-sip': { title: 'Step-Up SIP Calculator | TejasFinserv', description: 'See how increasing your SIP annually accelerates corpus growth over time.' },
    'goal-sip': { title: 'Goal SIP Calculator | TejasFinserv', description: 'Find the exact monthly SIP needed to reach target corpus amounts for milestones like education or property.' },
    'swp': { title: 'SWP Calculator | TejasFinserv', description: 'Plan fixed monthly withdrawals from a mutual fund corpus while tracking remaining balance over time.' },
    'retirement': { title: 'Retirement Planning Calculator | TejasFinserv', description: 'Estimate your target retirement corpus and required monthly SIP based on current age and expenses.' },
    'emi': { title: 'EMI Calculator | TejasFinserv', description: 'Calculate monthly loan installments with detailed principal vs interest breakdown and amortization schedules.' },
    'sip-delay': { title: 'SIP Delay Calculator | TejasFinserv', description: 'Quantify the wealth lost by delaying SIP investments by 1, 3, or 5 years.' },
    'lumpsum-vs-sip': { title: 'Lumpsum vs SIP Calculator | TejasFinserv', description: 'Compare wealth accumulation between one-time lump sum and staggered monthly SIP investments.' },
    'cagr': { title: 'CAGR Calculator | TejasFinserv', description: 'Calculate the Compound Annual Growth Rate of your investments between start and final values.' },
    'inflation': { title: 'Inflation Calculator | TejasFinserv', description: 'Calculate future purchasing power loss and future costs of living due to inflation.' },
    'child-education': { title: 'Child Education Calculator | TejasFinserv', description: 'Plan higher education funds with inflation-adjusted future costs and target SIP plans.' },
    'fd': { title: 'Fixed Deposit (FD) Calculator | TejasFinserv', description: 'Calculate guaranteed maturity amount and interest earned on bank fixed deposits.' },
    'rd': { title: 'Recurring Deposit (RD) Calculator | TejasFinserv', description: 'Calculate maturity value on regular monthly deposits with compounded bank interest rates.' },
    'ppf': { title: 'PPF Calculator | TejasFinserv', description: 'Estimate long-term tax-free returns from 15-year Public Provident Fund contributions.' },
    'elss': { title: 'ELSS Tax Saving Calculator | TejasFinserv', description: 'Estimate tax savings under Section 80C and potential growth from ELSS mutual fund investments.' },
    'nps': { title: 'NPS Calculator | TejasFinserv', description: 'Project National Pension System corpus at retirement with annuity payout and lump sum breakdown.' },
    'sukanya-samriddhi': { title: 'Sukanya Samriddhi Yojana Calculator | TejasFinserv', description: 'Calculate maturity benefits and tax-free interest for the SSY scheme for girl children.' },
    'income-tax': { title: 'Income Tax Calculator | TejasFinserv', description: 'Compare tax liability under the New vs Old tax regimes for salaried individuals.' }
};

const validGoalSlugs = new Set(['retirement', 'child-education', 'tax-saving', 'wealth-creation']);

// Permanently removed resources map (RFC 9110 HTTP 410 Gone)
const permanentlyRemovedRoutes = new Set([
    '/legacy-app',
    '/old-portal',
    '/v1/mutual-funds'
]);

// Helper: Determine if a clean path is a valid recognized route
async function getRouteResolution(cleanPath) {
    if (permanentlyRemovedRoutes.has(cleanPath)) {
        return { status: 410, isGone: true };
    }

    if (staticRoutesMap[cleanPath] !== undefined) {
        return { status: 200, type: 'static', info: staticRoutesMap[cleanPath] };
    }

    if (cleanPath.startsWith('/calculators/')) {
        const slug = cleanPath.split('/')[2];
        if (staticCalculatorsMap[slug]) {
            return { status: 200, type: 'calculator', slug, info: staticCalculatorsMap[slug] };
        }
    }

    if (cleanPath.startsWith('/goals/')) {
        const slug = cleanPath.split('/')[2];
        if (validGoalSlugs.has(slug)) {
            const goalName = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
            return {
                status: 200,
                type: 'goal',
                slug,
                info: {
                    title: `${goalName} Planning — TejasFinserv Vijayawada`,
                    description: `Plan your ${goalName.toLowerCase()} with disciplined mutual fund SIPs and goal-based advisory from TejasFinserv.`
                }
            };
        }
    }

    if (cleanPath.startsWith('/insights/')) {
        const slug = cleanPath.split('/')[2];
        if (staticInsightsMap[slug]) {
            return { status: 200, type: 'insight', slug, info: staticInsightsMap[slug] };
        }
        try {
            const [rows] = await db.query('SELECT title, description, content, author, published_at FROM insights WHERE slug = ? OR id = ? LIMIT 1', [slug, slug]);
            if (rows && rows.length > 0) {
                return {
                    status: 200,
                    type: 'insight',
                    slug,
                    info: {
                        title: `${rows[0].title} | TejasFinserv`,
                        description: rows[0].description || (rows[0].content ? rows[0].content.substring(0, 160) : rows[0].title),
                        author: rows[0].author || 'Phani Rompicharla',
                        content: rows[0].content,
                        datePublished: rows[0].published_at
                    }
                };
            }
        } catch (dbErr) {
            // DB fallback
        }
    }

    if (cleanPath === '/admin' || cleanPath.startsWith('/admin/')) {
        return {
            status: 200,
            type: 'admin',
            info: { title: 'Admin Dashboard | TejasFinserv', description: 'Administrative console for TejasFinserv.' }
        };
    }

    return { status: 404, isNotFound: true };
}

// --- HELPER: Markdown Representation for Content Negotiation (Phase 13) ---
function generateMarkdownResponse(cleanPath, resolution) {
    if (resolution.status === 410) {
        return `# 410 Gone

This resource has been permanently removed from Tejas Finserv.

[Return to Homepage](https://tejasfinserv.com/)
`;
    }

    if (resolution.status === 404) {
        return `# 404 Page Not Found

The requested URL \`${cleanPath}\` does not exist on Tejas Finserv.

## Helpful Links
- [Homepage](https://tejasfinserv.com/)
- [Mutual Fund NAV Today](https://tejasfinserv.com/nav)
- [Financial Calculators](https://tejasfinserv.com/calculators)
- [Contact Advisor](https://tejasfinserv.com/contact)
`;
    }

    if (cleanPath === '' || cleanPath === '/') {
        return `# Tejas Finserv

> Assistance with Assurance — AMFI-Registered Mutual Fund Distributor (ARN-251896) in Vijayawada, Andhra Pradesh.

## Overview
Tejas Finserv helps families and individuals across India invest with clarity and purpose. Led by engineer and educator Phani Kishore Rompicharla, the firm provides goal-aligned mutual fund distribution, life term insurance, family health coverage, and 15+ financial calculators.

## Key Services
- **Mutual Funds Distribution**: 6,000+ schemes across 40+ Asset Management Companies (SBI, HDFC, ICICI Prudential, Nippon India, Kotak, Axis, Parag Parikh, Mirae Asset, etc.).
- **Goal-Based Financial Planning**: Tailored roadmaps for Retirement, Children's Higher Education, Home Purchase, and Wealth Creation.
- **Insurance Advisory**: Pure term insurance and family mediclaim protection.
- **Daily Mutual Fund NAV Tracker**: End-of-day NAV figures sourced directly from AMFI.
- **15+ Financial Calculators**: SIP, Lumpsum, Step-Up SIP, SWP, Retirement, and EMI tools.

## Contact Information
- **Advisor**: Phani Kishore Rompicharla (ARN-251896)
- **Address**: 23-221, Near Old Water Tank, Yanamalakuduru, Vijayawada – 520007, Andhra Pradesh, India
- **Phone / WhatsApp**: +91 94907 16662
- **Email**: phani.rompicharla@gmail.com
- **Website**: https://tejasfinserv.com/
- **Start Investing**: https://flow.assetplus.in/client_onboarding/?advisor=6313983220391d0009f3de64

## Regulatory Disclosures
TejasFinserv is an AMFI-registered Mutual Fund Distributor (ARN-251896). Mutual fund investments are subject to market risks; please read all scheme-related documents carefully before investing.
`;
    }

    if (cleanPath === '/about') {
        return `# About Tejas Finserv & Phani Kishore Rompicharla

> AMFI-Registered Mutual Fund Distributor (ARN-251896) · Vijayawada, Andhra Pradesh

## Philosophy & Background
Tejas Finserv was founded by Phani Kishore Rompicharla (B.Tech, M.Tech, (Ph.D), LMCSI), an engineer and educator by profession. The firm was built on the premise that while modern investing has become digital and accessible, investors still need calm, conflict-free human guidance to avoid emotional mistakes during market cycles.

## Core Commitments
1. **Goal-First Alignment**: Every rupee invested is mapped to a specific life objective.
2. **Transparent Distribution**: Zero jargon, full visibility on scheme TERs, portfolio overlaps, and risk metrics.
3. **Continuous Investor Education**: Active investor awareness and disciplined habit building.

## Contact
- Address: 23-221, Near Old Water Tank, Yanamalakuduru, Vijayawada – 520007
- Phone: +91 94907 16662
- LinkedIn: https://www.linkedin.com/company/tejasfinserv/
`;
    }

    if (cleanPath === '/nav') {
        return `# Mutual Fund NAV Today — All Schemes | Tejas Finserv

Daily Net Asset Value (NAV) of open-ended mutual fund schemes in India, synchronized daily from the Association of Mutual Funds in India (AMFI).

## Scheme Categories Covered
- **Equity**: Large Cap, Mid Cap, Small Cap, Flexi Cap, Multi Cap.
- **ELSS**: Section 80C Tax-Saving Funds with 3-year lock-in.
- **Hybrid**: Balanced Advantage, Aggressive Hybrid, Multi-Asset Allocation.
- **Debt & Liquid**: Liquid Funds, Overnight Funds, Corporate Bond Funds.
- **Index & ETFs**: Nifty 50, Sensex, and Next 50 index trackers.

Visit https://tejasfinserv.com/nav to filter and search across 6,000+ schemes.
`;
    }

    if (cleanPath === '/calculators') {
        return `# Free Financial Calculators — Tejas Finserv

Plan investments and quantify compounding returns with 15+ live online calculators:
- [SIP Calculator](https://tejasfinserv.com/calculators/sip)
- [Lumpsum Calculator](https://tejasfinserv.com/calculators/lumpsum)
- [Step-Up SIP Calculator](https://tejasfinserv.com/calculators/step-up-sip)
- [Goal SIP Calculator](https://tejasfinserv.com/calculators/goal-sip)
- [SWP Calculator](https://tejasfinserv.com/calculators/swp)
- [Retirement Calculator](https://tejasfinserv.com/calculators/retirement)
- [SIP Delay Calculator](https://tejasfinserv.com/calculators/sip-delay)
- [EMI Calculator](https://tejasfinserv.com/calculators/emi)
`;
    }

    // Default structured markdown for other valid pages
    const info = resolution.info || {};
    return `# ${info.title || 'Tejas Finserv'}

${info.description || 'Assistance with Assurance — Mutual Fund Distribution & Financial Advisory in Vijayawada.'}

- Canonical URL: https://tejasfinserv.com${cleanPath}
- AMFI Registration: ARN-251896
- Contact: phani.rompicharla@gmail.com | +91 94907 16662
`;
}

// Helper: Canonical Organization + FinancialService Schema
function getBaseOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": ["FinancialService", "LocalBusiness", "Organization"],
                "@id": "https://tejasfinserv.com/#organization",
                "name": "Tejas Finserv",
                "legalName": "Tejas Finserv (ARN-251896)",
                "alternateName": ["TejasFinserv", "Tejas Financial Services"],
                "url": "https://tejasfinserv.com",
                "logo": {
                    "@type": "ImageObject",
                    "@id": "https://tejasfinserv.com/#logo",
                    "url": "https://tejasfinserv.com/logo.webp",
                    "caption": "Tejas Finserv Logo"
                },
                "image": "https://tejasfinserv.com/logo.webp",
                "description": "AMFI-registered mutual fund distributor (ARN-251896) in Vijayawada, Andhra Pradesh. Goal-based investing, SIP planning, health & term insurance, and mutual fund advisory.",
                "telephone": "+919490716662",
                "email": "phani.rompicharla@gmail.com",
                "priceRange": "₹₹",
                "currenciesAccepted": "INR",
                "paymentAccepted": "Net Banking, UPI, NEFT, RTGS, NACH Mandate",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "23-221, Near Old Water Tank, Yanamalakuduru",
                    "addressLocality": "Vijayawada",
                    "addressRegion": "Andhra Pradesh",
                    "postalCode": "520007",
                    "addressCountry": "IN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 16.487297,
                    "longitude": 80.662539
                },
                "openingHoursSpecification": [
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        "opens": "09:00",
                        "closes": "19:00"
                    }
                ],
                "founder": {
                    "@type": "Person",
                    "@id": "https://tejasfinserv.com/#founder",
                    "name": "Phani Kishore Rompicharla",
                    "jobTitle": "Founder & AMFI-Registered Mutual Fund Distributor",
                    "sameAs": [
                        "https://www.linkedin.com/in/phanikishorerompicharla/",
                        "https://phanisworld.com"
                    ]
                },
                "contactPoint": [
                    {
                        "@type": "ContactPoint",
                        "telephone": "+919490716662",
                        "contactType": "customer service",
                        "email": "phani.rompicharla@gmail.com",
                        "areaServed": "IN",
                        "availableLanguage": ["English", "Telugu", "Hindi"]
                    }
                ],
                "sameAs": [
                    "https://www.linkedin.com/company/tejasfinserv/",
                    "https://www.linkedin.com/in/phanikishorerompicharla/",
                    "https://phanisworld.com",
                    "https://whatsapp.com/channel/0029Vb0cvTY0rGiK32jBw62H",
                    "https://maps.app.goo.gl/7saxjnh6xzKCHm8f8"
                ]
            },
            {
                "@type": "WebSite",
                "@id": "https://tejasfinserv.com/#website",
                "url": "https://tejasfinserv.com",
                "name": "Tejas Finserv",
                "alternateName": "TejasFinserv",
                "publisher": {
                    "@id": "https://tejasfinserv.com/#organization"
                }
            }
        ]
    };
}

// --- HELPER: Server-Side First-Byte SEO & Status Handler ---
async function serveHtmlWithSEO(req, res) {
    const indexPath = path.join(distPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
        return res.status(500).send('Frontend build missing. Run npm run build.');
    }

    const reqPath = req.path || '/';
    const cleanPath = reqPath === '/' ? '' : reqPath.replace(/\/$/, '');
    const resolution = await getRouteResolution(cleanPath);

    // Phase 14: RFC 8288 Link Headers
    const linkHeaders = [
        '</llms.txt>; rel="describedby"; type="text/plain"',
        '</.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"',
        `<https://tejasfinserv.com${cleanPath === '' ? '/' : cleanPath}>; rel="alternate"; type="text/markdown"`
    ];
    res.setHeader('Link', linkHeaders.join(', '));
    res.setHeader('Vary', 'Accept');

    // Phase 13: Markdown Content Negotiation
    const acceptHeader = req.headers['accept'] || '';
    if (acceptHeader.includes('text/markdown')) {
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        const markdown = generateMarkdownResponse(cleanPath, resolution);
        return res.status(resolution.status).send(markdown);
    }

    try {
        let html = await fs.promises.readFile(indexPath, 'utf-8');
        let canonicalUrl = `https://tejasfinserv.com${cleanPath === '' ? '/' : cleanPath}`;
        let title = 'TejasFinserv — Mutual Funds, Financial Planning & Insurance in Vijayawada';
        let description = 'AMFI-registered mutual fund distributor (ARN-251896) in Vijayawada. SIP, financial planning, insurance & free calculators. Start investing online.';
        let imageUrl = 'https://tejasfinserv.com/logo.webp';
        let ogType = 'website';
        let schemaJson = null;

        if (resolution.status === 410) {
            title = '410 Gone: Resource Permanently Removed | TejasFinserv';
            description = 'The requested resource has been permanently removed.';
        } else if (resolution.status === 404) {
            title = '404: Page Not Found | TejasFinserv';
            description = 'The page you are looking for does not exist on TejasFinserv.';
        } else if (resolution.info) {
            title = resolution.info.title || title;
            description = resolution.info.description || description;
            if (resolution.type === 'insight') {
                ogType = 'article';
                const baseOrg = getBaseOrganizationSchema();
                schemaJson = JSON.stringify({
                    "@context": "https://schema.org",
                    "@graph": [
                        baseOrg["@graph"][0],
                        baseOrg["@graph"][1],
                        {
                            "@type": "BlogPosting",
                            "@id": `${canonicalUrl}#article`,
                            "headline": resolution.info.title,
                            "description": description,
                            "image": imageUrl,
                            "url": canonicalUrl,
                            "datePublished": resolution.info.datePublished || new Date().toISOString(),
                            "author": {
                                "@type": "Person",
                                "name": resolution.info.author || "Phani Rompicharla"
                            },
                            "publisher": {
                                "@id": "https://tejasfinserv.com/#organization"
                            }
                        }
                    ]
                }, null, 2);
            }
        }

        // Always ensure schemaJson contains canonical Organization + FinancialService
        if (!schemaJson) {
            schemaJson = JSON.stringify(getBaseOrganizationSchema(), null, 2);
        }

        // 1. Replace <title>
        html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}<\/title>`);

        // 2. Replace or insert <meta name="description">
        if (/<meta\s+name=["']description["'][\s\S]*?>/i.test(html)) {
            html = html.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`);
        } else {
            html = html.replace(/<\/head>/i, `  <meta name="description" content="${description.replace(/"/g, '&quot;')}" />\n</head>`);
        }

        // 3. Robots meta tag for 404 / 410
        if (resolution.status === 404 || resolution.status === 410) {
            html = html.replace(/<\/head>/i, `  <meta name="robots" content="noindex, follow" />\n</head>`);
        }

        // 4. Canonical link
        if (/<link\s+rel=["']canonical["'][\s\S]*?>/i.test(html)) {
            html = html.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
        } else if (/<!--\s*CANONICAL_PLACEHOLDER\s*-->/i.test(html)) {
            html = html.replace(/<!--\s*CANONICAL_PLACEHOLDER\s*-->/i, `<link rel="canonical" href="${canonicalUrl}" />`);
        } else {
            html = html.replace(/<\/head>/i, `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
        }

        // 5. Replace or insert OpenGraph & Twitter tags
        const replaceOrInsertMeta = (htmlStr, attrName, attrValue, contentValue) => {
            const regex = new RegExp(`<meta\\s+[^>]*?${attrName}=["']${attrValue}["'][^>]*?>`, 'i');
            const newTag = `<meta ${attrName}="${attrValue}" content="${contentValue.replace(/"/g, '&quot;')}" />`;
            if (regex.test(htmlStr)) {
                return htmlStr.replace(regex, newTag);
            } else {
                return htmlStr.replace(/<\/head>/i, `  ${newTag}\n</head>`);
            }
        };

        html = replaceOrInsertMeta(html, 'property', 'og:type', ogType);
        html = replaceOrInsertMeta(html, 'property', 'og:url', canonicalUrl);
        html = replaceOrInsertMeta(html, 'property', 'og:title', title);
        html = replaceOrInsertMeta(html, 'property', 'og:description', description);
        html = replaceOrInsertMeta(html, 'property', 'og:image', imageUrl);
        html = replaceOrInsertMeta(html, 'property', 'og:site_name', 'TejasFinserv');
        html = replaceOrInsertMeta(html, 'property', 'og:locale', 'en_IN');

        html = replaceOrInsertMeta(html, 'name', 'twitter:card', 'summary_large_image');
        html = replaceOrInsertMeta(html, 'name', 'twitter:url', canonicalUrl);
        html = replaceOrInsertMeta(html, 'name', 'twitter:title', title);
        html = replaceOrInsertMeta(html, 'name', 'twitter:description', description);
        html = replaceOrInsertMeta(html, 'name', 'twitter:image', imageUrl);

        // 6. Inject schema JSON-LD
        const scriptTag = `<script type="application/ld+json">\n${schemaJson}\n</script>`;
        if (/<!--\s*JSONLD_PLACEHOLDER\s*-->[\s\S]*?<!--\s*\/JSONLD_PLACEHOLDER\s*-->/i.test(html)) {
            html = html.replace(/<!--\s*JSONLD_PLACEHOLDER\s*-->[\s\S]*?<!--\s*\/JSONLD_PLACEHOLDER\s*-->/i, `<!-- JSONLD_PLACEHOLDER -->\n${scriptTag}\n<!-- /JSONLD_PLACEHOLDER -->`);
        } else if (/<!--\s*JSONLD_PLACEHOLDER\s*-->/i.test(html)) {
            html = html.replace(/<!--\s*JSONLD_PLACEHOLDER\s*-->/i, scriptTag);
        } else {
            html = html.replace(/<\/head>/i, `  ${scriptTag}\n</head>`);
        }

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        return res.status(resolution.status).send(html);
    } catch (err) {
        console.error('serveHtmlWithSEO Error:', err);
        return res.status(resolution.status || 500).sendFile(indexPath);
    }
}

// Phase 12: Well-formed llms.txt Route (Precedes static/SPA fallbacks)
app.get('/llms.txt', (req, res) => {
    const llmsFile = path.join(publicPath, 'llms.txt');
    if (fs.existsSync(llmsFile)) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.sendFile(llmsFile);
    }
    res.status(404).send('llms.txt not found');
});

// Phase 16: MCP Server Card Route (Precedes static/SPA fallbacks)
app.get('/.well-known/mcp/server-card.json', (req, res) => {
    const cardFile = path.join(publicPath, '.well-known/mcp/server-card.json');
    if (fs.existsSync(cardFile)) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        try {
            const data = JSON.parse(fs.readFileSync(cardFile, 'utf-8'));
            return res.json(data);
        } catch {
            return res.sendFile(cardFile, { dotfiles: 'allow' });
        }
    }
    res.status(404).json({ error: 'MCP server card not found' });
});

// Phase 5: Dynamic Robots.txt Route with Content-Signal (Must run BEFORE express.static)
app.get('/robots.txt', (req, res) => {
    const robotsFile = path.join(publicPath, 'robots.txt');
    if (fs.existsSync(robotsFile)) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.sendFile(robotsFile);
    }
    const robotsContent = `Content-Signal: search=yes, ai-train=no\n\nUser-agent: *\nAllow: /\n\nSitemap: https://tejasfinserv.com/sitemap.xml\n`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(robotsContent);
});

// Dynamic Sitemap.xml Route (Must run BEFORE express.static)
app.get('/sitemap.xml', async (req, res) => {
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        const staticSitemapRoutes = [
            { path: '', priority: '1.0', changefreq: 'weekly' },
            { path: '/about', priority: '0.9', changefreq: 'monthly' },
            { path: '/services', priority: '0.9', changefreq: 'monthly' },
            { path: '/financial-planning', priority: '0.8', changefreq: 'monthly' },
            { path: '/mutual-funds', priority: '0.9', changefreq: 'weekly' },
            { path: '/insurance', priority: '0.8', changefreq: 'monthly' },
            { path: '/term-insurance', priority: '0.8', changefreq: 'monthly' },
            { path: '/health-insurance', priority: '0.8', changefreq: 'monthly' },
            { path: '/savings-plans', priority: '0.8', changefreq: 'monthly' },
            { path: '/calculators', priority: '0.9', changefreq: 'monthly' },
            { path: '/nav', priority: '0.9', changefreq: 'daily' },
            { path: '/calculators/sip', priority: '0.8', changefreq: 'monthly' },
            { path: '/calculators/lumpsum', priority: '0.8', changefreq: 'monthly' },
            { path: '/calculators/step-up-sip', priority: '0.8', changefreq: 'monthly' },
            { path: '/calculators/goal-sip', priority: '0.8', changefreq: 'monthly' },
            { path: '/calculators/swp', priority: '0.8', changefreq: 'monthly' },
            { path: '/calculators/retirement', priority: '0.8', changefreq: 'monthly' },
            { path: '/calculators/emi', priority: '0.8', changefreq: 'monthly' },
            { path: '/calculators/sip-delay', priority: '0.8', changefreq: 'monthly' },
            { path: '/calculators/lumpsum-vs-sip', priority: '0.7', changefreq: 'monthly' },
            { path: '/calculators/cagr', priority: '0.7', changefreq: 'monthly' },
            { path: '/calculators/inflation', priority: '0.7', changefreq: 'monthly' },
            { path: '/calculators/child-education', priority: '0.7', changefreq: 'monthly' },
            { path: '/calculators/fd', priority: '0.7', changefreq: 'monthly' },
            { path: '/calculators/rd', priority: '0.7', changefreq: 'monthly' },
            { path: '/calculators/ppf', priority: '0.7', changefreq: 'monthly' },
            { path: '/calculators/elss', priority: '0.6', changefreq: 'monthly' },
            { path: '/calculators/nps', priority: '0.6', changefreq: 'monthly' },
            { path: '/calculators/sukanya-samriddhi', priority: '0.6', changefreq: 'monthly' },
            { path: '/calculators/income-tax', priority: '0.6', changefreq: 'monthly' },
            { path: '/insights', priority: '0.8', changefreq: 'daily' },
            { path: '/faq', priority: '0.8', changefreq: 'monthly' },
            { path: '/contact', priority: '0.8', changefreq: 'monthly' },
            { path: '/goals/retirement', priority: '0.7', changefreq: 'monthly' },
            { path: '/goals/child-education', priority: '0.7', changefreq: 'monthly' },
            { path: '/goals/tax-saving', priority: '0.7', changefreq: 'monthly' },
            { path: '/goals/wealth-creation', priority: '0.7', changefreq: 'monthly' },
            { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
            { path: '/terms', priority: '0.3', changefreq: 'yearly' },
            { path: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
            { path: '/sitemap', priority: '0.5', changefreq: 'monthly' }
        ];

        for (const r of staticSitemapRoutes) {
            xml += '  <url>\n';
            xml += `    <loc>https://tejasfinserv.com${r.path}</loc>\n`;
            xml += `    <lastmod>${todayStr}</lastmod>\n`;
            xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
            xml += `    <priority>${r.priority}</priority>\n`;
            xml += '  </url>\n';
        }

        // Static insight articles
        const staticInsightsList = [
            { slug: 'what-is-sip', date: '2025-01-15' },
            { slug: 'elss-tax-saving-guide', date: '2025-02-01' },
            { slug: 'goal-based-financial-planning', date: '2025-02-20' },
            { slug: 'how-to-choose-mutual-funds', date: '2025-03-05' },
            { slug: 'understanding-market-risk', date: '2025-03-18' },
            { slug: 'retirement-planning-vijayawada', date: '2025-04-02' }
        ];

        for (const sp of staticInsightsList) {
            xml += '  <url>\n';
            xml += `    <loc>https://tejasfinserv.com/insights/${sp.slug}</loc>\n`;
            xml += `    <lastmod>${sp.date}</lastmod>\n`;
            xml += '    <changefreq>monthly</changefreq>\n';
            xml += '    <priority>0.7</priority>\n';
            xml += '  </url>\n';
        }

        // Dynamic DB insight articles
        try {
            const [rows] = await db.query('SELECT slug, published_at, updated_at FROM insights ORDER BY published_at DESC');
            const staticSlugs = new Set(staticInsightsList.map(s => s.slug));
            for (const row of rows) {
                if (staticSlugs.has(row.slug)) continue;
                let modDateStr = todayStr;
                if (row.updated_at) {
                    const parsed = new Date(row.updated_at);
                    if (!isNaN(parsed.getTime())) modDateStr = parsed.toISOString().split('T')[0];
                } else if (row.published_at) {
                    const parsed = new Date(row.published_at);
                    if (!isNaN(parsed.getTime())) modDateStr = parsed.toISOString().split('T')[0];
                }
                xml += '  <url>\n';
                xml += `    <loc>https://tejasfinserv.com/insights/${row.slug}</loc>\n`;
                xml += `    <lastmod>${modDateStr}</lastmod>\n`;
                xml += '    <changefreq>weekly</changefreq>\n';
                xml += '    <priority>0.8</priority>\n';
                xml += '  </url>\n';
            }
        } catch (dbErr) {
            console.error('Sitemap DB query error:', dbErr.message);
        }

        xml += '</urlset>';
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.send(xml);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).send('Error generating sitemap');
    }
});

// Static assets
app.use(express.static(distPath, {
    index: false,
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
    }
}));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Helper to record login attempts inside admin_login_logs
const logLoginAttempt = async (req, adminId, username, status) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'Unknown';
        const userAgent = req.headers['user-agent'] || 'Unknown';
        await db.query(
            'INSERT INTO admin_login_logs (admin_id, username, ip_address, user_agent, status) VALUES (?, ?, ?, ?, ?)',
            [
                adminId || null,
                typeof username === 'string' ? username.slice(0, 50) : null,
                typeof ip === 'string' ? ip.slice(0, 255) : 'Unknown',
                typeof userAgent === 'string' ? userAgent.slice(0, 255) : 'Unknown',
                status
            ]
        );
    } catch (err) {
        console.error('Failed to record login log:', err);
    }
};

// --- AUTH API ---
app.post('/api/auth/login', loginLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
            await logLoginAttempt(req, null, typeof username === 'string' ? username : 'UNKNOWN', 'FAILURE');
            return res.status(400).json({ error: 'Valid username and password required' });
        }

        const trimmedUsername = username.trim();
        const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [trimmedUsername]);
        
        if (rows.length === 0) {
            await logLoginAttempt(req, null, trimmedUsername, 'FAILURE');
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            await logLoginAttempt(req, user.id, user.username, 'FAILURE');
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        await logLoginAttempt(req, user.id, user.username, 'SUCCESS');
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '2h' });
        res.json({ success: true, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/admin/login-logs', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM admin_login_logs ORDER BY attempted_at DESC LIMIT 200');
        res.json(rows);
    } catch (error) {
        console.error('Admin login logs error:', error);
        res.status(500).json({ error: 'Failed to retrieve login logs' });
    }
});

// --- CONTACT API ---
app.post('/api/contact', apiLimiter, async (req, res) => {
    try {
        let { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate types and lengths
        if (typeof name !== 'string' || name.length > 100 ||
            typeof email !== 'string' || email.length > 150 || !validator.isEmail(email) ||
            typeof phone !== 'string' || phone.length > 20 ||
            typeof message !== 'string' || message.length > 3000) {
            return res.status(400).json({ error: 'Invalid input format or length exceeding limits.' });
        }

        // Sanitize to prevent Stored XSS
        name = validator.escape(name.trim());
        email = validator.normalizeEmail(email) || email.trim();
        phone = validator.escape(phone.trim());
        message = validator.escape(message.trim());

        await db.query(
            'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
            [name, email, phone, message]
        );
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to process request.' });
    }
});

// Admin Route to view contacts
app.get('/api/admin/contacts', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Admin contacts error:', error);
        res.status(500).json({ error: 'Failed to retrieve contacts' });
    }
});

app.delete('/api/admin/contacts/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'Valid positive numeric ID required' });
        }
        await db.query('DELETE FROM contact_messages WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Admin delete contact error:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

// --- INSIGHTS API ---
app.get('/api/insights', readLimiter, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, title, slug, content, image_url, description, read_time, tags, author, published_at, updated_at FROM insights ORDER BY published_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Insights error:', error);
        res.status(500).json({ error: 'Failed to retrieve insights' });
    }
});

app.get('/api/insights/:slug', readLimiter, async (req, res) => {
    try {
        const slug = String(req.params.slug).trim();
        const [rows] = await db.query('SELECT * FROM insights WHERE slug = ?', [slug]);
        if (rows.length === 0) return res.status(404).json({ error: 'Insight not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Insight fetch error:', error);
        res.status(500).json({ error: 'Failed to retrieve insight' });
    }
});

app.post('/api/admin/insights', authenticateToken, async (req, res) => {
    try {
        const { title, slug, content, image_url, description, read_time, tags, author } = req.body;
        if (!title || !content || typeof title !== 'string' || typeof content !== 'string') {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        const safeSlug = slug ? String(slug).toLowerCase().trim().replace(/[^a-z0-9-]/g, '-') : title.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
        const [result] = await db.query(
            'INSERT INTO insights (title, slug, content, image_url, description, read_time, tags, author) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title.trim(), safeSlug, content, image_url || null, description || null, read_time || null, tags || null, author || null]
        );
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error adding insight:', error);
        res.status(500).json({ error: 'Failed to add insight' });
    }
});

app.put('/api/admin/insights/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Valid positive numeric ID required' });
        const { title, slug, content, image_url, description, read_time, tags, author } = req.body;
        await db.query(
            'UPDATE insights SET title=?, slug=?, content=?, image_url=?, description=?, read_time=?, tags=?, author=? WHERE id=?',
            [title, slug, content, image_url || null, description || null, read_time || null, tags || null, author || null, id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating insight:', error);
        res.status(500).json({ error: 'Failed to update insight' });
    }
});

app.delete('/api/admin/insights/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Valid positive numeric ID required' });
        await db.query('DELETE FROM insights WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting insight:', error);
        res.status(500).json({ error: 'Failed to delete insight' });
    }
});

// --- REVIEWS API ---
app.post('/api/reviews', apiLimiter, async (req, res) => {
    try {
        let { name, city, review_text } = req.body;
        if (!name || !city || !review_text) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (typeof name !== 'string' || name.length > 100 ||
            typeof city !== 'string' || city.length > 100 ||
            typeof review_text !== 'string' || review_text.length > 2000) {
            return res.status(400).json({ error: 'Invalid input length.' });
        }

        name = validator.escape(name.trim());
        city = validator.escape(city.trim());
        review_text = validator.escape(review_text.trim());

        await db.query(
            'INSERT INTO client_reviews (name, city, review_text, status) VALUES (?, ?, ?, ?)',
            [name, city, review_text, 'pending']
        );
        res.json({ success: true, message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ error: 'Failed to submit review.' });
    }
});

app.get('/api/reviews', readLimiter, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT name, city, review_text, created_at FROM client_reviews WHERE status = "approved" ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Reviews get error:', error);
        res.status(500).json({ error: 'Failed to retrieve reviews' });
    }
});

app.get('/api/admin/reviews', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM client_reviews ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Admin reviews error:', error);
        res.status(500).json({ error: 'Failed to retrieve reviews' });
    }
});

app.put('/api/admin/reviews/:id/approve', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Valid ID required' });
        await db.query('UPDATE client_reviews SET status = "approved" WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error approving review:', error);
        res.status(500).json({ error: 'Failed to approve review' });
    }
});

app.put('/api/admin/reviews/:id/reject', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Valid ID required' });
        await db.query('UPDATE client_reviews SET status = "rejected" WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error rejecting review:', error);
        res.status(500).json({ error: 'Failed to reject review' });
    }
});

app.delete('/api/admin/reviews/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Valid ID required' });
        await db.query('DELETE FROM client_reviews WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

// --- SITE SETTINGS API ---
app.get('/api/settings/status', readLimiter, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT setting_value FROM site_settings WHERE setting_key = "coming_soon"');
        const isComingSoon = rows.length > 0 && rows[0].setting_value === 'true';
        res.json({ coming_soon: isComingSoon });
    } catch (error) {
        res.json({ coming_soon: process.env.COMING_SOON === 'true' });
    }
});

app.put('/api/admin/settings/coming-soon', authenticateToken, async (req, res) => {
    try {
        const { coming_soon } = req.body;
        const value = coming_soon ? 'true' : 'false';
        await db.query(`
            INSERT INTO site_settings (setting_key, setting_value)
            VALUES ("coming_soon", ?)
            ON DUPLICATE KEY UPDATE setting_value = ?
        `, [value, value]);
        res.json({ success: true, coming_soon: coming_soon });
    } catch (error) {
        console.error('Error saving site settings:', error);
        res.status(500).json({ error: 'Failed to update site settings' });
    }
});

// --- SPA ROUTING, CONTENT NEGOTIATION & PROPER 404/410 CODES ---
app.get('/', serveHtmlWithSEO);
app.get(/.*/, (req, res) => {
    if (req.url.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    return serveHtmlWithSEO(req, res);
});

// Start Server if not imported
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
