import React from 'react';
import heroImage from "../../assets/images/nick-pampoukidis-z1r-RwAM72w-unsplash.jpg"

const Header = () => {
  return (
    <div>
      <header className="relative min-h-screen">

      {/* Hero Section */}
      <div className="relative pt-16 min-h-screen">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/70 z-10"></div>
          {/* https://images.unsplash.com/photo-1551208454-92eafbc87b27?q=80&w=867&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D */}
          <img
            src={heroImage}
            alt="Learning Background"
            className="w-full h-full object-cover"
          />
        {/* Decorative Elements (Optional) */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent z-20"></div>
        </div>


        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-screen">
          <div className="py-20 md:py-32 lg:px-8">
            <div className="max-w-3xl lg:px-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                LEARN SKILLS
                <br />
                <span className="text-white">THAT SHAPE YOUR FUTURE</span>
              </h1>
              
              <p className="text-lg sm:text-base text-gray-200 mb-8 max-w-2xl">
                Discover world-class courses and unlock your potential with expert-led learning experiences.
              </p>

              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Learn more
              </button>
            </div>
          </div>
        </div>

      </div>
    </header>
    </div>

    
  );
};

export default Header;