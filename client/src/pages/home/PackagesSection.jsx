import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiWifi, FiStar, FiTv, FiPhone, FiShield, FiZap, FiCpu } from 'react-icons/fi';
import { Section, SectionTitle, Button } from '../../components/common/UIComponents';
import { packageAPI } from '../../services/api';

export default function PackagesSection() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    packageAPI.getAll({ type: 'internet' }).then(({ data }) => {
      const pkgs = data.packages || [];
      setPackages(pkgs.slice(0, 4));
    }).catch(() => setPackages([]));
  }, []);

  const speedIcons = { 50: FiWifi, 100: FiZap, 200: FiCpu, 300: FiCpu, 500: FiShield, 1000: FiShield };

  if (packages.length === 0) return null;

  return (
    <Section className="bg-gray-50 dark:bg-gray-800/50">
      <SectionTitle title="Internet <span class='gradient-text'>Packages</span>" subtitle="Choose the perfect plan for your needs" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg, i) => {
          const Icon = speedIcons[pkg.speed] || FiWifi;
          return (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative group hover:shadow-2xl transition-all duration-300 ${pkg.isPopular ? 'ring-2 ring-primary-500 scale-105' : ''}`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center shadow-lg">
                    <FiStar className="w-3 h-3 mr-1" /> Most Popular
                  </span>
                </div>
              )}
              <div className="card p-6 h-full">

              <div className="relative mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${pkg.isPopular ? 'bg-gradient-to-br from-primary-500 to-secondary-500' : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600'} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-8 h-8 ${pkg.isPopular ? 'text-white' : 'text-primary-500'}`} />
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-1">{pkg.name}</h3>
              <p className="text-xs text-gray-500 uppercase text-center mb-4">{pkg.type}</p>

              <div className="text-center mb-4">
                <p className="text-3xl font-bold gradient-text">
                  Rs. {pkg.price?.monthly?.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">/month</p>
                {pkg.installationCharge > 0 && (
                  <p className="text-xs text-gray-400 mt-1">Installation: Rs. {pkg.installationCharge}</p>
                )}
              </div>

              <ul className="space-y-2.5 mb-6">
                {pkg.features?.slice(0, 4).map((f, j) => (
                  <li key={j} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center mr-2 flex-shrink-0">
                      <FiCheck className="w-3 h-3 text-success-500" />
                    </div>
                    {f}
                  </li>
                ))}
                {pkg.includes?.router && (
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center mr-2 flex-shrink-0">
                      <FiCheck className="w-3 h-3 text-success-500" />
                    </div>
                    Free Router
                  </li>
                )}
                {pkg.includes?.mesh && (
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center mr-2 flex-shrink-0">
                      <FiCheck className="w-3 h-3 text-success-500" />
                    </div>
                    Mesh WiFi
                  </li>
                )}
                {pkg.includes?.tv && (
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center mr-2 flex-shrink-0">
                      <FiCheck className="w-3 h-3 text-success-500" />
                    </div>
                    NetTV
                  </li>
                )}
                {pkg.includes?.phone && (
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center mr-2 flex-shrink-0">
                      <FiCheck className="w-3 h-3 text-success-500" />
                    </div>
                    Telephone
                  </li>
                )}
              </ul>

              {pkg.idealFor && pkg.idealFor.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {pkg.idealFor.slice(0, 3).map((f, j) => (
                    <span key={j} className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-medium">{f}</span>
                  ))}
                </div>
              )}

              <Link to="/apply" className={`block text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
                pkg.isPopular
                  ? 'gradient-bg text-white hover:shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}>
                Apply Now
              </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="text-center mt-10">
        <Button to="/packages" variant="secondary">View All Packages</Button>
      </div>
    </Section>
  );
}
