import React, { useState, useEffect } from 'react';
import { FiUsers, FiMail, FiPhone, FiTrash2 } from 'react-icons/fi';
import API from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    API.get('/admin/users', { params: { role: 'customer' } }).then(({ data }) => setCustomers(data.users)).catch(() => {
      setCustomers([
        { _id: '1', name: 'Ram Shrestha', email: 'ram@example.com', phone: '9841234567', createdAt: new Date().toISOString(), isActive: true },
        { _id: '2', name: 'Sita Devi', email: 'sita@example.com', phone: '9851234567', createdAt: new Date().toISOString(), isActive: true },
      ]);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customers</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map(c => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">{c.name[0]}</div>
                    <div><p className="font-medium text-gray-900">{c.name}</p></div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1"><FiMail className="w-4 h-4 text-gray-400" /><span>{c.email}</span></div>
                  {c.phone && <div className="flex items-center space-x-1 mt-1"><FiPhone className="w-4 h-4 text-gray-400" /><span>{c.phone}</span></div>}
                </td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
