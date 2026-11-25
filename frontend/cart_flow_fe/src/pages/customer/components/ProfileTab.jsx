import React from 'react';
import { Camera, CheckCircle2 } from 'lucide-react';
import { Button, Card, Input } from '../../../components/ui';

export default function ProfileTab({
  customer,
  profileForm,
  setProfileForm,
  defaultAddress,
  onProfilePicChange,
  onRemoveProfilePic,
  onSaveProfile,
  onManageAddresses,
}) {
  return (
    <div className="cf-cust-tab-panel">
      <div className="cf-panel-header">
        <div>
          <h2 className="cf-panel-title">Personal Information</h2>
          <p className="cf-panel-subtitle">
            Update your profile photo, name, and phone number. Your registered email cannot be changed.
          </p>
        </div>
      </div>

      <form onSubmit={onSaveProfile} className="cf-measurements-form">
        {/* Profile Picture Uploader */}
        <div className="cf-profile-pic-row">
          <div className="cf-profile-pic-preview">
            {profileForm.profilePic ? (
              <img src={profileForm.profilePic} alt="Profile" />
            ) : (
              <span>{profileForm.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            )}
          </div>
          <div className="cf-profile-pic-controls">
            <h4>Profile Photo</h4>
            <p>JPG or PNG up to 2 MB</p>
            <div className="cf-profile-pic-btns">
              <label className="cf-upload-photo-btn">
                <Camera size={14} />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onProfilePicChange}
                  hidden
                />
              </label>
              {profileForm.profilePic && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={onRemoveProfilePic}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="cf-form-row-2">
          <Input
            label="Full Name *"
            value={profileForm.name}
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            placeholder="Enter your full name"
          />
          <Input
            label="Phone Number"
            type="tel"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="cf-form-row-1">
          <Input
            label="Email Address (Fixed)"
            type="email"
            value={customer?.email || 'customer@cartflow.in'}
            readOnly
            disabled
          />
        </div>

        <div className="cf-form-actions-bar">
          <Button type="submit" variant="primary" icon={CheckCircle2}>
            Save Changes
          </Button>
        </div>
      </form>

      {/* Default Shipping Preview using shared Card */}
      <Card className="cf-cust-profile-summary-card">
        <Card.Header
          title="Default Delivery Address"
          subtitle="Used automatically as your primary address during checkout."
          action={
            <Button variant="outline" size="sm" onClick={onManageAddresses}>
              Manage Addresses
            </Button>
          }
        />
        <Card.Body>
          {defaultAddress ? (
            <div className="cf-cust-summary-addr">
              <strong>
                {defaultAddress.name} ({defaultAddress.label})
              </strong>
              <span>
                {defaultAddress.address}
                {defaultAddress.landmark ? `, ${defaultAddress.landmark}` : ''},{' '}
                {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.postalCode}
              </span>
            </div>
          ) : (
            <p className="cf-cust-summary-empty">
              No default address saved yet. Add one in Saved Addresses.
            </p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
