import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGrid, FiFileText, FiCreditCard, FiLogOut, FiUser, FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { Button } from '../components/common/UIComponents';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function CustomerPortal() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      API.get('/portal/subscription').then(({ data }) => {
        setSubscription(data.subscription);
        setPayments(data.payments || []);
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please login to access your portal</h2>
          <Button to="/login">Login</Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'bills', label: 'Bills', icon: FiFileText },
    { id: 'usage', label: 'Usage', icon: FiCreditCard },
    { id: 'profile', label: 'Profile', icon: FiUser },
  ];

  const sub = subscription || {};
  const pkg = sub.package;
  const expiry = sub.expiryDate ? new Date(sub.expiryDate) : null;
  const expiryStr = expiry ? expiry.toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64">
            <div className="card p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiUser className="w-8 h-8 text-white" />
                </div>
                <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id ? 'gradient-bg text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
                <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h2>

                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="card p-5">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Plan</p>
                    <p className="text-xl font-bold text-primary-500">{pkg ? pkg.name : 'No Plan'}</p>
                    {pkg && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{pkg.speed} Mbps</p>}
                  </div>
                  <div className="card p-5">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment Status</p>
                    {loading ? (
                      <p className="text-sm text-gray-400">Loading...</p>
                    ) : sub.paymentStatus === 'paid' ? (
                      <p className="text-xl font-bold text-green-500 flex items-center gap-1"><FiCheckCircle /> Paid</p>
                    ) : (
                      <p className="text-xl font-bold text-red-500 flex items-center gap-1"><FiAlertTriangle /> Unpaid</p>
                    )}
                    {sub.paymentMethod && <p className="text-xs text-gray-400 mt-1 capitalize">via {sub.paymentMethod}</p>}
                  </div>
                  <div className="card p-5">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                    {loading ? (
                      <p className="text-sm text-gray-400">Loading...</p>
                    ) : (
                      <p className="text-xl font-bold text-blue-500 capitalize">{sub.duration || 'N/A'}</p>
                    )}
                    {sub.paidAt && <p className="text-xs text-gray-400 mt-1">Paid {new Date(sub.paidAt).toLocaleDateString()}</p>}
                  </div>
                  <div className="card p-5">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Expiry Date</p>
                    {loading ? (
                      <p className="text-sm text-gray-400">Loading...</p>
                    ) : sub.isExpired ? (
                      <p className="text-xl font-bold text-red-500 flex items-center gap-1"><FiAlertTriangle /> Expired</p>
                    ) : (
                      <p className="text-xl font-bold text-success-500 flex items-center gap-1"><FiClock /> {expiryStr}</p>
                    )}
                    {!loading && !sub.isExpired && sub.daysRemaining > 0 && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub.daysRemaining} days left</p>
                    )}
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Connection Details</h3>
                  {loading ? (
                    <p className="text-gray-400">Loading...</p>
                  ) : sub.package ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Package</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{pkg?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Speed</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{pkg?.speed || 'N/A'} Mbps</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Duration</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{sub.duration || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Payment Method</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{sub.paymentMethod || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</span>
                        <span className={`text-sm font-medium ${sub.isExpired ? 'text-red-500' : 'text-green-500'}`}>{expiryStr}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${sub.isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {sub.isExpired ? 'Expired' : 'Active'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No active subscription found. Apply for a connection to get started!</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'bills' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bills & Invoices</h2>
                <div className="card overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Package</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {loading ? (
                        <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
                      ) : payments.length === 0 ? (
                        <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No payment records found</td></tr>
                      ) : payments.map((b, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{b.date ? new Date(b.date).toLocaleDateString() : 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{b.package}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white capitalize">{b.duration || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">Rs. {b.amount?.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white capitalize">{b.method}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{b.invoice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'usage' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Usage Statistics</h2>
                <div className="card p-6">
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Usage tracking will be available soon.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Your plan includes unlimited data with no caps.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
                <div className="card p-6">
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label><input defaultValue={user.name} className="input-field" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input defaultValue={user.email} className="input-field" disabled /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label><input defaultValue={user.phone || ''} className="input-field" /></div>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
