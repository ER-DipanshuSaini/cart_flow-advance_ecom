import React from 'react';
import './Loader.css';

/**
 * Modern Content Placeholder Shimmer Skeletons
 */
export default function Skeleton({
  width = '100%',
  height = '1rem',
  radius = 'var(--cf-radius-md)',
  className = '',
  style = {},
}) {
  return (
    <div
      className={`cf-ui-skeleton ${className}`}
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

Skeleton.Circle = function SkeletonCircle({ size = 40, className = '' }) {
  return (
    <div
      className={`cf-ui-skeleton ${className}`}
      style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0 }}
    />
  );
};

Skeleton.Card = function SkeletonCard({ className = '' }) {
  return (
    <div className={`cf-ui-skeleton-card ${className}`}>
      <Skeleton height="160px" radius="6px" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
        <Skeleton width="40%" height="12px" />
        <Skeleton width="85%" height="16px" />
        <Skeleton width="60%" height="14px" />
      </div>
    </div>
  );
};
