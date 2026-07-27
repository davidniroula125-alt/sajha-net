import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHelpCircle, FiMessageSquare, FiDownload, FiActivity, FiChevronDown, FiChevronUp, FiAlertCircle, FiSend, FiCheckCircle, FiClock, FiAlertTriangle, FiThumbsUp, FiStar } from 'react-icons/fi';
import { Section, Button, Input, Select, Textarea } from '../components/common/UIComponents';
import { faqAPI, complaintAPI, feedbackAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Support() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [activeTab, setActiveTab] = useState('faq');
  const { user } = useAuth();
  const [myComplaints, setMyComplaints] = useState([]);
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [complaintForm, setComplaintForm] = useState({ name: '', email: '', phone: '', subject: '', category: 'slow_speed', description: '', connectionId: '', address: '' });
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', phone: '', type: 'suggestion', subject: '', rating: 5, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    faqAPI.getAll().then(({ data }) => setFaqs(data.faqs || [])).catch(() => setFaqs([]));
    if (user) {
      setComplaintForm(prev => ({ ...prev, name: user.name || '', email: user.email || '', phone: user.phone || '' }));
      setFeedbackForm(prev => ({ ...prev, name: user.name || '', email: user.email || '', phone: user.phone || '' }));
      loadMyComplaints();
      loadMyFeedbacks();
    }
  }, [user]);

  const loadMyComplaints = () => {
    complaintAPI.getUserComplaints().then(({ data }) => setMyComplaints(data.complaints || [])).catch(() => {});
  };

  const loadMyFeedbacks = () => {
    feedbackAPI.getUserFeedbacks().then(({ data }) => setMyFeedbacks(data.feedbacks || [])).catch(() => {});
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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await feedbackAPI.create(feedbackForm);
      addToast('Feedback submitted successfully! Thank you for your input.', 'success');
      setFeedbackForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', type: 'suggestion', subject: '', rating: 5, message: '' });
      loadMyFeedbacks();
    } catch {
      addToast('Failed to submit feedback. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 'faq', label: 'FAQs', icon: FiHelpCircle, public: true },
    { id: 'complaint', label: 'File Complaint', icon: FiAlertCircle, public: false },
    { id: 'feedback', label: 'Feedback', icon: FiThumbsUp, public: false },
    { id: 'my-complaints', label: 'My Complaints', icon: FiMessageSquare, public: false },
    { id: 'troubleshoot', label: 'Troubleshooting', icon: FiActivity, public: true },
    { id: 'downloads', label: 'Downloads', icon: FiDownload, public: true },
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

  const feedbackTypes = [
    { value: 'suggestion', label: 'Suggestion' },
    { value: 'compliment', label: 'Compliment' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'general', label: 'General Feedback' },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    closed: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  };

  const statusIcons = {
    pending: FiClock,
    in_progress: FiAlertTriangle,
    resolved: FiCheckCircle,
    closed: FiCheckCircle,
  };

  const LoginPrompt = ({ title, description }) => (
    <div className="card p-12 text-center max-w-lg mx-auto">
      <FiAlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{description}</p>
      <div className="flex justify-center gap-3">
        <Button to="/login">Login</Button>
        <Button to="/register" variant="secondary">Sign Up</Button>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-16">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-primary-900/80 to-secondary-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Support <span className="text-primary-400">Center</span></h1>
            <p className="text-xl text-white/70">We're here to help. Find answers, file complaints, or share your feedback.</p>
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
                  {openId === faq._id ? <FiChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" /> : <FiChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
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
            {faqs.length === 0 && <p className="text-center text-gray-400 dark:text-gray-500 py-8">No FAQs available</p>}
          </div>
        )}

        {activeTab === 'complaint' && (
          <div className="max-w-2xl mx-auto">
            {!user ? (
              <LoginPrompt title="Login Required" description="Please login or create an account to file a complaint." />
            ) : (
              <div className="card p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
                    <FiAlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">File a Complaint</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Report internet issues or service problems</p>
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
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="max-w-2xl mx-auto">
            {!user ? (
              <LoginPrompt title="Login Required" description="Please login or create an account to submit feedback." />
            ) : (
              <div className="card p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
                    <FiThumbsUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Share Your Feedback</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Help us improve our services</p>
                  </div>
                </div>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Full Name" value={feedbackForm.name} onChange={e => setFeedbackForm({ ...feedbackForm, name: e.target.value })} required />
                    <Input label="Email" type="email" value={feedbackForm.email} onChange={e => setFeedbackForm({ ...feedbackForm, email: e.target.value })} required />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Phone" value={feedbackForm.phone} onChange={e => setFeedbackForm({ ...feedbackForm, phone: e.target.value })} />
                    <Select label="Feedback Type" options={feedbackTypes} value={feedbackForm.type} onChange={e => setFeedbackForm({ ...feedbackForm, type: e.target.value })} />
                  </div>
                  <Input label="Subject" value={feedbackForm.subject} onChange={e => setFeedbackForm({ ...feedbackForm, subject: e.target.value })} placeholder="What is your feedback about?" required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                          className="p-1"
                        >
                          <FiStar className={`w-6 h-6 ${star <= feedbackForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{feedbackForm.rating}/5</span>
                    </div>
                  </div>
                  <Textarea label="Your Feedback" value={feedbackForm.message} onChange={e => setFeedbackForm({ ...feedbackForm, message: e.target.value })} rows={4} placeholder="Tell us what you think about our service..." required />
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </form>

                {myFeedbacks.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Your Previous Feedback</h3>
                    <div className="space-y-3">
                      {myFeedbacks.map((f, i) => (
                        <div key={f._id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900 dark:text-white text-sm">{f.subject}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(s => (
                                <FiStar key={s} className={`w-3 h-3 ${s <= f.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(f.createdAt).toLocaleDateString()} • <span className="capitalize">{f.type}</span></p>
                          {f.adminReply && (
                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="text-xs font-medium text-blue-600 mb-1">Reply:</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{f.adminReply}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-complaints' && (
          <div className="max-w-3xl mx-auto">
            {!user ? (
              <LoginPrompt title="Login Required" description="Please login to view your complaints." />
            ) : myComplaints.length === 0 ? (
              <div className="card p-12 text-center">
                <FiCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Complaints Yet</h3>
                <p className="text-gray-500 dark:text-gray-400">You haven't filed any complaints. That's great!</p>
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
                          <p className="text-xs text-gray-400 dark:text-gray-500">{c.ticketId || '#' + c._id.slice(-6).toUpperCase()} • {new Date(c.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span className="capitalize">{c.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{c.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
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
              { title: 'Run Speed Test', desc: 'Use our speed test tool to check your connection speed and compare with your plan speed.' },
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
                { name: 'Speed Test Tool', desc: 'Test your internet speed', platform: 'Windows & Mac', link: '/speed-test' },
              ].map((app, i) => (
                <div key={i} className="card p-6 text-center">
                  <FiDownload className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 dark:text-white">{app.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{app.desc}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{app.platform}</p>
                  <Button variant="secondary" size="sm" to={app.link || '#'}>{app.link ? 'Click Here' : 'Download'}</Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
