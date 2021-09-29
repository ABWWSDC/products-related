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
app.get('/api/products/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params;
    const queryFeatures = 'SELECT features.feature, features.value FROM features WHERE features.product_id = $1';
    const queryProducts = 'SELECT products.id, products.name, products.slogan, products.description, products.category, products.default_price FROM products where products.id = $1';
    const featuresResults = await pool.query(queryFeatures, [product_id]);
    const productsResults = await pool.query(queryProducts, [product_id]);
    const productInfo = productsResults.rows[0];

    res.status(200).send({ ...productInfo, features: featuresResults.rows });
  } catch (err) {
    console.error(err.message);
  }
});

// Make sure connection exists with port
app.listen(PORT, () => {
  console.log(`sdc products-related server listening in on port ${PORT}`);
});
