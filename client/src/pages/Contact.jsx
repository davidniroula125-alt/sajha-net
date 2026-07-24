import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import { Section, SectionTitle, Button, Input, Textarea } from '../components/common/UIComponents';
import { useToast } from '../context/ToastContext';
import API from '../services/api';

export default function Contact() {
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/applications', { ...form, fullName: form.name, address: {} });
      addToast('Message sent successfully!', 'success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      addToast('Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-primary-900/80 to-secondary-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact <span className="text-primary-400">Us</span></h1>
            <p className="text-xl text-white/70">Get in touch with our team. We're here to help.</p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            {[
              { icon: FiPhone, title: 'Get Connected', info: '9705390890', sub: '24/7 Support' },
              { icon: FiPhone, title: 'Office', info: '9709110186', sub: 'Mon-Sat 9AM-6PM' },
              { icon: FiPhone, title: 'Technical', info: '970910187', sub: 'Technical Support' },
              { icon: FiMail, title: 'Email', info: 'sajhanet2025@gmail.com', sub: '24/7 Response' },
              { icon: FiMapPin, title: 'Office', info: 'Kathmandu, Nepal', sub: 'Visit us anytime' },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="card p-6">
                <c.icon className="w-8 h-8 text-primary-500 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white">{c.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{c.info}</p>
                <p className="text-sm text-gray-500">{c.sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Name" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  <Input label="Email" type="email" placeholder="Your email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Phone" placeholder="Your phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  <Input label="Subject" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
                </div>
                <Textarea label="Message" placeholder="Your message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                <Button type="submit" disabled={loading} className="w-full">
                  <FiSend className="w-5 h-5 mr-2" />{loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
