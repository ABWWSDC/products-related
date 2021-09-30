const router = require('express').Router();
const controllers = require('./controllers');

router.get('/:id', controllers.getProductById);
router.get('/:id/related', controllers.getRelatedProducts);

module.exports = router;
