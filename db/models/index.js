const pool = require('..');

// not final just fiddling around

module.exports = {
  /* getProductById: async (params, callback) => {
    try {
      const queryFeatures = 'SELECT feature, value FROM features WHERE features.product_id = $1';
      const queryProductsById = 'SELECT id, name, slogan, description, category, default_price FROM products where products.id = $1';
      const featuresResults = await pool.query(queryFeatures, params);
      const productsResults = await pool.query(queryProductsById, params);
      const data = { featuresResults, productsResults };

      callback(null, data);
    } catch (err) {
      callback(err, null);
    }
  },
  getProductById: (params, callback) => {
    const queryFeatures = 'SELECT feature, value FROM features WHERE features.product_id = $1';
    const queryProductsById = 'SELECT id, name, slogan, description, category, default_price FROM products where products.id = $1';
    const featuresResults = pool.query(queryFeatures, params);
    const productsResults = pool.query(queryProductsById, params);
    Promise.all([featuresResults, productsResults])
      .catch((err) => callback(err, null))
      .then((data) => callback(null, data));
  }, */
  getProductsList: ([page, count = '5'], callback) => {
    let queryBase = 'SELECT id, name, slogan, description, category, default_price FROM products ';
    const pageStart = Number(page) * Number(count) - (Number(count) - 1);
    const pageEnd = Number(page) * Number(count);

    if (!page && count === '5') {
      const queryProducts = queryBase + 'LIMIT $1';

      pool.query(queryProducts, [count], (err, data) => {
        callback(err, data);
      });
    }

    if (!page && count !== '5') {
      const queryProductsWithCount = queryBase + 'LIMIT $1';

      pool.query(queryProductsWithCount, [count], (err, data) => {
        callback(err, data);
      });
    }

    if (page && count === '5') {
      const queryProductsWithPage = queryBase + 'WHERE id BETWEEN $1 AND $2';

      pool.query(queryProductsWithPage, [pageStart, pageEnd], (err, data) => {
        callback(err, data);
      });
    }

    if (page && count !== '5') {
      const queryProductsWithBoth = queryBase + 'WHERE id BETWEEN $1 AND $2 LIMIT $3';

      pool.query(queryProductsWithBoth, [pageStart, pageEnd, count], (err, data) => {
        callback(err, data);
      });
    }
  },
  getProductById: (params, callback) => {
    const queryProductsById = 'SELECT pr.id, pr.name, pr.slogan, pr.description, pr.category, pr.default_price, '
      // using jsonb instead of json because jsonb creates object as binary data, which is unique
      + 'ARRAY_AGG ( DISTINCT JSONB_BUILD_OBJECT(\'feature\', fe.feature, \'value\', fe.value) ) '
      + 'FROM products AS pr INNER JOIN features AS fe ON fe.product_id = pr.id '
      + 'WHERE pr.id = $1 GROUP BY pr.id';

    pool.query(queryProductsById, params, (err, data) => {
      callback(err, data);
    });
  },
  getProductStyles: (params, callback) => {
    const queryStyles = 'SELECT st.id, st.name, st.sale_price, st.original_price, st."default?", '
    // same here, more important because it was duplicating photos by number of skus
    + 'ARRAY_AGG ( DISTINCT JSONB_BUILD_OBJECT(\'thumbnail_url\', ph.thumbnail_url, \'url\', ph.url) ), '
    + 'JSON_OBJECT_AGG ( skus.id, JSONB_BUILD_OBJECT( \'quantity\', skus.quantity, \'size\', skus.size ) ) '
    + 'FROM styles AS st '
    + 'INNER JOIN photos AS ph ON ph.style_id = st.id '
    + 'INNER JOIN skus ON skus.style_id = st.id '
    + 'WHERE st.product_id = $1 GROUP BY st.id';

    pool.query(queryStyles, params, (err, data) => {
      callback(err, data);
    });
  },
  getRelatedProducts: (params, callback) => {
    const queryRelated = 'SELECT related_product_id FROM related WHERE current_product_id = $1';

    pool.query(queryRelated, params, (err, data) => {
      callback(err, data);
    });
  },
};
