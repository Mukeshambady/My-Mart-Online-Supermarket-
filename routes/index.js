var express = require('express');
var router = express.Router();
const commonHelpers = require('../helpers/common-helpers')


/* GET home page. */
router.get('/', function (req, res, next) { 
  res.render('index', { title: 'Home' });
});
/* GET home page. */
router.get('/index', function (req, res, next) {
  res.redirect('/');
});
/* GET Login page. */
router.get('/login', function (req, res, next) {
  if (req.session.loggedIn) {

    if (req.session.user.state === 0) {

      res.redirect('/admin')
    }
    if (req.session.user.state === 2) {

      res.redirect('/dealer')
    }
  } else {
    res.render('login', { layout: false, 'loginError': req.session.loginError, title: 'Login' });
    req.session.loginError = false
  }
});

/* Post Login page. */
router.post('/login', async function (req, res, next) {
  await commonHelpers.doLogin(req.body).then((response) => {

    if (response.status) {
      if (response.user.status == 1) {

        req.session.user = response.user
        if (req.session.user.state === 0) {
          req.session.adminloggedIn = true
          req.session.loggedIn = true
          res.redirect('/admin')
        }else if (req.session.user.state === 1) {
          req.session.userloggedIn = true
          req.session.loggedIn = true
          res.redirect('/users')
        }else if (req.session.user.state === 2) {
          req.session.dealerloggedIn = true
          req.session.loggedIn = true
          res.redirect('/dealer')
        }
      } else {
        req.session.loginError = 'You are banned by admin'
        req.session.adminloggedIn = false
        req.session.dealerloggedIn = false
        req.session.userloggedIn = false
        req.session.loggedIn = false
        loignOrNot = false
        req.session.user = null
        res.redirect('/login')
      }
    } else {
      req.session.loginError = 'Invalid Username or Password'
      req.session.adminloggedIn = false
      req.session.dealerloggedIn = false
      req.session.userloggedIn = false
      req.session.loggedIn = false
      req.session.user = null
      res.redirect('/login')

    }

  })
});

/* GET Logout page. and session distroy*/
router.get('/logout', (req, res) => {
 
  req.session.loggedIn = false
  req.session.destroy()
  
  // if (req.session.user) {
      // res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      // res.header('Expires', '-1');
      // res.header('Pragma', 'no-cache');
  // }
  res.redirect('/login')
})


module.exports = router;
