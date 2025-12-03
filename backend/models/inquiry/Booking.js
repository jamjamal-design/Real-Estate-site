const mongoose = require('mongoose');
const BookingSchema = new mongoose.Schema({
  clientName: String,
  email: String,
  phone: String,
  serviceType: String, // e.g., "Site Inspection", "Purchase", "Management"
  message: String,
  status: { type: String, default: 'Pending' }
});
module.exports = mongoose.model('Booking', BookingSchema);