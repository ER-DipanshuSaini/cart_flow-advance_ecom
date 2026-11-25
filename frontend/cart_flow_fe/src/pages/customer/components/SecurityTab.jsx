import React, { useState } from 'react';
import { Lock, LogOut } from 'lucide-react';
import { Button, Card, Input } from '../../../components/ui';

export default function SecurityTab({ customer, onPasswordUpdated, onLogout }) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    onPasswordUpdated();
  };

  return (
    <div className="cf-cust-tab-panel">
      <div className="cf-panel-header">
        <div>
          <h2 className="cf-panel-title">Security &amp; Password</h2>
          <p className="cf-panel-subtitle">
            Keep your CartFlow account secure by updating your password regularly.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="cf-measurements-form cf-security-form">
        {passwordError && <div className="cf-security-error-banner">{passwordError}</div>}

        <Input
          label="Current Password *"
          type="password"
          value={passwordForm.currentPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
          }
          placeholder="Enter current password"
        />

        <div className="cf-form-row-2">
          <Input
            label="New Password *"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            placeholder="Minimum 6 characters"
          />
          <Input
            label="Confirm New Password *"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
            }
            placeholder="Re-enter new password"
          />
        </div>

        <div className="cf-form-actions-bar">
          <Button type="submit" variant="primary" icon={Lock}>
            Update Password
          </Button>
        </div>
      </form>

      <Card className="cf-security-session-card">
        <div className="cf-security-row">
          <div>
            <h4>Current Session</h4>
            <p>Signed in as {customer?.email || 'customer@cartflow.in'}</p>
          </div>
          <Button variant="outline" size="sm" icon={LogOut} onClick={onLogout}>
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
