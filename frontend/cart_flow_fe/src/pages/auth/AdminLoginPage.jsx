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
  const [adminId, setAdminId] = useState('CF-ROOT-ADMIN');
  const [secretKey, setSecretKey] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState('super-admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (!adminId || !secretKey) {
      setError('Admin identity credentials required.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Authenticates with chosen role
      loginAdmin(adminId, secretKey, selectedRole);
      setLoading(false);
      navigate('/admin/overview');
    }, 600);
  };

  return (
    <div className="cf-auth-page-wrapper cf-admin-gate-theme">
      <div className="cf-auth-box">
        <div className="cf-auth-badge-row">
          <Badge variant="mono">• RESTRICTED WORKSPACE ACCESS</Badge>
          <Badge variant="warning">ADMIN GATE</Badge>
        </div>
        <h2 className="cf-auth-title">CartFlow Operations Gateway</h2>
        <p className="cf-auth-subtitle">
          Confidential retail operations area. Please enter your administrator token credentials to manage commerce services.
        </p>

        <Card className="cf-auth-card">
          <Card.Body>
            <form onSubmit={handleAdminAuth} className="cf-auth-form">
              {error && <div className="cf-auth-error-banner">{error}</div>}

              <div className="cf-admin-role-select-box" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--cf-text-muted)', marginBottom: '6px' }}>
                  Select Operational Role
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {[
                    { id: 'super-admin', label: 'Super Admin' },
                    { id: 'supplier', label: 'Supplier / Vendor' },
                    { id: 'logistics', label: 'Logistics Lead' },
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.id);
                        if (role.id === 'supplier') setAdminId('VANGUARD-SUPPLIER-01');
                        else if (role.id === 'logistics') setAdminId('EXPRESS-LOGISTICS-HUB');
                        else setAdminId('CF-ROOT-ADMIN');
                      }}
                      style={{
                        padding: '8px 4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        borderRadius: 'var(--cf-radius-md)',
                        border: selectedRole === role.id ? '1px solid var(--cf-accent-primary)' : '1px solid var(--cf-border-subtle)',
                        backgroundColor: selectedRole === role.id ? 'var(--cf-accent-primary-tint)' : 'var(--cf-bg-surface)',
                        color: selectedRole === role.id ? 'var(--cf-accent-primary)' : 'var(--cf-text-muted)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'var(--cf-transition)',
                      }}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

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
