import { useState } from "react";
import "./AdminDashboard.css";
import { logoutAdmin } from "../../../redux/features/adminAuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons = {
  home:        "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  tutors:      ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75", "M9 7m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0"],
  courses:     ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3-3h7z"],
  users:       ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8"],
  revenue:     ["M12 1v22", "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"],
  reports:     ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"],
  settings:    ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  logout:      ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  bell:        ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  menu:        "M3 12h18 M3 6h18 M3 18h18",
  close:       "M18 6L6 18 M6 6l12 12",
  trend_up:    "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  trend_down:  "M23 18l-9.5-9.5-5 5L1 6 M17 18h6v-6",
  check:       "M20 6L9 17l-5-5",
  clock:       ["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z", "M12 6v6l4 2"],
  star:        "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  warning:     ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"],
  grid:        ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
};

const NavIcon = ({ name, size }) => <Icon d={icons[name]} size={size} />;

// ── Sidebar nav items ──────────────────────────────────────────────────────
const navItems = [
  { id: "home",     label: "Dashboard",          icon: "home" },
  { id: "tutors",   label: "Tutor Applications", icon: "tutors",  badge: 8 },
  { id: "users",    label: "Users",              icon: "users" },
  { id: "courses",  label: "Courses",            icon: "courses" },
  { id: "revenue",  label: "Revenue",            icon: "revenue" },
  { id: "reports",  label: "Reports",            icon: "reports" },
  { id: "settings", label: "Settings",           icon: "settings" },
];

// ── Stat cards data ────────────────────────────────────────────────────────
const stats = [
  { label: "Total Users",        value: "12,483", delta: "+8.2%",  up: true,  icon: "users",   color: "blue",   sub: "vs last month" },
  { label: "Active Courses",     value: "1,094",  delta: "+14.5%", up: true,  icon: "courses", color: "green",  sub: "vs last month" },
  { label: "Tutor Applications", value: "38",     delta: "+3",     up: true,  icon: "tutors",  color: "amber",  sub: "pending review" },
  { label: "Monthly Revenue",    value: "₹4.2L",  delta: "-2.1%",  up: false, icon: "revenue", color: "red",    sub: "vs last month" },
];

// ── Recent tutor applications ──────────────────────────────────────────────
const recentApps = [
  { name: "Priya Menon",    subject: "Mathematics",    date: "2h ago",  status: "pending" },
  { name: "Rahul Das",      subject: "Physics",        date: "5h ago",  status: "pending" },
  { name: "Anjali Nair",    subject: "English",        date: "1d ago",  status: "approved" },
  { name: "Kiran Patel",    subject: "Data Science",   date: "1d ago",  status: "rejected" },
  { name: "Deepak Sharma",  subject: "Chemistry",      date: "2d ago",  status: "approved" },
];

// ── Active alerts ──────────────────────────────────────────────────────────
const alerts = [
  { type: "warning", msg: "3 courses flagged for review" },
  { type: "info",    msg: "Server maintenance on May 10" },
  { type: "success", msg: "Payout batch processed successfully" },
];

// ── Top courses ────────────────────────────────────────────────────────────
const topCourses = [
  { title: "Full Stack Web Dev",  students: 4210, rating: 4.9 },
  { title: "UI/UX Design Fundamentals", students: 3180, rating: 4.8 },
  { title: "Data Science Bootcamp",     students: 2940, rating: 4.7 },
  { title: "React Advanced Patterns",   students: 1870, rating: 4.8 },
];

// ── Component ──────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [active, setActive]         = useState("home");
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogout = async () => {
    console.log('Logout 11111111111')
      await dispatch(logoutAdmin());
  
      if (logoutAdmin.fulfilled.match) {
        console.log('Logout 44444444444444')
        navigate("/admin/login")
      }
    }

  return (
    <div className="adm-root">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="adm-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ── */}
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

        {/* Collapse toggle (desktop) */}
        <button className="adm-collapse-btn" onClick={() => setCollapsed(v => !v)}
          aria-label="Toggle sidebar">
          <NavIcon name={collapsed ? "menu" : "close"} size={16} />
        </button>

        {/* Nav */}
        <nav className="adm-nav">
          {!collapsed && <p className="adm-nav-section-label">MAIN MENU</p>}
          {navItems.map(item => (
            <button
              key={item.id}
              className={`adm-nav-item ${active === item.id ? "adm-nav-item--active" : ""}`}
              onClick={() => { setActive(item.id); setMobileOpen(false); }}
              title={collapsed ? item.label : ""}
            >
              <span className="adm-nav-icon"><NavIcon name={item.icon} size={18} /></span>
              {!collapsed && <span className="adm-nav-label">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="adm-badge">{item.badge}</span>
              )}
              {collapsed && item.badge && (
                <span className="adm-badge adm-badge--dot" />
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
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
          <button className="adm-logout-btn" title="Logout"
          onClick={handleLogout}
          >
            <NavIcon name="logout" size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="adm-main">
        {/* Topbar */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button className="adm-mobile-menu-btn" onClick={() => setMobileOpen(true)}>
              <NavIcon name="menu" size={20} />
            </button>
            <div>
              <h1 className="adm-page-title">Dashboard</h1>
              <p className="adm-page-sub">Welcome back, Super Admin 👋</p>
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

        {/* Content */}
        <main className="adm-content">

          {/* ── Alerts ── */}
          <div className="adm-alerts">
            {alerts.map((a, i) => (
              <div key={i} className={`adm-alert adm-alert--${a.type}`}>
                <NavIcon name={a.type === "warning" ? "warning" : a.type === "success" ? "check" : "bell"} size={14} />
                <span>{a.msg}</span>
              </div>
            ))}
          </div>

          {/* ── Stat cards ── */}
          <section className="adm-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className={`adm-stat-card adm-stat-card--${s.color}`}>
                <div className="adm-stat-header">
                  <div className={`adm-stat-icon-wrap adm-stat-icon-wrap--${s.color}`}>
                    <NavIcon name={s.icon} size={18} />
                  </div>
                  <span className={`adm-stat-delta ${s.up ? "adm-stat-delta--up" : "adm-stat-delta--down"}`}>
                    <NavIcon name={s.up ? "trend_up" : "trend_down"} size={13} />
                    {s.delta}
                  </span>
                </div>
                <p className="adm-stat-value">{s.value}</p>
                <p className="adm-stat-label">{s.label}</p>
                <p className="adm-stat-sub">{s.sub}</p>
              </div>
            ))}
          </section>

          {/* ── Lower grid ── */}
          <div className="adm-lower-grid">

            {/* Tutor applications */}
            <section className="adm-card adm-card--applications">
              <div className="adm-card-header">
                <h2 className="adm-card-title">Tutor Applications</h2>
                <button className="adm-view-all">View all →</button>
              </div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Subject</th>
                      <th>Applied</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApps.map((app, i) => (
                      <tr key={i}>
                        <td>
                          <div className="adm-tutor-cell">
                            <div className="adm-avatar adm-avatar--sm">{app.name[0]}</div>
                            {app.name}
                          </div>
                        </td>
                        <td>{app.subject}</td>
                        <td className="adm-muted">{app.date}</td>
                        <td>
                          <span className={`adm-pill adm-pill--${app.status}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          {app.status === "pending" && (
                            <div className="adm-action-btns">
                              <button className="adm-btn-approve">✓</button>
                              <button className="adm-btn-reject">✕</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Right column */}
            <div className="adm-right-col">

              {/* Top courses */}
              <section className="adm-card">
                <div className="adm-card-header">
                  <h2 className="adm-card-title">Top Courses</h2>
                  <NavIcon name="star" size={15} />
                </div>
                <div className="adm-course-list">
                  {topCourses.map((c, i) => (
                    <div key={i} className="adm-course-item">
                      <div className="adm-course-rank">#{i + 1}</div>
                      <div className="adm-course-info">
                        <p className="adm-course-title">{c.title}</p>
                        <p className="adm-course-meta">{c.students.toLocaleString()} students</p>
                      </div>
                      <div className="adm-course-rating">
                        ⭐ {c.rating}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick actions */}
              <section className="adm-card">
                <div className="adm-card-header">
                  <h2 className="adm-card-title">Quick Actions</h2>
                </div>
                <div className="adm-quick-actions">
                  {[
                    { label: "Add Course",     icon: "courses", color: "blue"  },
                    { label: "Manage Users",   icon: "users",   color: "green" },
                    { label: "View Reports",   icon: "reports", color: "amber" },
                    { label: "Settings",       icon: "settings",color: "slate" },
                  ].map((qa, i) => (
                    <button key={i} className={`adm-qa-btn adm-qa-btn--${qa.color}`}>
                      <NavIcon name={qa.icon} size={16} />
                      <span>{qa.label}</span>
                    </button>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard

  