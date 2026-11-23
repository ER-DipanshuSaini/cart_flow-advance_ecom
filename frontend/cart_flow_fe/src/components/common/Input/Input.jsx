import React from 'react';
import './Input.css';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`cf-input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="cf-input-label">
          {label} {required && <span className="cf-required">*</span>}
        </label>
      )}
      <div className="cf-input-wrapper">
        {Icon && <Icon size={18} className="cf-input-icon" />}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`cf-input-field ${Icon ? 'with-icon' : ''} ${error ? 'has-error' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="cf-input-error">{error}</span>}
      {!error && helperText && <span className="cf-input-helper">{helperText}</span>}
    </div>
  );
}
