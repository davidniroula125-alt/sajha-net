import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiClock, FiHeadphones, FiTrendingUp, FiWifi, FiZap, FiGlobe, FiServer } from 'react-icons/fi';
import { Section, SectionTitle } from '../../components/common/UIComponents';

export default function WhyChooseSection() {
  const features = [
    { icon: FiShield, title: '99.9% Uptime', desc: 'Reliable connectivity with guaranteed uptime SLA', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: FiTrendingUp, title: 'Fiber Technology', desc: 'Latest fiber optic technology for fastest speeds', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { icon: FiHeadphones, title: '24/7 Support', desc: 'Round the clock customer support via phone, chat, email', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { icon: FiClock, title: 'Fast Installation', desc: 'Professional installation within 24-48 hours', color: 'from-orange-500 to-red-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { icon: FiWifi, title: 'Whole Home WiFi', desc: 'Mesh WiFi solutions for seamless coverage', color: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
    { icon: FiZap, title: 'Low Latency', desc: 'Optimized for gaming and video conferencing', color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  ];

  return (
    <Section className="text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80)' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-secondary-900/90" />
      <div className="relative">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full" />
      </div>
      </div>

      <div className="relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Sajha Net?</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            We're committed to providing Nepal's best internet experience with cutting-edge technology and exceptional customer service.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-white/70 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/about" className="inline-flex items-center space-x-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
            <span>Learn More About Us</span>
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
