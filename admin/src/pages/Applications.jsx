import React, { useState, useEffect } from 'react';
import { FiFileText, FiCheck, FiX, FiClock, FiDollarSign } from 'react-icons/fi';
import API from '../services/api';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  useEffect(() => { fetchApplications(); }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/applications', { params: { status: statusFilter } });
      setApplications(data.applications);
    } catch {
      setApplications([]);
    }
  };

  const updateStatus = async (id, status) => {
    try { await API.put(`/applications/${id}`, { status }); fetchApplications(); } catch {}
  };

  const markPaid = async (id) => {
    try {
      await API.put(`/applications/${id}`, { paymentStatus: 'paid', paymentMethod });
      setShowPaymentModal(null);
      fetchApplications();
    } catch {}
  };

  const approveApplication = async (app) => {
    if (app.paymentStatus !== 'paid') {
      alert('Please mark payment as paid before approving.');
      return;
    }
    try {
      await API.put(`/applications/${app._id}`, { status: 'approved' });
      fetchApplications();
    } catch {}
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    'installation-scheduled': 'bg-purple-100 text-purple-700',
    installed: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  const paymentColors = {
    unpaid: 'bg-red-100 text-red-700',
    paid: 'bg-green-100 text-green-700',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="installed">Installed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map(app => (
              <tr key={app._id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><p className="font-medium text-gray-900">{app.fullName}</p></td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.phone}<br/>{app.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.package?.name || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentColors[app.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                    {app.paymentStatus || 'unpaid'}
                  </span>
                  {app.paymentMethod && <span className="ml-1 text-xs text-gray-400">({app.paymentMethod})</span>}
                </td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>{app.status}</span></td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-1">
                    {app.status === 'pending' && (
                      <>
                        {app.paymentStatus !== 'paid' && (
                          <button onClick={() => { setShowPaymentModal(app); setPaymentMethod('cash'); }} className="px-2 py-1 bg-yellow-50 rounded-lg hover:bg-yellow-100 text-xs font-medium text-yellow-700 flex items-center gap-1">
                            <FiDollarSign className="w-3 h-3" /> Mark Paid
                          </button>
                        )}
                        <button onClick={() => approveApplication(app)} className={`p-1.5 rounded-lg ${app.paymentStatus === 'paid' ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 opacity-50 cursor-not-allowed'}`} title={app.paymentStatus === 'paid' ? 'Approve' : 'Mark payment as paid first'}>
                          <FiCheck className="w-4 h-4 text-green-500" />
                        </button>
                        <button onClick={() => updateStatus(app._id, 'rejected')} className="p-1.5 bg-red-50 rounded-lg hover:bg-red-100">
                          <FiX className="w-4 h-4 text-red-500" />
                        </button>
                      </>
                    )}
                    {app.status === 'approved' && (
                      <button onClick={() => updateStatus(app._id, 'installed')} className="p-1.5 bg-blue-50 rounded-lg hover:bg-blue-100">
                        <FiCheck className="w-4 h-4 text-blue-500" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-400">No applications found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Mark Payment as Paid</h3>
            <p className="text-sm text-gray-500 mb-4">Application: <strong>{showPaymentModal.fullName}</strong><br/>Package: <strong>{showPaymentModal.package?.name || 'N/A'}</strong></p>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="cash">Cash</option>
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
              <option value="bank">Bank Transfer</option>
              <option value="online">Online</option>
            </select>
            <div className="flex space-x-2">
              <button onClick={() => setShowPaymentModal(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => markPaid(showPaymentModal._id)} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600">Confirm Paid</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
