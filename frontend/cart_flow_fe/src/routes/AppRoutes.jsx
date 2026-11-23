import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ShowcasePage from '../pages/Showcase/ShowcasePage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Component Library Workshop (Pure Atomic Primitives) */}
      <Route path="/" element={<ShowcasePage />} />
      <Route path="/components" element={<ShowcasePage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
