require('dotenv').config();
const mongoose = require('mongoose');

const diagnose = async () => {
  console.log('\n🔍 Invu Backend Diagnostic Report\n');
  console.log('=' .repeat(50));

  // Check environment variables
  console.log('\n📋 Environment Variables:');
  console.log('─'.repeat(50));
  const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      const display = varName === 'MONGO_URI' 
        ? value.split('?')[0] 
        : varName === 'JWT_SECRET'
        ? '***' + value.slice(-4)
        : value;
      console.log(`✓ ${varName} = ${display}`);
    } else {
      console.log(`✗ ${varName} = NOT SET`);
    }
  });

  // Check Node.js version
  console.log('\n📦 Dependencies:');
  console.log('─'.repeat(50));
  console.log(`Node.js: ${process.version}`);
  console.log(`Mongoose: ${require('mongoose/package.json').version}`);
  console.log(`Express: ${require('express/package.json').version}`);

  // Test MongoDB connection
  console.log('\n🗄️  MongoDB Connection Test:');
  console.log('─'.repeat(50));
  
  if (!process.env.MONGO_URI) {
    console.log('✗ MONGO_URI not configured');
    console.log('   Create .env file with: MONGO_URI=mongodb://localhost:27017/invu_expense_tracker');
  } else {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      console.log(`✓ Connected to ${conn.connection.host}:${conn.connection.port}`);
      console.log(`✓ Database: ${conn.connection.name}`);
      
      // Check collections
      const collections = await conn.connection.db.listCollections().toArray();
      console.log(`✓ Collections: ${collections.length}`);
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
      
      await mongoose.disconnect();
    } catch (err) {
      console.log(`✗ Connection failed: ${err.message}`);
      console.log('\n💡 Solutions:');
      console.log('  1. Start MongoDB: mongod');
      console.log('  2. Or use MongoDB Atlas: Update MONGO_URI in .env');
      console.log('  3. Check network connectivity');
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✓ Diagnostic complete\n');
  process.exit(0);
};

diagnose().catch(err => {
  console.error('Diagnostic error:', err);
  process.exit(1);
});
