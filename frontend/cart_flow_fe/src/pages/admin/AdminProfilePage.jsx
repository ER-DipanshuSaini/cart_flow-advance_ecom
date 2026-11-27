import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Input,
  ToastContainer,
} from '../../components/ui';
import ActivityTimeline from '../../components/common/ActivityTimeline';
import { useToasts } from '../../hooks/useToasts';
import {
  appendAdminSessionEvent,
  getAdminStatusMeta,
  getCurrentAdminUser,
  getRoleMeta,
  getStoredAdminPassword,
  loadAdminSessions,
  loadAdminUsers,
  saveAdminPassword,
  saveAdminUsers,
} from '../../data/adminUsers';
import {
  STOREFRONT_IMAGE_ACCEPT,
  validateStorefrontImageFiles,
} from '../../data/inventoryProducts';
import './AdminConsole.css';

function getInitials(firstName = '', lastName = '') {
  const f = String(firstName || '').trim().charAt(0);
  const l = String(lastName || '').trim().charAt(0);
  return `${f}${l}`.toUpperCase() || 'A';
}

export default function AdminProfilePage() {
  const { toasts, addToast, removeToast } = useToasts(3200);
  const [currentUser, setCurrentUser] = useState(getCurrentAdminUser);
  const [sessions, setSessions] = useState(loadAdminSessions);

  // Profile form (email is permanently read-only)
  const [profileForm, setProfileForm] = useState(() => ({
    firstName: currentUser.firstName || '',
    lastName: currentUser.lastName || '',
    phone: currentUser.phone || '',
    profilePic: currentUser.profilePic || '',
  }));
  const [profileErrors, setProfileErrors] = useState({});

  // Password form
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwdErrors, setPwdErrors] = useState({});
  const [showPwd, setShowPwd] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const handleProfilePhotoUpload = async (e) => {
    const input = e.target;
    const rawFiles = Array.from(input.files || []);
    input.value = '';
    if (rawFiles.length === 0) return;

    const { validUrls, invalidTypeCount, oversizedCount } =
      await validateStorefrontImageFiles(rawFiles.slice(0, 1), {
        maxFileMb: 5,
        targetRatio: null,
      });

    if (invalidTypeCount > 0) {
      addToast('warning', 'Unsupported Format', 'Only JPG, JPEG, PNG, and WEBP images are supported.');
      return;
    }
    if (oversizedCount > 0) {
      addToast('warning', 'File Too Large', 'Profile photo must be 5MB or smaller.');
      return;
    }
    if (validUrls[0]) {
      setProfileForm((prev) => ({ ...prev, profilePic: validUrls[0] }));
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const cleanFirst = profileForm.firstName.trim();
    const cleanLast = profileForm.lastName.trim();
    const cleanPhone = profileForm.phone.trim();
    const nextErrors = {};

    if (!cleanFirst) nextErrors.firstName = 'First name is required.';
    if (!cleanLast) nextErrors.lastName = 'Last name is required.';
    if (!cleanPhone) nextErrors.phone = 'Phone number is required.';

    if (Object.keys(nextErrors).length > 0) {
      setProfileErrors(nextErrors);
      return;
    }

    const updatedUser = {
      ...currentUser,
      firstName: cleanFirst,
      lastName: cleanLast,
      phone: cleanPhone,
      profilePic: profileForm.profilePic,
    };

    const nextList = loadAdminUsers().map((u) =>
      u.id === currentUser.id ? updatedUser : u
    );
    saveAdminUsers(nextList);
    setCurrentUser(updatedUser);
    window.dispatchEvent(new Event('cf-admin-profile-updated'));

    const nextSessions = appendAdminSessionEvent(
      'Profile Details Updated',
      `Updated profile info for ${cleanFirst} ${cleanLast}`,
      'account'
    );
    setSessions(nextSessions);
    addToast('success', 'Profile Saved', 'Your profile details have been updated.');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const storedPwd = getStoredAdminPassword();
    const nextErrors = {};

    if (!pwdForm.currentPassword) {
      nextErrors.currentPassword = 'Enter your current password.';
    } else if (pwdForm.currentPassword !== storedPwd) {
      nextErrors.currentPassword = 'Current password is incorrect.';
    }

    if (!pwdForm.newPassword || pwdForm.newPassword.length < 8) {
      nextErrors.newPassword = 'New password must be at least 8 characters.';
    } else if (pwdForm.newPassword === pwdForm.currentPassword) {
      nextErrors.newPassword = 'New password must be different from current password.';
    }

    if (pwdForm.confirmPassword !== pwdForm.newPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setPwdErrors(nextErrors);
      return;
    }

    saveAdminPassword(pwdForm.newPassword);
    setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPwdErrors({});

    const nextSessions = appendAdminSessionEvent(
      'Password Changed',
      'Account password updated successfully by administrator',
      'address'
    );
    setSessions(nextSessions);
    addToast('success', 'Password Updated', 'Your password has been changed securely.');
  };

  const roleMeta = getRoleMeta(currentUser.role);
  const statusMeta = getAdminStatusMeta(currentUser.status);

  return (
    <div className="cf-admin-content-inner">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Page Header */}
      <div className="cf-bo-page-header">
        <div>
          <div className="cf-shopify-title-row">
            <h1 className="cf-bo-page-title">My Profile & Security</h1>
            <Badge variant={roleMeta.variant}>{roleMeta.label}</Badge>
            <Badge dot variant={statusMeta.variant}>
              {statusMeta.label}
            </Badge>
          </div>
          <p className="cf-bo-page-subtitle">
            Manage your personal profile details, change password, and review your login session timeline.
          </p>
        </div>
      </div>

      {/* 2-Column Workspace */}
      <div className="cf-shopify-workspace-grid">
        {/* Left Column: Profile Details + Password Change */}
        <div className="cf-shopify-main-col">
          {/* 1. Profile Details Card */}
          <Card>
            <Card.Header
              title="Personal Information"
              subtitle="Update your name, phone number, or profile photo. Work email cannot be modified."
            />
            <Card.Body>
              <form onSubmit={handleSaveProfile} className="cf-admin-form-stack">
                <div className="cf-admin-user-modal-layout">
                  {/* Left: Google-style Hover Avatar Picker */}
                  <div className="cf-admin-user-avatar-col">
                    <label
                      className="cf-admin-google-avatar-picker"
                      title="Click to upload profile photo"
                    >
                      {profileForm.profilePic ? (
                        <img src={profileForm.profilePic} alt="My profile" />
                      ) : (
                        <span className="cf-admin-google-avatar-initials">
                          {getInitials(profileForm.firstName, profileForm.lastName)}
                        </span>
                      )}
                      <span className="cf-admin-google-avatar-hover">
                        <Camera size={22} />
                        <span>{profileForm.profilePic ? 'Change' : 'Upload'}</span>
                      </span>
                      <input
                        type="file"
                        accept={STOREFRONT_IMAGE_ACCEPT}
                        className="cf-admin-hidden-file-input"
                        onChange={handleProfilePhotoUpload}
                      />
                    </label>

                    <div className="cf-admin-user-avatar-meta">
                      <small>JPG, PNG, WEBP • Max 5MB</small>
                      {profileForm.profilePic && (
                        <button
                          type="button"
                          className="cf-admin-avatar-remove-link"
                          onClick={() =>
                            setProfileForm((prev) => ({ ...prev, profilePic: '' }))
                          }
                        >
                          Remove photo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right: Editable Details (Email Locked) */}
                  <div className="cf-admin-form-stack">
                    <div className="cf-admin-user-modal-row">
                      <Input
                        label="First Name"
                        required
                        value={profileForm.firstName}
                        onChange={(e) => {
                          setProfileForm((prev) => ({ ...prev, firstName: e.target.value }));
                          if (profileErrors.firstName) {
                            setProfileErrors((er) => ({ ...er, firstName: '' }));
                          }
                        }}
                        error={profileErrors.firstName}
                      />
                      <Input
                        label="Last Name"
                        required
                        value={profileForm.lastName}
                        onChange={(e) => {
                          setProfileForm((prev) => ({ ...prev, lastName: e.target.value }));
                          if (profileErrors.lastName) {
                            setProfileErrors((er) => ({ ...er, lastName: '' }));
                          }
                        }}
                        error={profileErrors.lastName}
                      />
                    </div>

                    <div className="cf-admin-user-modal-row">
                      <Input
                        label="Work Email"
                        value={currentUser.email}
                        disabled
                        icon={Lock}
                        helperText="Email address is locked and cannot be changed"
                      />
                      <Input
                        label="Phone Number"
                        required
                        value={profileForm.phone}
                        onChange={(e) => {
                          setProfileForm((prev) => ({ ...prev, phone: e.target.value }));
                          if (profileErrors.phone) {
                            setProfileErrors((er) => ({ ...er, phone: '' }));
                          }
                        }}
                        error={profileErrors.phone}
                      />
                    </div>

                    <div className="cf-admin-profile-readonly-row">
                      <div className="cf-admin-profile-ro-item">
                        <span>
                          <ShieldCheck size={13} /> Role
                        </span>
                        <strong>{currentUser.role}</strong>
                      </div>
                      <div className="cf-admin-profile-ro-item">
                        <span>
                          <User size={13} /> Member Since
                        </span>
                        <strong>{currentUser.createdAt || '01 Oct 2026'}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="primary" size="sm" icon={Save}>
                    Save Profile
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>

          {/* 2. Change Password Card */}
          <Card>
            <Card.Header
              title="Change Password"
              subtitle="Use at least 8 characters with a mix of letters, numbers, and symbols"
            />
            <Card.Body>
              <form onSubmit={handleUpdatePassword} className="cf-admin-form-stack">
                <div className="cf-admin-pwd-field-wrap">
                  <Input
                    label="Current Password"
                    type={showPwd.current ? 'text' : 'password'}
                    required
                    placeholder="Enter current password"
                    value={pwdForm.currentPassword}
                    onChange={(e) => {
                      setPwdForm((prev) => ({ ...prev, currentPassword: e.target.value }));
                      if (pwdErrors.currentPassword) {
                        setPwdErrors((er) => ({ ...er, currentPassword: '' }));
                      }
                    }}
                    error={pwdErrors.currentPassword}
                  />
                  <button
                    type="button"
                    className="cf-admin-pwd-eye-btn"
                    onClick={() => setShowPwd((p) => ({ ...p, current: !p.current }))}
                    aria-label="Toggle current password visibility"
                  >
                    {showPwd.current ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                <div className="cf-admin-user-modal-row">
                  <div className="cf-admin-pwd-field-wrap">
                    <Input
                      label="New Password"
                      type={showPwd.next ? 'text' : 'password'}
                      required
                      placeholder="Minimum 8 characters"
                      value={pwdForm.newPassword}
                      onChange={(e) => {
                        setPwdForm((prev) => ({ ...prev, newPassword: e.target.value }));
                        if (pwdErrors.newPassword) {
                          setPwdErrors((er) => ({ ...er, newPassword: '' }));
                        }
                      }}
                      error={pwdErrors.newPassword}
                    />
                    <button
                      type="button"
                      className="cf-admin-pwd-eye-btn"
                      onClick={() => setShowPwd((p) => ({ ...p, next: !p.next }))}
                      aria-label="Toggle new password visibility"
                    >
                      {showPwd.next ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  <div className="cf-admin-pwd-field-wrap">
                    <Input
                      label="Confirm New Password"
                      type={showPwd.confirm ? 'text' : 'password'}
                      required
                      placeholder="Re-enter new password"
                      value={pwdForm.confirmPassword}
                      onChange={(e) => {
                        setPwdForm((prev) => ({ ...prev, confirmPassword: e.target.value }));
                        if (pwdErrors.confirmPassword) {
                          setPwdErrors((er) => ({ ...er, confirmPassword: '' }));
                        }
                      }}
                      error={pwdErrors.confirmPassword}
                    />
                    <button
                      type="button"
                      className="cf-admin-pwd-eye-btn"
                      onClick={() => setShowPwd((p) => ({ ...p, confirm: !p.confirm }))}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showPwd.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="primary" size="sm" icon={KeyRound}>
                    Update Password
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </div>

        {/* Right Column: Login Session Timeline */}
        <div className="cf-shopify-side-col">
          <Card>
            <Card.Header
              title="Login & Session Timeline"
              subtitle="Recent sign-ins and security activity for your account"
              action={
                <Badge dot variant="completed" size="sm">
                  Active
                </Badge>
              }
            />
            <Card.Body>
              <div className="cf-admin-session-active-bar">
                <CheckCircle2 size={15} />
                <div>
                  <strong>Current Session Verified</strong>
                  <span>
                    <Clock size={11} /> Last active: {currentUser.lastActive || 'Just now'}
                  </span>
                </div>
              </div>

              <ActivityTimeline items={sessions} emptyText="No session events recorded." />
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
