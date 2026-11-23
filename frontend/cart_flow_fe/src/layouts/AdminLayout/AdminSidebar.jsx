import React from 'react';
import { LayoutGrid, Users, Layers, ShieldCheck, ChevronRight, Zap } from 'lucide-react';
import './AdminSidebar.css';

export default function AdminSidebar({ activeTab = 'overview', onTabChange }) {
  return (
    <aside className="cf-admin-sidebar">
      {/* Brand & Console Title */}
      <div className="cf-sidebar-brand-wrapper">
        <div className="cf-sidebar-logo-row">
          <div className="cf-sidebar-logo-icon">
            <Zap size={20} className="cf-logo-zap" />
          </div>
          <div>
            <div className="cf-sidebar-brand-name">
              CART<span>FLOW</span>
            </div>
            <div className="cf-sidebar-tagline">ADVANCE TRY-ON ENGINE</div>
          </div>
        </div>

        <div className="cf-sidebar-badge-row">
          <span className="cf-console-tag">• TRY-ON CONSOLE</span>
          <span className="cf-admin-pill">ADMIN</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="cf-sidebar-nav-container">
        <div className="cf-nav-section-title">WORKSPACE</div>

        <nav className="cf-sidebar-nav">
          <button
            className={`cf-nav-item ${activeTab === 'overview' ? 'is-active' : ''}`}
            onClick={() => onTabChange && onTabChange('overview')}
          >
            <div className="cf-nav-item-left">
              <LayoutGrid size={18} />
              <span>Overview</span>
            </div>
            <ChevronRight size={14} className="cf-nav-arrow" />
          </button>

          <button
            className={`cf-nav-item ${activeTab === 'users' ? 'is-active' : ''}`}
            onClick={() => onTabChange && onTabChange('users')}
          >
            <div className="cf-nav-item-left">
              <Users size={18} />
              <span>Users</span>
            </div>
          </button>

          <button
            className={`cf-nav-item ${activeTab === 'try-on' ? 'is-active' : ''}`}
            onClick={() => onTabChange && onTabChange('try-on')}
          >
            <div className="cf-nav-item-left">
              <Layers size={18} />
              <span>Try-on Process</span>
            </div>
          </button>

          <button
            className={`cf-nav-item ${activeTab === 'admin-users' ? 'is-active' : ''}`}
            onClick={() => onTabChange && onTabChange('admin-users')}
          >
            <div className="cf-nav-item-left">
              <ShieldCheck size={18} />
              <span>Admin Users</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Bottom Profile Footer */}
      <div className="cf-sidebar-footer">
        <div className="cf-admin-avatar">C</div>
        <div className="cf-admin-info">
          <div className="cf-admin-name">CartFlow Admin</div>
          <div className="cf-admin-role">Workspace administrator</div>
        </div>
      </div>
    </aside>
  );
}
