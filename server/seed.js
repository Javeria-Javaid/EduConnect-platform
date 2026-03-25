import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import School from './models/School.js';

dotenv.config({ path: './.env' }); // Root is where we run the command from

if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI not found in .env');
    process.exit(1);
}

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data (optional - safety first: only clear if explicitly told, but for a "pre-deployment audit" we usually want a clean slate)
    // await User.deleteMany({});
    // await School.deleteMany({});

    // 1. Create Admin User
    const adminExists = await User.findOne({ email: 'admin@educonnect.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@1234', salt);
      
      const admin = await User.create({
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@educonnect.com',
        passwordHash: hashedPassword,
        role: 'admin',
        provider: 'local'
      });
      console.log('Admin user created: admin@educonnect.com / Admin@1234');
    }

    // 2. Create a Vendor/School Admin to own the schools
    let schoolAdmin = await User.findOne({ email: 'school_admin@test.com' });
    if (!schoolAdmin) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('School@1234', salt);
        schoolAdmin = await User.create({
            firstName: 'Greenwood',
            lastName: 'Admin',
            email: 'school_admin@test.com',
            passwordHash: hashedPassword,
            role: 'school_admin'
        });
        console.log('School Admin created: school_admin@test.com / School@1234');
    }

    // 3. Create Sample Schools
    const schoolCount = await School.countDocuments();
    if (schoolCount === 0) {
      await School.insertMany([
        {
          name: 'Greenwood High School',
          address: '123 Education Lane',
          city: 'Mumbai',
          vendor: schoolAdmin._id,
          description: 'A leading institution focused on holistic development.',
          contactEmail: 'info@greenwood.edu',
          contactPhone: '123-456-7890',
          admissionOpen: true,
          fees: 50000,
          facilities: ['Library', 'Science Lab', 'Sports Ground']
        },
        {
          name: 'Sunrise Academy',
          address: '45 Sunshine Road',
          city: 'Delhi',
          vendor: schoolAdmin._id,
          description: 'Empowering students to reach their full potential.',
          contactEmail: 'contact@sunrise.edu',
          contactPhone: '987-654-3210',
          admissionOpen: false,
          fees: 35000,
          facilities: ['Art Room', 'Computer Lab', 'Cafeteria']
        },
        {
          name: 'Global International School',
          address: '78 Global Plaza',
          city: 'Mumbai',
          vendor: schoolAdmin._id,
          description: 'Excellence in international education.',
          contactEmail: 'admissions@global.edu',
          contactPhone: '555-0199',
          admissionOpen: true,
          fees: 120000,
          facilities: ['Swimming Pool', 'Auditorium', 'Smart Classes']
        }
      ]);
      console.log('Sample schools seeded.');
    }

    console.log('Seeding completed successfully.');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
