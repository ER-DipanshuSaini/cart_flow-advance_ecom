import React from 'react';
import './Button.css';

/**
 * Reusable Button Component
 * Variants: 'primary' (green neon / high contrast), 'secondary' (dark slate), 'outline', 'danger', 'ghost'
 * Sizes: 'sm', 'md', 'lg'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  icon: Icon,
  iconRight: IconRight,
  className = '',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`cf-ui-btn cf-ui-btn-${variant} cf-ui-btn-${size} ${className}`}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="cf-ui-spinner" />}
      {!loading && Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      {children && <span>{children}</span>}
      {!loading && IconRight && <IconRight size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
    </button>
  );
}
