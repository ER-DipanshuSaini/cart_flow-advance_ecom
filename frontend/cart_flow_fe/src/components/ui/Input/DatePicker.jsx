import React from 'react';
import { Calendar } from 'lucide-react';
import './DatePicker.css';

/**
 * Standard Native DatePicker with Modern Theme Styling
 * Uses browser native picker (100% reliable, zero cut-off/clipping, fully responsive)
 */
export default function DatePicker({
  label,
  id,
  value,
  onChange,
  min,
  max,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const dateId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`cf-ui-datepicker-group ${className}`}>
      {label && (
        <label htmlFor={dateId} className="cf-datepicker-label">
          {label} {required && <span className="cf-datepicker-required">*</span>}
        </label>
      )}

      <div className="cf-datepicker-input-wrapper">
        <Calendar size={16} className="cf-datepicker-left-icon" />
        <input
          id={dateId}
          type="date"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          min={min}
          max={max}
          disabled={disabled}
          required={required}
          className={`cf-datepicker-native-input ${error ? 'has-error' : ''}`}
          {...props}
        />
      </div>

      {error && <span className="cf-datepicker-error">{error}</span>}
      {!error && helperText && <span className="cf-datepicker-helper">{helperText}</span>}
    </div>
  );
}
