const { Pool } = require('pg');
const {
  USERNAME,
  HOST,
  PORT,
  DATABASE,
} = require('./config');

const pool = new Pool({
  user: USERNAME,
  host: HOST,
  port: PORT,
  database: DATABASE,
});

module.exports = pool;
