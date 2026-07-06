const express = require('express');
const router = express.Router();
const { getCurrentWeather } = require('../controllers/weatherController');

// @route   GET /api/weather
// @desc    Get current weather for Madurai
router.get('/', getCurrentWeather);

module.exports = router;
