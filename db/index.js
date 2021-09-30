const { Pool } = require('pg');
const {
  USERNAME,
  HOST,
  PORT,
  DATABASE,
} = require('../config');

const pool = new Pool({
  user: USERNAME,
  host: HOST,
  port: PORT,
  database: DATABASE,
});

// make sure connection exists with postgresql db
pool.connect((err) => {
  if (err) console.error('couldn\'t connect :(', err);
  else console.log('sdc products-related database connected!');
});

module.exports = pool;
