import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBriefcase, FiShield, FiCloud, FiWifi, FiArrowRight } from 'react-icons/fi';
import { Section, SectionTitle } from '../../components/common/UIComponents';
import { packageAPI } from '../../services/api';

export default function BusinessSection() {
  const formatPrice = (amount, cycle) => {
    const suffix = { monthly: '/mo', quarterly: '/3mo', halfYearly: '/6mo', yearly: '/yr' };
    return `Rs. ${amount.toLocaleString()}${suffix[cycle] || '/yr'}`;
  };
  const getYearlyPrice = (pkg) => pkg.prices?.yearly || pkg.price || 0;

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    packageAPI.getAll({ type: 'business' }).then(({ data }) => {
      const bizPkgs = (data.packages || []).filter(p => p.type === 'business' || p.type === 'enterprise');
      setPlans(bizPkgs.slice(0, 4));
    }).catch(() => setPlans([]));
  }, []);

  return (
    <Section>
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Business <span className="gradient-text">Internet</span> Solutions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Enterprise-grade internet with dedicated bandwidth, SLA guarantees, and 24/7 priority support.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { icon: FiShield, label: 'SLA Guarantee' },
              { icon: FiCloud, label: 'Cloud Ready' },
              { icon: FiBriefcase, label: 'Enterprise Support' },
              { icon: FiWifi, label: 'Managed WiFi' },
            ].map((f, i) => (
              <div key={i} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <f.icon className="w-5 h-5 text-primary-500" />
                <span className="text-sm">{f.label}</span>
              </div>
            ))}
          </div>
          <Link to="/business" className="btn-primary inline-flex items-center space-x-2">
            <span>Explore Business Plans</span>
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {plans.length > 0 ? plans.map((plan, i) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card p-5 text-center"
            >
              <p className="text-xs text-primary-500 font-medium uppercase">{plan.name}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{plan.speed} Mbps</p>
              <p className="text-sm text-gray-500 mt-1">{formatPrice(getYearlyPrice(plan), 'yearly')}</p>
            </motion.div>
          )) : (
            <>
{[
              { speed: '100 Mbps', prices: { yearly: 7500 }, label: 'Starter' },
              { speed: '300 Mbps', prices: { yearly: 15000 }, label: 'Professional' },
              { speed: '600 Mbps', prices: { yearly: 25000 }, label: 'Enterprise' },
              { speed: '1 Gbps', prices: { yearly: 45000 }, label: 'Dedicated' },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card p-5 text-center"
              >
                <p className="text-xs text-primary-500 font-medium uppercase">{plan.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{plan.speed}</p>
                <p className="text-sm text-gray-500 mt-1">{formatPrice(plan.prices.yearly, 'yearly')}</p>
              </motion.div>
            ))}
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
