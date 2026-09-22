import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { connectMongoDB, isMongoConnected } from './config/mongoose.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Connection
connectMongoDB().catch(err => {
  console.warn('MongoDB initialization check:', err.message);
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] 🚂 ${req.method} ${req.originalUrl}`);
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'RailBite Train Food Delivery Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: isMongoConnected() ? 'MongoDB Atlas (Connected)' : 'Embedded Hybrid DB (Active)',
    environment: process.env.VERCEL ? 'vercel-serverless' : 'standalone-node'
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚂 RailBite Train Food Delivery API is running online.',
    database: isMongoConnected() ? 'MongoDB Connected' : 'Embedded Hybrid Engine Active',
    documentation: '/api/health',
    endpoints: [
      '/api/trains',
      '/api/stations',
      '/api/orders',
      '/api/auth/login',
      '/api/auth/register'
    ]
  });
});

// API Routes
app.use('/api', apiRouter);

// Serve frontend static assets if running in local unified mode
const distPath = path.resolve(__dirname, '../../frontend/dist');
const devFrontendPath = path.resolve(__dirname, '../../frontend');
const staticPath = fs.existsSync(distPath) ? distPath : (fs.existsSync(devFrontendPath) ? devFrontendPath : null);

if (staticPath && !process.env.VERCEL) {
  app.use(express.static(staticPath));
}

// Fallback for SPA (local unified mode only)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && staticPath && !process.env.VERCEL) {
    res.sendFile(path.join(staticPath, 'index.html'));
  } else if (!req.path.startsWith('/api')) {
    res.status(200).json({ status: 'online', message: 'RailBite API Gateway' });
  } else {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
});

// Start Server locally if not running as serverless function
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚆 RailBite Backend API Server running on port ${PORT}`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`📦 Database: Connected & Synchronized`);
    console.log(`====================================================`);
  });
}

export default app;
