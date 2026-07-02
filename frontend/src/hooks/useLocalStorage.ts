import { safeGetItem, safeRemoveItem, safeSetItem } from '../utils/localStorage';

export function useLocalStorage() {
  return {
    getItem: <T,>(key: string) => safeGetItem<T>(key),
    setItem: (key: string, value: unknown) => safeSetItem(key, value),
    removeItem: (key: string) => safeRemoveItem(key),
  };
}
