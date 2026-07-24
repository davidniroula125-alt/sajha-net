import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiTrendingUp, FiUsers, FiAward, FiCheck, FiMail, FiLinkedin } from 'react-icons/fi';
import { Section, SectionTitle } from '../components/common/UIComponents';
import API from '../services/api';

export default function About() {
  const [team, setTeam] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    API.get('/cms/team').then(({ data }) => setTeam(data.members || [])).catch(() => setTeam([]));
    API.get('/settings').then(({ data }) => setSettings(data.settings || {})).catch(() => setSettings({}));
  }, []);

  const stats = [
    { icon: FiUsers, value: '50,000+', label: 'Happy Customers' },
    { icon: FiTrendingUp, value: '50+', label: 'Cities Covered' },
    { icon: FiShield, value: '99.9%', label: 'Uptime Guarantee' },
    { icon: FiAward, value: '10+', label: 'Years Experience' },
  ];

  return (
    <div className="pt-24 pb-16">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-primary-900/80 to-secondary-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About <span className="text-primary-400">Sajha Net</span></h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">{settings.aboutText || "Nepal's trusted internet service provider, connecting communities with reliable fiber technology."}</p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Founded with a vision to bridge Nepal's digital divide, Sajha Net has grown from a small local ISP to one of Nepal's leading internet service providers.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We believe every Nepali deserves access to fast, reliable, and affordable internet. Our fiber optic network spans across major cities and we're continuously expanding to reach more communities.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              With state-of-the-art infrastructure, dedicated support team, and commitment to quality, we're not just providing internet — we're connecting Nepal's future.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="card p-6 text-center">
                <s.icon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                <p className="text-2xl font-bold gradient-text">{s.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-gray-50 dark:bg-gray-800/50">
        <SectionTitle title="Our <span class='gradient-text'>Mission</span>" />
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { title: 'Connect Nepal', desc: 'Bring high-speed internet to every corner of Nepal through fiber optic technology.' },
            { title: 'Affordable Access', desc: 'Provide world-class internet services at prices accessible to all Nepalis.' },
            { title: 'Customer First', desc: 'Put our customers at the heart of everything we do, ensuring satisfaction and trust.' },
          ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="card p-8 text-center">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{m.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {team.length > 0 && (
        <Section>
          <SectionTitle title="Our <span class='gradient-text'>Team</span>" subtitle="Meet the people behind Sajha Net" />
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center"
              >
                <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {member.name?.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-primary-500 font-medium text-sm mb-2">{member.position}</p>
                {member.department && <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">{member.department}</p>}
                {member.bio && <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{member.bio}</p>}
                <div className="flex justify-center space-x-3">
                  {member.email && <a href={`mailto:${member.email}`} className="text-gray-400 dark:text-gray-500 hover:text-primary-500"><FiMail className="w-4 h-4" /></a>}
                  {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-primary-500"><FiLinkedin className="w-4 h-4" /></a>}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
