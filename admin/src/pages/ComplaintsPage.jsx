import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiClock, FiCheckCircle, FiAlertTriangle, FiFilter, FiMessageSquare } from 'react-icons/fi';
import API from '../services/api';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState({ status: '', category: '' });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComplaints = () => {
    const params = {};
    if (filter.status) params.status = filter.status;
    if (filter.category) params.category = filter.category;
    API.get('/complaints', { params }).then(({ data }) => setComplaints(data.complaints || [])).catch(() => setComplaints([]));
  };

  useEffect(() => { fetchComplaints(); }, [filter]);

  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
      await API.put(`/complaints/${id}`, { status, adminReply: replyText || undefined });
      setReplyText('');
      setSelectedComplaint(null);
      fetchComplaints();
    } catch { alert('Error updating'); }
    finally { setLoading(false); }
  };

  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', in_progress: 'bg-blue-100 text-blue-700', resolved: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-500' };
  const priorityColors = { low: 'bg-gray-100 text-gray-600', medium: 'bg-blue-100 text-blue-600', high: 'bg-orange-100 text-orange-600', urgent: 'bg-red-100 text-red-600' };
  const categoryLabels = { slow_speed: 'Slow Speed', no_internet: 'No Internet', frequent_disconnect: 'Disconnects', billing: 'Billing', installation: 'Installation', router_issue: 'Router', other: 'Other' };
  const statusIcons = { pending: FiClock, in_progress: FiAlertTriangle, resolved: FiCheckCircle, closed: FiCheckCircle };

  const counts = {
    pending: complaints.filter(c => c.status === 'pending').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    total: complaints.length
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Complaints Management</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: counts.total, color: 'bg-gray-500' },
          { label: 'Pending', value: counts.pending, color: 'bg-yellow-500' },
          { label: 'In Progress', value: counts.in_progress, color: 'bg-blue-500' },
          { label: 'Resolved', value: counts.resolved, color: 'bg-green-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center`}>
                <FiAlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <FiFilter className="w-4 h-4 text-gray-400" />
        <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">All Categories</option>
          {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {complaints.map(c => {
          const StatusIcon = statusIcons[c.status] || FiClock;
          return (
            <div key={c._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedComplaint(selectedComplaint?._id === c._id ? null : c)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{c.subject}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>
                      <StatusIcon className="w-3 h-3 inline mr-1" />
                      {c.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[c.priority]}`}>{c.priority}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{c.name} • {c.email} • {c.ticketId || '#' + c._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-gray-600 line-clamp-1">{c.description}</p>
                  <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400">
                    <span>Category: {categoryLabels[c.category]}</span>
                    {c.connectionId && <span>ID: {c.connectionId}</span>}
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {selectedComplaint?._id === c._id && (
                <div className="mt-4 pt-4 border-t border-gray-100" onClick={e => e.stopPropagation()}>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{c.description}</p>
                    {c.address && <p className="text-xs text-gray-400 mt-2">Address: {c.address}</p>}
                  </div>
                  {c.adminReply && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-4">
                      <p className="text-xs font-medium text-blue-600 mb-1">Previous Admin Reply:</p>
                      <p className="text-sm text-gray-700">{c.adminReply}</p>
                    </div>
                  )}
                  <div className="space-y-3">
                    <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write admin reply (optional)..." rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" />
                    <div className="flex flex-wrap gap-2">
                      <select value={c.priority} onChange={e => API.put(`/complaints/${c._id}`, { priority: e.target.value }).then(fetchComplaints)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      {c.status !== 'in_progress' && <button onClick={() => updateStatus(c._id, 'in_progress')} disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50">Mark In Progress</button>}
                      {c.status !== 'resolved' && <button onClick={() => updateStatus(c._id, 'resolved')} disabled={loading} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50">Mark Resolved</button>}
                      {c.status !== 'closed' && <button onClick={() => updateStatus(c._id, 'closed')} disabled={loading} className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 disabled:opacity-50">Close</button>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {complaints.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
            <FiCheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p>No complaints found</p>
          </div>
        )}
      </div>
    </div>
  );
}
