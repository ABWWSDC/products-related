const pool = require('..');

// not final just fiddling around

module.exports = {
  getProductsList: async ([page = '1', count = '5'], callback) => {
    const queryProductsList = 'SELECT id, name, slogan, description, category, default_price FROM products '
      + 'WHERE id BETWEEN $1 AND $2';
    /* wondering about current implementation of this, because atm if eg page=2, count=3
    it'd return products 4, 5, 6 as opposed to 6, 7, 8.
    gonna ask around and see what other people think
    */
    const pageStart = (Number(page) - 1) * Number(count) + 1;
    const pageEnd = Number(page) * Number(count);

    await pool.query(queryProductsList, [pageStart, pageEnd], (err, data) => {
      callback(err, data);
    });
  },
  getProductById: async (params, callback) => {
    const queryProductsById = 'SELECT pr.id, pr.name, pr.slogan, pr.description, pr.category, pr.default_price, '
      // using jsonb instead of json because jsonb creates object as binary data, which is unique
      + 'ARRAY_AGG ( DISTINCT JSONB_BUILD_OBJECT(\'feature\', fe.feature, \'value\', fe.value) ) '
      + 'FROM products AS pr INNER JOIN features AS fe ON fe.product_id = pr.id '
      + 'WHERE pr.id = $1 GROUP BY pr.id';

    await pool.query(queryProductsById, params, (err, data) => {
      callback(err, data);
    });
  },
  getProductStyles: async (params, callback) => {
    const queryStyles = 'SELECT st.id, st.name, st.sale_price, st.original_price, st."default?", '
    // same here, more important because it was duplicating photos by number of skus
    + 'ARRAY_AGG ( DISTINCT JSONB_BUILD_OBJECT(\'thumbnail_url\', ph.thumbnail_url, \'url\', ph.url) ), '
    + 'JSON_OBJECT_AGG ( skus.id, JSONB_BUILD_OBJECT( \'quantity\', skus.quantity, \'size\', skus.size ) ) '
    + 'FROM styles AS st '
    + 'INNER JOIN photos AS ph ON ph.style_id = st.id '
    + 'INNER JOIN skus ON skus.style_id = st.id '
    + 'WHERE st.product_id = $1 GROUP BY st.id';

    await pool.query(queryStyles, params, (err, data) => {
      callback(err, data);
    });
  },
  getRelatedProducts: async (params, callback) => {
    const queryRelated = 'SELECT related_product_id FROM related WHERE current_product_id = $1';

    await pool.query(queryRelated, params, (err, data) => {
      callback(err, data);
    });
  },
};
