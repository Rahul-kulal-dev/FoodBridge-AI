const mongoose = require('mongoose');

/**
 * Global connection cache across serverless function invocations & hot reloads.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Return existing connection if readyState is connected (1)
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Await existing connection promise if currently connecting (2)
  if (cached.promise && (mongoose.connection.readyState === 2 || mongoose.connection.readyState === 1)) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  const connStr = process.env.MONGODB_URI;
  if (!connStr) {
    const errorMsg = '[MongoDB Error] MONGODB_URI is not set in environment variables';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
  };

  cached.promise = mongoose.connect(connStr, opts).then((mongooseInstance) => {
    console.log(`[MongoDB Atlas] Connected successfully: ${mongooseInstance.connection.host}`);
    return mongooseInstance;
  }).catch((err) => {
    cached.promise = null;
    console.error(`[MongoDB Atlas] Connection failed: ${err.message}`);
    throw err;
  });

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;

