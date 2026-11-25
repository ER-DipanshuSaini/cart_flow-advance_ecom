import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StorefrontLayout from '../layouts/StorefrontLayout';
import HomePage from '../pages/store/HomePage';
import ShopPage from '../pages/store/ShopPage';
import CatalogPage from '../pages/store/CatalogPage';
import ProductDetailPage from '../pages/store/ProductDetailPage';
import CartPage from '../pages/store/CartPage';
import CheckoutPage from '../pages/store/CheckoutPage';
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import AdminLoginPage from '../pages/auth/AdminLoginPage';
import ShowcasePage from '../pages/Showcase/ShowcasePage';

// Admin Operations Console
import AdminLayout from '../pages/admin/AdminLayout';
import AdminOverviewPage from '../pages/admin/AdminOverviewPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminInventoryPage from '../pages/admin/AdminInventoryPage';
import AdminLogisticsPage from '../pages/admin/AdminLogisticsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Customer Storefront Layout (Public Experience) */}
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<CustomerDashboard />} />
        {/* UI Kit & Component Workshop */}
        <Route path="/components" element={<ShowcasePage />} />
      </Route>

      {/* Standalone Full-Page Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* 2. Hidden Admin Gate (Direct non-public path with credentials prompt) */}
      <Route path="/admin-portal" element={<AdminLoginPage />} />

      {/* 3. Dedicated Admin & Operations Console (BattleOne Workspace) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<AdminOverviewPage />} />
        <Route path="console" element={<Navigate to="/admin/overview" replace />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
        <Route path="logistics" element={<AdminLogisticsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
