const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined. Check your .env file.');
    }

    console.log('🔄 Connecting to MongoDB...');
    console.log(`📍 URI: ${process.env.MONGO_URI.split('?')[0]}`);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
    });
    
    console.log(`✓ MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`);
    console.log(`✓ Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`✗ MongoDB connection error: ${error.message}`);
    console.error('💡 Troubleshooting tips:');
    console.error('  1. Ensure MongoDB is running: mongod or MongoDB Atlas is accessible');
    console.error('  2. Check MONGO_URI in .env file');
    console.error('  3. Verify network connectivity');
    console.error('  4. Check firewall/VPN settings');
    throw error;
  }
};

module.exports = connectDB;
