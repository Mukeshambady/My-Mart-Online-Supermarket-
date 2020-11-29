var express = require('express');
var router = express.Router();
const commonHelpers = require('../helpers/common-helpers')


/* GET home page. */
router.get('/',  function(req, res, next) {
  res.render('index', { title: 'Home' });
});
/* GET Login page. */
router.get('/login', function (req, res, next) {

  if (req.session.loggedIn) {
    res.redirect('/admin')
  } else {
    res.render('login', { layout: false, 'loginError': req.session.loginError,title:'Login' });
    req.session.loginError = false
  }
});

/* Post Login page. */
router.post('/login', function (req, res, next) {
  commonHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      if( req.session.user.state===0){
         res.redirect('/admin')
      }
     
    } else {
      req.session.loginError = 'Invalid Username or Password'
      req.session.loggedIn = false
      res.redirect('/login')     
    }
  })
});

/* GET Logout page. and session distroy*/
router.get('/logout', (req, res) => {
  req.session.loggedIn = false
  req.session.destroy()
  res.redirect('/login')
})


module.exports = router;
