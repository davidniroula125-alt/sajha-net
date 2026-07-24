import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiWifi, FiShield, FiClock, FiZap, FiCheck, FiGlobe, FiTrendingUp } from 'react-icons/fi';
import API from '../../services/api';

export default function HeroSection() {
  const [settings, setSettings] = useState({
    heroTitle: 'नेपालको सबैभन्दा भरपर्दो हाई-स्पीड इन्टरनेट',
    heroSubtitle: 'Ultra Fast Fiber Internet | Reliable Connection | 24/7 Customer Support',
  });

  useEffect(() => {
    API.get('/settings').then(({ data }) => {
      if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
    }).catch(() => {});
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80)' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-primary-900/80 to-secondary-900/90" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full" />
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s` }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 mb-6"
            >
              <FiZap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/80">Nepal's Fastest Growing ISP</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {settings.heroTitle}
            </h1>

            <p className="text-xl text-white/70 mb-8 max-w-lg">
              {settings.heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/apply" className="inline-flex items-center space-x-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                <span>Get Connection</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/packages" className="inline-flex items-center space-x-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
                <span>View Packages</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: FiWifi, label: 'Ultra Fast Fiber', value: 'Up to 1 Gbps' },
                { icon: FiShield, label: '99.9% Uptime', value: 'Guaranteed' },
                { icon: FiClock, label: '24/7 Support', value: 'Always Available' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <item.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <p className="text-white font-semibold text-sm">{item.label}</p>
                  <p className="text-white/60 text-xs">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                        <FiWifi className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Speed Test</p>
                        <p className="text-white/60 text-sm">Current Connection</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">987</p>
                      <p className="text-white/60 text-sm">Mbps ↓</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <FiShield className="w-6 h-6 text-green-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">99.9%</p>
                      <p className="text-white/60 text-sm">Uptime</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <FiZap className="w-6 h-6 text-cyan-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">2ms</p>
                      <p className="text-white/60 text-sm">Latency</p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/80">Data Used</span>
                      <span className="text-white font-semibold">Unlimited</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2.5">
                      <div className="gradient-bg h-2.5 rounded-full" style={{ width: '45%' }} />
                    </div>
                    <p className="text-white/60 text-xs mt-2">No data caps, ever!</p>
                  </div>

                  <div className="flex items-center space-x-2 text-white/60 text-sm">
                    <FiCheck className="w-4 h-4 text-green-400" />
                    <span>Free Router Included</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249 250 251)"/>
        </svg>
      </div>
    </section>
  );
}
