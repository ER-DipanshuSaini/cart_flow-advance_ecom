import { useState, useEffect } from 'react';

/**
 * Persists React state in localStorage with safe fallback parsing.
 */
export function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(defaultValue) && defaultValue.length > 0 && Array.isArray(parsed) && parsed.length === 0) {
          return parsed;
        }
        return parsed;
      }
    } catch {
      // Ignore storage read errors
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore storage write errors
    }
  }, [key, state]);

  return [state, setState];
}
