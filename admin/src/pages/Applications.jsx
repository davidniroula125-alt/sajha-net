import React, { useState, useEffect } from 'react';
import { FiFileText, FiCheck, FiX, FiClock } from 'react-icons/fi';
import API from '../services/api';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchApplications(); }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/applications', { params: { status: statusFilter } });
      setApplications(data.applications);
    } catch {
      setApplications([
        { _id: '1', fullName: 'Ram Shrestha', phone: '9841234567', email: 'ram@example.com', status: 'pending', createdAt: new Date().toISOString(), package: { name: '100 Mbps' } },
        { _id: '2', fullName: 'Sita Devi', phone: '9851234567', email: 'sita@example.com', status: 'approved', createdAt: new Date().toISOString(), package: { name: '200 Mbps' } },
        { _id: '3', fullName: 'Hari Prasad', phone: '9861234567', email: 'hari@example.com', status: 'installed', createdAt: new Date().toISOString(), package: { name: '50 Mbps' } },
      ]);
    }
  };

  const updateStatus = async (id, status) => {
    try { await API.put(`/applications/${id}`, { status }); fetchApplications(); } catch {}
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    'installation-scheduled': 'bg-purple-100 text-purple-700',
    installed: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
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
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>{app.status}</span></td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-1">
                    {app.status === 'pending' && <><button onClick={() => updateStatus(app._id, 'approved')} className="p-1.5 bg-green-50 rounded-lg hover:bg-green-100"><FiCheck className="w-4 h-4 text-green-500" /></button><button onClick={() => updateStatus(app._id, 'rejected')} className="p-1.5 bg-red-50 rounded-lg hover:bg-red-100"><FiX className="w-4 h-4 text-red-500" /></button></>}
                    {app.status === 'approved' && <button onClick={() => updateStatus(app._id, 'installed')} className="p-1.5 bg-blue-50 rounded-lg hover:bg-blue-100"><FiCheck className="w-4 h-4 text-blue-500" /></button>}
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
