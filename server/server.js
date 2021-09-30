const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./routes');

const server = express();

// Middleware
server.use(morgan('dev'));
server.use(cors());
server.use(express.json());
server.use('/api/products', router);

module.exports = server;
