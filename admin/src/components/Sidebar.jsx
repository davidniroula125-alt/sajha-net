import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiFileText, FiUsers, FiMessageSquare, FiMessageCircle, FiLogOut, FiWifi, FiSettings, FiPercent, FiStar, FiHelpCircle, FiMapPin, FiImage, FiUser, FiClock, FiImage as FiImageIcon, FiBell, FiGrid as FiGridIcon, FiServer, FiAlertCircle, FiThumbsUp } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const sections = [
    { label: 'Overview', links: [
      { to: '/', icon: FiGrid, label: 'Dashboard' },
    ]},
    { label: 'Website CMS', links: [
      { to: '/settings', icon: FiSettings, label: 'General Settings' },
      { to: '/hero-banners', icon: FiImage, label: 'Hero & Banners' },
      { to: '/announcements', icon: FiBell, label: 'Announcements' },
      { to: '/media', icon: FiImageIcon, label: 'Media Library' },
      { to: '/gallery', icon: FiGridIcon, label: 'Gallery' },
    ]},
    { label: 'Content', links: [
      { to: '/packages', icon: FiPackage, label: 'Packages' },
      { to: '/services', icon: FiServer, label: 'Services' },
      { to: '/offers', icon: FiPercent, label: 'Offers' },
      { to: '/blogs', icon: FiFileText, label: 'Blogs' },
      { to: '/testimonials', icon: FiStar, label: 'Testimonials' },
      { to: '/faqs', icon: FiHelpCircle, label: 'FAQs' },
      { to: '/coverage', icon: FiMapPin, label: 'Coverage' },
    ]},
    { label: 'Users & Support', links: [
      { to: '/applications', icon: FiFileText, label: 'Applications' },
      { to: '/customers', icon: FiUsers, label: 'Customers' },
      { to: '/employees', icon: FiUser, label: 'Employees' },
      { to: '/team', icon: FiUsers, label: 'Team Members' },
      { to: '/complaints', icon: FiAlertCircle, label: 'Complaints' },
      { to: '/feedbacks', icon: FiThumbsUp, label: 'Feedback' },
      { to: '/tickets', icon: FiMessageCircle, label: 'Tickets' },
      { to: '/chats', icon: FiMessageSquare, label: 'Chats' },
    ]},
    { label: 'System', links: [
      { to: '/audit-logs', icon: FiClock, label: 'Audit Logs' },
    ]},
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <img src="/uploads/logo.png" alt="Sajha Net" className="w-10 h-10 object-contain" onError={(e) => { e.target.src = '/uploads/logo.svg'; }} />
          <div>
            <p className="font-bold">Sajha Net</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        {sections.map(section => (
          <div key={section.label}>
            <p className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{section.label}</p>
            <div className="space-y-1">
              {section.links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`
                  }
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all">
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
