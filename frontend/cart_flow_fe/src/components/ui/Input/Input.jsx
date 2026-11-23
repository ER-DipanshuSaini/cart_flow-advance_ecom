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
  iconRight: IconRight,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`cf-ui-form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="cf-ui-label">
          {label} {required && <span className="cf-ui-required">*</span>}
        </label>
      )}
      <div className="cf-ui-input-wrapper">
        {Icon && <Icon size={16} className="cf-ui-input-icon-left" />}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`cf-ui-input ${Icon ? 'has-left-icon' : ''} ${IconRight ? 'has-right-icon' : ''} ${error ? 'has-error' : ''}`}
          {...props}
        />
        {IconRight && <IconRight size={16} className="cf-ui-input-icon-right" />}
      </div>
      {error && <span className="cf-ui-field-error">{error}</span>}
      {!error && helperText && <span className="cf-ui-field-helper">{helperText}</span>}
    </div>
  );
}
