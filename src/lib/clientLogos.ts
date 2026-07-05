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

const insurancePartnerMeta = [
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

export const insurancePartners = insurancePartnerMeta
  .filter((p) => logosByFile[p.file])
  .map((p) => ({ name: p.name, slug: p.slug, logo: logosByFile[p.file] }))

export function resolvePartnerLogo(slug: string): string {
  return clientLogoBySlug[slug] ?? `/amc/${slug}.svg`
}
