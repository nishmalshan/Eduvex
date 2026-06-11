import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../redux/features/adminAuthSlice";
import "./dashboard/AdminDashboard.css";

// ── Icons ────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

export const icons = {
  home:     "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  tutors:   ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M23 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75","M9 7m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0"],
  tutorList:["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M9 7m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0","M22 11l-4 4-2-2"],
  courses:  ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3-3h7z"],
  users:    ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2","M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8"],
  revenue:  ["M12 1v22","M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"],
  reports:  ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  settings: ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  logout:   ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4","M16 17l5-5-5-5","M21 12H9"],
  menu:     "M3 12h18 M3 6h18 M3 18h18",
  close:    "M18 6L6 18 M6 6l12 12",
};

export const NavIcon = ({ name, size }) => <Icon d={icons[name]} size={size} />;

const mainNav = [
  { id: "dashboard",      label: "Dashboard",          icon: "home" },
  { id: "tutors",    label: "Tutor Applications", icon: "tutors", badge: null },
  { id: "tutorList", label: "Tutors List",        icon: "tutorList" },
  { id: "users",     label: "Users",              icon: "users" },
  { id: "courses",   label: "Courses",            icon: "courses" },
];

const secondaryNav = [
  { id: "revenue",  label: "Revenue",  icon: "revenue" },
  { id: "reports",  label: "Reports",  icon: "reports" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const AdminSidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {

  const tutors = useSelector((state) => state.tutorApplications.applications);
  const pendingCount = tutors ? tutors.filter(t => t.status === 'pending').length : 0;
  mainNav[1].badge = pendingCount > 0 ? pendingCount : null;

    const dispatch = useDispatch();
    const navigate = useNavigate();

  const handleLogout = async () => {
    console.log('Logout 11111111111')
      const result = await dispatch(logoutAdmin());
  
      if (logoutAdmin.fulfilled.match(result)) {
        console.log('Logout 44444444444444')
        navigate("/admin/login")
      }
    }

  const renderItem = (item) => (

    <NavLink
    key={item.id}
    to={`/admin/${item.id}`}
    className={({ isActive }) => 
    `adm-nav-item ${isActive ? "adm-nav-item--active" : ""}`
    }
    title={collapsed ? item.label : ""}
    onClick={() => setMobileOpen(false)}
    >
    <span className="adm-nav-icon">
      <NavIcon name={item.icon} size={18} />
    </span>

    {!collapsed && <span className="adm-nav-label">{item.label}</span>}

    {!collapsed && item.badge && (
      <span className="adm-badge">{item.badge}</span>
    )}
    </NavLink>
  );

  return (
    <aside className={`adm-sidebar ${collapsed ? "adm-sidebar--collapsed" : ""} ${mobileOpen ? "adm-sidebar--mobile-open" : ""}`}>
      {/* Brand */}
      <div className="adm-brand">
        <div className="adm-brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
          </svg>
        </div>
        {!collapsed && <span className="adm-brand-name">eduvex</span>}
      </div>

      <button className="adm-collapse-btn" onClick={() => setCollapsed(v => !v)} aria-label="Toggle sidebar">
        <NavIcon name={collapsed ? "menu" : "close"} size={16} />
      </button>

      <nav className="adm-nav">
        {!collapsed && <p className="adm-nav-section-label">MAIN MENU</p>}
        {mainNav.map(renderItem)}
        {!collapsed && <p className="adm-nav-section-label" style={{ marginTop: 12 }}>MANAGEMENT</p>}
        {collapsed && <div className="adm-nav-divider" />}
        {secondaryNav.map(renderItem)}
      </nav>

      <div className="adm-sidebar-footer">
        {!collapsed && (
          <div className="adm-admin-chip">
            <div className="adm-avatar">A</div>
            <div className="adm-admin-info">
              <span className="adm-admin-name">Super Admin</span>
              <span className="adm-admin-role">Administrator</span>
            </div>
          </div>
        )}
        <button className="adm-logout-btn" title="Logout" onClick={handleLogout}>
          <NavIcon name="logout" size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;