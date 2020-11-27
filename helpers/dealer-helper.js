
const commonHelpers = require("./common-helpers");
const string_collections = require('../config/string-collections');
const { response } = require("express");
const { resolve, reject } = require("promise");
const { NotExtended } = require("http-errors");
//object id declaration to compare(string converted to object)
var objectId = require('mongodb').ObjectID

module.exports = {

    doInsert: (data) => {
        string_collections.LOGIN_DOC = {
            username: data.username,
            password: data.password,
            createdBy: objectId(data.createdBy),
            state: string_collections.LOGIN_STATES.dealer,
            status: 1,
            date: new Date()
        }

        console.log(string_collections.LOGIN_DOC);
        return new Promise(async (resolve, reject) => {
            let userIsExist = await commonHelpers.doUsernameCheck(string_collections.LOGIN_DOC.username)

            if (userIsExist.status) {
                resolve(userIsExist)
            } else {
               
                await commonHelpers.doSignup(string_collections.LOGIN_DOC).then(async (id) => {
                   
                    string_collections.DEALER_DOC = {
                        id: objectId(id._id),
                        storeName: data.storename,
                        email: data.email,
                        phoneNumber: data.phoneNumber,
                        address: data.address,
                        extraInFormation: data.extrainfo,
                        profilePicture: id._id+'.jpg',
                        date: new Date()
                    }
                    await commonHelpers.doInsertOne(string_collections.TABLE_COLLECTIONs.dealer, string_collections.DEALER_DOC).then((dealer) => {
                        if(dealer)
                        resolve(string_collections.DEALER_DOC.id)
                    }).catch((err) => {
                        console.log('Registration Fail', err);
                    })

                }).catch((err) => {
                    console.log('Signeup Fail', err);
                })
            }


        })
    },
    dealerDetails:function(){
        return new Promise(async(resolve,reject)=>{
            await commonHelpers.getFind(string_collections.TABLE_COLLECTIONs.dealer).then((data)=>{
                resolve(data)
            }).catch((err)=>{
                console.log('Dealer Details Fetch error ', err )
                reject()
            })
        })
    }
}
