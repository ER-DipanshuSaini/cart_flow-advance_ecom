import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isPasswordType = type === 'password';
  const resolvedType = isPasswordType ? (showPassword ? 'text' : 'password') : type;
  const hasRightElement = Boolean(IconRight || isPasswordType);

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
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`cf-ui-input ${Icon ? 'has-left-icon' : ''} ${hasRightElement ? 'has-right-icon' : ''} ${error ? 'has-error' : ''}`}
          {...props}
        />
        {isPasswordType ? (
          <button
            type="button"
            className="cf-ui-password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : (
          IconRight && <IconRight size={16} className="cf-ui-input-icon-right" />
        )}
      </div>
      {error && <span className="cf-ui-field-error">{error}</span>}
      {!error && helperText && <span className="cf-ui-field-helper">{helperText}</span>}
    </div>
  );
}
