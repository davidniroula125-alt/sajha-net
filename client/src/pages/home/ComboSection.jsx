import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiWifi, FiTv, FiPhone, FiCheck } from 'react-icons/fi';
import { Section, SectionTitle } from '../../components/common/UIComponents';
import { packageAPI } from '../../services/api';

export default function ComboSection() {
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    packageAPI.getAll({ type: 'combo' }).then(({ data }) => {
      setCombos((data.packages || []).slice(0, 3));
    }).catch(() => setCombos([]));
  }, []);

  if (combos.length === 0) return null;

  return (
    <Section>
      <SectionTitle title="Combo <span class='gradient-text'>Packages</span>" subtitle="Get more with our all-in-one bundles" />
      <div className="grid md:grid-cols-3 gap-8">
        {combos.map((combo, i) => (
          <motion.div
            key={combo._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`card p-8 relative ${combo.isPopular ? 'ring-2 ring-primary-500' : ''}`}
          >
            {combo.isPopular && (
              <span className="absolute top-4 right-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Best Value
              </span>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{combo.name}</h3>
            <p className="text-3xl font-bold gradient-text mb-6">
              Rs. {combo.price?.monthly?.toLocaleString()}<span className="text-sm text-gray-500 font-normal">/mo</span>
            </p>
            <div className="space-y-4 mb-6">
              {combo.speed && (
                <div className="flex items-center space-x-3">
                  <FiWifi className="w-5 h-5 text-primary-500" />
                  <span className="text-gray-700 dark:text-gray-300">Internet: {combo.speed} Mbps</span>
                </div>
              )}
              {combo.includes?.tv && (
                <div className="flex items-center space-x-3">
                  <FiTv className="w-5 h-5 text-secondary-500" />
                  <span className="text-gray-700 dark:text-gray-300">TV: 200+ Channels</span>
                </div>
              )}
              {combo.includes?.phone && (
                <div className="flex items-center space-x-3">
                  <FiPhone className="w-5 h-5 text-success-500" />
                  <span className="text-gray-700 dark:text-gray-300">Phone: Unlimited</span>
                </div>
              )}
            </div>
            {combo.includes?.ott && combo.includes.ott.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Included OTT:</p>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(combo.includes.ott) ? combo.includes.ott : [combo.includes.ott]).map((app, j) => (
                    <span key={j} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <ul className="space-y-2 mb-6">
              {combo.features?.slice(0, 4).map((f, j) => (
                <li key={j} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FiCheck className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/apply" className="block text-center py-3 gradient-bg text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
              Get This Plan
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
