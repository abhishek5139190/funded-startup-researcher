import { describe, it, expect, beforeEach } from 'vitest';
import {
  CACHE_PREFIX,
  clearAllCaches,
  createCacheEntry,
  generateCacheKey,
  getAllCaches,
  getCachedSearch,
  isCacheValid,
  saveCachedSearch,
} from '../utils/cacheManager';
import type { Company, SearchFilters } from '../types';

const filters: SearchFilters = { sector: ['AI/ML'], stage: [], news_type: 'Funding', geography: [] };

const company: Company = {
  id: 'c1',
  name: 'TestCo',
  logo_url: '',
  tagline: '',
  website: '',
  description: '',
  latest_funding_round: { amount: 1, currency: 'USD', date: new Date().toISOString(), stage: 'Seed', investors: [] },
  country: 'US',
  region: 'North America',
  city: 'SF',
  industry: ['AI/ML'],
  team_size: 1,
  hiring_confidence: { percent: 50, updated_at: '', reasoning: '', signals: { positive: [], negative: [] } },
  recent_news: [],
  job_postings: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  source_urls: [],
};

beforeEach(() => {
  window.localStorage.clear();
});

describe('generateCacheKey', () => {
  it('produces the same key regardless of array order', () => {
    const a = generateCacheKey({ ...filters, sector: ['AI/ML', 'FinTech'] });
    const b = generateCacheKey({ ...filters, sector: ['FinTech', 'AI/ML'] });
    expect(a).toBe(b);
  });

  it('produces different keys for different filters', () => {
    const a = generateCacheKey(filters);
    const b = generateCacheKey({ ...filters, sector: ['FinTech'] });
    expect(a).not.toBe(b);
  });

  it('is prefixed correctly', () => {
    expect(generateCacheKey(filters).startsWith(CACHE_PREFIX)).toBe(true);
  });

  it('produces different keys for different company_name searches', () => {
    const a = generateCacheKey({ ...filters, company_name: 'NimbusAI' });
    const b = generateCacheKey({ ...filters, company_name: 'Fraudwall' });
    expect(a).not.toBe(b);
  });

  it('treats company_name case-insensitively for cache key purposes', () => {
    const a = generateCacheKey({ ...filters, company_name: 'NimbusAI' });
    const b = generateCacheKey({ ...filters, company_name: 'nimbusai' });
    expect(a).toBe(b);
  });
});

describe('cache persistence', () => {
  it('round-trips a cache entry through localStorage', () => {
    const entry = createCacheEntry(filters, [company]);
    saveCachedSearch(entry);

    const loaded = getCachedSearch(entry.cache_key);
    expect(loaded).not.toBeNull();
    expect(loaded?.results).toHaveLength(1);
    expect(loaded?.results[0].name).toBe('TestCo');
  });

  it('marks a fresh entry as valid', () => {
    const entry = createCacheEntry(filters, [company]);
    expect(isCacheValid(entry)).toBe(true);
  });

  it('marks an expired entry as invalid', () => {
    const entry = createCacheEntry(filters, [company]);
    entry.expires_at = new Date(Date.now() - 1000).toISOString();
    expect(isCacheValid(entry)).toBe(false);
  });

  it('clearAllCaches removes every search_cache_ key', () => {
    saveCachedSearch(createCacheEntry(filters, [company]));
    saveCachedSearch(createCacheEntry({ ...filters, sector: ['FinTech'] }, [company]));
    expect(getAllCaches().length).toBe(2);

    const cleared = clearAllCaches();
    expect(cleared).toBe(2);
    expect(getAllCaches().length).toBe(0);
  });
});
