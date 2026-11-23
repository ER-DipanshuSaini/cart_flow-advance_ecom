import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import './Dropdown.css';

/**
 * Custom Rich Searchable Dropdown Component
 */
export default function Dropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  searchable = true,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : options;

  const handleSelect = (val) => {
    onChange && onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`cf-ui-dropdown-group ${className}`} ref={dropdownRef}>
      {label && (
        <label className="cf-dropdown-label">
          {label} {required && <span className="cf-dropdown-required">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <div
        className={`cf-dropdown-trigger ${isOpen ? 'is-open' : ''} ${error ? 'has-error' : ''} ${
          disabled ? 'is-disabled' : ''
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="cf-trigger-content">
          {selectedOption ? (
            <div className="cf-selected-display">
              {selectedOption.icon && <selectedOption.icon size={15} className="cf-opt-icon" />}
              <span className="cf-selected-label">{selectedOption.label}</span>
            </div>
          ) : (
            <span className="cf-placeholder">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={16} className={`cf-trigger-arrow ${isOpen ? 'is-rotated' : ''}`} />
      </div>

      {/* Popover Menu */}
      {isOpen && (
        <div className="cf-dropdown-menu">
          {searchable && (
            <div className="cf-dropdown-search-wrap">
              <Search size={14} className="cf-search-icon" />
              <input
                type="text"
                placeholder="Filter options..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cf-dropdown-search-input"
                autoFocus
              />
            </div>
          )}

          <div className="cf-dropdown-options-list">
            {filteredOptions.length === 0 ? (
              <div className="cf-dropdown-empty">No options found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                const Icon = opt.icon;
                return (
                  <div
                    key={opt.value}
                    className={`cf-dropdown-item ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <div className="cf-item-left">
                      {Icon && <Icon size={16} className="cf-item-icon" />}
                      <div className="cf-item-text">
                        <span className="cf-item-title">{opt.label}</span>
                        {opt.sublabel && <span className="cf-item-sub">{opt.sublabel}</span>}
                      </div>
                    </div>
                    {isSelected && <Check size={14} className="cf-item-check" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <span className="cf-dropdown-error">{error}</span>}
      {!error && helperText && <span className="cf-dropdown-helper">{helperText}</span>}
    </div>
  );
}
