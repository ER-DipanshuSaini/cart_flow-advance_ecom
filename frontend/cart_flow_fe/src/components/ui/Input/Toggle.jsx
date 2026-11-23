import React from 'react';
import './Input.css';

export default function Toggle({
  checked = false,
  onChange,
  label,
  sublabel,
  disabled = false,
  id,
  className = '',
}) {
  const toggleId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`cf-ui-toggle-wrapper ${disabled ? 'is-disabled' : ''} ${className}`}>
      <label htmlFor={toggleId} className="cf-ui-toggle-switch">
        <input
          id={toggleId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.checked)}
        />
        <span className="cf-ui-toggle-slider" />
      </label>
      {(label || sublabel) && (
        <div className="cf-ui-toggle-text">
          {label && <span className="cf-ui-toggle-title">{label}</span>}
          {sublabel && <span className="cf-ui-toggle-subtext">{sublabel}</span>}
        </div>
      )}
    </div>
  );
}
