import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UserModel } from '../models/User.js';
import { TrainModel } from '../models/Train.js';
import { StationModel } from '../models/Station.js';
import { RestaurantModel } from '../models/Restaurant.js';
import { MenuItemModel } from '../models/MenuItem.js';
import { CouponModel } from '../models/Coupon.js';
import { PnrRecordModel } from '../models/PnrRecord.js';
import { hashPassword } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isConnected = false;

export async function connectMongoDB() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    console.log('ℹ️ No MONGODB_URI provided in environment. Using embedded database engine.');
    return false;
  }

  if (isConnected) {
    return true;
  }

  try {
    console.log('🔌 Connecting to MongoDB Cluster...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('✅ MongoDB connected successfully to database:', mongoose.connection.name);

    // Auto-seed initial data if collections are empty
    await seedMongoDBIfEmpty();

    return true;
  } catch (error) {
    console.warn('⚠️ MongoDB connection warning:', error.message);
    console.log('🔄 Fallback: Seamlessly continuing with persistent JSON database engine.');
    return false;
  }
}

export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

// Auto seed MongoDB from seed_data.json
async function seedMongoDBIfEmpty() {
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('🌱 MongoDB empty, initiating automatic seed migration...');
      
      const seedPaths = [
        path.resolve(__dirname, '../../database/seed_data.json'),
        path.resolve(__dirname, '../../../database/seed_data.json')
      ];

      let seedData = null;
      for (const p of seedPaths) {
        if (fs.existsSync(p)) {
          seedData = JSON.parse(fs.readFileSync(p, 'utf-8'));
          break;
        }
      }

      if (seedData) {
        if (seedData.trains?.length) await TrainModel.insertMany(seedData.trains);
        if (seedData.stations?.length) await StationModel.insertMany(seedData.stations);
        if (seedData.restaurants?.length) await RestaurantModel.insertMany(seedData.restaurants);
        if (seedData.menu_items?.length) await MenuItemModel.insertMany(seedData.menu_items);
        if (seedData.coupons?.length) await CouponModel.insertMany(seedData.coupons);
        if (seedData.pnr_records?.length) await PnrRecordModel.insertMany(seedData.pnr_records);

        // Seed default users (Passenger & Admin)
        const userHash = hashPassword('user123');
        const adminHash = hashPassword('admin123');

        await UserModel.create([
          {
            id: 'user-001',
            name: 'Rahul Sharma',
            email: 'rahul@railbite.in',
            phone: '+91 98765 43210',
            role: 'user',
            salt: userHash.salt,
            password_hash: userHash.hash,
            pnr: '2485961034',
            coach: 'B3',
            berth: '42',
            berth_type: 'LB',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
          },
          {
            id: 'admin-001',
            name: 'Vikram Malhotra',
            email: 'admin@railbite.in',
            phone: '+91 99887 76655',
            role: 'admin',
            designation: 'IRCTC Station Pantry Officer',
            station_code: 'BRC',
            station_name: 'Vadodara Junction',
            salt: adminHash.salt,
            password_hash: adminHash.hash,
            permissions: ['manage_orders', 'manage_restaurants', 'manage_menu', 'view_analytics', 'dispatch_pantry', 'refund_control'],
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
          }
        ]);

        console.log('✅ MongoDB database successfully seeded with trains, stations, menus, and demo users.');
      }
    }
  } catch (err) {
    console.error('Seed migration notice:', err.message);
  }
}

export default connectMongoDB;
