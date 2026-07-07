const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const pool = require('./config/database');
const { connectRedis, redisClient } = require('./config/redis');
const { getNextTheatreStatus } = require('./services/theatreStatusService');
const {
  initializeWebSocket,
  broadcastTheatreStatus
} = require('./services/websocketService');

const bookingRoutes = require('./routes/bookingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const movieRoutes = require('./routes/movieRoutes');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5005;

// ===============================
// PostgreSQL Connection
// ===============================
async function connectDatabase() {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL Connected Successfully");
    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL Connection Failed");
    console.error(err.message);
    process.exit(1);
  }
}

// ===============================
// Middleware
// ===============================
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://movie-tix.onrender.com'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Request Logger
// ===============================
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ===============================
// Routes
// ===============================
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ===============================
// Health Check
// ===============================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MovieTBsys API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ===============================
// API Info
// ===============================
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'MovieTBsys API',
    version: '1.0.0',
    endpoints: {
      movies: '/api/movies',
      bookings: '/api/bookings',
      dashboard: '/api/dashboard',
      health: '/api/health'
    }
  });
});

// ===============================
// 404 Handler
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ===============================
// Error Handler
// ===============================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

// ===============================
// Start Server
// ===============================
async function startServer() {
  await connectDatabase();
  await connectRedis();

  const server = http.createServer(app);

  // Start WebSocket Server
  initializeWebSocket(server);

  // Update Redis every 5 seconds
  setInterval(async () => {
    try {
      const theatreStatus = getNextTheatreStatus();

      await redisClient.set(
        'live_theatre_status',
        JSON.stringify(theatreStatus)
      );

      // Broadcast to all connected clients
      broadcastTheatreStatus(theatreStatus);

      console.log(`📡 Live Theatre Updated : ${theatreStatus.theatre}`);

    } catch (err) {
      console.error("❌ Redis Update Error:", err.message);
    }
  }, 5000);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {

      console.error(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);

      const newPort = PORT + 1;
      const fallbackServer = http.createServer(app);

      initializeWebSocket(fallbackServer);

      fallbackServer.on('error', (fallbackErr) => {
        console.error(`❌ Could not start server on port ${newPort}:`, fallbackErr.message);
        process.exit(1);
      });

      fallbackServer.listen(newPort, () => {
        console.log(`
====================================
 MovieTBsys Backend Server (Fallback)
====================================
 Environment : ${process.env.NODE_ENV}
 Port        : ${newPort}
 URL         : http://localhost:${newPort}
 API         : http://localhost:${newPort}/api
 Health      : http://localhost:${newPort}/api/health
====================================
`);
      });

    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });

  server.listen(PORT, () => {
    console.log(`
====================================
 MovieTBsys Backend Server
====================================
 Environment : ${process.env.NODE_ENV}
 Port        : ${PORT}
 URL         : http://localhost:${PORT}
 API         : http://localhost:${PORT}/api
 Health      : http://localhost:${PORT}/api/health
====================================
`);
  });
}

startServer();

module.exports = app;