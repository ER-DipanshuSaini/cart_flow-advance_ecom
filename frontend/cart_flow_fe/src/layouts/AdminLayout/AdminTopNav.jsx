import React from 'react';
import { Sun, LogOut, ChevronRight, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AdminTopNav.css';

export default function AdminTopNav({ activePage = 'Overview' }) {
  return (
    <header className="cf-admin-topnav">
      {/* Breadcrumbs */}
      <div className="cf-admin-breadcrumbs">
        <span className="cf-crumb-parent">Workspace</span>
        <ChevronRight size={14} className="cf-crumb-separator" />
        <span className="cf-crumb-current">{activePage}</span>
      </div>

      {/* Right Action Icons */}
      <div className="cf-admin-top-actions">
        <Link to="/" className="cf-storefront-switch-btn" title="View Customer Storefront">
          <Store size={15} />
          <span>Storefront</span>
        </Link>

        <button className="cf-top-icon-btn" title="Toggle Theme">
          <Sun size={18} />
        </button>

        <div className="cf-top-avatar" title="Admin Profile">
          <span>B</span>
        </div>

        <Link to="/" className="cf-top-icon-btn cf-exit-btn" title="Exit Console / Logout">
          <LogOut size={18} />
        </Link>
      </div>
    </header>
  );
}
