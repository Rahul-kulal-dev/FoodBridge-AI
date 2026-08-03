const mongoose = require('mongoose');

const connectDB = async () => {
  // Disable query buffering so server responds immediately when DB is offline
  mongoose.set('bufferCommands', false);

  const connStr = process.env.MONGODB_URI;
  if (!connStr) {
    console.error('[MongoDB Error] MONGODB_URI is not set in backend/.env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB Atlas] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Atlas] Connection failed: ${error.message}`);
    console.error('Please ensure:');
    console.error('  1. Your MONGODB_URI in backend/.env is correct');
    console.error('  2. Your current IP is whitelisted in MongoDB Atlas → Network Access');
    console.error('  3. Your Atlas cluster is running');
    process.exit(1);
  }
};

module.exports = connectDB;
