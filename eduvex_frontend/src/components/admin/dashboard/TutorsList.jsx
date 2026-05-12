import { useState, useMemo } from "react";
import { Pagination } from "./TutorApplications";

const allTutors = [
  { id: 1,  name: "Anjali Nair",   subject: "English",      email: "anjali@email.com",  students: 142, rating: 4.9, joined: "2024-01-12", status: "active" },
  { id: 2,  name: "Deepak Sharma", subject: "Chemistry",    email: "deepak@email.com",  students: 98,  rating: 4.7, joined: "2024-02-08", status: "active" },
  { id: 3,  name: "Suresh Kumar",  subject: "History",      email: "suresh@email.com",  students: 213, rating: 4.8, joined: "2023-11-20", status: "active" },
  { id: 4,  name: "Lakshmi Rao",   subject: "Economics",    email: "lakshmi@email.com", students: 176, rating: 4.9, joined: "2023-09-05", status: "active" },
  { id: 5,  name: "Sanjay Gupta",  subject: "Accountancy",  email: "sanjay@email.com",  students: 301, rating: 4.6, joined: "2023-07-14", status: "active" },
  { id: 6,  name: "Rohan Mehta",   subject: "Mathematics",  email: "rohan@email.com",   students: 88,  rating: 4.5, joined: "2024-03-22", status: "inactive" },
  { id: 7,  name: "Preethi Nair",  subject: "Biology",      email: "preethi@email.com", students: 124, rating: 4.8, joined: "2024-01-30", status: "active" },
  { id: 8,  name: "Alok Tiwari",   subject: "Physics",      email: "alok@email.com",    students: 67,  rating: 4.4, joined: "2024-04-10", status: "active" },
  { id: 9,  name: "Divya Krishna", subject: "Coding",       email: "divya@email.com",   students: 198, rating: 4.9, joined: "2023-12-01", status: "active" },
  { id: 10, name: "Manoj Pillai",  subject: "Data Science", email: "manoj@email.com",   students: 255, rating: 4.7, joined: "2023-08-17", status: "inactive" },
  { id: 11, name: "Sneha Bose",    subject: "Art",          email: "sneha@email.com",   students: 43,  rating: 4.6, joined: "2024-05-01", status: "active" },
  { id: 12, name: "Ravi Shankar",  subject: "Music",        email: "ravi@email.com",    students: 79,  rating: 4.8, joined: "2024-02-14", status: "active" },
];

const PER_PAGE = 6;

const TutorsList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allTutors.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q)
    );
  }, [search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="adm-section">
      <div className="adm-section-header">
        <div>
          <h1 className="adm-page-title" style={{ fontSize: 20, marginBottom: 4 }}>Tutors List</h1>
          <p style={{ color: "var(--text-3)", fontSize: 13 }}>All approved tutors on the platform</p>
        </div>
        <div className="adm-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="adm-search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            className="adm-search-input"
            placeholder="Search tutors…"
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
                <th>Tutor</th>
                <th>Subject</th>
                <th>Students</th>
                <th>Rating</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>No tutors found</td></tr>
              ) : paginated.map((t, idx) => (
                <tr key={t.id}>
                  <td className="adm-muted" style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{(page - 1) * PER_PAGE + idx + 1}</td>
                  <td>
                    <div className="adm-tutor-cell">
                      <div className="adm-avatar adm-avatar--sm" style={{ background: `hsl(${t.id * 47 % 360}, 55%, 45%)` }}>{t.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text)" }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)" }}>{t.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--text)" }}>{t.subject}</td>
                  <td style={{ fontFamily: "var(--mono)", color: "var(--blue)", fontWeight: 600 }}>{t.students}</td>
                  <td>
                    <span style={{ color: "var(--amber)", fontWeight: 700, fontSize: 13 }}>⭐ {t.rating}</span>
                  </td>
                  <td className="adm-muted">{t.joined}</td>
                  <td>
                    <span className={`adm-pill ${t.status === "active" ? "adm-pill--approved" : "adm-pill--rejected"}`}>
                      {t.status}
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

export default TutorsList