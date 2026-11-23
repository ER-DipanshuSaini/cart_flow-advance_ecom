import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import './ThemeToggle.css';

/**
 * Modern Animated Theme Toggle Button
 */
export default function ThemeToggle({ size = 'md', className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`cf-ui-theme-toggle ${isDark ? 'is-dark' : 'is-light'} cf-toggle-${size} ${className}`}
      onClick={toggleTheme}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle visual theme"
    >
      <div className="cf-toggle-thumb">
        {isDark ? (
          <Moon size={size === 'sm' ? 12 : 14} className="cf-toggle-icon is-moon" />
        ) : (
          <Sun size={size === 'sm' ? 12 : 14} className="cf-toggle-icon is-sun" />
        )}
      </div>
      <span className="cf-toggle-label">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
