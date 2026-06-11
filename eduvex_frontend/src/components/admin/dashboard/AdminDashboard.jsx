import { useState } from "react";
import { NavIcon } from "../AdminSidebar";
import "./AdminDashboard.css";

// ─── Chart data ────────────────────────────────────────────────────────────
const chartData = {
  revenue: {
    daily:   { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],       values: [12400,18200,14800,22100,19300,26500,21000] },
    monthly: { labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], values: [280000,310000,295000,340000,420000,390000,450000,410000,480000,460000,520000,610000] },
    yearly:  { labels: ["2020","2021","2022","2023","2024","2025"],        values: [1200000,1850000,2400000,3100000,4200000,5800000] },
  },
  students: {
    daily:   { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],       values: [42,67,53,89,74,95,81] },
    monthly: { labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], values: [820,940,880,1100,1340,1210,1480,1390,1620,1580,1750,2040] },
    yearly:  { labels: ["2020","2021","2022","2023","2024","2025"],        values: [4200,7800,11200,15600,21400,28900] },
  },
};

// ─── SVG Line Chart ────────────────────────────────────────────────────────
function LineChart({ data, color, gradientId }) {
  const W = 560, H = 160, PAD = { top: 16, right: 16, bottom: 32, left: 48 };
  const vals = data.values;
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min || 1;
  const xStep = (W - PAD.left - PAD.right) / (vals.length - 1);
  const yScale = (v) => PAD.top + ((max - v) / range) * (H - PAD.top - PAD.bottom);
  const points = vals.map((v, i) => [PAD.left + i * xStep, yScale(v)]);
  const polyline = points.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `M${points[0][0]},${points[0][1]} ` +
    points.slice(1).map(([x, y]) => `L${x},${y}`).join(" ") +
    ` L${points[points.length - 1][0]},${H - PAD.bottom} L${points[0][0]},${H - PAD.bottom} Z`;

  const fmt = (v) => v >= 1000000 ? `₹${(v/100000).toFixed(0)}L` : v >= 1000 ? `${(v/1000).toFixed(0)}k` : v;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="adm-chart-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = PAD.top + t * (H - PAD.top - PAD.bottom);
        const val = max - t * range;
        return (
          <g key={i}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.3)">{fmt(val)}</text>
          </g>
        );
      })}
      <path d={area} fill={`url(#${gradientId})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={color} stroke="rgba(13,15,20,0.8)" strokeWidth="1.5" />
      ))}
      {data.labels.map((label, i) => (
        <text key={i} x={points[i][0]} y={H - 4} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">
          {label}
        </text>
      ))}
    </svg>
  );
}

// ─── Chart card ───────────────────────────────────────────────────────────
function ChartCard({ title, type, color, gradientId, formatValue, onDownload }) {
  const [period, setPeriod] = useState("monthly");
  const data = chartData[type][period];
  const current = data.values[data.values.length - 1];

  return (
    <section className="adm-card adm-chart-card">
      <div className="adm-chart-header">
        <div>
          <h2 className="adm-card-title">{title}</h2>
          <p className="adm-chart-current" style={{ color }}>{formatValue(current)}</p>
        </div>
        <div className="adm-chart-controls">
          {["daily","monthly","yearly"].map(p => (
            <button key={p} className={`adm-period-btn ${period === p ? "adm-period-btn--active" : ""}`}
              style={period === p ? { background: `rgba(${color === "#3b82f6" ? "59,130,246" : "34,197,94"},0.15)`, color } : {}}
              onClick={() => setPeriod(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
          <button className="adm-download-btn" onClick={onDownload} title="Download Report">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Report
          </button>
        </div>
      </div>
      <div className="adm-chart-wrap">
        <LineChart data={data} color={color} gradientId={gradientId} />
      </div>
    </section>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────
const stats = [
  { label: "Total Users",        value: "12,483", icon: "users",   color: "blue",  sub: "+8.2% vs last month" },
  { label: "Active Courses",     value: "1,094",  icon: "courses", color: "green", sub: "+14.5% vs last month" },
  { label: "Tutor Applications", value: "38",     icon: "tutors",  color: "amber", sub: "pending review" },
  { label: "Monthly Revenue",    value: "₹4.2L",  icon: "revenue", color: "red",   sub: "vs last month" },
];

const recentApps = [
  { name: "Priya Menon",   subject: "Mathematics", date: "2h ago",  status: "pending" },
  { name: "Rahul Das",     subject: "Physics",      date: "5h ago",  status: "pending" },
  { name: "Anjali Nair",   subject: "English",      date: "1d ago",  status: "approved" },
  { name: "Kiran Patel",   subject: "Data Science", date: "1d ago",  status: "rejected" },
  { name: "Deepak Sharma", subject: "Chemistry",    date: "2d ago",  status: "approved" },
];

const alerts = [
  { type: "warning", msg: "3 courses flagged for review" },
  { type: "info",    msg: "Server maintenance on May 10" },
  { type: "success", msg: "Payout batch processed successfully" },
];

const topCourses = [
  { title: "Full Stack Web Dev",        students: 4210, rating: 4.9 },
  { title: "UI/UX Design Fundamentals", students: 3180, rating: 4.8 },
  { title: "Data Science Bootcamp",     students: 2940, rating: 4.7 },
  { title: "React Advanced Patterns",   students: 1870, rating: 4.8 },
];

// ─── Download helper ──────────────────────────────────────────────────────
function downloadCSV(type, period) {
  const { labels, values } = chartData[type][period];
  const header = period === "daily" ? "Day" : period === "monthly" ? "Month" : "Year";
  const valHeader = type === "revenue" ? "Revenue (₹)" : "Students Enrolled";
  const rows = labels.map((l, i) => `${l},${values[i]}`);
  const csv = [`${header},${valHeader}`, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `eduvex_${type}_${period}_report.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Dashboard content only — layout shell lives in AdminLayout ──────────
const AdminDashboard = () => {
  return (
    <>
      {/* Alerts */}
      <div className="adm-alerts">
        {alerts.map((a, i) => (
          <div key={i} className={`adm-alert adm-alert--${a.type}`}>
            <NavIcon name={a.type === "warning" ? "warning" : a.type === "success" ? "check" : "bell"} size={14} />
            <span>{a.msg}</span>
          </div>
        ))}
      </div>

      {/* Stat cards */}
      <section className="adm-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className={`adm-stat-card adm-stat-card--${s.color}`}>
            <div className="adm-stat-header">
              <div className={`adm-stat-icon-wrap adm-stat-icon-wrap--${s.color}`}>
                <NavIcon name={s.icon} size={18} />
              </div>
            </div>
            <p className="adm-stat-value">{s.value}</p>
            <p className="adm-stat-label">{s.label}</p>
            <p className="adm-stat-sub">{s.sub}</p>
          </div>
        ))}
      </section>

      {/* Charts row */}
      <div className="adm-charts-row">
        <ChartCard
          title="Revenue"
          type="revenue"
          color="#3b82f6"
          gradientId="revGrad"
          formatValue={(v) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${v.toLocaleString()}`}
          onDownload={() => downloadCSV("revenue", "monthly")}
        />
        <ChartCard
          title="Enrolled Students"
          type="students"
          color="#22c55e"
          gradientId="stuGrad"
          formatValue={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v.toString()}
          onDownload={() => downloadCSV("students", "monthly")}
        />
      </div>

      {/* Lower grid */}
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
                <tr><th>Name</th><th>Subject</th><th>Applied</th><th>Status</th><th>Action</th></tr>
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
                    <td><span className={`adm-pill adm-pill--${app.status}`}>{app.status}</span></td>
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

        {/* Right col */}
        <div className="adm-right-col">
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
                  <div className="adm-course-rating">⭐ {c.rating}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="adm-card">
            <div className="adm-card-header"><h2 className="adm-card-title">Quick Actions</h2></div>
            <div className="adm-quick-actions">
              {[
                { label: "Add Course",   icon: "courses",  color: "blue" },
                { label: "Manage Users", icon: "users",    color: "green" },
                { label: "View Reports", icon: "reports",  color: "amber" },
                { label: "Settings",     icon: "settings", color: "slate" },
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
    </>
  );
};

export default AdminDashboard;