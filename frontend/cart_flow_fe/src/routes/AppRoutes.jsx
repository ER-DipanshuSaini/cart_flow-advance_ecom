import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ShowcasePage from '../pages/Showcase/ShowcasePage';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/customer/Home/HomePage';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import OverviewPage from '../pages/admin/Overview/OverviewPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Component Library Workshop (Pure Atomic Primitives) */}
      <Route path="/" element={<ShowcasePage />} />
      <Route path="/components" element={<ShowcasePage />} />

      {/* 2. Admin Try-On Console (Reference UI) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="overview" element={<OverviewPage />} />
      </Route>

      {/* 3. Customer Storefront */}
      <Route path="/store" element={<MainLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
