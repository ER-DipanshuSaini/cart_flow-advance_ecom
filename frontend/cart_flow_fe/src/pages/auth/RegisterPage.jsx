import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Toggle, Badge } from '../../components/ui';
import './Auth.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please provide all required fields.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept the Terms of Service to continue.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      register(name, email, password);
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
            src="https://images.unsplash.com/photo-1620012253295-c15c429fbb3e?auto=format&fit=crop&w=1200&q=85"
            alt="CartFlow Luxury Member Access"
            className="cf-side-banner-img"
          />
          <div className="cf-side-banner-overlay" />
        </div>

        <div className="cf-side-banner-content">
          <Link to="/" className="cf-side-banner-logo">
            CART<span>FLOW</span>
          </Link>

          <div className="cf-side-banner-quote-box">
            <Badge variant="mono">• JOIN THE INNER CIRCLE</Badge>
            <h2 className="cf-side-banner-title">
              "Bespoke tailoring, timeless old-money aesthetics, crafted without compromise."
            </h2>
            <p className="cf-side-banner-author">— CartFlow Atelier Membership</p>

            <div className="cf-side-perks-list">
              <div className="cf-side-perk-item">
                <CheckCircle2 size={16} />
                <span>Instant 15% off first drop order</span>
              </div>
              <div className="cf-side-perk-item">
                <CheckCircle2 size={16} />
                <span>Priority access to limited capsule releases</span>
              </div>
              <div className="cf-side-perk-item">
                <CheckCircle2 size={16} />
                <span>AI Try-On avatar sync across devices</span>
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
            <h1 className="cf-auth-page-heading">Create Account</h1>
            <p className="cf-auth-page-subheading">
              Join CartFlow for personalized AI fit recommendations and fast checkout.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="cf-auth-inputs-stack">
            {error && <div className="cf-auth-error-banner">{error}</div>}

            <Input
              label="Full Name"
              type="text"
              required
              placeholder="e.g. Liam Sterling"
              icon={User}
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
            />

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
              placeholder="At least 6 characters..."
              icon={Lock}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
            />

            <div style={{ paddingTop: '4px' }}>
              <Toggle
                label="I agree to the Terms of Service & Privacy Policy"
                checked={agreeTerms}
                onChange={setAgreeTerms}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              iconRight={UserPlus}
              className="cf-auth-primary-btn"
            >
              Create My Account
            </Button>
          </form>

          <div className="cf-auth-switch-footer">
            <span>Already registered?</span>{' '}
            <Link to="/login" className="cf-switch-auth-link">
              Sign in to account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
