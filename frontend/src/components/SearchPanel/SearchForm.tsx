import { useState } from 'react';
import type { FormEvent } from 'react';
import type { SearchFilters } from '../../types';
import { COUNTRIES, NEWS_TYPES, SECTORS, STAGES } from '../../data/options';
import { PillMultiSelect } from '../common/PillMultiSelect';

interface SearchFormProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  onSubmit: (filters: SearchFilters) => void;
  isLoading: boolean;
}

export function SearchForm({ filters, setFilters, onSubmit, isLoading }: SearchFormProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!filters.company_name?.trim() && filters.sector.length === 0 && filters.geography.length === 0) {
      setError('Enter a company name, or select at least one sector or geography to search.');
      return;
    }
    setError(null);
    onSubmit(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
          Company Name
        </label>
        <input
          id="company_name"
          type="text"
          value={filters.company_name ?? ''}
          onChange={(e) => setFilters({ ...filters, company_name: e.target.value })}
          placeholder="e.g. NimbusAI"
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <PillMultiSelect
        label="Domain / Sector"
        options={SECTORS}
        selected={filters.sector}
        onChange={(sector) => setFilters({ ...filters, sector })}
      />

      <PillMultiSelect
        label="Company Stage"
        options={STAGES}
        selected={filters.stage}
        onChange={(stage) => setFilters({ ...filters, stage: stage as SearchFilters['stage'] })}
      />

      <div>
        <span className="block text-sm font-medium text-gray-700">News Type</span>
        <div className="mt-2 flex flex-wrap gap-3">
          {NEWS_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-1.5 text-sm text-gray-700">
              <input
                type="radio"
                name="news_type"
                checked={filters.news_type === type}
                onChange={() => setFilters({ ...filters, news_type: type })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <PillMultiSelect
        label="Geography — Country"
        options={COUNTRIES}
        selected={filters.geography}
        onChange={(geography) => setFilters({ ...filters, geography })}
      />

      <div>
        <span className="block text-sm font-medium text-gray-700">Funding Range ($M)</span>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.funding_min_max?.[0] ?? ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                funding_min_max: [Number(e.target.value) || 0, filters.funding_min_max?.[1] ?? 1000],
              })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.funding_min_max?.[1] ?? ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                funding_min_max: [filters.funding_min_max?.[0] ?? 0, Number(e.target.value) || 0],
              })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
