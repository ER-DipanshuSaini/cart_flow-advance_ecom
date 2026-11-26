import React, { useEffect, useRef } from 'react';
import { Check, Edit2, Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button/Button';
import './AccordionPointList.css';

/**
 * Reusable Click-to-Edit Accordion List with outside-click auto-collapse,
 * required field indicators, max item cap, and per-field character limits.
 */
export default function AccordionPointList({
  items = [],
  expandedIdx = null,
  onExpandChange,
  onAdd,
  onUpdate,
  onRemove,
  titleKey = 'title',
  descKey = 'description',
  untitledLabel = 'Untitled item',
  emptyDescLabel = 'Required - click to add details',
  titlePlaceholder = 'Heading *',
  descPlaceholder = 'Description *',
  maxItems = 20,
  maxTitleChars = 50,
  maxDescChars = 180,
  addButtonLabel = 'Add Item',
  unitLabel = 'items',
  error = '',
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onExpandChange(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onExpandChange]);

  return (
    <div className="cf-acc-list-wrap" ref={containerRef}>
      <div className="cf-acc-scroll-list">
        {items.map((item, idx) => {
          const isExpanded = expandedIdx === idx;
          const titleVal = String(item?.[titleKey] || '');
          const descVal = String(item?.[descKey] || '');
          const missingTitle = !titleVal.trim();
          const missingDesc = !descVal.trim();
          const hasItemError = Boolean(error) && (missingTitle || missingDesc);

          return (
            <div
              key={idx}
              className={`cf-acc-item ${isExpanded ? 'is-expanded' : ''} ${hasItemError ? 'has-error' : ''
                }`}
            >
              {isExpanded ? (
                <div className="cf-acc-edit-box">
                  <div className="cf-acc-edit-top">
                    <span className="cf-acc-idx is-active">{idx + 1}</span>
                    <input
                      type="text"
                      autoFocus
                      required
                      maxLength={maxTitleChars}
                      className={`cf-ui-input cf-acc-edit-title ${hasItemError && missingTitle ? 'has-error' : ''
                        }`}
                      placeholder={titlePlaceholder}
                      value={titleVal}
                      onChange={(e) =>
                        onUpdate(idx, titleKey, e.target.value.slice(0, maxTitleChars))
                      }
                    />
                    <div className="cf-acc-actions">
                      <button
                        type="button"
                        className="cf-admin-icon-action-btn is-confirm"
                        onClick={() => onExpandChange(null)}
                        title="Done editing"
                        aria-label="Done editing"
                      >
                        <Check size={13} />
                      </button>
                      <button
                        type="button"
                        className="cf-admin-icon-action-btn is-danger"
                        onClick={() => onRemove(idx)}
                        title="Delete item"
                        aria-label="Delete item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    required
                    maxLength={maxDescChars}
                    className={`cf-ui-textarea cf-acc-edit-desc ${hasItemError && missingDesc ? 'has-error' : ''
                      }`}
                    placeholder={descPlaceholder}
                    value={descVal}
                    onChange={(e) =>
                      onUpdate(idx, descKey, e.target.value.slice(0, maxDescChars))
                    }
                  />
                  <div className="cf-acc-char-meta">
                    <span>* Required field</span>
                    <span>
                      {titleVal.length}/{maxTitleChars} • {descVal.length}/{maxDescChars}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="cf-acc-trigger"
                  onClick={() => onExpandChange(idx)}
                >
                  <span className="cf-acc-idx">{idx + 1}</span>
                  <div className="cf-acc-summary">
                    <strong>
                      {titleVal.trim() || untitledLabel}
                      <em className="cf-acc-req-dot">*</em>
                    </strong>
                    <span>{descVal.trim() || emptyDescLabel}</span>
                  </div>
                  <div className="cf-acc-actions">
                    <button
                      type="button"
                      className="cf-admin-icon-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onExpandChange(idx);
                      }}
                      title="Edit"
                      aria-label="Edit item"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      className="cf-admin-icon-action-btn is-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(idx);
                      }}
                      title="Delete"
                      aria-label="Delete item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <span className="cf-ui-field-error">{error}</span>}

      <div className="cf-acc-footer">
        <Button
          type="button"
          size="sm"
          variant="outline"
          icon={Plus}
          disabled={items.length >= maxItems}
          onClick={onAdd}
        >
          {addButtonLabel}
        </Button>
        <span className="cf-acc-counter">
          {items.length} / {maxItems} max {unitLabel}
        </span>
      </div>
    </div>
  );
}
