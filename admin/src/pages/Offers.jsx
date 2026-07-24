import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPercent } from 'react-icons/fi';
import API from '../services/api';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', discount: '', discountType: 'percentage', code: '', validFrom: '', validUntil: '', terms: '' });

  useEffect(() => { fetchOffers(); }, []);

  const fetchOffers = async () => {
    try { const { data } = await API.get('/offers'); setOffers(data.offers); } catch { setOffers([]); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await API.put(`/offers/${editing._id}`, form); }
      else { await API.post('/offers', form); }
      setShowModal(false); setEditing(null); fetchOffers();
    } catch { alert('Error saving offer'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this offer?')) return;
    try { await API.delete(`/offers/${id}`); fetchOffers(); } catch {}
  };

  const openEdit = (offer) => {
    setForm({ title: offer.title, description: offer.description, discount: offer.discount || '', discountType: offer.discountType || 'percentage', code: offer.code || '', validFrom: offer.validFrom ? offer.validFrom.split('T')[0] : '', validUntil: offer.validUntil ? offer.validUntil.split('T')[0] : '', terms: offer.terms || '' });
    setEditing(offer); setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Offers</h1>
        <button onClick={() => { setForm({ title: '', description: '', discount: '', discountType: 'percentage', code: '', validFrom: '', validUntil: '', terms: '' }); setEditing(null); setShowModal(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg">
          <FiPlus className="w-4 h-4" /><span>Add Offer</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map(offer => (
          <div key={offer._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium">{offer.discount}% OFF</span>
              <div className="flex space-x-1">
                <button onClick={() => openEdit(offer)} className="p-2 hover:bg-gray-100 rounded-lg"><FiEdit2 className="w-4 h-4 text-blue-500" /></button>
                <button onClick={() => handleDelete(offer._id)} className="p-2 hover:bg-red-50 rounded-lg"><FiTrash2 className="w-4 h-4 text-red-500" /></button>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{offer.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{offer.description}</p>
            {offer.code && <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">{offer.code}</span>}
          </div>
        ))}
        {offers.length === 0 && <p className="text-gray-500 col-span-3 text-center py-8">No offers yet. Create one!</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editing ? 'Edit Offer' : 'Add Offer'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label><input type="number" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label><input value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label><input type="date" value={form.validFrom} onChange={e => setForm({...form, validFrom: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label><input type="date" value={form.validUntil} onChange={e => setForm({...form, validUntil: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
              </div>
              <div className="flex space-x-3 pt-4"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium">{editing ? 'Update' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
