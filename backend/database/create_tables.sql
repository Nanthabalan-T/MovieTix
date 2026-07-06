-- Create Database (run this only once, outside this script)
-- CREATE DATABASE "MovieTBsys";

-- Connect to the database
-- \c "MovieTBsys";

-- Create Movies Table
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    language VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    certificate VARCHAR(10),
    release_date TIMESTAMP,
    poster TEXT,
    description TEXT,
    rating VARCHAR(10),
    year INTEGER,
    status VARCHAR(50) DEFAULT 'Now Showing',
    trending BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    booking_id SERIAL PRIMARY KEY,
    movie_name VARCHAR(255) NOT NULL,
    theatre_name VARCHAR(255) NOT NULL,
    show_date DATE NOT NULL,
    show_time VARCHAR(50) NOT NULL,
    seat_number VARCHAR(20) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    booking_amount DECIMAL(10, 2) NOT NULL,
    booking_status VARCHAR(50) DEFAULT 'BOOKED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_movies_status ON movies(status);
CREATE INDEX IF NOT EXISTS idx_movies_trending ON movies(trending);
CREATE INDEX IF NOT EXISTS idx_movies_featured ON movies(featured);
CREATE INDEX IF NOT EXISTS idx_bookings_show_date ON bookings(show_date);
CREATE INDEX IF NOT EXISTS idx_bookings_theatre_name ON bookings(theatre_name);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
