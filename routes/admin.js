var express = require('express');
var router = express.Router();
var COMMON_HELPER = require('../helpers/common-helpers')

/* GET home page. */
router.get('/', function  (req, res, next) {
  res.render('admin/login',{layout:false});
});
/* GET all-dealers page. */
router.get('/all-dealers', function(req, res, next) {
  res.render('admin/all-dealers');
});
/* GET New-dealers page. */
router.get('/new-dealer', function(req, res, next) {
  res.render('admin/new-dealer');
});
/* GET ban-list-dealers page. */
router.get('/ban-list-dealers', function(req, res, next) {
  res.render('admin/ban-list-dealers');
});

module.exports = router;
