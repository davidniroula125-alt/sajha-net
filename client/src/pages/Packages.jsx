import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiWifi, FiStar, FiFilter } from 'react-icons/fi';
import { Section, SectionTitle, Badge, Button } from '../components/common/UIComponents';
import { packageAPI } from '../services/api';

export default function Packages() {
  const getPrices = (pkg) => {
    const p = pkg.prices || {};
    return {
      monthly: p.monthly || 0,
      quarterly: p.quarterly || 0,
      halfYearly: p.halfYearly || 0,
      yearly: p.yearly || pkg.price || 0
    };
  };

  const formatPrice = (amount, cycle) => {
    const suffix = { monthly: '/mo', quarterly: '/3mo', halfYearly: '/6mo', yearly: '/yr' };
    return `Rs. ${amount.toLocaleString()}${suffix[cycle] || '/yr'}`;
  };

  const [packages, setPackages] = useState([]);
  const [type, setType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await packageAPI.getAll(type !== 'all' ? { type } : {});
        setPackages(data.packages || []);
      } catch {
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [type]);

  const types = [
    { value: 'all', label: 'All Plans' },
    { value: 'internet', label: 'Internet' },
    { value: 'combo', label: 'Combo' },
    { value: 'business', label: 'Business' },
    { value: 'enterprise', label: 'Enterprise' },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-primary-900/80 to-secondary-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Internet <span className="text-primary-400">Packages</span></h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">Choose the perfect plan for your needs. All plans include free installation and no hidden charges.</p>
          </motion.div>
        </div>
      </section>

      <Section>
        <SectionTitle title="Internet <span class='gradient-text'>Packages</span>" subtitle="Choose the perfect plan for your needs" />
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {types.map(t => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  type === t.value
                    ? 'gradient-bg text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`card p-6 relative ${pkg.isPopular ? 'ring-2 ring-primary-500' : ''}`}
            >
              {pkg.isPopular && (
                <div className="absolute top-4 right-4">
                  <Badge variant="primary"><FiStar className="w-3 h-3 mr-1 inline" /> Popular</Badge>
                </div>
              )}
              <FiWifi className="w-8 h-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{pkg.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-4">{pkg.type}</p>
              {(() => { const prices = getPrices(pkg); return (
                <div className="mb-4">
                  <p className="text-3xl font-bold gradient-text mb-2">{formatPrice(prices.yearly, 'yearly')}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">{formatPrice(prices.monthly, 'monthly')}</span>
                    <span className="text-gray-500 dark:text-gray-400">{formatPrice(prices.quarterly, 'quarterly')}</span>
                    <span className="text-gray-500 dark:text-gray-400">{formatPrice(prices.halfYearly, 'halfYearly')}</span>
                  </div>
                </div>
              ); })()}
              <ul className="space-y-2 mb-6">
                {pkg.features?.map((f, j) => (
                  <li key={j} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FiCheck className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" /> {f}
                  </li>
                ))}
                {pkg.includes?.router && <li className="flex items-center text-sm text-gray-600 dark:text-gray-400"><FiCheck className="w-4 h-4 text-success-500 mr-2" /> Free Router</li>}
                {pkg.includes?.mesh && <li className="flex items-center text-sm text-gray-600 dark:text-gray-400"><FiCheck className="w-4 h-4 text-success-500 mr-2" /> Mesh WiFi</li>}
                {pkg.includes?.tv && <li className="flex items-center text-sm text-gray-600 dark:text-gray-400"><FiCheck className="w-4 h-4 text-success-500 mr-2" /> NetTV</li>}
                {pkg.includes?.phone && <li className="flex items-center text-sm text-gray-600 dark:text-gray-400"><FiCheck className="w-4 h-4 text-success-500 mr-2" /> Telephone</li>}
                {pkg.includes?.dropWire && <li className="flex items-center text-sm text-gray-600 dark:text-gray-400"><FiCheck className="w-4 h-4 text-success-500 mr-2" /> Free Drop Wire</li>}
              </ul>
              {pkg.idealFor && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {pkg.idealFor.map((f, j) => (
                    <span key={j} className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded text-xs">{f}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mb-3">
                <Button to="/apply" variant={pkg.isPopular ? 'primary' : 'outline'} className="flex-1 text-center">Apply Now</Button>
                <Button to="/compare" variant="outline" className="flex-1 text-center">Compare</Button>
              </div>
              {pkg.badge && (
                <div className="text-center">
                  <Badge variant={pkg.isRecommended ? 'primary' : 'secondary'} className="text-xs">{pkg.badge}</Badge>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
}
