const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 100, // Optimize for high concurrent users
      wtimeoutMS: 5000,
      useNewUrlParser: true
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
