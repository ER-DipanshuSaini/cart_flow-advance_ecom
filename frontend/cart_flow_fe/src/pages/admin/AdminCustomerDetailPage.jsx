import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Edit2,
  Plus,
  MoreVertical,
  ShieldBan,
  CheckCircle2,
  Clock,
  Ticket,
  Star,
  StickyNote,
  Send
} from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  MetricCard,
  Table,
  Modal,
  Input,
  Select,
  Textarea,
  ToastContainer
} from '../../components/ui';
import AddressFormModal from '../../components/common/AddressFormModal';
import ActivityTimeline from '../../components/common/ActivityTimeline';
import TicketAttachments from '../../components/common/TicketAttachments';
import { useToasts } from '../../hooks/useToasts';
import {
  loadAdminCustomers,
  saveAdminCustomers,
  syncUpdatedCustomerToStore,
  getOrderBadgeVariant
} from '../../data/adminCustomers';
import { getTicketBadgeVariant, getTicketTimelogs, formatDateTime } from '../../data/customerDefaults';
import './AdminConsole.css';

export default function AdminCustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState(loadAdminCustomers);
  const { toasts, addToast, removeToast } = useToasts();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Orders Table Pagination
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPageSize, setOrdersPageSize] = useState(5);

  useEffect(() => {
    saveAdminCustomers(customers);
  }, [customers]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const customer = useMemo(
    () => customers.find((c) => c.id === id) || null,
    [customers, id]
  );

  // Edit Profile Modal State (Name & Phone only)
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });

  // Add Address Modal State (reuses shared AddressFormModal)
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  // Inline Admin Note Edit State
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');

  // Support Ticket History & Reply Modal State
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketReply, setTicketReply] = useState('');
  const [ticketStatusDraft, setTicketStatusDraft] = useState('Open');

  if (!customer) {
    return (
      <div className="cf-admin-content-inner">
        <Card>
          <Card.Body>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2 style={{ marginBottom: '0.5rem' }}>Customer Not Found</h2>
              <p style={{ color: 'var(--cf-text-muted)', marginBottom: '1rem' }}>
                No customer record matches ID &ldquo;{id}&rdquo;.
              </p>
              <Button variant="primary" icon={ChevronLeft} onClick={() => navigate('/admin/customers')}>
                Back to Customer Directory
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const orders = customer.orders || [];
  const paginatedOrders = orders.slice(
    (ordersPage - 1) * ordersPageSize,
    ordersPage * ordersPageSize
  );
  const addresses = customer.addresses || [];
  const tickets = customer.tickets || [];
  const reviews = customer.reviews || [];
  const activities = customer.activities || [];
  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || null;

  const avgOrderValue =
    customer.ordersCount > 0 ? Math.round((customer.totalSpent || 0) / customer.ordersCount) : 0;

  const updateCustomerRecord = (updater, activityEntry) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customer.id) return c;
        const next = updater(c);
        const withTimeline = activityEntry
          ? { ...next, activities: [activityEntry, ...(next.activities || [])] }
          : next;
        syncUpdatedCustomerToStore(withTimeline);
        return withTimeline;
      })
    );
  };

  const handleToggleBlock = () => {
    setMoreMenuOpen(false);
    const nextStatus = customer.status === 'Active' ? 'Blocked' : 'Active';
    updateCustomerRecord(
      (c) => ({ ...c, status: nextStatus }),
      {
        id: `act-${Date.now()}`,
        type: nextStatus === 'Blocked' ? 'blocked' : 'account',
        title: `Account ${nextStatus} by Admin`,
        detail: `Account access updated to ${nextStatus}.`,
        timestamp: formatDateTime(),
      }
    );
    addToast('info', `Account ${nextStatus}`, `${customer.name} is now ${nextStatus}.`);
  };

  const openProfileModal = () => {
    setProfileForm({
      name: customer.name || '',
      phone: customer.phone || '',
    });
    setProfileModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;
    updateCustomerRecord(
      (c) => ({
        ...c,
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim(),
      }),
      {
        id: `act-${Date.now()}`,
        type: 'account',
        title: 'Profile Updated by Admin',
        detail: `Updated name (${profileForm.name.trim()}) / phone number.`,
        timestamp: formatDateTime(),
      }
    );
    setProfileModalOpen(false);
    addToast('success', 'Profile Saved', 'Customer name and phone number updated.');
  };

  const openAddAddressModal = () => {
    setAddressModalOpen(true);
  };

  const handleAddAddress = ({ isDefault, isEdit, ...newAddr }) => {
    updateCustomerRecord(
      (c) => {
        const currentAddrs = c.addresses || [];
        const updatedAddrs = isDefault
          ? [newAddr, ...currentAddrs]
          : [...currentAddrs, newAddr];
        const primary = updatedAddrs[0];
        return {
          ...c,
          city: primary ? `${primary.city}, ${primary.state}` : c.city,
          addresses: updatedAddrs,
        };
      },
      {
        id: `act-${Date.now()}`,
        type: 'account',
        title: 'New Address Added by Admin',
        detail: `${newAddr.address}, ${newAddr.city}${isDefault ? ' (Set as Primary)' : ''}`,
        timestamp: formatDateTime(),
      }
    );
    addToast('success', 'Address Added', 'New delivery address saved to customer account.');
  };

  const handleSetPrimaryAddress = (addrId) => {
    const target = addresses.find((a) => a.id === addrId);
    if (!target) return;
    updateCustomerRecord(
      (c) => ({
        ...c,
        city: `${target.city}, ${target.state}`,
        addresses: [target, ...(c.addresses || []).filter((a) => a.id !== addrId)],
      }),
      {
        id: `act-${Date.now()}`,
        type: 'account',
        title: 'Primary Address Changed',
        detail: `${target.label || 'Address'} in ${target.city} set as primary.`,
        timestamp: formatDateTime(),
      }
    );
    addToast('success', 'Primary Updated', 'Default delivery address updated.');
  };

  const handleSaveNote = () => {
    updateCustomerRecord(
      (c) => ({ ...c, adminNote: noteDraft.trim() }),
      {
        id: `act-${Date.now()}`,
        type: 'account',
        title: 'Admin Note Updated',
        detail: noteDraft.trim() ? noteDraft.trim() : 'Cleared internal note.',
        timestamp: formatDateTime(),
      }
    );
    setEditingNote(false);
    addToast('success', 'Note Saved', 'Admin note updated.');
  };

  const openTicketModal = (ticket) => {
    setSelectedTicketId(ticket.id);
    setTicketStatusDraft(ticket.status || 'Open');
    setTicketReply('');
  };

  const handleAdminTicketUpdate = (e) => {
    e.preventDefault();
    if (!activeTicket) return;
    const statusChanged = ticketStatusDraft !== activeTicket.status;
    const trimmedReply = ticketReply.trim();
    if (!statusChanged && !trimmedReply) return;

    const now = formatDateTime();
    const newLog = {
      id: `log-${Date.now()}`,
      status: ticketStatusDraft,
      actor: 'CartFlow Support',
      message: trimmedReply || `Ticket status updated to ${ticketStatusDraft}.`,
      timestamp: now,
    };

    updateCustomerRecord(
      (c) => ({
        ...c,
        tickets: (c.tickets || []).map((t) =>
          t.id === activeTicket.id
            ? {
              ...t,
              status: ticketStatusDraft,
              timelogs: [...getTicketTimelogs(t), newLog],
            }
            : t
        ),
      }),
      {
        id: `act-${Date.now()}`,
        type: 'ticket',
        title: `Ticket ${activeTicket.id} Updated (${ticketStatusDraft})`,
        detail: newLog.message,
        timestamp: now,
      }
    );
    setTicketReply('');
    addToast('success', 'Ticket Updated', `${activeTicket.id} updated cleanly.`);
  };

  const orderColumns = [
    {
      key: 'srNo',
      label: 'Sr. No.',
      width: '74px',
      render: (_, __, rowIndex) => (
        <span className="cf-admin-inv-sub" style={{ fontWeight: 600 }}>
          {(ordersPage - 1) * ordersPageSize + rowIndex + 1}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Order ID',
      render: (val) => <Badge variant="mono">{val}</Badge>,
    },
    {
      key: 'itemsSummary',
      label: 'Items',
      render: (val, row) => (
        <div>
          <div style={{ color: 'var(--cf-text-main)', fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--cf-text-dim)' }}>{row.date}</div>
        </div>
      ),
    },
    {
      key: 'payment',
      label: 'Payment',
      render: (val) => <Badge variant="neutral">{val}</Badge>,
    },
    {
      key: 'total',
      label: 'Total',
      render: (val) => (
        <span style={{ fontWeight: 800, color: 'var(--cf-text-main)' }}>
          ₹{Number(val).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge dot variant={getOrderBadgeVariant(val)}>
          {val}
        </Badge>
      ),
    },
  ];

  return (
    <div className="cf-admin-content-inner">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Clean Profile Header Banner */}
      <Card className="cf-admin-profile-banner">
        <div className="cf-admin-profile-banner-inner">
          <div className="cf-admin-cust-detail-head">
            <button
              type="button"
              className="cf-admin-back-chevron-btn"
              onClick={() => navigate('/admin/customers')}
              title="Back to Customer Directory"
              aria-label="Back to Customer Directory"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="cf-admin-cust-avatar is-xl">
              {customer.profilePic ? (
                <img src={customer.profilePic} alt={customer.name} />
              ) : (
                <span>{customer.name.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="cf-admin-profile-meta">
              <div className="cf-admin-profile-name-row">
                <h1 className="cf-admin-profile-title">{customer.name}</h1>
                <Badge variant="mono" size="sm">{customer.id}</Badge>
                <Badge dot size="sm" variant={customer.status === 'Active' ? 'completed' : 'failed'}>
                  {customer.status}
                </Badge>
              </div>
              <div className="cf-admin-profile-sub-row">
                <span>
                  <Mail size={13} /> {customer.email}
                </span>
                {customer.phone && (
                  <span>
                    <Phone size={13} /> {customer.phone}
                  </span>
                )}
                <span>
                  <MapPin size={13} /> {customer.city}
                </span>
                <span>Joined {customer.joined}</span>
              </div>
            </div>
          </div>

          <div className="cf-admin-detail-actions" ref={menuRef}>
            <div className="cf-admin-more-wrap">
              <button
                type="button"
                className="cf-admin-more-trigger"
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                title="Account Options"
                aria-label="Account Options"
              >
                <MoreVertical size={16} />
              </button>
              {moreMenuOpen && (
                <div className="cf-admin-more-menu">
                  <button
                    type="button"
                    className={`cf-admin-more-item ${customer.status === 'Active' ? 'is-danger' : ''}`}
                    onClick={handleToggleBlock}
                  >
                    {customer.status === 'Active' ? (
                      <>
                        <ShieldBan size={14} /> Block Account
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} /> Unblock Account
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Customer KPI Cards */}
      <div className="cf-bo-kpi-grid">
        <MetricCard
          title="Total Orders"
          value={customer.ordersCount}
          subtext={`Last order: ${customer.lastOrderDate}`}
          icon={ShoppingBag}
          highlighted
        />
        <MetricCard
          title="Lifetime Spend"
          value={`₹${Number(customer.totalSpent).toLocaleString('en-IN')}`}
          subtext="Completed & active orders"
          icon={IndianRupee}
        />
        <MetricCard
          title="Avg. Order Value"
          value={`₹${avgOrderValue.toLocaleString('en-IN')}`}
          subtext="Per order average"
          icon={TrendingUp}
        />
        <MetricCard
          title="Saved Addresses"
          value={addresses.length}
          subtext={customer.city}
          icon={MapPin}
        />
      </div>

      {/* Main 2-Column Content: Left Details + Right Activity Timeline */}
      <div className="cf-admin-cust-detail-layout">
        {/* Left Column */}
        <div className="cf-admin-cust-main-col">
          {/* Contact & Account Details */}
          <Card>
            <Card.Header
              title="Customer Information"
              subtitle="Personal & contact summary"
              action={
                <button
                  type="button"
                  className="cf-admin-icon-action-btn"
                  onClick={openProfileModal}
                  title="Edit profile details"
                  aria-label="Edit profile details"
                >
                  <Edit2 size={14} />
                </button>
              }
            />
            <Card.Body>
              <div className="cf-admin-cust-detail-grid">
                <div className="cf-admin-cust-detail-item">
                  <span className="cf-admin-detail-label">
                    <Mail size={13} /> Email Address
                  </span>
                  <strong>{customer.email}</strong>
                </div>
                <div className="cf-admin-cust-detail-item">
                  <span className="cf-admin-detail-label">
                    <Phone size={13} /> Phone Number
                  </span>
                  <strong>{customer.phone || 'Not provided'}</strong>
                </div>
                <div className="cf-admin-cust-detail-item">
                  <span className="cf-admin-detail-label">
                    <MapPin size={13} /> Primary City
                  </span>
                  <strong>{customer.city}</strong>
                </div>
                <div className="cf-admin-cust-detail-item">
                  <span className="cf-admin-detail-label">Account Joined</span>
                  <strong>{customer.joined}</strong>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Saved Delivery Addresses (Add New & Set Primary only) */}
          <Card>
            <Card.Header
              title={`Delivery Addresses (${addresses.length})`}
              subtitle="Add new address or change primary delivery location"
              action={
                <Button variant="outline" size="sm" icon={Plus} onClick={openAddAddressModal}>
                  Add Address
                </Button>
              }
            />
            <Card.Body>
              {addresses.length === 0 ? (
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--cf-text-muted)' }}>
                  No saved addresses on file.
                </p>
              ) : (
                <div className="cf-admin-cust-addr-list">
                  {addresses.map((addr, idx) => (
                    <div
                      key={addr.id || idx}
                      className={`cf-admin-cust-addr-card ${idx === 0 ? 'is-primary' : ''}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span className="cf-admin-detail-label">{addr.label || 'Address'}</span>
                        {idx === 0 && <Badge variant="completed" size="sm">PRIMARY</Badge>}
                      </div>
                      <strong style={{ fontSize: '0.86rem', color: 'var(--cf-text-main)' }}>
                        {addr.name || customer.name}
                      </strong>
                      <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--cf-text-muted)', lineHeight: 1.5, flex: 1 }}>
                        {addr.address}
                        {addr.landmark ? `, ${addr.landmark}` : ''}
                        <br />
                        {addr.city}, {addr.state} - {addr.postalCode}
                        {addr.phone ? ` • ${addr.phone}` : ''}
                      </p>
                      {idx !== 0 && (
                        <div className="cf-admin-addr-footer">
                          <button
                            type="button"
                            className="cf-admin-set-primary-btn"
                            onClick={() => handleSetPrimaryAddress(addr.id)}
                          >
                            Set as Primary
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Admin Internal Note */}
          <Card>
            <Card.Header
              title="Admin Note"
              subtitle="Internal handling or delivery preference note"
              action={
                !editingNote && (
                  <button
                    type="button"
                    className="cf-admin-icon-action-btn"
                    onClick={() => {
                      setNoteDraft(customer.adminNote || '');
                      setEditingNote(true);
                    }}
                    title={customer.adminNote ? 'Edit note' : 'Add note'}
                    aria-label={customer.adminNote ? 'Edit note' : 'Add note'}
                  >
                    <Edit2 size={14} />
                  </button>
                )
              }
            />
            <Card.Body>
              {editingNote ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Textarea
                    rows={3}
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="Add internal note about this customer..."
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button variant="outline" size="sm" onClick={() => setEditingNote(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSaveNote}>
                      Save Note
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="cf-admin-note-display">
                  <StickyNote size={15} />
                  <span>{customer.adminNote || 'No internal notes added yet.'}</span>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Order History with Pagination */}
          <Card>
            <Card.Header
              title={`Order History (${orders.length})`}
              subtitle="Orders placed by this customer"
            />
            <Card.Body style={{ padding: 0 }}>
              <Table
                className="is-embedded"
                columns={orderColumns}
                data={paginatedOrders}
                keyField="id"
                emptyMessage="No orders recorded yet."
                pagination={{
                  currentPage: ordersPage,
                  pageSize: ordersPageSize,
                  totalItems: orders.length,
                  pageSizeOptions: [5, 10, 20],
                  onPageChange: setOrdersPage,
                  onPageSizeChange: (newSize) => {
                    setOrdersPageSize(newSize);
                    setOrdersPage(1);
                  },
                }}
              />
            </Card.Body>
          </Card>

          {/* Support Tickets History */}
          <Card>
            <Card.Header
              title={`Support Tickets (${tickets.length})`}
              subtitle="Click any ticket to view full message, timelogs, or respond"
            />
            <Card.Body>
              {tickets.length === 0 ? (
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--cf-text-muted)' }}>
                  No support tickets raised by this customer.
                </p>
              ) : (
                <div className="cf-admin-support-review-list">
                  {tickets.map((t) => {
                    const logs = getTicketTimelogs(t);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        className="cf-admin-ticket-row"
                        onClick={() => openTicketModal(t)}
                      >
                        <div className="cf-admin-ticket-row-top">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <Ticket size={14} color="var(--cf-accent-primary)" />
                            <Badge variant="mono" size="sm">{t.id}</Badge>
                            <strong>{t.category}</strong>
                            <span style={{ fontSize: '0.76rem', color: 'var(--cf-text-muted)' }}>
                              • Order {t.orderId}
                            </span>
                          </div>
                          <Badge variant={getTicketBadgeVariant(t.status)} size="sm" dot>
                            {t.status}
                          </Badge>
                        </div>
                        <p className="cf-admin-ticket-row-desc">{t.description}</p>
                        <div className="cf-admin-ticket-row-meta">
                          <span>Raised {t.createdAt} • {logs.length} log(s)</span>
                          <span className="cf-admin-ticket-view-link">View History →</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Product Reviews History */}
          <Card>
            <Card.Header
              title={`Product Reviews (${reviews.length})`}
              subtitle="Submitted product ratings and customer feedback"
            />
            <Card.Body>
              {reviews.length === 0 ? (
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--cf-text-muted)' }}>
                  No product reviews submitted yet.
                </p>
              ) : (
                <div className="cf-admin-support-review-list">
                  {reviews.map((r) => (
                    <div key={r.id} className="cf-admin-subrecord-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <Star size={14} fill="var(--cf-accent-warning)" color="var(--cf-accent-warning)" />
                        <strong>{r.productTitle || 'Reviewed Product'}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--cf-text-muted)' }}>
                          &ldquo;{r.comment || 'Rating submitted'}&rdquo;
                        </span>
                      </div>
                      <Badge variant="warning" size="sm">
                        {Number(r.rating).toFixed(1)} ★
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Right Column: Scrollable Activity Timeline Matched to Left Height */}
        <div className="cf-admin-cust-side-col">
          <Card className="cf-admin-timeline-card">
            <Card.Header
              title="Activity Timeline"
              subtitle={`${activities.length} recorded event(s)`}
              action={<Clock size={16} color="var(--cf-text-muted)" />}
            />
            <Card.Body>
              <ActivityTimeline
                className="cf-admin-timeline-fill"
                emptyText="No activity logged yet."
                items={activities.map((act) => ({
                  id: act.id,
                  title: act.title,
                  description: act.detail,
                  timestamp: act.timestamp,
                  tone: act.type || 'account',
                }))}
              />
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal - Name & Phone Number only */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Edit Customer Profile"
        subtitle={`Customer ID: ${customer.id} • Only name and phone can be edited`}
        maxWidth="480px"
      >
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Full Name *"
            required
            value={profileForm.name}
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
          />
          <Input
            label="Phone Number"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
          <Input label="Email Address (Fixed)" value={customer.email} readOnly disabled />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.25rem' }}>
            <Button type="button" variant="outline" onClick={() => setProfileModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Shared Add Address Modal */}
      <AddressFormModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onSave={handleAddAddress}
        defaultName={customer.name || ''}
        defaultPhone={customer.phone || ''}
        defaultAsPrimary={addresses.length === 0}
        subtitle={`Adding delivery address for ${customer.name}`}
      />

      {/* Admin Ticket History & Timelog Modal */}
      <Modal
        isOpen={!!activeTicket}
        onClose={() => setSelectedTicketId(null)}
        icon={Ticket}
        title={activeTicket ? `${activeTicket.id} • ${activeTicket.category}` : 'Ticket History'}
        subtitle={
          activeTicket
            ? `Order ${activeTicket.orderId} • ${activeTicket.affectedItem || 'Entire Order'} • Raised ${activeTicket.createdAt}`
            : ''
        }
        maxWidth="780px"
      >
        {activeTicket && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="cf-admin-subrecord-row">
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--cf-text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Customer Issue
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--cf-text-main)', lineHeight: 1.5 }}>
                  {activeTicket.description}
                </p>
              </div>
              <Badge variant={getTicketBadgeVariant(activeTicket.status)} dot>
                {activeTicket.status}
              </Badge>
            </div>

            <TicketAttachments attachments={activeTicket.attachments} />

            <div>
              <h4 style={{ fontSize: '0.84rem', fontWeight: 700, margin: '0 0 0.65rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Ticket Time Logs ({getTicketTimelogs(activeTicket).length})
              </h4>
              <ActivityTimeline
                style={{ maxHeight: '220px' }}
                items={getTicketTimelogs(activeTicket).map((log) => ({
                  id: log.id,
                  title: log.actor,
                  tone: getTicketBadgeVariant(log.status || activeTicket.status),
                  badgeText: log.status || null,
                  badgeVariant: getTicketBadgeVariant(log.status || activeTicket.status),
                  timestamp: log.timestamp,
                  description: log.message,
                  extra: <TicketAttachments attachments={log.attachments} />,
                }))}
              />
            </div>

            <form onSubmit={handleAdminTicketUpdate} className="cf-admin-ticket-reply-form">
              <div className="cf-admin-cust-detail-grid">
                <Select
                  label="Update Ticket Status"
                  value={ticketStatusDraft}
                  onChange={(e) => setTicketStatusDraft(e.target.value)}
                  options={[
                    { value: 'Open', label: 'Open' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Resolved', label: 'Resolved' },
                    { value: 'Closed', label: 'Closed' },
                  ]}
                />
              </div>
              <Textarea
                label="Support Response"
                rows={3}
                value={ticketReply}
                onChange={(e) => setTicketReply(e.target.value)}
                placeholder="Write a response to log on this ticket..."
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button type="button" variant="outline" onClick={() => setSelectedTicketId(null)}>
                  Close
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={Send}
                  disabled={!ticketReply.trim() && ticketStatusDraft === activeTicket.status}
                >
                  Save Update
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
