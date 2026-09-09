export const loadFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);

    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) ? (parsed as T) : fallback;
    }

    if (fallback === null) {
      return parsed === null || (typeof parsed === 'object' && !Array.isArray(parsed))
        ? (parsed as T)
        : fallback;
    }

    if (typeof parsed !== typeof fallback) {
      return fallback;
    }

    return parsed as T;
  } catch {
    return fallback;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to persist to localStorage for ${key}`, err);
  }
};
