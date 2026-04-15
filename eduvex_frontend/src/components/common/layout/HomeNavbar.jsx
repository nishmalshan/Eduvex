import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, Bell, ShoppingCart, User, LogOut, ChevronDown, Glasses } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../../redux/features/authSlice';

const HomeNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const profileRef = useRef(null);

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());

    // if (logoutUser.fulfilled.match) {
      
    // }
    navigate("/login")
  }

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

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <a href="#mylearnings" className="text-gray-500 hover:text-blue-600 font-semibold transition-colors">
              My Learnings
            </a>
            <a href="#browse" className="text-gray-500 hover:text-blue-600 font-semibold transition-colors">
              Browse
            </a>
            <a href="#categories" className="text-gray-500 hover:text-blue-600 font-semibold transition-colors">
              Categories
            </a>
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center space-x-3 ml-6">

            {/* Notification Bell */}
            <button
              className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              onClick={() => setHasNotification(false)}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {hasNotification && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="flex items-center space-x-1 bg-blue-600 text-white rounded-full pl-1 pr-3 py-1 hover:bg-blue-700 transition-colors"
                aria-label="Profile menu"
              >
                {/* Avatar circle */}
                <span className="w-7 h-7 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-sm">
                  JD
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Cart
                  </Link>
                  <Link
                    to="/becometutor"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Glasses className="w-4 h-4" />
                    Become a Tutor
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Notification Bell */}
            <button
              className="relative p-2 text-gray-500 hover:text-blue-600 rounded-full transition-colors"
              onClick={() => setHasNotification(false)}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {hasNotification && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

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
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-200">
          <a
            href="#mylearnings"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
            onClick={toggleMenu}
          >
            My Learnings
          </a>
          <a
            href="#browse"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
            onClick={toggleMenu}
          >
            Browse
          </a>
          <a
            href="#categories"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
            onClick={toggleMenu}
          >
            Categories
          </a>

          <div className="border-t border-gray-200 pt-3 space-y-1">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
              onClick={toggleMenu}
            >
              <User className="w-4 h-4" />
              My Profile
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
              onClick={toggleMenu}
            >
              <ShoppingCart className="w-4 h-4" />
              Cart
            </Link>
            <button
              className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;