import type { UserProfile } from '../../types';
import { ProfileSection } from './ProfileSection';
import { CacheSection } from './CacheSection';

interface SettingsPageProps {
  profile: UserProfile;
  onUpdate: (partial: Partial<UserProfile>) => void;
  onResetAll: () => void;
  onDeleteProfile: () => void;
  onClearCache: () => void;
  onSyncNow: () => void;
  onClose: () => void;
}

export function SettingsPage({
  profile,
  onUpdate,
  onResetAll,
  onDeleteProfile,
  onClearCache,
  onSyncNow,
  onClose,
}: SettingsPageProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/50 sm:items-center sm:p-4">
      <div className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-xl sm:h-auto sm:max-h-[85vh] sm:rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          <ProfileSection
            profile={profile}
            onUpdate={onUpdate}
            onResetAll={onResetAll}
            onDeleteProfile={onDeleteProfile}
          />
          <CacheSection onClearCache={onClearCache} onSyncNow={onSyncNow} />
        </div>
      </div>
    </div>
  );
}
