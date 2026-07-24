import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import API from '../services/api';

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '', category: 'general' });

  useEffect(() => { fetchFAQs(); }, []);

  const fetchFAQs = async () => {
    try { const { data } = await API.get('/faqs'); setFaqs(data.faqs); } catch { setFaqs([]); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await API.put(`/faqs/${editing._id}`, form); }
      else { await API.post('/faqs', form); }
      setShowModal(false); setEditing(null); fetchFAQs();
    } catch { alert('Error saving FAQ'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this FAQ?')) return;
    try { await API.delete(`/faqs/${id}`); fetchFAQs(); } catch {}
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
        <button onClick={() => { setForm({ question: '', answer: '', category: 'general' }); setEditing(null); setShowModal(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg">
          <FiPlus className="w-4 h-4" /><span>Add FAQ</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Answer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {faqs.map(faq => (
              <tr key={faq._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{faq.question}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">{faq.category}</span></td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{faq.answer}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => { setForm(faq); setEditing(faq); setShowModal(true); }} className="p-2 hover:bg-gray-100 rounded-lg"><FiEdit2 className="w-4 h-4 text-blue-500" /></button>
                    <button onClick={() => handleDelete(faq._id)} className="p-2 hover:bg-red-50 rounded-lg"><FiTrash2 className="w-4 h-4 text-red-500" /></button>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editing ? 'Edit' : 'Add'} FAQ</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Question</label><input value={form.question} onChange={e => setForm({...form, question: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Answer</label><textarea value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl"><option value="general">General</option><option value="technical">Technical</option><option value="billing">Billing</option><option value="installation">Installation</option><option value="packages">Packages</option><option value="support">Support</option></select></div>
              <div className="flex space-x-3 pt-4"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium">{editing ? 'Update' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
