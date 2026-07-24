import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const packageAPI = {
  getAll: (params) => API.get('/packages', { params }),
  getOne: (id) => API.get(`/packages/${id}`),
  create: (data) => API.post('/packages', data),
  update: (id, data) => API.put(`/packages/${id}`, data),
  delete: (id) => API.delete(`/packages/${id}`),
};

export const applicationAPI = {
  getAll: (params) => API.get('/applications', { params }),
  create: (data) => API.post('/applications', data),
  update: (id, data) => API.put(`/applications/${id}`, data),
  delete: (id) => API.delete(`/applications/${id}`),
};

export const blogAPI = {
  getAll: (params) => API.get('/blogs', { params }),
  getOne: (slug) => API.get(`/blogs/${slug}`),
  create: (data) => API.post('/blogs', data),
  update: (id, data) => API.put(`/blogs/${id}`, data),
  delete: (id) => API.delete(`/blogs/${id}`),
};

export const chatAPI = {
  getAll: (params) => API.get('/chat', { params }),
  getUserChats: () => API.get('/chat/user'),
  send: (data) => API.post('/chat/send', data),
  adminReply: (data) => API.post('/chat/admin-reply', data),
  close: (id) => API.put(`/chat/close/${id}`),
  delete: (id) => API.delete(`/chat/${id}`),
};

export const ticketAPI = {
  getAll: (params) => API.get('/support', { params }),
  getUserTickets: () => API.get('/support/user'),
  create: (data) => API.post('/support', data),
  update: (id, data) => API.put(`/support/${id}`, data),
  addMessage: (id, data) => API.post(`/support/${id}/message`, data),
  delete: (id) => API.delete(`/support/${id}`),
};

export const coverageAPI = {
  getAll: (params) => API.get('/coverage', { params }),
  check: (data) => API.post('/coverage/check', data),
  create: (data) => API.post('/coverage', data),
  update: (id, data) => API.put(`/coverage/${id}`, data),
  delete: (id) => API.delete(`/coverage/${id}`),
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: (params) => API.get('/admin/users', { params }),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
};

export const analyticsAPI = {
  get: () => API.get('/analytics'),
};

export const serviceAPI = {
  getAll: (params) => API.get('/services', { params }),
  getOne: (slug) => API.get(`/services/${slug}`),
  create: (data) => API.post('/services', data),
  update: (id, data) => API.put(`/services/${id}`, data),
  delete: (id) => API.delete(`/services/${id}`),
};

export const testimonialAPI = {
  getAll: (params) => API.get('/testimonials', { params }),
  create: (data) => API.post('/testimonials', data),
  update: (id, data) => API.put(`/testimonials/${id}`, data),
  delete: (id) => API.delete(`/testimonials/${id}`),
};

export const faqAPI = {
  getAll: (params) => API.get('/faqs', { params }),
  create: (data) => API.post('/faqs', data),
  update: (id, data) => API.put(`/faqs/${id}`, data),
  delete: (id) => API.delete(`/faqs/${id}`),
};

export const offerAPI = {
  getAll: () => API.get('/offers'),
  create: (data) => API.post('/offers', data),
  update: (id, data) => API.put(`/offers/${id}`, data),
  delete: (id) => API.delete(`/offers/${id}`),
};

export const settingsAPI = {
  get: () => API.get('/settings'),
  update: (data) => API.put('/settings', data),
  updateBulk: (settings) => API.put('/settings/bulk', { settings }),
};

export const complaintAPI = {
  create: (data) => API.post('/complaints', data),
  getUserComplaints: () => API.get('/complaints/user'),
};

export const feedbackAPI = {
  create: (data) => API.post('/feedbacks', data),
  getUserFeedbacks: () => API.get('/feedbacks/user'),
};

export default API;
