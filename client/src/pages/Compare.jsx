import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiWifi, FiStar } from 'react-icons/fi';
import { packageAPI } from '../services/api';

export default function Compare() {
  const [packages, setPackages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    packageAPI.getAll().then(({ data }) => {
      setPackages(data.packages || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectedPkgs = packages.filter(p => selected.includes(p._id));

  const allFeatures = [
    { key: 'speed', label: 'Speed (Mbps)' },
    { key: 'price.yearly', label: 'Yearly Price (NPR)' },
    { key: 'price.monthly', label: 'Monthly Price (NPR)' },
    { key: 'includes.router', label: 'Free Router' },
    { key: 'includes.mesh', label: 'Mesh WiFi' },
    { key: 'includes.dropWire', label: 'Free Drop Wire' },
    { key: 'includes.phone', label: 'Telephone' },
    { key: 'includes.tv', label: 'NetTV' },
    { key: 'includes.unlimitedData', label: 'Unlimited Data' },
    { key: 'includes.ott', label: 'OTT Services' },
    { key: 'isPopular', label: 'Popular' },
    { key: 'isRecommended', label: 'Recommended' },
    { key: 'idealFor', label: 'Ideal For' },
    { key: 'features', label: 'Key Features' },
  ];

  const getValue = (pkg, key) => {
    const parts = key.split('.');
    let val = pkg;
    for (const part of parts) {
      if (val == null) return null;
      val = val[part];
    }
    return val;
  };

  const renderValue = (val) => {
    if (val == null || val === false) return <FiX className="w-4 h-4 text-gray-300" />;
    if (val === true) return <FiCheck className="w-4 h-4 text-success-500" />;
    if (Array.isArray(val)) return val.length > 0 ? val.join(', ') : <FiX className="w-4 h-4 text-gray-300" />;
    if (typeof val === 'number') return val.toLocaleString();
    return String(val);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-primary-900/80 to-secondary-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Compare <span className="text-primary-400">Plans</span></h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">Select packages to compare side by side and find the best fit for your needs.</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Packages to Compare</h2>
          <div className="flex flex-wrap gap-3">
            {packages.map(pkg => (
              <button
                key={pkg._id}
                onClick={() => toggle(pkg._id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selected.includes(pkg._id)
                    ? 'gradient-bg text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {pkg.name} {pkg.isPopular && <FiStar className="w-3 h-3 inline" />}
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{selected.length} package{selected.length !== 1 ? 's' : ''} selected</p>
          )}
        </div>

        {selectedPkgs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">Feature</th>
                  {selectedPkgs.map(pkg => (
                    <th key={pkg._id} className="text-center py-3 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center justify-center gap-2">
                        {pkg.isPopular && <FiStar className="w-4 h-4 text-yellow-500" />}
                        {pkg.name}
                      </div>
                      <p className="text-xs text-primary-500 font-normal mt-1">NPR. {(pkg.price?.yearly || pkg.price?.monthly)?.toLocaleString()}/yr</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {allFeatures.map(feature => (
                  <tr key={feature.key}>
                    <td className="py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">{feature.label}</td>
                    {selectedPkgs.map(pkg => {
                      const val = getValue(pkg, feature.key);
                      return (
                        <td key={pkg._id} className="py-3 px-4 text-sm text-center text-gray-900 dark:text-white">
                          {renderValue(val)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {selected.length === 0 && !loading && (
          <div className="text-center py-16">
            <FiWifi className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Select at least two packages to compare</p>
          </div>
        )}
      </section>
    </div>
  );
}