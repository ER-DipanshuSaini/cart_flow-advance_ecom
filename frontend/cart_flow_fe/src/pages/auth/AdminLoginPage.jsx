import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Key, Lock, ArrowRight, ArrowLeft, Shield, Terminal, Boxes, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Badge } from '../../components/ui';
import './Auth.css';

/**
 * Admin Operations Gateway
 * Seamlessly styled with the Royal Navy #003f7f brand architecture
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
      loginAdmin(adminId, secretKey, selectedRole);
      setLoading(false);
      navigate('/admin/overview');
    }, 600);
  };

  return (
    <div className="cf-auth-fullscreen-layout">
      {/* Left Column: Atmospheric Royal Navy Brand Visual Banner */}
      <div className="cf-auth-side-banner">
        <div className="cf-side-banner-media">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85"
            alt="CartFlow Retail & Operations Console"
            className="cf-side-banner-img"
          />
          <div className="cf-side-banner-overlay" />
        </div>

        <div className="cf-side-banner-content">
          <Link to="/" className="cf-side-banner-logo">
            CART<span>FLOW</span>
          </Link>

          <div className="cf-side-banner-quote-box">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
              <Badge variant="mono">• RESTRICTED WORKSPACE ACCESS</Badge>
              <Badge variant="warning">ADMIN GATE</Badge>
            </div>
            <h2 className="cf-side-banner-title">
              "Mastery in commerce operations, from bespoke cutting to courier dispatch."
            </h2>
            <p className="cf-side-banner-author">- CartFlow RBAC Security Engine</p>

            <div className="cf-side-perks-list">
              <div className="cf-side-perk-item">
                <ShieldCheck size={16} />
                <span>Zero-trust role-based authorization (RBAC)</span>
              </div>
              <div className="cf-side-perk-item">
                <Boxes size={16} />
                <span>Multi-vendor supplier warehouse inventory sync</span>
              </div>
              <div className="cf-side-perk-item">
                <Truck size={16} />
                <span>Live courier API telemetry & AWB generation</span>
              </div>
            </div>
          </div>

          <div className="cf-side-banner-footer">
            <span>© 2026 CartFlow Operations Core. 256-bit Encrypted Session.</span>
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
            <h1 className="cf-auth-page-heading">Operations Gateway</h1>
            <p className="cf-auth-page-subheading">
              Confidential commerce management. Select your operational role and authenticate with your workspace token.
            </p>
          </div>

          <form onSubmit={handleAdminAuth} className="cf-auth-inputs-stack">
            {error && <div className="cf-auth-error-banner">{error}</div>}

            {/* Operational Role Switcher using Royal Navy #003f7f styling */}
            <div className="cf-admin-role-select-box">
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--cf-text-muted)', marginBottom: '8px' }}>
                Operational Role
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
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
                      padding: '10px 6px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      borderRadius: 'var(--cf-radius-md)',
                      border: selectedRole === role.id ? '2px solid #003f7f' : '1px solid var(--cf-border-subtle)',
                      backgroundColor: selectedRole === role.id ? 'var(--cf-accent-primary-tint)' : 'var(--cf-bg-surface)',
                      color: selectedRole === role.id ? '#003f7f' : 'var(--cf-text-muted)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
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
              onChange={(e) => {
                setAdminId(e.target.value);
                setError('');
              }}
            />

            <Input
              label="Security Passkey"
              type="password"
              required
              placeholder="••••••••••••••••"
              icon={Lock}
              value={secretKey}
              onChange={(e) => {
                setSecretKey(e.target.value);
                setError('');
              }}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              iconRight={ArrowRight}
              className="cf-auth-primary-btn"
            >
              Authenticate & Launch Console
            </Button>
          </form>

          <div className="cf-auth-switch-footer" style={{ marginTop: '1.75rem' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--cf-text-dim)' }}>
              🔒 Protected by CartFlow Role-Based Access Control (RBAC) & DRF Token Guard
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
