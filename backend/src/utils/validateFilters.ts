import type { SearchFilters } from '../types';

const VALID_STAGES = ['Seed', 'Series A', 'Series B', 'Series C+', 'Undisclosed'];
const VALID_NEWS_TYPES = ['Funding', 'Hiring', 'Awards', 'Product Launch'];

export function validateFilters(body: unknown): { valid: boolean; error?: string; filters?: SearchFilters } {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, error: 'Request body must be an object.' };
  }
  const b = body as Record<string, unknown>;

  const sector = Array.isArray(b.sector) ? b.sector.filter((s): s is string => typeof s === 'string') : [];
  const stage = Array.isArray(b.stage)
    ? b.stage.filter((s): s is string => typeof s === 'string' && VALID_STAGES.includes(s))
    : [];
  const geography = Array.isArray(b.geography) ? b.geography.filter((s): s is string => typeof s === 'string') : [];
  const news_type = VALID_NEWS_TYPES.includes(b.news_type as string) ? (b.news_type as string) : 'Funding';

  let funding_min_max: [number, number] | undefined;
  if (Array.isArray(b.funding_min_max) && b.funding_min_max.length === 2) {
    const [min, max] = b.funding_min_max;
    if (typeof min === 'number' && typeof max === 'number') funding_min_max = [min, max];
  }

  const company_name = typeof b.company_name === 'string' ? b.company_name.slice(0, 100) : undefined;

  return {
    valid: true,
    filters: {
      company_name,
      sector,
      stage: stage as SearchFilters['stage'],
      news_type: news_type as SearchFilters['news_type'],
      geography,
      funding_min_max,
    },
  };
}
