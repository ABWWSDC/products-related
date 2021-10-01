const router = require('express').Router();
const controllers = require('./controllers');

router.get('/:id', controllers.getProductById);
router.get('/:id/styles', controllers.getProductStyles);
router.get('/:id/related', controllers.getRelatedProducts);

module.exports = router;
