import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiWifi, FiMonitor, FiBriefcase } from 'react-icons/fi';
import { packageAPI } from '../../services/api';

export default function PackagesSection() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    packageAPI.getAll().then(({ data }) => {
      setPackages(data.packages || []);
    }).catch(() => setPackages([]));
  }, []);

  const internetPkgs = packages.filter(p => p.type === 'internet').sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const comboPkgs = packages.filter(p => p.type === 'combo').sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const businessPkgs = packages.filter(p => p.type === 'business').sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const getPriceDisplay = (pkg) => {
    const cycle = pkg.billingCycle || 'yearly';
    const suffix = cycle === 'monthly' ? '/mo' : cycle === 'quarterly' ? '/3mo' : cycle === 'halfYearly' ? '/6mo' : '/yr';
    return `NPR. ${(pkg.price || 0).toLocaleString()}${suffix}`;
  };

  if (packages.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-3">
            <span className="text-gray-900 dark:text-white">SUPER FAST FIBER</span>
          </h2>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gray-900 dark:text-white">INTERNET</span>{' '}
            <span className="text-green-500">&amp; HD TV</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="flex items-center gap-2">
              <FiCheck className="w-5 h-5 text-green-500" /> No Deposit Required!
            </span>
            <span className="flex items-center gap-2">
              <FiWifi className="w-5 h-5 text-green-500" /> FREE Router + Drop Wire Included with every plan!
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 flex items-center gap-3">
              <FiWifi className="w-6 h-6" />
              <h3 className="text-lg font-bold">Blazing Fast Internet Only</h3>
            </div>
            <div className="p-4 sm:p-6 overflow-x-auto">
              <table className="w-full min-w-[300px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-3 text-sm font-bold text-gray-700 dark:text-gray-300">Plan</th>
                    <th className="text-left py-3 text-sm font-bold text-gray-700 dark:text-gray-300">Speed</th>
                    <th className="text-right py-3 text-sm font-bold text-gray-700 dark:text-gray-300">Price / Year</th>
                  </tr>
                </thead>
                <tbody>
                  {internetPkgs.map((pkg, i) => (
                    <tr key={pkg._id} className={`border-b border-gray-100 dark:border-gray-700 ${i === internetPkgs.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="py-3 text-sm font-semibold text-gray-900 dark:text-white">{pkg.name}</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{pkg.speed} Mbps</td>
<td className="py-3 text-sm font-bold text-gray-900 dark:text-white text-right">{getPriceDisplay(pkg)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               <div className="mt-4 text-center">
                 <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Non Deposite</span>
               </div>
             </div>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
           >
             <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-5 flex items-center gap-3">
               <FiMonitor className="w-6 h-6" />
               <h3 className="text-lg font-bold">The Ultimate Bundle: Internet + IP TV</h3>
             </div>
             <div className="p-4 sm:p-6 overflow-x-auto">
               <table className="w-full min-w-[300px]">
                 <thead>
                   <tr className="border-b border-gray-200 dark:border-gray-600">
                     <th className="text-left py-3 text-sm font-bold text-gray-700 dark:text-gray-300">Plan</th>
                     <th className="text-left py-3 text-sm font-bold text-gray-700 dark:text-gray-300">Speed + TV</th>
                     <th className="text-right py-3 text-sm font-bold text-gray-700 dark:text-gray-300">Price</th>
                   </tr>
                 </thead>
                 <tbody>
                   {comboPkgs.map((pkg, i) => (
                     <tr key={pkg._id} className={`border-b border-gray-100 dark:border-gray-700 ${i === comboPkgs.length - 1 ? 'border-b-0' : ''}`}>
                       <td className="py-3 text-sm font-semibold text-gray-900 dark:text-white">{pkg.name}</td>
                       <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{pkg.speed} Mbps + IP TV</td>
                       <td className="py-3 text-sm font-bold text-gray-900 dark:text-white text-right">{getPriceDisplay(pkg)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">IP TV Service FREE / 5G Router for only NPR. 1,000</p>
              </div>
            </div>
          </motion.div>
        </div>

        {businessPkgs.length > 0 && (
          <div className="mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                <span className="text-gray-900 dark:text-white">Business</span>{' '}
                <span className="text-primary-500">Packages</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Dedicated internet solutions for businesses with SLA guarantees, static IPs, and priority support.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {businessPkgs.map((pkg, i) => (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${pkg.isPopular ? 'ring-2 ring-primary-500' : ''}`}
                >
                  <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-5 flex items-center gap-3">
                    <FiBriefcase className="w-6 h-6" />
                    <h3 className="text-lg font-bold">{pkg.name}</h3>
                    {pkg.isPopular && (
                      <span className="ml-auto px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase">Popular</span>
                    )}
                  </div>
                  <div className="p-4 sm:p-6 overflow-x-auto">
                    <table className="w-full min-w-[300px]">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="text-left py-3 text-sm font-bold text-gray-700 dark:text-gray-300">Feature</th>
                          <th className="text-left py-3 text-sm font-bold text-gray-700 dark:text-gray-300">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-3 text-sm text-gray-600 dark:text-gray-400">Speed</td>
                          <td className="py-3 text-sm font-semibold text-gray-900 dark:text-white">{pkg.speed} Mbps</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
<td className="py-3 text-sm text-gray-600 dark:text-gray-400">Price ({pkg.billingCycle || 'yearly'})</td>
                           <td className="py-3 text-sm font-bold text-gray-900 dark:text-white">{getPriceDisplay(pkg)}</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-3 text-sm text-gray-600 dark:text-gray-400">Installation</td>
                          <td className="py-3 text-sm font-semibold text-gray-900 dark:text-white">Rs. {pkg.installationCharge?.toLocaleString() || 'Free'}</td>
                        </tr>
                        <tr className="border-b-0">
                          <td className="py-3 text-sm text-gray-600 dark:text-gray-400" colSpan={2}>
                            <ul className="space-y-1">
                              {pkg.features?.map((f, j) => (
                                <li key={j} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                  <FiCheck className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" /> {f}
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="mt-4 text-center">
                      <Link
                        to="/apply"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Get Connected Today!
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/apply"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Connected Today!
          </Link>
          <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <span>📞 9705390890</span>
            <span>Office: 9709110186</span>
            <span>Technical: 970910187</span>
          </div>
        </div>
      </div>
    </section>
  );
}