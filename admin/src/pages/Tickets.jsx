import React, { useState, useEffect } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import API from '../services/api';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    API.get('/support').then(({ data }) => setTickets(data.tickets)).catch(() => {
      setTickets([
        { _id: '1', ticketId: 'TKT-ABC123', subject: 'Slow Internet', status: 'open', priority: 'high', user: { name: 'Ram', email: 'ram@example.com' }, createdAt: new Date().toISOString() },
        { _id: '2', ticketId: 'TKT-DEF456', subject: 'Billing Issue', status: 'in-progress', priority: 'medium', user: { name: 'Sita', email: 'sita@example.com' }, createdAt: new Date().toISOString() },
      ]);
    });
  }, []);

  const updateStatus = async (id, status) => {
    try { await API.put(`/support/${id}`, { status }); fetchTickets(); } catch {}
  };

  const statusColors = {
    open: 'bg-yellow-100 text-yellow-700',
    'in-progress': 'bg-blue-100 text-blue-700',
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Support Tickets</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
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
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>{ticket.priority}</span></td>
                <td className="px-6 py-4">
                  <select value={ticket.status} onChange={e => updateStatus(ticket._id, e.target.value)} className={`px-2 py-1 rounded-lg text-xs font-medium border-0 ${statusColors[ticket.status]}`}>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="waiting">Waiting</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
