const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI ? process.env.MONGO_URI.trim() : '';
    const conn = await mongoose.connect(uri);
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Tip: Check if your IP is whitelisted in Atlas and if your username/password in .env are correct.');
    process.exit(1);
  }
};

module.exports = connectDB;
