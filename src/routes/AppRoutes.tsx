// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { StudentLayout } from '../layouts/StudentLayout';
import { AdminLayout } from '../layouts/AdminLayout';

import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { StudentDashboard } from '../pages/StudentDashboard';
import { ScholarshipApplication } from '../pages/ScholarshipApplication';
import { AIExplainability } from '../pages/AIExplainability';
import { ScholarshipResult } from '../pages/ScholarshipResult';
import { Documents } from '../pages/Documents';
import { Settings } from '../pages/Settings';

import { AdminDashboard } from '../pages/AdminDashboard';
import { BudgetSimulator } from '../pages/BudgetSimulator';
import { FairnessDashboard } from '../pages/FairnessDashboard';
import { NotFound } from '../pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Public Routes with MainLayout (Navbar + Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Student Portal Layout Routes (Navbar + Sidebar + Footer) */}
      <Route element={<StudentLayout />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/apply" element={<ScholarshipApplication />} />
        <Route path="/student/documents" element={<Documents />} />
        <Route path="/student/result/:id" element={<ScholarshipResult />} />
        <Route path="/student/explainability/:id" element={<AIExplainability />} />
        <Route path="/student/settings" element={<Settings />} />
      </Route>

      {/* Admin Governance Board Layout Routes (Navbar + Sidebar + Footer) */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/budget-simulator" element={<BudgetSimulator />} />
        <Route path="/admin/fairness-dashboard" element={<FairnessDashboard />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};
