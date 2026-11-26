import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls window to the top on route transitions unless navigating to a specific hash or review view.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash || search.includes('view=user-review')) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search, hash]);

  return null;
}
