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
  res.render('dealer/dashboard', { title: 'Dealer | Dash-Board' });
});



/* GET all-dealers page. */
router.get('/profile', verifyLogin, async function (req, res, next) {
  let userdata = await dealerHelper.dealerProfile(req.session.user._id)
  res.render('dealer/profile', { title: 'Dealer | Profile',userdata });
   
});

/* GET New-USER page. */
router.get('/new-user', verifyLogin, function (req, res, next) {
  res.send('new user')
  //   res.render('admin/new-dealer',{
  //     usenameExistError:req.session.usenameExistError,
  //     registrationStatus: req.session.registrationStatus,
  //     title:'Add New Dealer'
  //   });
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
