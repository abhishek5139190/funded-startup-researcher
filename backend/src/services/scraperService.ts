import type { Company, SearchFilters } from '../types';
import { SEED_COMPANIES, withLogo } from '../data/seedCompanies';
import { predictHiringConfidence } from '../agents/hiringAgent';
import { searchMultiSource } from './multiSourceSearch';

const CACHE_TTL_MS = 60 * 60 * 1000;
const inMemoryCache = new Map<string, { companies: Company[]; cachedAt: number }>();

type FilterableCompany = Pick<Company, 'name' | 'industry' | 'latest_funding_round' | 'country' | 'region'>;

function matchesFilters(company: FilterableCompany, filters: SearchFilters): boolean {
  if (filters.company_name?.trim()) {
    const needle = filters.company_name.trim().toLowerCase();
    if (!company.name.toLowerCase().includes(needle)) return false;
  }
  if (filters.sector.length > 0 && !company.industry.some((i) => filters.sector.includes(i))) return false;
  if (filters.stage.length > 0 && !filters.stage.includes(company.latest_funding_round.stage)) return false;
  if (
    filters.geography.length > 0 &&
    !filters.geography.includes(company.country) &&
    !filters.geography.includes(company.region)
  )
    return false;
  if (filters.funding_min_max) {
    const [min, max] = filters.funding_min_max;
    const amountM = company.latest_funding_round.amount / 1_000_000;
    if (amountM < min || amountM > max) return false;
  }
  return true;
}

export async function scrapeCompanies(filters: SearchFilters): Promise<Company[]> {
  const cacheKey = JSON.stringify(filters);
  const cached = inMemoryCache.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.companies;
  }

  const live = await searchMultiSource(filters);
  const baseCompanies =
    live !== null
      ? live.filter((c) => matchesFilters(c, filters))
      : SEED_COMPANIES.filter((c) => matchesFilters(c, filters)).map(withLogo);

  const companies: Company[] = await Promise.all(
    baseCompanies.map(async (c) => ({
      ...c,
      hiring_confidence: await predictHiringConfidence(c as Company),
    })),
  );

  inMemoryCache.set(cacheKey, { companies, cachedAt: Date.now() });
  return companies;
}

export function clearScraperCache(): number {
  const count = inMemoryCache.size;
  inMemoryCache.clear();
  return count;
}

export function getScraperCacheStats(): { count: number; sizeMb: number } {
  let sizeBytes = 0;
  for (const entry of inMemoryCache.values()) sizeBytes += JSON.stringify(entry.companies).length;
  return { count: inMemoryCache.size, sizeMb: sizeBytes / (1024 * 1024) };
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const seed = SEED_COMPANIES.find((c) => c.id === id);
  if (!seed) return null;
  const withLogoData = withLogo(seed);
  const hiring_confidence = await predictHiringConfidence(withLogoData as Company);
  return { ...withLogoData, hiring_confidence };
}
