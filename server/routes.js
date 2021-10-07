const router = require('express').Router();
const controllers = require('./controllers');

const { productsControllers } = controllers;

// products api
router.get('/products', productsControllers.getProductsList);
router.get('/products/:id', productsControllers.getProductById);
router.get('/products/:id/styles', productsControllers.getProductStyles);
router.get('/products/:id/related', productsControllers.getRelatedProducts);

// Q&A api
// router.all('/qa*', qnaControllers.handleQA);

// reviews api
// router.all('/reviews*', reviewsControllers.handleReviews);

module.exports = router;
