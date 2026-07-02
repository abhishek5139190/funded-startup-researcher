import type { Company } from '../../types';
import { CompanyCard } from './CompanyCard';

interface FeedLayoutProps {
  companies: Company[];
  loading: boolean;
  error: string | null;
  isCached: boolean;
  cachedAt: string | null;
  savedIds: Set<string>;
  onViewDetails: (id: string) => void;
  onSave: (id: string) => void;
  onRetry: () => void;
  hasSearched: boolean;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="h-3 w-3/4 rounded bg-gray-200" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-2/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export function FeedLayout({
  companies,
  loading,
  error,
  isCached,
  cachedAt,
  savedIds,
  onViewDetails,
  onSave,
  onRetry,
  hasSearched,
}: FeedLayoutProps) {
  if (loading && companies.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-sm text-red-700">{error}</p>
        <button
          onClick={onRetry}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
        <p className="text-lg font-medium">Refine your search</p>
        <p className="mt-1 text-sm">
          Pick a sector or geography on the left to discover recently funded companies.
        </p>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
        <p className="text-lg font-medium">No companies found</p>
        <p className="mt-1 text-sm">Try widening your filters — fewer sectors or a broader geography.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onViewDetails={onViewDetails}
          onSave={onSave}
          saved={savedIds.has(company.id)}
          cached={isCached}
          cachedAt={cachedAt ?? undefined}
        />
      ))}
    </div>
  );
}
