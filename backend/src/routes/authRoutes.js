import express from 'express';
import { login, register, getMe, updateProfile, getMyOrders, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth endpoints
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

// Authenticated user endpoints
router.get('/me', authenticateToken, getMe);
router.patch('/profile', authenticateToken, updateProfile);
router.get('/my-orders', authenticateToken, getMyOrders);

export default router;
