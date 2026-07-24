import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiFileText, FiCreditCard, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import { Section, Button } from '../components/common/UIComponents';
import { useAuth } from '../context/AuthContext';

export default function CustomerPortal() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

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
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  {[
                    { label: 'Current Plan', value: '100 Mbps', color: 'text-primary-500' },
                    { label: 'Status', value: 'Active', color: 'text-success-500' },
                    { label: 'Next Bill', value: 'Rs. 1,199', color: 'text-secondary-500' },
                  ].map((s, i) => (
                    <div key={i} className="card p-6">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="card p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {['Bill paid - Rs. 1,199', 'Connection installed', 'Account created'].map((a, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{a}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2 days ago</span>
                      </div>
                    ))}
                  </div>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {[
                        { date: '2026-01-15', amount: 'Rs. 1,199', status: 'Paid' },
                        { date: '2025-12-15', amount: 'Rs. 1,199', status: 'Paid' },
                        { date: '2025-11-15', amount: 'Rs. 1,199', status: 'Paid' },
                      ].map((b, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{b.date}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{b.amount}</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 rounded-full text-xs">{b.status}</span></td>
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
