const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anonymous-wall');
    console.log('Connected to MongoDB');

    // Get username and password from command line arguments
    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`Admin with username "${username}" already exists.`);
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({ username, password });
    await admin.save();

    console.log(`\n✅ Admin created successfully!`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}\n`);
    console.log('⚠️  Please change the default password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

