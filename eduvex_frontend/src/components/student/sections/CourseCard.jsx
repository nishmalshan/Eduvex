import React from 'react'
import {Star } from 'lucide-react';





// Star Rating Component
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${
          star <= rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ))}
  </div>
);



const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
    
    {/* Card Thumbnail */}
    <div className="relative bg-[#1a1f4e] h-44 overflow-hidden flex items-center justify-between px-5">
      
      {/* Decorative Rings */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-4 pointer-events-none">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border border-blue-400 opacity-20 scale-150"></div>
          <div className="absolute inset-0 rounded-full border border-blue-400 opacity-20 scale-125"></div>
          <div className="absolute inset-0 rounded-full border border-blue-400 opacity-20"></div>
        </div>
      </div>

      {/* Title Text */}
      <div className="z-10">
        <p className="text-white text-xl font-extrabold leading-tight">
          Python<br />Full Stack
        </p>
        <p className="text-blue-300 text-[9px] font-semibold tracking-widest uppercase mt-1.5">
          Career Development Program
        </p>
      </div>

      {/* Monitor Icon */}
      <div className="z-10 flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 80 70"
          className="w-24 h-20"
          fill="none"
        >
          {/* Monitor screen */}
          <rect x="4" y="4" width="60" height="42" rx="4" fill="#0ea5e9" stroke="#38bdf8" strokeWidth="2" />
          {/* Code lines on screen */}
          <rect x="10" y="12" width="22" height="3" rx="1.5" fill="#f97316" />
          <rect x="10" y="18" width="30" height="3" rx="1.5" fill="#facc15" />
          <rect x="10" y="24" width="18" height="3" rx="1.5" fill="#4ade80" />
          <rect x="10" y="30" width="26" height="3" rx="1.5" fill="#f97316" />
          <rect x="10" y="36" width="20" height="3" rx="1.5" fill="#4ade80" />
          {/* Stand */}
          <rect x="28" y="46" width="12" height="8" rx="2" fill="#38bdf8" />
          <rect x="18" y="54" width="32" height="4" rx="2" fill="#0ea5e9" />
        </svg>
      </div>
    </div>

    {/* Card Body */}
    <div className="p-4 space-y-2">
      <p className="text-gray-400 text-xs font-medium">{course.instructor}</p>
      <h3 className="text-gray-900 font-bold text-sm leading-snug group-hover:text-blue-600 transition-colors duration-200">
        {course.title}
      </h3>
      <div className="pt-1 space-y-0.5">
        <p className="text-gray-500 text-xs">{course.category}</p>
        <p className="text-gray-500 text-xs">{course.duration}</p>
      </div>
      <StarRating rating={course.rating} />
      <p className="text-gray-900 font-bold text-lg pt-1">{course.price}</p>
    </div>
  </div>
  )
}

export default CourseCard