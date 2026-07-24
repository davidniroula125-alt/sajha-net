const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const packageRoutes = require('./routes/packages');
const applicationRoutes = require('./routes/applications');
const blogRoutes = require('./routes/blogs');
const chatRoutes = require('./routes/chat');
const supportRoutes = require('./routes/support');
const coverageRoutes = require('./routes/coverage');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const serviceRoutes = require('./routes/services');
const testimonialRoutes = require('./routes/testimonials');
const faqRoutes = require('./routes/faqs');
const offerRoutes = require('./routes/offers');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sajhanet', {
  serverSelectionTimeoutMS: 15000,
  heartbeatFrequencyMS: 30000
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err.message));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-chat', (userId) => {
    socket.join(`user-${userId}`);
  });

  socket.on('join-admin', () => {
    socket.join('admin-room');
  });

  socket.on('send-message', (data) => {
    io.to('admin-room').emit('new-message', data);
    io.to(`user-${data.userId}`).emit('message-received', data);
  });

  socket.on('typing', (data) => {
    io.to('admin-room').emit('user-typing', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.set('io', io);

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/coverage', coverageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/settings', require('./routes/settings'));
app.use('/api/cms', require('./routes/cms'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/feedbacks', require('./routes/feedbacks'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/update-blog-images', async (req, res) => {
  if (process.env.SEED_SECRET !== 'sajha-seed-2026') return res.status(403).json({ message: 'forbidden' });
  try {
    const Blog = require('./models/Blog');
    const images = {
      'why-fiber-internet-future-itahari': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80',
      'choose-right-internet-package-home': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80',
      'complete-guide-setup-home-wifi': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
      'sajha-net-free-iptv-combo-packages': 'https://images.unsplash.com/photo-1574694238031-813a5b75e5d5?w=1200&q=80',
      '5-tips-boost-internet-speed-home': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      'top-5-benefits-fiber-internet-students-itahari': 'https://images.unsplash.com/photo-1523040333635-83785dc02b3c?w=1200&q=80',
    };
    for (const [slug, image] of Object.entries(images)) {
      await Blog.updateOne({ slug }, { $set: { featuredImage: image } });
    }
    res.json({ success: true, message: 'Blog images updated!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
const adminBuildPath = path.join(__dirname, '..', 'admin', 'dist');

app.use('/admin', express.static(adminBuildPath));
app.use(express.static(clientBuildPath));

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(adminBuildPath, 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
