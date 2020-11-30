
const commonHelpers = require("./common-helpers");
const string_collections = require('../config/string-collections');
const { response } = require("express");
const { resolve, reject } = require("promise");
const { NotExtended } = require("http-errors");
//object id declaration to compare(string converted to object)
var objectId = require('mongodb').ObjectID


let dealerDoc = string_collections.DEALER_DOC

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

        loginDoc = string_collections.LOGIN_DOC
        loginDoc.username = data.username
        loginDoc.password = data.password
        loginDoc.createdBy = objectId(data.createdBy)
        loginDoc.state = string_collections.LOGIN_STATES.dealer


        return new Promise(async (resolve, reject) => {
            let userIsExist = await commonHelpers.doUsernameCheck(loginDoc.username)
            if (userIsExist.status) {
                resolve(userIsExist)
            } else {
                await commonHelpers.doSignup(loginDoc).then(async (id) => {
                    const userId = objectId(id._id).toString()
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
                    dealerDoc.phoneNumber = data.phoneNumber
                    dealerDoc.address = data.address
                    dealerDoc.extraInFormation = data.extrainfo
                    dealerDoc.profilePicture = userId + '.jpg'
                    await commonHelpers.doInsertOne(string_collections.TABLE_COLLECTIONs.dealer, dealerDoc).then((dealer) => {
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
                , phoneNumber: data.phoneNumber
                , address: data.address
                , extraInFormation: data.extrainfo
                , profilePicture: userId + '.jpg'
                , date: new Date()
            }
            await commonHelpers.doUpdateOne(string_collections.TABLE_COLLECTIONs.dealer, dealerDoc).then((dealer) => {
               resolve(dealer)
            }).catch((err) => {
                console.log('Registration Fail', err);
            })
        })
    },

    //All dealers
    dealersAllDetail: function () {
        return new Promise(async (resolve, reject) => {
            await commonHelpers.getFind(string_collections.TABLE_COLLECTIONs.dealer).then((data) => {
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
            await commonHelpers.getFindOne(string_collections.TABLE_COLLECTIONs.dealer, dealerDoc).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('Dealer Details Fetch error ', err)
                reject()
            })
        })
    },
}
