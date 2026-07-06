const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getMovieById
} = require('../controllers/movieController');

// @route   GET /api/movies
// @desc    Get all movies (supports ?status=, ?trending=, ?featured=, ?search=)
router.get('/', getAllMovies);

// @route   GET /api/movies/:id
// @desc    Get movie by ID
router.get('/:id', getMovieById);

module.exports = router;
