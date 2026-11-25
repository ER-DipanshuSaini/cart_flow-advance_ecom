import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

const SIZE_MAP = {
  sm: '420px',
  md: '540px',
  lg: '720px',
  xl: '880px',
};

/**
 * Reusable Luxury Modal / Dialog Component
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  eyebrow,
  icon: Icon,
  children,
  footer,
  size = 'md',
  maxWidth,
  closeOnEsc = true,
  className = '',
}) {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (closeOnEsc && e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  const resolvedMaxWidth = maxWidth || SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      className="cf-ui-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`cf-ui-modal-container ${className}`}
        style={{ maxWidth: resolvedMaxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cf-ui-modal-drag-pill" aria-hidden="true" />

        {/* Modal Header */}
        <div className="cf-ui-modal-header">
          <div className="cf-ui-modal-header-left">
            {Icon && (
              <div className="cf-ui-modal-icon-badge">
                <Icon size={18} />
              </div>
            )}
            <div className="cf-ui-modal-titles">
              {eyebrow && <span className="cf-ui-modal-eyebrow">{eyebrow}</span>}
              {title && <h3 className="cf-ui-modal-title">{title}</h3>}
              {subtitle && <p className="cf-ui-modal-subtitle">{subtitle}</p>}
            </div>
          </div>

          <button
            type="button"
            className="cf-ui-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="cf-ui-modal-body">{children}</div>

        {/* Modal Footer */}
        {footer && <div className="cf-ui-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
