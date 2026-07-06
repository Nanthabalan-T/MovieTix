const pool = require('../config/database');

class Booking {

  static async findAll() {
    const query = 'SELECT * FROM bookings ORDER BY booking_id ASC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(bookingId) {
    const query = 'SELECT * FROM bookings WHERE booking_id = $1';
    const result = await pool.query(query, [bookingId]);
    return result.rows[0];
  }

  static async create(data) {
    const {
      movie_name,
      theatre_name,
      show_date,
      show_time,
      seat_number,
      customer_name,
      customer_phone,
      booking_amount
    } = data;

    const query = `
      INSERT INTO bookings 
        (movie_name, theatre_name, show_date, show_time, seat_number, customer_name, customer_phone, booking_amount, booking_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'BOOKED')
      RETURNING *
    `;

    const result = await pool.query(query, [
      movie_name,
      theatre_name,
      show_date,
      show_time,
      seat_number,
      customer_name,
      customer_phone,
      booking_amount
    ]);

    return result.rows[0];
  }

  static async update(bookingId, data) {
    const {
      customer_name,
      customer_phone,
      seat_number,
      booking_amount,
      booking_status
    } = data;

    const query = `
      UPDATE bookings 
      SET 
        customer_name = COALESCE($1, customer_name),
        customer_phone = COALESCE($2, customer_phone),
        seat_number = COALESCE($3, seat_number),
        booking_amount = COALESCE($4, booking_amount),
        booking_status = COALESCE($5, booking_status)
      WHERE booking_id = $6
      RETURNING *
    `;

    const result = await pool.query(query, [
      customer_name,
      customer_phone,
      seat_number,
      booking_amount,
      booking_status,
      bookingId
    ]);

    return result.rows[0];
  }

  static async delete(bookingId) {
    const query = 'DELETE FROM bookings WHERE booking_id = $1 RETURNING *';
    const result = await pool.query(query, [bookingId]);
    return result.rows[0];
  }

  static async findHistory(days = 7) {
    const query = `
      SELECT * FROM bookings 
      WHERE show_date >= CURRENT_DATE - ($1 || ' days')::INTERVAL 
      ORDER BY show_date DESC
    `;
    const result = await pool.query(query, [days]);
    return result.rows;
  }

  static async getDashboardStats() {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM bookings) AS "totalBookings",
        (SELECT COUNT(*) FROM bookings WHERE show_date::date = CURRENT_DATE) AS "todayBookings",
        (SELECT COUNT(*) FROM bookings WHERE show_date::date >= CURRENT_DATE - INTERVAL '7 days') AS "last7DaysBookings",
        (SELECT COALESCE(SUM(booking_amount), 0) FROM bookings) AS "totalRevenue"
    `;
    const result = await pool.query(query);
    const row = result.rows[0];
    return {
      totalBookings: parseInt(row.totalBookings) || 0,
      todayBookings: parseInt(row.todayBookings) || 0,
      last7DaysBookings: parseInt(row.last7DaysBookings) || 0,
      totalRevenue: parseFloat(row.totalRevenue) || 0
    };
  }

  static async getTheatreBookings() {
    const query = `
      SELECT theatre_name AS "theatre", COUNT(*)::int AS "bookings"
      FROM bookings
      GROUP BY theatre_name
      ORDER BY bookings DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getLatestBookings(limit = 10) {
    const query = `
      SELECT * FROM bookings
      ORDER BY created_at DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async getSeatsAnalytics(date) {
    const query = `
      SELECT 
        movie_name AS "movie",
        show_time AS "showTime",
        COUNT(*)::int AS "bookedSeats"
      FROM bookings
      WHERE show_date::date = $1::date AND booking_status = 'BOOKED'
      GROUP BY movie_name, show_time
      ORDER BY movie_name, show_time
    `;
    const result = await pool.query(query, [date]);
    return result.rows;
  }

  static async findBookedSeats(movieName, theatreName, showDate, showTime) {
    const query = `
      SELECT seat_number FROM bookings
      WHERE movie_name = $1 
        AND theatre_name = $2 
        AND show_date = $3 
        AND show_time = $4
        AND booking_status = 'BOOKED'
    `;
    const result = await pool.query(query, [movieName, theatreName, showDate, showTime]);
    return result.rows.map(row => row.seat_number);
  }

}

module.exports = Booking;
