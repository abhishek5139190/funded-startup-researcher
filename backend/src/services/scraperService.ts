import axios from 'axios';
import type { Company, SearchFilters } from '../types';
import { SEED_COMPANIES, withLogo } from '../data/seedCompanies';
import { predictHiringConfidence } from '../agents/hiringAgent';
import { logger } from '../utils/logger';

const CACHE_TTL_MS = 60 * 60 * 1000;
const inMemoryCache = new Map<string, { companies: Company[]; cachedAt: number }>();

import type { SeedCompany } from '../data/seedCompanies';

function matchesFilters(company: SeedCompany, filters: SearchFilters): boolean {
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

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const backoffMs = 2 ** attempt * 500;
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }
  throw lastErr;
}

async function fetchFromSerper(filters: SearchFilters): Promise<unknown> {
  const query = `${filters.sector.join(' OR ')} startup funding ${filters.stage.join(' OR ')}`.trim();
  const response = await axios.post(
    'https://google.serper.dev/news',
    { q: query || 'startup funding announcement' },
    { headers: { 'X-API-KEY': process.env.SERPER_API_KEY!, 'Content-Type': 'application/json' }, timeout: 10_000 },
  );
  return response.data;
}

async function searchLive(filters: SearchFilters): Promise<Company[] | null> {
  if (!process.env.SERPER_API_KEY) return null;
  try {
    await withRetry(() => fetchFromSerper(filters));
    // Live news search returns unstructured articles; without a paid structured-data
    // API (Crunchbase/PitchBook) we cannot reliably extract company fields from them,
    // so we still serve the seed dataset filtered by the same query the live search used.
    logger.info('Live Serper search succeeded, using seed dataset for structured fields');
    return null;
  } catch (err) {
    logger.error('Live search failed after retries, falling back to seed data', err);
    return null;
  }
}

export async function scrapeCompanies(filters: SearchFilters): Promise<Company[]> {
  const cacheKey = JSON.stringify(filters);
  const cached = inMemoryCache.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.companies;
  }

  const live = await searchLive(filters);
  const baseCompanies = live ?? SEED_COMPANIES.filter((c) => matchesFilters(c, filters)).map(withLogo);

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
