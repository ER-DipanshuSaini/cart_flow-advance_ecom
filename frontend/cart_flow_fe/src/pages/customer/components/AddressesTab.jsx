import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button, Badge, Input, Select, Modal, Pagination } from '../../../components/ui';
import EmptyState from '../../../components/common/EmptyState';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { EMPTY_ADDRESS_FORM, INDIAN_STATES } from '../../../data/customerDefaults';

const ADDRESSES_PER_PAGE = 4;

export default function AddressesTab({
  customer,
  addresses,
  onSaveAddress,
  onDeleteAddress,
  onSetDefaultAddress,
}) {
  const { page, setPage, pageSize, totalItems, paginatedItems } = usePaginatedList(
    addresses,
    ADDRESSES_PER_PAGE
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS_FORM);
  const [addressError, setAddressError] = useState('');

  const openAddModal = () => {
    setAddressError('');
    setAddressForm({
      ...EMPTY_ADDRESS_FORM,
      name: customer?.name || '',
      phone: customer?.phone || '',
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (addr, globalIdx) => {
    setAddressError('');
    setAddressForm({
      ...addr,
      isDefault: globalIdx === 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !addressForm.name.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.address.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim() ||
      !addressForm.postalCode.trim()
    ) {
      setAddressError('Please fill in all required address fields.');
      return;
    }

    onSaveAddress({
      id: addressForm.id || `addr-${Date.now()}`,
      label: addressForm.label.trim() || 'Home',
      name: addressForm.name.trim(),
      phone: addressForm.phone.trim(),
      address: addressForm.address.trim(),
      landmark: addressForm.landmark.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      postalCode: addressForm.postalCode.trim(),
      country: addressForm.country || 'India',
      isDefault: addressForm.isDefault,
      isEdit: !!addressForm.id,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="cf-cust-tab-panel">
      <div className="cf-panel-header">
        <div>
          <h2 className="cf-panel-title">Saved Delivery Addresses</h2>
          <p className="cf-panel-subtitle">
            Addresses saved here are synced directly with your Checkout page.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={openAddModal}>
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          description="Add a home or office delivery address for faster checkout."
          actionLabel="Add Address"
          onAction={openAddModal}
        />
      ) : (
        <>
          <div className="cf-addresses-grid">
            {paginatedItems.map((addr, idx) => {
              const globalIdx = (page - 1) * pageSize + idx;
              return (
                <div
                  key={addr.id}
                  className={`cf-address-card ${globalIdx === 0 ? 'is-default' : ''}`}
                >
                  <div className="cf-address-top">
                    <span className="cf-address-type">{(addr.label || 'HOME').toUpperCase()}</span>
                    {globalIdx === 0 && <Badge variant="completed">DEFAULT</Badge>}
                  </div>
                  <h4 className="cf-address-recipient">{addr.name}</h4>
                  <p className="cf-address-text">
                    {addr.address}
                    {addr.landmark ? `, ${addr.landmark}` : ''}
                    <br />
                    {addr.city}, {addr.state} - {addr.postalCode}
                    {addr.country ? `, ${addr.country}` : ''}
                    <br />
                    Phone: {addr.phone}
                  </p>
                  <div className="cf-address-actions">
                    <button
                      type="button"
                      className="cf-addr-btn"
                      onClick={() => openEditModal(addr, globalIdx)}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    {globalIdx !== 0 && (
                      <button
                        type="button"
                        className="cf-addr-btn is-make-default"
                        onClick={() => {
                          onSetDefaultAddress(addr.id);
                          setPage(1);
                        }}
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      className="cf-addr-btn is-delete"
                      onClick={() => onDeleteAddress(addr.id)}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cf-cust-pagination-wrap">
            <Pagination
              currentPage={page}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      {/* Add / Edit Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={addressForm.id ? 'Edit Delivery Address' : 'Add New Delivery Address'}
        subtitle="Enter complete shipping details for doorstep delivery"
        size="md"
      >
        <form onSubmit={handleSubmit} className="cf-modal-form-grid">
          {addressError && <div className="cf-security-error-banner">{addressError}</div>}

          <div className="cf-form-row-2">
            <Input
              label="Address Label"
              value={addressForm.label}
              onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
              placeholder="e.g. Home, Office"
            />
            <Input
              label="Recipient Name *"
              value={addressForm.name}
              onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
              placeholder="Full name"
            />
          </div>

          <div className="cf-form-row-2">
            <Input
              label="Phone Number *"
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
            <Input
              label="Postal / PIN Code *"
              value={addressForm.postalCode}
              onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
              placeholder="400001"
            />
          </div>

          <Input
            label="House / Flat / Street Address *"
            value={addressForm.address}
            onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
            placeholder="Flat No, Building, Street"
          />

          <Input
            label="Landmark (Optional)"
            value={addressForm.landmark}
            onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
            placeholder="Near park, metro station, etc."
          />

          <div className="cf-form-row-2">
            <Input
              label="City *"
              value={addressForm.city}
              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
              placeholder="Mumbai"
            />
            <Select
              label="State *"
              value={addressForm.state}
              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
              options={INDIAN_STATES.map((st) => ({ value: st, label: st }))}
            />
          </div>

          <label className="cf-modal-checkbox-row">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
            />
            <span>Set as default delivery address</span>
          </label>

          <div className="cf-form-actions-bar">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {addressForm.id ? 'Save Address' : 'Add Address'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
