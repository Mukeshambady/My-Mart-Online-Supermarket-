const { response } = require('express');
var express = require('express');

const dealerHelper = require('../helpers/dealer-helper')
const userHelper = require('../helpers/user-helper')
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
  let data= await dealerHelper.getDealerOpenCloseTotal()
  DealerOpenCloseTotal= { allShops: data[0].allShops, open: data[0].open, close: data[0].close }
  let dealerDetails = await dealerHelper.dealersAllDetail(req.session.user._id)
  res.render('admin/all-dealers', { dealerDetails,DealerOpenCloseTotal, title: 'Admin Home' });
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
  let dealerDetails = await dealerHelper.dealersAllBanDetail(req.session.user._id)
  res.render('admin/ban-list-dealers', { dealerDetails, title: 'Dealers - Ban List ' });
});

//**********Start**User****Functinality***************************************

/* GET dealer/users List page. */
router.get('/users', verifyLogin, async function (req, res, next) {
  let userDetails = await userHelper.AllDetail(false)
  res.render('user/all-users', { title: 'Admin | User List', userDetails });
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
      res.redirect('/admin/add-user')
    } else {
      req.session.usenameExistError = ''
      if (result) {
        req.session.registrationStatus = "User added successfully..";
      }
      res.redirect('/admin/add-user')
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
    res.redirect('/admin/edit-user/' + id)
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
  let userDetails = await userHelper.AllBanDetail(false)
  res.render('user/user-ban-list', { title: 'Admin | User Ban List', userDetails });
});


// ajax
/* POST unbanUser . */
router.post('/unbanUser', async function (req, res, next) {
  await userHelper.BanOrUnban(req.body.id, 1).then((result) => {
    res.json(result)
  })
});


//**********End**User****Functinality***************************************

module.exports = router;

