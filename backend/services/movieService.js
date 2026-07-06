const Movie = require('../models/movie');

class MovieService {

  static async getAllMovies() {
    return await Movie.findAll();
  }

  static async getMovieById(id) {
    return await Movie.findById(id);
  }

  static async getMoviesByStatus(status) {
    return await Movie.findByStatus(status);
  }

  static async getTrendingMovies() {
    return await Movie.findTrending();
  }

  static async getFeaturedMovies() {
    return await Movie.findFeatured();
  }

  static async searchMovies(searchTerm) {
    return await Movie.search(searchTerm);
  }

}

module.exports = MovieService;
