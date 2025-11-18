import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './app/page.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminDashboardPage from './app/admin/dashboard/page.jsx';
import AdminCoursePage from './app/admin/course/page.jsx';
import AdminSubjectsPage from './app/admin/subjects/page.jsx';
import AdminStudentsPage from './app/admin/students/page.jsx';
import AdminResultsPage from './app/admin/results/page.jsx';
import AdminSettingsPage from './app/admin/settings/page.jsx';
import AdminLoginPage from './app/admin/login/page.jsx';
import AdminLogoutPage from './app/admin/logout/page.jsx';
import AdminTopicPage from './app/admin/topic/[subjectId]/page.jsx';
import AdminTopicsPage from './app/admin/topics/[topicId]/page.jsx';
import CourseDetailPage from './app/courses/[courseId]/page.jsx';
import CartPage from './app/cart/page.jsx';
import CheckoutPage from './app/checkout/page.jsx';
import CoursesPage from './app/courses/page.jsx';
import AboutPage from './app/about/page.jsx';
import ContactPage from './app/contact/page.jsx';
import PublicLoginPage from './app/login/page.jsx';
import SignupPage from './app/signup/page.jsx';
import RefundPolicyPage from './app/refund-policy/page.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/course" element={<AdminCoursePage />} />
        <Route path="/admin/subjects" element={<AdminSubjectsPage />} />
        <Route path="/admin/students" element={<AdminStudentsPage />} />
        <Route path="/admin/results" element={<AdminResultsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/topic/:subjectId" element={<AdminTopicPage />} />
        <Route path="/admin/topics/:topicId" element={<AdminTopicsPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/logout" element={<AdminLogoutPage />} />

      <Route path="/courses/:courseId" element={<CourseDetailPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<PublicLoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/refund-policy" element={<RefundPolicyPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


