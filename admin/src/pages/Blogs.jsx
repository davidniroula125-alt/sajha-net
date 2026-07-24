import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiFileText } from 'react-icons/fi';
import API from '../services/api';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: 'general', tags: '' });

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try { const { data } = await API.get('/blogs'); setBlogs(data.blogs); } catch {
      setBlogs([
        { _id: '1', title: 'Fiber Internet Guide', category: 'technology', isPublished: true, views: 1250, createdAt: new Date().toISOString() },
        { _id: '2', title: 'Speed Test Tips', category: 'tips', isPublished: true, views: 890, createdAt: new Date().toISOString() },
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/blogs', { ...form, slug: form.title.toLowerCase().replace(/\s+/g, '-'), tags: form.tags.split(',').map(t => t.trim()) });
      setShowModal(false); fetchBlogs();
    } catch {}
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all">
          <FiPlus className="w-4 h-4" /><span>Add Blog</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(blog => (
          <div key={blog._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">{blog.category}</span>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${blog.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>{blog.isPublished ? 'Published' : 'Draft'}</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{blog.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{blog.views} views • {new Date(blog.createdAt).toLocaleDateString()}</p>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg"><FiEdit2 className="w-4 h-4 text-blue-500" /></button>
              <button className="p-2 hover:bg-red-50 rounded-lg"><FiTrash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Blog Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl"><option value="general">General</option><option value="news">News</option><option value="tips">Tips</option><option value="technology">Technology</option><option value="offers">Offers</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label><input value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Content</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={5} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label><input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
              <div className="flex space-x-3 pt-4"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium">Publish</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
