import React from 'react';
import './Badge.css';

export default function Badge({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'info'
  size = 'md',          // 'sm' | 'md'
  className = '',
}) {
  return (
    <span className={`cf-badge cf-badge-${variant} cf-badge-${size} ${className}`}>
      {children}
    </span>
  );
}
