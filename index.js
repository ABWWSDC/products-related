const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// get one product just to see if things are working. this isn't final query
app.get('/api/products/:product_id', (req, res) => {
  const queryInstruction = `SELECT products.id, products.name, products.slogan, \
    products.description, products.category, products.default_price, features.feature, \
    features.value FROM products INNER JOIN features ON products.id = features.product_id \
    WHERE products.id = ${req.params.product_id}`;

  pool.query(queryInstruction, (err, results) => {
    if (err) {
      console.error(err.message);
    } else {
      res.status(200).send(results);
    }
  });
});

// Make sure connection exists with port
app.listen(PORT, () => {
  console.log(`sdc products-related server listening in on port ${PORT}`);
});
