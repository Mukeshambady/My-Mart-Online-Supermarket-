
var express = require('express');
const commonHelpers = require('../helpers/common-helpers')
const dealerHelper = require('../helpers/dealer-helper')
const productHelper = require('../helpers/product-helper')
const cartHelper = require('../helpers/cart-helper')
const userHelper = require('../helpers/user-helper')
const orderHelper = require('../helpers/order-helper')
const messageHelper = require('../helpers/message-helper')
var router = express.Router();

//middileware useed to check lgged In or Not

const verifyLogin = (req, res, next) => {
  if (req.session.userloggedIn || req.session.url=='/'|| req.session.url==undefined    ) {
    next()
  } else {
    req.session.adminloggedIn = false
    req.session.dealerloggedIn = false
    req.session.userloggedIn = false
    req.session.loggedIn = false
    req.session.user = null
    next()
  }
}

//POST login check by ajax

router.post('/verifyLoginByAjax', (req, res, next) => {

  if (req.session.userloggedIn || req.session.adminloggedIn || req.session.dealerloggedIn) {
    res.json(true);
  } else {

    req.session.headerReferer = req.headers.referer
    res.json(false);
  }
})


/* GET users Dash Board.  */
router.get('/',verifyLogin, async function (req, res, next) {
  //  console.log('messageHelper',await messageHelper.otpVarification())
  alldealers = await dealerHelper.getAllDealers()
  let cart_count = ''
  if (req.session.user) {

    cart_count = await cartHelper.getCartCount(req.session.user._id)
  }

  res.render('user/dashboard', { title: 'User | Dealers', alldealers, cartCount: cart_count })
});

/* GET users Product. By Id*/
router.get('/products/:id',verifyLogin, async function (req, res, next) {
  let id = req.params.id
  products = await productHelper.dealerProducts(id)
  let cart_count = ''
  if (req.session.user) {
    cart_count = await cartHelper.getCartCount(req.session.user._id)
  }
  res.render('user/products', { title: 'User | Products', products, cartCount: cart_count })
});

/* GET users Product. */
router.get('/products',verifyLogin, function (req, res, next) {
  res.redirect('/users')
});



// ajax
/* Post users Modal cart data. */
router.post('/cart-modal', async function (req, res, next) {
  data = await userHelper.cartDetails(req.session.user._id)
 
  res.json(data)
});
// ajax
/* Post users Modal cart data. */
router.post('/verifyCart', async function (req, res, next) {
 if(req.session.user)
  req.body.userId = req.session.user._id
  //1 the same dealer, 2 different dealer, 3 nocart
  data = await userHelper.GetCartExistOrNot(req.body)
  res.json(data)
});
// ajax
/* Post users Modal Order HIstory data. */
router.post('/order-history-modal', async function (req, res, next) {
  data = await userHelper.cartOrderHistory(req.session.user._id)
   res.json(data)
 // res.render('modals/cart-order-history', { orders, layout: false })
});
// ajax
/* Post addToCart. */
router.post('/addToCart', async function (req, res, next) {

  req.body.userId = req.session.user._id
  deletCart = req.body.deletCart

  delete req.body.deletCart

  if (deletCart == 1) {
    await cartHelper.deleteCart(req.session.user._id)
  }

  await cartHelper.setCart(req.body).then(async (result) => {
    cartCount = await cartHelper.getCartCount(req.session.user._id)
    data = { result: result, cartCount: cartCount }
    res.json(data)
  })

});
// ajax
/* Post check out. */
router.post('/check-out', async function (req, res, next) {
  userId = req.session.user._id
  
  paymentMethod=req.body.paymentMethod
   let data = await cartHelper.checkOut(userId,req.body)
  let totals = await cartHelper.getTotalAmount(userId)
  let cartCount = await cartHelper.getCartCount(userId)
  result = { data: data, totals: totals, cartCount: cartCount }
  
  if (paymentMethod=='COD') {
    res.json(result);
  } else {
   
  await   cartHelper.generateRazorpay(data._id, data. totalPrice).then((response) => {
      result.response=response
      res.json(result)
    })
  }

});
//Ajax
///verify-payment
router.post('/verify-payment', (req, res) => {

  cartHelper.verifyPayment(req.body).then((response) => {
    // console.log(('Payment Successful'));
    cartHelper.changePaymetStatus(req.body['order[receipt]']).then((reslt) => {
      
      res.json({ status: true })
    }).catch((err) => {
      console.log('verify-payment error1',err)
    })
  }).catch((err) => {
        res.json({ status: false, errMsg: '' })
  })
})
// ajax
/* Post Quantity Change. */
router.post('/quantity', async function (req, res, next) {

  userId = req.session.user._id
  req.body.userId = userId

  await cartHelper.setCartQuantity(req.body).then(async (data) => {
    let totals = await cartHelper.getTotalAmount(userId)
    result = { data: data, totals: totals }
    res.json(result)
  })

});
// ajax
/* Post remove Item from Cart. */
router.post('/remove-from-cart', async function (req, res, next) {
  userId = req.session.user._id
  req.body.userId = userId
  await cartHelper.removeCartProduct(req.body).then(async (data) => {
    let totals = await cartHelper.getTotalAmount(userId)
    let cartCount = await cartHelper.getCartCount(userId)
    result = { data: data, totals: totals, cartCount: cartCount }
    res.json(result)
  })

});

//Ajax
//username checking
router.post('/usernameCheck', async function (req, res, next) {
  let val = await userHelper.userNameCheck(req.body.value)
  res.json(!val.status)
})
//Jquery
//username checking
router.get('/get_ordered_status', async function (req, res, next) {
  let orders = await orderHelper.getOrderDetailsByUser(req.session.user._id)
  res.render('modals/cart-order-status', { orders, layout: false })
})
//Jquery
//get_ordered_track
router.get('/get_ordered_track/:id', async function (req, res, next) {
  let trackDetails = await orderHelper.getOrderDetailsByOrderId(req.params.id); 
  
  console.log(orders); 
  res.render('modals/track', {orders,layout: false })
})



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
      req.session.user = null
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
          if (req.session.headerReferer) {
            res.redirect(req.session.headerReferer)
            req.session.headerReferer = null
          } else {
            res.redirect('/dealer')
          }

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
  res.render('sign-up', { layout: false, usenameExistError: req.session.usenameExistError, title: 'Sign-Up' });
  req.session.usenameExistError = null
});
//sign Up
/* POST Login page. */
router.post('/signup', function (req, res, next) {

  req.body.createdBy = ''
  userHelper.doInsert(req.body).then(async (result) => {
    if (result.status) {
      req.session.usenameExistError = 'Username all ready Exist...';
      res.redirect('/signup')
    } else {
      req.session.usenameExistError = ''
      if (result) {
        req.session.registrationStatus = "User added successfully..";
      }
      //login
      body = { username: req.body.username, password: req.body.password }

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


/* GET forgot-password. */
router.get('/forgot-password', function (req, res, next) {
  res.render('change-password', { title: 'User | Forgot-Passwors', layout: false, passwordChangeError: req.session.passwordChangeError })
  req.session.passwordChangeError = null;
});
/* POST forgot-password. */
router.post('/forgot-password', async function (req, res, next) {
  result = await userHelper.changePassward(req.body)
  if (result == 1) {
    res.redirect('/login')
  } else {
    req.session.passwordChangeError = 'check your username'
    res.redirect('/forgot-password')
  }
});
/*  login------------------------------------------------------------------------------------*/


module.exports = router;

