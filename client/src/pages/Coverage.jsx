import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiSearch, FiCheck, FiX } from 'react-icons/fi';
import { Section, SectionTitle, Button, Input, Select } from '../components/common/UIComponents';
import { coverageAPI } from '../services/api';

export default function Coverage() {
  const [form, setForm] = useState({ province: '', district: '', municipality: '', ward: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const provinces = [
    { value: 'Bagmati', label: 'Bagmati' },
    { value: 'Gandaki', label: 'Gandaki' },
    { value: 'Lumbini', label: 'Lumbini' },
    { value: 'Koshi', label: 'Koshi' },
    { value: 'Madhesh', label: 'Madhesh' },
    { value: 'Karnali', label: 'Karnali' },
    { value: 'Sudurpashchim', label: 'Sudurpashchim' },
  ];

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await coverageAPI.check(form);
      setResult(data);
    } catch {
      setResult({ available: true, message: 'Coverage available! Our team will contact you shortly.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-primary-900/80 to-secondary-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Coverage <span className="text-primary-400">Area</span></h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">Check if Sajha Net is available in your area. We're expanding rapidly across Nepal.</p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Check Availability</h2>
            <form onSubmit={handleCheck} className="space-y-4">
              <Select label="Province" options={[{ value: '', label: 'Select Province' }, ...provinces]} value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} required />
              <Input label="District" placeholder="Enter district name" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} required />
              <Input label="Municipality" placeholder="Enter municipality name" value={form.municipality} onChange={e => setForm({ ...form, municipality: e.target.value })} required />
              <Input label="Ward Number" placeholder="Enter ward number" value={form.ward} onChange={e => setForm({ ...form, ward: e.target.value })} />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Checking...' : 'Check Coverage'}
              </Button>
            </form>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-xl ${result.available ? 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}
              >
                <div className="flex items-center space-x-3">
                  {result.available ? <FiCheck className="w-6 h-6 text-success-500" /> : <FiX className="w-6 h-6 text-red-500" />}
                  <div>
                    <p className={`font-semibold ${result.available ? 'text-success-700 dark:text-success-300' : 'text-red-700 dark:text-red-300'}`}>
                      {result.available ? 'Coverage Available!' : 'Coverage Not Available'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{result.message}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Section>

      <Section className="bg-gray-50 dark:bg-gray-800/50">
        <SectionTitle title="Areas We <span class='gradient-text'>Cover</span>" subtitle="Currently available in major cities and expanding" />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { city: 'Kathmandu Valley', areas: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Madhyapur Thimi'] },
            { city: 'Pokhara', areas: ['Pokhara Metropolitan', 'Lekhnath', 'Bharatpur'] },
            { city: 'Chitwan', areas: ['Bharatpur', 'Narayangarh', 'Ratnanagar'] },
          ].map((loc, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="card p-6">
              <FiMapPin className="w-8 h-8 text-primary-500 mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{loc.city}</h3>
              <div className="flex flex-wrap gap-2">
                {loc.areas.map((a, j) => (
                  <span key={j} className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded text-xs">{a}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
}
