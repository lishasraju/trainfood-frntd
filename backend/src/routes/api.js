import express from 'express';
import authRoutes from './authRoutes.js';
import { getTrains, getTrainByNo, getAllStations } from '../controllers/trainController.js';
import { lookupPnr } from '../controllers/pnrController.js';
import { getRestaurantsByStation, getRestaurantDetails } from '../controllers/restaurantController.js';
import { createOrder, getOrderById, updateOrderStatus, getAllOrders } from '../controllers/orderController.js';
import { getCoupons, validateCoupon, getStats } from '../controllers/couponController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authentication & Users
router.use('/auth', authRoutes);

// Trains & Stations
router.get('/trains', getTrains);
router.get('/trains/:trainNo', getTrainByNo);
router.get('/stations', getAllStations);

// PNR
router.get('/pnr/:pnrNumber', lookupPnr);

// Restaurants & Menus
router.get('/stations/:stationCode/restaurants', getRestaurantsByStation);
router.get('/restaurants/:id', getRestaurantDetails);

// Orders
router.post('/orders', optionalAuth, createOrder);
router.get('/orders', getAllOrders);
router.get('/orders/:orderId', getOrderById);
router.patch('/orders/:orderId/status', updateOrderStatus);

// Coupons & Stats
router.get('/coupons', getCoupons);
router.post('/coupons/validate', validateCoupon);
router.get('/stats', getStats);

export default router;
