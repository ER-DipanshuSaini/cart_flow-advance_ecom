import React from 'react';
import './Badge.css';

/**
 * Reusable Badge / Pill Component
 * Variants: 'completed' (green), 'warning' (amber), 'failed' (red), 'processing' (blue), 'neutral' (gray), 'mono' (monospace ID)
 */
export default function Badge({
  children,
  variant = 'neutral',
  dot = false,
  size = 'md',
  className = '',
}) {
  return (
    <span className={`cf-ui-badge cf-ui-badge-${variant} cf-ui-badge-${size} ${className}`}>
      {dot && <span className="cf-ui-badge-dot">•</span>}
      <span>{children}</span>
    </span>
  );
}
