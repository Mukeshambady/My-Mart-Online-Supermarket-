
const commonHelpers = require("./common-helpers");
const string_collections = require('../config/string-collections');

//object id declaration to compare(string converted to object)
var objectId = require('mongodb').ObjectID

let dealerCollectionName = string_collections.TABLE_COLLECTIONs.dealer
let loginCollectionName = string_collections.TABLE_COLLECTIONs.login;

let dealerDoc = string_collections.DEALER_DOC
let loginDoc = string_collections.LOGIN_DOC
let userState=2

module.exports = {

    doInsert: (data) => {
        // string_collections.LOGIN_DOC = {
        //     username: data.username,
        //     password: data.password,
        //     createdBy: objectId(data.createdBy),
        //     state: string_collections.LOGIN_STATES.dealer,
        //     status: 1,
        //     date: new Date()
        // }

        loginDoc.username = data.username
        loginDoc.password = data.password
        loginDoc.createdBy = objectId(data.createdBy)
        loginDoc.state = string_collections.LOGIN_STATES.dealer


        return new Promise(async (resolve, reject) => {
            let userIsExist = await commonHelpers.doUsernameCheck(loginDoc.username)
            if (userIsExist.status) {
                resolve(userIsExist)
            } else {
                delete loginDoc._id
                await commonHelpers.doSignup(loginDoc).then(async (id) => {
                  
                    const userId = await objectId(id._id).toString()
                    // string_collections.DEALER_DOC = {
                    //     _id: objectId(id._id),
                    //     storeName: data.storename,
                    //     email: data.email,
                    //     phoneNumber: data.phoneNumber,
                    //     address: data.address,
                    //     extraInFormation: data.extrainfo,
                    //     profilePicture: id._id + '.jpg',
                    //     date: new Date()
                    // }

                    dealerDoc._id = objectId(userId)
                    dealerDoc.storeName = data.storename
                    dealerDoc.email = data.email
                    dealerDoc.name = data.name
                    dealerDoc.phoneNumber = data.phoneNumber
                    dealerDoc.address = data.address
                    dealerDoc.extraInFormation = data.extrainfo
                    dealerDoc.profilePicture = userId + '.jpg'

                    await commonHelpers.doInsertOne(dealerCollectionName, dealerDoc).then((dealer) => {
                        if (dealer)
                            result = dealer.profilePicture
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
    //update Dealer
    updateDealer: (id, data) => {
        return new Promise(async (resolve, reject) => {

            const userId = objectId(id).toString()
            dealerDoc = {
                _id: { _id: objectId(userId) }
                , storeName: data.storename
                , email: data.email
                , name: data.name
                , phoneNumber: data.phoneNumber
                , address: data.address
                , extraInFormation: data.extrainfo
                , profilePicture: userId + '.jpg'
                , date: new Date()
            }
            await commonHelpers.doUpdateOne(dealerCollectionName, dealerDoc).then((dealer) => {
                resolve(dealer)
            }).catch((err) => {
                console.log('Registration Fail', err);
            })
        })
    },
   

    // Get All dealers--Active--UNBAN
    getAllDealers: function () {
        return new Promise(async (resolve, reject) => {
            // getFindAllDetails: (docName, status,state)
            loginDoc={status:1,state:userState}
            await commonHelpers.getFindAllDetails(dealerCollectionName,loginDoc).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('Dealer Details Fetch error ', err)
                reject()
            })
        })
    },
    //All dealers--Active--UNBAN
    dealersAllDetail: function (userId) {
        return new Promise(async (resolve, reject) => {
            // getFindAllDetails: (docName, status,state)
            loginDoc={createdBy:objectId(userId),status:1,state:userState}
            await commonHelpers.getFindAllDetails(dealerCollectionName,loginDoc).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('Dealer Details Fetch error ', err)
                reject()
            })
        })
    },
    //All dealers---BAN
    dealersAllBanDetail: function (userId) {
        return new Promise(async (resolve, reject) => {
            loginDoc={createdBy:objectId(userId),status:0,state:userState}
            await commonHelpers.getFindAllDetails(dealerCollectionName,loginDoc).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('Dealer Details Fetch error ', err)
                reject()
            })
        })
    },
    //find asingle dealer / his profile by _id
    dealerProfile: function (userId) {

        dealerDoc = { _id: objectId(userId) }
        return new Promise(async (resolve, reject) => {
            await commonHelpers.getFindOne(dealerCollectionName, dealerDoc).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('Dealer Details Fetch error ', err)
                reject()
            })
        })
    },
    //dealerDelete  by _id bot login and dealer
    dealerDelete: function (userId) {
        dealerDoc = { _id: objectId(userId) }
        return new Promise(async (resolve, reject) => {
            await commonHelpers.doFindOneAndDelete(string_collections.TABLE_COLLECTIONs.login, dealerDoc)
            await commonHelpers.doFindOneAndDelete(dealerCollectionName, dealerDoc).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('Dealer Details findOneAndDelete error ', err)
                reject()
            })
        })
    },
    //dealerBanOrUnban by _id
    dealerBanOrUnban: function (userId, status) {
        loginDoc = { _id: { _id: objectId(userId) }, status: status }
        return new Promise(async (resolve, reject) => {
            await commonHelpers.doUpdateOne(loginCollectionName, loginDoc).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('Dealer Details dealerBan error ', err)
                reject()
            })
        })
    },
   
 //openingAndClosingtime set
 setTiming:function(data){
    orderDoc={_id:{ _id: objectId(data.dealerId) },openingAndClosingtime:{ openingTime: data.openingtime, closingTime:data.closingtime }}
    console.log(orderDoc);
    return new Promise((resolve,reject)=>{
        commonHelpers.doUpdateOne(dealerCollectionName,orderDoc).then((value)=>{
            resolve(value)
        })
       
    })
},
 //get openingAndClosingtime
 getTiming:function(id){
    return new Promise((resolve,reject)=>{
        commonHelpers. getFindOnewithId(dealerCollectionName, {_id: objectId(id)}).then((value)=>{
            resolve(value)
        })
       
    })
},
  
//end export
}


