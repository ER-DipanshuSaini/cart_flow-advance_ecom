import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import './ThemeToggle.css';

/**
 * Discreet, Elegant Theme Toggle Icon Button
 */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`cf-discreet-theme-btn ${className}`}
      onClick={toggleTheme}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={17} strokeWidth={1.8} className="cf-theme-icon is-sun" />
      ) : (
        <Moon size={17} strokeWidth={1.8} className="cf-theme-icon is-moon" />
      )}
    </button>
  );
}
