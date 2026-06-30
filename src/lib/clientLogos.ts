const clientLogoModules = import.meta.glob('../assets/client logo/*.{webp,png,jpg,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

/** Map filename (without extension) to AMC/partner slug */
const slugAliases: Record<string, string> = {
  adity: 'absl',
  icic: 'icici',
}

const insuranceOnlySlugs = new Set(['care', 'shriram'])

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
  { name: 'ICICI Lombard General Insurance', slug: 'icici-lombard', file: 'icic' },
  { name: 'Care Health Insurance', slug: 'care', file: 'care' },
  { name: 'Shriram Finance', slug: 'shriram', file: 'shriram' },
] as const

export const insurancePartners = insurancePartnerMeta
  .filter((p) => logosByFile[p.file])
  .map((p) => ({ name: p.name, slug: p.slug, logo: logosByFile[p.file] }))

export function resolvePartnerLogo(slug: string): string {
  return clientLogoBySlug[slug] ?? `/amc/${slug}.svg`
}
