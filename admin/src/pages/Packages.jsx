import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiWifi, FiSave } from 'react-icons/fi';
import API from '../services/api';

const emptyForm = {
  name: '', slug: '', speed: '', type: 'internet',
  price: { monthly: '', quarterly: '', halfYearly: '', yearly: '' },
  billingCycles: '',
  installationCharge: '', image: '', badge: '',
  features: '', idealFor: '', highlights: '',
  includes: { router: false, mesh: false, phone: false, tv: false, ott: '', unlimitedData: true, dropWire: false },
  isPopular: false, isRecommended: false, sortOrder: 0, description: '', shortDescription: '',
  seo: { title: '', description: '', keywords: '' }
};

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchPackages = async () => {
    try {
      const { data } = await API.get('/packages');
      setPackages(data.packages || []);
    } catch { setPackages([]); }
  };

  useEffect(() => { fetchPackages(); }, []);

  const openModal = (pkg = null) => {
    if (pkg) {
      setForm({
        name: pkg.name || '', slug: pkg.slug || '', speed: pkg.speed || '', type: pkg.type || 'internet',
        price: { monthly: pkg.price?.monthly || '', quarterly: pkg.price?.quarterly || '', halfYearly: pkg.price?.halfYearly || '', yearly: pkg.price?.yearly || '' },
        billingCycles: '',
        installationCharge: pkg.installationCharge || '', image: pkg.image || '', badge: pkg.badge || '',
        features: pkg.features?.join(', ') || '', idealFor: pkg.idealFor?.join(', ') || '', highlights: pkg.highlights?.join(', ') || '',
        includes: { router: pkg.includes?.router || false, mesh: pkg.includes?.mesh || false, phone: pkg.includes?.phone || false, tv: pkg.includes?.tv || false, ott: pkg.includes?.ott?.join(', ') || '', unlimitedData: pkg.includes?.unlimitedData !== false, dropWire: pkg.includes?.dropWire || false },
        isPopular: pkg.isPopular || false, isRecommended: pkg.isRecommended || false, sortOrder: pkg.sortOrder || 0, description: pkg.description || '', shortDescription: pkg.shortDescription || '',
        seo: { title: pkg.seo?.title || '', description: pkg.seo?.description || '', keywords: pkg.seo?.keywords?.join(', ') || '' }
      });
      setEditing(pkg);
    } else {
      setForm(emptyForm); setEditing(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name: form.name, slug: form.slug, speed: Number(form.speed), type: form.type,
        shortDescription: form.shortDescription,
        price: { monthly: Number(form.price.monthly) || 0, quarterly: Number(form.price.quarterly) || 0, halfYearly: Number(form.price.halfYearly) || 0, yearly: Number(form.price.yearly) || 0 },
        billingCycles: form.billingCycles ? form.billingCycles.split('|').map(b => { const parts = b.split(':'); return { cycle: parts[0], price: Number(parts[1]) || 0, discount: Number(parts[2]) || 0 }; }).filter(b => b.cycle && b.price) : [],
        installationCharge: Number(form.installationCharge) || 0,
        image: form.image || '',
        badge: form.badge || '',
        features: form.features ? form.features.split(',').map(f => f.trim()).filter(Boolean) : [],
        idealFor: form.idealFor ? form.idealFor.split(',').map(f => f.trim()).filter(Boolean) : [],
        highlights: form.highlights ? form.highlights.split(',').map(f => f.trim()).filter(Boolean) : [],
        includes: { router: form.includes.router, mesh: form.includes.mesh, phone: form.includes.phone, tv: form.includes.tv, unlimitedData: form.includes.unlimitedData, dropWire: form.includes.dropWire, ott: form.includes.ott ? form.includes.ott.split(',').map(f => f.trim()).filter(Boolean) : [] },
        isPopular: form.isPopular, isRecommended: form.isRecommended, sortOrder: Number(form.sortOrder) || 0,
        description: form.description || '', shortDescription: form.shortDescription || '',
        seo: { title: form.seo?.title || '', description: form.seo?.description || '', keywords: form.seo?.keywords ? form.seo.keywords.split(',').map(k => k.trim()).filter(Boolean) : [] }
      };
      if (editing) await API.put(`/packages/${editing._id}`, data);
      else await API.post('/packages', data);
      setShowModal(false); setEditing(null); fetchPackages();
    } catch { alert('Error saving package'); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this package?')) return;
    try { await API.delete(`/packages/${id}`); fetchPackages(); } catch {}
  };

  const filtered = filter === 'all' ? packages : packages.filter(p => p.type === filter);
  const typeColors = { internet: 'bg-blue-100 text-blue-700', combo: 'bg-purple-100 text-purple-700', business: 'bg-orange-100 text-orange-700', enterprise: 'bg-red-100 text-red-700' };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
        <button onClick={() => openModal()} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all">
          <FiPlus className="w-4 h-4" /><span>Add Package</span>
        </button>
      </div>

      <div className="flex space-x-2 mb-4">
        {['all', 'internet', 'combo', 'business', 'enterprise'].map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === t ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr><th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Package</th><th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Speed</th><th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th><th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Yearly</th><th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Badge</th><th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Features</th><th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Flags</th><th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(pkg => (
              <tr key={pkg._id} className="hover:bg-gray-50">
                <td className="px-5 py-4"><div className="flex items-center space-x-3"><div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center"><FiWifi className="w-4 h-4 text-blue-500" /></div><div><p className="font-medium text-gray-900 text-sm">{pkg.name}</p><p className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{pkg.shortDescription}</p></div></div></td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">{pkg.speed} Mbps</td>
<td className="px-5 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[pkg.type] || 'bg-gray-100 text-gray-700'}`}>{pkg.type}</span></td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">Rs. {pkg.price?.yearly?.toLocaleString()}/yr</td>
                  <td className="px-5 py-4">{pkg.badge && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">{pkg.badge}</span>}</td>
                  <td className="px-5 py-4 text-xs text-gray-500">{pkg.features?.length || 0} features</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {pkg.isPopular && <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Popular</span>}
                    {pkg.includes?.router && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">Router</span>}
                    {pkg.includes?.mesh && <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs">Mesh</span>}
                    {pkg.includes?.tv && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">TV</span>}
                  </div>
                </td>
                <td className="px-5 py-4 text-right"><div className="flex justify-end space-x-1"><button onClick={() => openModal(pkg)} className="p-2 hover:bg-blue-50 rounded-lg"><FiEdit2 className="w-4 h-4 text-blue-500" /></button><button onClick={() => handleDelete(pkg._id)} className="p-2 hover:bg-red-50 rounded-lg"><FiTrash2 className="w-4 h-4 text-red-500" /></button></div></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-400">No packages found</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Package' : 'Add Package'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Slug</label><input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="e.g. bronze" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Speed (Mbps)</label><input type="number" value={form.speed} onChange={e => setForm({...form, speed: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"><option value="internet">Internet</option><option value="combo">Combo</option><option value="business">Business</option><option value="enterprise">Enterprise</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Badge</label><input value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="e.g. Popular, Recommended" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label><input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="https://..." /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label><input value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="e.g. Best for streaming and gaming" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" /></div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Pricing (Rs.)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><label className="block text-xs text-gray-500 mb-1">Monthly</label><input type="number" value={form.price.monthly} onChange={e => setForm({...form, price: {...form.price, monthly: e.target.value}})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required /></div>
                  <div><label className="block text-xs text-gray-500 mb-1">Quarterly</label><input type="number" value={form.price.quarterly} onChange={e => setForm({...form, price: {...form.price, quarterly: e.target.value}})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1">Half Yearly</label><input type="number" value={form.price.halfYearly} onChange={e => setForm({...form, price: {...form.price, halfYearly: e.target.value}})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1">Yearly</label><input type="number" value={form.price.yearly} onChange={e => setForm({...form, price: {...form.price, yearly: e.target.value}})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required /></div>
                </div>
                <div className="mt-3"><label className="block text-xs text-gray-500 mb-1">Billing Cycles (pipe separated: cycle:price:discount)</label><input value={form.billingCycles} onChange={e => setForm({...form, billingCycles: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="monthly:6500|yearly:6500:0" /></div>
                <div className="mt-3"><label className="block text-xs text-gray-500 mb-1">Installation Charge (Rs.)</label><input type="number" value={form.installationCharge} onChange={e => setForm({...form, installationCharge: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
              </div>

              {/* Lists */}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label><input value={form.features} onChange={e => setForm({...form, features: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="Unlimited Internet, No Deposit, Free Router" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Ideal For (comma separated)</label><input value={form.idealFor} onChange={e => setForm({...form, idealFor: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="Browsing, Streaming, Gaming" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Highlights (comma separated)</label><input value={form.highlights} onChange={e => setForm({...form, highlights: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" placeholder="Free Router, No Deposit, Fast Speed" /></div>

              {/* Includes */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Includes</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.includes.router} onChange={e => setForm({...form, includes: {...form.includes, router: e.target.checked}})} className="w-4 h-4" /><span>Router</span></label>
                  <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.includes.mesh} onChange={e => setForm({...form, includes: {...form.includes, mesh: e.target.checked}})} className="w-4 h-4" /><span>Mesh WiFi</span></label>
                  <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.includes.phone} onChange={e => setForm({...form, includes: {...form.includes, phone: e.target.checked}})} className="w-4 h-4" /><span>Telephone</span></label>
                  <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.includes.tv} onChange={e => setForm({...form, includes: {...form.includes, tv: e.target.checked}})} className="w-4 h-4" /><span>NetTV</span></label>
                  <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.includes.unlimitedData} onChange={e => setForm({...form, includes: {...form.includes, unlimitedData: e.target.checked}})} className="w-4 h-4" /><span>Unlimited Data</span></label>
                  <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.includes.dropWire} onChange={e => setForm({...form, includes: {...form.includes, dropWire: e.target.checked}})} className="w-4 h-4" /><span>Free Drop Wire</span></label>
                </div>
                <div className="mt-2"><label className="block text-xs text-gray-500 mb-1">OTT Services (comma separated)</label><input value={form.includes.ott} onChange={e => setForm({...form, includes: {...form.includes, ott: e.target.value}})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Netflix Basic, Disney+" /></div>
              </div>

              {/* Flags */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.isPopular} onChange={e => setForm({...form, isPopular: e.target.checked})} className="w-4 h-4" /><span>Mark as Popular</span></label>
                <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={form.isRecommended} onChange={e => setForm({...form, isRecommended: e.target.checked})} className="w-4 h-4" /><span>Mark as Recommended</span></label>
              </div>

              {/* SEO */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">SEO</h3>
                <div className="mb-2"><label className="block text-xs text-gray-500 mb-1">SEO Title</label><input value={form.seo?.title || ''} onChange={e => setForm({...form, seo: {...form.seo, title: e.target.value}})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                <div className="mb-2"><label className="block text-xs text-gray-500 mb-1">SEO Description</label><textarea value={form.seo?.description || ''} onChange={e => setForm({...form, seo: {...form.seo, description: e.target.value}})} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">SEO Keywords (comma separated)</label><input value={form.seo?.keywords || ''} onChange={e => setForm({...form, seo: {...form.seo, keywords: e.target.value}})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="bronze package, 80 Mbps, Rs 6500" /></div>
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
