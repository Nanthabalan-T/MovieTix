const pool = require('../config/database');

const checkDatabaseConnection = async () => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  checkDatabaseConnection
};
