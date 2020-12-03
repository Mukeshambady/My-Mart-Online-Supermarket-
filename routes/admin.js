const { response } = require('express');
var express = require('express');

const dealerHelper = require('../helpers/dealer-helper')
var router = express.Router();


let reqest_path = null
//username:"admin",password:"1234"
//middileware useed to check lgged In or Not

const verifyLogin = (req, res, next) => {
  if (req.session.adminloggedIn) {
    next()
  } else {
    res.redirect('/logout')
  }
}


// ************************************************************//

/* GET home page. */
router.get('/', verifyLogin, async function (req, res, next) {
  let dealerDetails = await dealerHelper.dealersAllDetail()
  //console.log(dealerDetails);
  res.render('admin/all-dealers', { dealerDetails, title: 'Admin Home' });
});



/* GET all-dealers page. */
router.get('/all-dealers', verifyLogin, function (req, res, next) {
  res.redirect('/admin');
});


/* GET New-dealers page. */
router.get('/new-dealer', verifyLogin, function (req, res, next) {
  res.render('admin/new-dealer', {
    usenameExistError: req.session.usenameExistError,
    registrationStatus: req.session.registrationStatus,
    title: 'Add New Dealer'
  });
  req.session.usenameExistError = null
  req.session.registrationStatus=null
});


/* POST New-dealers page. */
router.post('/new-dealer', verifyLogin, function (req, res, next) {
  req.body.createdBy = req.session.user._id
  dealerHelper.doInsert(req.body).then((result) => {
    if (result.status) {
      req.session.usenameExistError = 'Username all ready Exist...';
      res.redirect('/admin/new-dealer')
      req.session.usenameExistError=null
    } else {
      req.session.usenameExistError = ''
      if (result) {
        req.session.registrationStatus = "Dealer added successfully..";
      }
      res.redirect('/admin/new-dealer')
      req.session.registrationStatus=null
      if (req.files) {
        //get image file from Form
        let image = req.files.image
        //move image into public/profile-pic with image name as _id
        image.mv('./public/profile-pic/' + result)
      }
    }
  })
});


/* GET edit-dealer with out param page. */
router.get('/edit-dealer', verifyLogin, async function (req, res, next) {
  res.redirect('/admin');
});


/* GET edit-dealer with  param page. */
router.get('/edit-dealer/:id', verifyLogin, async function (req, res, next) {
  let userdata = await dealerHelper.dealerProfile(req.params.id)
  if (req.session.dealerUpdate) {
    res.render('admin/edit-dealer', { title: 'Dealer | Profile Update', userdata, registrationStatus: "Dealer Updated" });
    req.session.dealerUpdate = false
  } else {
    res.render('admin/edit-dealer', { title: 'Dealer | Profile Edit', userdata });
  }
});


/* GET edit-dealer with  param page. */
router.post('/edit-dealer/:id', verifyLogin, async function (req, res, next) {
  delete req.body.username
  id = req.params.id
  let result = await dealerHelper.updateDealer(id, req.body)
  if (req.files) {
    //get image file from Form
    let image = req.files.image
    //move image into public/profile-pic with image name as _id
    image.mv('./public/profile-pic/' + id + '.jpg')
  }
  if (result) {
    req.session.dealerUpdate = true
    res.redirect('/admin/edit-dealer/' + id)
  } else {

  }
});


// ajax
/* POST DELETE-dealer with  param page. */
router.post('/deleteDealer', async function (req, res, next) {
  await dealerHelper.dealerDelete(req.body.id).then((result) => {
    res.json(result)
  })
});


// ajax
/* POST ban-dealer . */
router.post('/banDealer', async function (req, res, next) {
  await dealerHelper.dealerBanOrUnban(req.body.id,0).then((result) => {
    res.json(result)
  })
});
// ajax
/* POST unban-Dealer . */
router.post('/unbanDealer', async function (req, res, next) {
 
  await dealerHelper.dealerBanOrUnban(req.body.id,1).then((result) => {
    res.json(result)
  })
});


/* GET ban-list-dealers page. */
router.get('/ban-list-dealers', verifyLogin, async function (req, res, next) {
  let dealerDetails = await dealerHelper.dealersAllBanDetail()
  res.render('admin/ban-list-dealers', { dealerDetails, title: 'Dealers - Ban List ' });
});


module.exports = router;

