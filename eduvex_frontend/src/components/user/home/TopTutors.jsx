import { useState } from "react";

const tutors = [
  {
    initials: "SC",
    name: "Sarah Chen",
    specialty: "React & Frontend",
    rating: 4.9,
    courses: 12,
    students: "45k",
    color: "from-blue-200 to-indigo-200",
    textColor: "text-indigo-600",
  },
  {
    initials: "AG",
    name: "Dr. Ana Garcia",
    specialty: "Machine Learning",
    rating: 4.9,
    courses: 8,
    students: "32k",
    color: "from-blue-200 to-indigo-200",
    textColor: "text-indigo-600",
  },
  {
    initials: "MJ",
    name: "Mark Johnson",
    specialty: "Full-Stack Dev",
    rating: 4.8,
    courses: 15,
    students: "58k",
    color: "from-blue-200 to-indigo-200",
    textColor: "text-indigo-600",
  },
  {
    initials: "LW",
    name: "Lisa Wang",
    specialty: "Digital Marketing",
    rating: 4.8,
    courses: 10,
    students: "41k",
    color: "from-blue-200 to-indigo-200",
    textColor: "text-indigo-600",
  },
];

const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="18" rx="1"/>
    <rect x="14" y="3" width="7" height="18" rx="1"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

function TutorCard({ tutor }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer"
      style={{
        boxShadow: hovered
          ? "0 8px 32px rgba(99,118,210,0.13), 0 2px 8px rgba(0,0,0,0.07)"
          : "0 1px 6px rgba(0,0,0,0.07)",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Avatar */}
      <div
        className={`w-16 h-16 rounded-full bg-gradient-to-br ${tutor.color} flex items-center justify-center mb-4`}
        style={{ transition: "transform 0.2s ease", transform: hovered ? "scale(1.07)" : "scale(1)" }}
      >
        <span className={`font-bold text-lg ${tutor.textColor}`}>{tutor.initials}</span>
      </div>

      {/* Name & Specialty */}
      <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{tutor.name}</h3>
      <p className="text-gray-400 text-sm mb-3">{tutor.specialty}</p>

      {/* Rating */}
      <div className="flex items-center gap-1.5 mb-3">
        <StarIcon />
        <span className="text-gray-700 font-semibold text-sm">{tutor.rating}</span>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-100 mb-3" />

      {/* Stats */}
      <div className="flex items-center gap-4 text-gray-400 text-sm">
        <span className="flex items-center gap-1.5">
          <BookIcon />
          <span>{tutor.courses} courses</span>
        </span>
        <span className="flex items-center gap-1.5">
          <UsersIcon />
          <span>{tutor.students}</span>
        </span>
      </div>
    </div>
  );
}

export default function TopTutors() {
  return (
    <section className="w-full bg-gray-50 px-6 py-10 md:px-12 lg:px-16">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">Top Tutors</h2>
          <p className="text-gray-400 text-sm mt-1">Learn from the best instructors</p>
        </div>
        <button className="flex items-center gap-1.5 text-blue-500 font-medium text-sm hover:text-blue-600 transition-colors mt-1">
          View All <ArrowIcon />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tutors.map((tutor) => (
          <TutorCard key={tutor.initials} tutor={tutor} />
        ))}
      </div>
    </section>
  );
}