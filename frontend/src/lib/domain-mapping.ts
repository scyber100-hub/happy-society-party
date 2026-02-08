// Domain mapping configuration for multi-tenancy
// Maps custom domains to tenant IDs

export interface DomainMapping {
  domain: string;
  tenantId: string;
  tenantSlug: string;
  locale?: string;
}

// Domain mappings can be configured here or loaded from database/environment
// In production, this would typically come from a database or API
const domainMappings: DomainMapping[] = [
  // Main Korean site
  {
    domain: 'happysocietyparty.kr',
    tenantId: 'main-kr',
    tenantSlug: 'korea',
    locale: 'ko',
  },
  {
    domain: 'www.happysocietyparty.kr',
    tenantId: 'main-kr',
    tenantSlug: 'korea',
    locale: 'ko',
  },
  // International site
  {
    domain: 'happysocietyparty.org',
    tenantId: 'international',
    tenantSlug: 'international',
    locale: 'en',
  },
  {
    domain: 'www.happysocietyparty.org',
    tenantId: 'international',
    tenantSlug: 'international',
    locale: 'en',
  },
  // Japan chapter
  {
    domain: 'happysocietyparty.jp',
    tenantId: 'japan-chapter',
    tenantSlug: 'japan',
    locale: 'ja',
  },
  // Local development
  {
    domain: 'localhost',
    tenantId: 'main-kr',
    tenantSlug: 'korea',
    locale: 'ko',
  },
];

// Environment-based domain mappings (can override static mappings)
function loadEnvDomainMappings(): DomainMapping[] {
  const envMappings = process.env.DOMAIN_MAPPINGS;
  if (!envMappings) return [];

  try {
    return JSON.parse(envMappings);
  } catch {
    console.error('Failed to parse DOMAIN_MAPPINGS environment variable');
    return [];
  }
}

// Combined mappings (env takes precedence)
const allMappings = [...loadEnvDomainMappings(), ...domainMappings];

/**
 * Get tenant information from hostname
 */
export function getTenantFromDomain(hostname: string): DomainMapping | null {
  // Remove port if present
  const domain = hostname.split(':')[0].toLowerCase();

  // Check for exact match
  const exactMatch = allMappings.find(m => m.domain.toLowerCase() === domain);
  if (exactMatch) return exactMatch;

  // Check for wildcard subdomains (e.g., *.happysocietyparty.org)
  const wildcardMatch = allMappings.find(m => {
    if (m.domain.startsWith('*.')) {
      const baseDomain = m.domain.slice(2);
      return domain.endsWith(baseDomain) && domain !== baseDomain;
    }
    return false;
  });

  return wildcardMatch || null;
}

/**
 * Get the primary domain for a tenant
 */
export function getPrimaryDomainForTenant(tenantId: string): string | null {
  const mapping = allMappings.find(m => m.tenantId === tenantId && !m.domain.startsWith('*.'));
  return mapping?.domain || null;
}

/**
 * Check if a domain is valid for a tenant
 */
export function isDomainValidForTenant(hostname: string, tenantId: string): boolean {
  const mapping = getTenantFromDomain(hostname);
  return mapping?.tenantId === tenantId;
}

/**
 * Get all domains for a tenant
 */
export function getDomainsForTenant(tenantId: string): string[] {
  return allMappings
    .filter(m => m.tenantId === tenantId)
    .map(m => m.domain);
}

// Cookie name for tenant context
export const TENANT_COOKIE_NAME = 'hsp-tenant';
export const TENANT_HEADER_NAME = 'x-tenant-id';
