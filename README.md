# Anonymous Wall

A full-stack anonymous message wall application where users can share their thoughts, questions, rants, or anything on their mind without registration or personal information.

## Features

### Frontend
- **Landing Page**: Welcoming interface with clear CTAs
- **Post Submission**: Anonymous post creation with optional tags
- **Wall/Feed**: Display all posts in reverse chronological order
- **Search & Filter**: Search posts by keywords and filter by tags
- **Reactions**: Anonymous reactions (like, love, laugh, wow, sad, angry)
- **Admin Panel**: Login-protected moderation interface
- **Dark/Light Mode**: Theme toggle for better UX
- **Responsive Design**: Works on all devices

### Backend
- **RESTful API**: Express.js backend with MongoDB
- **Security**: Rate limiting, input sanitization, XSS protection
- **Authentication**: JWT-based admin authentication
- **Analytics**: Post statistics and tag popularity
- **Moderation**: Admin can delete inappropriate posts

## Tech Stack

- **Frontend**: React, React Router, Vite, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Security**: Helmet, express-rate-limit, express-validator, express-mongo-sanitize
- **Authentication**: JWT (jsonwebtoken), bcryptjs

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd "lol for now"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/anonymous-wall
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Create Admin User

Run the setup script to create an admin user:

```bash
cd ../backend
node scripts/createAdmin.js
```

Or manually create an admin using MongoDB:

```javascript
// In MongoDB shell or Compass
use anonymous-wall
db.admins.insertOne({
  username: "admin",
  password: "$2a$10$..." // hashed password
})
```

To hash a password, you can use the script in `backend/scripts/createAdmin.js`.

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Linux/Mac
sudo systemctl start mongod
# or
mongod

# On Windows
net start MongoDB
```

### Start Backend Server

```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Posts
- `POST /api/posts` - Create a new post
- `GET /api/posts` - Get all posts (with pagination, filtering, search)
- `GET /api/posts/:id` - Get a single post
- `DELETE /api/posts/:id` - Delete a post (admin only)

### Tags
- `GET /api/tags` - Get all tags with counts

### Reactions
- `POST /api/react` - Add a reaction to a post

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify admin token
- `GET /api/admin/analytics` - Get analytics (admin only)

## Project Structure

```
.
├── backend/
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, rate limiting
│   ├── scripts/         # Utility scripts
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context
│   │   ├── services/    # API services
│   │   └── App.jsx      # Main app component
│   └── vite.config.js   # Vite configuration
└── README.md
```

## Security Features

- **Rate Limiting**: Prevents spam and abuse
- **Input Sanitization**: XSS protection via HTML escaping
- **MongoDB Injection Protection**: express-mongo-sanitize
- **Helmet**: Security headers
- **JWT Authentication**: Secure admin access
- **Password Hashing**: bcrypt for admin passwords

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Environment (development/production)

### Frontend (.env)
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Use a strong `JWT_SECRET`
3. Update `MONGODB_URI` to production database
4. Build frontend: `cd frontend && npm run build`
5. Serve frontend build with a web server (nginx, Apache, etc.)
6. Use PM2 or similar for backend process management

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!

