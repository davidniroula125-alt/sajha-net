import React, { useState, useEffect } from 'react';
import { FiMail, FiPhone } from 'react-icons/fi';
import API from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    API.get('/admin/users', { params: { role: 'customer' } }).then(({ data }) => setCustomers(data.users)).catch(() => setCustomers([]));
  }, []);

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
                    {c.packageName ? (
                      <span className="font-medium">{c.packageName}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
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
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {customers.length === 0 && (
              <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-400">No customers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
