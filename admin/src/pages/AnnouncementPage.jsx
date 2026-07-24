import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiBell } from 'react-icons/fi';
import API from '../services/api';

export default function AnnouncementPage() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', type: 'info', isPopup: false, startDate: '', endDate: '', link: '' });
  const [editId, setEditId] = useState(null);

  const fetchItems = () => API.get('/cms/announcements').then(({ data }) => setItems(data.announcements || [])).catch(() => {});
  useEffect(() => { fetchItems(); }, []);

  const openModal = (item = null) => {
    if (item) { setForm({ ...item, startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '', endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '' }); setEditId(item._id); } else { setForm({ title: '', content: '', type: 'info', isPopup: false, startDate: '', endDate: '', link: '' }); setEditId(null); }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await API.put(`/cms/announcements/${editId}`, form);
      else await API.post('/cms/announcements', form);
      setShowModal(false); fetchItems();
    } catch { alert('Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await API.delete(`/cms/announcements/${id}`); fetchItems();
  };

  const typeColors = { info: 'bg-blue-100 text-blue-700', warning: 'bg-yellow-100 text-yellow-700', maintenance: 'bg-orange-100 text-orange-700', offer: 'bg-green-100 text-green-700', urgent: 'bg-red-100 text-red-700' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Announcements & Notices</h1>
        <button onClick={() => openModal()} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium"><FiPlus className="w-4 h-4" /><span>New Announcement</span></button>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start space-x-4">
            <div className={`p-2 rounded-xl ${typeColors[item.type] || 'bg-gray-100 text-gray-700'}`}><FiBell className="w-5 h-5" /></div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[item.type]}`}>{item.type}</span>
                {item.isPopup && <span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">Popup</span>}
                <span className={`px-2 py-0.5 rounded text-xs ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
              {item.startDate && <p className="text-xs text-gray-400 mt-1">Starts: {new Date(item.startDate).toLocaleDateString()} {item.endDate && `• Ends: ${new Date(item.endDate).toLocaleDateString()}`}</p>}
            </div>
            <div className="flex space-x-2">
              <button onClick={() => openModal(item)} className="text-blue-500"><FiEdit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(item._id)} className="text-red-500"><FiTrash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="bg-white rounded-2xl p-12 text-center text-gray-400">No announcements yet</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Announcement' : 'New Announcement'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Content</label><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl"><option value="info">Info</option><option value="warning">Warning</option><option value="maintenance">Maintenance</option><option value="offer">Offer</option><option value="urgent">Urgent</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label><input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label><input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date</label><input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
              </div>
              <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.isPopup} onChange={e => setForm({ ...form, isPopup: e.target.checked })} className="w-4 h-4" /><span>Show as popup on website</span></label>
              <div className="flex space-x-3 pt-2"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium">{editId ? 'Update' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
