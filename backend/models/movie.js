const pool = require('../config/database');

class Movie {

  static async findAll() {
    const query = 'SELECT * FROM movies ORDER BY id ASC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM movies WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByStatus(status) {
    const query = 'SELECT * FROM movies WHERE status = $1 ORDER BY id ASC';
    const result = await pool.query(query, [status]);
    return result.rows;
  }

  static async findTrending() {
    const query = 'SELECT * FROM movies WHERE trending = true ORDER BY id ASC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findFeatured() {
    const query = 'SELECT * FROM movies WHERE featured = true ORDER BY id ASC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async search(searchTerm) {
    const query = `
      SELECT * FROM movies 
      WHERE title ILIKE $1 OR genre ILIKE $1 OR language ILIKE $1
      ORDER BY id ASC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

}

module.exports = Movie;
