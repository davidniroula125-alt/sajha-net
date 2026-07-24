import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import API from '../services/api';

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', position: '', department: '', bio: '', email: '', phone: '', linkedin: '', sortOrder: 0, isActive: true });
  const [editId, setEditId] = useState(null);

  const fetchMembers = () => API.get('/cms/team').then(({ data }) => setMembers(data.members || [])).catch(() => {});
  useEffect(() => { fetchMembers(); }, []);

  const openModal = (m = null) => {
    if (m) { setForm(m); setEditId(m._id); } else { setForm({ name: '', position: '', department: '', bio: '', email: '', phone: '', linkedin: '', sortOrder: 0, isActive: true }); setEditId(null); }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await API.put(`/cms/team/${editId}`, form);
      else await API.post('/cms/team', form);
      setShowModal(false); fetchMembers();
    } catch { alert('Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await API.delete(`/cms/team/${id}`); fetchMembers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        <button onClick={() => openModal()} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium"><FiPlus className="w-4 h-4" /><span>Add Member</span></button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map(m => (
          <div key={m._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">{m.name?.charAt(0)}</div>
              <div><h3 className="font-semibold text-gray-900 text-sm">{m.name}</h3><p className="text-xs text-gray-500">{m.position}</p></div>
            </div>
            {m.department && <p className="text-xs text-gray-500 mb-2">Department: {m.department}</p>}
            {m.bio && <p className="text-xs text-gray-600 line-clamp-2 mb-3">{m.bio}</p>}
            <div className="flex justify-between items-center">
              <span className={`px-2 py-0.5 rounded text-xs ${m.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{m.isActive ? 'Active' : 'Inactive'}</span>
              <div className="flex space-x-2"><button onClick={() => openModal(m)} className="text-blue-500"><FiEdit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(m._id)} className="text-red-500"><FiTrash2 className="w-4 h-4" /></button></div>
            </div>
          </div>
        ))}
        {members.length === 0 && <div className="col-span-full py-20 text-center text-gray-400"><FiUsers className="w-12 h-12 mx-auto mb-3 text-gray-200" /><p>No team members yet</p></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Member' : 'Add Member'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Position</label><input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Bio</label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label><input value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
              <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" /><span>Active</span></label>
              <div className="flex space-x-3 pt-2"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium">{editId ? 'Update' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
