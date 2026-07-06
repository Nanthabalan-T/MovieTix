const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingHistory,
  getBookedSeats
} = require('../controllers/bookingController');

// @route   GET /api/bookings
// @desc    Get all bookings
router.get('/', getAllBookings);

// @route   GET /api/bookings/history
// @desc    Get booking history by days
router.get('/history', getBookingHistory);

// @route   GET /api/bookings/seats
// @desc    Get booked seats for a specific show
router.get('/seats', getBookedSeats);

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
router.get('/:id', getBookingById);

// @route   POST /api/bookings
// @desc    Create new booking
router.post('/', createBooking);

// @route   PUT /api/bookings/:id
// @desc    Update booking
router.put('/:id', updateBooking);

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
router.delete('/:id', deleteBooking);

module.exports = router;
