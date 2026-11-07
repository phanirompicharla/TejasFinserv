import { siteConfig } from './siteConfig'
import { sampleNavData } from '../data/navData'

interface WebMcpTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute: (params: Record<string, unknown>) => Promise<Record<string, unknown>>
}

interface ModelContext {
  registerTool: (tool: WebMcpTool) => void
}

declare global {
  interface Navigator {
    modelContext?: ModelContext
  }
}

export function registerWebMcpTools(): boolean {
  if (typeof window === 'undefined') return false

  // Feature detection: WebMCP Browser API
  const modelContext = navigator.modelContext
  if (!modelContext || typeof modelContext.registerTool !== 'function') {
    // API not yet supported in current browser runtime (standard behavior)
    return false
  }

  try {
    // Tool 1: Get Business Information
    modelContext.registerTool({
      name: 'get_business_info',
      description: 'Retrieve verified public business and regulatory details for Tejas Finserv (ARN-251896)',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      execute: async () => {
        return {
          name: siteConfig.name,
          tagline: siteConfig.tagline,
          arn: siteConfig.regulatory.arn,
          registration: siteConfig.regulatory.registrationLabel,
          founder: siteConfig.advisor.name,
          phone: siteConfig.contact.phone,
          email: siteConfig.contact.email,
          address: siteConfig.contact.address,
          verifiedProfiles: [
            siteConfig.social.linkedin,
            siteConfig.advisor.linkedinUrl,
            siteConfig.advisor.profileUrl,
          ].filter(Boolean),
        }
      },
    })

    // Tool 2: List Financial Services
    modelContext.registerTool({
      name: 'get_services',
      description: 'Retrieve the list of public financial advisory services, calculators, and insurance offerings.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      execute: async () => {
        return {
          services: siteConfig.services.map((s) => ({
            title: s.title,
            description: s.description,
            url: `https://tejasfinserv.com${s.path}`,
          })),
          amcPartnersCount: siteConfig.stats.amcs,
          schemesCount: siteConfig.stats.schemes,
          calculatorsAvailable: siteConfig.stats.calculators,
        }
      },
    })

    // Tool 3: Get Mutual Fund NAV Information
    modelContext.registerTool({
      name: 'get_scheme_nav',
      description: 'Search Net Asset Value (NAV) for mutual fund schemes in India by scheme name or code.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Scheme name, code, or fund house keyword (e.g. "Parag Parikh", "SBI", "HDFC")',
          },
        },
        required: ['query'],
      },
      execute: async (params: Record<string, unknown>) => {
        const query = typeof params.query === 'string' ? params.query.toLowerCase().trim() : ''
        const matches = sampleNavData
          .filter(
            (s) =>
              s.name.toLowerCase().includes(query) ||
              s.code.includes(query) ||
              s.amc.toLowerCase().includes(query)
          )
          .slice(0, 5)

        return {
          query,
          count: matches.length,
          schemes: matches,
        }
      },
    })

    return true
  } catch (err) {
    console.warn('[WebMCP] Tool registration failed:', err)
    return false
  }
}

