import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { Section, Button } from '../../components/common/UIComponents';
import { packageAPI } from '../../services/api';

export default function PackagesSection() {
  const [packages, setPackages] = useState([]);
  const [activeTab, setActiveTab] = useState('internet');

  useEffect(() => {
    packageAPI.getAll().then(({ data }) => {
      setPackages(data.packages || []);
    }).catch(() => setPackages([]));
  }, []);

  const internetPkgs = packages.filter(p => p.type === 'internet');
  const comboPkgs = packages.filter(p => p.type === 'combo');
  const allPkgs = [...internetPkgs, ...comboPkgs];

  const tabs = [
    { id: 'internet', label: 'Internet', pkgs: internetPkgs },
    { id: 'combo', label: 'Combo', pkgs: comboPkgs },
  ];

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];
  const displayPkgs = currentTab.pkgs.length > 0 ? currentTab.pkgs : packages.slice(0, 4);

  const monthlyToYearly = (monthly) => {
    if (!monthly) return 0;
    return monthly * 12;
  };

  if (packages.length === 0) return null;

  return (
    <Section>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Sajha Net</span>{' '}
          <span className="text-gray-900 dark:text-white">Packages</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Reliable High-Speed Fiber Internet for Every Nepali Household
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          No Data Caps | Free Installation | 24/7 Support
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {displayPkgs.map((pkg, i) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Free Installation
                </span>
                {pkg.isPopular && (
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Popular
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{pkg.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{pkg.speed} Mbps</p>

              <div className="mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">NPR</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">
                  {pkg.price?.yearly?.toLocaleString() || monthlyToYearly(pkg.price?.monthly)?.toLocaleString()}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">/year</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Rs. {pkg.price?.monthly?.toLocaleString()}/month
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">No Hidden Fees</p>

              <div className="flex items-center gap-2 mb-8 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FiCheck className="w-5 h-5 text-green-500" />
                <span>NO DEPOSIT REQUIRED, FREE ROUTER + DROP WIRE</span>
              </div>

              <Link
                to="/apply"
                className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300"
              >
                Sign up
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="text-center mt-8">
        <Button to="/packages" variant="secondary">View All Packages</Button>
      </div>
    </Section>
  );
}
