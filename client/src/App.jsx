import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Chatbot from './components/common/Chatbot';
import ScrollToTop from './components/common/ScrollToTop';
import Login from './pages/Login';
import Register from './pages/Register';
import Compare from './pages/Compare';
import Apply from './pages/Apply';
import Contact from './pages/Contact';
import About from './pages/About';
import Packages from './pages/Packages';
import Business from './pages/Business';
import Coverage from './pages/Coverage';
import Support from './pages/Support';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import CustomerPortal from './pages/CustomerPortal';
import SpeedTest from './pages/SpeedTest';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/business" element={<Business />} />
                  <Route path="/coverage" element={<Coverage />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/portal/*" element={<CustomerPortal />} />
                  <Route path="/apply" element={<Apply />} />
                  <Route path="/speed-test" element={<SpeedTest />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
              <Footer />
              <Chatbot />
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
