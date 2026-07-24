import React, { useState, useEffect } from 'react';
import { FiUsers, FiFileText, FiPackage, FiMessageSquare, FiMessageCircle, FiTrendingUp, FiCheck, FiClock } from 'react-icons/fi';
import API from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/admin/dashboard').then(({ data }) => setStats(data)).catch(() => {
      setStats({
        stats: { totalUsers: 1250, totalApplications: 89, pendingApplications: 12, installedApplications: 77, totalTickets: 34, openTickets: 8, totalPackages: 7, totalBlogs: 15, totalChats: 56 },
        recentApplications: [], recentTickets: []
      });
    });
  }, []);

  if (!stats) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" /></div>;

  const cards = [
    { icon: FiUsers, label: 'Total Customers', value: stats.stats.totalUsers, color: 'bg-blue-500', change: '+12%' },
    { icon: FiFileText, label: 'Applications', value: stats.stats.totalApplications, color: 'bg-purple-500', change: '+8%' },
    { icon: FiClock, label: 'Pending', value: stats.stats.pendingApplications, color: 'bg-yellow-500', change: '-5%' },
    { icon: FiCheck, label: 'Installed', value: stats.stats.installedApplications, color: 'bg-green-500', change: '+15%' },
    { icon: FiMessageCircle, label: 'Open Tickets', value: stats.stats.openTickets, color: 'bg-red-500', change: '+3%' },
    { icon: FiMessageSquare, label: 'Chats', value: stats.stats.totalChats, color: 'bg-indigo-500', change: '+20%' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-green-500 font-medium">{card.change}</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 45, 80, 55, 70, 90, 75, 85, 60, 95, 70, 80].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <span key={m}>{m}</span>)}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Applications</h2>
          <div className="space-y-3">
            {(stats.recentApplications.length > 0 ? stats.recentApplications : [
              { fullName: 'Ram Shrestha', status: 'installed', createdAt: new Date() },
              { fullName: 'Sita Devi', status: 'pending', createdAt: new Date() },
              { fullName: 'Hari Prasad', status: 'approved', createdAt: new Date() },
            ]).map((app, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{app.fullName || 'Customer'}</p>
                  <p className="text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  app.status === 'installed' ? 'bg-green-100 text-green-700' :
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{app.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
