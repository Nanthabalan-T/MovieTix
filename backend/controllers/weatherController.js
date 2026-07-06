const { getWeather } = require('../services/weatherService');

// @desc    Get current weather
// @route   GET /api/weather
const getCurrentWeather = async (req, res) => {
  try {
    const weather = await getWeather();

    return res.status(200).json({
      success: true,
      data: weather
    });
  } catch (error) {
    console.error('Weather controller error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: error.message
    });
  }
};

module.exports = { getCurrentWeather };
