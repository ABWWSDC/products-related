const models = require('../../db/models');

// not final just fiddling around

module.exports = {
  getProductById: (req, res) => {
    const params = [req.params.id];

    models.getProductById(params, (err, data) => {
      if (err) {
        console.error('couldn\'t get product info :(', err);
        res.status(404).send('couldn\'t get product info', err);
      } else {
        const { rows } = data;
        const productInfo = rows[0];
        delete Object.assign(productInfo, { features: productInfo.array_agg }).array_agg;
        res.status(200).send(productInfo);
      }
    });
  },
  getRelatedProducts: (req, res) => {
    const params = [req.params.id];

    models.getRelatedProducts(params, (err, data) => {
      if (err) {
        console.error('couldn\'t get related product ids :(', err);
        res.status(400).send('couldn\'t get related product ids', err);
      } else {
        const { rows } = data;

        res.status(200).send(rows);
      }
    });
  },
};
