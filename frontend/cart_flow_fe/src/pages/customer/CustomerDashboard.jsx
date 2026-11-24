import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Package,
  Sparkles,
  MapPin,
  Shield,
  LogOut,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  RotateCcw,
  Plus,
  Eye,
  ShoppingBag,
  ExternalLink,
  Edit2,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button, Card, Badge, Table, Input } from '../../components/ui';
import './CustomerDashboard.css';

// Mock Customer Orders with tracking stages
const CUSTOMER_ORDERS = [
  {
    id: 'CF-99418',
    date: 'Nov 23, 2026',
    total: 8198,
    status: 'In Transit',
    courier: 'BlueDart Express • AWB: 8847291039',
    estimatedDelivery: 'Nov 26, 2026',
    currentStage: 3, // 1: Confirmed, 2: Tailoring/Packed, 3: Shipped, 4: Delivered
    items: [
      {
        title: 'Italian Double-Breasted Structured Blazer',
        size: '40R',
        color: 'Navy Blue',
        price: 5999,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
      },
      {
        title: 'The Riviera Textured Knit Polo',
        size: 'M',
        color: 'Ecru',
        price: 2199,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'CF-98102',
    date: 'Nov 12, 2026',
    total: 2699,
    status: 'Delivered',
    courier: 'Delhivery Surface • Delivered on Nov 15',
    estimatedDelivery: 'Nov 15, 2026',
    currentStage: 4,
    items: [
      {
        title: 'Pleated Gurkha Trousers - Straight Cut',
        size: '32',
        color: 'Espresso',
        price: 2699,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'CF-97430',
    date: 'Oct 28, 2026',
    total: 4499,
    status: 'Delivered',
    courier: 'Delhivery Express • Delivered on Oct 31',
    estimatedDelivery: 'Oct 31, 2026',
    currentStage: 4,
    items: [
      {
        title: 'Minimalist Suede Tassel Loafers',
        size: '42',
        color: 'Dark Chocolate',
        price: 4499,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
];

export default function CustomerDashboard() {
  const { customer, logoutCustomer } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'addresses' | 'security'
  const [selectedOrder, setSelectedOrder] = useState(CUSTOMER_ORDERS[0]);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Measurements Form state
  const [measurements, setMeasurements] = useState({
    height: "5'11\" (180 cm)",
    weight: '74 kg',
    chest: '40 inches',
    waist: '32 inches',
    shoulder: '18 inches',
    preferredFit: 'Tailored / Slim Contemporary',
  });
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleLogout = () => {
    logoutCustomer();
    navigate('/login');
  };

  const handleSaveMeasurements = (e) => {
    e.preventDefault();
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  return (
    <div className="cf-store-container cf-customer-dashboard-wrap">
      {/* 1. Header Profile Banner */}
      <div className="cf-cust-header-banner">
        <div className="cf-cust-profile-cell">
          <div className="cf-cust-avatar-large">
            {customer?.avatar || customer?.name?.charAt(0) || 'C'}
          </div>
          <div className="cf-cust-user-info">
            <div className="cf-cust-name-row">
              <h1 className="cf-cust-name">{customer?.name || 'Valued Client'}</h1>
              <span className="cf-cust-badge-vip">{customer?.tier || 'VIP MEMBER'}</span>
            </div>
            <p className="cf-cust-email-line">
              {customer?.email || 'client@cartflow.luxury'} • Member since {customer?.joined || '2025'}
            </p>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="cf-cust-stats-strip">
          <div className="cf-cust-stat-item">
            <span className="cf-cust-stat-val">3</span>
            <span className="cf-cust-stat-label">Orders</span>
          </div>
          <div className="cf-cust-stat-divider" />
          <div className="cf-cust-stat-item">
            <span className="cf-cust-stat-val">₹15,396</span>
            <span className="cf-cust-stat-label">Lifetime Value</span>
          </div>
          <div className="cf-cust-stat-divider" />
          <div className="cf-cust-stat-item">
            <span className="cf-cust-stat-val">2</span>
            <span className="cf-cust-stat-label">Saved Addresses</span>
          </div>
          <div className="cf-cust-stat-divider" />
          <Button
            variant="outline"
            size="sm"
            icon={LogOut}
            onClick={handleLogout}
            className="cf-cust-logout-btn"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* 2. Main Dashboard Split Layout */}
      <div className="cf-cust-layout-grid">
        {/* Left Navigation Sidebar */}
        <aside className="cf-cust-sidebar">
          <div className="cf-cust-nav-menu">
            <button
              type="button"
              className={`cf-cust-nav-link ${activeTab === 'orders' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={17} />
              <span>My Orders & Tracking</span>
              <span className="cf-cust-nav-count">3</span>
            </button>

            <button
              type="button"
              className={`cf-cust-nav-link ${activeTab === 'profile' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={17} />
              <span>Profile & Sizing</span>
            </button>

            <button
              type="button"
              className={`cf-cust-nav-link ${activeTab === 'addresses' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <MapPin size={17} />
              <span>Saved Addresses</span>
            </button>

            <button
              type="button"
              className={`cf-cust-nav-link ${activeTab === 'security' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield size={17} />
              <span>Security & Password</span>
            </button>
          </div>

          {/* Quick Concierge Support Box */}
          <div className="cf-cust-concierge-card">
            <h4>Private Client Concierge</h4>
            <p>Need bespoke tailoring alteration or delivery priority dispatch?</p>
            <a href="mailto:concierge@cartflow.luxury" className="cf-cust-concierge-link">
              Contact Stylist <ArrowRight size={13} />
            </a>
          </div>
        </aside>

        {/* Right Tab Content Panel */}
        <main className="cf-cust-content-area">
          {/* TAB 1: ORDERS & TRACKING */}
          {activeTab === 'orders' && (
            <div className="cf-cust-tab-panel">
              <div className="cf-panel-header">
                <div>
                  <h2 className="cf-panel-title">Order History & Live Tracking</h2>
                  <p className="cf-panel-subtitle">Review shipments, tracking waybills, and invoice downloads.</p>
                </div>
              </div>

              {/* Order Cards List */}
              <div className="cf-orders-cards-list">
                {CUSTOMER_ORDERS.map((order) => {
                  const isExpanded = selectedOrder?.id === order.id;

                  return (
                    <div
                      key={order.id}
                      className={`cf-order-box-card ${isExpanded ? 'is-selected' : ''}`}
                    >
                      {/* Order Card Top Bar */}
                      <div
                        className="cf-order-box-header"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="cf-order-id-meta">
                          <span className="cf-order-ref">{order.id}</span>
                          <span className="cf-order-date">Ordered on {order.date}</span>
                        </div>

                        <div className="cf-order-status-group">
                          <span className="cf-order-amount">₹{order.total.toLocaleString('en-IN')}</span>
                          <Badge
                            variant={
                              order.status === 'Delivered'
                                ? 'completed'
                                : order.status === 'In Transit'
                                ? 'processing'
                                : 'warning'
                            }
                            dot
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Live Fulfillment Progress Tracker */}
                      <div className="cf-order-timeline-box">
                        <div className="cf-timeline-steps">
                          {[
                            { step: 1, label: 'Confirmed' },
                            { step: 2, label: 'Handcrafted' },
                            { step: 3, label: 'In Transit' },
                            { step: 4, label: 'Delivered' },
                          ].map((s) => {
                            const isDone = order.currentStage >= s.step;
                            const isCurrent = order.currentStage === s.step;

                            return (
                              <div
                                key={s.step}
                                className={`cf-timeline-node ${isDone ? 'is-done' : ''} ${
                                  isCurrent ? 'is-current' : ''
                                }`}
                              >
                                <div className="cf-timeline-circle">
                                  {isDone ? <Check size={12} /> : s.step}
                                </div>
                                <span className="cf-timeline-label">{s.label}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="cf-timeline-courier-line">
                          <Truck size={15} color="var(--cf-accent-primary)" />
                          <span>{order.courier}</span>
                          <span className="cf-est-arrival">
                            • Est. Arrival: <strong>{order.estimatedDelivery}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Order Items Breakdown */}
                      <div className="cf-order-items-grid">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="cf-order-item-row">
                            <img src={item.image} alt={item.title} className="cf-order-thumb" />
                            <div className="cf-order-item-info">
                              <h4 className="cf-order-item-title">{item.title}</h4>
                              <p className="cf-order-item-spec">
                                Size: {item.size} • Color: {item.color} • Qty: {item.qty}
                              </p>
                              <span className="cf-order-item-price">₹{item.price.toLocaleString('en-IN')}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                addToCart({ id: idx, title: item.title, price: item.price, imageUrl: item.image }, 1);
                              }}
                            >
                              Re-Order
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer Actions */}
                      <div className="cf-order-footer-bar">
                        <span className="cf-return-window-notice">
                          Eligible for complimentary return / exchange until 30 days post delivery.
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={Download}
                            onClick={() => alert(`Downloading official PDF Invoice for ${order.id}`)}
                          >
                            Tax Invoice
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            icon={RotateCcw}
                            onClick={() => alert(`Exchange ticket initiated for ${order.id}. Support concierge notified.`)}
                          >
                            Return / Exchange
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & SIZING PREFERENCES */}
          {activeTab === 'profile' && (
            <div className="cf-cust-tab-panel">
              <div className="cf-panel-header">
                <div>
                  <h2 className="cf-panel-title">Client Profile & Sizing Preferences</h2>
                  <p className="cf-panel-subtitle">
                    Manage your contact information, delivery defaults, and tailored garment fit preferences.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveMeasurements} className="cf-measurements-form">
                {isSavedNotice && (
                  <div className="cf-measurements-saved-banner">
                    <CheckCircle2 size={16} /> Measurement specifications updated successfully!
                  </div>
                )}

                <div className="cf-form-row-2">
                  <Input
                    label="Full Name"
                    value={customer?.name || 'Vikramaditya Roy'}
                    readOnly
                  />
                  <Input
                    label="Email Address"
                    value={customer?.email || 'client@cartflow.luxury'}
                    readOnly
                  />
                </div>

                <div className="cf-form-row-2">
                  <Input
                    label="Height"
                    value={measurements.height}
                    onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
                  />
                  <Input
                    label="Weight"
                    value={measurements.weight}
                    onChange={(e) => setMeasurements({ ...measurements, weight: e.target.value })}
                  />
                </div>

                <div className="cf-form-row-3">
                  <Input
                    label="Chest Circumference"
                    value={measurements.chest}
                    onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                  />
                  <Input
                    label="Waist Size"
                    value={measurements.waist}
                    onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                  />
                  <Input
                    label="Shoulder Width"
                    value={measurements.shoulder}
                    onChange={(e) => setMeasurements({ ...measurements, shoulder: e.target.value })}
                  />
                </div>

                <div className="cf-form-actions-bar">
                  <Button type="submit" variant="primary">
                    Update Sizing Profile
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="cf-cust-tab-panel">
              <div className="cf-panel-header">
                <div>
                  <h2 className="cf-panel-title">Saved Shipping Destinations</h2>
                  <p className="cf-panel-subtitle">Manage domestic and international express delivery locations.</p>
                </div>
                <Button variant="outline" size="sm" icon={Plus} onClick={() => alert('New Address Modal')}>
                  Add Address
                </Button>
              </div>

              <div className="cf-addresses-grid">
                <div className="cf-address-card is-default">
                  <div className="cf-address-top">
                    <span className="cf-address-type">PRIMARY RESIDENCE</span>
                    <Badge variant="completed">DEFAULT SHIPPING</Badge>
                  </div>
                  <h4 className="cf-address-recipient">Vikramaditya Roy</h4>
                  <p className="cf-address-text">
                    Penthouse 4B, The Oberoi Sky Heights<br />
                    Worli Sea Face, South Mumbai<br />
                    Maharashtra - 400018<br />
                    Phone: +91 98765 43210
                  </p>
                  <div className="cf-address-actions">
                    <button type="button" className="cf-addr-btn"><Edit2 size={13} /> Edit</button>
                  </div>
                </div>

                <div className="cf-address-card">
                  <div className="cf-address-top">
                    <span className="cf-address-type">OFFICE / EXECUTIVE STUDIO</span>
                  </div>
                  <h4 className="cf-address-recipient">Vikramaditya Roy</h4>
                  <p className="cf-address-text">
                    Suite 902, One Horizon Center<br />
                    Golf Course Road, DLF Phase 5<br />
                    Gurugram, Haryana - 122002<br />
                    Phone: +91 98765 43210
                  </p>
                  <div className="cf-address-actions">
                    <button type="button" className="cf-addr-btn"><Edit2 size={13} /> Edit</button>
                    <button type="button" className="cf-addr-btn is-make-default">Set Default</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & PASSWORDS */}
          {activeTab === 'security' && (
            <div className="cf-cust-tab-panel">
              <div className="cf-panel-header">
                <div>
                  <h2 className="cf-panel-title">Security & Credential Management</h2>
                  <p className="cf-panel-subtitle">Ensure your account and payment token credentials remain secure.</p>
                </div>
              </div>

              <div className="cf-security-box">
                <div className="cf-security-row">
                  <div>
                    <h4>Password Authentication</h4>
                    <p>Last changed 24 days ago. Strong alphanumeric requirement active.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => alert('Change password modal')}>
                    Update Password
                  </Button>
                </div>

                <div className="cf-security-row">
                  <div>
                    <h4>Two-Factor Authentication (2FA)</h4>
                    <p>Protect account orders with SMS and authenticator app confirmation.</p>
                  </div>
                  <Badge variant="completed">ACTIVE • SMS VERIFIED</Badge>
                </div>

                <div className="cf-security-row">
                  <div>
                    <h4>Connected Identity Providers</h4>
                    <p>Google Workspace OAuth linked to {customer?.email || 'vikram.roy@cartflow.luxury'}</p>
                  </div>
                  <Badge variant="processing">GOOGLE LINKED</Badge>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
