var express = require('express');
var router = express.Router();
const commonHelpers = require('../helpers/common-helpers')


/* GET home page. */
router.get('/',  function(req, res, next) {
  res.render('index', { title: 'Home' });
});
/* GET home page. */
router.get('/index',  function(req, res, next) {
  res.redirect('/');
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
     
      req.session.user = response.user
      if( req.session.user.state===0){
        req.session.adminloggedIn = true
         res.redirect('/admin')
      }
      if( req.session.user.state===2){
        req.session.dealerloggedIn = true
         res.redirect('/dealer')
      }
     
    } else {
      req.session.loginError = 'Invalid Username or Password'
      req.session.adminloggedIn = false
      req.session.dealerloggedIn = false
      req.session.user=null
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
