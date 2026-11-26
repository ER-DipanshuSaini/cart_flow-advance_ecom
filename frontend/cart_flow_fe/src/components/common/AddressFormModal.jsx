import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Modal } from '../ui';
import { EMPTY_ADDRESS_FORM, INDIAN_STATES } from '../../data/customerDefaults';
import './AddressFormModal.css';

/**
 * Shared Reusable Add / Edit Delivery Address Modal.
 * Used across Customer Dashboard (Saved Addresses) and Admin Customer Profile.
 */
export default function AddressFormModal({
  isOpen,
  onClose,
  onSave,
  initialAddress = null,
  defaultName = '',
  defaultPhone = '',
  defaultAsPrimary = false,
  subtitle = 'Enter complete shipping details for doorstep delivery',
}) {
  const [form, setForm] = useState(EMPTY_ADDRESS_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (initialAddress) {
      setForm({
        ...EMPTY_ADDRESS_FORM,
        ...initialAddress,
        isDefault: defaultAsPrimary,
      });
    } else {
      setForm({
        ...EMPTY_ADDRESS_FORM,
        name: defaultName,
        phone: defaultPhone,
        isDefault: defaultAsPrimary,
      });
    }
  }, [isOpen, initialAddress, defaultName, defaultPhone, defaultAsPrimary]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.postalCode.trim()
    ) {
      setError('Please fill in all required address fields.');
      return;
    }

    onSave({
      id: form.id || `addr-${Date.now()}`,
      label: form.label.trim() || 'Home',
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      landmark: form.landmark.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country || 'India',
      isDefault: form.isDefault,
      isEdit: !!form.id,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={form.id ? 'Edit Delivery Address' : 'Add New Delivery Address'}
      subtitle={subtitle}
      size="md"
    >
      <form onSubmit={handleSubmit} className="cf-address-modal-form">
        {error && <div className="cf-address-modal-error">{error}</div>}

        <div className="cf-address-modal-row-2">
          <Input
            label="Address Label"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="e.g. Home, Office"
          />
          <Input
            label="Recipient Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
          />
        </div>

        <div className="cf-address-modal-row-2">
          <Input
            label="Phone Number *"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
          <Input
            label="Postal / PIN Code *"
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            placeholder="400001"
          />
        </div>

        <Input
          label="House / Flat / Street Address *"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Flat No, Building, Street"
        />

        <Input
          label="Landmark (Optional)"
          value={form.landmark}
          onChange={(e) => setForm({ ...form, landmark: e.target.value })}
          placeholder="Near park, metro station, etc."
        />

        <div className="cf-address-modal-row-2">
          <Input
            label="City *"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder="Mumbai"
          />
          <Select
            label="State *"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            options={INDIAN_STATES.map((st) => ({ value: st, label: st }))}
          />
        </div>

        <label className="cf-address-modal-checkbox">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          />
          <span>Set as default delivery address</span>
        </label>

        <div className="cf-address-modal-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {form.id ? 'Save Address' : 'Add Address'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
