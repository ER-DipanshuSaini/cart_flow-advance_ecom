import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Card, Badge, Toggle } from '../../components/ui';
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
    <div className="cf-auth-page-wrapper">
      <div className="cf-auth-box">
        <div className="cf-auth-badge-row">
          <Badge variant="completed">NEW MEMBER</Badge>
        </div>
        <h2 className="cf-auth-title">Create Account</h2>
        <p className="cf-auth-subtitle">
          Join CartFlow for personalized AI fit recommendations and fast checkout.
        </p>

        <Card className="cf-auth-card">
          <Card.Body>
            <form onSubmit={handleSubmit} className="cf-auth-form">
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
                className="cf-auth-submit-btn"
              >
                Create My Account
              </Button>
            </form>
          </Card.Body>
          <Card.Footer style={{ justifyContent: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--cf-text-muted)' }}>
              Already registered?{' '}
              <Link to="/login" style={{ color: 'var(--cf-accent-primary)', fontWeight: '600' }}>
                Sign in here
              </Link>
            </span>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}
