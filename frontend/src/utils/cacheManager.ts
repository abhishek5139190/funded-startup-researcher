import type { Company, SearchCache, SearchFilters } from '../types';
import { getAllKeysWithPrefix, safeGetItem, safeRemoveItem, safeSetItem } from './localStorage';

export const CACHE_PREFIX = 'search_cache_';
export const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
export const MAX_COMPANIES_PER_CACHE = 100;
export const MAX_CACHED_SEARCHES = 20;

function hashString(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function generateCacheKey(filters: SearchFilters): string {
  const normalized = {
    company_name: filters.company_name?.trim().toLowerCase() ?? '',
    sector: [...filters.sector].sort(),
    stage: [...filters.stage].sort(),
    news_type: filters.news_type,
    geography: [...filters.geography].sort(),
    funding_min_max: filters.funding_min_max ?? null,
  };
  return `${CACHE_PREFIX}${hashString(JSON.stringify(normalized))}`;
}

export function createCacheEntry(filters: SearchFilters, results: Company[]): SearchCache {
  const now = new Date();
  const expires = new Date(now.getTime() + CACHE_TTL_MS);
  const cache_key = generateCacheKey(filters);
  return {
    cache_key,
    filters,
    results: results.slice(0, MAX_COMPANIES_PER_CACHE),
    count: results.length,
    cached_at: now.toISOString(),
    expires_at: expires.toISOString(),
    is_fresh: true,
  };
}

export function isCacheValid(cache: SearchCache): boolean {
  return new Date(cache.expires_at).getTime() > Date.now();
}

export function getCachedSearch(cacheKey: string): SearchCache | null {
  return safeGetItem<SearchCache>(cacheKey);
}

export function saveCachedSearch(cache: SearchCache): void {
  safeSetItem(cache.cache_key, cache);
  purgeExpiredCaches();
  enforceMaxCaches();
}

export function getAllCaches(): SearchCache[] {
  return getAllKeysWithPrefix(CACHE_PREFIX)
    .map((key) => safeGetItem<SearchCache>(key))
    .filter((c): c is SearchCache => c !== null);
}

export function purgeExpiredCaches(): void {
  for (const cache of getAllCaches()) {
    if (!isCacheValid(cache)) {
      safeRemoveItem(cache.cache_key);
    }
  }
}

export function enforceMaxCaches(): void {
  const caches = getAllCaches().sort(
    (a, b) => new Date(a.cached_at).getTime() - new Date(b.cached_at).getTime(),
  );
  while (caches.length > MAX_CACHED_SEARCHES) {
    const oldest = caches.shift();
    if (oldest) safeRemoveItem(oldest.cache_key);
  }
}

export function clearAllCaches(): number {
  const keys = getAllKeysWithPrefix(CACHE_PREFIX);
  keys.forEach((key) => safeRemoveItem(key));
  return keys.length;
}

export function getCacheStats() {
  const caches = getAllCaches();
  const sizeBytes = caches.reduce((sum, c) => sum + JSON.stringify(c).length, 0);
  return {
    count: caches.length,
    sizeMb: sizeBytes / (1024 * 1024),
  };
}
