import React, { useState } from 'react'
import AdminSidebar from '../../admin/AdminSidebar';
import { Outlet } from 'react-router-dom';
import '../../admin/dashboard/AdminDashboard.css';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="adm-root">
      {mobileOpen && (
        <div className="adm-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="adm-main">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout