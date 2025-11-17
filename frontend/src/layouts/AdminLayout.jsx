import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin/login';

  return (
    <div className="admin-layout">
      {!isLoginPage && <AdminSidebar />}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}


