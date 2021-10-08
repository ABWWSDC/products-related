const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
// const compression = require('compression');
const router = require('./routes');

// for frontend
const PUBLIC_DIR = path.resolve(__dirname, '..', 'client', 'dist');
const BOOTSTRAPCSS_DIR = path.resolve(__dirname, '..', 'node_modules', 'bootstrap', 'dist', 'css');
const BOOTSTRAPJS_DIR = path.resolve(__dirname, '..', 'node_modules', 'bootstrap', 'dist', 'js');

const server = express();

// Middleware
// server.use(compression());
server.use(express.static(PUBLIC_DIR));
server.use(morgan('dev'));
server.use(cors());
server.use(express.json());
server.use('/api', router);

// for frontend
server.use('/css', express.static(path.join(BOOTSTRAPCSS_DIR)));
server.use('/js', express.static(path.join(BOOTSTRAPJS_DIR)));
server.use('/favicon.ico', express.static(path.join(__dirname)));

// loader.io stuff
server.get('/loaderio-9a8356b5595400930c5753ac3265e428', (req, res) => {
  res.status(200).send('loaderio-9a8356b5595400930c5753ac3265e428');
});

module.exports = server;
