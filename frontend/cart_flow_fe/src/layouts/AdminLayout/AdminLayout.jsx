import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';
import './AdminLayout.css';

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="cf-admin-app-root">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="cf-admin-main-viewport">
        <AdminTopNav activePage={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />
        <main className="cf-admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
