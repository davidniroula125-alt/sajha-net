import React, { useState, useEffect } from 'react';
import { FiFilter, FiDownload, FiSearch, FiCalendar, FiChevronDown, FiChevronUp, FiAlertCircle, FiStar, FiMessageSquare, FiClock, FiUser, FiGlobe, FiServer } from 'react-icons/fi';
import API from '../services/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ module: '', search: '', dateFrom: '', dateTo: '' });
  const [expandedId, setExpandedId] = useState(null);

  const fetchLogs = (p = page) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 30 });
    if (filter.module) params.append('module', filter.module);
    if (filter.search) params.append('search', filter.search);
    if (filter.dateFrom) params.append('dateFrom', filter.dateFrom);
    if (filter.dateTo) params.append('dateTo', filter.dateTo);
    API.get(`/cms/audit-logs?${params.toString()}`).then(({ data }) => {
      setLogs(data.logs || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(1); setPage(1); }, [filter.module, filter.dateFrom, filter.dateTo]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs(1);
    setPage(1);
  };

  const moduleColors = {
    package: 'bg-blue-100 text-blue-700', application: 'bg-green-100 text-green-700',
    blog: 'bg-purple-100 text-purple-700', ticket: 'bg-orange-100 text-orange-700',
    customer: 'bg-cyan-100 text-cyan-700', hero: 'bg-pink-100 text-pink-700',
    banner: 'bg-yellow-100 text-yellow-700', general: 'bg-gray-100 text-gray-700',
    complaint: 'bg-red-100 text-red-700', feedback: 'bg-indigo-100 text-indigo-700',
    settings: 'bg-teal-100 text-teal-700', employee: 'bg-emerald-100 text-emerald-700',
    announcement: 'bg-amber-100 text-amber-700', team: 'bg-violet-100 text-violet-700',
    gallery: 'bg-fuchsia-100 text-fuchsia-700', notice: 'bg-rose-100 text-rose-700'
  };

  const moduleIcons = {
    complaint: FiAlertCircle, feedback: FiStar, ticket: FiMessageSquare,
    blog: FiGlobe, package: FiServer, general: FiClock
  };

  const handleExport = () => {
    const csv = [
      ['Time', 'User', 'Action', 'Module', 'Details', 'IP Address', 'Browser'].join(','),
      ...logs.map(l => [
        `"${new Date(l.createdAt).toLocaleString()}"`,
        `"${l.user?.name || l.user?.email || 'System'}"`,
        `"${l.action}"`,
        `"${l.module}"`,
        `"${(l.details || '').replace(/"/g, '""')}"`,
        `"${l.ipAddress || ''}"`,
        `"${(l.browser || '').substring(0, 50)}"`
      ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FiClock className="w-4 h-4" />
          <span>{total} total entries</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <FiFilter className="w-4 h-4 text-gray-400" />
          <select value={filter.module} onChange={e => setFilter({ ...filter, module: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="">All Modules</option>
            <option value="complaint">Complaint</option>
            <option value="feedback">Feedback</option>
            <option value="package">Package</option>
            <option value="application">Application</option>
            <option value="blog">Blog</option>
            <option value="ticket">Ticket</option>
            <option value="customer">Customer</option>
            <option value="hero">Hero</option>
            <option value="banner">Banner</option>
            <option value="settings">Settings</option>
            <option value="employee">Employee</option>
            <option value="announcement">Announcement</option>
            <option value="team">Team</option>
            <option value="gallery">Gallery</option>
            <option value="notice">Notice</option>
            <option value="general">General</option>
          </select>
          <input type="date" value={filter.dateFrom} onChange={e => setFilter({ ...filter, dateFrom: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" title="From date" />
          <input type="date" value={filter.dateTo} onChange={e => setFilter({ ...filter, dateTo: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" title="To date" />
          <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px]">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={filter.search} onChange={e => setFilter({ ...filter, search: e.target.value })} placeholder="Search actions or details..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <button type="submit" className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">Search</button>
          </form>
          <button onClick={handleExport} className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <FiDownload className="w-4 h-4" /><span>Export CSV</span>
          </button>
          {(filter.module || filter.dateFrom || filter.dateTo || filter.search) && (
            <button onClick={() => { setFilter({ module: '', search: '', dateFrom: '', dateTo: '' }); }} className="px-3 py-2 text-red-500 text-sm hover:bg-red-50 rounded-lg">Clear Filters</button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-8"></th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Module</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map(log => (
                    <React.Fragment key={log._id}>
                      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedId(expandedId === log._id ? null : log._id)}>
                        <td className="px-6 py-4">
                          {expandedId === log._id ? <FiChevronUp className="w-4 h-4 text-gray-400" /> : <FiChevronDown className="w-4 h-4 text-gray-400" />}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="flex items-center space-x-2">
                            <FiUser className="w-3 h-3 text-gray-400" />
                            <span>{log.user?.name || log.user?.email || 'System'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.action}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${moduleColors[log.module] || 'bg-gray-100 text-gray-700'}`}>
                            {React.createElement(moduleIcons[log.module] || FiClock, { className: 'w-3 h-3' })}
                            <span>{log.module}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{log.details}</td>
                      </tr>
                      {expandedId === log._id && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400 text-xs mb-1">IP Address</p>
                                <p className="text-gray-700 font-medium">{log.ipAddress || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs mb-1">Browser</p>
                                <p className="text-gray-700 font-medium truncate" title={log.browser}>{log.browser ? log.browser.substring(0, 60) + (log.browser.length > 60 ? '...' : '') : 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs mb-1">Module</p>
                                <p className="text-gray-700 font-medium">{log.module}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs mb-1">Timestamp</p>
                                <p className="text-gray-700 font-medium">{new Date(log.createdAt).toISOString()}</p>
                              </div>
                              {log.details && (
                                <div className="col-span-2 md:col-span-4">
                                  <p className="text-gray-400 text-xs mb-1">Full Details</p>
                                  <p className="text-gray-700">{log.details}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  {logs.length === 0 && <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">No audit logs found</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50">
              <span className="text-sm text-gray-500">{total} total logs</span>
              <div className="flex items-center space-x-2">
                <button onClick={() => { setPage(1); fetchLogs(1); }} disabled={page === 1} className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-100">First</button>
                <button onClick={() => { const p = Math.max(1, page - 1); setPage(p); fetchLogs(p); }} disabled={page === 1} className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-100">Prev</button>
                <span className="px-3 py-1 text-sm text-gray-600">Page {page} of {pages}</span>
                <button onClick={() => { const p = Math.min(pages, page + 1); setPage(p); fetchLogs(p); }} disabled={page >= pages} className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-100">Next</button>
                <button onClick={() => { setPage(pages); fetchLogs(pages); }} disabled={page >= pages} className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-100">Last</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
