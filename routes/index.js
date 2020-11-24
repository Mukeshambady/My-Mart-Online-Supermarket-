var express = require('express');
var router = express.Router();
var COMMON_HELPER = require('../helpers/common-helpers')


/* GET home page. */
router.get('/',  function(req, res, next) {

 console.log(id);
  res.render('index', { title: 'Express' });
});

module.exports = router;
