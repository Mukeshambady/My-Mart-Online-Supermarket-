
const commonHelpers = require("./common-helpers");
const string_collections = require('../config/string-collections');

//object id declaration to compare(string converted to object)
var objectId = require('mongodb').ObjectID

let userCollectionName = string_collections.TABLE_COLLECTIONs.user
let loginCollectionName = string_collections.TABLE_COLLECTIONs.login;
let cartCollectionName = string_collections.TABLE_COLLECTIONs.cart
let userDoc = string_collections.USER_DOC
let loginDoc = string_collections.LOGIN_DOC
let userState = 1

module.exports = {

    doInsert: (data) => {
        loginDoc.username = data.username
        loginDoc.password = data.password       
        loginDoc.createdBy =  (data.createdBy)? objectId(data.createdBy):data.createdBy
        loginDoc.state = string_collections.LOGIN_STATES.user


        return new Promise(async (resolve, reject) => {
            let userIsExist = await commonHelpers.doUsernameCheck(loginDoc.username)
            if (userIsExist.status) {
                resolve(userIsExist)
            } else {
                delete loginDoc._id
                await commonHelpers.doSignup(loginDoc).then(async (id) => {
                    const userId = await objectId(id._id).toString()
                    userDoc._id = objectId(userId)
                    userDoc.name = data.name.trim()
                    userDoc.email = data.email.trim()
                    userDoc.phoneNumber = data.phoneNumber.trim()
                    userDoc.address = data.address.trim()
                    userDoc.profilePicture = userId + '.jpg'
                    await commonHelpers.doInsertOne(userCollectionName, userDoc).then((user) => {
                        if (user)
                            result = user.profilePicture
                        resolve(result)
                    }).catch((err) => {
                        console.log('Registration Fail', err);
                    })

                }).catch((err) => {
                    console.log('Signeup Fail', err);
                })
            }
        })
    },
    //update User
    update: (id, data) => {
        return new Promise(async (resolve, reject) => {

            const userId = objectId(id).toString()
            userDoc = {
                _id: { _id: objectId(userId) },
                name: data.name.trim(),
                email: data.email.trim(),
                phoneNumber: data.phoneNumber.trim(),
                address: data.address.trim(),
                profilePicture: userId + '.jpg',
                date: new Date()

            }
            await commonHelpers.doUpdateOne(userCollectionName, userDoc).then((user) => {
                resolve(user)
            }).catch((err) => {
                console.log('update User Fail', err);
            })
        })
    },


    //All User--Active--UNBAN
    AllDetail: function (userId) {
        return new Promise(async (resolve, reject) => {
            loginDoc = { createdBy: objectId(userId), status: 1, state: userState }
            await commonHelpers.getFindAllDetails(userCollectionName, loginDoc).then((data) => {

                resolve(data)
            }).catch((err) => {
                console.log('User Details Fetch error ', err)
                reject(false)
            })
        })
    },
    //All User---BAN
    AllBanDetail: function (userId) {
        return new Promise(async (resolve, reject) => {
            loginDoc = { createdBy: objectId(userId), status: 0, state: userState }
            await commonHelpers.getFindAllDetails(userCollectionName, loginDoc).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('User Details Fetch error ', err)
                reject(false)
            })
        })
    },
    //find asingle User / his profile by _id
    Profile: function (userId) {

        userDoc = { _id: objectId(userId) }
        return new Promise(async (resolve, reject) => {
            await commonHelpers.getFindOne(userCollectionName, userDoc).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('User Details Fetch error ', err)
                reject(false)
            })
        })
    },
    //user Delete  by _id bot login and user
    Delete: function (userId) {
        userDoc = { _id: objectId(userId) }
        return new Promise(async (resolve, reject) => {
            await commonHelpers.doFindOneAndDelete(string_collections.TABLE_COLLECTIONs.login, userDoc)
            await commonHelpers.doFindOneAndDelete(userCollectionName, userDoc).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('User Details findOneAndDelete error ', err)
                reject(false)
            })
        })
    },
    //User BanOrUnban by _id
    BanOrUnban: function (userId, status) {
        loginDoc = { _id: { _id: objectId(userId) }, status: status }
        return new Promise(async (resolve, reject) => {
            await commonHelpers.doUpdateOne(loginCollectionName, loginDoc).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('User BanOrUnban error ', err)
                reject(false)
            })
        })
    },

    //Ajax
    //diplay the user cart items
    cartDetails: function (userId) {

        let data = '<h2>Nocart</h2>'
        return new Promise(async (resolve, reject) => {
            let result = await commonHelpers.getCartProducts(cartCollectionName, { userId: objectId(userId) })
            
           if( result){data=''}
            for (i in result){
           
                data += '<div class="media rounded alert alert-primary alert-dismissible">' +
                    ' <button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<div class="media-body py-1 ">' +
                    '<div class="row">' +
                    '<div class="col-md-2 d-flex  align-middle ">' +
                    '                  <img src="../products-pic/' + result[i].productImage + '" height="50px" width="50px" alt="product cart Image"' +
                    'srcset="">' +

                    ' </div>' +

                    '<div class="col-md-10  ">' +
                    '  <div class="row">' +

                    '<div class="col-md-6  ">' +
                    
                    ' <h6 class="text-capitalize"> <strong id="pro-name"> ' + result[i].name + ' </strong></h6>' +
                    ' <div class="quantity">' +
                    '<input type="hidden"  name="productId" value="' + result[i]._id + '"></input>'+
                    ' <button class="minus-btn " type="button" name="button"><i class="fas fa-minus"></i></button>' +
                    '<input type="text"  name="name" value="' + result[i].quantity + '" disabled>' +
                    '<button class="plus-btn" type="button" name="button"><i class="fas fa-plus"></i></button>' +
                    '  </div>' +
                    ' </div>' +
                    '  <div class="col-md-6  ">' +
                    '  <div class="d-flex justify-content-bottom">' +
                    '  <h6 class="float-right ">Rs.<span id="price">'+parseInt( result[i].price)+'<span></h6>' +
                    ' </div>' +
                    ' </div>' +
                    '  </div>' +

                    '  </div>' +

                    ' </div>' +

                    '</div>' +
                    '</div>'

            }


            resolve(data)
        })




    },
    //Ajax
    //Order History
    cartOrderHistory: function () {
        data = '<div class="row justify-content-between z-depth-1 mx-1 my-1">' +
            ' <div class="col-md-6">' +
            '  <p>1. Apple</p>' +
            '  <p>1. Banana</p>' +
            '  </div>' +
            '  <div class="col-md-6 text-right">' +
            '  <p>no1</p>' +
            '   <p>Total: 123</p>' +
            '   </div>' +
            '  </div>'

        return data
    }


    //end export
}


