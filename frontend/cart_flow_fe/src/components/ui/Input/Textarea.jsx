import React from 'react';
import './Input.css';

export default function Textarea({
  label,
  id,
  rows = 3,
  placeholder = '',
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`cf-ui-form-group ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="cf-ui-label">
          {label} {required && <span className="cf-ui-required">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`cf-ui-textarea ${error ? 'has-error' : ''}`}
        {...props}
      />
      {error && <span className="cf-ui-field-error">{error}</span>}
      {!error && helperText && <span className="cf-ui-field-helper">{helperText}</span>}
    </div>
  );
}
