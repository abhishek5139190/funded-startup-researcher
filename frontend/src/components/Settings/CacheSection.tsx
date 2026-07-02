import { useState } from 'react';
import { getCacheStats } from '../../utils/cacheManager';

interface CacheSectionProps {
  onClearCache: () => void;
  onSyncNow: () => void;
}

export function CacheSection({ onClearCache, onSyncNow }: CacheSectionProps) {
  const [stats, setStats] = useState(() => getCacheStats());
  const [message, setMessage] = useState<string | null>(null);

  const refreshStats = () => setStats(getCacheStats());

  const handleClear = () => {
    onClearCache();
    refreshStats();
    setMessage('Cache cleared.');
    setTimeout(() => setMessage(null), 2000);
  };

  const handleSync = () => {
    onSyncNow();
    refreshStats();
    setMessage('Sync triggered — caches refreshed on next search.');
    setTimeout(() => setMessage(null), 2500);
  };

  return (
    <section className="mt-8 border-t border-gray-100 pt-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">💾 Cache & Storage</h3>
      <p className="mt-2 text-sm text-gray-600">
        ✓ Cache feed results locally (saves API calls, max 100 companies per search)
      </p>
      <p className="mt-1 text-sm text-gray-500">
        {stats.count} searches cached · {stats.sizeMb.toFixed(2)} MB
      </p>

      {message && <p className="mt-2 text-sm text-emerald-600">{message}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={handleClear}
          className="min-h-[44px] rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-red-400 hover:text-red-600"
        >
          Clear Cache
        </button>
        <button
          onClick={handleSync}
          className="min-h-[44px] rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
        >
          Sync Now
        </button>
      </div>
    </section>
  );
}
