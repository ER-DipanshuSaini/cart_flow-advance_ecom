import React from 'react';
import { ChevronDown } from 'lucide-react';
import './Input.css';

export default function Select({
  label,
  id,
  options = [],
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`cf-ui-form-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="cf-ui-label">
          {label} {required && <span className="cf-ui-required">*</span>}
        </label>
      )}
      <div className="cf-ui-select-wrapper">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`cf-ui-select ${error ? 'has-error' : ''}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={15} className="cf-ui-select-arrow" />
      </div>
      {error && <span className="cf-ui-field-error">{error}</span>}
      {!error && helperText && <span className="cf-ui-field-helper">{helperText}</span>}
    </div>
  );
}
