const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./db');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());

// Import routes
app.use('/api/posts', require('./posts'));
app.use('/api/tags', require('./tags'));
app.use('/api/admin', require('./admin'));
app.use('/api/react', require('./reactions'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Vercel serverless function handler
module.exports = async (req, res) => {
  // Connect to MongoDB (connection is cached for subsequent requests)
  try {
    await connectDB();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  // Handle the request with Express app
  return app(req, res);
};

