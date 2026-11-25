import { useState, useEffect, useMemo } from 'react';

/**
 * Reusable client-side pagination hook with automatic page clamping when items change.
 */
export function usePaginatedList(items = [], pageSize = 4) {
  const [page, setPage] = useState(1);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return {
    page,
    setPage,
    pageSize,
    totalItems,
    totalPages,
    paginatedItems,
  };
}
