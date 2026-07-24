import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiImage } from 'react-icons/fi';
import API from '../services/api';

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', image: '', category: 'general', description: '' });

  const fetchItems = () => API.get('/cms/gallery').then(({ data }) => setItems(data.items || [])).catch(() => {});
  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await API.post('/cms/gallery', form); setShowModal(false); setForm({ title: '', image: '', category: 'general', description: '' }); fetchItems(); } catch { alert('Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await API.delete(`/cms/gallery/${id}`); fetchItems();
  };

  const categories = ['general', 'office', 'team', 'events', 'infrastructure', 'network'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium"><FiPlus className="w-4 h-4" /><span>Add Image</span></button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item._id} className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
            <div className="aspect-square bg-gray-100">
              {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FiImage className="w-8 h-8 text-gray-300" /></div>}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">{item.category}</span>
                <button onClick={() => handleDelete(item._id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full py-20 text-center text-gray-400"><FiImage className="w-12 h-12 mx-auto mb-3 text-gray-200" /><p>No gallery items yet</p></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Add to Gallery</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" placeholder="https://..." required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl">{categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
              <div className="flex space-x-3 pt-2"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium">Add</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
