require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Uncomment when packages are installed:
// const helmet = require('helmet');
// const compression = require('compression');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');

const app = express();

// Security Headers - Uncomment when helmet is installed
// app.use(helmet());

// Compression - Uncomment when compression is installed
// app.use(compression());

// HTTP Request Logging - Uncomment when morgan is installed
// if (process.env.NODE_ENV === 'production') {
//   app.use(morgan('combined'));
// } else {
//   app.use(morgan('dev'));
// }

// Rate Limiting - Uncomment when express-rate-limit is installed
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// const adminLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 20, // Stricter limit for admin routes
//   message: 'Too many admin requests, please try again later.'
// });
// app.use('/api/', limiter);
// app.use('/api/admin', adminLimiter);

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate')
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Import routes
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Use routes
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/projects', projectRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Real Estate API is running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Enhanced Error Handling Middleware
app.use((err, req, res, next) => {
  // Log error details
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip,
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  };
  
  console.error('🔥 ERROR:', JSON.stringify(errorLog, null, 2));

  // Send appropriate response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ 
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
