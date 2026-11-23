import React from 'react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  type = 'button',
  icon: Icon,
  className = '',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`cf-btn cf-btn-${variant} cf-btn-${size} ${className}`}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="cf-btn-spinner" />}
      {!loading && Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="cf-btn-icon" />}
      <span>{children}</span>
    </button>
  );
}
