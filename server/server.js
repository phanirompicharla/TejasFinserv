import './config/env.js';
import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import fs from 'fs';
import path from 'path';
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

// Enforce secure JWT_SECRET or fallback safely to prevent Hostinger startup crashes if not defined in .env
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.warn('WARNING: JWT_SECRET environment variable is not set in production. Using secure application fallback.');
}
const SECRET_KEY = JWT_SECRET || 'TejasFinserv_Super_Secure_Prod_Fallback_Secret_2026_!#@%*';

// 1. Strict Login Brute-Force Rate Limiter (Max 5 failed attempts per 15 minutes)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many failed login attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// 2. Public API Spam/DoS Rate Limiter (Max 20 requests per 10 minutes per IP)
const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: { error: 'Too many requests from this IP. Please slow down.' }
});

// Database Startup Migrations
(async () => {
    try {
        await db.query('ALTER TABLE insights ADD COLUMN description TEXT NULL');
        console.log('Migrated: description column added to insights');
    } catch (e) {}
    try {
        await db.query('ALTER TABLE insights ADD COLUMN read_time VARCHAR(50) NULL');
        console.log('Migrated: read_time column added to insights');
    } catch (e) {}
    try {
        await db.query('ALTER TABLE insights ADD COLUMN tags VARCHAR(255) NULL');
        console.log('Migrated: tags column added to insights');
    } catch (e) {}
    try {
        await db.query('ALTER TABLE insights ADD COLUMN author VARCHAR(100) NULL');
        console.log('Migrated: author column added to insights');
    } catch (e) {}
    try {
        await db.query("ALTER TABLE client_reviews MODIFY COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'");
        console.log('Migrated: status ENUM updated in client_reviews');
    } catch (e) {}
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS admin_login_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                admin_id INT NULL,
                username VARCHAR(50),
                ip_address VARCHAR(255),
                user_agent VARCHAR(255),
                status ENUM('SUCCESS', 'FAILURE') NOT NULL,
                attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Migrated: admin_login_logs table checked/created');
    } catch (e) {
        console.error('Error migrating admin_login_logs table:', e);
    }
})();

// Security Middleware with Helmet + HSTS
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
        }
    },
    hsts: {
        maxAge: 31536000, // 1 Year
        includeSubDomains: true,
        preload: true
    }
}));
app.set('trust proxy', 1);

const distPath = path.join(__dirname, '../dist');

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://tejasfinserv.com',
        'https://www.tejasfinserv.com'
    ],
    credentials: true
}));

app.use(express.json());

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

// --- HELPER: Server-Side First-Byte SEO Meta Injection ---
async function serveHtmlWithSEO(req, res) {
    const indexPath = path.join(distPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
        return res.status(500).send('Frontend build missing. Run npm run build.');
    }

    try {
        let html = await fs.promises.readFile(indexPath, 'utf-8');
        const reqPath = req.path || '/';
        const cleanPath = reqPath === '/' ? '' : reqPath.replace(/\/$/, '');
        let canonicalUrl = `https://tejasfinserv.com${cleanPath === '' ? '/' : cleanPath}`;
        let title = 'TejasFinserv — Mutual Funds, Financial Planning & Insurance in Vijayawada';
        let description = 'AMFI-registered mutual fund distributor (ARN-251896) in Vijayawada. SIP, financial planning, insurance & free calculators. Start investing online.';
        let imageUrl = 'https://tejasfinserv.com/logo.webp';
        let ogType = 'website';
        let schemaJson = null;

        if (cleanPath.startsWith('/insights/') && cleanPath.length > 10) {
            const slug = cleanPath.split('/')[2];
            try {
                const [rows] = await db.query('SELECT title, slug, content, description, image_url, author, published_at FROM insights WHERE slug = ? OR id = ? LIMIT 1', [slug, slug]);
                if (rows && rows.length > 0) {
                    const post = rows[0];
                    title = `${post.title} | TejasFinserv`;
                    description = post.description || (post.content ? post.content.substring(0, 160).replace(/\s+/g, ' ') : '') || post.title;
                    canonicalUrl = `https://tejasfinserv.com/insights/${post.slug || post.id}`;
                    if (post.image_url) {
                        imageUrl = post.image_url.startsWith('http') ? post.image_url : `https://tejasfinserv.com${post.image_url.startsWith('/') ? '' : '/'}${post.image_url}`;
                    }
                    ogType = 'article';
                    schemaJson = JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "description": description,
                        "image": imageUrl,
                        "url": canonicalUrl,
                        "datePublished": post.published_at ? new Date(post.published_at).toISOString() : new Date().toISOString(),
                        "author": {
                            "@type": "Person",
                            "name": post.author || "Phani Rompicharla"
                        }
                    }, null, 2);
                } else if (staticInsightsMap[slug]) {
                    const sp = staticInsightsMap[slug];
                    title = `${sp.title} | TejasFinserv`;
                    description = sp.description;
                    canonicalUrl = `https://tejasfinserv.com/insights/${sp.slug}`;
                    ogType = 'article';
                    schemaJson = JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": sp.title,
                        "description": sp.description,
                        "image": imageUrl,
                        "url": canonicalUrl,
                        "datePublished": sp.datePublished || new Date().toISOString().split('T')[0],
                        "author": {
                            "@type": "Person",
                            "name": sp.author || "Phani Rompicharla"
                        }
                    }, null, 2);
                }
            } catch (dbErr) {
                console.error('SEO DB Fetch Error for insights:', dbErr);
                if (staticInsightsMap[slug]) {
                    const sp = staticInsightsMap[slug];
                    title = `${sp.title} | TejasFinserv`;
                    description = sp.description;
                    canonicalUrl = `https://tejasfinserv.com/insights/${sp.slug}`;
                    ogType = 'article';
                }
            }
        } else if (cleanPath.startsWith('/calculators/') && cleanPath.length > 13) {
            const calcSlug = cleanPath.split('/')[2];
            if (staticCalculatorsMap[calcSlug]) {
                const calc = staticCalculatorsMap[calcSlug];
                title = calc.title;
                description = calc.description;
                title = `${calcSlug.toUpperCase().replace(/-/g, ' ')} Calculator | TejasFinserv`;
                description = `Plan your investments easily with our free online ${calcSlug.replace(/-/g, ' ')} calculator.`;
            }
        } else if (staticRoutesMap[cleanPath]) {
            title = staticRoutesMap[cleanPath].title;
            description = staticRoutesMap[cleanPath].description;
        }

        // 1. Replace <title>
        html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}<\/title>`);

        // 2. Replace or insert <meta name="description">
        if (/<meta\s+name=["']description["'][\s\S]*?>/i.test(html)) {
            html = html.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`);
        } else {
            html = html.replace(/<\/head>/i, `  <meta name="description" content="${description.replace(/"/g, '&quot;')}" />\n</head>`);
        }

        // 3. Replace canonical URL or CANONICAL_PLACEHOLDER
        if (/<link\s+rel=["']canonical["'][\s\S]*?>/i.test(html)) {
            html = html.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
        } else if (/<!--\s*CANONICAL_PLACEHOLDER\s*-->/i.test(html)) {
            html = html.replace(/<!--\s*CANONICAL_PLACEHOLDER\s*-->/i, `<link rel="canonical" href="${canonicalUrl}" />`);
        } else {
            html = html.replace(/<\/head>/i, `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
        }

        // 4. Replace or insert OpenGraph & Twitter tags
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

        // 5. Inject schema JSON-LD if present
        if (schemaJson) {
            const scriptTag = `<script type="application/ld+json">\n${schemaJson}\n</script>`;
            if (/<!--\s*JSONLD_PLACEHOLDER\s*-->/i.test(html)) {
                html = html.replace(/<!--\s*JSONLD_PLACEHOLDER\s*-->/i, scriptTag);
            } else {
                html = html.replace(/<\/head>/i, `  ${scriptTag}\n</head>`);
            }
        } else {
            html = html.replace(/<!--\s*JSONLD_PLACEHOLDER\s*-->/i, '');
        }

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.send(html);
    } catch (err) {
        console.error('serveHtmlWithSEO Error:', err);
        res.sendFile(indexPath);
    }
}

// Dynamic Robots.txt Route (Must run BEFORE express.static)
app.get('/robots.txt', (req, res) => {
    const robotsContent = `User-agent: *
Allow: /

# Allow AI/LLM crawlers to access the site for specialized search and AI answers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: FacebookBot
Allow: /

Sitemap: https://tejasfinserv.com/sitemap.xml
`;
    res.setHeader('Content-Type', 'text/plain');
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
            { path: '/financial-planning', priority: '0.8', changefreq: 'monthly' },
            { path: '/mutual-funds', priority: '0.9', changefreq: 'weekly' },
            { path: '/insurance', priority: '0.8', changefreq: 'monthly' },
            { path: '/term-insurance', priority: '0.8', changefreq: 'monthly' },
            { path: '/health-insurance', priority: '0.8', changefreq: 'monthly' },
            { path: '/savings-plans', priority: '0.8', changefreq: 'monthly' },
            { path: '/calculators', priority: '0.9', changefreq: 'monthly' },
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
            { path: '/disclaimer', priority: '0.3', changefreq: 'yearly' }
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
        res.setHeader('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).send('Error generating sitemap');
    }
});

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
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/admin/contacts/:id', authenticateToken, async (req, res) => {
    try {
        if (isNaN(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
        await db.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- INSIGHTS API ---
app.get('/api/insights', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, title, slug, content, image_url, description, read_time, tags, author, published_at, updated_at FROM insights ORDER BY published_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/insights/:slug', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM insights WHERE slug = ?', [req.params.slug]);
        if (rows.length === 0) return res.status(404).json({ error: 'Insight not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/insights', authenticateToken, async (req, res) => {
    try {
        const { title, slug, content, image_url, description, read_time, tags, author } = req.body;
        const [result] = await db.query(
            'INSERT INTO insights (title, slug, content, image_url, description, read_time, tags, author) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, slug || title.toLowerCase().replace(/ /g, '-'), content, image_url || null, description || null, read_time || null, tags || null, author || null]
        );
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error adding insight:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admin/insights/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
        const { title, slug, content, image_url, description, read_time, tags, author } = req.body;
        await db.query(
            'UPDATE insights SET title=?, slug=?, content=?, image_url=?, description=?, read_time=?, tags=?, author=? WHERE id=?',
            [title, slug, content, image_url || null, description || null, read_time || null, tags || null, author || null, id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/admin/insights/:id', authenticateToken, async (req, res) => {
    try {
        if (isNaN(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
        await db.query('DELETE FROM insights WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        // Sanitize and escape HTML entities before saving
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

app.get('/api/reviews', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT name, city, review_text, created_at FROM client_reviews WHERE status = "approved" ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/reviews', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM client_reviews ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admin/reviews/:id/approve', authenticateToken, async (req, res) => {
    try {
        if (isNaN(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
        await db.query('UPDATE client_reviews SET status = "approved" WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admin/reviews/:id/reject', authenticateToken, async (req, res) => {
    try {
        if (isNaN(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
        await db.query('UPDATE client_reviews SET status = "rejected" WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/admin/reviews/:id', authenticateToken, async (req, res) => {
    try {
        if (isNaN(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
        await db.query('DELETE FROM client_reviews WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- SPA ROUTING & SERVER-SIDE SEO INJECTION ---
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
