import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import './Storefront.css';

export default function StorefrontLayout() {
  return (
    <div className="cf-storefront-wrapper">
      <Navbar />
      <main className="cf-storefront-main">
        <Outlet />
      </main>
      <Footer />
      {/* Global Right-Side Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
