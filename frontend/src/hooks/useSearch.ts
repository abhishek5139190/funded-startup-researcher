import { useCallback, useState } from 'react';
import type { Company, SearchFilters } from '../types';
import { search as apiSearch } from '../api/client';
import { useSearchCache } from './useSearchCache';

interface UseSearchState {
  results: Company[];
  count: number;
  loading: boolean;
  error: string | null;
  isCached: boolean;
  cachedAt: string | null;
}

export function useSearch() {
  const [state, setState] = useState<UseSearchState>({
    results: [],
    count: 0,
    loading: false,
    error: null,
    isCached: false,
    cachedAt: null,
  });
  const [lastFilters, setLastFilters] = useState<SearchFilters | null>(null);
  const { getCachedSearch, cacheSearch } = useSearchCache();

  const runSearch = useCallback(
    async (filters: SearchFilters, opts: { forceRefresh?: boolean } = {}) => {
      setLastFilters(filters);
      setState((s) => ({ ...s, loading: true, error: null }));

      if (!opts.forceRefresh) {
        const cached = getCachedSearch(filters);
        if (cached && cached.is_fresh) {
          setState({
            results: cached.results,
            count: cached.count,
            loading: false,
            error: null,
            isCached: true,
            cachedAt: cached.cached_at,
          });
          return;
        }
      }

      try {
        const result = await apiSearch(filters);
        cacheSearch(filters, result.companies);
        setState({
          results: result.companies,
          count: result.count,
          loading: false,
          error: null,
          isCached: false,
          cachedAt: new Date().toISOString(),
        });
      } catch {
        setState((s) => ({ ...s, loading: false, error: 'Search failed. Please try again.' }));
      }
    },
    [getCachedSearch, cacheSearch],
  );

  const refetch = useCallback(() => {
    if (lastFilters) return runSearch(lastFilters, { forceRefresh: true });
  }, [lastFilters, runSearch]);

  return { ...state, search: runSearch, refetch };
}
