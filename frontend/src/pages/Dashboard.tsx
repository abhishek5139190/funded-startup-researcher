import { useState } from 'react';
import type { Company, UserProfile } from '../types';
import { Header } from '../components/Header/Header';
import { SearchForm } from '../components/SearchPanel/SearchForm';
import { FeedHeader } from '../components/CompanyFeed/FeedHeader';
import { FeedLayout } from '../components/CompanyFeed/FeedLayout';
import { CompanyDetailModal } from '../components/Modals/CompanyDetailModal';
import { SettingsPage } from '../components/Settings/SettingsPage';
import { useFilters } from '../hooks/useFilters';
import { useSearch } from '../hooks/useSearch';
import { useSearchCache } from '../hooks/useSearchCache';
import { CACHE_TTL_MS } from '../utils/cacheManager';

interface DashboardProps {
  profile: UserProfile;
  onUpdateProfile: (partial: Partial<UserProfile>) => void;
  onResetProfile: () => void;
  onDeleteProfile: () => void;
}

export function Dashboard({ profile, onUpdateProfile, onResetProfile, onDeleteProfile }: DashboardProps) {
  const { filters, setFilters } = useFilters();
  const { results, count, loading, error, isCached, cachedAt, search, refetch } = useSearch();
  const { clearCache } = useSearchCache();
  const [hasSearched, setHasSearched] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const handleSubmit = (nextFilters: typeof filters) => {
    setHasSearched(true);
    setSearchOpen(false);
    search(nextFilters);
  };

  const isStale = cachedAt ? Date.now() - new Date(cachedAt).getTime() > CACHE_TTL_MS : false;

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        profile={profile}
        onOpenSettings={() => setSettingsOpen(true)}
        onLogout={onResetProfile}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <aside className="hidden w-72 flex-shrink-0 lg:block">
          <div className="sticky top-20 rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Search Filters</h2>
            <SearchForm filters={filters} setFilters={setFilters} onSubmit={handleSubmit} isLoading={loading} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 space-y-4">
          <FeedHeader
            resultsCount={count}
            cachedAt={cachedAt}
            isCached={isCached}
            isStale={isStale}
            isLoading={loading}
            onRefresh={refetch}
            onNewSearch={() => setSearchOpen(true)}
          />
          <FeedLayout
            companies={results}
            loading={loading}
            error={error}
            isCached={isCached}
            cachedAt={cachedAt}
            savedIds={savedIds}
            onViewDetails={(id) => setSelectedCompany(results.find((c) => c.id === id) ?? null)}
            onSave={toggleSave}
            onRetry={refetch}
            hasSearched={hasSearched}
          />
        </main>
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 lg:hidden">
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Search Filters</h2>
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <SearchForm filters={filters} setFilters={setFilters} onSubmit={handleSubmit} isLoading={loading} />
          </div>
        </div>
      )}

      <CompanyDetailModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />

      {settingsOpen && (
        <SettingsPage
          profile={profile}
          onUpdate={onUpdateProfile}
          onResetAll={() => {
            setSettingsOpen(false);
            onResetProfile();
          }}
          onDeleteProfile={() => {
            setSettingsOpen(false);
            onDeleteProfile();
          }}
          onClearCache={() => clearCache()}
          onSyncNow={refetch}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
