import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiCheck, FiArrowRight } from 'react-icons/fi';
import { Section, SectionTitle } from '../../components/common/UIComponents';
import { coverageAPI } from '../../services/api';

export default function CoverageSection() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coverageAPI.getAll().then(({ data }) => {
      const coverageData = data.coverages || data || [];
      setAreas(coverageData.slice(0, 6));
    }).catch(() => setAreas([])).finally(() => setLoading(false));
  }, []);

  const districts = [...new Set(areas.map(a => a.district))];
  const displayAreas = districts.length > 0 ? districts : ['Itahari', 'Dharan', 'Biratnagar', 'Inaruwa'];

  return (
    <Section className="bg-gray-50 dark:bg-gray-800/50">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Growing <span className="gradient-text">Coverage</span> Across Nepal
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            We're expanding rapidly across all provinces. Check if Sajha Net is available in your area.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {displayAreas.map((area, i) => (
              <div key={i} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <FiCheck className="w-5 h-5 text-success-500" />
                <span>{area}</span>
              </div>
            ))}
          </div>
          <Link to="/coverage" className="btn-primary inline-flex items-center space-x-2">
            <span>Check Coverage</span>
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="card p-8"
        >
          <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-8 gap-1 p-4 opacity-20">
              {[...Array(64)].map((_, i) => (
                <div key={i} className="bg-primary-500 rounded-sm" style={{ opacity: Math.random() > 0.5 ? 1 : 0.3 }} />
              ))}
            </div>
            <div className="text-center z-10">
              <FiMapPin className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{districts.length || '50+'}</p>
              <p className="text-gray-600 dark:text-gray-400">{districts.length > 0 ? 'Districts Covered' : 'Cities Covered'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
