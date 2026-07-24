import React, { useState, useEffect } from 'react';
import { FiStar, FiFilter, FiSearch, FiMessageSquare, FiCheckCircle, FiArchive, FiSend, FiTrash2, FiEye } from 'react-icons/fi';
import API from '../services/api';

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({ status: '', type: '' });
  const [expandedId, setExpandedId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchFeedbacks = (p = page) => {
    const params = new URLSearchParams({ page: p, limit: 20 });
    if (filter.status) params.append('status', filter.status);
    if (filter.type) params.append('type', filter.type);
    API.get(`/feedbacks?${params.toString()}`).then(({ data }) => {
      setFeedbacks(data.feedbacks || []);
      setTotal(data.total || 0);
    }).catch(() => {});
  };

  useEffect(() => { fetchFeedbacks(1); setPage(1); }, [filter.status, filter.type]);

  const handleStatus = async (id, status) => {
    try {
      await API.put(`/feedbacks/${id}`, { status });
      alert(`Feedback marked as ${status}`);
      fetchFeedbacks();
    } catch { alert('Failed to update'); }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      await API.put(`/feedbacks/${id}`, { adminReply: replyText, status: 'read' });
      alert('Reply sent');
      setReplyText('');
      setExpandedId(null);
      fetchFeedbacks();
    } catch { alert('Failed to reply'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await API.delete(`/feedbacks/${id}`);
      alert('Feedback deleted');
      fetchFeedbacks();
    } catch { alert('Failed to delete'); }
  };

  const stats = {
    total: total,
    new: feedbacks.filter(f => f.status === 'new').length,
    read: feedbacks.filter(f => f.status === 'read').length,
    archived: feedbacks.filter(f => f.status === 'archived').length,
  };

  const typeColors = { feedback: 'bg-blue-100 text-blue-700', suggestion: 'bg-purple-100 text-purple-700', praise: 'bg-green-100 text-green-700', complaint: 'bg-red-100 text-red-700' };
  const statusColors = { new: 'bg-yellow-100 text-yellow-700', read: 'bg-blue-100 text-blue-700', archived: 'bg-gray-100 text-gray-500' };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Feedback</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: total, color: 'from-blue-500 to-blue-600' },
          { label: 'New', value: stats.new, color: 'from-yellow-500 to-orange-500' },
          { label: 'Read', value: stats.read, color: 'from-blue-500 to-indigo-500' },
          { label: 'Archived', value: stats.archived, color: 'from-gray-400 to-gray-500' },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-r ${s.color} rounded-2xl p-4 text-white`}>
            <p className="text-sm opacity-80">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <FiFilter className="w-4 h-4 text-gray-400" />
        <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
        </select>
        <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">All Types</option>
          <option value="feedback">Feedback</option>
          <option value="suggestion">Suggestion</option>
          <option value="praise">Praise</option>
          <option value="complaint">Complaint</option>
        </select>
      </div>

      <div className="space-y-4">
        {feedbacks.map(fb => (
          <div key={fb._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 cursor-pointer hover:bg-gray-50" onClick={() => setExpandedId(expandedId === fb._id ? null : fb._id)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[fb.type] || 'bg-gray-100 text-gray-700'}`}>{fb.type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[fb.status] || 'bg-gray-100 text-gray-500'}`}>{fb.status}</span>
                    <div className="flex items-center space-x-1">
                      {[1,2,3,4,5].map(i => <FiStar key={i} className={`w-3 h-3 ${i <= fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">{fb.subject}</h3>
                  <p className="text-sm text-gray-500 mt-1">{fb.name} ({fb.email}) &middot; {new Date(fb.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {fb.status === 'new' && <button onClick={e => { e.stopPropagation(); handleStatus(fb._id, 'read'); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg" title="Mark Read"><FiEye className="w-4 h-4" /></button>}
                  <button onClick={e => { e.stopPropagation(); handleDelete(fb._id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{fb.message}</p>
            </div>
            {expandedId === fb._id && (
              <div className="border-t border-gray-100 bg-gray-50">
                <div className="p-5">
                  <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{fb.message}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-4">
                    <div><span className="text-gray-400">Phone: </span><span className="text-gray-700">{fb.phone || 'N/A'}</span></div>
                    <div><span className="text-gray-400">Type: </span><span className="text-gray-700">{fb.type}</span></div>
                    <div><span className="text-gray-400">Rating: </span><span className="text-gray-700">{fb.rating}/5</span></div>
                  </div>
                  {fb.adminReply && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                      <p className="text-xs text-blue-600 font-medium mb-1">Admin Reply</p>
                      <p className="text-sm text-blue-800">{fb.adminReply}</p>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" onKeyDown={e => e.key === 'Enter' && handleReply(fb._id)} />
                    <button onClick={() => handleReply(fb._id)} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center space-x-1"><FiSend className="w-4 h-4" /><span>Reply</span></button>
                    {fb.status !== 'archived' && <button onClick={() => handleStatus(fb._id, 'archived')} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 flex items-center space-x-1"><FiArchive className="w-4 h-4" /><span>Archive</span></button>}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {feedbacks.length === 0 && <div className="text-center py-12 text-gray-400">No feedback found</div>}
      </div>

      {total > 20 && (
        <div className="flex justify-center space-x-2 mt-6">
          <button onClick={() => { setPage(p => Math.max(1, p - 1)); fetchFeedbacks(Math.max(1, page - 1)); }} disabled={page === 1} className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50">Prev</button>
          <span className="px-4 py-2 text-sm text-gray-600">Page {page}</span>
          <button onClick={() => { setPage(p => p + 1); fetchFeedbacks(page + 1); }} disabled={feedbacks.length < 20} className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
