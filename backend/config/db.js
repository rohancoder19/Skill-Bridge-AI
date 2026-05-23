const mongoose = require('mongoose');
const User = require('../models/User');

let mongod = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    let conn;
    
    if (mongoUri) {
      console.log(`Connecting to specified MONGO_URI...`);
      conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      // Attempt to connect to local default MongoDB first
      try {
        console.log('Attempting connection to local default MongoDB at 127.0.0.1:27017...');
        conn = await mongoose.connect('mongodb://127.0.0.1:27017/skillbridge_ai', {
          serverSelectionTimeoutMS: 2500, 
        });
        console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
      } catch (localErr) {
        console.warn('Local MongoDB connection refused. Spinning up mongodb-memory-server...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        console.log(`In-Memory MongoDB Server started at: ${uri}`);
        
        conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);
      }
    }

    // Auto-seed if database is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found in database. Running auto-seeding script...');
      const seedDB = require('../scripts/seed');
      await seedDB();
      console.log('Auto-seeding completed!');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

