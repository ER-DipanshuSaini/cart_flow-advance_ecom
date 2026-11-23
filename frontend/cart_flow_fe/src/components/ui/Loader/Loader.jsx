import React from 'react';
import './Loader.css';

/**
 * Modern Wave Equalizer Loader (Matching reference design)
 * Clean, cybernetic wave bars with smooth height oscillation
 */
export default function WaveLoader({
  className = '',
}) {
  return (
    <div className={`cf-wave-loader ${className}`} aria-label="Loading...">
      <span className="cf-wave-bar" style={{ animationDelay: '0ms' }} />
      <span className="cf-wave-bar" style={{ animationDelay: '140ms' }} />
      <span className="cf-wave-bar" style={{ animationDelay: '280ms' }} />
      <span className="cf-wave-bar" style={{ animationDelay: '420ms' }} />
      <span className="cf-wave-bar" style={{ animationDelay: '560ms' }} />
    </div>
  );
}

/**
 * Overlay Loader Container using WaveLoader
 */
export function OverlayLoader({
  message = 'Loading...',
  subtext,
  className = '',
}) {
  return (
    <div className={`cf-overlay-loader ${className}`}>
      <div className="cf-overlay-card">
        <WaveLoader />
        {message && <div className="cf-overlay-title">{message}</div>}
        {subtext && <div className="cf-overlay-sub">{subtext}</div>}
      </div>
    </div>
  );
}
