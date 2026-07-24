import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import API from '../services/api';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', location: '', rating: 5, content: '', package: '', isFeatured: false });

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try { const { data } = await API.get('/testimonials'); setTestimonials(data.testimonials); } catch { setTestimonials([]); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await API.put(`/testimonials/${editing._id}`, form); }
      else { await API.post('/testimonials', form); }
      setShowModal(false); setEditing(null); fetchTestimonials();
    } catch { alert('Error saving testimonial'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try { await API.delete(`/testimonials/${id}`); fetchTestimonials(); } catch {}
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <button onClick={() => { setForm({ name: '', location: '', rating: 5, content: '', package: '', isFeatured: false }); setEditing(null); setShowModal(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg">
          <FiPlus className="w-4 h-4" /><span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div key={t._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-3">
              {[...Array(5)].map((_, j) => <FiStar key={j} className={`w-4 h-4 ${j < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
            </div>
            <p className="text-gray-600 text-sm mb-4 italic">"{t.content}"</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.location} • {t.package}</p>
              </div>
              <div className="flex space-x-1">
                <button onClick={() => { setForm(t); setEditing(t); setShowModal(true); }} className="p-2 hover:bg-gray-100 rounded-lg"><FiEdit2 className="w-4 h-4 text-blue-500" /></button>
                <button onClick={() => handleDelete(t._id)} className="p-2 hover:bg-red-50 rounded-lg"><FiTrash2 className="w-4 h-4 text-red-500" /></button>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && <p className="text-gray-500 col-span-3 text-center py-8">No testimonials yet.</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editing ? 'Edit' : 'Add'} Testimonial</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label><input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Review</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Package</label><input value={form.package} onChange={e => setForm({...form, package: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" placeholder="e.g. 100 Mbps" /></div>
              <div className="flex items-center space-x-2"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} className="w-4 h-4" /><label className="text-sm text-gray-700">Featured</label></div>
              <div className="flex space-x-3 pt-4"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium">{editing ? 'Update' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
