const server = require('./server');

const PORT = 5000;

// Make sure connection exists with server port
server.listen(PORT, () => {
  console.log(`sdc products-related server listening in on port ${PORT}`);
});
