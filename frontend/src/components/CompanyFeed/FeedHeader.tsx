import { timeAgo } from './CacheIndicator';

interface FeedHeaderProps {
  resultsCount: number;
  cachedAt: string | null;
  isCached: boolean;
  isStale: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  onNewSearch: () => void;
}

export function FeedHeader({
  resultsCount,
  cachedAt,
  isCached,
  isStale,
  isLoading,
  onRefresh,
  onNewSearch,
}: FeedHeaderProps) {
  let status = '';
  if (isLoading) status = '⏳ Searching…';
  else if (isStale) status = '🟡 Update available';
  else if (isCached && cachedAt) status = `📦 Cached (${timeAgo(cachedAt)})`;
  else if (cachedAt) status = `🟢 Updated ${timeAgo(cachedAt)}`;

  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Results ({resultsCount} companies)</h2>
        {status && <p className="text-sm text-gray-500">{status}</p>}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`min-h-[44px] rounded-lg border px-4 py-2 text-sm font-medium transition disabled:opacity-60 ${
            isStale
              ? 'border-amber-500 bg-amber-50 text-amber-700'
              : 'border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600'
          }`}
        >
          🔄 Refresh
        </button>
        <button
          onClick={onNewSearch}
          className="min-h-[44px] rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          🔍 New Search
        </button>
      </div>
    </div>
  );
}
