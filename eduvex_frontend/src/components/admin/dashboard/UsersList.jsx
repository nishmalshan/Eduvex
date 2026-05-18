import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "./TutorApplications";
import { fetchAllUsers, blockUser, unblockUser } from "../../../redux/features/userSlice";

// ── Skeleton row ──────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} style={{ padding: "14px 16px" }}>
        <div
          style={{
            height: 13,
            borderRadius: 6,
            width: i === 1 ? 160 : i === 5 ? 70 : 90,
            background: "rgba(255,255,255,0.06)",
            animation: "adm-shimmer 1.4s ease infinite",
          }}
        />
      </td>
    ))}
  </tr>
);

// ── Confirm Popup ─────────────────────────────────────────────────────────
const ConfirmPopup = ({ user, action, onConfirm, onClose }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const isBlock = action === "block";

  return (
    <div className="tap-overlay" onClick={onClose}>
      <div
        className="tap-popup"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 380, padding: "32px 28px" }}
      >
        <button className="tap-close" onClick={onClose} aria-label="Close">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%", marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isBlock ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
        }}>
          {isBlock ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
          {isBlock ? "Block User?" : "Unblock User?"}
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.6, marginBottom: 24 }}>
          {isBlock
            ? <><strong style={{ color: "var(--text-2)" }}>{user?.fullName}</strong> will lose access to the platform immediately.</>
            : <><strong style={{ color: "var(--text-2)" }}>{user?.fullName}</strong> will regain full access to the platform.</>
          }
        </p>

        <div className="tap-actions" style={{ marginTop: 0 }}>
          <button className="tap-btn tap-btn--reject" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button
            className={`tap-btn ${isBlock ? "tap-btn--reject" : "tap-btn--approve"}`}
            style={{ flex: 1 }}
            onClick={onConfirm}
          >
            {isBlock ? "Block" : "Unblock"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────
const PER_PAGE = 8;

const UsersList = () => {
  const dispatch = useDispatch();
  const { users, loading, actionLoading, error } = useSelector((state) => state.users);

  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");
  const [page,    setPage]    = useState(1);
  const [confirm, setConfirm] = useState(null); // { user, action: "block"|"unblock" }

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // ── Derived ───────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchFilter =
        filter === "all" ||
        (filter === "active"   && !u.isBlocked) ||
        (filter === "inactive" && u.isBlocked);
      const q = search.toLowerCase();
      const matchSearch =
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.plan?.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [users, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = useMemo(() => ({
    all:      users.length,
    active:   users.filter((u) => !u.isBlocked).length,
    inactive: users.filter((u) => u.isBlocked).length,
  }), [users]);

  const handleFilter = (f) => { setFilter(f); setPage(1); };
  const handleSearch = (v) => { setSearch(v); setPage(1); };

  const handleConfirm = () => {
    if (!confirm) return;
    const { user, action } = confirm;
    if (action === "block")   dispatch(blockUser(user._id));
    if (action === "unblock") dispatch(unblockUser(user._id));
    setConfirm(null);
  };

  // ─────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="adm-section">

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
              Users
            </h1>
            <p style={{ color: "var(--text-3)", fontSize: 13 }}>
              All registered learners on the platform
            </p>
          </div>
          {error && (
            <button
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-3)", color: "var(--text-2)", fontFamily: "var(--font)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              onClick={() => dispatch(fetchUsers())}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" />
              </svg>
              Retry
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="adm-alert adm-alert--warning">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Toolbar */}
        <div className="tap-toolbar">
          <div className="tap-pills">
            {[
              { key: "all",      label: "All" },
              { key: "active",   label: "Active" },
              { key: "inactive", label: "Inactive" },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`tap-pill tap-pill--${key === "active" ? "approved" : key === "inactive" ? "rejected" : key} ${filter === key ? "tap-pill--on" : ""}`}
                onClick={() => handleFilter(key)}
              >
                {label}
                <span className="tap-count">{counts[key]}</span>
              </button>
            ))}
          </div>
          <div className="tap-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              placeholder="Search by name, email or plan…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
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
                  <th>User</th>
                  <th>Courses Enrolled</th>
                  <th>Plan</th>
                  <th>Joined</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

                {!loading && paginated.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: 52, color: "var(--text-3)" }}>
                      <div style={{ fontSize: 30, marginBottom: 10 }}>👥</div>
                      <div style={{ fontWeight: 600 }}>No users found</div>
                      {search && <div style={{ fontSize: 12, marginTop: 4 }}>Try clearing your search</div>}
                    </td>
                  </tr>
                )}

                {!loading && paginated.map((u, idx) => {
                  const isActing = actionLoading === u._id;
                  const isActive = !u.isBlocked;

                  return (
                    <tr key={u._id}>
                      <td className="adm-muted" style={{ fontFamily: "var(--mono)", fontSize: 12 }}>
                        {(page - 1) * PER_PAGE + idx + 1}
                      </td>
                      <td>
                        <div className="adm-tutor-cell">
                          <div
                            className="adm-avatar adm-avatar--sm"
                            style={{
                              overflow: "hidden", flexShrink: 0,
                              background: u.avatar ? "transparent" : `hsl(${(u._id?.charCodeAt(0) ?? 0) * 61 % 360}, 50%, 42%)`,
                            }}
                          >
                            {u.avatar
                              ? <img src={u.avatar} alt={u.fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              : u.fullName?.[0] ?? "?"
                            }
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text)" }}>{u.fullName}</div>
                            <div style={{ fontSize: 11, color: "var(--text-3)" }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: "var(--mono)", color: "var(--blue)", fontWeight: 600 }}>
                        {u.coursesEnrolled ?? u.courses ?? 0}
                      </td>
                      <td>
                        <span className={`adm-pill ${u.plan === "Pro" ? "adm-pill--approved" : "adm-pill--pending"}`}>
                          {u.plan ?? "Free"}
                        </span>
                      </td>
                      <td className="adm-muted">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : u.joined ?? "—"
                        }
                      </td>
                      <td>
                        {/* Clickable status badge — toggles block/unblock */}
                        <button
                          className={`adm-pill ${isActive ? "adm-pill--approved" : "adm-pill--rejected"}`}
                          style={{
                            cursor: isActing ? "not-allowed" : "pointer",
                            border: "none",
                            opacity: isActing ? 0.6 : 1,
                            transition: "opacity 0.15s, filter 0.15s",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontFamily: "var(--font)",
                          }}
                          disabled={isActing}
                          title={isActive ? "Click to block this user" : "Click to unblock this user"}
                          onClick={() => setConfirm({ user: u, action: isActive ? "block" : "unblock" })}
                        >
                          {isActing ? (
                            <>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ animation: "ul-spin 0.8s linear infinite" }}>
                                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                              </svg>
                              …
                            </>
                          ) : (
                            <>
                              {isActive
                                ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                : <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                              }
                              {isActive ? "active" : "inactive"}
                            </>
                          )}
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
            <div style={{ textAlign: "center", padding: 32, color: "var(--text-3)" }}>Loading…</div>
          )}
          {!loading && paginated.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>👥</div>
              No users found
            </div>
          )}
          {!loading && paginated.map((u) => {
            const isActing = actionLoading === u._id;
            const isActive = !u.isBlocked;
            return (
              <div key={u._id} className="tap-card">
                <div className="tap-card-top">
                  <div
                    className="adm-avatar"
                    style={{
                      overflow: "hidden", flexShrink: 0,
                      background: u.avatar ? "transparent" : `hsl(${(u._id?.charCodeAt(0) ?? 0) * 61 % 360}, 50%, 42%)`,
                    }}
                  >
                    {u.avatar
                      ? <img src={u.avatar} alt={u.fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : u.fullName?.[0] ?? "?"
                    }
                  </div>
                  <div className="tap-card-info">
                    <div className="tap-card-name">{u.fullName}</div>
                    <div className="tap-card-email">{u.email}</div>
                  </div>
                  <span className={`adm-pill ${u.plan === "Pro" ? "adm-pill--approved" : "adm-pill--pending"}`}>
                    {u.plan ?? "Free"}
                  </span>
                </div>
                <div className="tap-card-meta">
                  <span className="tap-card-tag">📚 {u.coursesEnrolled ?? u.courses ?? 0} courses</span>
                  <span className="tap-card-tag">
                    🗓 {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                      : u.joined ?? "—"
                    }
                  </span>
                </div>
                <button
                  className={`tap-btn ${isActive ? "tap-btn--reject" : "tap-btn--approve"}`}
                  style={{ width: "100%", justifyContent: "center", opacity: isActing ? 0.6 : 1 }}
                  disabled={isActing}
                  onClick={() => setConfirm({ user: u, action: isActive ? "block" : "unblock" })}
                >
                  {isActing ? "Processing…" : isActive ? "Block User" : "Unblock User"}
                </button>
              </div>
            );
          })}
          {!loading && filtered.length > 0 && (
            <Pagination page={page} totalPages={totalPages} total={filtered.length} perPage={PER_PAGE} onPage={setPage} />
          )}
        </div>

      </div>

      {/* Confirm popup */}
      {confirm && (
        <ConfirmPopup
          user={confirm.user}
          action={confirm.action}
          onConfirm={handleConfirm}
          onClose={() => setConfirm(null)}
        />
      )}

      <style>{`
        @keyframes ul-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default UsersList;