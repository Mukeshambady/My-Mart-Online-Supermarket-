
var express = require('express');
const dealerHelper = require('../helpers/dealer-helper')
const productHelper = require('../helpers/product-helper')
const userHelper = require('../helpers/user-helper')
var router = express.Router();

/* GET users Dash Board. */
router.get('/', async function (req, res, next) {
  alldealers = await dealerHelper.getAllDealers()
  res.render('user/dashboard', { title: 'User | Dealers', alldealers })
});
/* GET users Product. By Id*/
router.get('/products/:id', async function (req, res, next) {
  let id = req.params.id
  products = await productHelper.dealerProducts(id)
  res.render('user/products', { title: 'User | Products', products })
});
/* GET users Product. */
router.get('/products', function (req, res, next) {
  res.redirect('/users')
});

// ajax
/* Posr users Modal cart data. */
router.post('/cart-modal', async function (req, res, next) {
  data = await userHelper.cartDetails()
  res.json(data)
});
// ajax
/* Posr users Modal Order HIstory data. */
router.post('/order-hostory-modal', async function (req, res, next) {
  data = await userHelper.cartOrderHistory()
  res.json(data)
});

module.exports = router;
