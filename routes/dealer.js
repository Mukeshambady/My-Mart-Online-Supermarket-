const { response } = require('express');
var express = require('express');
const commonHelpers = require('../helpers/common-helpers');
const dealerHelper = require('../helpers/dealer-helper')
var router = express.Router();


let reqest_path = null
//username:"admin",password:"1234"
//middileware useed to check lgged In or Not

const verifyLogin = (req, res, next) => {

  if (req.session.dealerloggedIn) {
    next()
  } else {
    res.redirect('/logout')
  }
}


// ************************************************************//

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
/* GET all-Products page. */
router.get('/view-product', verifyLogin, async function (req, res, next) {
   let productDetails = await dealerHelper.dealerProducts(req.session.user._id)
  res.render('product/all-products', { title: 'Dealer | Products List',productDetails });

});
/* GET add-Products page. */
router.get('/product', verifyLogin, async function (req, res, next) {
  productSuccess= req.session.productSuccess
  res.render('product/new-product', { title: 'Dealer | ADD-Products',productSuccess });
  req.session.productSuccess=null
});


/* POST add-Products page. */
router.post('/product', verifyLogin, async function (req, res, next) {

  await dealerHelper.AddDealerProduct(req.session.user._id, req.body).then((result) => {
    if (req.files) {
      //get image file from Form
      let image = req.files.image
      //move image into public/products-pic with image name as dealer_id+product name
      image.mv('./public/products-pic/' + result)
    }
    req.session.productSuccess='Product added'
    res.redirect('/dealer/product')
  }).catch((err)=>{
    console.log('post product error: ',err)
  })
 });

/* GET Edit-Products page. */
router.get('/edit-product/:id', verifyLogin, async function (req, res, next) {
  id=req.params.id
  let productDetails = await dealerHelper.getDealerProductOne(id)
  productSuccess= req.session.productSuccess
  
  res.render('product/edit-product', { title: 'Dealer | ADD-Products',productSuccess,productDetails });
  req.session.productSuccess=null
});


/* POST edit-Products page. */
router.post('/edit-product/:id', verifyLogin, async function (req, res, next) {
  productImage= req.body.imageView
  delete req.body.imageView
  id=req.params.id
  await dealerHelper.updateDealerProduct(id, req.body).then((result) => {
    if (req.files) {
      //get image file from Form
      let image = req.files.image
      //move image into public/products-pic with image name as dealer_id+product name
      image.mv('./public/products-pic/' + productImage)
    }
    req.session.productSuccess='Product updated'
    res.redirect('/dealer/edit-product/'+id)
  }).catch((err)=>{
    console.log('post product error: ',err)
  })
 });

// ajax
/* POST DELETE-dealer with  param page. */
router.post('/deleteProduct', async function (req, res, next) {
  await dealerHelper.productDelete(req.body.id).then((result) => {
    res.json(result)
  })
});

// ajax
/* POST ban-dealer . */
router.post('/banProduct', async function (req, res, next) {
  await dealerHelper.productBanOrUnban(req.body.id,0).then((result) => {
    res.json(result)
  })
});


/* GET ban-list-dealers page. */
router.get('/ban-product', verifyLogin, async function (req, res, next) {

   let productDetails = await dealerHelper.productAllBanDetail(req.session.user._id)
   res.send(productDetails)
   console.log(productDetails)
  // res.render('admin/ban-list-dealers', { dealerDetails, title: 'Product - Ban List ' });
});









/* GET New-USER page. */
router.get('/new-user', verifyLogin, function (req, res, next) {
  res.send('new user')
    // res.render('admin/new-dealer',{
    //   usenameExistError:req.session.usenameExistError,
    //   registrationStatus: req.session.registrationStatus,
    //   title:'Add New Dealer'
    // });
  req.session.usenameExistError = null
});

/* POST New-USER page. */
router.post('/new-user', verifyLogin, function (req, res, next) {
  //   req.body.createdBy=req.session.user._id
  //   dealerHelper.doInsert(req.body).then((result) => {

  //     if (result.status) {
  //       req.session.usenameExistError = 'Username all ready Exist...';
  //       res.redirect('/admin/new-dealer')
  //     } else {
  //       req.session.usenameExistError=''

  //       if(result){
  //         req.session.registrationStatus = "Dealer added successfully..";
  //       }
  //       res.redirect('/admin/new-dealer')
  //       if (req.files) {
  //         //get image file from Form
  //         let image = req.files.image
  //         //move image into public/profile-pic with image name as _id
  //         image.mv('./public/profile-pic/' + result)
  //       }
  //     }
  //   })
});



module.exports = router;
