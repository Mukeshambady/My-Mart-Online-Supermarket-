
var express = require('express');
const commonHelpers = require('../helpers/common-helpers')
const dealerHelper = require('../helpers/dealer-helper')
const productHelper = require('../helpers/product-helper')
const userHelper = require('../helpers/user-helper')
var router = express.Router();



//POST login check by ajax

router.post('/verifyLoginByAjax', (req, res, next) => {
  if (req.session.userloggedIn) {
    res.json(true);
  } else {
    req.session.headerReferer = req.headers.referer
    res.json(false);
  }
})
/* GET users Dash Board. */
router.get('/', async function (req, res, next) {

  alldealers = await dealerHelper.getAllDealers()
  let cart_count = ''
  if (req.session.user) {
    cart_count = await productHelper.getCartCount(req.session.user._id)
  }

  res.render('user/dashboard', { title: 'User | Dealers', alldealers, cartCount: cart_count })
});
/* GET users Product. By Id*/
router.get('/products/:id', async function (req, res, next) {
  let id = req.params.id
  products = await productHelper.dealerProducts(id)
  let cart_count = ''
  if (req.session.user) {
    cart_count = await productHelper.getCartCount(req.session.user._id)
  }
  res.render('user/products', { title: 'User | Products', products, cartCount: cart_count })
});
/* GET users Product. */
router.get('/products', function (req, res, next) {
  res.redirect('/users')
});

// ajax
/* Posr users Modal cart data. */
router.post('/cart-modal', async function (req, res, next) {
  data = await userHelper.cartDetails(req.session.user._id)
  res.json(data)
});
// ajax
/* Post users Modal Order HIstory data. */
router.post('/order-hostory-modal', async function (req, res, next) {
  data = await userHelper.cartOrderHistory()
  res.json(data)
});
// ajax
/* Post addToCart. */
router.post('/addToCart', async function (req, res, next) {

  req.body.userId = req.session.user._id
  data = await productHelper.setCart(req.body)
  res.json(data)
});
// ajax
/* Post Quantity Change. */
router.post('/quantity', async function (req, res, next) {

  req.body.userId = req.session.user._id
  data = await productHelper.setCartQuantity(req.body)
  res.json(data)
});





/*  login----------------------------------------------------------------------------------*/
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
          req.session.url = '/admin'
          res.redirect('/admin')
        } else if (req.session.user.state === 1) {
          req.session.userloggedIn = true
          req.session.loggedIn = true
          req.session.url = '/'
          if (req.session.headerReferer) {
            res.redirect(req.session.headerReferer)
            req.session.headerReferer = null
          } else {
            res.redirect('/')
          }

        } else if (req.session.user.state === 2) {
          req.session.dealerloggedIn = true
          req.session.loggedIn = true
          req.session.url = '/dealer'
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
  res.redirect('/login')
})

//sign Up
/* GET Login page. */
router.get('/signup', function (req, res, next) {  
    res.render('sign-up', { layout: false,usenameExistError:req.session.usenameExistError, title: 'Sign-Up' });
    req.session.usenameExistError=null
});
//sign Up
/* POST Login page. */
router.post('/signup',  function (req, res, next) {  
  
  req.body.createdBy=''
  userHelper.doInsert(req.body).then(async(result) => {
    if (result.status) {
      req.session.usenameExistError = 'Username all ready Exist...';
      res.redirect('/signup')
    } else {
      req.session.usenameExistError=''
      if(result){
        req.session.registrationStatus = "User added successfully..";
      }
      //login
      body={username:req.body.username,password:req.body.password}
  
      await commonHelpers.doLogin(body).then((response) => {

        if (response.status) {
          if (response.user.status == 1) {
    
            req.session.user = response.user
             if (req.session.user.state === 1) {
              req.session.userloggedIn = true
              req.session.loggedIn = true
              req.session.url = '/'
              if (req.session.headerReferer) {
                res.redirect(req.session.headerReferer)
                req.session.headerReferer = null
              } else {
                res.redirect('/')
              }
    
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
      }
      })

      //login
      if (req.files) {
        //get image file from Form
        let image = req.files.image
        //move image into public/profile-pic with image name as _id
        image.mv('./public/user-profile-pic/' + result)
      }
    }
  })
});
/*  login------------------------------------------------------------------------------------*/


module.exports = router;

