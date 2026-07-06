const Booking = require('../models/booking');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const stats = await Booking.getDashboardStats();

    return res.status(200).json({
      success: true,
      totalBookings: stats.totalBookings,
      todayBookings: stats.todayBookings,
      last7DaysBookings: stats.last7DaysBookings,
      totalRevenue: stats.totalRevenue
    });
  } catch (error) {
    console.error('Dashboard stats error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

// @desc    Get theatre-wise booking count
// @route   GET /api/dashboard/theatres
const getTheatreBookings = async (req, res) => {
  try {
    const data = await Booking.getTheatreBookings();

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Theatre bookings error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch theatre bookings',
      error: error.message
    });
  }
};

// @desc    Get latest 10 bookings
// @route   GET /api/dashboard/latest
const getLatestBookings = async (req, res) => {
  try {
    const data = await Booking.getLatestBookings(10);

    return res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('Latest bookings error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch latest bookings',
      error: error.message
    });
  }
};

// @desc    Get seats analytics grouped by movie and show time for a date
// @route   GET /api/dashboard/seats-analytics
const getSeatsAnalytics = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required (YYYY-MM-DD)'
      });
    }
    const data = await Booking.getSeatsAnalytics(date);
    return res.status(200).json({
      success: true,
      date,
      data
    });
  } catch (error) {
    console.error('Seats analytics error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch seats analytics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getTheatreBookings,
  getLatestBookings,
  getSeatsAnalytics
};
