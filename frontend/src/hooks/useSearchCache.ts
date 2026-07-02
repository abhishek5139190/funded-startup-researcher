import { useCallback } from 'react';
import type { Company, SearchCache, SearchFilters } from '../types';
import {
  clearAllCaches,
  createCacheEntry,
  generateCacheKey,
  getAllCaches,
  getCachedSearch as getCachedSearchUtil,
  getCacheStats,
  isCacheValid,
  saveCachedSearch,
} from '../utils/cacheManager';
import { safeRemoveItem } from '../utils/localStorage';

export function useSearchCache() {
  const getCachedSearch = useCallback((filters: SearchFilters): SearchCache | null => {
    const key = generateCacheKey(filters);
    const cache = getCachedSearchUtil(key);
    if (!cache) return null;
    return { ...cache, is_fresh: isCacheValid(cache) };
  }, []);

  const cacheSearch = useCallback((filters: SearchFilters, results: Company[]) => {
    const entry = createCacheEntry(filters, results);
    saveCachedSearch(entry);
    return entry;
  }, []);

  const clearCache = useCallback((cacheKey?: string) => {
    if (cacheKey) {
      safeRemoveItem(cacheKey);
      return 1;
    }
    return clearAllCaches();
  }, []);

  return {
    getCachedSearch,
    cacheSearch,
    clearCache,
    getAllCaches,
    getCacheStats,
    isCacheExpired: (cache: SearchCache) => !isCacheValid(cache),
  };
}
