import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">EDUVEX</h1>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex relative flex-1 max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap='round' strokeLinejoin='round' className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input type="text" name='search' className='flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-9 bg-blue-50 border-transparent focus:border-primary focus:bg-card' placeholder='Search courses, topics, instructors...' />
            </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <a href="#explore" className="text-gray-500 hover:text-blue-600 font-semibold transition-colors">
              Explore
            </a>
            <a href="#about" className="text-gray-500 hover:text-blue-600 font-semibold transition-colors">
              About us
            </a>
            <a href="#contact" className="text-gray-500 hover:text-blue-600 font-semibold transition-colors">
              Contact
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <Link to="/login" className='text-blue-600 hover:text-blue-700 font-semibold transition-colors'>Login</Link>
            <Link to="/signup" className='bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 font-medium transition-colors'>Sign up</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-3 bg-white border-t border-gray-200">
          <a
            href="#explore"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
            onClick={toggleMenu}
          >
            Explore
          </a>
          <a
            href="#about"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
            onClick={toggleMenu}
          >
            About us
          </a>
          <a
            href="#contact"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
            onClick={toggleMenu}
          >
            Contact
          </a>
          <div className="border-t border-gray-200 pt-3 space-y-2">
            <a
              href="#login"
              className="block px-4 py-2 text-center text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 font-medium transition-colors"
              onClick={toggleMenu}
            >
              Log in
            </a>
            <a
              href="#signup"
              className="block px-4 py-2 text-center bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium transition-colors"
              onClick={toggleMenu}
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;