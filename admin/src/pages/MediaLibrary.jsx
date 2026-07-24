import React, { useState, useEffect } from 'react';
import { FiPlus, FiImage, FiTrash2, FiGrid } from 'react-icons/fi';
import API from '../services/api';

export default function MediaLibrary() {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState('uploads');

  useEffect(() => {
    API.get('/cms/gallery').then(({ data }) => setMedia(data.items || [])).catch(() => {});
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    try {
      await API.post('/cms/gallery', { title: file.name, image: URL.createObjectURL(file), category: folder });
      API.get('/cms/gallery').then(({ data }) => setMedia(data.items || []));
    } catch { alert('Upload failed'); }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await API.delete(`/cms/gallery/${id}`);
    setMedia(media.filter(m => m._id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <div className="flex items-center space-x-3">
          <select value={folder} onChange={e => setFolder(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm"><option value="uploads">Uploads</option><option value="banners">Banners</option><option value="blog">Blog</option><option value="packages">Packages</option></select>
          <label className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer hover:shadow-lg">
            <FiPlus className="w-4 h-4" /><span>{uploading ? 'Uploading...' : 'Upload File'}</span>
            <input type="file" className="hidden" onChange={handleUpload} accept="image/*,video/*" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map(item => (
          <div key={item._id} className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <FiImage className="w-8 h-8 text-gray-300" />}
            </div>
            <div className="p-2">
              <p className="text-xs font-medium text-gray-700 truncate">{item.title}</p>
              <p className="text-xs text-gray-400">{item.category}</p>
            </div>
            <button onClick={() => handleDelete(item._id)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><FiTrash2 className="w-3 h-3" /></button>
          </div>
        ))}
        {media.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">
            <FiGrid className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p>No media files yet. Upload your first file!</p>
          </div>
        )}
      </div>
    </div>
  );
}
