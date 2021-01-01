const { response } = require('express');
var express = require('express');
const decimal128 = require('mongodb');
const dealerHelper = require('../helpers/dealer-helper');
const orderHelper = require('../helpers/order-helper');
const productHelper = require('../helpers/product-helper')
const userHelper = require('../helpers/user-helper')
var router = express.Router();


let reqest_path = null
//username:"admin",password:"1234"
//middileware useed to check lgged In or Not

const verifyLogin = (req, res, next) => {
  if (req.session.dealerloggedIn) {
    next()
  } else {
    req.session.headerReferer = req.headers.referer
    res.redirect('/logout')
  }
}


// *******************Start*****Deler*******functinality*****************************//

/* GET home page. */
router.get('/', verifyLogin, async function (req, res, next) {
  // let dealerDetails = await dealerHelper.dealerDetails()
  //   //console.log(dealerDetails);
  // res.render('dealer/dashboard', { title: 'Dealer | Dash-Board' });
  res.redirect('/dealer/view-product')
});



/* GET Profile page. */
router.get('/profile', verifyLogin, async function (req, res, next) {
  let userdata = await dealerHelper.dealerProfile(req.session.user._id)
  res.render('dealer/profile', { title: 'Dealer | Profile', userdata });

});
// *******************End*****Deler*******functinality*****************************//


// ********Start*****product functionality**************************************
/* GET all-Products page. */
router.get('/view-product', verifyLogin, async function (req, res, next) {
  let productDetails = await productHelper.dealerProducts(req.session.user._id)
  res.render('product/all-products', { title: 'Dealer | Products List', productDetails });

});
/* GET add-Products page. */
router.get('/product', verifyLogin, async function (req, res, next) {
  productSuccess = req.session.productSuccess
  res.render('product/new-product', { title: 'Dealer | ADD-Products', productSuccess });
  req.session.productSuccess = null
});


/* POST add-Products page. */
router.post('/product', verifyLogin, async function (req, res, next) {

  await productHelper.AddDealerProduct(req.session.user._id, req.body).then((result) => {
    if (req.files) {
      //get image file from Form
      let image = req.files.image
      //move image into public/products-pic with image name as dealer_id+product name
      image.mv('./public/products-pic/' + result)
    }
    req.session.productSuccess = 'Product added'
    res.redirect('/dealer/product')
  }).catch((err) => {
    console.log('post product error: ', err)
  })
});

/* GET Edit-Products page. */
router.get('/edit-product/:id', verifyLogin, async function (req, res, next) {
  id = req.params.id
  let productDetails = await productHelper.getDealerProductOne(id)
  productSuccess = req.session.productSuccess

  res.render('product/edit-product', { title: 'Dealer | Edit-Products', productSuccess, productDetails });
  req.session.productSuccess = null
});


/* POST edit-Products page. */
router.post('/edit-product/:id', verifyLogin, async function (req, res, next) {
  productImage = req.body.imageView
  delete req.body.imageView
  id = req.params.id
  await productHelper.updateDealerProduct(id, req.body).then((result) => {
    if (req.files) {
      //get image file from Form
      let image = req.files.image
      //move image into public/products-pic with image name as dealer_id+product name
      image.mv('./public/products-pic/' + productImage)
    }
    req.session.productSuccess = 'Product updated'
    res.redirect('/dealer/edit-product/' + id)
  }).catch((err) => {
    console.log('post product error: ', err)
  })
});

// ajax
/* POST DELETE-dealer with  param page. */
router.post('/deleteProduct', async function (req, res, next) {
  await productHelper.productDelete(req.body.id).then((result) => {
    res.json(result)
  })
});

/* GET ban-list-Product page. */
router.get('/ban-product', verifyLogin, async function (req, res, next) {
  let productDetails = await productHelper.productAllBanDetail(req.session.user._id)
  res.render('product/ban-list-product', { productDetails, title: 'Product - Ban List ' });
});
// ajax
/* POST banProduct . */
router.post('/banProduct', async function (req, res, next) {
  await productHelper.productBanOrUnban(req.body.id, 0).then((result) => {
    res.json(result)
  })
});
// ajax
/* POST unbanProduct . */
router.post('/unbanProduct', async function (req, res, next) {
  await productHelper.productBanOrUnban(req.body.id, 1).then((result) => {
    res.json(result)
  })
});


// *********End****product functionality**************************************

//**********Start**User****Functinality***************************************

/* GET dealer/users List page. */
router.get('/users', verifyLogin, async function (req, res, next) {
  let userDetails = await userHelper.AllDetail(req.session.user._id)
  res.render('user/all-users', { title: 'Dealer | User List', userDetails });
});


/* GET New-USER page. */
router.get('/add-user', verifyLogin, function (req, res, next) {
  res.render('user/new-user', {
    usenameExistError: req.session.usenameExistError,
    registrationStatus: req.session.registrationStatus,
    title: 'Add New User'
  });
  req.session.usenameExistError = null
});

/* POST ADD-USER page. */
router.post('/add-user', verifyLogin, function (req, res, next) {

  req.body.createdBy = req.session.user._id
  userHelper.doInsert(req.body).then((result) => {
    if (result.status) {
      req.session.usenameExistError = 'Username all ready Exist...';
      res.redirect('/dealer/add-user')
    } else {
      req.session.usenameExistError = ''
      if (result) {
        req.session.registrationStatus = "User added successfully..";
      }
      res.redirect('/dealer/add-user')
      if (req.files) {
        //get image file from Form
        let image = req.files.image
        //move image into public/profile-pic with image name as _id
        image.mv('./public/user-profile-pic/' + result)
      }
    }
  })
});

/* GET edit-user page. */
router.get('/edit-user/:id', verifyLogin, async function (req, res, next) {
  id = req.params.id
  let userDetails = await userHelper.Profile(id)
  registrationStatus = req.session.registrationStatus
  res.render('user/edit-user', { title: 'Dealer | Edit-User', registrationStatus, userDetails });
  req.session.registrationStatus = null
});


/* POST edit-user page. */
router.post('/edit-user/:id', verifyLogin, async function (req, res, next) {
  profilePicture = req.body.imageView
  delete req.body.imageView
  id = req.params.id
  await userHelper.update(id, req.body).then((result) => {
    if (req.files) {
      //get image file from Form
      let image = req.files.image
      //move image into public/products-pic with image name as dealer_id+product name
      image.mv('./public/user-profile-pic/' + profilePicture)
    }
    req.session.registrationStatus = 'User updated'
    res.redirect('/dealer/edit-user/' + id)
  }).catch((err) => {
    console.log('post edit-user error: ', err)
  })
});

// ajax
/* POST delete User . */
router.post('/deleteUser', async function (req, res, next) {
  await userHelper.Delete(req.body.id).then((result) => {
    res.json(result)
  })
});
// ajax
/* POST banUser . */
router.post('/banUser', async function (req, res, next) {
  await userHelper.BanOrUnban(req.body.id, 0).then((result) => {
    res.json(result)
  })
});

/* GET User Ban List page. */
router.get('/user-ban-list', verifyLogin, async function (req, res, next) {
  let userDetails = await userHelper.AllBanDetail(req.session.user._id)
  res.render('user/user-ban-list', { title: 'Dealer | User Ban List', userDetails });
});


// ajax
/* POST unbanUser . */
router.post('/unbanUser', async function (req, res, next) {
  await userHelper.BanOrUnban(req.body.id, 1).then((result) => {
    res.json(result)
  })
});


//**********End**User****Functinality***************************************

//**********Start**Order****Functinality***************************************

//List all orders
router.get('/orders', verifyLogin, async function (req, res) {
  let orderDetails = await orderHelper.getOrderDetails(req.session.user._id)
  let orderState = {
    placed: 1,
    confirmed: 2,
    pending: 3,
    delayed: 4,
    outOfDelivery: 5,
    rejected: 6,
    delivered: 7
  }

  res.render('order/orders', { orderDetails: orderDetails, orderState, title: 'Dealer | Order-Details' })
})

//Ajax
//Order state change
router.post('/stateChange', async function (req, res) {
  let result = await orderHelper.setOrderState(req.body.id, req.body.state)

  res.json(result)
})

//ajax
//view-user-product depends on orders
router.post('/view-user-products', async function (req, res) {
  req.body.dealerId = req.session.user._id
  let products = await orderHelper.getOrderProductDetails(req.body)
  res.json(products)
})

//**********End**Order****Functinality***************************************
//**********start**settings****Functinality***************************************

//get settings
router.get('/settings', verifyLogin, async function (req, res) {
  let result = await dealerHelper.getTiming(req.session.user._id)

  res.render('settings/settings', { timing: result.openingAndClosingtime, datasaved: req.session.datasaved, title: 'Dealer | Order-Details' })
  req.session.datasaved = null
})
//POST settings
router.post('/settings', verifyLogin, async function (req, res) {
  req.body.dealerId = req.session.user._id
  req.body.status = 1
  let result = await dealerHelper.setTiming(req.body)
  if (result.matchedCount == 1) {
    req.session.datasaved = "Timing updated..."
    res.redirect('/dealer/settings')
  }
})
//**********End**settings****Functinality***************************************
module.exports = router;
