import { useState } from 'react';
import type { UserProfile } from '../../types';
import { validateAbout, validateEmail, validateName } from '../../utils/validators';

interface ProfileSectionProps {
  profile: UserProfile;
  onUpdate: (partial: Partial<UserProfile>) => void;
  onResetAll: () => void;
  onDeleteProfile: () => void;
}

type Field = 'name' | 'email' | 'about';

export function ProfileSection({ profile, onUpdate, onResetAll, onDeleteProfile }: ProfileSectionProps) {
  const [editing, setEditing] = useState<Field | null>(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const startEdit = (field: Field) => {
    setEditing(field);
    setDraft(profile[field]);
    setError(null);
  };

  const save = () => {
    if (editing === 'name' && !validateName(draft)) return setError('Name must be at least 2 characters.');
    if (editing === 'email' && !validateEmail(draft)) return setError('Enter a valid email address.');
    if (editing === 'about' && !validateAbout(draft)) return setError('About must be 200 characters or fewer.');
    if (editing) onUpdate({ [editing]: draft });
    setEditing(null);
    setError(null);
  };

  const row = (label: string, field: Field, value: string) => (
    <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        {editing === field ? (
          <div className="mt-1 space-y-1">
            {field === 'about' ? (
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={200}
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            ) : (
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            )}
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        ) : (
          <p className="truncate font-medium text-gray-800">{value || '—'}</p>
        )}
      </div>
      {editing === field ? (
        <div className="flex gap-2">
          <button onClick={save} className="min-h-[40px] rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white">
            Save
          </button>
          <button
            onClick={() => setEditing(null)}
            className="min-h-[40px] rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => startEdit(field)}
          className="min-h-[40px] self-start rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-indigo-400 hover:text-indigo-600 sm:self-auto"
        >
          Edit
        </button>
      )}
    </div>
  );

  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">👤 Profile Information</h3>
      <div className="mt-2 divide-y divide-gray-100">
        {row('Name', 'name', profile.name)}
        {row('Email', 'email', profile.email)}
        {row('About', 'about', profile.about)}
        <div className="py-3">
          <p className="text-xs text-gray-400">Member Since</p>
          <p className="font-medium text-gray-800">
            {new Date(profile.created_at).toLocaleDateString(undefined, {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={onResetAll}
          className="min-h-[44px] rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-amber-400 hover:text-amber-600"
        >
          Reset All
        </button>
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Delete profile and all cache?</span>
            <button
              onClick={onDeleteProfile}
              className="min-h-[44px] rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="min-h-[44px] rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="min-h-[44px] rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete Profile
          </button>
        )}
      </div>
    </section>
  );
}
