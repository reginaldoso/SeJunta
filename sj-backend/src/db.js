const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://sj:sjpass@localhost:5432/sjdb'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
