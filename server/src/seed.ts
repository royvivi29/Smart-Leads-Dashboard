import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Lead from './models/Lead';
import { UserRole, LeadStatus, LeadSource } from './types';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-leads';

const leadNames = [
  'Rahul Sharma', 'Priya Patel', 'Ankit Verma', 'Sneha Gupta',
  'Vikram Singh', 'Neha Joshi', 'Arjun Reddy', 'Kavita Nair',
  'Rohan Desai', 'Meera Iyer', 'Amit Kapoor', 'Divya Menon',
  'Saurabh Tiwari', 'Pooja Rao', 'Karan Malhotra', 'Ritika Das',
  'Manish Jain', 'Swati Kulkarni', 'Deepak Choudhary', 'Anjali Bhatt',
  'Nikhil Saxena', 'Tanvi Agarwal', 'Rajesh Kumar', 'Simran Kaur',
  'Harsh Pandey',
];

const statuses = Object.values(LeadStatus);
const sources = Object.values(LeadSource);

const seed = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@smartleads.com',
      password: 'admin123',
      role: UserRole.Admin,
    });

    // Create sales user
    const sales = await User.create({
      name: 'Sales User',
      email: 'sales@smartleads.com',
      password: 'sales123',
      role: UserRole.Sales,
    });

    console.log('Created users');

    // Create leads with varied dates
    const leads = leadNames.map((name, i) => {
      const daysAgo = Math.floor(Math.random() * 60);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      return {
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        status: statuses[i % statuses.length],
        source: sources[i % sources.length],
        createdBy: i % 3 === 0 ? admin._id : sales._id,
        createdAt,
        updatedAt: createdAt,
      };
    });

    await Lead.insertMany(leads);
    console.log(`Seeded ${leads.length} leads`);

    console.log('\n── Demo Credentials ──');
    console.log('Admin:  admin@smartleads.com / admin123');
    console.log('Sales:  sales@smartleads.com / sales123');

    await mongoose.disconnect();
    console.log('\nDone.');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
