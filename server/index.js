// const express = require('express');
// const router = express.Router();
// const Booking = require('../models/inquiry/Booking');
// const mongoose = require('mongoose');
// const Property = require('../models/property/Property');
// const { isAdmin } = require('../middleware/auth');
// const cors = require('cors');
// const PORT = process.env.PORT || 5000;
// const app = express();
// const dotenv = require('dotenv');
// dotenv.config();
// const monog = process.env.MONGODB_URI || 'mongodb://localhost:3000/real-estate';

// // Middleware
// router.use(cors());
// router.use(express.json());
// router.use(express.urlencoded({ extended: true }));

// // Use routes
// app.use('/api/properties', propertyRoutes);
// app.use('/api/bookings', bookingRoutes);



// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:3000/real-estate', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('✅ MongoDB connected successfully'))
// .catch((err) => console.error('❌ MongoDB connection error:', err));

// // Import routes
// const propertyRoutes = require('./routes/propertyRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');


// // Health check route
// app.get('/', (req, res) => {
//   res.json({ message: 'Real Estate API is running' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!', error: err.message });
// });

// // Start server
// app.listen(PORT, () => {
  
// });