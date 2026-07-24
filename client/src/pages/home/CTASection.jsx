import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import API from '../../services/api';

export default function CTASection() {
  const [settings, setSettings] = useState({
    ctaTitle: 'Get Connected Today!',
    ctaSubtitle: 'No Deposit Required! FREE Router + Drop Wire included with every plan. Call 9705390890 now!',
  });

  useEffect(() => {
    API.get('/settings').then(({ data }) => {
      if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
    }).catch(() => {});
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-secondary-600/90" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{settings.ctaTitle}</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">{settings.ctaSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/apply" className="inline-flex items-center space-x-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <span>Get Connection</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="inline-flex items-center space-x-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
              <span>Contact Sales</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
