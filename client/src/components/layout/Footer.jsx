import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiLinkedin, FiYoutube, FiPhone, FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi';
import API from '../../services/api';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Packages', path: '/packages' },
  { name: 'Business', path: '/business' },
  { name: 'Coverage', path: '/coverage' },
  { name: 'Blog', path: '/blog' },
];

const services = [
  { name: 'Fiber Internet', path: '/packages' },
  { name: 'Business Internet', path: '/business' },
  { name: 'NetTV', path: '/packages' },
  { name: 'Mesh WiFi', path: '/packages' },
  { name: 'Cloud Services', path: '/packages' },
];

const support = [
  { name: 'Help Center', path: '/support' },
  { name: 'FAQs', path: '/support' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Report Issue', path: '/support' },
  { name: 'Network Status', path: '/support' },
];

const company = [
  { name: 'About Us', path: '/about' },
  { name: 'Careers', path: '/about' },
  { name: 'Partners', path: '/about' },
  { name: 'Privacy Policy', path: '/about' },
  { name: 'Terms of Service', path: '/about' },
];

export default function Footer() {
  const [settings, setSettings] = useState({
    phone: '9705390890',
    email: 'sajhanet2025@gmail.com',
    address: 'Itahari, Nepal',
    facebook: 'https://www.facebook.com/sajhanet',
    instagram: '#',
    linkedin: '#',
    youtube: '#',
    copyrightText: '© 2026 Sajha Net. All rights reserved.',
  });

  useEffect(() => {
    API.get('/settings').then(({ data }) => {
      if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
    }).catch(() => {});
  }, []);

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <img src="/uploads/logo.png" alt="Sajha Net" className="h-12 w-auto" onError={(e) => { e.target.src = '/uploads/logo.svg'; }} />
              <span className="text-xl font-bold text-white">Sajha Net</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Nepal's most reliable high-speed fiber internet provider. Connecting communities with ultra-fast, affordable, and reliable internet services.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-primary-400" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-primary-400" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiMapPin className="w-5 h-5 text-primary-400" />
                <span>{settings.address}</span>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href={settings.facebook} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors"><FiFacebook className="w-5 h-5" /></a>
              <a href={settings.instagram} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors"><FiInstagram className="w-5 h-5" /></a>
              <a href={settings.linkedin} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors"><FiLinkedin className="w-5 h-5" /></a>
              <a href={settings.youtube} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors"><FiYoutube className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                    <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {services.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                    <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {support.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                    <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">{settings.copyrightText}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {company.map((link) => (
                <Link key={link.name} to={link.path} className="text-gray-500 text-sm hover:text-primary-400 transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
