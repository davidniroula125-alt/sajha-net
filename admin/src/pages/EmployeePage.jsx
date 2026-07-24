import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import API from '../services/api';

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: 'Support', role: 'support', position: '', isActive: true });
  const [editId, setEditId] = useState(null);

  const fetchEmployees = () => API.get('/cms/employees').then(({ data }) => setEmployees(data.employees || [])).catch(() => {});

  useEffect(() => { fetchEmployees(); }, []);

  const openModal = (emp = null) => {
    if (emp) { setForm(emp); setEditId(emp._id); } else { setForm({ name: '', email: '', phone: '', department: 'Support', role: 'support', position: '', isActive: true }); setEditId(null); }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await API.put(`/cms/employees/${editId}`, form);
      else await API.post('/cms/employees', form);
      setShowModal(false); fetchEmployees();
    } catch { alert('Error saving'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete employee?')) return;
    await API.delete(`/cms/employees/${id}`); fetchEmployees();
  };

  const roleColors = { admin: 'bg-purple-100 text-purple-700', editor: 'bg-blue-100 text-blue-700', support: 'bg-green-100 text-green-700', sales: 'bg-orange-100 text-orange-700', technician: 'bg-cyan-100 text-cyan-700' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
        <button onClick={() => openModal()} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg"><FiPlus className="w-4 h-4" /><span>Add Employee</span></button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100"><tr><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Department</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map(emp => (
              <tr key={emp._id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><div className="flex items-center space-x-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><FiUser className="w-4 h-4 text-gray-400" /></div><span className="font-medium text-gray-900 text-sm">{emp.name}</span></div></td>
                <td className="px-6 py-4 text-sm text-gray-600">{emp.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[emp.role] || 'bg-gray-100 text-gray-700'}`}>{emp.role}</span></td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${emp.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{emp.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-6 py-4 text-right"><button onClick={() => openModal(emp)} className="text-blue-500 hover:text-blue-700 mr-3"><FiEdit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(emp._id)} className="text-red-500 hover:text-red-700"><FiTrash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
            {employees.length === 0 && <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">No employees yet</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Employee' : 'Add Employee'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Position</label><input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" placeholder="e.g. Senior Engineer" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl"><option>Support</option><option>Sales</option><option>Technical</option><option>Marketing</option><option>Finance</option><option>HR</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl"><option value="support">Support</option><option value="sales">Sales</option><option value="technician">Technician</option><option value="editor">Editor</option><option value="admin">Admin</option></select></div>
              </div>
              <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" /><span>Active</span></label>
              <div className="flex space-x-3 pt-2"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium">{editId ? 'Update' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
