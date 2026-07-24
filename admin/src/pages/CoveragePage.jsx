import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';
import API from '../services/api';

export default function CoveragePage() {
  const [coverages, setCoverages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ province: '', district: '', municipality: '', ward: '', estimatedSpeed: '', servicesAvailable: '', estimatedInstallationDays: 7 });

  useEffect(() => { fetchCoverages(); }, []);

  const fetchCoverages = async () => {
    try { const { data } = await API.get('/coverage'); setCoverages(data.coverages); } catch { setCoverages([]); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, servicesAvailable: form.servicesAvailable.split(',').map(s => s.trim()) };
      if (editing) { await API.put(`/coverage/${editing._id}`, data); }
      else { await API.post('/coverage', data); }
      setShowModal(false); setEditing(null); fetchCoverages();
    } catch { alert('Error saving coverage'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coverage area?')) return;
    try { await API.delete(`/coverage/${id}`); fetchCoverages(); } catch {}
  };

  const provinces = ['Bagmati', 'Gandaki', 'Lumbini', 'Koshi', 'Madhesh', 'Karnali', 'Sudurpashchim'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coverage Areas</h1>
        <button onClick={() => { setForm({ province: '', district: '', municipality: '', ward: '', estimatedSpeed: '', servicesAvailable: '', estimatedInstallationDays: 7 }); setEditing(null); setShowModal(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg">
          <FiPlus className="w-4 h-4" /><span>Add Area</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Province</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">District</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Municipality</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Speed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Services</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coverages.map(c => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{c.province}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.district}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.municipality}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.estimatedSpeed}</td>
                <td className="px-6 py-4"><div className="flex flex-wrap gap-1">{c.servicesAvailable?.map((s, i) => <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{s}</span>)}</div></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => { setForm({ ...c, servicesAvailable: c.servicesAvailable?.join(', ') || '' }); setEditing(c); setShowModal(true); }} className="p-2 hover:bg-gray-100 rounded-lg"><FiEdit2 className="w-4 h-4 text-blue-500" /></button>
                    <button onClick={() => handleDelete(c._id)} className="p-2 hover:bg-red-50 rounded-lg"><FiTrash2 className="w-4 h-4 text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editing ? 'Edit' : 'Add'} Coverage Area</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Province</label><select value={form.province} onChange={e => setForm({...form, province: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required><option value="">Select</option>{provinces.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">District</label><input value={form.district} onChange={e => setForm({...form, district: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label><input value={form.municipality} onChange={e => setForm({...form, municipality: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Ward</label><input value={form.ward} onChange={e => setForm({...form, ward: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Estimated Speed</label><input value={form.estimatedSpeed} onChange={e => setForm({...form, estimatedSpeed: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" placeholder="e.g. Up to 1 Gbps" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Services Available (comma separated)</label><input value={form.servicesAvailable} onChange={e => setForm({...form, servicesAvailable: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" placeholder="Fiber, TV, Phone" /></div>
              <div className="flex space-x-3 pt-4"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium">{editing ? 'Update' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
