const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodbridge_ai';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Atlas] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Atlas] Initial connection error: ${error.message}`);
    console.warn('[MongoDB Atlas] Attempting fallback to local MongoDB instance...');
    try {
      const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/foodbridge_ai', {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`[MongoDB Local] Fallback connection established: ${localConn.connection.host}`);
    } catch (localErr) {
      console.error('[MongoDB Error] Database connection failed:', localErr.message);
      console.error('Please ensure your MONGODB_URI in backend/.env is valid and reachable.');
    }
  }
};

module.exports = connectDB;
