const models = require('../../db/models');

// not final just fiddling around

module.exports = {
  getProductsList: (req, res) => {
    const { page, count } = req.query;
    const params = [page, count];

    models.getProductsList(params, (err, data) => {
      if (err) {
        console.error('couldn\'t get products :(', err);
        res.status(400).send({ dev_message: 'couldn\'t get products :(', err });
      } else {
        const productsList = data.rows;
        res.status(200).send(productsList);
      }
    });
  },
  getProductById: (req, res) => {
    const { id } = req.params;
    const params = [id];

    models.getProductById(params, (err, data) => {
      if (err) {
        console.error('couldn\'t get product info :(', err);
        res.status(400).send({ dev_message: 'couldn\'t get product info :(', err });
      } else {
        const productInfo = data.rows[0];
        delete Object.assign(productInfo, { features: productInfo.array_agg }).array_agg;
        res.status(200).send(productInfo);
      }
    });
  },
  getProductStyles: (req, res) => {
    const { id } = req.params;
    const params = [id];

    models.getProductStyles(params, (err, data) => {
      if (err) {
        console.error('couldn\'t get product styles :(', err );
        res.status(400).send({ dev_message: 'couldn\'t get product styles :(', err });
      } else {
        const { rows } = data;
        rows.forEach((style) => {
          delete Object.assign(style, { style_id: style.id }).id;
          delete Object.assign(style, { photos: style.array_agg }).array_agg;
          delete Object.assign(style, { skus: style.json_object_agg }).json_object_agg;
        });

        res.status(200).send({ product_id: id, results: rows });
      }
    });
  },
  getRelatedProducts: (req, res) => {
    const { id } = req.params;
    const params = [id];

    models.getRelatedProducts(params, (err, data) => {
      if (err) {
        console.error('couldn\'t get related product ids :(', err);
        res.status(400).send({ dev_message: 'couldn\'t get related product ids :(', err });
      } else {
        const { rows } = data;
        const relatedProducts = rows.map((relatedProduct) => relatedProduct.related_product_id);

        res.status(200).send(relatedProducts);
      }
    });
  },
};
