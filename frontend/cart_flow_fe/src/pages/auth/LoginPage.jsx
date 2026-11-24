import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Toggle, Badge } from '../../components/ui';
import './Auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email, password, 'customer');
      setLoading(false);
      navigate('/account');
    }, 600);
  };

  return (
    <div className="cf-auth-fullscreen-layout">
      {/* Left Column: Premium Brand Editorial Banner */}
      <div className="cf-auth-side-banner">
        <div className="cf-side-banner-media">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85"
            alt="CartFlow Old Money Tailoring"
            className="cf-side-banner-img"
          />
          <div className="cf-side-banner-overlay" />
        </div>

        <div className="cf-side-banner-content">
          <Link to="/" className="cf-side-banner-logo">
            CART<span>FLOW</span>
          </Link>

          <div className="cf-side-banner-quote-box">
            <Badge variant="mono">• THE 2026 TAILORED CAPSULE</Badge>
            <h2 className="cf-side-banner-title">
              "Elegance is not about being noticed, it's about being remembered."
            </h2>
            <p className="cf-side-banner-author">— CartFlow Old Money Philosophy</p>

            <div className="cf-side-perks-list">
              <div className="cf-side-perk-item">
                <CheckCircle2 size={16} />
                <span>AI Virtual Fitting Room access</span>
              </div>
              <div className="cf-side-perk-item">
                <CheckCircle2 size={16} />
                <span>Exclusive drops & member pricing</span>
              </div>
              <div className="cf-side-perk-item">
                <CheckCircle2 size={16} />
                <span>Complimentary express delivery</span>
              </div>
            </div>
          </div>

          <div className="cf-side-banner-footer">
            <span>© 2026 CartFlow Inc. All rights reserved.</span>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Centered Auth Form */}
      <div className="cf-auth-form-column">
        <div className="cf-auth-form-card">
          <div className="cf-auth-card-top-nav">
            <Link to="/" className="cf-back-store-link">
              <ArrowLeft size={15} /> Back to Storefront
            </Link>
          </div>

          <div className="cf-auth-card-header">
            <h1 className="cf-auth-page-heading">Welcome Back</h1>
            <p className="cf-auth-page-subheading">
              Sign in to manage your orders, saved addresses, and wardrobe wishlists.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="cf-auth-inputs-stack">
            {error && <div className="cf-auth-error-banner">{error}</div>}

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="you@domain.com"
              icon={Mail}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
            />

            <div className="cf-auth-meta-options">
              <Toggle
                label="Remember me"
                checked={rememberMe}
                onChange={setRememberMe}
              />
              <a href="#forgot" className="cf-forgot-pass-link">Forgot password?</a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              iconRight={LogIn}
              className="cf-auth-primary-btn"
            >
              Sign In to CartFlow
            </Button>
          </form>

          {/* Social Auth Placeholders */}
          <div className="cf-auth-social-divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <div className="cf-social-btns-grid">
            <button
              type="button"
              className="cf-social-login-btn"
              onClick={() => {
                login('guest.google@cartflow.com', 'demo', 'customer');
                navigate('/account');
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="cf-auth-switch-footer">
            <span>New to CartFlow?</span>{' '}
            <Link to="/register" className="cf-switch-auth-link">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
