const Booking = require('../models/booking');

// @desc    Get all bookings
// @route   GET /api/bookings
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll();

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const {
      movie_name,
      theatre_name,
      show_date,
      show_time,
      seat_number,
      customer_name,
      customer_phone,
      booking_amount
    } = req.body;

    if (!movie_name || !theatre_name || !show_date || !show_time || !seat_number || !customer_name || !customer_phone || !booking_amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: movie_name, theatre_name, show_date, show_time, seat_number, customer_name, customer_phone, booking_amount'
      });
    }

    const existingBookedSeats = await Booking.findBookedSeats(movie_name, theatre_name, show_date, show_time);
    if (existingBookedSeats.includes(seat_number)) {
      return res.status(409).json({
        success: false,
        message: `Seat ${seat_number} is already booked for this show. Please select a different seat.`
      });
    }

    const booking = await Booking.create({
      movie_name,
      theatre_name,
      show_date,
      show_time,
      seat_number,
      customer_name,
      customer_phone,
      booking_amount
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
const updateBooking = async (req, res, next) => {
  try {
    const existingBooking = await Booking.findById(req.params.id);

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const {
      customer_name,
      customer_phone,
      seat_number,
      booking_amount,
      booking_status
    } = req.body;

    const booking = await Booking.update(req.params.id, {
      customer_name,
      customer_phone,
      seat_number,
      booking_amount,
      booking_status
    });

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
const deleteBooking = async (req, res, next) => {
  try {
    const existingBooking = await Booking.findById(req.params.id);

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await Booking.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking history
// @route   GET /api/bookings/history?days=7
const getBookingHistory = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;

    if (days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        message: 'Days must be between 1 and 365'
      });
    }

    const bookings = await Booking.findHistory(days);

    const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.booking_amount), 0);

    res.status(200).json({
      success: true,
      days: days,
      count: bookings.length,
      totalRevenue: totalRevenue,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booked seats for a specific show
// @route   GET /api/bookings/seats
const getBookedSeats = async (req, res, next) => {
  try {
    const { movie_name, theatre_name, show_date, show_time } = req.query;

    if (!movie_name || !theatre_name || !show_date || !show_time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide movie_name, theatre_name, show_date, and show_time'
      });
    }

    const bookedSeats = await Booking.findBookedSeats(movie_name, theatre_name, show_date, show_time);

    res.status(200).json({
      success: true,
      count: bookedSeats.length,
      data: bookedSeats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingHistory,
  getBookedSeats
};
