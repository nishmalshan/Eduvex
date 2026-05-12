import { useState, useMemo } from "react";
import { Pagination } from "./TutorApplications";

const allCourses = [
  { id: 1,  title: "Full Stack Web Development",    category: "Technology",  tutor: "Divya Krishna", students: 4210, price: "₹3,499", rating: 4.9, status: "published" },
  { id: 2,  title: "UI/UX Design Fundamentals",     category: "Design",      tutor: "Sneha Bose",    students: 3180, price: "₹2,999", rating: 4.8, status: "published" },
  { id: 3,  title: "Data Science Bootcamp",         category: "Technology",  tutor: "Manoj Pillai",  students: 2940, price: "₹4,199", rating: 4.7, status: "published" },
  { id: 4,  title: "React Advanced Patterns",       category: "Technology",  tutor: "Divya Krishna", students: 1870, price: "₹2,499", rating: 4.8, status: "published" },
  { id: 5,  title: "Classical Music Theory",        category: "Music",       tutor: "Ravi Shankar",  students: 890,  price: "₹1,799", rating: 4.7, status: "published" },
  { id: 6,  title: "Spoken English Mastery",        category: "Language",    tutor: "Anjali Nair",   students: 3400, price: "₹1,999", rating: 4.9, status: "published" },
  { id: 7,  title: "Economics for Beginners",       category: "Commerce",    tutor: "Lakshmi Rao",   students: 1560, price: "₹1,499", rating: 4.6, status: "published" },
  { id: 8,  title: "Advanced Accountancy",          category: "Commerce",    tutor: "Sanjay Gupta",  students: 2100, price: "₹2,299", rating: 4.5, status: "draft" },
  { id: 9,  title: "Watercolor Painting Basics",    category: "Art",         tutor: "Sneha Bose",    students: 670,  price: "₹1,299", rating: 4.8, status: "published" },
  { id: 10, title: "IELTS Preparation Course",      category: "Language",    tutor: "Anjali Nair",   students: 2870, price: "₹3,299", rating: 4.9, status: "published" },
  { id: 11, title: "Physical Chemistry Deep Dive",  category: "Science",     tutor: "Deepak Sharma", students: 1120, price: "₹2,199", rating: 4.7, status: "published" },
  { id: 12, title: "Modern World History",          category: "Humanities",  tutor: "Suresh Kumar",  students: 980,  price: "₹1,599", rating: 4.6, status: "draft" },
  { id: 13, title: "Carnatic Music for Beginners",  category: "Music",       tutor: "Ravi Shankar",  students: 420,  price: "₹1,199", rating: 4.9, status: "published" },
  { id: 14, title: "Machine Learning with Python",  category: "Technology",  tutor: "Manoj Pillai",  students: 3250, price: "₹4,999", rating: 4.8, status: "published" },
  { id: 15, name: "Introduction to Biology",        category: "Science",     tutor: "Preethi Nair",  students: 870,  price: "₹1,399", rating: 4.7, status: "published" },
];

const categories = ["All", "Technology", "Design", "Music", "Language", "Commerce", "Art", "Science", "Humanities"];
const PER_PAGE = 7;

const CoursesList = () => {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [page,     setPage]     = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allCourses.filter(c => {
      const matchCat    = category === "All" || c.category === category;
      const matchSearch = (c.title || c.name || "").toLowerCase().includes(q) ||
                          c.tutor.toLowerCase().includes(q) ||
                          c.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCat = (c) => { setCategory(c); setPage(1); };

  return (
    <div className="adm-section">
      <div className="adm-section-header">
        <div>
          <h1 className="adm-page-title" style={{ fontSize: 20, marginBottom: 4 }}>Courses</h1>
          <p style={{ color: "var(--text-3)", fontSize: 13 }}>Manage all courses available on the platform</p>
        </div>
        <div className="adm-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="adm-search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            className="adm-search-input"
            placeholder="Search courses or tutors…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="adm-filter-bar" style={{ flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`adm-filter-pill ${category === cat ? "adm-filter-pill--active adm-filter-pill--cat" : ""}`}
            onClick={() => handleCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="adm-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Course</th>
                <th>Category</th>
                <th>Tutor</th>
                <th>Students</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>No courses found</td></tr>
              ) : paginated.map((c, idx) => (
                <tr key={c.id}>
                  <td className="adm-muted" style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{(page - 1) * PER_PAGE + idx + 1}</td>
                  <td style={{ fontWeight: 600, color: "var(--text)", maxWidth: 220 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.title || c.name}
                    </div>
                  </td>
                  <td>
                    <span className="adm-cat-tag">{c.category}</span>
                  </td>
                  <td style={{ color: "var(--text-2)" }}>{c.tutor}</td>
                  <td style={{ fontFamily: "var(--mono)", color: "var(--blue)", fontWeight: 600 }}>{c.students.toLocaleString()}</td>
                  <td style={{ fontFamily: "var(--mono)", color: "var(--green)", fontWeight: 600 }}>{c.price}</td>
                  <td><span style={{ color: "var(--amber)", fontWeight: 700 }}>⭐ {c.rating}</span></td>
                  <td>
                    <span className={`adm-pill ${c.status === "published" ? "adm-pill--approved" : "adm-pill--pending"}`}>
                      {c.status}
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

export default CoursesList