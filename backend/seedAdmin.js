require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await connectDB();

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
