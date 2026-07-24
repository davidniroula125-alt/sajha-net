import React, { useState, useEffect } from 'react';
import { FiSave, FiImage, FiEdit2 } from 'react-icons/fi';
import API from '../services/api';

export default function HeroBanner() {
  const [hero, setHero] = useState({
    title: '', subtitle: '', backgroundImage: '', videoUrl: '', badge: '',
    ctaButtons: [{ text: 'Get Connection', url: '/apply', primary: true }, { text: 'View Packages', url: '/packages', primary: false }],
    stats: [{ label: 'Ultra Fast Fiber', value: 'Up to 1 Gbps', icon: 'wifi' }, { label: '99.9% Uptime', value: 'Guaranteed', icon: 'shield' }, { label: '24/7 Support', value: 'Always Available', icon: 'clock' }]
  });
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('hero');
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerForm, setBannerForm] = useState({ title: '', description: '', image: '', link: '', type: 'slider' });

  useEffect(() => {
    API.get('/cms/hero').then(({ data }) => { if (data.hero?._id) setHero(data.hero); }).catch(() => {});
    API.get('/cms/banners').then(({ data }) => setBanners(data.banners || [])).catch(() => {});
  }, []);

  const saveHero = async () => {
    setLoading(true);
    try { await API.put('/cms/hero', hero); alert('Hero saved!'); } catch { alert('Error'); } finally { setLoading(false); }
  };

  const saveBanner = async (e) => {
    e.preventDefault();
    try { await API.post('/cms/banners', bannerForm); setShowBannerModal(false); setBannerForm({ title: '', description: '', image: '', link: '', type: 'slider' }); API.get('/cms/banners').then(({ data }) => setBanners(data.banners)); } catch { alert('Error'); }
  };

  const deleteBanner = async (id) => {
    if (!confirm('Delete?')) return;
    try { await API.delete(`/cms/banners/${id}`); setBanners(banners.filter(b => b._id !== id)); } catch {}
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hero & Banner Management</h1>

      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {[{ id: 'hero', label: 'Hero Section' }, { id: 'banners', label: 'Banners' }, { id: 'promos', label: 'Promotional' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'hero' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Hero Content</h2>
            <button onClick={saveHero} disabled={loading} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg disabled:opacity-50"><FiSave className="w-4 h-4" /><span>{loading ? 'Saving...' : 'Save'}</span></button>
          </div>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label><input value={hero.badge || ''} onChange={e => setHero({ ...hero, badge: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title (Nepali)</label><input value={hero.title || ''} onChange={e => setHero({ ...hero, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label><textarea value={hero.subtitle || ''} onChange={e => setHero({ ...hero, subtitle: e.target.value })} rows={2} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label><input value={hero.backgroundImage || ''} onChange={e => setHero({ ...hero, backgroundImage: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" placeholder="https://..." /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Video URL (optional)</label><input value={hero.videoUrl || ''} onChange={e => setHero({ ...hero, videoUrl: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>

            <h3 className="font-semibold text-gray-900 pt-4">CTA Buttons</h3>
            {(hero.ctaButtons || []).map((btn, i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <input value={btn.text} onChange={e => { const btns = [...hero.ctaButtons]; btns[i].text = e.target.value; setHero({ ...hero, ctaButtons: btns }); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Button text" />
                <input value={btn.url} onChange={e => { const btns = [...hero.ctaButtons]; btns[i].url = e.target.value; setHero({ ...hero, ctaButtons: btns }); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="URL" />
                <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={btn.primary} onChange={e => { const btns = [...hero.ctaButtons]; btns[i].primary = e.target.checked; setHero({ ...hero, ctaButtons: btns }); }} className="w-4 h-4" /><span>Primary</span></label>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'banners' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowBannerModal(true)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium">+ Add Banner</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map(b => (
              <div key={b._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center"><FiImage className="w-8 h-8 text-gray-300" /></div>
                <h3 className="font-semibold text-gray-900 text-sm">{b.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{b.type} • {b.position || 'homepage'}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.isActive ? 'Active' : 'Inactive'}</span>
                  <button onClick={() => deleteBanner(b._id)} className="text-red-500 text-xs hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showBannerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Add Banner</h2>
            <form onSubmit={saveBanner} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input value={bannerForm.title} onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={bannerForm.description} onChange={e => setBannerForm({ ...bannerForm, description: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" rows={2} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label><input value={bannerForm.image} onChange={e => setBannerForm({ ...bannerForm, image: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label><input value={bannerForm.link} onChange={e => setBannerForm({ ...bannerForm, link: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={bannerForm.type} onChange={e => setBannerForm({ ...bannerForm, type: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl"><option value="slider">Slider</option><option value="offer">Offer</option><option value="promo">Promo</option><option value="popup">Popup</option></select></div>
              </div>
              <div className="flex space-x-3 pt-2"><button type="button" onClick={() => setShowBannerModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium">Create</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
