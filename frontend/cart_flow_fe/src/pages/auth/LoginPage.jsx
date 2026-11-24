import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Card, Badge, Toggle } from '../../components/ui';
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
    <div className="cf-auth-page-wrapper">
      <div className="cf-auth-box">
        <div className="cf-auth-badge-row">
          <Badge variant="mono">• CUSTOMER PORTAL</Badge>
        </div>
        <h2 className="cf-auth-title">Welcome Back</h2>
        <p className="cf-auth-subtitle">
          Sign in to access your orders, saved try-on fits, and wishlist.
        </p>

        <Card className="cf-auth-card">
          <Card.Body>
            <form onSubmit={handleSubmit} className="cf-auth-form">
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

              <div className="cf-auth-form-row">
                <Toggle
                  label="Remember me"
                  checked={rememberMe}
                  onChange={setRememberMe}
                />
                <a href="#forgot" className="cf-forgot-link">Forgot password?</a>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                iconRight={LogIn}
                className="cf-auth-submit-btn"
              >
                Sign In to Account
              </Button>
            </form>
          </Card.Body>
          <Card.Footer style={{ justifyContent: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--cf-text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--cf-accent-primary)', fontWeight: '600' }}>
                Create one now
              </Link>
            </span>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}
