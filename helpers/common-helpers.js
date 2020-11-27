var db = require('../config/connection')
var COLLECTION_DATA = require('../config/string-collections')
const bcrypt = require('bcrypt')
const { reject, resolve } = require('promise')
//object id declaration to compare(string converted to object)
var object = require('mongodb').ObjectID

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(COLLECTION_DATA.TABLE_COLLECTIONs.login).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            })
        })
    },
    //Login 
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}

            let user = await db.get().collection(COLLECTION_DATA.TABLE_COLLECTIONs.login).findOne({ username: userData.username })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log('login Success');
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("Fail to login");
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("Email Fail to login");
                resolve({ status: false })
            }
        })
    },
    //Login 
    doUsernameCheck: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(COLLECTION_DATA.TABLE_COLLECTIONs.login).findOne({ username: userData })
            if (user) {
                resolve({ status: true })
            } else {
                resolve({ status: false })
            }
        })
    },
    //Insert Once 
    doInsertOne: (docName, colData) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(docName).insertOne(colData).then((data) => {
                resolve(data.ops[0]._id)
            })
        })
    },

    //Find All
     //using promise functionality
     getFind: (docName) => {
        return new Promise(async (resolve, reject) => {
            let docDetails = await db.get().collection(docName).find().toArray()
            resolve(docDetails)
        })
    },


}