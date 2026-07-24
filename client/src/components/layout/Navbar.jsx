import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX, FiChevronDown, FiUser } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Packages', path: '/packages' },
  { name: 'Business', path: '/business' },
  { name: 'Coverage', path: '/coverage' },
  { name: 'Support', path: '/support' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/uploads/logo.png" alt="Sajha Net" className="h-12 w-auto" onError={(e) => { e.target.src = '/uploads/logo.svg'; }} />
            <span className={`text-xl font-bold hidden sm:block ${scrolled ? 'gradient-text' : 'text-white'}`}>Sajha Net</span>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? scrolled
                      ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-white bg-white/10'
                    : scrolled
                      ? 'text-gray-700 dark:text-gray-300 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${scrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'hover:bg-white/10'}`}>
              {isDark ? <FiSun className="w-5 h-5 text-yellow-500" /> : <FiMoon className={`w-5 h-5 ${scrolled ? 'text-gray-600' : 'text-white'}`} />}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-white" />
                  </div>
                  <span className={`hidden md:block text-sm font-medium ${scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'}`}>{user.name}</span>
                  <FiChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2"
                    >
                      <Link to="/portal" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Dashboard</Link>
                      <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700">Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/apply" className="btn-primary text-sm !px-4 !py-2">Get Connection</Link>
              </div>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'hover:bg-white/10'}`}>
              {isOpen ? <FiX className={`w-6 h-6 ${scrolled ? '' : 'text-white'}`} /> : <FiMenu className={`w-6 h-6 ${scrolled ? '' : 'text-white'}`} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
                  <Link to="/apply" className="block btn-primary text-center text-sm">Get Connection</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
