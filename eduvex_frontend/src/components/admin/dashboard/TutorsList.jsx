import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "./TutorApplications";
import { fetchApprovedTutors, toggleTutorStatus } from "../../../redux/features/tutorsSlice";

const PER_PAGE = 6;

const TutorsList = () => {
    const dispatch   = useDispatch();
    const { tutors, loading, actionLoading, error } = useSelector((s) => s.tutors);

    const [search, setSearch] = useState("");
    const [page, setPage]     = useState(1);

    useEffect(() => {
      console.log('111111111111111')
        dispatch(fetchApprovedTutors());
    }, [dispatch]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return tutors.filter((t) =>
            t.fullName.toLowerCase().includes(q) ||
            t.email.toLowerCase().includes(q) ||
            t.categories?.some((c) => c.toLowerCase().includes(q))
        );
    }, [tutors, search]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleToggle = (id) => {
        dispatch(toggleTutorStatus(id));
    };

    // ── Loading skeleton ──────────────────────────────────────────────────
    if (loading) return (
        <div className="adm-section">
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-3)" }}>
                Loading tutors…
            </div>
        </div>
    );

    return (
        <div className="adm-section">
            <div className="adm-section-header">
                <div>
                    <h1 className="adm-page-title" style={{ fontSize: 20, marginBottom: 4 }}>
                        Tutors List
                    </h1>
                    <p style={{ color: "var(--text-3)", fontSize: 13 }}>
                        All approved tutors on the platform
                    </p>
                </div>
                <div className="tap-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Search name, category, email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
            </div>

            {error && (
                <div style={{
                    background: "var(--red-soft, #fef2f2)",
                    color: "var(--red, #ef4444)",
                    padding: "10px 16px",
                    borderRadius: 8,
                    marginBottom: 12,
                    fontSize: 13,
                }}>
                    {error}
                </div>
            )}

            <div className="adm-card" style={{ padding: 0, overflow: "hidden" }}>
                <div className="adm-table-wrap">
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tutor</th>
                                <th>Subject</th>
                                <th>Experience</th>
                                <th>Joined</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>
                                        No tutors found
                                    </td>
                                </tr>
                            ) : paginated.map((t, idx) => {
                                const isToggling = actionLoading === t._id;
                                return (
                                    <tr key={t._id}>
                                        <td className="adm-muted" style={{ fontFamily: "var(--mono)", fontSize: 12 }}>
                                            {(page - 1) * PER_PAGE + idx + 1}
                                        </td>

                                        {/* Tutor cell */}
                                        <td>
                                            <div className="adm-tutor-cell">
                                                <div
                                                    className="adm-avatar adm-avatar--sm"
                                                    style={{ background: `hsl(${t._id.charCodeAt(0) * 47 % 360}, 55%, 45%)` }}
                                                >
                                                    {t.photo
                                                        ? <img src={t.photo} alt={t.fullName} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                                                        : t.fullName[0]
                                                    }
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: "var(--text)" }}>{t.fullName}</div>
                                                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>{t.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td style={{ color: "var(--text)" }}>
                                            {t.categories?.join(", ")}
                                        </td>

                                        <td>
                                            <span className="adm-pill adm-pill--neutral" style={{ textTransform: "capitalize" }}>
                                                {t.experience}
                                            </span>
                                        </td>

                                        <td className="adm-muted">
                                            {new Date(t.joined).toLocaleDateString("en-IN", {
                                                day: "2-digit", month: "short", year: "numeric"
                                            })}
                                        </td>

                                        {/* Status toggle button */}
                                        <td>
                                            <button
                                                onClick={() => handleToggle(t._id)}
                                                disabled={isToggling}
                                                style={{
                                                    cursor:       isToggling ? "not-allowed" : "pointer",
                                                    opacity:      isToggling ? 0.6 : 1,
                                                    border:       "none",
                                                    borderRadius: 20,
                                                    padding:      "4px 14px",
                                                    fontSize:     12,
                                                    fontWeight:   600,
                                                    transition:   "background 0.2s, color 0.2s",
                                                    background:   t.isBlocked ? "var(--green-soft, #dcfce7)" : "var(--red-soft, #fee2e2)",
                                                    color:        t.isBlocked ? "var(--green, #16a34a)"     : "var(--red, #dc2626)",
                                                }}
                                            >
                                                {isToggling ? "…" : !t.isBlocked ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    total={filtered.length}
                    perPage={PER_PAGE}
                    onPage={setPage}
                />
            </div>
        </div>
    );
};

export default TutorsList;