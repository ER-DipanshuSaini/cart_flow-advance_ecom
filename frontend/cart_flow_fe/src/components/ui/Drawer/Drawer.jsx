import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Drawer.css';

/**
 * Reusable Right-Side Drawer / Slide-Over Sidebar
 * Ideal for Cart Drawer, Filter Sidebars, Navigation Drawers, and Quick-Views
 */
export default function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = '420px',
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

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="cf-ui-drawer-overlay" onClick={onClose}>
      <div
        className={`cf-ui-drawer-panel ${className}`}
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="cf-drawer-header">
          <div className="cf-drawer-title-group">
            {title && <h3 className="cf-drawer-title">{title}</h3>}
            {subtitle && <p className="cf-drawer-subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="cf-drawer-close-btn"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="cf-drawer-body">{children}</div>

        {/* Drawer Footer (Sticky Bottom Actions) */}
        {footer && <div className="cf-drawer-footer">{footer}</div>}
      </div>
    </div>
  );
}

Drawer.Header = function DrawerHeader({ children, className = '' }) {
  return <div className={`cf-drawer-header ${className}`}>{children}</div>;
};

Drawer.Body = function DrawerBody({ children, className = '' }) {
  return <div className={`cf-drawer-body ${className}`}>{children}</div>;
};

Drawer.Footer = function DrawerFooter({ children, className = '' }) {
  return <div className={`cf-drawer-footer ${className}`}>{children}</div>;
};
