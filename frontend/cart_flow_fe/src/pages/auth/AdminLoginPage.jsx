import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Key, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Card, Badge } from '../../components/ui';
import './Auth.css';

/**
 * Hidden Admin Portal Authentication Gate
 * Accessed only via direct non-public route (e.g. /admin-portal or /admin-gate)
 */
export default function AdminLoginPage() {
  const [adminId, setAdminId] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (!adminId || !secretKey) {
      setError('Admin identity credentials required.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Authenticates with admin privilege
      login(adminId + '@cartflow.internal', secretKey, 'admin');
      setLoading(false);
      navigate('/admin/console');
    }, 700);
  };

  return (
    <div className="cf-auth-page-wrapper cf-admin-gate-theme">
      <div className="cf-auth-box">
        <div className="cf-auth-badge-row">
          <Badge variant="mono">• RESTRICTED WORKSPACE ACCESS</Badge>
          <Badge variant="warning">ADMIN GATE</Badge>
        </div>
        <h2 className="cf-auth-title">Try-On Admin Console</h2>
        <p className="cf-auth-subtitle">
          Confidential system area. Please enter your administrator token credentials to manage services.
        </p>

        <Card className="cf-auth-card">
          <Card.Body>
            <form onSubmit={handleAdminAuth} className="cf-auth-form">
              {error && <div className="cf-auth-error-banner">{error}</div>}

              <Input
                label="Admin Identifier / Workspace Key"
                type="text"
                required
                placeholder="e.g. CF-ROOT-ADMIN"
                icon={Key}
                value={adminId}
                onChange={(e) => { setAdminId(e.target.value); setError(''); }}
              />

              <Input
                label="Security Passkey"
                type="password"
                required
                placeholder="••••••••••••••••"
                icon={Lock}
                value={secretKey}
                onChange={(e) => { setSecretKey(e.target.value); setError(''); }}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                iconRight={ArrowRight}
                className="cf-auth-submit-btn"
              >
                Authenticate & Launch Console
              </Button>
            </form>
          </Card.Body>
          <Card.Footer style={{ justifyContent: 'center' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--cf-text-dim)' }}>
              Encrypted session managed by CartFlow RBAC Guard
            </span>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}
