import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTutorApplications,
  // approveTutorApplication,
  // rejectTutorApplication,
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
            {app.profilePhotoUrl
              ? <img src={app.profilePhotoUrl} alt={app.name} />
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

  useEffect(() => {
    dispatch(fetchTutorApplications());
  }, [dispatch]);

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
        /* Popup overlay */
        .tap-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(5px);
          z-index: 300;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: tap-fadeIn 0.18s ease;
        }
        .tap-popup {
          background: var(--bg-2);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          width: 100%; max-width: 520px;
          max-height: 92vh; overflow-y: auto;
          padding: 28px;
          position: relative;
          animation: tap-slideUp 0.22s cubic-bezier(.16,1,.3,1);
          scrollbar-width: thin;
        }
        .tap-close {
          position: absolute; top: 14px; right: 14px;
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg-3); border: 1px solid var(--border);
          border-radius: 7px; color: var(--text-2); cursor: pointer;
          transition: all 0.15s;
        }
        .tap-close:hover { background: var(--red-dim); color: var(--red); border-color: rgba(239,68,68,0.35); }

        .tap-header {
          display: flex; align-items: center; gap: 16px;
          padding-bottom: 20px; margin-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }
        .tap-avatar-lg {
          width: 68px; height: 68px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg,#3b82f6,#6366f1);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .tap-avatar-lg img { width: 100%; height: 100%; object-fit: cover; }
        .tap-avatar-lg span { font-size: 24px; font-weight: 800; color: #fff; }
        .tap-identity { flex: 1; min-width: 0; }
        .tap-name { font-size: 17px; font-weight: 800; color: var(--text); letter-spacing: -0.3px; }
        .tap-email { font-size: 12.5px; color: var(--text-3); margin-top: 3px; }

        .tap-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 14px; margin-bottom: 20px;
        }
        .tap-field { display: flex; flex-direction: column; gap: 5px; }
        .tap-field--full { grid-column: 1 / -1; }
        .tap-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 1px; color: var(--text-3); text-transform: uppercase;
        }
        .tap-value { font-size: 13.5px; font-weight: 500; color: var(--text); }
        .tap-bio {
          font-size: 13px; color: var(--text-2); line-height: 1.75;
          background: var(--bg-3); border-radius: 8px; padding: 12px 14px;
          margin-top: 2px; border: 1px solid var(--border);
        }

        .tap-actions {
          display: flex; gap: 10px;
          padding-top: 18px; border-top: 1px solid var(--border);
        }
        .tap-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 11px; border-radius: 10px; border: none;
          font-family: var(--font); font-size: 13.5px; font-weight: 700;
          cursor: pointer; transition: opacity 0.15s, transform 0.1s;
        }
        .tap-btn:hover:not(:disabled) { opacity: 0.85; }
        .tap-btn:active:not(:disabled) { transform: scale(0.97); }
        .tap-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .tap-btn--approve { background: var(--green); color: #000; }
        .tap-btn--reject  { background: var(--red-dim); color: var(--red); border: 1px solid rgba(239,68,68,0.3); }

        /* Filter bar */
        .tap-toolbar {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          padding: 12px 16px;
          background: var(--bg-2); border: 1px solid var(--border);
          border-radius: var(--radius);
        }
        .tap-pills { display: flex; gap: 6px; flex-wrap: wrap; }
        .tap-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 13px; border-radius: 20px;
          border: 1px solid var(--border); background: var(--bg-3);
          color: var(--text-2); font-family: var(--font);
          font-size: 12.5px; font-weight: 600; cursor: pointer;
          transition: all 0.15s; white-space: nowrap;
        }
        .tap-pill:hover { border-color: var(--border-hover); color: var(--text); }
        .tap-pill--all.tap-pill--on      { background: rgba(59,130,246,.12); color: var(--blue);  border-color: rgba(59,130,246,.3); }
        .tap-pill--pending.tap-pill--on  { background: var(--amber-dim);     color: var(--amber); border-color: rgba(245,158,11,.35); }
        .tap-pill--approved.tap-pill--on { background: var(--green-dim);     color: var(--green); border-color: rgba(34,197,94,.35); }
        .tap-pill--rejected.tap-pill--on { background: var(--red-dim);       color: var(--red);   border-color: rgba(239,68,68,.35); }
        .tap-count {
          background: rgba(255,255,255,.08); border-radius: 20px;
          padding: 1px 7px; font-size: 10px; font-weight: 700; font-family: var(--mono);
        }

        .tap-search {
          display: flex; align-items: center; gap: 8px;
          background: var(--bg-3); border: 1px solid var(--border);
          border-radius: 8px; padding: 7px 12px;
          flex: 1; min-width: 200px; max-width: 300px;
          transition: border-color 0.15s; margin-left: auto;
        }
        .tap-search:focus-within { border-color: var(--blue); }
        .tap-search svg { color: var(--text-3); flex-shrink: 0; }
        .tap-search input {
          background: none; border: none; outline: none;
          color: var(--text); font-family: var(--font); font-size: 13px; width: 100%;
        }
        .tap-search input::placeholder { color: var(--text-3); }

        /* Details button */
        .tap-details-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 11px; border-radius: 7px;
          border: 1px solid var(--border); background: var(--bg-3);
          color: var(--text-2); font-family: var(--font);
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: all 0.15s; white-space: nowrap;
        }
        .tap-details-btn:hover { background: var(--blue-dim); color: var(--blue); border-color: rgba(59,130,246,.3); }

        /* Mobile cards */
        .tap-cards { display: none; flex-direction: column; gap: 10px; }
        .tap-card {
          background: var(--bg-2); border: 1px solid var(--border);
          border-radius: var(--radius-sm); padding: 14px;
          display: flex; flex-direction: column; gap: 10px;
          transition: border-color 0.15s;
        }
        .tap-card:hover { border-color: var(--border-hover); }
        .tap-card-top { display: flex; align-items: center; gap: 12px; }
        .tap-card-info { flex: 1; min-width: 0; }
        .tap-card-name { font-size: 14px; font-weight: 700; color: var(--text); }
        .tap-card-email { font-size: 11px; color: var(--text-3); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tap-card-meta { display: flex; gap: 6px; flex-wrap: wrap; }
        .tap-card-tag {
          font-size: 11px; color: var(--text-2);
          background: var(--bg-3); border: 1px solid var(--border);
          border-radius: 20px; padding: 3px 9px;
        }

        /* Section */
        .adm-section {
          padding: 24px 28px 40px;
          display: flex; flex-direction: column; gap: 16px;
        }

        /* Pagination */
        .adm-pagination {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; border-top: 1px solid var(--border);
          flex-wrap: wrap; gap: 8px;
        }
        .adm-pagination-info { font-size: 12px; color: var(--text-3); font-family: var(--mono); }
        .adm-pagination-btns { display: flex; gap: 4px; }
        .adm-page-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 7px; border: 1px solid var(--border);
          background: var(--bg-3); color: var(--text-2);
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: all 0.15s;
        }
        .adm-page-btn:hover:not(:disabled) { border-color: var(--blue); color: var(--blue); background: var(--blue-dim); }
        .adm-page-btn--active { background: var(--blue); color: #fff !important; border-color: var(--blue); }
        .adm-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        /* Animations */
        @keyframes tap-fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes tap-slideUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        @keyframes adm-shimmer { 0%,100% { opacity:.45 } 50% { opacity:.9 } }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .adm-section { padding: 14px 12px 28px; gap: 12px; }
          .tap-toolbar { padding: 10px 12px; gap: 8px; }
          .tap-search { max-width: 100%; min-width: unset; margin-left: 0; }
          .tap-table-wrap { display: none; }
          .tap-cards { display: flex; }
          .tap-popup { padding: 20px 16px; }
          .tap-grid { grid-template-columns: 1fr; }
          .tap-header { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .tap-pills { width: 100%; }
          .tap-search { width: 100%; }
        }
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
                            {app.profilePhotoUrl
                              ? <img src={app.profilePhotoUrl} alt={app.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
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
                    {app.profilePhotoUrl
                      ? <img src={app.profilePhotoUrl} alt={app.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
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