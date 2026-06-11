import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./TurorApplications.css"
import {
  fetchTutorApplications,
  approveTutorApplication,
  rejectTutorApplication,
} from "../../../redux/features/tutorApplicationSlice";

// ── Skeleton row ──────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} style={{ padding: "14px 16px" }}>
        <div style={{
          height: 13, borderRadius: 6,
          width: i === 1 ? 160 : i === 6 ? 70 : 90,
          background: "rgba(255,255,255,0.06)",
          animation: "adm-shimmer 1.4s ease infinite",
        }} />
      </td>
    ))}
  </tr>
);

// ── Detail popup ──────────────────────────────────────────────────────────
const DetailPopup = ({ app, onClose, onApprove, onReject, actionLoading }) => {
  console.log(app, 'app')
  if (!app) return null;
  const isActing = actionLoading === app._id;

  const displayDate = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit", month: "long", year: "numeric",
      })
    : "—";

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="tap-overlay" onClick={onClose}>
      <div className="tap-popup" onClick={e => e.stopPropagation()}>

        <button className="tap-close" onClick={onClose} aria-label="Close">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Avatar + name */}
        <div className="tap-header">
          <div className="tap-avatar-lg">
            {app.avatar
              ? <img src={app.avatar} alt={app.name} />
              : <span>{app.name?.[0] ?? "?"}</span>
            }
          </div>
          <div className="tap-identity">
            <h2 className="tap-name">{app.name}</h2>
            <p className="tap-email">{app.email}</p>
            <span className={`adm-pill adm-pill--${app.status}`} style={{ marginTop: 8, display: "inline-block" }}>
              {app.status}
            </span>
          </div>
        </div>

        {/* Info grid */}
        <div className="tap-grid">
          <div className="tap-field">
            <span className="tap-label">Category</span>
            <span className="tap-value">{app.categories?.join(", ") || "—"}</span>
          </div>
          <div className="tap-field">
            <span className="tap-label">Experience Level</span>
            <span className="tap-value" style={{ textTransform: "capitalize" }}>{app.experience || "—"}</span>
          </div>
          <div className="tap-field">
            <span className="tap-label">Applied On</span>
            <span className="tap-value">{displayDate}</span>
          </div>
          <div className="tap-field">
            <span className="tap-label">LinkedIn</span>
            <span className="tap-value">
              {app.linkedin
                ? <a href={`https://linkedin.com/in/${app.linkedin}`} target="_blank" rel="noreferrer" style={{ color: "var(--blue)" }}>{app.linkedin}</a>
                : "—"}
            </span>
          </div>
          {app.portfolio && (
            <div className="tap-field tap-field--full">
              <span className="tap-label">Portfolio</span>
              <span className="tap-value">
                <a href={app.portfolio} target="_blank" rel="noreferrer" style={{ color: "var(--blue)", wordBreak: "break-all" }}>
                  {app.portfolio}
                </a>
              </span>
            </div>
          )}
          <div className="tap-field tap-field--full">
            <span className="tap-label">Bio</span>
            <p className="tap-bio">{app.bio || "—"}</p>
          </div>
        </div>

        {/* Actions — only for pending */}
        {app.status === "pending" && (
          <div className="tap-actions">
            <button
              className="tap-btn tap-btn--reject"
              disabled={isActing}
              onClick={() => { onReject(app._id); onClose(); }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              {isActing ? "Processing…" : "Reject"}
            </button>
            <button
              className="tap-btn tap-btn--approve"
              disabled={isActing}
              onClick={() => { onApprove(app._id); onClose(); }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {isActing ? "Processing…" : "Approve"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────
const PER_PAGE = 8;

const TutorApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading, actionLoading, error } = useSelector(
    (state) => state.tutorApplications
  );

  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");
  const [page,     setPage]     = useState(1);
  const [selected, setSelected] = useState(null);


  // ── Derived ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return applications.filter(a => {
      const matchFilter = filter === "all" || a.status === filter;
      const q = search.toLowerCase();
      const matchSearch =
        a.name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.categories?.some(c => c.toLowerCase().includes(q));
      return matchFilter && matchSearch;
    });
  }, [applications, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = useMemo(() => ({
    all:      applications.length,
    pending:  applications.filter(a => a.status === "pending").length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  }), [applications]);

  const handleFilter = f => { setFilter(f); setPage(1); };
  const handleSearch = v => { setSearch(v); setPage(1); };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        
      `}</style>

      <div className="adm-section">

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
              Tutor Applications
            </h1>
            <p style={{ color: "var(--text-3)", fontSize: 13 }}>
              Review and manage incoming tutor applications
            </p>
          </div>
          {error && (
            <button
              style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 13px", borderRadius:8, border:"1px solid var(--border)", background:"var(--bg-3)", color:"var(--text-2)", fontFamily:"var(--font)", fontSize:12, fontWeight:600, cursor:"pointer" }}
              onClick={() => dispatch(fetchTutorApplications())}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
              Retry
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="adm-alert adm-alert--warning">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>{error}</span>
          </div>
        )}

        {/* Toolbar */}
        <div className="tap-toolbar">
          <div className="tap-pills">
            {["all","pending","approved","rejected"].map(f => (
              <button
                key={f}
                className={`tap-pill tap-pill--${f} ${filter === f ? "tap-pill--on" : ""}`}
                onClick={() => handleFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="tap-count">{counts[f]}</span>
              </button>
            ))}
          </div>
          <div className="tap-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Search name, category, email…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Desktop table ── */}
        <div className="adm-card tap-table-wrap" style={{ padding: 0, overflow: "hidden" }}>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Applicant</th>
                  <th>Category</th>
                  <th>Experience</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

                {!loading && paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign:"center", padding:52, color:"var(--text-3)" }}>
                      <div style={{ fontSize:30, marginBottom:10 }}>📭</div>
                      <div style={{ fontWeight:600 }}>No applications found</div>
                      {search && <div style={{ fontSize:12, marginTop:4 }}>Try clearing your search</div>}
                    </td>
                  </tr>
                )}

                {!loading && paginated.map((app, idx) => {
                  const displayDate = app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
                    : "—";
                  return (
                    <tr key={app._id}>
                      <td className="adm-muted" style={{ fontFamily:"var(--mono)", fontSize:12 }}>
                        {(page - 1) * PER_PAGE + idx + 1}
                      </td>
                      <td>
                        <div className="adm-tutor-cell">
                          <div className="adm-avatar adm-avatar--sm" style={{ overflow:"hidden", flexShrink:0 }}>
                            {app.avatar
                              ? <img src={app.avatar} alt={app.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                              : app.name?.[0] ?? "?"
                            }
                          </div>
                          <div>
                            <div style={{ fontWeight:600, color:"var(--text)" }}>{app.name}</div>
                            <div style={{ fontSize:11, color:"var(--text-3)" }}>{app.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color:"var(--text)" }}>{app.categories?.join(", ") || "—"}</td>
                      <td className="adm-muted" style={{ textTransform:"capitalize" }}>{app.experience || "—"}</td>
                      <td className="adm-muted">{displayDate}</td>
                      <td><span className={`adm-pill adm-pill--${app.status}`}>{app.status}</span></td>
                      <td>
                        <button className="tap-details-btn" onClick={() => setSelected(app)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} total={filtered.length} perPage={PER_PAGE} onPage={setPage} />
        </div>

        {/* ── Mobile cards ── */}
        <div className="tap-cards">
          {loading && (
            <div style={{ textAlign:"center", padding:32, color:"var(--text-3)" }}>Loading…</div>
          )}
          {!loading && paginated.length === 0 && (
            <div style={{ textAlign:"center", padding:40, color:"var(--text-3)" }}>
              <div style={{ fontSize:28, marginBottom:8 }}>📭</div>
              No applications found
            </div>
          )}
          {!loading && paginated.map(app => {
            const displayDate = app.createdAt
              ? new Date(app.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
              : "—";
            return (
              <div key={app._id} className="tap-card">
                <div className="tap-card-top">
                  <div className="adm-avatar" style={{ overflow:"hidden", flexShrink:0 }}>
                    {app.avatar
                      ? <img src={app.avatar} alt={app.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      : app.name?.[0] ?? "?"
                    }
                  </div>
                  <div className="tap-card-info">
                    <div className="tap-card-name">{app.name}</div>
                    <div className="tap-card-email">{app.email}</div>
                  </div>
                  <span className={`adm-pill adm-pill--${app.status}`}>{app.status}</span>
                </div>
                <div className="tap-card-meta">
                  <span className="tap-card-tag">📚 {app.categories?.join(", ") || "—"}</span>
                  <span className="tap-card-tag" style={{ textTransform:"capitalize" }}>🎓 {app.experience || "—"}</span>
                  <span className="tap-card-tag">🗓 {displayDate}</span>
                </div>
                <button
                  className="tap-details-btn"
                  style={{ width:"100%", justifyContent:"center", padding:"9px" }}
                  onClick={() => setSelected(app)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  View Details
                </button>
              </div>
            );
          })}
          {!loading && filtered.length > 0 && (
            <Pagination page={page} totalPages={totalPages} total={filtered.length} perPage={PER_PAGE} onPage={setPage} />
          )}
        </div>

      </div>

      {/* Detail popup */}
      {selected && (
        <DetailPopup
          app={selected}
          onClose={() => setSelected(null)}
          onApprove={id => dispatch(approveTutorApplication(id))}
          onReject={id  => dispatch(rejectTutorApplication(id))}
          actionLoading={actionLoading}
        />
      )}
    </>
  );
};

// ── Pagination ────────────────────────────────────────────────────────────
export function Pagination({ page, totalPages, total, perPage, onPage }) {
  const from = total === 0 ? 0 : Math.min((page - 1) * perPage + 1, total);
  const to   = Math.min(page * perPage, total);

  return (
    <div className="adm-pagination">
      <span className="adm-pagination-info">Showing {from}–{to} of {total}</span>
      <div className="adm-pagination-btns">
        <button className="adm-page-btn" disabled={page === 1} onClick={() => onPage(1)}>«</button>
        <button className="adm-page-btn" disabled={page === 1} onClick={() => onPage(p => p - 1)}>‹</button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let p;
          if (totalPages <= 5)             p = i + 1;
          else if (page <= 3)              p = i + 1;
          else if (page >= totalPages - 2) p = totalPages - 4 + i;
          else                             p = page - 2 + i;
          return (
            <button key={p} className={`adm-page-btn ${page === p ? "adm-page-btn--active" : ""}`} onClick={() => onPage(p)}>
              {p}
            </button>
          );
        })}
        <button className="adm-page-btn" disabled={page === totalPages} onClick={() => onPage(p => p + 1)}>›</button>
        <button className="adm-page-btn" disabled={page === totalPages} onClick={() => onPage(totalPages)}>»</button>
      </div>
    </div>
  );
}

export default TutorApplications;