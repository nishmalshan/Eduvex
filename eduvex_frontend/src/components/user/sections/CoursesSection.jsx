import React, { useState } from 'react';
import { ArrowRight, Star, Users } from 'lucide-react';

const recommendedData = [
  {
    id: 1,
    badge: '⚡ Because you\'re learning React',
    icon: 'react',
    title: 'Advanced React Patterns',
    instructor: 'Kent C. Dodds',
    rating: 4.9,
    students: '5.3k',
    price: '$44.99',
  },
  {
    id: 2,
    badge: '⚡ Based on your interests',
    icon: 'typescript',
    title: 'TypeScript Design Patterns',
    instructor: 'Matt Pocock',
    rating: 4.8,
    students: '3.8k',
    price: '$39.99',
  },
  {
    id: 3,
    badge: '⚡ Popular in Development',
    icon: 'node',
    title: 'Node.js Microservices',
    instructor: 'Stephen Grider',
    rating: 4.7,
    students: '7.1k',
    price: '$49.99',
  },
  {
    id: 4,
    badge: '⚡ Trending in your field',
    icon: 'graphql',
    title: 'GraphQL Masterclass',
    instructor: 'Eve Porcello',
    rating: 4.8,
    students: '4.2k',
    price: '$42.99',
  },
  // Additional courses (shown after "View All" is clicked)
  {
    id: 5,
    badge: '⚡ Based on your interests',
    icon: 'react',
    title: 'React Native Mobile Development',
    instructor: 'Maximilian Schwarzmüller',
    rating: 4.7,
    students: '6.2k',
    price: '$54.99',
  },
  {
    id: 6,
    badge: '⚡ Popular in Development',
    icon: 'typescript',
    title: 'Advanced TypeScript Techniques',
    instructor: 'Basarat Ali Syed',
    rating: 4.9,
    students: '4.5k',
    price: '$47.99',
  },
  {
    id: 7,
    badge: '⚡ Trending in your field',
    icon: 'node',
    title: 'Microservices Architecture with Node',
    instructor: 'Valentin Despa',
    rating: 4.6,
    students: '5.8k',
    price: '$52.99',
  },
  {
    id: 8,
    badge: '⚡ Because you\'re learning React',
    icon: 'graphql',
    title: 'Full Stack GraphQL Applications',
    instructor: 'Scott Moss',
    rating: 4.8,
    students: '3.9k',
    price: '$48.99',
  },
];

// Icon component for course cards
const CourseIcon = ({ type }) => {
  const icons = {
    react: (
      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
        <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9.55 4.54c.3-.38.59-.77.86-1.17.27-.42.54-.85.79-1.28-1.25.26-2.59.44-3.95.51-.36.51-.74 1-.12 1.47 1.12 1.03 1.94 1.56 2.42 1.47m-3.47-2.47l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47z"/>
        </svg>
      </div>
    ),
    typescript: (
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center transform rotate-45">
        <div className="w-12 h-12 bg-white transform -rotate-45"></div>
      </div>
    ),
    node: (
      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
        <div className="w-12 h-12 bg-white rounded-full"></div>
      </div>
    ),
    graphql: (
      <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.18l7.45 3.73L12 11.63 4.55 7.91 12 4.18zm-8 5.09l7 3.5v7.05l-7-3.5v-7.05zm9 10.55v-7.05l7-3.5v7.05l-7 3.5z"/>
        </svg>
      </div>
    ),
  };

  return icons[type] || icons.react;
};

// Recommended Course Card
const RecommendedCard = ({ course }) => (
  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
    
    {/* Badge and Icon Section */}
    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 pb-4">
      <div className="flex items-start gap-2 text-xs text-gray-600 mb-8">
        <span className="text-yellow-500">⚡</span>
        <span className="font-medium">{course.badge.replace('⚡ ', '')}</span>
      </div>
      
      <div className="flex justify-center">
        <CourseIcon type={course.icon} />
      </div>
    </div>

    {/* Course Info Section */}
    <div className="p-5 space-y-3">
      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">
        {course.title}
      </h3>
      
      <p className="text-xs text-gray-600">{course.instructor}</p>
      
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-900">{course.rating}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{course.students}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="font-bold text-gray-900">{course.price}</span>
        <button className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all">
          Enroll
        </button>
      </div>
    </div>
  </div>
);

// Main Recommended Section
const CoursesSection = () => {
  const [showAll, setShowAll] = useState(false);

  const initialCount = 4;
  const visibleCourses = showAll ? recommendedData : recommendedData.slice(0, initialCount);
  const hasMore = recommendedData.length > initialCount;

  return (
    <section className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Recommended for You
          </h2>
          <p className="text-gray-600">
            AI-powered picks based on your learning path
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCourses.map((course) => (
            <RecommendedCard key={course.id} course={course} />
          ))}
        </div>

        {/* View All / Show Less Button */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
            >
              {showAll ? 'Show Less' : 'View All'}
              <ArrowRight 
                className={`w-4 h-4 transition-transform duration-300 ${
                  showAll ? 'rotate-180' : 'group-hover:translate-x-1'
                }`} 
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;