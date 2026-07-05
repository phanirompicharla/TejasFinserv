const clientLogoModules = import.meta.glob('../assets/client logo/*.{webp,png,jpg,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

/** Map filename (without extension) to AMC/partner slug */
const slugAliases: Record<string, string> = {
  adity: 'absl',
  icic: 'icici',
}

const insuranceOnlySlugs = new Set([
  'care', 'shriram',
  'tata-aia', 'hdfc-life', 'icici-pru', 'max-life', 'lic', 'sbi-life',
  'bajaj-allianz', 'kotak-life', 'absl-life', 'pnb-metlife', 'canara-hsbc',
  'indiafirst', 'ageas-federal', 'aviva', 'edelweiss-tokio', 'bandhan-life',
  'bharti-axa', 'future-generali', 'pramerica', 'sud-life', 'shriram-life',
  'reliance-nippon',
  
  // New health insurance slugs
  'hdfc-ergo', 'niva-bupa', 'icici-lombard', 'tata-aig', 'star-health',
  'bajaj-allianz-gi', 'sbi-general', 'reliance-general', 'manipalcigna',
  'acko', 'digit', 'go-digit', 'future-generali-gi', 'kotak-general',
  'liberty-general', 'royal-sundaram', 'national-insurance', 'new-india',
  'oriental', 'united-india', 'iffco-tokio', 'chola-ms', 'shriram-gi',
])

function fileNameFromPath(path: string) {
  return path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? ''
}

const logosByFile: Record<string, string> = {}
for (const [path, url] of Object.entries(clientLogoModules)) {
  logosByFile[fileNameFromPath(path)] = url
}

/** Client-provided logos from src/assets/client logo — keyed by partner slug */
export const clientLogoBySlug: Record<string, string> = {}
for (const [file, url] of Object.entries(logosByFile)) {
  const slug = slugAliases[file] ?? file
  if (!insuranceOnlySlugs.has(file)) {
    clientLogoBySlug[slug] = url
  }
}

const termInsurancePartnerMeta = [
  { name: 'Tata AIA Life Insurance', slug: 'tata-aia', file: 'tata-aia' },
  { name: 'HDFC Life Insurance', slug: 'hdfc-life', file: 'hdfc-life' },
  { name: 'ICICI Prudential Life Insurance', slug: 'icici-pru', file: 'icici-pru' },
  { name: 'Max Life Insurance', slug: 'max-life', file: 'max-life' },
  { name: 'LIC of India', slug: 'lic', file: 'lic' },
  { name: 'SBI Life Insurance', slug: 'sbi-life', file: 'sbi-life' },
  { name: 'Bajaj Allianz Life Insurance', slug: 'bajaj-allianz', file: 'bajaj-allianz' },
  { name: 'Kotak Mahindra Life Insurance', slug: 'kotak-life', file: 'kotak-life' },
  { name: 'Aditya Birla Sun Life Insurance', slug: 'absl-life', file: 'absl-life' },
  { name: 'PNB MetLife India Insurance', slug: 'pnb-metlife', file: 'pnb-metlife' },
  { name: 'Canara HSBC Life Insurance', slug: 'canara-hsbc', file: 'canara-hsbc' },
  { name: 'IndiaFirst Life Insurance', slug: 'indiafirst', file: 'indiafirst' },
  { name: 'Ageas Federal Life Insurance', slug: 'ageas-federal', file: 'ageas-federal' },
  { name: 'Aviva Life Insurance', slug: 'aviva', file: 'aviva' },
  { name: 'Edelweiss Tokio Life Insurance', slug: 'edelweiss-tokio', file: 'edelweiss-tokio' },
  { name: 'Bandhan Life Insurance', slug: 'bandhan-life', file: 'bandhan-life' },
  { name: 'Bharti AXA Life Insurance', slug: 'bharti-axa', file: 'bharti-axa' },
  { name: 'Future Generali India Life Insurance', slug: 'future-generali', file: 'future-generali' },
  { name: 'Pramerica Life Insurance', slug: 'pramerica', file: 'pramerica' },
  { name: 'Star Union Dai-ichi Life Insurance', slug: 'sud-life', file: 'sud-life' },
  { name: 'Shriram Life Insurance', slug: 'shriram-life', file: 'shriram-life' },
  { name: 'Reliance Nippon Life Insurance', slug: 'reliance-nippon', file: 'reliance-nippon' },
] as const

const healthInsurancePartnerMeta = [
  { name: 'Care Health Insurance', slug: 'care', file: 'care' },
  { name: 'HDFC ERGO', slug: 'hdfc-ergo', file: 'hdfc-ergo' },
  { name: 'Niva Bupa Health Insurance', slug: 'niva-bupa', file: 'niva-bupa' },
  { name: 'ICICI Lombard', slug: 'icici-lombard', file: 'icici-lombard' },
  { name: 'Tata AIG', slug: 'tata-aig', file: 'tata-aig' },
  { name: 'Star Health Insurance', slug: 'star-health', file: 'star-health' },
  { name: 'Bajaj Allianz General Insurance', slug: 'bajaj-allianz-gi', file: 'bajaj-allianz-gi' },
  { name: 'SBI General Insurance', slug: 'sbi-general', file: 'sbi-general' },
  { name: 'Reliance General Insurance', slug: 'reliance-general', file: 'reliance-general' },
  { name: 'ManipalCigna Health Insurance', slug: 'manipalcigna', file: 'manipalcigna' },
  { name: 'ACKO General Insurance', slug: 'acko', file: 'acko' },
  { name: 'Digit Insurance', slug: 'digit', file: 'digit' },
  { name: 'Go Digit General Insurance', slug: 'go-digit', file: 'go-digit' },
  { name: 'Future Generali General Insurance', slug: 'future-generali-gi', file: 'future-generali-gi' },
  { name: 'Kotak General Insurance', slug: 'kotak-general', file: 'kotak-general' },
  { name: 'Liberty General Insurance', slug: 'liberty-general', file: 'liberty-general' },
  { name: 'Royal Sundaram', slug: 'royal-sundaram', file: 'royal-sundaram' },
  { name: 'National Insurance', slug: 'national-insurance', file: 'national-insurance' },
  { name: 'New India Assurance', slug: 'new-india', file: 'new-india' },
  { name: 'Oriental Insurance', slug: 'oriental', file: 'oriental' },
  { name: 'United India Insurance', slug: 'united-india', file: 'united-india' },
  { name: 'IFFCO Tokio General Insurance', slug: 'iffco-tokio', file: 'iffco-tokio' },
  { name: 'Cholamandalam MS General Insurance', slug: 'chola-ms', file: 'chola-ms' },
  { name: 'Shriram General Insurance', slug: 'shriram-gi', file: 'shriram-gi' },
] as const

export const termInsurancePartners = termInsurancePartnerMeta
  .filter((p) => logosByFile[p.file])
  .map((p) => ({ name: p.name, slug: p.slug, logo: logosByFile[p.file] }))

export const healthInsurancePartners = healthInsurancePartnerMeta
  .filter((p) => logosByFile[p.file])
  .map((p) => ({ name: p.name, slug: p.slug, logo: logosByFile[p.file] }))

// For the generic insurance page, we combine both lists, keeping unique ones.
export const insurancePartners = [...termInsurancePartners, ...healthInsurancePartners].filter(
  (partner, index, self) => index === self.findIndex((p) => p.slug === partner.slug)
)

export function resolvePartnerLogo(slug: string): string {
  return clientLogoBySlug[slug] ?? `/amc/${slug}.svg`
}
