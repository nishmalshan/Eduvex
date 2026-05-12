import { useState, useMemo } from "react";
import { Pagination } from "./TutorApplications";

const allUsers = [
  { id: 1,  name: "Arun Krishnan",   email: "arun.k@mail.com",    courses: 4,  joined: "2024-01-10", plan: "Pro",   status: "active" },
  { id: 2,  name: "Beena Mathew",    email: "beena.m@mail.com",   courses: 2,  joined: "2024-02-18", plan: "Free",  status: "active" },
  { id: 3,  name: "Chandan Roy",     email: "chandan.r@mail.com", courses: 7,  joined: "2023-11-05", plan: "Pro",   status: "active" },
  { id: 4,  name: "Diya Menon",      email: "diya.m@mail.com",    courses: 1,  joined: "2024-04-22", plan: "Free",  status: "inactive" },
  { id: 5,  name: "Ebin Thomas",     email: "ebin.t@mail.com",    courses: 9,  joined: "2023-08-14", plan: "Pro",   status: "active" },
  { id: 6,  name: "Fathima Ali",     email: "fathima.a@mail.com", courses: 3,  joined: "2024-03-07", plan: "Free",  status: "active" },
  { id: 7,  name: "George Philip",   email: "george.p@mail.com",  courses: 6,  joined: "2023-12-19", plan: "Pro",   status: "active" },
  { id: 8,  name: "Hana Rashid",     email: "hana.r@mail.com",    courses: 0,  joined: "2024-05-01", plan: "Free",  status: "inactive" },
  { id: 9,  name: "Irfan Siddiqui",  email: "irfan.s@mail.com",   courses: 11, joined: "2023-06-30", plan: "Pro",   status: "active" },
  { id: 10, name: "Jasmine Kurian",  email: "jasmine.k@mail.com", courses: 5,  joined: "2024-01-25", plan: "Free",  status: "active" },
  { id: 11, name: "Kiran Joshi",     email: "kiran.j@mail.com",   courses: 2,  joined: "2024-02-14", plan: "Free",  status: "active" },
  { id: 12, name: "Lijo Varghese",   email: "lijo.v@mail.com",    courses: 8,  joined: "2023-10-03", plan: "Pro",   status: "active" },
  { id: 13, name: "Meera Pillai",    email: "meera.p@mail.com",   courses: 3,  joined: "2024-03-28", plan: "Free",  status: "inactive" },
  { id: 14, name: "Naveen Kumar",    email: "naveen.k@mail.com",  courses: 14, joined: "2023-05-11", plan: "Pro",   status: "active" },
  { id: 15, name: "Olivia Samuel",   email: "olivia.s@mail.com",  courses: 6,  joined: "2023-09-22", plan: "Pro",   status: "active" },
  { id: 16, name: "Praveen Nair",    email: "praveen.n@mail.com", courses: 1,  joined: "2024-04-15", plan: "Free",  status: "active" },
];

const PER_PAGE = 8;

const UsersList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allUsers.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.plan.toLowerCase().includes(q)
    );
  }, [search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="adm-section">
      <div className="adm-section-header">
        <div>
          <h1 className="adm-page-title" style={{ fontSize: 20, marginBottom: 4 }}>Users</h1>
          <p style={{ color: "var(--text-3)", fontSize: 13 }}>All registered learners on the platform</p>
        </div>
        <div className="adm-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="adm-search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            className="adm-search-input"
            placeholder="Search by name, email or plan…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className="adm-card" style={{ padding: 0, overflow: "hidden" }}>
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
              {paginated.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>No users found</td></tr>
              ) : paginated.map((u, idx) => (
                <tr key={u.id}>
                  <td className="adm-muted" style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{(page - 1) * PER_PAGE + idx + 1}</td>
                  <td>
                    <div className="adm-tutor-cell">
                      <div className="adm-avatar adm-avatar--sm" style={{ background: `hsl(${u.id * 61 % 360}, 50%, 42%)` }}>{u.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text)" }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)" }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: "var(--mono)", color: "var(--blue)", fontWeight: 600 }}>{u.courses}</td>
                  <td>
                    <span className={`adm-pill ${u.plan === "Pro" ? "adm-pill--approved" : "adm-pill--pending"}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="adm-muted">{u.joined}</td>
                  <td>
                    <span className={`adm-pill ${u.status === "active" ? "adm-pill--approved" : "adm-pill--rejected"}`}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} total={filtered.length} perPage={PER_PAGE} onPage={setPage} />
      </div>
    </div>
  );
}

export default UsersList