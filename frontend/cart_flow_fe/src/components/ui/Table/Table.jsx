import React from 'react';
import Pagination from './Pagination';
import './Table.css';

/**
 * Reusable Data Table Component
 */
export default function Table({
  columns = [],
  data = [],
  keyField = 'id',
  onRowClick,
  emptyMessage = 'No data available',
  pagination, // optional pagination props
  className = '',
}) {
  return (
    <div className={`cf-ui-table-container-card ${className}`}>
      <div className="cf-ui-table-wrapper">
        <table className="cf-ui-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  style={{ width: col.width, textAlign: col.align || 'left' }}
                  className={col.headerClassName || ''}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="cf-ui-table-empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row[keyField] || rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={onRowClick ? 'is-clickable' : ''}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.key || colIndex}
                      style={{ textAlign: col.align || 'left' }}
                      className={col.cellClassName || ''}
                    >
                      {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && <Pagination {...pagination} />}
    </div>
  );
}

Table.Pagination = Pagination;
