const pool = require('..');

// not final just fiddling around

module.exports = {
  // getProductById: async (params, callback) => {
  //   try {
  //     const queryFeatures = 'SELECT feature, value FROM features WHERE features.product_id = $1';
  //     const queryProducts = 'SELECT id, name, slogan, description, category, default_price FROM products where products.id = $1';
  //     const featuresResults = await pool.query(queryFeatures, params);
  //     const productsResults = await pool.query(queryProducts, params);
  //     const data = { featuresResults, productsResults };

  //     callback(null, data);
  //   } catch (err) {
  //     callback(err, null);
  //   }
  // },
  // getProductById: (params, callback) => {
  //   const queryFeatures = 'SELECT feature, value FROM features WHERE features.product_id = $1';
  //   const queryProducts = 'SELECT id, name, slogan, description, category, default_price FROM products where products.id = $1';
  //   const featuresResults = pool.query(queryFeatures, params);
  //   const productsResults = pool.query(queryProducts, params);
  //   Promise.all([featuresResults, productsResults])
  //     .catch((err) => callback(err, null))
  //     .then((data) => callback(null, data));
  // },
  getProductById: (params, callback) => {
    const queryProducts = 'SELECT pr.id, pr.name, pr.slogan, pr.description, pr.category, pr.default_price, '
      + `ARRAY_AGG ( JSON_BUILD_OBJECT('feature', fe.feature, 'value', fe.value) ) `
      + 'FROM products AS pr INNER JOIN features AS fe ON fe.product_id = pr.id '
      + 'WHERE pr.id = $1 GROUP BY pr.id';

    pool.query(queryProducts, params, (err, data) => {
      callback(err, data);
    });
  },
  // getProductStyles: (params, callback) => {
  //   const querySkus = '';
  //   const queryPhotos = '';
  // },
  getRelatedProducts: (params, callback) => {
    const queryRelated = 'SELECT related.related_product_id FROM related WHERE current_product_id = $1';

    pool.query(queryRelated, params, (err, data) => {
      callback(err, data);
    });
  },
};
