import React, { useState, useEffect } from 'react';
import { FiSave, FiGlobe, FiMail, FiPhone, FiMapPin, FiImage, FiUsers, FiLink } from 'react-icons/fi';
import API from '../services/api';

export default function Settings() {
  const [settings, setSettings] = useState({
    companyName: 'Sajha Net Pvt. Ltd.',
    siteTagline: "Nepal's Most Reliable High-Speed Internet",
    heroTitle: 'नेपालको सबैभन्दा भरपर्दो हाई-स्पीड इन्टरनेट',
    heroSubtitle: 'Ultra Fast Fiber Internet | Reliable Connection | 24/7 Customer Support',
    contactPhone: '9705390890',
    contactEmail: 'sajhanet2025@gmail.com',
    contactAddress: 'Kathmandu, Nepal',
    facebook: 'https://facebook.com/sajhanet',
    instagram: 'https://instagram.com/sajhanet',
    linkedin: 'https://linkedin.com/company/sajhanet',
    youtube: 'https://youtube.com/sajhanet',
    logo: '',
    favicon: '',
    aboutText: "Sajha Net is Nepal's leading fiber internet provider.",
    copyrightText: '© 2026 Sajha Net. All rights reserved.',
    ctaTitle: 'Ready to Experience the Best Internet?',
    ctaSubtitle: 'Join thousands of happy customers. Get connected today.',
    ctaButtonText: 'Get Connected Now',
    ctaButtonUrl: '/apply',
    footerDescription: "Nepal's leading internet service provider offering high-speed fiber internet, IPTV, and enterprise solutions.",
    businessTitle: 'Business Internet Solutions',
    businessSubtitle: 'Enterprise-grade internet with dedicated bandwidth and SLA guarantees.',
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/settings').then(({ data }) => {
      if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
    }).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await API.put('/settings/bulk', { settings });
      alert('Settings saved successfully!');
    } catch { alert('Error saving settings'); } finally { setSaving(false); }
  };

  const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, name, type = 'text', textarea = false, placeholder = '' }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {textarea ? (
        <textarea value={settings[name] || ''} onChange={e => setSettings({ ...settings, [name]: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder={placeholder} />
      ) : (
        <input type={type} value={settings[name] || ''} onChange={e => setSettings({ ...settings, [name]: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={placeholder} />
      )}
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General', icon: FiGlobe },
    { id: 'hero', label: 'Hero Section', icon: FiImage },
    { id: 'contact', label: 'Contact', icon: FiPhone },
    { id: 'social', label: 'Social Media', icon: FiLink },
    { id: 'cta', label: 'Call to Action', icon: FiMail },
    { id: 'footer', label: 'Footer', icon: FiMapPin },
    { id: 'business', label: 'Business', icon: FiUsers },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Website Settings</h1>
        <button onClick={handleSubmit} disabled={saving} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50">
          <FiSave className="w-4 h-4" /><span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
            <tab.icon className="w-4 h-4" /><span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <Section title="General Settings" icon={FiGlobe}>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Company Name" name="companyName" placeholder="Sajha Net Pvt. Ltd." />
            <Field label="Site Tagline" name="siteTagline" placeholder="Nepal's Most Reliable Internet" />
          </div>
          <Field label="Logo URL" name="logo" placeholder="https://..." />
          <Field label="Favicon URL" name="favicon" placeholder="https://..." />
          <Field label="About Text" name="aboutText" textarea placeholder="About your company..." />
        </Section>
      )}

      {activeTab === 'hero' && (
        <Section title="Hero Section" icon={FiImage}>
          <Field label="Hero Title (Nepali)" name="heroTitle" placeholder="नेपालको सबैभन्दा भरपर्दो हाई-स्पीड इन्टरनेट" />
          <Field label="Hero Subtitle" name="heroSubtitle" placeholder="Ultra Fast Fiber Internet | Reliable Connection" />
        </Section>
      )}

      {activeTab === 'contact' && (
        <Section title="Contact Information" icon={FiPhone}>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Phone Number" name="contactPhone" placeholder="9705390890" />
            <Field label="Email Address" name="contactEmail" placeholder="sajhanet2025@gmail.com" />
          </div>
          <Field label="Office Address" name="contactAddress" placeholder="Kathmandu, Nepal" />
        </Section>
      )}

      {activeTab === 'social' && (
        <Section title="Social Media Links" icon={FiLink}>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Facebook URL" name="facebook" placeholder="https://facebook.com/..." />
            <Field label="Instagram URL" name="instagram" placeholder="https://instagram.com/..." />
            <Field label="LinkedIn URL" name="linkedin" placeholder="https://linkedin.com/..." />
            <Field label="YouTube URL" name="youtube" placeholder="https://youtube.com/..." />
          </div>
        </Section>
      )}

      {activeTab === 'cta' && (
        <Section title="Call to Action Section" icon={FiMail}>
          <Field label="CTA Title" name="ctaTitle" placeholder="Ready to Experience Ultra-Fast Internet?" />
          <Field label="CTA Subtitle" name="ctaSubtitle" placeholder="Join thousands of happy customers" />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Button Text" name="ctaButtonText" placeholder="Get Connected Now" />
            <Field label="Button URL" name="ctaButtonUrl" placeholder="/apply" />
          </div>
        </Section>
      )}

      {activeTab === 'footer' && (
        <Section title="Footer Settings" icon={FiMapPin}>
          <Field label="Footer Description" name="footerDescription" textarea placeholder="Description shown in footer..." />
          <Field label="Copyright Text" name="copyrightText" placeholder="© 2026 Sajha Net. All rights reserved." />
        </Section>
      )}

      {activeTab === 'business' && (
        <Section title="Business Section" icon={FiUsers}>
          <Field label="Business Section Title" name="businessTitle" placeholder="Business Internet Solutions" />
          <Field label="Business Section Subtitle" name="businessSubtitle" placeholder="Enterprise-grade internet with dedicated bandwidth" />
        </Section>
      )}
    </div>
  );
}
