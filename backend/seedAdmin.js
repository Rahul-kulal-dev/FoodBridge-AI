require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(connStr);
    console.log('Connected to MongoDB Atlas.');

    const adminEmails = ['admin@gmail.com', 'admin@gmail.com'];
    const password = 'admin@gmail';

    for (const email of adminEmails) {
      let user = await User.findOne({ email });
      if (user) {
        user.password = password;
        user.role = 'admin';
        user.user_role = 'admin';
        user.verificationStatus = 'approved';
        await user.save();
        console.log(`Updated admin account for ${email}`);
      } else {
        user = await User.create({
          name: 'System Admin',
          email,
          password,
          role: 'admin',
          user_role: 'admin',
          verificationStatus: 'approved',
          phone: '1234567890',
          address: 'Headquarters',
          organizationName: 'FoodBridge AI',
        });
        console.log(`Created admin account for ${email}`);
      }
    }

    console.log('Admin seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
