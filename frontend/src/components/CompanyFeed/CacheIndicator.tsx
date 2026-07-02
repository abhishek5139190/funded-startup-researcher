function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface CacheIndicatorProps {
  cachedAt?: string;
}

export function CacheIndicator({ cachedAt }: CacheIndicatorProps) {
  if (!cachedAt) return null;
  return (
    <p className="text-xs text-gray-400">
      📦 Cached locally · Last refreshed: {timeAgo(cachedAt)}
    </p>
  );
}

export { timeAgo };
