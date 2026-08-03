const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Body parsers & CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/donations', require('./routes/donorRoutes'));
app.use('/api/ngo', require('./routes/ngoRoutes'));
app.use('/api/volunteer', require('./routes/volunteerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'FoodBridge-AI Node.js & Express API Backend is running',
    timestamp: new Date(),
  });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[FoodBridge-AI Server] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;