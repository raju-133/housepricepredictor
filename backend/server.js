const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const predictionRoutes = require('./routes/predictionRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', healthRoutes);
app.use('/api', predictionRoutes);

// Root Health Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to House Price Predictor API',
    endpoints: {
      health: 'GET /api/health',
      predict: 'POST /api/predict',
      history: 'GET /api/predictions',
      predictionById: 'GET /api/predictions/:id',
      modelInfo: 'GET /api/model-info'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Requested API endpoint not found.'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.'
  });
});

// Database Connection & Server Listener
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI environment variable is missing in .env');
  process.exit(1);
}

console.log('Connecting to MongoDB Atlas...');
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas database!');
    app.listen(PORT, () => {
      console.log(`Express server running on http://localhost:${PORT}`);
      console.log(`ML Service target script: ml-service/predict.py`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Atlas Connection Error:', err.message);
    console.warn('Starting server in fallback mode (Predictions will process via ML script without persistence)...');
    app.listen(PORT, () => {
      console.log(`Express server running on http://localhost:${PORT} (DB Offline Fallback)`);
    });
  });
