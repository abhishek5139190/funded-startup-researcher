import type { UserProfile } from '../../types';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  profile: UserProfile;
  onOpenSettings: () => void;
  onLogout: () => void;
  onOpenSearch: () => void;
}

export function Header({ profile, onOpenSettings, onLogout, onOpenSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2">
        <span className="text-xl">🚀</span>
        <span className="text-base font-semibold text-gray-900">Funded Companies Agent</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSearch}
          className="min-h-[40px] rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-indigo-400 hover:text-indigo-600 lg:hidden"
        >
          🔍 Search
        </button>
        <UserMenu profile={profile} onOpenSettings={onOpenSettings} onLogout={onLogout} />
      </div>
    </header>
  );
}
