
const commonHelpers = require("./common-helpers");
const string_collections = require('../config/string-collections');

//object id declaration to compare(string converted to object)
var objectId = require('mongodb').ObjectID;
const { resolve, reject } = require("promise");
const productHelper = require("./product-helper");
const cartHelper = require("./cart-helper");


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
        loginDoc.createdBy = (data.createdBy) ? objectId(data.createdBy) : data.createdBy
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
    userNameCheck: (username) => {
        return new Promise(async (resolve, reject) => {           
            await commonHelpers.doUsernameCheck(username).then((user) => {
                resolve(user)
            }).catch((err) => {
                console.log('userNameCheck Fail', err);
            })
        })
    },
    //changePassward
    changePassward: (data) => {
        return new Promise(async (resolve, reject) => {           
            await commonHelpers.changePassward(data).then((user) => {
                resolve(user)
            }).catch((err) => {
                console.log('changePassward Fail', err);
            })
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
            if(userId){
                loginDoc = { createdBy: objectId(userId), status: 1, state: userState }
            }else{
                loginDoc = {  status: 1, state: userState }
            }
            
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
            if(userId){
            loginDoc = { createdBy: objectId(userId), status: 0, state: userState }
            }else{
                loginDoc = {  status: 0, state: userState }
            }
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
    //check cart  exist or not  
    //based on userid and dealerId
    GetCartExistOrNot: function (data) {
        let findBy = { userId: objectId(data.userId) }
        return new Promise(async (resolve, reject) => {
            await commonHelpers.getFindOneWithId(cartCollectionName, findBy).then((details) => {
                
                if (details) {                   
                    if(details.dealerId == data.dealerId){
                        resolve({result:1})//1 the same dealer
                    }else{
                        resolve({result:2,cartId:details._id})//2 different dealer
                    }
                }
                else {
                    resolve({result:3})//3 nocart
                }
            })

        }).catch((err) => {
            console.log("GetCartExistOrNot ", err);
        })
    },

    //Ajax
    //diplay the user cart items
    cartDetails: function (userId) {

        let data = '<h2>Nocart</h2>'
        return new Promise(async (resolve, reject) => {
            let totals = await cartHelper.getTotalAmount(userId)

            let result = await commonHelpers.getCartProducts(cartCollectionName, { userId: objectId(userId) })

            if (result) { data = '' }else{data='<h1>No cart Details</h1>'}
            for (i in result) {
                data += '  <div class="row  alert alert-info  alert-dismissible ">' +
                    '<button type="button" class="close remove-product" data-toggle="tooltip" data-placement="top" title="Remove Product">' +
                    '<i class="far fa-trash-alt red-text"></i></button>' +
                    ' <div class="col-md-4 col-sm-4 col-4">' +
                    ' <div class="md-form mb-0">' +
                    ' <img src="../products-pic/' + result[i].productImage + '" height="50px" width="50px"' +
                    '  alt="product cart Image" srcset="">' +
                    ' </div>' +
                    ' </div>' +
                    ' <div class="col-md-5 col-sm-5 col-5">' +
                    '<div class="md-form mb-0 ">' +
                    '<h6 class="text-capitalize"> <strong id="pro-name"> ' + result[i].name + ' </strong></h6>' +

                    ' <span class="quantity text-right">' +
                    '<input type="hidden" name="productId" value="' + result[i]._id + '">' +
                    ' <a class="minus-btn"><i class="fas fa-minus "></i></a>' +
                    '<input type="text" name="name" value="'+ result[i].quantity+'" disabled>' +
                    '<a class="plus-btn"><i class="fas fa-plus "></i></a>' +
                    '</span>' +
                    ' </div>' +
                    ' </div>' +
                    ' <div class="col-md-2 col-sm-2 col-2 d-flex justify-content-between">' +

                    ' <div class="md-form mb-0 mx-auto py-3">' +

                    ' <h6>Rs.<span id="price ">' + parseInt(result[i].price) + '<span></h6>' +

                    '  </div>' +
                    ' </div>' +
                    ' </div>'

            }
            _result = { data: data, totals: totals }
            resolve(_result)
        })


    },
    //Ajax
    //Order History
    cartOrderHistory: function (userId) {
        
        return new Promise(async(resolve,reject)=>{
           let orders= await cartHelper.getCartHistory(userId)
          
           if (orders) { data = '' }else{data='<h1>No Order History</h1>'}
            for (i in orders) {
            data += '<div class="row text-grey blue-grey lighten-5  z-depth-1 mx-2 my-3 py-2  ">'+
            ' <div class="col-12 ">'+
              ' <div class=" mb-0 ">'+
                ' <span class=" font-weight-bold " style="float: right;">Order Id.&nbsp; <span'+
                   '  class=" text-truncate "'+
                   ' >'+orders[i].id+'</span>'+
                ' </span>'
                for(j in orders[i].products){
                    data +=  '<p class="text-capitalize m-0 mr-2 pr-1">'+( parseInt(j)+1)+'.<span class="font-weight-bold">'+ orders[i].products[j].name+' </span></p>'
                }
                
                data += '  <hr>'+
                 '<span class="float-right font-weight-bold m-0 " style="float: right;">Total Amount.&nbsp; <span>'+orders[i].totalPrice+'</span>'+
                ' </span>'+
              ' </div>'+
             '</div>'   +  
           '</div>'
           }

           resolve(data)
          
        })
    
    }


    //end export
}


