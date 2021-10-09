const { Pool } = require('pg');
const {
  USERNAME,
  HOST,
  PORT,
  DATABASE,
} = require('../config');

const pool = new Pool({
  user: USERNAME || 'ubuntu',
  host: HOST || 'ec2-3-22-187-124.us-east-2.compute.amazonaws.com', // dns of pg server
  port: PORT || 5432,
  database: DATABASE || 'sdc_products',
  password: null || 'AAB48e1a',
  max: 20,
});

// make sure connection exists with postgresql db
pool.connect((err) => {
  if (err) console.error('couldn\'t connect :(', err);
  else console.log('sdc products-related database connected!');
});

module.exports = pool;
