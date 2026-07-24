import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Section, SectionTitle, Button, Input, Select, Textarea } from '../components/common/UIComponents';
import { useToast } from '../context/ToastContext';
import { applicationAPI, packageAPI } from '../services/api';

export default function Apply() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', province: '', district: '', municipality: '', ward: '', address: '', landmark: '', package: '', preferredDate: '', notes: ''
  });

  useEffect(() => {
    packageAPI.getAll().then(({ data }) => {
      setPackages(data.packages || []);
    }).catch(() => setPackages([]));
  }, []);

  const getPriceDisplay = (pkg) => {
    const cycle = pkg.billingCycle || 'yearly';
    const suffix = cycle === 'monthly' ? '/mo' : cycle === 'quarterly' ? '/3mo' : cycle === 'halfYearly' ? '/6mo' : '/yr';
    return `Rs. ${(pkg.price || 0).toLocaleString()}${suffix}`;
  };

  const provinces = [
    { value: 'Bagmati', label: 'Bagmati' }, { value: 'Gandaki', label: 'Gandaki' }, { value: 'Lumbini', label: 'Lumbini' },
    { value: 'Koshi', label: 'Koshi' }, { value: 'Madhesh', label: 'Madhesh' }, { value: 'Karnali', label: 'Karnali' }, { value: 'Sudurpashchim', label: 'Sudurpashchim' },
  ];

  const packageOptions = [
    { value: '', label: 'Select Package' },
    ...packages.map(p => ({ value: p._id, label: `${p.name} - ${getPriceDisplay(p)}` }))
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await applicationAPI.create(form);
      addToast('Application submitted successfully! We will contact you soon.', 'success');
      setForm({ fullName: '', phone: '', email: '', province: '', district: '', municipality: '', ward: '', address: '', landmark: '', package: '', preferredDate: '', notes: '' });
    } catch {
      addToast('Failed to submit application. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-primary-900/80 to-secondary-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Apply for <span className="text-primary-400">Connection</span></h1>
            <p className="text-xl text-white/70">Fill out the form below and our team will contact you within 24 hours.</p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="Enter your full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
                <Input label="Phone" placeholder="Enter phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <Input label="Email" type="email" placeholder="Enter email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />

              <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">Address</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Select label="Province" options={[{ value: '', label: 'Select Province' }, ...provinces]} value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} required />
                <Input label="District" placeholder="Enter district" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Municipality" placeholder="Enter municipality" value={form.municipality} onChange={e => setForm({ ...form, municipality: e.target.value })} required />
                <Input label="Ward" placeholder="Enter ward number" value={form.ward} onChange={e => setForm({ ...form, ward: e.target.value })} required />
              </div>
              <Input label="Street Address" placeholder="Enter street address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              <Input label="Nearest Landmark" placeholder="Enter nearest landmark" value={form.landmark} onChange={e => setForm({ ...form, landmark: e.target.value })} />

              <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">Package Selection</h2>
              <Select label="Preferred Package" options={packageOptions} value={form.package} onChange={e => setForm({ ...form, package: e.target.value })} required />
              <Input label="Preferred Installation Date" type="date" value={form.preferredDate} onChange={e => setForm({ ...form, preferredDate: e.target.value })} />
              <Textarea label="Additional Notes" placeholder="Any special requirements or notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />

              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</Button>
            </form>
          </div>
        </div>
      </Section>
    </div>
  );
}
