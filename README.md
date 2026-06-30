# TejasFinserv Website

Production-ready marketing website for **TejasFinserv** — an AMFI-registered mutual fund distributor (ARN-251896) in Vijayawada, India.

## Features

- 6 core service pages + 18 financial calculators (live-updating, INR-formatted, SVG charts)
- Insights blog (6 seed articles), FAQ, goal landing pages
- SEO + GEO + AEO: JSON-LD schema, `llms.txt`, FAQ/HowTo/speakable markup
- Compliance: Privacy, Terms, Disclaimer, grievance info, SEBI SCORES links
- Conversion: WhatsApp float, sticky mobile CTA, newsletter, app onboarding band
- Cookie consent, 404 page, route-level code splitting

## Tech Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS 4
- React Router 7
- react-helmet-async

## Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview
```

Copy `.env.example` to `.env` and fill in analytics IDs when ready.

## Project Structure

```
src/
  components/       # Shared UI + calculators/
  content/          # FAQs, insights articles
  lib/              # siteConfig.ts, format.ts, calculators/
  pages/            # Route pages (calculators/, goals/, legal/)
  schema/           # Typed JSON-LD builders
  styles/           # globals.css (design tokens)
public/
  llms.txt          # GEO — AI crawler summary
  sitemap.xml       # All routes incl. calculators
  robots.txt        # AI crawlers allowed (configurable)
```

## Configuration

All business data lives in **`src/lib/siteConfig.ts`**:
- Contact, ARN, disclaimers, onboarding URL
- AMC partners, testimonials, compliance links
- SEO titles/descriptions
- Analytics env var keys

### `[CONFIRM]` items before launch

- `contact.hours` — business hours
- `advisor.experience` — years of experience
- `app.appStoreUrl` / `app.playStoreUrl` — native app store links
- `reviews.googleUrl` — Google Business Profile review link
- Social media handles

## Calculators

18 calculators at `/calculators/:slug`. Logic in `src/lib/calculators/math.ts`, metadata in `registry.ts`.

To add a calculator: define compute function in `math.ts`, add entry to `registry.ts`, add URL to `public/sitemap.xml`.

## Insights / Blog

Articles in `src/content/insights.ts`. To add a post:
1. Add entry to `insights` array
2. Add URL to `public/sitemap.xml`

## Contact & Newsletter Endpoints

Forms try `POST /api/contact` and `POST /api/newsletter`, then fall back to `mailto:`. Swap for Formspree/EmailJS by editing `ContactForm.tsx` and `NewsletterForm.tsx`.

## Deployment

### Vercel / Netlify

```bash
npm run build
# Deploy dist/ — vercel.json and _redirects included for SPA routing
```

Set environment variables in your hosting dashboard for GA4/GSC.

### Google Business Profile

Ensure NAP (Name, Address, Phone) on the website matches your GBP listing exactly. Claim and verify your profile at [business.google.com](https://business.google.com).

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Navy | `#15293F` | Hero, footer, dark sections |
| Ivory | `#F7F3EA` | Primary background |
| Brass | `#C2913F` | CTAs, accents |

Fonts: Fraunces (headings), Hanken Grotesk (body).

## AI Crawlers

`siteConfig.aiCrawlers.allow` controls intent; `public/robots.txt` currently allows GPTBot, PerplexityBot, Google-Extended, ClaudeBot. To block, add `Disallow: /` rules per bot.

## License

© 2025 TejasFinserv. All rights reserved.
# tejasfinserv
