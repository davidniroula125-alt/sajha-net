import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHelpCircle, FiMessageSquare, FiDownload, FiActivity, FiChevronDown, FiChevronUp, FiAlertCircle, FiSend, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';
import { Section, SectionTitle, Button, Input, Select, Textarea } from '../components/common/UIComponents';
import { faqAPI, complaintAPI, authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Support() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [activeTab, setActiveTab] = useState('faq');
  const [user, setUser] = useState(null);
  const [myComplaints, setMyComplaints] = useState([]);
  const [complaintForm, setComplaintForm] = useState({ name: '', email: '', phone: '', subject: '', category: 'slow_speed', description: '', connectionId: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    faqAPI.getAll().then(({ data }) => setFaqs(data.faqs || [])).catch(() => setFaqs([]));
    authAPI.getMe().then(({ data }) => {
      setUser(data.user);
      setComplaintForm(prev => ({ ...prev, name: data.user.name || '', email: data.user.email || '', phone: data.user.phone || '' }));
      loadMyComplaints();
    }).catch(() => {});
  }, []);

  const loadMyComplaints = () => {
    complaintAPI.getUserComplaints().then(({ data }) => setMyComplaints(data.complaints || [])).catch(() => {});
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await complaintAPI.create(complaintForm);
      addToast('Complaint submitted successfully! We will address it shortly.', 'success');
      setComplaintForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', subject: '', category: 'slow_speed', description: '', connectionId: '', address: '' });
      loadMyComplaints();
    } catch {
      addToast('Failed to submit complaint. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 'faq', label: 'FAQs', icon: FiHelpCircle },
    { id: 'complaint', label: 'File Complaint', icon: FiAlertCircle },
    { id: 'my-complaints', label: 'My Complaints', icon: FiMessageSquare },
    { id: 'troubleshoot', label: 'Troubleshooting', icon: FiActivity },
    { id: 'downloads', label: 'Downloads', icon: FiDownload },
  ];

  const categories = [
    { value: 'slow_speed', label: 'Slow Speed' },
    { value: 'no_internet', label: 'No Internet' },
    { value: 'frequent_disconnect', label: 'Frequent Disconnections' },
    { value: 'billing', label: 'Billing Issue' },
    { value: 'installation', label: 'Installation Problem' },
    { value: 'router_issue', label: 'Router Issue' },
    { value: 'other', label: 'Other' },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-500',
  };

  const statusIcons = {
    pending: FiClock,
    in_progress: FiAlertTriangle,
    resolved: FiCheckCircle,
    closed: FiCheckCircle,
  };

  return (
    <div className="pt-24 pb-16">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-primary-900/80 to-secondary-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Support <span className="text-primary-400">Center</span></h1>
            <p className="text-xl text-white/70">We're here to help. Find answers, file complaints, or contact our support team.</p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex-wrap justify-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'gradient-bg text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={faq._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card overflow-hidden">
                <button onClick={() => setOpenId(openId === faq._id ? null : faq._id)} className="w-full px-6 py-4 flex items-center justify-between text-left">
                  <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                  {openId === faq._id ? <FiChevronUp className="w-5 h-5 text-gray-500" /> : <FiChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                <AnimatePresence>
                  {openId === faq._id && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <p className="px-6 pb-4 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            {faqs.length === 0 && <p className="text-center text-gray-400 py-8">No FAQs available</p>}
          </div>
        )}

        {activeTab === 'complaint' && (
          <div className="max-w-2xl mx-auto">
            <div className="card p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
                  <FiAlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">File a Complaint</h2>
                  <p className="text-sm text-gray-500">Report internet issues or service problems</p>
                </div>
              </div>
              <form onSubmit={handleComplaintSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Full Name" value={complaintForm.name} onChange={e => setComplaintForm({ ...complaintForm, name: e.target.value })} required />
                  <Input label="Email" type="email" value={complaintForm.email} onChange={e => setComplaintForm({ ...complaintForm, email: e.target.value })} required />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Phone" value={complaintForm.phone} onChange={e => setComplaintForm({ ...complaintForm, phone: e.target.value })} />
                  <Input label="Connection ID (if any)" value={complaintForm.connectionId} onChange={e => setComplaintForm({ ...complaintForm, connectionId: e.target.value })} placeholder="e.g. SN-12345" />
                </div>
                <Input label="Subject" value={complaintForm.subject} onChange={e => setComplaintForm({ ...complaintForm, subject: e.target.value })} placeholder="Brief description of the issue" required />
                <div className="grid md:grid-cols-2 gap-4">
                  <Select label="Category" options={categories} value={complaintForm.category} onChange={e => setComplaintForm({ ...complaintForm, category: e.target.value })} />
                  <Input label="Address" value={complaintForm.address} onChange={e => setComplaintForm({ ...complaintForm, address: e.target.value })} placeholder="Your location" />
                </div>
                <Textarea label="Describe Your Issue" value={complaintForm.description} onChange={e => setComplaintForm({ ...complaintForm, description: e.target.value })} rows={4} placeholder="Please provide details about the problem you're experiencing..." required />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'my-complaints' && (
          <div className="max-w-3xl mx-auto">
            {!user ? (
              <div className="card p-12 text-center">
                <FiAlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Login Required</h3>
                <p className="text-gray-500 mb-4">Please login to view your complaints</p>
                <Button to="/login">Login</Button>
              </div>
            ) : myComplaints.length === 0 ? (
              <div className="card p-12 text-center">
                <FiCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Complaints Yet</h3>
                <p className="text-gray-500">You haven't filed any complaints. That's great!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myComplaints.map((c, i) => {
                  const StatusIcon = statusIcons[c.status] || FiClock;
                  return (
                    <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{c.subject}</h3>
                          <p className="text-xs text-gray-400">#{c._id.slice(-6).toUpperCase()} • {new Date(c.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span className="capitalize">{c.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{c.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span className="capitalize">Category: {c.category.replace('_', ' ')}</span>
                        {c.connectionId && <span>ID: {c.connectionId}</span>}
                      </div>
                      {c.adminReply && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                          <p className="text-xs font-medium text-blue-600 mb-1">Admin Reply:</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{c.adminReply}</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'troubleshoot' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { title: 'Restart Your Router', desc: 'Unplug your router, wait 30 seconds, and plug it back in. This resolves most connectivity issues.' },
              { title: 'Check Cables', desc: 'Ensure all Ethernet cables are properly connected and not damaged.' },
              { title: 'Check WiFi Signal', desc: 'Move closer to the router or check for interference from other devices.' },
              { title: 'Run Speed Test', desc: 'Test your speed at speedtest.net and compare with your plan speed.' },
              { title: 'Reset Network Settings', desc: 'On your device, forget the WiFi network and reconnect with the password.' },
              { title: 'Check for Outages', desc: 'Visit our website or call 9705390890 to check for planned maintenance.' },
            ].map((tip, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{tip.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{tip.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'downloads' && (
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-8">Download our apps and tools</p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: 'Sajha Net App', desc: 'Manage your account on the go', platform: 'Android & iOS' },
                { name: 'Speed Test Tool', desc: 'Test your internet speed', platform: 'Windows & Mac' },
              ].map((app, i) => (
                <div key={i} className="card p-6 text-center">
                  <FiDownload className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 dark:text-white">{app.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{app.desc}</p>
                  <p className="text-xs text-gray-400 mb-4">{app.platform}</p>
                  <Button variant="secondary" size="sm">Download</Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
