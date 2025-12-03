const express = require('express');
const router = express.Router();
const Booking = require('../models/inquiry/Booking');
const { isAdmin } = require('../middleware/auth');
const { broadcast } = require('../notifications/bus');

// GET /api/bookings - (Admin only) Fetch all bookings
router.get('/', isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ _id: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// POST /api/bookings - Submit a booking form
router.post('/', async (req, res) => {
  try {
    const { clientName, email, phone, serviceType, message } = req.body;
    
    // Validate required fields
    if (!clientName || !email || !phone) {
      return res.status(400).json({ message: 'Missing required fields: clientName, email, phone' });
    }

    const newBooking = new Booking({
      clientName,
      email,
      phone,
      serviceType,
      message,
      status: 'Pending'
    });

    const savedBooking = await newBooking.save();
    // Broadcast SSE notification to admin listeners
    try { broadcast('booking:new', { booking: savedBooking }); } catch (e) {}
    res.status(201).json({ 
      message: 'Booking submitted successfully', 
      booking: savedBooking 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting booking', error: error.message });
  }
});

module.exports = router;
 
// PATCH /api/bookings/:id/status - (Admin only) Update booking status
router.patch('/:id/status', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expected: 'Pending' | 'Completed'
    if (!status || !['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use Pending or Completed.' });
    }
    const updated = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Booking not found' });
    try { broadcast('booking:status', { booking: updated }); } catch (e) {}
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
});

// DELETE /api/bookings/:id - (Admin only) Delete a booking
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully', booking: deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
});
