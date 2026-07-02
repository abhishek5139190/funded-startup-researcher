import { describe, it, expect } from 'vitest';
import { validateFilters } from '../utils/validateFilters';

describe('validateFilters', () => {
  it('rejects null body', () => {
    expect(validateFilters(null).valid).toBe(false);
  });

  it('rejects non-object body', () => {
    expect(validateFilters('nope').valid).toBe(false);
  });

  it('defaults to empty arrays and Funding news type', () => {
    const { filters } = validateFilters({});
    expect(filters).toEqual({
      sector: [],
      stage: [],
      news_type: 'Funding',
      geography: [],
      funding_min_max: undefined,
    });
  });

  it('drops invalid stage values', () => {
    const { filters } = validateFilters({ stage: ['Series A', 'NotAStage'] });
    expect(filters?.stage).toEqual(['Series A']);
  });

  it('accepts a valid funding_min_max tuple', () => {
    const { filters } = validateFilters({ funding_min_max: [1, 50] });
    expect(filters?.funding_min_max).toEqual([1, 50]);
  });

  it('ignores malformed funding_min_max', () => {
    const { filters } = validateFilters({ funding_min_max: ['a', 'b'] });
    expect(filters?.funding_min_max).toBeUndefined();
  });
});
