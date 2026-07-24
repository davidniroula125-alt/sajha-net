# Sajha Net - Nepal's Most Reliable High-Speed Internet

A complete, modern, production-ready ISP (Internet Service Provider) website built with React.js, Node.js, Express.js, and MongoDB.

## Features

- **Frontend**: React.js + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express.js + MongoDB + JWT Auth
- **Admin Dashboard**: React Admin Panel with Analytics
- **Real-time Chat**: Socket.io powered chatbot
- **Customer Portal**: Bill management, usage tracking
- **Dark/Light Mode**: Full theme support
- **Responsive**: Mobile, Tablet, Desktop
- **SEO Friendly**: Meta tags, structured data

## Project Structure

```
sajha-net/
├── client/          # React Frontend
├── server/          # Node.js Backend
└── admin/           # Admin Dashboard
```

## Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd sajha-net
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env  # Configure your environment variables
npm run seed           # Seed database with sample data
npm run dev            # Start backend server
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev            # Start frontend dev server
```

### 4. Setup Admin Dashboard
```bash
cd admin
npm install
npm run dev            # Start admin dashboard
```

## Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sajhanet
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
NODE_ENV=development
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=sajhanet2025@gmail.com
EMAIL_PASS=your-password
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

## Default Credentials

### Admin
- Email: admin@sajhanet2025@gmail.com
- Password: admin123

### Customer
- Email: ram@example.com
- Password: password123

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- PUT /api/auth/profile

### Packages
- GET /api/packages
- GET /api/packages/:id
- POST /api/packages (Admin)
- PUT /api/packages/:id (Admin)
- DELETE /api/packages/:id (Admin)

### Applications
- GET /api/applications (Admin)
- POST /api/applications
- PUT /api/applications/:id (Admin)

### Blogs
- GET /api/blogs
- GET /api/blogs/:slug
- POST /api/blogs (Admin)
- PUT /api/blogs/:id (Admin)
- DELETE /api/blogs/:id (Admin)

### Chat
- GET /api/chat (Admin)
- GET /api/chat/user
- POST /api/chat/send
- POST /api/chat/admin-reply (Admin)

### Support
- GET /api/support (Admin)
- GET /api/support/user
- POST /api/support
- PUT /api/support/:id (Admin)

### Coverage
- GET /api/coverage
- POST /api/coverage/check
- POST /api/coverage (Admin)

### Admin
- GET /api/admin/dashboard
- GET /api/admin/users
- PUT /api/admin/users/:id
- DELETE /api/admin/users/:id

## Pages

### Frontend
- Home (Hero, Offers, Packages, Business, Why Choose, Coverage, Testimonials, Blog, FAQ, Partners, CTA)
- Packages
- Business Internet
- Coverage
- Support
- Blog
- Blog Post
- Contact
- About
- Login
- Register
- Apply for Connection
- Customer Portal

### Admin Dashboard
- Dashboard (Analytics, Charts)
- Packages Management
- Applications Management
- Customers Management
- Blog Management
- Support Tickets
- Live Chat

## Technologies

### Frontend
- React.js 18
- Vite 5
- Tailwind CSS 3
- Framer Motion
- React Router 6
- Axios
- React Icons
- React Hook Form
- Swiper JS
- Chart.js
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt.js
- Socket.io
- Express Validator
- Helmet
- CORS
- Rate Limiter

## Security

- JWT Authentication
- Password Hashing (Bcrypt)
- Helmet (HTTP Headers)
- Rate Limiting
- Input Validation
- XSS Protection
- MongoDB Sanitization
- CORS Configuration

## License

MIT License

## Support

For support, email info@sajhanet.com or call 01-5970000.
