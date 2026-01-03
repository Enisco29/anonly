# Quick Start Guide

Follow these steps to get the Anonymous Wall application running:

## 1. Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## 2. Set Up Environment Variables

### Backend
Copy `.env.example` to `.env` in the `backend` directory:
```bash
cd backend
cp .env.example .env
```

Edit `.env` and update:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A random secret string for JWT tokens

### Frontend (Optional)
Copy `.env.example` to `.env` in the `frontend` directory if you need to change the API URL:
```bash
cd frontend
cp .env.example .env
```

## 3. Start MongoDB

Make sure MongoDB is running:

**Linux:**
```bash
sudo systemctl start mongod
```

**Mac:**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
net start MongoDB
```

Or use MongoDB Atlas (cloud) and update `MONGODB_URI` in `.env`.

## 4. Create Admin User

```bash
cd backend
node scripts/createAdmin.js [username] [password]
```

Example:
```bash
node scripts/createAdmin.js admin mypassword123
```

If no arguments provided, defaults to:
- Username: `admin`
- Password: `admin123`

## 5. Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

Backend will run on `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

## 6. Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## Default Admin Credentials

If you used the default admin creation:
- Username: `admin`
- Password: `admin123`

**⚠️ Change this password immediately after first login!**

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change `PORT` in backend `.env`
- Update `VITE_API_URL` in frontend `.env` if you changed the backend port

### CORS Errors
- Make sure backend is running before starting frontend
- Check that API URL in frontend `.env` matches backend URL

## Next Steps

1. Visit http://localhost:3000
2. Click "Post a Message" to create your first post
3. View posts on the "View Wall" page
4. Access admin panel at http://localhost:3000/admin

Enjoy your anonymous wall! 🎉

