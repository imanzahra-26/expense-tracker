// ============================================
// DATABASE CONNECTION — MySQL Pool
// ============================================

// SECTION 1: Imports
const mysql = require('mysql2');              // MySQL driver
require('dotenv').config();                   // Load .env variables

// SECTION 2: Create connection pool
// A "pool" reuses connections instead of opening a new one for every query.
// Much faster and safer under load.
const pool = mysql.createPool({
  host:     process.env.DB_HOST,              // localhost
  user:     process.env.DB_USER,              // root
  password: process.env.DB_PASSWORD,          // from .env
  database: process.env.DB_NAME,              // expense_tracker
  waitForConnections: true,                   // Queue queries if pool is full
  connectionLimit: 10,                        // Max 10 simultaneous connections
  queueLimit: 0                               // 0 = no limit on queue
});

// SECTION 3: Use promise-based pool (so we can use async/await)
const promisePool = pool.promise();

// SECTION 4: Quick connection test
(async () => {
  try {
    const [rows] = await promisePool.query('SELECT 1'); // Simple test query
    console.log('✅ MySQL connected successfully');
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
  }
})();

// SECTION 5: Export the pool
module.exports = promisePool;                 // Other files can now `require('./config/db')`