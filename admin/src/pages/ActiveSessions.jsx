import React, { useState, useEffect } from 'react';
import { FiMonitor, FiSmartphone, FiTablet, FiX, FiRefreshCw } from 'react-icons/fi';
import API from '../services/api';

export default function ActiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/sessions');
      setSessions(data.sessions || []);
    } catch {
      setSessions([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchSessions(); }, []);

  const revokeSession = async (id) => {
    if (!confirm('Revoke this session? The user will be logged out.')) return;
    try {
      await API.put(`/admin/sessions/${id}/revoke`);
      fetchSessions();
    } catch {}
  };

  const revokeAllUserSessions = async (userId) => {
    if (!confirm('Revoke ALL sessions for this user? They will be logged out from all devices.')) return;
    try {
      await API.put(`/admin/users/${userId}/revoke-sessions`);
      fetchSessions();
    } catch {}
  };

  const getDeviceIcon = (device) => {
    if (!device || device === 'Unknown Device') return <FiMonitor className="w-5 h-5 text-gray-400" />;
    const d = device.toLowerCase();
    if (d.includes('mobile') || d.includes('phone')) return <FiSmartphone className="w-5 h-5 text-blue-500" />;
    if (d.includes('tablet')) return <FiTablet className="w-5 h-5 text-purple-500" />;
    return <FiMonitor className="w-5 h-5 text-green-500" />;
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Active Sessions</h1>
        <button onClick={fetchSessions} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
          <FiRefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Browser</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">OS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : sessions.length === 0 ? (
              <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-400">No active sessions</td></tr>
            ) : sessions.map(session => (
              <tr key={session._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{session.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{session.user?.email || ''}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${session.user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : session.user?.role === 'staff' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {session.user?.role || 'customer'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(session.device)}
                    <span className="text-sm text-gray-700">{session.device}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{session.browser}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{session.os}</td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{session.ip || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{timeAgo(session.lastActive)}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-1">
                    <button onClick={() => revokeSession(session._id)} className="p-1.5 bg-red-50 rounded-lg hover:bg-red-100" title="Revoke this session">
                      <FiX className="w-4 h-4 text-red-500" />
                    </button>
                    <button onClick={() => revokeAllUserSessions(session.user?._id)} className="px-2 py-1 bg-red-50 rounded-lg hover:bg-red-100 text-xs font-medium text-red-600" title="Revoke all sessions for this user">
                      Revoke All
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
