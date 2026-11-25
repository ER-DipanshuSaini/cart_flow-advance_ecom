import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ThemeToggle, ToastContainer } from '../../components/ui';
import './Auth.css';

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());

export function useAuthToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

export function GoogleAuthButton({ onClick, label = 'Continue with Google' }) {
  return (
    <>
      <div className="cf-auth-social-divider">
        <span>OR CONTINUE WITH</span>
      </div>
      <div className="cf-social-btns-grid">
        <button type="button" className="cf-social-login-btn" onClick={onClick}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>{label}</span>
        </button>
      </div>
    </>
  );
}

export default function AuthLayout({
  bannerImage,
  bannerFallback = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
  eyebrow,
  bannerTitle,
  perks = [],
  heading,
  subheading,
  toasts = [],
  onRemoveToast,
  children,
  footer,
}) {
  return (
    <div className="cf-auth-fullscreen-layout">
      <ToastContainer toasts={toasts} onClose={onRemoveToast} />

      {/* Left Column: Full-Height Editorial Banner */}
      <div className="cf-auth-side-banner">
        <div className="cf-side-banner-media">
          <img
            src={bannerImage}
            alt="CartFlow Atelier"
            className="cf-side-banner-img"
            onError={(e) => {
              if (bannerFallback && e.currentTarget.src !== bannerFallback) {
                e.currentTarget.src = bannerFallback;
              }
            }}
          />
          <div className="cf-side-banner-overlay" />
        </div>

        <div className="cf-side-banner-content">
          <Link to="/" className="cf-side-banner-logo">
            CART<span>FLOW</span>
          </Link>

          <div className="cf-side-banner-quote-box">
            {eyebrow && <span className="cf-side-eyebrow-pill">{eyebrow}</span>}
            <h2 className="cf-side-banner-title">{bannerTitle}</h2>

            {perks.length > 0 && (
              <div className="cf-side-perks-list">
                {perks.map((perk, idx) => (
                  <div key={idx} className="cf-side-perk-item">
                    <CheckCircle2 size={15} />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cf-side-banner-footer">
            <span>© 2026 CartFlow Inc. All rights reserved.</span>
          </div>
        </div>
      </div>

      {/* Right Column: Centered Form Card */}
      <div className="cf-auth-form-column">
        <div className="cf-auth-form-card">
          <div className="cf-auth-card-top-nav">
            <Link to="/" className="cf-back-store-link">
              <ArrowLeft size={15} /> Back to Store
            </Link>
            <ThemeToggle />
          </div>

          <div className="cf-auth-card-header">
            <h1 className="cf-auth-page-heading">{heading}</h1>
            {subheading && <p className="cf-auth-page-subheading">{subheading}</p>}
          </div>

          {children}

          {footer}
        </div>
      </div>
    </div>
  );
}
