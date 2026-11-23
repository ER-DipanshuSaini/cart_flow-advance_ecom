import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../Button/Button';
import './Modal.css';

/**
 * Reusable Modal / Dialog Component
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = '520px',
  closeOnEsc = true,
  className = '',
}) {
  useEffect(() => {
    if (!closeOnEsc || !isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cf-ui-modal-overlay" onClick={onClose}>
      <div
        className={`cf-ui-modal-container ${className}`}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="cf-ui-modal-header">
          <div>
            {title && <h3 className="cf-ui-modal-title">{title}</h3>}
            {subtitle && <p className="cf-ui-modal-subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="cf-ui-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
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
