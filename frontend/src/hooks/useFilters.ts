import { useCallback, useState } from 'react';
import type { SearchFilters } from '../types';

const DEFAULT_FILTERS: SearchFilters = {
  sector: [],
  stage: [],
  news_type: 'Funding',
  geography: [],
};

export function useFilters() {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return { filters, setFilters, resetFilters };
}
