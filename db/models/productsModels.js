const pool = require('..');

// not final just fiddling around

module.exports = {
  getProductsList: ([page, count = '5'], callback) => {
    let queryBase = 'SELECT id, name, slogan, description, category, default_price FROM products ';
    /* wondering about current implementation of this, because atm if eg page=2, count=3
    it'd return products 4, 5, 6 as opposed to 6, 7, 8.
    gonna ask around and see what other people think
    */
    const pageStart = (Number(page) - 1) * Number(count);

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
      const queryProductsWithPage = queryBase + 'LIMIT $1 OFFSET $2';

      pool.query(queryProductsWithPage, [count, pageStart], (err, data) => {
        callback(err, data);
      });
    }

    if (page && count !== '5') {
      const queryProductsWithBoth = queryBase + 'LIMIT $1 OFFSET $2';

      pool.query(queryProductsWithBoth, [count, pageStart], (err, data) => {
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
