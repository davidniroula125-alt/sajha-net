import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBriefcase, FiShield, FiCloud, FiWifi, FiGlobe, FiServer, FiCheck } from 'react-icons/fi';
import { Section, SectionTitle, Button } from '../components/common/UIComponents';
import { packageAPI, serviceAPI } from '../services/api';

export default function Business() {
  const [plans, setPlans] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    packageAPI.getAll({ type: 'business' }).then(({ data }) => {
      const bizPkgs = (data.packages || []).filter(p => p.type === 'business' || p.type === 'enterprise');
      setPlans(bizPkgs);
    }).catch(() => setPlans([]));

    serviceAPI.getAll().then(({ data }) => {
      const bizServices = (data.services || []).filter(s => s.category === 'business' || s.category === 'enterprise');
      setServices(bizServices);
    }).catch(() => setServices([]));
  }, []);

  const iconMap = { FaBriefcase: FiBriefcase, FaShield: FiShield, FaCloud: FiCloud, FaWifi: FiWifi, FaGlobe: FiGlobe, FaServer: FiServer, FaVideo: FiServer, FaNetworkWired: FiServer, FaHeadphones: FiServer, FaDesktop: FiServer, FaTv: FiServer, FaHome: FiServer };

  return (
    <div className="pt-24 pb-16">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-primary-900/80 to-secondary-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Business <span className="text-primary-400">Internet</span> Solutions</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">Enterprise-grade internet with dedicated bandwidth, SLA guarantees, and 24/7 priority support for your business.</p>
          </motion.div>
        </div>
      </section>

      <Section>
        <SectionTitle title="Business <span class='gradient-text'>Plans</span>" subtitle="Dedicated internet solutions for businesses of all sizes" />
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`card p-8 ${plan.isPopular ? 'ring-2 ring-primary-500 relative' : ''}`}
            >
              {plan.isPopular && <span className="absolute top-4 right-4 gradient-bg text-white text-xs font-bold px-3 py-1 rounded-full">Recommended</span>}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-primary-500 font-semibold mb-4">{plan.speed} Mbps Dedicated</p>
              <p className="text-3xl font-bold gradient-text mb-6">Rs. {plan.price?.monthly?.toLocaleString()}<span className="text-sm text-gray-500 font-normal">/mo</span></p>
              <ul className="space-y-3 mb-8">
                {plan.features?.map((f, j) => (
                  <li key={j} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FiCheck className="w-4 h-4 text-success-500 mr-3 flex-shrink-0" /> {f}
                  </li>
                ))}
                {plan.includes?.router && <li className="flex items-center text-sm text-gray-600 dark:text-gray-400"><FiCheck className="w-4 h-4 text-success-500 mr-3" /> Free Router</li>}
                {plan.includes?.mesh && <li className="flex items-center text-sm text-gray-600 dark:text-gray-400"><FiCheck className="w-4 h-4 text-success-500 mr-3" /> Mesh WiFi</li>}
                {plan.includes?.phone && <li className="flex items-center text-sm text-gray-600 dark:text-gray-400"><FiCheck className="w-4 h-4 text-success-500 mr-3" /> Telephone</li>}
              </ul>
              <Link to="/contact" className="block text-center py-3 gradient-bg text-white rounded-xl font-semibold hover:shadow-lg transition-all">Contact Sales</Link>
            </motion.div>
          ))}
          {plans.length === 0 && <div className="col-span-3 py-12 text-center text-gray-400 dark:text-gray-500">No business plans available yet.</div>}
        </div>
      </Section>

      <Section className="bg-gray-50 dark:bg-gray-800/50">
        <SectionTitle title="Enterprise <span class='gradient-text'>Services</span>" subtitle="Comprehensive solutions for your business" />
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] || FiBriefcase;
            return (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <Icon className="w-10 h-10 text-primary-500 mb-4" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{s.shortDescription}</p>
              </motion.div>
            );
          })}
          {services.length === 0 && <div className="col-span-3 py-12 text-center text-gray-400 dark:text-gray-500">No services available yet.</div>}
        </div>
      </Section>

      <Section>
        <div className="gradient-bg rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">Contact our enterprise team for custom packages tailored to your business needs.</p>
          <Button to="/contact" className="bg-white text-gray-900 hover:bg-gray-100">Contact Enterprise Sales</Button>
        </div>
      </Section>
    </div>
  );
}
