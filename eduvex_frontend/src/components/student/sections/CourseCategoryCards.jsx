import { useState } from "react";

const categories = [
  {
    id: 1,
    title: "Web Development",
    courses: "1,200+",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <rect x="4" y="8" width="40" height="30" rx="4" fill="#93C5FD" />
        <rect x="4" y="8" width="40" height="8" rx="4" fill="#3B82F6" />
        <circle cx="10" cy="12" r="2" fill="white" />
        <circle cx="17" cy="12" r="2" fill="white" />
        <circle cx="24" cy="12" r="2" fill="white" />
        <rect x="10" y="22" width="28" height="3" rx="1.5" fill="#BFDBFE" />
        <rect x="10" y="29" width="20" height="3" rx="1.5" fill="#BFDBFE" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "AI & Machine Learning",
    courses: "600+",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <circle cx="24" cy="24" r="14" fill="#E9D5FF" />
        <circle cx="24" cy="18" r="5" fill="#A855F7" />
        <circle cx="14" cy="28" r="4" fill="#A855F7" />
        <circle cx="34" cy="28" r="4" fill="#A855F7" />
        <line x1="24" y1="23" x2="14" y2="28" stroke="#7C3AED" strokeWidth="2" />
        <line x1="24" y1="23" x2="34" y2="28" stroke="#7C3AED" strokeWidth="2" />
        <circle cx="24" cy="18" r="2" fill="white" />
        <circle cx="14" cy="28" r="2" fill="white" />
        <circle cx="34" cy="28" r="2" fill="white" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Data Science",
    courses: "450+",
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <rect x="8" y="28" width="8" height="14" rx="2" fill="#4ADE80" />
        <rect x="20" y="18" width="8" height="24" rx="2" fill="#22C55E" />
        <rect x="32" y="10" width="8" height="32" rx="2" fill="#16A34A" />
        <path d="M8 26 L20 16 L32 8" stroke="#86EFAC" strokeWidth="2" strokeDasharray="3 2" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Business",
    courses: "950+",
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <rect x="8" y="20" width="32" height="22" rx="3" fill="#FCD34D" />
        <path d="M16 20V16a8 8 0 0116 0v4" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="18" y="26" width="12" height="8" rx="2" fill="#92400E" />
        <rect x="22" y="28" width="4" height="4" rx="1" fill="#FCD34D" />
      </svg>
    ),
  },
  {
    id: 5,
    title: "Design",
    courses: "800+",
    bg: "bg-pink-50",
    iconBg: "bg-pink-100",
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <circle cx="24" cy="24" r="14" fill="#FBCFE8" />
        <circle cx="18" cy="20" r="5" fill="#EC4899" />
        <circle cx="30" cy="18" r="4" fill="#F97316" />
        <circle cx="28" cy="30" r="4" fill="#A855F7" />
        <circle cx="17" cy="30" r="3" fill="#22C55E" />
        <circle cx="24" cy="24" r="3" fill="white" />
      </svg>
    ),
  },
  {
    id: 6,
    title: "Marketing",
    courses: "400+",
    bg: "bg-red-50",
    iconBg: "bg-red-100",
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <path d="M10 20 L34 12 L34 36 L10 28 Z" fill="#F87171" />
        <rect x="6" y="20" width="6" height="8" rx="1" fill="#EF4444" />
        <rect x="6" y="28" width="8" height="6" rx="1" fill="#FCA5A5" />
        <circle cx="38" cy="18" r="4" fill="#FCA5A5" />
        <circle cx="38" cy="30" r="3" fill="#FCA5A5" />
      </svg>
    ),
  },
];

 function CourseCategoryCards() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="bg-gray-50 p-10 py-16 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">Find courses by topic</p>
          </div>
                  <a
                      href="#"
                      className="text-blue-500 font-medium text-sm flex items-center gap-1 hover:text-blue-700 transition-colors mt-1"
                  >
                      All Categories
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                  </a>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              className={`
                relative flex flex-col items-center text-center p-5 rounded-2xl cursor-pointer
                bg-white border border-gray-100
                transition-all duration-300 ease-out
                ${hovered === cat.id
                  ? "shadow-lg -translate-y-1 border-gray-200"
                  : "shadow-sm hover:shadow-md"
                }
              `}
            >
              {/* Icon */}
              <div
                className={`
                  ${cat.iconBg} rounded-2xl p-3 mb-4
                  transition-transform duration-300
                  ${hovered === cat.id ? "scale-110" : "scale-100"}
                `}
              >
                {cat.icon}
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-1">
                {cat.title}
              </h3>

              {/* Course count */}
              <p className="text-xs text-gray-400 font-medium">
                {cat.courses} courses
              </p>

              {/* Subtle hover overlay */}
              {hovered === cat.id && (
                <div className={`absolute inset-0 ${cat.bg} rounded-2xl opacity-30 pointer-events-none`} />
              )}
            </div>
          ))}
        </div>
        </div>
    </section>
  );
}

export default CourseCategoryCards