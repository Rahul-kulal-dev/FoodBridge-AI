require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(connStr);
    console.log('Connected to MongoDB Atlas.');

    const adminEmail = 'admin@gmail.com';
    const password = 'admin@gmail.com';

    let user = await User.findOne({ email: adminEmail });
    if (user) {
      user.password = password;
      user.role = 'admin';
      user.user_role = 'admin';
      user.verificationStatus = 'approved';
      await user.save();
      console.log(`Updated admin account for ${adminEmail}`);
    } else {
      user = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password,
        role: 'admin',
        user_role: 'admin',
        verificationStatus: 'approved',
        phone: '1234567890',
        address: 'Headquarters',
        organizationName: 'FoodBridge AI',
      });
      console.log(`Created admin account for ${adminEmail}`);
    }

    console.log('Admin seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
