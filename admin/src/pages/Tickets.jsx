import React, { useState, useEffect } from 'react';
import { FiMessageCircle, FiFilter } from 'react-icons/fi';
import API from '../services/api';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [view, setView] = useState('tickets');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchTickets = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      const { data } = await API.get('/support', { params });
      setTickets(data.tickets || []);
    } catch {
      setTickets([]);
    }
  };

  const fetchComplaints = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      const { data } = await API.get('/complaints', { params });
      setComplaints(data.complaints || []);
    } catch {
      setComplaints([]);
    }
  };

  useEffect(() => {
    if (view === 'tickets') fetchTickets();
    else fetchComplaints();
  }, [view, statusFilter, categoryFilter]);

  const updateTicketStatus = async (id, status) => {
    try { await API.put(`/support/${id}`, { status }); fetchTickets(); } catch {}
  };

  const updateComplaintStatus = async (id, status) => {
    try { await API.put(`/complaints/${id}`, { status }); fetchComplaints(); } catch {}
  };

  const statusColors = {
    open: 'bg-yellow-100 text-yellow-700',
    pending: 'bg-yellow-100 text-yellow-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    in_progress: 'bg-blue-100 text-blue-700',
    waiting: 'bg-purple-100 text-purple-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };

  const complaintStatusOptions = ['pending', 'in_progress', 'resolved', 'closed'];
  const ticketStatusOptions = ['open', 'in-progress', 'waiting', 'resolved', 'closed'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Support Tickets</h1>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button onClick={() => { setView('tickets'); setStatusFilter(''); setCategoryFilter(''); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'tickets' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            Tickets ({tickets.length})
          </button>
          <button onClick={() => { setView('complaints'); setStatusFilter(''); setCategoryFilter(''); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'complaints' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            Complaints ({complaints.length})
          </button>
        </div>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          {view === 'tickets' ? (
            ticketStatusOptions.map(s => <option key={s} value={s}>{s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)
          ) : (
            complaintStatusOptions.map(s => <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)
          )}
        </select>

        {view === 'complaints' && (
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Categories</option>
            <option value="slow_speed">Slow Speed</option>
            <option value="no_internet">No Internet</option>
            <option value="frequent_disconnect">Frequent Disconnect</option>
            <option value="billing">Billing</option>
            <option value="installation">Installation</option>
            <option value="router_issue">Router Issue</option>
            <option value="other">Other</option>
          </select>
        )}
      </div>

      {view === 'tickets' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.map(ticket => (
                <tr key={ticket._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center"><FiMessageCircle className="w-5 h-5 text-purple-500" /></div>
                      <div><p className="font-medium text-gray-900">{ticket.subject}</p><p className="text-xs text-gray-500">{ticket.ticketId}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ticket.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{ticket.category || 'general'}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>{ticket.priority}</span></td>
                  <td className="px-6 py-4">
                    <select value={ticket.status} onChange={e => updateTicketStatus(ticket._id, e.target.value)} className={`px-2 py-1 rounded-lg text-xs font-medium border-0 ${statusColors[ticket.status]}`}>
                      {ticketStatusOptions.map(s => <option key={s} value={s}>{s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">No tickets found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complaint</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.map(c => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center"><FiMessageCircle className="w-5 h-5 text-red-500" /></div>
                      <div><p className="font-medium text-gray-900">{c.subject}</p><p className="text-xs text-gray-500">{c.connectionId || 'No ID'}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{c.category?.replace('_', ' ') || 'other'}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[c.priority]}`}>{c.priority}</span></td>
                  <td className="px-6 py-4">
                    <select value={c.status} onChange={e => updateComplaintStatus(c._id, e.target.value)} className={`px-2 py-1 rounded-lg text-xs font-medium border-0 ${statusColors[c.status]}`}>
                      {complaintStatusOptions.map(s => <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">No complaints found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
