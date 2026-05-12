import React from 'react'

const BecomeTutorSection = () => {
  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center p-8">
      <div
        className="relative w-full rounded-3xl overflow-hidden px-10 py-8"
        style={{
          background: "linear-gradient(135deg, #eef0fb 0%, #f0eaf8 50%, #eef0fb 100%)",
        }}
      >
        {/* Content */}
        <div className="max-w-lg">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-blue-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-9-5m9 5l9-5" />
            </svg>
            <span className="text-sm text-blue-600 font-medium">Become a Tutor</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Share Your{" "}
            <span className="text-blue-500">Knowledge</span>
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
            Become a tutor and start teaching today. Reach thousands of
            learners worldwide and earn while you share your expertise.
          </p>

          {/* CTA Button */}
          <button className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
            <span className="text-lg font-light">+</span>
            Start Teaching
          </button>
        </div>

        {/* Graduation Cap Illustration */}
        <div className="absolute right-14 top-1/2 -translate-y-1/2 hidden md:block">
          <div className="text-8xl md:text-9xl opacity-80">
            🎓
          </div>
        </div>
      </div>
    </section>
  );
}



function GraduationCap() {
  return (
    <svg
      width="180"
      height="160"
      viewBox="0 0 180 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-xl"
    >
      {/* Cap top flat board */}
      <ellipse cx="90" cy="58" rx="72" ry="18" fill="#4B4F6B" />
      <path
        d="M18 58 L90 40 L162 58 L90 76 Z"
        fill="#5C6080"
      />
      {/* Cap board highlight */}
      <path
        d="M18 58 L90 40 L162 58 L90 72 Z"
        fill="#6B6F94"
        opacity="0.5"
      />
      {/* Cap body / dome */}
      <path
        d="M42 68 Q42 110 90 118 Q138 110 138 68 L90 76 Z"
        fill="#4B4F6B"
      />
      <path
        d="M42 68 Q42 105 90 113 Q138 105 138 68 L90 72 Z"
        fill="#5C6080"
      />
      {/* Tassel string */}
      <line x1="152" y1="58" x2="155" y2="105" stroke="#E8A838" strokeWidth="3" strokeLinecap="round" />
      {/* Tassel top knot */}
      <circle cx="152" cy="58" r="5" fill="#E8A838" />
      {/* Tassel bottom fringe */}
      <ellipse cx="155" cy="110" rx="7" ry="10" fill="#E8723A" />
      <line x1="150" y1="108" x2="148" y2="122" stroke="#E8723A" strokeWidth="2" strokeLinecap="round" />
      <line x1="155" y1="110" x2="155" y2="124" stroke="#D4621A" strokeWidth="2" strokeLinecap="round" />
      <line x1="160" y1="108" x2="162" y2="122" stroke="#E8723A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}


export default BecomeTutorSection