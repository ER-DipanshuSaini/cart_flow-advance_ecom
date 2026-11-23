import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Table.css';

/**
 * Reusable Table Pagination Component
 */
export default function Pagination({
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  pageSizeOptions = [5, 10, 20, 50],
  onPageChange,
  onPageSizeChange,
  className = '',
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  // Generate page numbers
  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={`cf-ui-pagination ${className}`}>
      {/* Range Info & Page Size */}
      <div className="cf-pagination-left">
        <span className="cf-pagination-info">
          Showing <strong>{startItem}–{endItem}</strong> of <strong>{totalItems}</strong> entries
        </span>
        {onPageSizeChange && (
          <div className="cf-pagination-size-select">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page Navigation Buttons */}
      <div className="cf-pagination-controls">
        <button
          type="button"
          className="cf-page-btn cf-page-nav"
          disabled={currentPage <= 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          aria-label="Previous Page"
        >
          <ChevronLeft size={15} />
        </button>

        {getPages().map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className="cf-page-dots">...</span>
          ) : (
            <button
              type="button"
              key={p}
              className={`cf-page-btn ${currentPage === p ? 'is-active' : ''}`}
              onClick={() => onPageChange && onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          className="cf-page-btn cf-page-nav"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          aria-label="Next Page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
