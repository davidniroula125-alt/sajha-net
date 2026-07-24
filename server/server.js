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

app.get('/api/seed-blogs', async (req, res) => {
  if (process.env.SEED_SECRET !== 'sajha-seed-2026') return res.status(403).json({ message: 'forbidden' });
  try {
    const Blog = require('./models/Blog');
    const User = require('./models/User');
    const admin = await User.findOne({ role: 'admin' });

    await Blog.deleteMany({});

    const blogs = [
      {
        title: 'Why Fiber Internet is the Future of Connectivity in Itahari',
        slug: 'why-fiber-internet-future-itahari',
        category: 'technology',
        excerpt: 'Fiber optic internet is transforming how Itahari stays connected. Learn why fiber is the gold standard for home and business internet.',
        content: `<h2>The Fiber Revolution in Itahari</h2>
<p>Itahari, one of the fastest-growing cities in eastern Nepal, is experiencing a digital transformation. As businesses expand, students pursue online education, and families stream entertainment, the demand for reliable, high-speed internet has never been greater.</p>

<h2>Why Fiber Optic?</h2>
<p>Fiber optic internet transmits data through thin glass cables using light signals, offering speeds up to 100x faster than traditional copper connections. Here's why Itahari residents are making the switch:</p>

<ul>
<li><strong>Blazing Speeds:</strong> Up to 200 Mbps download speeds for seamless streaming, gaming, and video calls</li>
<li><strong>Unlimited Data:</strong> No data caps or throttling — stream, download, and browse without limits</li>
<li><strong>Low Latency:</strong> Perfect for online gaming, video conferencing, and real-time applications</li>
<li><strong>Reliability:</strong> Fiber is immune to electromagnetic interference and weather conditions</li>
<li><strong>Future-Ready:</strong> Fiber infrastructure supports speeds up to 1 Gbps and beyond</li>
</ul>

<h2>How Sajha Net is Leading the Way</h2>
<p>Sajha Net has been at the forefront of bringing fiber internet to Itahari and surrounding areas. With plans starting at just Rs. 6,500/month, we make high-speed internet accessible to everyone. Our free installation program means you can get connected without any upfront costs.</p>

<h2>Real Impact in Our Community</h2>
<p>Since launching our fiber network in Itahari, we've connected over 5,000 households and businesses. Students can now attend online classes without buffering, businesses can operate cloud-based systems efficiently, and families can enjoy HD IPTV alongside their internet service.</p>

<h2>Make the Switch Today</h2>
<p>Ready to experience the fiber difference? Contact Sajha Net at 9705390890 or visit our office in Itahari to get started with free installation.</p>`,
        tags: ['fiber internet', 'Itahari', 'ISP Nepal', 'high-speed internet', 'broadband'],
        author: admin?._id,
        isPublished: true,
        views: 342,
        likes: 28
      },
      {
        title: 'How to Choose the Right Internet Package for Your Home',
        slug: 'choose-right-internet-package-home',
        category: 'tips',
        excerpt: 'Not sure which internet plan suits your household? Here is a complete guide to help you pick the perfect Sajha Net package.',
        content: `<h2>Understanding Your Internet Needs</h2>
<p>Choosing the right internet package can be overwhelming with so many options available. At Sajha Net, we offer seven different plans to cater to various needs. Here's how to pick the perfect one for your household.</p>

<h2>For Light Users (1-2 people)</h2>
<p>If you primarily browse social media, check emails, and do basic streaming:</p>
<ul>
<li><strong>Bronze Plan (80 Mbps — Rs. 6,500/month)</strong> is ideal</li>
<li>Perfect for students and small families</li>
<li>Handles HD streaming on 1-2 devices simultaneously</li>
</ul>

<h2>For Medium Users (2-4 people)</h2>
<p>For families who stream, video call, and have multiple devices connected:</p>
<ul>
<li><strong>Silver Plan (100 Mbps — Rs. 7,500/month)</strong> is recommended</li>
<li>Our most popular plan with 300+ Mbps shared across devices</li>
<li>Great for remote workers and online students</li>
</ul>

<h2>For Heavy Users (4+ people)</h2>
<p>For large households with heavy streaming, gaming, and multiple simultaneous users:</p>
<ul>
<li><strong>Gold Plan (150 Mbps — Rs. 8,500/month)</strong> or <strong>Platinum (200 Mbps — Rs. 9,500/month)</strong></li>
<li>Supports 4K streaming on multiple devices</li>
<li>Low latency for competitive gaming</li>
</ul>

<h2>Want TV + Internet?</h2>
<p>Our combo bundles include IPTV service:</p>
<ul>
<li><strong>Essential (80 Mbps + IPTV — Rs. 8,500/month)</strong></li>
<li><strong>Enhanced (150 Mbps + IPTV — Rs. 9,500/month)</strong></li>
<li><strong>Premium (200 Mbps + IPTV — Rs. 10,500/month)</strong></li>
</ul>

<h2>Key Factors to Consider</h2>
<ul>
<li>Number of devices connected simultaneously</li>
<li>Type of activities (streaming, gaming, video calls)</li>
<li>Number of household members</li>
<li>Budget constraints</li>
</ul>

<p>All plans include free router, free drop wire, and free installation. No deposit required!</p>`,
        tags: ['internet package', 'home internet', 'broadband plan', 'choose ISP', 'Itahari internet'],
        author: admin?._id,
        isPublished: true,
        views: 256,
        likes: 19
      },
      {
        title: 'Complete Guide to Setting Up Home WiFi with Sajha Net',
        slug: 'complete-guide-setup-home-wifi',
        category: 'fiber-guide',
        excerpt: 'Step-by-step guide to setting up your home WiFi network after getting connected with Sajha Net fiber internet.',
        content: `<h2>Welcome to Your New Fiber Connection!</h2>
<p>Congratulations on choosing Sajha Net for your home internet. Once our technician completes the free installation, here's how to optimize your WiFi setup for the best experience.</p>

<h2>Step 1: Router Placement</h2>
<p>The placement of your router significantly impacts your WiFi coverage:</p>
<ul>
<li>Place the router in a central location in your home</li>
<li>Keep it elevated — on a shelf or mounted on a wall</li>
<li>Avoid placing near walls, metal objects, or electronic devices</li>
<li>Keep away from microwaves and cordless phones</li>
</ul>

<h2>Step 2: Connect Your Devices</h2>
<p>Our technicians set up your router with a default WiFi name and password. You can:</p>
<ol>
<li>Find the WiFi name (SSID) and password on the router label</li>
<li>Connect your phone, laptop, or tablet using the password</li>
<li>Change the default password for security (access router settings at 192.168.1.1)</li>
</ol>

<h2>Step 3: Optimize WiFi Coverage</h2>
<p>For larger homes in Itahari:</p>
<ul>
<li>Consider our Mesh WiFi add-on for complete coverage</li>
<li>Use WiFi extenders for dead zones</li>
<li>Connect devices via Ethernet cable for maximum speed</li>
</ul>

<h2>Step 4: Secure Your Network</h2>
<ul>
<li>Change default router admin password</li>
<li>Use WPA3 or WPA2 encryption</li>
<li>Create a strong WiFi password (mix of letters, numbers, and symbols)</li>
<li>Regularly update router firmware</li>
</ul>

<h2>Step 5: Speed Test</h2>
<p>After setup, verify your connection speed at speedtest.net or fast.com. If you're not getting the speeds you're paying for, contact our support team at 970910187.</p>

<h2>Need Help?</h2>
<p>Our 24/7 technical support team is always available. Call us at 970910187 or visit our office in Itahari for in-person assistance.</p>`,
        tags: ['WiFi setup', 'home network', 'router configuration', 'internet tips', 'fiber installation'],
        author: admin?._id,
        isPublished: true,
        views: 189,
        likes: 15
      },
      {
        title: 'Sajha Net Launches Free IPTV Service with Combo Packages',
        slug: 'sajha-net-free-iptv-combo-packages',
        category: 'offers',
        excerpt: 'Exciting news! Sajha Net now offers free IPTV service with all combo packages. Watch 200+ HD channels including Nepali, Hindi, and English content.',
        content: `<h2>Entertainment Just Got Better in Itahari!</h2>
<p>Sajha Net is thrilled to announce that our combo packages now include FREE IPTV service with 200+ HD channels. Experience the perfect combination of blazing fast internet and premium entertainment.</p>

<h2>What is IPTV?</h2>
<p>IPTV (Internet Protocol Television) delivers TV channels through your internet connection instead of traditional cable or satellite. This means:</p>
<ul>
<li>Crystal clear HD quality</li>
<li>No separate cable connection needed</li>
<li>Watch on your TV, phone, or tablet</li>
<li>Pause, rewind, and record live TV</li>
</ul>

<h2>Available Combo Plans</h2>
<ul>
<li><strong>Essential:</strong> 80 Mbps Internet + IPTV — Rs. 8,500/month</li>
<li><strong>Enhanced:</strong> 150 Mbps Internet + IPTV — Rs. 9,500/month</li>
<li><strong>Premium:</strong> 200 Mbps Internet + IPTV — Rs. 10,500/month</li>
</ul>

<h2>Channel Lineup</h2>
<p>Our IPTV service includes:</p>
<ul>
<li>50+ Nepali channels (NTV, Kantipur, Image, AP1, Sagarmatha)</li>
<li>80+ Hindi channels (Star Plus, Zee TV, Sony, Colors)</li>
<li>40+ English channels (HBO, Discovery, Nat Geo, BBC)</li>
<li>Sports channels (Star Sports, Sony Six, beIN Sports)</li>
<li>Kids channels (Cartoon Network, Nickelodeon, Disney)</li>
</ul>

<h2>Special Offer</h2>
<p>Get a 5G router for only Rs. 1,000 additional with any combo plan. This ensures the best streaming experience for your IPTV service.</p>

<h2>How to Get Started</h2>
<p>Call us at 9705390890 or visit our Itahari office to switch to a combo plan today. Existing internet-only customers can upgrade anytime!</p>`,
        tags: ['IPTV', 'combo package', 'HD TV', 'entertainment', 'Itahari TV service'],
        author: admin?._id,
        isPublished: true,
        views: 412,
        likes: 35
      },
      {
        title: '5 Tips to Boost Your Internet Speed at Home',
        slug: '5-tips-boost-internet-speed-home',
        category: 'tips',
        excerpt: 'Is your internet feeling slow? Try these 5 simple tips to maximize your Sajha Net connection speed and get the performance you pay for.',
        content: `<h2>Getting the Most Out of Your Connection</h2>
<p>You've invested in a high-speed Sajha Net fiber connection, but are you getting the maximum performance? Here are five tips to ensure you're getting every Mbps you're paying for.</p>

<h2>1. Restart Your Router Regularly</h2>
<p>Just like your phone or computer, routers benefit from occasional restarts:</p>
<ul>
<li>Unplug your router for 30 seconds, then plug it back in</li>
<li>Do this once a week for optimal performance</li>
<li>Clears temporary memory and fixes minor connectivity issues</li>
</ul>

<h2>2. Use 5GHz WiFi Band</h2>
<p>Most modern routers broadcast on two frequencies:</p>
<ul>
<li><strong>2.4 GHz:</strong> Better range but slower speeds</li>
<li><strong>5 GHz:</strong> Faster speeds but shorter range</li>
<li>Connect to 5GHz when close to the router for maximum speed</li>
</ul>

<h2>3. Reduce Connected Devices</h2>
<p>Every device connected to your WiFi uses bandwidth:</p>
<ul>
<li>Disconnect devices not currently in use</li>
<li>Disable automatic updates on devices when not needed</li>
<li>Close unused browser tabs and background apps</li>
</ul>

<h2>4. Use Ethernet for Critical Devices</h2>
<p>For the fastest, most stable connection:</p>
<ul>
<li>Connect your work computer or gaming console directly via Ethernet cable</li>
<li>Eliminates WiFi interference and signal loss</li>
<li>Guarantees maximum speed from your plan</li>
</ul>

<h2>5. Check for Interference</h2>
<p>WiFi signals can be weakened by:</p>
<ul>
<li>Thick concrete walls</li>
<li>Metal objects and mirrors</li>
<li>Microwave ovens</li>
<li>Neighboring WiFi networks</li>
</ul>

<h2>Still Slow? Contact Us</h2>
<p>If you've tried all these tips and still experience slow speeds, our technical team can help. Call 970910187 or visit our Itahari office for a free speed check.</p>`,
        tags: ['internet speed', 'WiFi tips', 'network optimization', 'slow internet', 'fiber tips'],
        author: admin?._id,
        isPublished: true,
        views: 298,
        likes: 22
      },
      {
        title: 'Top 5 Benefits of Fiber Internet for Students in Itahari',
        slug: 'top-5-benefits-fiber-internet-students-itahari',
        category: 'general',
        excerpt: 'From online classes to research projects, discover why fiber internet from Sajha Net is essential for students in Itahari.',
        content: `<h2>Empowering Students with Reliable Internet</h2>
<p>In today's digital age, internet access is no longer a luxury — it's a necessity for students. From attending online classes to researching assignments, a reliable internet connection can make or break academic success.</p>

<h2>1. Seamless Online Classes</h2>
<p>With schools and colleges increasingly offering hybrid learning:</p>
<ul>
<li>Fiber internet provides consistent speeds for uninterrupted video lectures</li>
<li>Low latency ensures real-time participation in discussions</li>
<li>Upload speed matters too — submit assignments and projects without delays</li>
</ul>

<h2>2. Access to Online Learning Platforms</h2>
<p>Students in Itahari now access global educational resources:</p>
<ul>
<li>YouTube educational channels and tutorials</li>
<li>Online courses from Coursera, edX, and Khan Academy</li>
<li>Research databases and digital libraries</li>
<li>E-books and academic journals</li>
</ul>

<h2>3. Reliable Video Calls</h2>
<p>Whether it's group study sessions or one-on-one tutoring:</p>
<ul>
<li>Crystal clear video calls with teachers and classmates</li>
<li>No more embarrassing freezes during presentations</li>
<li>Screen sharing for collaborative projects</li>
</ul>

<h2>4. Cloud-Based Productivity</h2>
<p>Modern students use cloud tools daily:</p>
<ul>
<li>Google Workspace and Microsoft 365 for documents</li>
<li>Google Drive and OneDrive for file storage</li>
<li>Notion and Trello for project management</li>
</ul>

<h2>5. Affordable Plans for Students</h2>
<p>At Sajha Net, we understand student budgets:</p>
<ul>
<li>Bronze Plan (80 Mbps) at just Rs. 6,500/month — perfect for individual students</li>
<li>No deposit required</li>
<li>Free router and installation</li>
</ul>

<h2>Get Connected Today</h2>
<p>Visit our Itahari office or call 9705390890 to set up your student internet connection. Bring your student ID for special assistance!</p>`,
        tags: ['student internet', 'online education', 'Itahari students', 'fiber for students', 'academic internet'],
        author: admin?._id,
        isPublished: true,
        views: 224,
        likes: 18
      }
    ];

    await Blog.insertMany(blogs);
    res.json({ success: true, message: `${blogs.length} blogs seeded successfully!` });
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
