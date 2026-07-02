import { useState } from 'react';
import type { UserProfile } from '../../types';

interface UserMenuProps {
  profile: UserProfile;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export function UserMenu({ profile, onOpenSettings, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-indigo-300"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
          {profile.name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:inline">{profile.name}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <button
              onClick={() => {
                setOpen(false);
                onOpenSettings();
              }}
              className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-gray-50"
            >
              Reset Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
}
