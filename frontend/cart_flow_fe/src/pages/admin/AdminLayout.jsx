import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Boxes,
  FolderKanban,
  LogOut,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle, Button } from '../../components/ui';
import { getCurrentAdminUser } from '../../data/adminUsers';
import './AdminConsole.css';

export default function AdminLayout() {
  const { logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(getCurrentAdminUser);

  useEffect(() => {
    const syncProfile = () => setCurrentAdmin(getCurrentAdminUser());
    window.addEventListener('cf-admin-profile-updated', syncProfile);
    return () => window.removeEventListener('cf-admin-profile-updated', syncProfile);
  }, []);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('cf_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('cf_admin_sidebar_collapsed', String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin-portal');
  };

  const getBreadcrumbs = () => {
    const p = location.pathname;
    if (p.includes('/admin/orders')) return [{ label: 'Orders & Fulfillment' }];
    if (p.includes('/admin/catalog/new')) {
      return [
        { label: 'Catalog', to: '/admin/catalog' },
        { label: 'Add Catalog' },
      ];
    }
    if (p.includes('/admin/catalog/')) {
      return [
        { label: 'Catalog', to: '/admin/catalog' },
        { label: 'Catalog Workspace' },
      ];
    }
    if (p.includes('/admin/catalog')) return [{ label: 'Catalog' }];
    if (p.includes('/admin/inventory/new')) {
      return [
        { label: 'Inventory', to: '/admin/inventory' },
        { label: 'Add Product' },
      ];
    }
    if (p.includes('/admin/inventory/')) {
      return [
        { label: 'Inventory', to: '/admin/inventory' },
        { label: 'Product Workspace' },
      ];
    }
    if (p.includes('/admin/inventory')) return [{ label: 'Inventory' }];
    if (p.includes('/admin/logistics')) return [{ label: 'Logistics & Shipping' }];
    if (p.includes('/admin/customers/')) {
      return [
        { label: 'Customer Directory', to: '/admin/customers' },
        { label: 'Customer Profile' },
      ];
    }
    if (p.includes('/admin/customers')) return [{ label: 'Customer Directory' }];
    if (p.includes('/admin/users')) return [{ label: 'Admin Users' }];
    if (p.includes('/admin/profile')) return [{ label: 'My Profile' }];
    return [{ label: 'Operations Overview' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="cf-bo-layout-root">
      {mobileNavOpen && (
        <div
          className="cf-bo-sidebar-backdrop"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 1. Left Sidebar: Pure E-Commerce Operations */}
      <aside
        className={`cf-bo-sidebar ${mobileNavOpen ? 'is-open' : ''} ${
          sidebarCollapsed ? 'is-collapsed' : ''
        }`}
      >
        {/* Brand Block */}
        <div className="cf-bo-brand-block">
          <div className="cf-bo-brand-head-row">
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
            <button
              type="button"
              className="cf-bo-collapse-btn"
              onClick={toggleSidebarCollapsed}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
            <button
              type="button"
              className="cf-bo-sidebar-close-btn"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="cf-bo-nav-container">
          <div className="cf-bo-nav-section">
            <span className="cf-bo-section-heading">COMMERCE WORKSPACE</span>
            <div className="cf-bo-nav-links">
              <NavLink
                to="/admin/overview"
                title="Overview"
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
                title="Orders & Fulfillment"
                className={({ isActive }) => `cf-bo-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <div className="cf-bo-item-left">
                  <ShoppingBag size={16} />
                  <span>Orders & Fulfillment</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin/inventory"
                title="Inventory"
                className={({ isActive }) => `cf-bo-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <div className="cf-bo-item-left">
                  <Boxes size={16} />
                  <span>Inventory</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin/catalog"
                title="Catalog"
                className={({ isActive }) => `cf-bo-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <div className="cf-bo-item-left">
                  <FolderKanban size={16} />
                  <span>Catalog</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin/logistics"
                title="Logistics & Shipping"
                className={({ isActive }) => `cf-bo-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <div className="cf-bo-item-left">
                  <Truck size={16} />
                  <span>Logistics & Shipping</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin/customers"
                title="Customer Directory"
                className={({ isActive }) => `cf-bo-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <div className="cf-bo-item-left">
                  <Users size={16} />
                  <span>Customer Directory</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin/users"
                title="Admin Users"
                className={({ isActive }) => `cf-bo-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <div className="cf-bo-item-left">
                  <ShieldCheck size={16} />
                  <span>Admin Users</span>
                </div>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Sidebar Footer User Box */}
        <button
          type="button"
          className="cf-bo-sidebar-footer is-clickable"
          onClick={() => navigate('/admin/profile')}
          title="Open My Profile & Security"
        >
          <div className="cf-bo-avatar-badge">
            {currentAdmin.profilePic ? (
              <img src={currentAdmin.profilePic} alt={currentAdmin.firstName} />
            ) : (
              `${currentAdmin.firstName?.charAt(0) || 'A'}${currentAdmin.lastName?.charAt(0) || ''}`.toUpperCase()
            )}
          </div>
          <div className="cf-bo-user-text">
            <span className="cf-bo-user-name">
              {currentAdmin.firstName} {currentAdmin.lastName}
            </span>
            <span className="cf-bo-user-role">{currentAdmin.role}</span>
          </div>
        </button>
      </aside>

      {/* 2. Main Workspace Body */}
      <div className="cf-bo-main-viewport">
        {/* Top App Header */}
        <header className="cf-bo-topbar">
          <div className="cf-bo-topbar-left">
            <button
              type="button"
              className="cf-bo-mobile-menu-btn"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>
            <div className="cf-bo-breadcrumbs">
              <span className="cf-bo-bc-root">Workspace</span>
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.label}>
                    <ChevronRight size={13} className="cf-bo-bc-sep" />
                    {crumb.to && !isLast ? (
                      <Link to={crumb.to} className="cf-bo-bc-link">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="cf-bo-bc-active">{crumb.label}</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="cf-bo-topbar-controls">
            {/* Storefront External Link */}
            <Button
              variant="outline"
              size="sm"
              icon={ExternalLink}
              onClick={() => window.open('/', '_blank')}
              title="View Customer Storefront"
            >
              Storefront
            </Button>

            {/* Standard Reusable Theme Toggle */}
            <ThemeToggle />

            {/* Profile Avatar */}
            <button
              type="button"
              className="cf-bo-topbar-avatar is-clickable"
              onClick={() => navigate('/admin/profile')}
              title="Open My Profile & Security"
              aria-label="Open My Profile"
            >
              {currentAdmin.profilePic ? (
                <img src={currentAdmin.profilePic} alt={currentAdmin.firstName} />
              ) : (
                `${currentAdmin.firstName?.charAt(0) || 'A'}`
              )}
            </button>

            {/* Sign Out */}
            <Button
              variant="ghost"
              size="sm"
              icon={LogOut}
              onClick={handleLogout}
              title="Sign Out"
            >
              Exit
            </Button>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <div className="cf-bo-scrollable-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
