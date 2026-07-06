const MovieService = require('../services/movieService');

// @desc    Get all movies
// @route   GET /api/movies
const getAllMovies = async (req, res) => {
  try {
    const { status, trending, featured, search } = req.query;

    let movies;
    if (search) {
      movies = await MovieService.searchMovies(search);
    } else if (trending === 'true') {
      movies = await MovieService.getTrendingMovies();
    } else if (featured === 'true') {
      movies = await MovieService.getFeaturedMovies();
    } else if (status) {
      movies = await MovieService.getMoviesByStatus(status);
    } else {
      movies = await MovieService.getAllMovies();
    }

    return res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    console.error('Get movies error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch movies',
      error: error.message
    });
  }
};

// @desc    Get movie by ID
// @route   GET /api/movies/:id
const getMovieById = async (req, res) => {
  try {
    const movie = await MovieService.getMovieById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Get movie error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch movie',
      error: error.message
    });
  }
};

module.exports = {
  getAllMovies,
  getMovieById
};
