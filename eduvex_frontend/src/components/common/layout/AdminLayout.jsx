import { useEffect, useState } from "react";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar, { NavIcon } from "../../admin/AdminSidebar";
import "../../admin/dashboard/AdminDashboard.css";
import { fetchTutorApplications } from "../../../redux/features/tutorApplicationSlice";

const pageTitles = {
  "/admin/dashboard": { title: "Dashboard", sub: "Welcome back, Super Admin 👋" },
  "/admin/tutors": { title: "Tutor Applications", sub: "Review incoming applications" },
  "/admin/tutorList": { title: "Tutors List", sub: "All approved tutors" },
  "/admin/users": { title: "Users", sub: "All registered learners" },
  "/admin/courses": { title: "Courses", sub: "Manage platform courses" },
  "/admin/revenue": { title: "Revenue", sub: "Financial overview" },
  "/admin/reports": { title: "Reports", sub: "Platform analytics" },
  "/admin/settings": { title: "Settings", sub: "Admin configuration" },
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  
  useEffect(() => {
    dispatch(fetchTutorApplications());
  }, [dispatch]);

  const { title, sub } = pageTitles[location.pathname] ?? { title: "Admin", sub: "" };

  return (
    <div className="adm-root">
      {mobileOpen && (
        <div className="adm-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <AdminSidebar
        collapsed={collapsed} setCollapsed={setCollapsed}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
      />

      <div className="adm-main">
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button
              className="adm-mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
            >
              <NavIcon name="menu" size={20} />
            </button>
            <div>
              <h1 className="adm-page-title">{title}</h1>
              {sub && <p className="adm-page-sub">{sub}</p>}
            </div>
          </div>
          <div className="adm-topbar-right">
            <button className="adm-icon-btn">
              <NavIcon name="bell" size={18} />
              <span className="adm-notif-dot" />
            </button>
            <div className="adm-avatar adm-avatar--lg">A</div>
          </div>
        </header>

        <main className="adm-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;