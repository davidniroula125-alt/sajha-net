import React, { useState, useEffect } from 'react';
import { FiMail, FiPhone, FiEdit2 } from 'react-icons/fi';
import API from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ paymentStatus: 'unpaid', paymentMethod: 'cash', paymentDuration: 'yearly', expiryDate: '' });

  const fetchCustomers = () => {
    API.get('/admin/users', { params: { role: 'customer' } }).then(({ data }) => setCustomers(data.users)).catch(() => setCustomers([]));
  };

  useEffect(() => { fetchCustomers(); }, []);

  const openEditModal = (c) => {
    setEditForm({
      paymentStatus: c.paymentStatus || 'unpaid',
      paymentMethod: c.paymentMethod || 'cash',
      paymentDuration: c.paymentDuration || 'yearly',
      expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split('T')[0] : '',
    });
    setShowEditModal(c);
  };

  const handleDurationChange = (dur) => {
    const months = { monthly: 1, quarterly: 3, halfYearly: 6, yearly: 12 };
    const m = months[dur] || 12;
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + m);
    setEditForm({ ...editForm, paymentDuration: dur, expiryDate: expiry.toISOString().split('T')[0] });
  };

  const saveEdit = async () => {
    if (!showEditModal) return;
    try {
      await API.put(`/admin/users/${showEditModal._id}/subscription`, {
        paymentStatus: editForm.paymentStatus,
        paymentMethod: editForm.paymentMethod,
        paymentDuration: editForm.paymentDuration,
        expiryDate: editForm.expiryDate ? new Date(editForm.expiryDate).toISOString() : null,
      });
      setShowEditModal(null);
      fetchCustomers();
    } catch {}
  };

  const paymentColors = {
    unpaid: 'bg-red-100 text-red-700',
    paid: 'bg-green-100 text-green-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customers</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map(c => {
              const isExpired = c.expiryDate ? new Date() > new Date(c.expiryDate) : false;
              return (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">{c.name?.[0] || '?'}</div>
                      <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1"><FiMail className="w-3 h-3 text-gray-400" /><span>{c.email}</span></div>
                    {c.phone && <div className="flex items-center space-x-1 mt-1"><FiPhone className="w-3 h-3 text-gray-400" /><span>{c.phone}</span></div>}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {c.packageName ? <span className="font-medium">{c.packageName}</span> : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentColors[c.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                      {c.paymentStatus || 'unpaid'}
                    </span>
                    {c.paymentMethod && <span className="ml-1 text-xs text-gray-400">({c.paymentMethod})</span>}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 capitalize">{c.paymentDuration || '-'}</td>
                  <td className="px-4 py-4 text-sm">
                    {c.expiryDate ? (
                      <span className={isExpired ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                        {new Date(c.expiryDate).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    ) : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => openEditModal(c)} className="p-1.5 bg-gray-50 rounded-lg hover:bg-gray-100" title="Edit payment & expiry">
                      <FiEdit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {customers.length === 0 && (
              <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-400">No customers found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Edit Payment Details</h3>
            <p className="text-sm text-gray-500 mb-4">Customer: <strong>{showEditModal.name}</strong></p>

            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select value={editForm.paymentStatus} onChange={e => setEditForm({ ...editForm, paymentStatus: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select value={editForm.paymentMethod} onChange={e => setEditForm({ ...editForm, paymentMethod: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="cash">Cash</option>
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
              <option value="bank">Bank Transfer</option>
              <option value="online">Online</option>
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <select value={editForm.paymentDuration} onChange={e => handleDurationChange(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="halfYearly">Half Yearly</option>
              <option value="yearly">Yearly</option>
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input type="date" value={editForm.expiryDate} onChange={e => setEditForm({ ...editForm, expiryDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <div className="flex space-x-2">
              <button onClick={() => setShowEditModal(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={saveEdit} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
