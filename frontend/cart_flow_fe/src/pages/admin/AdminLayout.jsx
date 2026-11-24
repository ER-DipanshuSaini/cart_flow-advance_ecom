import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Boxes,
  LogOut,
  ChevronRight,
  ExternalLink,
  Key,
  Shield,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle, Modal, Button, Badge } from '../../components/ui';
import './AdminConsole.css';

export default function AdminLayout() {
  const { adminUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [adminUsersModalOpen, setAdminUsersModalOpen] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin-portal');
  };

  const getBreadcrumb = () => {
    const p = location.pathname;
    if (p.includes('/admin/orders')) return 'Orders & Fulfillment';
    if (p.includes('/admin/inventory')) return 'Supplier Warehouse';
    if (p.includes('/admin/logistics')) return 'Logistics & Shipping';
    return 'Operations Overview';
  };

  return (
    <div className="cf-bo-layout-root">
      {/* 1. Left Sidebar: Pure E-Commerce Operations */}
      <aside className="cf-bo-sidebar">
        {/* Brand Block */}
        <div className="cf-bo-brand-block">
          <div className="cf-bo-brand-top">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="cf-bo-falcon-logo">
              <path
                d="M12 3C8 3 3 7 2 12C4 10 7 9 9 10C6 12 5 15 6 18C8 16 11 15 13 16C12 13 14 10 17 9C19 11 20 14 19 17C21 14 22 10 22 7C19 5 15 3 12 3Z"
                fill="currentColor"
              />
            </svg>
            <div className="cf-bo-brand-text">
              <h2 className="cf-bo-title-text">CARTFLOW</h2>
              <span className="cf-bo-subtitle-text">RETAIL & OPERATIONS CONSOLE</span>
            </div>
          </div>

          {/* Status Row */}
          <div className="cf-bo-console-status-row">
            <div className="cf-bo-console-indicator">
              <span className="cf-bo-indicator-dot" />
              <span>LIVE STORE ENGINE</span>
            </div>
            <span className="cf-bo-admin-badge">ADMIN</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="cf-bo-nav-container">
          <div className="cf-bo-nav-section">
            <span className="cf-bo-section-heading">COMMERCE WORKSPACE</span>
            <div className="cf-bo-nav-links">
              <NavLink
                to="/admin/overview"
                className={({ isActive }) => `cf-bo-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <div className="cf-bo-item-left">
                  <LayoutGrid size={16} />
                  <span>Overview</span>
                </div>
                <ChevronRight size={14} className="cf-bo-chevron" />
              </NavLink>

              <NavLink
                to="/admin/orders"
                className={({ isActive }) => `cf-bo-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <div className="cf-bo-item-left">
                  <ShoppingBag size={16} />
                  <span>Orders & Fulfillment</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin/inventory"
                className={({ isActive }) => `cf-bo-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <div className="cf-bo-item-left">
                  <Boxes size={16} />
                  <span>Supplier Warehouse</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin/logistics"
                className={({ isActive }) => `cf-bo-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <div className="cf-bo-item-left">
                  <Truck size={16} />
                  <span>Logistics & Shipping</span>
                </div>
              </NavLink>

              <button
                type="button"
                className="cf-bo-nav-item"
                onClick={() => setCustomerModalOpen(true)}
              >
                <div className="cf-bo-item-left">
                  <Users size={16} />
                  <span>Customer Directory</span>
                </div>
              </button>

              <button
                type="button"
                className="cf-bo-nav-item"
                onClick={() => setAdminUsersModalOpen(true)}
              >
                <div className="cf-bo-item-left">
                  <ShieldCheck size={16} />
                  <span>Admin Users</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer User Box */}
        <div className="cf-bo-sidebar-footer">
          <div className="cf-bo-avatar-badge">A</div>
          <div className="cf-bo-user-text">
            <span className="cf-bo-user-name">CartFlow Admin</span>
            <span className="cf-bo-user-role">Workspace Administrator</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Workspace Body */}
      <div className="cf-bo-main-viewport">
        {/* Top App Header */}
        <header className="cf-bo-topbar">
          <div className="cf-bo-breadcrumbs">
            <span>Workspace</span>
            <ChevronRight size={13} className="cf-bo-bc-sep" />
            <span className="cf-bo-bc-active">{getBreadcrumb()}</span>
          </div>

          <div className="cf-bo-topbar-controls">
            {/* Storefront External Link */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="cf-bo-icon-button"
              title="View Customer Storefront"
            >
              <ExternalLink size={16} />
            </a>

            {/* Standard Reusable Theme Toggle */}
            <ThemeToggle />

            {/* Profile Avatar */}
            <div className="cf-bo-topbar-avatar" title="Logged in as CartFlow Operations Lead">
              A
            </div>

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleLogout}
              className="cf-bo-icon-button"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <div className="cf-bo-scrollable-body">
          <Outlet />
        </div>
      </div>

      {/* Customer Directory Modal */}
      <Modal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        title="Customer Directory & VIP Ledger"
        subtitle="437 registered customer profiles across 18 metro hubs"
        footer={
          <Button variant="primary" onClick={() => setCustomerModalOpen(false)}>
            Close Directory
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Badge variant="completed" dot>437 Total Accounts</Badge>
            <Badge variant="processing" dot>92 VIP Tier Shoppers</Badge>
            <Badge variant="neutral">Retention: 78%</Badge>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--cf-text-muted)', lineHeight: 1.6 }}>
            Customer profiles sync in real time with Django Rest Framework auth guards and Razorpay/Stripe customer tokens. VIP tier shoppers receive priority dispatch manifests.
          </div>
        </div>
      </Modal>

      {/* Admin Users Modal */}
      <Modal
        isOpen={adminUsersModalOpen}
        onClose={() => setAdminUsersModalOpen(false)}
        title="Admin Users & Role Permissions"
        subtitle="Role-Based Access Control (RBAC) & API Key Guard"
        footer={
          <Button variant="primary" onClick={() => setAdminUsersModalOpen(false)}>
            Acknowledge
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Badge variant="warning" dot>Root Access: Secured</Badge>
            <Badge variant="mono">JWT / PBKDF2</Badge>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--cf-text-muted)', lineHeight: 1.6 }}>
            Super Admin, Supplier/Vendor, and Logistics Lead privileges are partitioned. Sensitive endpoints require valid workspace tokens.
          </div>
        </div>
      </Modal>
    </div>
  );
}
