import { useCallback, useState } from 'react';
import type { UserProfile } from '../types';
import { safeGetItem, safeRemoveItem, safeSetItem } from '../utils/localStorage';
import { clearAllCaches } from '../utils/cacheManager';

const PROFILE_KEY = 'user_profile';

function loadProfile(): UserProfile | null {
  return safeGetItem<UserProfile>(PROFILE_KEY);
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(() => loadProfile());

  const saveProfile = useCallback((data: { name: string; email: string; about: string }) => {
    const now = new Date().toISOString();
    const newProfile: UserProfile = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      email: data.email.trim(),
      about: data.about.trim(),
      cache_enabled: true,
      created_at: now,
      last_updated_at: now,
    };
    safeSetItem(PROFILE_KEY, newProfile);
    setProfile(newProfile);
  }, []);

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setProfile((current) => {
      if (!current) return current;
      const updated: UserProfile = {
        ...current,
        ...partial,
        last_updated_at: new Date().toISOString(),
      };
      safeSetItem(PROFILE_KEY, updated);
      return updated;
    });
  }, []);

  const resetProfile = useCallback(() => {
    safeRemoveItem(PROFILE_KEY);
    setProfile(null);
  }, []);

  const deleteProfile = useCallback(() => {
    safeRemoveItem(PROFILE_KEY);
    clearAllCaches();
    setProfile(null);
  }, []);

  return { profile, saveProfile, updateProfile, resetProfile, deleteProfile };
}
