import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiServer, FiSave } from 'react-icons/fi';
import API from '../services/api';

const iconOptions = ['FaWifi', 'FaBuilding', 'FaTv', 'FaHome', 'FaCloud', 'FaServer', 'FaShieldAlt', 'FaVideo', 'FaNetworkWired', 'FaHeadphones', 'FaDesktop', 'FaGlobe'];
const categoryOptions = ['internet', 'business', 'entertainment', 'addons', 'enterprise', 'services'];

const emptyForm = { name: '', slug: '', shortDescription: '', description: '', icon: 'FaWifi', category: 'internet', features: '', sortOrder: 0, isActive: true };

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchServices = async () => {
    try { const { data } = await API.get('/services'); setServices(data.services || []); } catch { setServices([]); }
  };

  useEffect(() => { fetchServices(); }, []);

  const openModal = (svc = null) => {
    if (svc) {
      setForm({ name: svc.name || '', slug: svc.slug || '', shortDescription: svc.shortDescription || '', description: svc.description || '', icon: svc.icon || 'FaWifi', category: svc.category || 'internet', features: svc.features?.join(', ') || '', sortOrder: svc.sortOrder || 0, isActive: svc.isActive !== false });
      setEditing(svc);
    } else { setForm(emptyForm); setEditing(null); }
    setShowModal(true);
  };

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleNameChange = (val) => {
    const updates = { name: val };
    if (!editing) updates.slug = generateSlug(val);
    setForm({ ...form, ...updates });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name: form.name, slug: form.slug || generateSlug(form.name), shortDescription: form.shortDescription, description: form.description,
        icon: form.icon, category: form.category,
        features: form.features ? form.features.split(',').map(f => f.trim()).filter(Boolean) : [],
        sortOrder: Number(form.sortOrder) || 0, isActive: form.isActive
      };
      if (editing) await API.put(`/services/${editing._id}`, data);
      else await API.post('/services', data);
      setShowModal(false); setEditing(null); fetchServices();
    } catch { alert('Error saving service'); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try { await API.delete(`/services/${id}`); fetchServices(); } catch {}
  };

  const filtered = filter === 'all' ? services : services.filter(s => s.category === filter);
  const catColors = { internet: 'bg-blue-100 text-blue-700', business: 'bg-orange-100 text-orange-700', entertainment: 'bg-purple-100 text-purple-700', addons: 'bg-green-100 text-green-700', enterprise: 'bg-red-100 text-red-700', services: 'bg-cyan-100 text-cyan-700' };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <button onClick={() => openModal()} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all">
          <FiPlus className="w-4 h-4" /><span>Add Service</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {['all', ...categoryOptions].map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === c ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(svc => (
          <div key={svc._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <FiServer className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => openModal(svc)} className="p-2 hover:bg-blue-50 rounded-lg"><FiEdit2 className="w-4 h-4 text-blue-500" /></button>
                <button onClick={() => handleDelete(svc._id)} className="p-2 hover:bg-red-50 rounded-lg"><FiTrash2 className="w-4 h-4 text-red-500" /></button>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">{svc.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{svc.shortDescription}</p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${catColors[svc.category] || 'bg-gray-100 text-gray-700'}`}>{svc.category}</span>
              <span className="text-xs text-gray-400">{svc.features?.length || 0} features</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full py-20 text-center text-gray-400"><FiServer className="w-12 h-12 mx-auto mb-3 text-gray-200" /><p>No services found</p></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input value={form.name} onChange={e => handleNameChange(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Slug</label><input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="auto-generated-from-name" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label><input value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="One-line description" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm">{categoryOptions.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Icon</label><select value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm">{iconOptions.map(i => <option key={i} value={i}>{i}</option>)}</select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label><input value={form.features} onChange={e => setForm({...form, features: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="Speeds up to 1 Gbps, 99.9% Uptime, Unlimited Data" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" /></div>
                <div className="flex items-end pb-1"><label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4" /><span>Active</span></label></div>
              </div>
              <div className="flex space-x-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50"><FiSave className="w-4 h-4" /><span>{loading ? 'Saving...' : editing ? 'Update' : 'Create'}</span></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
