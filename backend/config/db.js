const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI ? process.env.MONGO_URI.trim() : '';
    if (!uri) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10s timeout instead of default 30s
      socketTimeoutMS: 45000,
    });

    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);

    // Monitor connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.error('');
    console.error('🔧 Troubleshooting steps:');
    console.error('   1. Go to https://cloud.mongodb.com → Network Access → Add IP Address → Allow your current IP');
    console.error('   2. Check your MONGO_URI in backend/.env is correct');
    console.error('   3. Make sure your Atlas cluster is not paused (free tier pauses after inactivity)');
    process.exit(1);
  }
};

module.exports = connectDB;
