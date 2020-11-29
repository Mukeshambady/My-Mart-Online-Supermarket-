const { response } = require('express');
var express = require('express');
const commonHelpers = require('../helpers/common-helpers');
const dealerHelper = require('../helpers/dealer-helper')
var router = express.Router();


let reqest_path = null
//username:"admin",password:"1234"
//middileware useed to check lgged In or Not

const verifyLogin = (req, res, next) => {
 
  if (req.session.loggedIn) {
    next()
  } else {
   
    res.redirect('/admin/login')
  }
}


// ************************************************************//

/* GET home page. */
router.get('/', verifyLogin,async function (req, res, next) {
  let dealerDetails = await dealerHelper.dealerDetails()
  //console.log(dealerDetails);
  res.render('admin/all-dealers', {dealerDetails});
});

/* GET Login page. */
router.get('/login', function (req, res, next) {

  if (req.session.loggedIn) {
    res.redirect('/admin')
  } else {
    res.render('admin/login', { layout: false, 'loginError': req.session.loginError });
    req.session.loginError = false
  }
});

/* Post Login page. */
router.post('/login', function (req, res, next) {
  commonHelpers.doLogin(req.body).then((response) => {
    
    if (response.status) {
      req.session.loggedIn = true
      req.session.admin = response.user
      res.redirect('/admin')
    } else {
      req.session.loginError = 'Invalid Username or Password'
      req.session.loggedIn = false
      res.redirect('/admin/login')
    }
  })
});

/* GET Logout page. and session distroy*/
router.get('/logout', (req, res) => {
  req.session.loggedIn = false
  req.session.destroy()
  res.redirect('/admin/login')
})

/* GET all-dealers page. */
router.get('/all-dealers', verifyLogin,  function (req, res, next) {
  res.redirect('/admin');
});

/* GET New-dealers page. */
router.get('/new-dealer',verifyLogin, function (req, res, next) {

  res.render('admin/new-dealer',{
    usenameExistError:req.session.usenameExistError,
    registrationStatus: req.session.registrationStatus
  });
  req.session.usenameExistError=null
});

/* POST New-dealers page. */
router.post('/new-dealer', verifyLogin, function (req, res, next) {
  req.body.createdBy=req.session.admin._id
  dealerHelper.doInsert(req.body).then((result) => {
    
    if (result.status) {
      req.session.usenameExistError = 'Username all ready Exist...';
      res.redirect('/admin/new-dealer')
    } else {
      req.session.usenameExistError=''
   
      if(result){
        req.session.registrationStatus = "Dealer added successfully..";
      }
      res.redirect('/admin/new-dealer')
      if (req.files) {
        //get image file from Form
        let image = req.files.image
        //move image into public/profile-pic with image name as _id
        image.mv('./public/profile-pic/' + result)
      }
    }
  })
});

/* GET ban-list-dealers page. */
router.get('/ban-list-dealers', verifyLogin, async function (req, res, next) {
  let dealerDetails = await dealerHelper.dealerDetails()
  res.render('admin/ban-list-dealers',{dealerDetails});
});

module.exports = router;
