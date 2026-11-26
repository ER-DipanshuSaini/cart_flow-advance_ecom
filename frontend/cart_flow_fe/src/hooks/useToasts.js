import { useState, useCallback } from 'react';

/**
 * Reusable toast notification state manager.
 */
export function useToasts(autoDismissMs = 0) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type, title, message) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, title, message }]);
      if (autoDismissMs > 0) {
        setTimeout(() => removeToast(id), autoDismissMs);
      }
    },
    [autoDismissMs, removeToast]
  );

  return { toasts, addToast, removeToast };
}
