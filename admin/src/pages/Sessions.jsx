import React, { useState, useEffect } from 'react';
import { FiMonitor, FiSmartphone, FiTrash2, FiShield } from 'react-icons/fi';
import API from '../services/api';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const { data } = await API.get('/admin/sessions');
      setSessions(data.sessions || []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const revokeSession = async (id) => {
    if (!confirm('Revoke this session?')) return;
    try {
      await API.put(`/admin/sessions/${id}/revoke`);
      fetchSessions();
    } catch {}
  };

  const revokeAllUser = async (userId) => {
    if (!confirm('Revoke ALL sessions for this user?')) return;
    try {
      await API.put(`/admin/users/${userId}/revoke-sessions`);
      fetchSessions();
    } catch {}
  };

  const getDeviceIcon = (device) => {
    if (device?.includes('Mobile') || device?.includes('iOS') || device?.includes('Android')) {
      return <FiSmartphone className="w-5 h-5" />;
    }
    return <FiMonitor className="w-5 h-5" />;
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
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
        <span className="text-sm text-gray-500">{sessions.length} active</span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
          No active sessions
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => (
            <div key={session._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${session.user?.role === 'admin' ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'}`}>
                  {getDeviceIcon(session.device)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{session.user?.name || 'Unknown'}</p>
                    {session.user?.role === 'admin' && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <FiShield className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{session.device} &middot; {session.browser}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {session.user?.email} &middot; IP: {session.ip || 'N/A'} &middot; Last active: {timeAgo(session.lastActive)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 mr-2">Online</span>
                <button onClick={() => revokeAllUser(session.user?._id)} className="px-3 py-1.5 bg-yellow-50 rounded-lg hover:bg-yellow-100 text-xs font-medium text-yellow-700" title="Revoke all sessions for this user">
                  Revoke All
                </button>
                <button onClick={() => revokeSession(session._id)} className="p-2 bg-red-50 rounded-lg hover:bg-red-100" title="Revoke this session">
                  <FiTrash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
