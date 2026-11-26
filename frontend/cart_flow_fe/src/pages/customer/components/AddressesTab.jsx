import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button, Badge, Pagination } from '../../../components/ui';
import EmptyState from '../../../components/common/EmptyState';
import AddressFormModal from '../../../components/common/AddressFormModal';
import { usePaginatedList } from '../../../hooks/usePaginatedList';

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
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingIsDefault, setEditingIsDefault] = useState(false);

  const openAddModal = () => {
    setEditingAddress(null);
    setEditingIsDefault(addresses.length === 0);
    setIsModalOpen(true);
  };

  const openEditModal = (addr, globalIdx) => {
    setEditingAddress(addr);
    setEditingIsDefault(globalIdx === 0);
    setIsModalOpen(true);
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

      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveAddress}
        initialAddress={editingAddress}
        defaultName={customer?.name || ''}
        defaultPhone={customer?.phone || ''}
        defaultAsPrimary={editingIsDefault}
      />
    </div>
  );
}
