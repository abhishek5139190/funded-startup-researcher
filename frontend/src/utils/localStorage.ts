export function safeGetItem<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function safeRemoveItem(key: string): boolean {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getStorageSize(): number {
  let total = 0;
  for (const key in window.localStorage) {
    if (!Object.prototype.hasOwnProperty.call(window.localStorage, key)) continue;
    const value = window.localStorage.getItem(key) ?? '';
    total += key.length + value.length;
  }
  return total / (1024 * 1024);
}

export function getAllKeysWithPrefix(prefix: string): string[] {
  const keys: string[] = [];
  for (const key in window.localStorage) {
    if (Object.prototype.hasOwnProperty.call(window.localStorage, key) && key.startsWith(prefix)) {
      keys.push(key);
    }
  }
  return keys;
}
