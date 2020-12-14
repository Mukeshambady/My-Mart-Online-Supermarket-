
const commonHelpers = require("./common-helpers");
const string_collections = require('../config/string-collections');

//object id declaration to compare(string converted to object)
var objectId = require('mongodb').ObjectID

let userCollectionName = string_collections.TABLE_COLLECTIONs.user
let loginCollectionName = string_collections.TABLE_COLLECTIONs.login;

let userDoc = string_collections.USER_DOC
let loginDoc = string_collections.LOGIN_DOC
let userState=1

module.exports = {

    doInsert: (data) => {
        loginDoc.username = data.username
        loginDoc.password = data.password
        loginDoc.createdBy = objectId(data.createdBy)
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
                name : data.name.trim(),
                email : data.email.trim(),
                phoneNumber : data.phoneNumber.trim(),
                address : data.address.trim(),
                profilePicture : userId + '.jpg',
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
            loginDoc={createdBy:objectId(userId),status:1,state:userState}
            await commonHelpers.getFindAllDetails(userCollectionName,loginDoc ).then((data) => {
               
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
            loginDoc={createdBy:objectId(userId),status:0,state:userState}
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
    cartDetails: function (){
       data= '<table class="table table-hover">'+
        '<thead>'+
        '  <tr>'+
            '<th>#</th>'+
           ' <th>Product name</th>'+
           ' <th>Price</th>'+
          '  <th>Remove</th>'+
        '  </tr>'+
      '  </thead>'+
     ' <tbody>'+
     ' <tr>'+
      '  <th scope="row">1</th>'+
       ' <td>Product 1</td>'+
       ' <td>100$</td>'+
     '   <td><a><i class="fas fa-times"></i></a></td>'+
     ' </tr>'+
     ' </tbody>'+
       ' </table>'
      
        return data
    },
    //Ajax
    //Order History
    cartOrderHistory: function (){
       data=  '<div class="row justify-content-between z-depth-1 mx-1 my-1">'+
      ' <div class="col-md-6">'+
       '  <p>1. Apple</p>'+
       '  <p>1. Banana</p>'+
     '  </div>'+
     '  <div class="col-md-6 text-right">'+
       '  <p>no1</p>'+
      '   <p>Total: 123</p>'+
    '   </div>'+
 '  </div>'
      
        return data
    }


    //end export
}


