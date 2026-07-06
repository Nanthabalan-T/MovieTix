const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getTheatreBookings,
  getLatestBookings,
  getSeatsAnalytics
} = require('../controllers/dashboardController');

// @route   GET /api/dashboard
// @desc    Get dashboard stats
router.get('/', getDashboardStats);

// @route   GET /api/dashboard/theatres
// @desc    Get theatre-wise booking count
router.get('/theatres', getTheatreBookings);

// @route   GET /api/dashboard/seats-analytics
// @desc    Get seats analytics by date (grouped by movie and show time)
router.get('/seats-analytics', getSeatsAnalytics);

// @route   GET /api/dashboard/latest
// @desc    Get latest 10 bookings
router.get('/latest', getLatestBookings);

module.exports = router;
