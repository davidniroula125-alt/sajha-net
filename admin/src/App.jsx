import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Packages from './pages/Packages';
import Applications from './pages/Applications';
import Customers from './pages/Customers';
import Blogs from './pages/Blogs';
import Tickets from './pages/Tickets';
import Chats from './pages/Chats';
import Settings from './pages/Settings';
import Offers from './pages/Offers';
import Testimonials from './pages/Testimonials';
import FAQs from './pages/FAQs';
import CoveragePage from './pages/CoveragePage';
import HeroBanner from './pages/HeroBanner';
import ServicesPage from './pages/ServicesPage';
import EmployeePage from './pages/EmployeePage';
import AuditLogs from './pages/AuditLogs';
import MediaLibrary from './pages/MediaLibrary';
import TeamPage from './pages/TeamPage';
import GalleryPage from './pages/GalleryPage';
import AnnouncementPage from './pages/AnnouncementPage';
import ComplaintsPage from './pages/ComplaintsPage';
import FeedbackPage from './pages/FeedbackPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" /></div>;
  return user && (user.role === 'admin' || user.role === 'staff') ? children : <Navigate to="/login" />;
};

function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><AdminLayout><Dashboard /></AdminLayout></PrivateRoute>} />
          <Route path="/packages" element={<PrivateRoute><AdminLayout><Packages /></AdminLayout></PrivateRoute>} />
          <Route path="/applications" element={<PrivateRoute><AdminLayout><Applications /></AdminLayout></PrivateRoute>} />
          <Route path="/customers" element={<PrivateRoute><AdminLayout><Customers /></AdminLayout></PrivateRoute>} />
          <Route path="/blogs" element={<PrivateRoute><AdminLayout><Blogs /></AdminLayout></PrivateRoute>} />
          <Route path="/tickets" element={<PrivateRoute><AdminLayout><Tickets /></AdminLayout></PrivateRoute>} />
          <Route path="/chats" element={<PrivateRoute><AdminLayout><Chats /></AdminLayout></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><AdminLayout><Settings /></AdminLayout></PrivateRoute>} />
          <Route path="/offers" element={<PrivateRoute><AdminLayout><Offers /></AdminLayout></PrivateRoute>} />
          <Route path="/testimonials" element={<PrivateRoute><AdminLayout><Testimonials /></AdminLayout></PrivateRoute>} />
          <Route path="/faqs" element={<PrivateRoute><AdminLayout><FAQs /></AdminLayout></PrivateRoute>} />
          <Route path="/coverage" element={<PrivateRoute><AdminLayout><CoveragePage /></AdminLayout></PrivateRoute>} />
          <Route path="/hero-banners" element={<PrivateRoute><AdminLayout><HeroBanner /></AdminLayout></PrivateRoute>} />
          <Route path="/services" element={<PrivateRoute><AdminLayout><ServicesPage /></AdminLayout></PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute><AdminLayout><EmployeePage /></AdminLayout></PrivateRoute>} />
          <Route path="/audit-logs" element={<PrivateRoute><AdminLayout><AuditLogs /></AdminLayout></PrivateRoute>} />
          <Route path="/media" element={<PrivateRoute><AdminLayout><MediaLibrary /></AdminLayout></PrivateRoute>} />
          <Route path="/team" element={<PrivateRoute><AdminLayout><TeamPage /></AdminLayout></PrivateRoute>} />
          <Route path="/gallery" element={<PrivateRoute><AdminLayout><GalleryPage /></AdminLayout></PrivateRoute>} />
          <Route path="/announcements" element={<PrivateRoute><AdminLayout><AnnouncementPage /></AdminLayout></PrivateRoute>} />
          <Route path="/complaints" element={<PrivateRoute><AdminLayout><ComplaintsPage /></AdminLayout></PrivateRoute>} />
          <Route path="/feedbacks" element={<PrivateRoute><AdminLayout><FeedbackPage /></AdminLayout></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
